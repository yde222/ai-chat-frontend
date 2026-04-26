'use client';

import { create } from 'zustand';
import { ChatMessage, Character, StoryChoice, UsageWarning } from '@/types';
import { getSocket } from '@/lib/socket';

interface AffinityData {
  affinity: number;
  delta: number;
  level: string;
  levelChanged: boolean;
  isFirstToday: boolean;
  streak: number;
}

interface ChatState {
  messages: ChatMessage[];
  sessionId: string | null;
  isConnected: boolean;
  isStreaming: boolean;
  currentEmotion: string;

  // 호감도
  affinityData: AffinityData | null;
  showAffinityPopup: boolean;

  // 선택지
  pendingChoices: StoryChoice[] | null;

  // 수익화: 사용량 추적
  dailyUsage: { used: number; total: number; isPremium: boolean };
  usageWarning: UsageWarning | null;

  connect: (userId: string, character: Character) => void;
  sendMessage: (text: string) => void;
  selectChoice: (choice: StoryChoice) => void;
  disconnect: () => void;
  dismissAffinityPopup: () => void;
  dismissUsageWarning: () => void;
}

/**
 * 선택지 풀 — 감정별 템플릿
 * 서버에서 받기 전까지 클라이언트에서 생성 (Phase 1)
 */
const CHOICE_POOL: Record<string, StoryChoice[]> = {
  JOY: [
    { id: 'j1', text: '나도 기분 좋아졌어', emoji: '😊', effect: 'positive', affinityHint: '호감 UP' },
    { id: 'j2', text: '그렇구나, 다행이다', emoji: '🙂', effect: 'neutral', affinityHint: '' },
    { id: 'j3', text: '음... 그래?', emoji: '🤔', effect: 'negative', affinityHint: '' },
  ],
  AFFECTION: [
    { id: 'a1', text: '너랑 있으면 나도 행복해', emoji: '💕', effect: 'positive', affinityHint: '호감 UP' },
    { id: 'a2', text: '고마워, 그 마음이 좋다', emoji: '✨', effect: 'neutral', affinityHint: '' },
    { id: 'a3', text: '좀 오버하는 거 아니야?', emoji: '😅', effect: 'negative', affinityHint: '호감 DOWN' },
  ],
  SADNESS: [
    { id: 's1', text: '괜찮아? 내가 도와줄까?', emoji: '🤗', effect: 'positive', affinityHint: '호감 UP' },
    { id: 's2', text: '힘든 일 있었구나...', emoji: '😢', effect: 'neutral', affinityHint: '' },
    { id: 's3', text: '에이, 별거 아닐 거야', emoji: '😒', effect: 'negative', affinityHint: '호감 DOWN' },
  ],
  SHY: [
    { id: 'sh1', text: '귀엽다... 왜 그렇게 빨개져?', emoji: '😏', effect: 'positive', affinityHint: '호감 UP' },
    { id: 'sh2', text: '나도 좀 쑥스러워졌어', emoji: '😊', effect: 'neutral', affinityHint: '' },
    { id: 'sh3', text: '왜 그래, 무슨 일 있어?', emoji: '❓', effect: 'neutral', affinityHint: '' },
  ],
  ANGER: [
    { id: 'ag1', text: '내가 옆에 있을게. 언제든.', emoji: '💪', effect: 'positive', affinityHint: '호감 UP' },
    { id: 'ag2', text: '천천히 얘기해줘', emoji: '🫂', effect: 'neutral', affinityHint: '' },
    { id: 'ag3', text: '그건 네 잘못 아니야?', emoji: '😐', effect: 'negative', affinityHint: '호감 DOWN' },
  ],
  EXCITEMENT: [
    { id: 'e1', text: '와, 같이 신나는데?!', emoji: '🔥', effect: 'positive', affinityHint: '호감 UP' },
    { id: 'e2', text: '오, 좋은데?', emoji: '👍', effect: 'neutral', affinityHint: '' },
    { id: 'e3', text: '좀 진정해...', emoji: '😅', effect: 'negative', affinityHint: '' },
  ],
  NEUTRAL: [
    { id: 'n1', text: '더 자세히 알려줘', emoji: '👀', effect: 'neutral', affinityHint: '' },
    { id: 'n2', text: '나도 비슷한 경험이 있어', emoji: '💬', effect: 'positive', affinityHint: '호감 UP' },
    { id: 'n3', text: '음, 그렇구나', emoji: '🙂', effect: 'neutral', affinityHint: '' },
  ],
};

// 선택지 등장 주기 (턴 수)
const CHOICE_INTERVAL = 3;
let turnCount = 0;

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  sessionId: null,
  isConnected: false,
  isStreaming: false,
  currentEmotion: 'NEUTRAL',
  affinityData: null,
  showAffinityPopup: false,
  pendingChoices: null,
  dailyUsage: { used: 0, total: 30, isPremium: false },
  usageWarning: null,

  connect: (userId: string, character: Character) => {
    const socket = getSocket();
    turnCount = 0;

    socket.connect();

    socket.on('connect', () => {
      set({ isConnected: true });
      socket.emit('join_session', {
        userId,
        characterId: character.id,
      });
    });

    socket.on('session_joined', (data: any) => {
      set({
        sessionId: data.sessionId,
        messages: [{
          messageId: 'greeting',
          role: 'assistant',
          content: character.greeting,
          emotion: 'NEUTRAL',
          timestamp: Date.now(),
        }],
      });
    });

    socket.on('chat_chunk', (data: any) => {
      const { content: chunk, isFinal, emotion, choices: serverChoices } = data;

      if (isFinal) {
        turnCount++;
        const emotionStr = emotion || 'NEUTRAL';

        set((state) => {
          const msgs = [...state.messages];
          const lastMsg = msgs[msgs.length - 1];
          if (lastMsg && lastMsg.role === 'assistant' && lastMsg.isStreaming) {
            lastMsg.isStreaming = false;
            lastMsg.emotion = emotionStr;

            // 3턴마다 선택지 부착 — 서버에서 생성한 맥락 기반 선택지 우선 사용
            if (turnCount % CHOICE_INTERVAL === 0) {
              if (serverChoices && serverChoices.length > 0) {
                // LLM이 대화 맥락에 맞게 생성한 선택지
                lastMsg.choices = serverChoices;
              } else {
                // fallback: 정적 감정 기반 선택지
                const pool = CHOICE_POOL[emotionStr] || CHOICE_POOL.NEUTRAL;
                lastMsg.choices = pool.map((c) => ({
                  ...c,
                  id: `${c.id}_${Date.now()}`,
                }));
              }
            }
          }
          return {
            messages: msgs,
            isStreaming: false,
            currentEmotion: emotionStr,
          };
        });
        return;
      }

      set((state) => {
        const msgs = [...state.messages];
        const lastMsg = msgs[msgs.length - 1];

        if (lastMsg && lastMsg.role === 'assistant' && lastMsg.isStreaming) {
          lastMsg.content += chunk;
          return { messages: msgs };
        }

        return {
          messages: [
            ...msgs,
            {
              messageId: `ai-${Date.now()}`,
              role: 'assistant',
              content: chunk || '',
              timestamp: Date.now(),
              isStreaming: true,
            },
          ],
          isStreaming: true,
        };
      });
    });

    // 호감도 업데이트 이벤트
    socket.on('affinity_update', (data: AffinityData) => {
      set({
        affinityData: data,
        showAffinityPopup: true,
      });
      setTimeout(() => {
        set({ showAffinityPopup: false });
      }, 3000);
    });

    socket.on('error', (err: any) => {
      console.error('Socket error:', err);
    });

    socket.on('disconnect', () => {
      set({ isConnected: false });
    });
  },

  sendMessage: (text: string) => {
    const socket = getSocket();
    const state = get();

    if (!state.isConnected || state.isStreaming) return;

    // 사용량 체크 (FREE 유저만)
    const { dailyUsage } = state;
    if (!dailyUsage.isPremium && dailyUsage.used >= dailyUsage.total) {
      set({
        usageWarning: {
          type: 'hard_limit',
          remaining: 0,
          total: dailyUsage.total,
          message: `오늘의 무료 대화 ${dailyUsage.total}회를 모두 사용했어요.`,
        },
      });
      return;
    }

    const userMsg: ChatMessage = {
      messageId: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    // 사용량 증가 + 소프트 경고 체크
    const newUsed = dailyUsage.used + 1;
    const usageRatio = newUsed / dailyUsage.total;
    let warning: UsageWarning | null = null;

    if (!dailyUsage.isPremium && usageRatio >= 0.7 && usageRatio < 1) {
      warning = {
        type: 'soft_limit',
        remaining: dailyUsage.total - newUsed,
        total: dailyUsage.total,
        message: `남은 대화: ${dailyUsage.total - newUsed}회`,
      };
    }

    set((state) => ({
      messages: [...state.messages, userMsg],
      pendingChoices: null,
      dailyUsage: { ...state.dailyUsage, used: newUsed },
      usageWarning: warning,
    }));

    socket.emit('send_message', { message: text });
  },

  selectChoice: (choice: StoryChoice) => {
    const socket = getSocket();
    const state = get();

    if (!state.isConnected || state.isStreaming) return;

    // 선택된 메시지에 selectedChoiceId 표시
    set((state) => {
      const msgs = state.messages.map((msg) => {
        if (msg.choices?.some((c) => c.id === choice.id)) {
          return { ...msg, selectedChoiceId: choice.id };
        }
        return msg;
      });
      return { messages: msgs, pendingChoices: null };
    });

    // 선택지 텍스트를 유저 메시지로 전송
    socket.emit('select_choice', {
      choiceId: choice.id,
      choiceText: choice.text,
    });

    // 약간의 딜레이 후 선택지 텍스트를 메시지로 전송
    setTimeout(() => {
      const userMsg: ChatMessage = {
        messageId: `choice-${Date.now()}`,
        role: 'user',
        content: choice.text,
        timestamp: Date.now(),
      };

      set((state) => ({
        messages: [...state.messages, userMsg],
      }));

      socket.emit('send_message', { message: choice.text });
    }, 700);
  },

  disconnect: () => {
    const socket = getSocket();
    socket.disconnect();
    turnCount = 0;
    set({
      messages: [],
      sessionId: null,
      isConnected: false,
      isStreaming: false,
      affinityData: null,
      showAffinityPopup: false,
      pendingChoices: null,
      usageWarning: null,
    });
  },

  dismissAffinityPopup: () => {
    set({ showAffinityPopup: false });
  },

  dismissUsageWarning: () => {
    set({ usageWarning: null });
  },
}));
