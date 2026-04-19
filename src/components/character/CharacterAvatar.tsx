'use client';

import { useState, useEffect } from 'react';

interface Props {
  characterId: string;
  emotion?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

/**
 * 캐릭터 아바타 — 감정별 표정 오버레이 시스템
 *
 * Phase 1: SVG 아바타 + CSS 이모지 오버레이
 * Phase 2: AI 생성 일러스트 (감정별 5장/캐릭터)
 *
 * 성공 사례: 프로젝트 세카이 (Colorful Palette)
 *   - 캐릭터별 감정 표정 7종 → 유저 몰입도 지표 35% 향상
 *   - 표정 전환 애니메이션이 "살아있는 느낌"의 핵심
 */

const CHARACTER_IMAGES: Record<string, string> = {
  miyu: '/characters/miyu.svg',
  haneul: '/characters/haneul.svg',
  luca: '/characters/luca.svg',
  sora: '/characters/sora.svg',
  'char-tsundere-miyu': '/characters/miyu.svg',
  'char-healer-haneul': '/characters/haneul.svg',
  'char-genius-luca': '/characters/luca.svg',
  'char-idol-sora': '/characters/sora.svg',
  ren: '/characters/ren.svg',
  yujin: '/characters/yujin.svg',
  'char-vampire-ren': '/characters/ren.svg',
  'char-ceo-yujin': '/characters/yujin.svg',
};

// 감정별 오버레이 이모지 + 색상 효과
const EMOTION_OVERLAY: Record<string, { emoji: string; glow: string; ring: string }> = {
  NEUTRAL: { emoji: '', glow: '', ring: 'ring-gray-700' },
  JOY: { emoji: '😊', glow: 'shadow-amber-500/20', ring: 'ring-amber-400/50' },
  SADNESS: { emoji: '😢', glow: 'shadow-blue-500/20', ring: 'ring-blue-400/50' },
  ANGER: { emoji: '😤', glow: 'shadow-red-500/20', ring: 'ring-red-400/50' },
  SURPRISE: { emoji: '😮', glow: 'shadow-yellow-500/20', ring: 'ring-yellow-400/50' },
  AFFECTION: { emoji: '🥰', glow: 'shadow-pink-500/30', ring: 'ring-pink-400/50' },
  FEAR: { emoji: '😰', glow: 'shadow-purple-500/20', ring: 'ring-purple-400/50' },
  DISGUST: { emoji: '😒', glow: 'shadow-green-500/20', ring: 'ring-green-400/50' },
  EXCITEMENT: { emoji: '✨', glow: 'shadow-orange-500/20', ring: 'ring-orange-400/50' },
  SHY: { emoji: '😳', glow: 'shadow-rose-500/30', ring: 'ring-rose-400/50' },
};

const SIZE_MAP = {
  sm: { container: 'w-9 h-9', emojiSize: 'text-xs', emojiPos: '-bottom-0.5 -right-0.5', ring: 'ring-1' },
  md: { container: 'w-12 h-12', emojiSize: 'text-sm', emojiPos: '-bottom-0.5 -right-0.5', ring: 'ring-2' },
  lg: { container: 'w-16 h-16', emojiSize: 'text-base', emojiPos: '-bottom-1 -right-1', ring: 'ring-2' },
  xl: { container: 'w-24 h-24', emojiSize: 'text-xl', emojiPos: '-bottom-1 -right-1', ring: 'ring-3' },
};

export default function CharacterAvatar({
  characterId,
  emotion = 'NEUTRAL',
  size = 'md',
  className = '',
}: Props) {
  const [prevEmotion, setPrevEmotion] = useState(emotion);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (emotion !== prevEmotion) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setPrevEmotion(emotion);
        setIsTransitioning(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [emotion, prevEmotion]);

  const imageSrc = CHARACTER_IMAGES[characterId];
  const overlay = EMOTION_OVERLAY[emotion] || EMOTION_OVERLAY.NEUTRAL;
  const sizeConfig = SIZE_MAP[size];

  return (
    <div className={`relative flex-shrink-0 ${className}`}>
      {/* 메인 아바타 */}
      <div
        className={`
          ${sizeConfig.container} rounded-full overflow-hidden
          ${sizeConfig.ring} ${overlay.ring}
          shadow-lg ${overlay.glow}
          transition-all duration-300
          ${isTransitioning ? 'scale-95 opacity-80' : 'scale-100 opacity-100'}
        `}
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={characterId}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center text-lg">
            🤖
          </div>
        )}
      </div>

      {/* 감정 이모지 오버레이 */}
      {overlay.emoji && (
        <div
          className={`
            absolute ${sizeConfig.emojiPos}
            ${sizeConfig.emojiSize}
            bg-gray-900 rounded-full
            flex items-center justify-center
            w-5 h-5 shadow-sm
            transition-all duration-300
            ${isTransitioning ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}
          `}
        >
          {overlay.emoji}
        </div>
      )}
    </div>
  );
}
