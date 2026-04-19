'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useChatStore } from '@/stores/chat-store';
import { characters } from '@/lib/characters';
import ChatBubble from '@/components/chat/ChatBubble';
import ChatInput from '@/components/chat/ChatInput';
import AffinityPopup from '@/components/chat/AffinityPopup';
import CharacterAvatar from '@/components/character/CharacterAvatar';
import UsageIndicator from '@/components/monetization/UsageIndicator';
import UpgradePrompt from '@/components/monetization/UpgradePrompt';
import { ArrowLeft, Heart } from 'lucide-react';

const LEVEL_LABELS: Record<string, string> = {
  STRANGER: '낯선 사이',
  ACQUAINTANCE: '아는 사이',
  FRIEND: '친한 사이',
  CLOSE: '가까운 사이',
  INTIMATE: '특별한 사이',
  SOULMATE: '운명의 상대',
};

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const characterId = params.characterId as string;
  const character = characters.find((c) => c.id === characterId);

  const {
    messages,
    isConnected,
    isStreaming,
    currentEmotion,
    affinityData,
    showAffinityPopup,
    dailyUsage,
    usageWarning,
    connect,
    sendMessage,
    selectChoice,
    disconnect,
    dismissAffinityPopup,
    dismissUsageWarning,
  } = useChatStore();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (character && session?.user?.id) {
      connect(session.user.id, character);
    }
    return () => {
      disconnect();
    };
  }, [characterId, session?.user?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!character) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">캐릭터를 찾을 수 없습니다.</p>
      </div>
    );
  }

  const emotionEmoji: Record<string, string> = {
    NEUTRAL: '', JOY: '😊', SADNESS: '😢', ANGER: '😤',
    SURPRISE: '😮', AFFECTION: '🥰', FEAR: '😰',
    DISGUST: '😒', EXCITEMENT: '✨', SHY: '😳',
  };

  const displayAffinity = affinityData?.affinity ?? character.affinity;
  const displayLevel = affinityData?.level ?? 'STRANGER';

  return (
    <div className="h-screen flex flex-col">
      {/* 호감도 팝업 */}
      {affinityData && (
        <AffinityPopup
          data={affinityData}
          visible={showAffinityPopup}
          onDismiss={dismissAffinityPopup}
        />
      )}

      {/* 사용량 경고 */}
      {usageWarning?.type === 'soft_limit' && (
        <UpgradePrompt
          trigger="soft_warning"
          remaining={usageWarning.remaining}
          total={usageWarning.total}
          onDismiss={dismissUsageWarning}
          onUpgrade={() => {
            alert('프리미엄 결제 페이지로 이동합니다. (Phase 2)');
            dismissUsageWarning();
          }}
        />
      )}

      {/* 대화 제한 도달 모달 */}
      {usageWarning?.type === 'hard_limit' && (
        <UpgradePrompt
          trigger="daily_limit"
          remaining={0}
          total={dailyUsage.total}
          onDismiss={dismissUsageWarning}
          onUpgrade={() => {
            alert('프리미엄 결제 페이지로 이동합니다. (Phase 2)');
            dismissUsageWarning();
          }}
        />
      )}

      {/* 채팅 헤더 */}
      <header className="flex-shrink-0 border-b border-gray-800 bg-gray-950/90 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => { disconnect(); router.push('/'); }}
            className="p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-400" />
          </button>

          <div className="flex items-center gap-3 flex-1">
            <CharacterAvatar
              characterId={character.id}
              emotion={currentEmotion}
              size="sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-white">{character.name}</h2>
                {currentEmotion && emotionEmoji[currentEmotion] && (
                  <span className="text-sm">{emotionEmoji[currentEmotion]}</span>
                )}
              </div>
              <p className="text-xs text-gray-500">
                {isConnected
                  ? isStreaming
                    ? '입력 중...'
                    : LEVEL_LABELS[displayLevel] || '온라인'
                  : '연결 중...'}
              </p>
            </div>
          </div>

          {/* 사용량 인디케이터 + 호감도 */}
          <div className="flex items-center gap-2">
            <UsageIndicator
              used={dailyUsage.used}
              total={dailyUsage.total}
              isPremium={dailyUsage.isPremium}
            />
            <div className="flex items-center gap-1 text-xs text-pink-400 bg-pink-500/10 rounded-full px-2.5 py-1 transition-all">
              <Heart
                size={12}
                fill={displayAffinity >= 50 ? '#ec4899' : 'none'}
                className="transition-all"
              />
              <span className="font-medium tabular-nums">{displayAffinity}%</span>
            </div>
          </div>
        </div>
      </header>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((msg) => (
            <ChatBubble
              key={msg.messageId}
              message={msg}
              characterAvatar={character.avatar}
              onSelectChoice={selectChoice}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 입력 */}
      <ChatInput
        onSend={sendMessage}
        disabled={isStreaming || !isConnected || (usageWarning?.type === 'hard_limit')}
      />
    </div>
  );
}
