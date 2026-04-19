'use client';

import { useEffect, useState } from 'react';
import { Heart, TrendingUp, TrendingDown, Flame, Star } from 'lucide-react';

interface AffinityData {
  affinity: number;
  delta: number;
  level: string;
  levelChanged: boolean;
  isFirstToday: boolean;
  streak: number;
}

interface Props {
  data: AffinityData;
  visible: boolean;
  onDismiss: () => void;
}

const LEVEL_LABELS: Record<string, string> = {
  STRANGER: '낯선 사이',
  ACQUAINTANCE: '아는 사이',
  FRIEND: '친한 사이',
  CLOSE: '가까운 사이',
  INTIMATE: '특별한 사이',
  SOULMATE: '운명의 상대',
};

const LEVEL_COLORS: Record<string, string> = {
  STRANGER: 'text-gray-400',
  ACQUAINTANCE: 'text-blue-400',
  FRIEND: 'text-green-400',
  CLOSE: 'text-amber-400',
  INTIMATE: 'text-pink-400',
  SOULMATE: 'text-rose-400',
};

export default function AffinityPopup({ data, visible, onDismiss }: Props) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible) {
      setShow(true);
    } else {
      const timer = setTimeout(() => setShow(false), 300);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!show) return null;

  const isPositive = data.delta > 0;
  const isNegative = data.delta < 0;

  return (
    <div
      className={`fixed top-20 right-4 z-50 transition-all duration-300 ${
        visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
      }`}
      onClick={onDismiss}
    >
      <div className="bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-2xl p-4 shadow-xl min-w-[200px] cursor-pointer">
        {/* 호감도 변동 */}
        <div className="flex items-center gap-2 mb-2">
          <Heart size={16} className="text-pink-500" fill={data.affinity >= 50 ? '#ec4899' : 'none'} />
          <span className="text-sm font-semibold text-white">호감도</span>
          <span className={`text-sm font-bold ml-auto ${
            isPositive ? 'text-pink-400' : isNegative ? 'text-blue-400' : 'text-gray-400'
          }`}>
            {isPositive ? '+' : ''}{data.delta}
            {isPositive ? (
              <TrendingUp size={14} className="inline ml-1" />
            ) : isNegative ? (
              <TrendingDown size={14} className="inline ml-1" />
            ) : null}
          </span>
        </div>

        {/* 프로그레스 바 */}
        <div className="w-full bg-gray-800 rounded-full h-2 mb-2">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 transition-all duration-500"
            style={{ width: `${data.affinity}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className={LEVEL_COLORS[data.level] || 'text-gray-400'}>
            {LEVEL_LABELS[data.level] || data.level}
          </span>
          <span className="text-gray-500">{data.affinity}/100</span>
        </div>

        {/* 레벨 변동 알림 */}
        {data.levelChanged && (
          <div className="mt-2 pt-2 border-t border-gray-800 flex items-center gap-1.5">
            <Star size={12} className="text-amber-400" fill="#fbbf24" />
            <span className="text-xs text-amber-400 font-medium">
              관계가 발전했어요!
            </span>
          </div>
        )}

        {/* 첫 대화 보너스 */}
        {data.isFirstToday && (
          <div className="mt-1.5 flex items-center gap-1.5">
            <Flame size={12} className="text-orange-400" />
            <span className="text-xs text-orange-400">
              오늘 첫 대화 보너스 +2
              {data.streak >= 2 && ` · ${data.streak}일 연속!`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
