export interface Character {
  id: string;
  name: string;
  nameEn: string;
  age: number;
  personality: string;
  description: string;
  greeting: string;
  avatar: string;
  avatarImage?: string; // SVG 일러스트 경로
  coverImage: string;
  tags: string[];
  affinity: number;
  genre: 'romance' | 'fantasy' | 'slice-of-life';
  isPremium?: boolean;
}

// 수익화 관련 타입
export interface SubscriptionInfo {
  plan: 'free' | 'premium_monthly' | 'premium_yearly';
  isPremium: boolean;
  dailyLimit: number;
  todayUsed: number;
  todayRemaining: number;
  features: string[];
}

export interface UsageWarning {
  type: 'soft_limit' | 'hard_limit';
  remaining: number;
  total: number;
  message: string;
}

export interface ChatMessage {
  messageId: string;
  role: 'user' | 'assistant';
  content: string;
  emotion?: string;
  timestamp: number;
  isStreaming?: boolean;
  choices?: StoryChoice[];
  selectedChoiceId?: string;
}

export interface StoryChoice {
  id: string;
  text: string;
  emoji?: string;
  effect: 'positive' | 'neutral' | 'negative';
  affinityHint?: string; // "호감도 UP" 같은 힌트 텍스트
}

export type EmotionTag =
  | 'NEUTRAL'
  | 'JOY'
  | 'SADNESS'
  | 'ANGER'
  | 'SURPRISE'
  | 'AFFECTION'
  | 'FEAR'
  | 'DISGUST'
  | 'EXCITEMENT'
  | 'SHY';

// ============================================================
// 11순위: 스토리 모드 + 유저 페르소나
// ============================================================

export interface UserPersona {
  id: string;
  name: string;
  gender: 'male' | 'female' | 'unset';
  settings: string | null;
  avatarUrl: string | null;
  isDefault: boolean;
}

// 내러티브 블록 — LLM 응답 파싱 결과
export interface NarrativeBlock {
  type: 'narrative' | 'dialogue' | 'action' | 'image_trigger';
  content: string;
  speaker?: string;
  imageTag?: string;
}

// 확장된 캐릭터 프로필 (프로필 페이지용)
export interface CharacterProfile extends Character {
  prologue: string | null;
  introduction: string | null;
  recommendedPersonas: string[];
  recommendedPlays: string[];
  authorComment: string | null;
  supportsNarrativeMode: boolean;
}

// 내러티브 모드 메시지 (기존 ChatMessage 확장)
export interface NarrativeChatMessage extends ChatMessage {
  blocks?: NarrativeBlock[];
  isNarrativeMode?: boolean;
}
