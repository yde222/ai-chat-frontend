'use client';

import { Crown } from 'lucide-react';

interface Props {
  size?: 'sm' | 'md';
  className?: string;
}

/**
 * 프리미엄 뱃지 — 잠긴 캐릭터/프리미엄 기능에 표시
 */
export default function PremiumBadge({ size = 'sm', className = '' }: Props) {
  const sizeClasses = size === 'sm'
    ? 'text-[10px] px-1.5 py-0.5 gap-0.5'
    : 'text-xs px-2 py-1 gap-1';

  const iconSize = size === 'sm' ? 10 : 14;

  return (
    <div
      className={`
        inline-flex items-center ${sizeClasses}
        bg-gradient-to-r from-amber-500 to-yellow-400
        text-white font-bold rounded-full shadow-lg shadow-amber-500/30
        ${className}
      `}
    >
      <Crown size={iconSize} fill="currentColor" />
      <span>PREMIUM</span>
    </div>
  );
}
