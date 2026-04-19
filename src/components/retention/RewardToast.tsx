'use client';

import { useState, useEffect } from 'react';
import { Gift, Flame, Sparkles } from 'lucide-react';

interface Props {
  type: 'attendance' | 'mission' | 'all_clear';
  message: string;
  bonusMessages?: number;
  visible: boolean;
  onDismiss: () => void;
}

/**
 * 보상 토스트 — 출석/미션 완료 시 즉각 피드백
 *
 * 즉각적 보상 피드백이 습관 루프의 핵심
 * 행동 → 보상 간격이 3초 이내일 때 반복 확률 2.4배 (출처: Nir Eyal, Hooked, 2014)
 */
export default function RewardToast({ type, message, bonusMessages, visible, onDismiss }: Props) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(onDismiss, 300);
      }, 3000);
      return () => clearTimeout(timer);
    }
    setIsExiting(false);
  }, [visible, onDismiss]);

  if (!visible) return null;

  const config = {
    attendance: {
      icon: Flame,
      gradient: 'from-orange-500 to-amber-500',
      glow: 'shadow-orange-500/30',
    },
    mission: {
      icon: Gift,
      gradient: 'from-violet-500 to-purple-500',
      glow: 'shadow-violet-500/30',
    },
    all_clear: {
      icon: Sparkles,
      gradient: 'from-amber-400 to-yellow-500',
      glow: 'shadow-amber-400/30',
    },
  }[type];

  const Icon = config.icon;

  return (
    <div
      className={`
        fixed top-20 left-1/2 -translate-x-1/2 z-50
        bg-gray-900/95 backdrop-blur-sm border border-gray-700
        rounded-2xl px-5 py-3 shadow-xl ${config.glow}
        flex items-center gap-3
        transition-all duration-300
        ${isExiting ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0'}
      `}
    >
      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-lg`}>
        <Icon size={18} className="text-white" />
      </div>
      <div>
        <p className="text-sm font-medium text-white">{message}</p>
        {bonusMessages && (
          <p className="text-xs text-gray-400">보너스 메시지 +{bonusMessages}회</p>
        )}
      </div>
    </div>
  );
}
