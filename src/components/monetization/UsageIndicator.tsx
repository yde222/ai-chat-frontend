'use client';

import { MessageCircle, Crown } from 'lucide-react';

interface Props {
  used: number;
  total: number;
  isPremium: boolean;
  className?: string;
}

/**
 * 사용량 인디케이터 — 채팅 헤더에 표시
 *
 * FREE: "12/30" 형태 + 프로그레스 바
 * PREMIUM: 왕관 아이콘 + "무제한"
 */
export default function UsageIndicator({ used, total, isPremium, className = '' }: Props) {
  if (isPremium) {
    return (
      <div className={`flex items-center gap-1 text-xs text-amber-400 bg-amber-500/10 rounded-full px-2.5 py-1 ${className}`}>
        <Crown size={12} fill="currentColor" />
        <span className="font-medium">무제한</span>
      </div>
    );
  }

  const percentage = total > 0 ? (used / total) * 100 : 0;
  const isWarning = percentage >= 70;
  const isDanger = percentage >= 90;

  const colorClass = isDanger
    ? 'text-red-400 bg-red-500/10'
    : isWarning
      ? 'text-amber-400 bg-amber-500/10'
      : 'text-gray-400 bg-gray-800';

  const barColor = isDanger
    ? 'bg-red-500'
    : isWarning
      ? 'bg-amber-500'
      : 'bg-gray-500';

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`flex items-center gap-1 text-xs ${colorClass} rounded-full px-2.5 py-1`}>
        <MessageCircle size={12} />
        <span className="font-medium tabular-nums">{used}/{total}</span>
      </div>
      {/* 미니 프로그레스 바 */}
      <div className="w-12 h-1 bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor} rounded-full transition-all duration-500`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
}
