'use client';

import { useState } from 'react';
import { Target, Check, ChevronDown, ChevronUp, Gift, Sparkles } from 'lucide-react';

interface Mission {
  id: string;
  type: string;
  title: string;
  description: string;
  emoji: string;
  current: number;
  target: number;
  status: 'active' | 'completed' | 'claimed';
  reward: { bonusMessages: number; affinityBoost: number };
}

interface Props {
  missions: Mission[];
  onClaimReward?: (missionId: string) => void;
  className?: string;
}

/**
 * 일일 미션 패널 — 메인 페이지에 임베드
 *
 * 원신 스타일: 컴팩트 리스트 + 프로그레스 바 + 보상 버튼
 * 올클리어 시 골든 이펙트
 */
export default function DailyMissionPanel({ missions, onClaimReward, className = '' }: Props) {
  const [isExpanded, setIsExpanded] = useState(true);

  const completedCount = missions.filter((m) => m.status === 'completed' || m.status === 'claimed').length;
  const allCleared = completedCount === missions.length && missions.length > 0;

  return (
    <div className={`bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden ${className}`}>
      {/* 헤더 */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-800/50 transition-colors"
      >
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
          allCleared ? 'bg-amber-500/20' : 'bg-violet-500/20'
        }`}>
          {allCleared ? (
            <Sparkles size={16} className="text-amber-400" />
          ) : (
            <Target size={16} className="text-violet-400" />
          )}
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm font-semibold text-white">
            {allCleared ? '미션 올클리어!' : '오늘의 미션'}
          </p>
          <p className="text-[11px] text-gray-500">
            {completedCount}/{missions.length} 완료
          </p>
        </div>
        {/* 미니 프로그레스 */}
        <div className="flex gap-1 mr-2">
          {missions.map((m) => (
            <div
              key={m.id}
              className={`w-2 h-2 rounded-full transition-colors ${
                m.status !== 'active' ? 'bg-green-400' : 'bg-gray-700'
              }`}
            />
          ))}
        </div>
        {isExpanded ? (
          <ChevronUp size={16} className="text-gray-500" />
        ) : (
          <ChevronDown size={16} className="text-gray-500" />
        )}
      </button>

      {/* 미션 리스트 */}
      {isExpanded && (
        <div className="px-4 pb-3 space-y-2">
          {missions.map((mission) => {
            const progress = Math.min(mission.current / mission.target, 1);
            const isCompleted = mission.status === 'completed';
            const isClaimed = mission.status === 'claimed';

            return (
              <div
                key={mission.id}
                className={`
                  flex items-center gap-3 p-2.5 rounded-xl transition-all
                  ${isCompleted ? 'bg-green-500/10 border border-green-500/20' :
                    isClaimed ? 'bg-gray-800/50 opacity-60' :
                    'bg-gray-800/30'}
                `}
              >
                {/* 이모지 */}
                <span className="text-lg flex-shrink-0">{mission.emoji}</span>

                {/* 내용 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className={`text-sm font-medium ${
                      isClaimed ? 'text-gray-500 line-through' : 'text-white'
                    }`}>
                      {mission.title}
                    </p>
                    {isCompleted && (
                      <Check size={14} className="text-green-400" />
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500">{mission.description}</p>

                  {/* 프로그레스 바 */}
                  {!isClaimed && (
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isCompleted ? 'bg-green-400' : 'bg-violet-500'
                          }`}
                          style={{ width: `${progress * 100}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-gray-500 tabular-nums">
                        {mission.current}/{mission.target}
                      </span>
                    </div>
                  )}
                </div>

                {/* 보상 / 수령 버튼 */}
                {isCompleted ? (
                  <button
                    onClick={() => onClaimReward?.(mission.id)}
                    className="flex items-center gap-1 bg-green-500 hover:bg-green-400 text-white text-[11px] font-medium px-2.5 py-1.5 rounded-lg transition-colors flex-shrink-0"
                  >
                    <Gift size={12} />
                    수령
                  </button>
                ) : !isClaimed ? (
                  <div className="text-right flex-shrink-0">
                    <p className="text-[10px] text-gray-600">보상</p>
                    <p className="text-[10px] text-violet-400">
                      +{mission.reward.bonusMessages}회
                    </p>
                  </div>
                ) : null}
              </div>
            );
          })}

          {/* 올클리어 보너스 표시 */}
          {allCleared && (
            <div className="mt-1 p-3 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl flex items-center gap-3">
              <Sparkles size={18} className="text-amber-400" />
              <div>
                <p className="text-sm font-bold text-amber-300">올클리어 보너스!</p>
                <p className="text-[11px] text-amber-400/70">보너스 메시지 +5회 지급 완료</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
