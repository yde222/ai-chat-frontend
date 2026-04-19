'use client';

import { TrendingUp, TrendingDown, Minus, Crown } from 'lucide-react';

interface CharacterData {
  id: string;
  name: string;
  sessions: number;
  avgMessages: number;
  avgAffinity: number;
  conversions: number;
  satisfaction: number;
  trend: string;
}

interface CharacterRankingProps {
  data: CharacterData[];
}

/**
 * 캐릭터 인기도 랭킹
 *
 * 핵심 인사이트 설계:
 * - "세션 많고 대화 짧은 캐릭터" = 첫인상 OK, 몰입 실패 → 페르소나 개선 필요
 * - "세션 적지만 대화 긴 캐릭터" = 니치 but 충성도 높음 → 프리미엄 후보
 * - 전환 기여도가 높은 캐릭터 = 수익화 앵커
 *
 * Spotify Wrapped 대시보드 참고: 랭킹 + 핵심 지표 조합
 */
export default function CharacterRanking({ data }: CharacterRankingProps) {
  const sorted = [...data].sort((a, b) => b.sessions - a.sessions);
  const maxSessions = sorted[0]?.sessions || 1;

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp size={12} className="text-emerald-400" />;
    if (trend === 'down') return <TrendingDown size={12} className="text-red-400" />;
    return <Minus size={12} className="text-gray-400" />;
  };

  const getAffinityColor = (affinity: number) => {
    if (affinity >= 75) return 'text-pink-400';
    if (affinity >= 60) return 'text-amber-400';
    return 'text-gray-400';
  };

  return (
    <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-300">캐릭터 인기도</h3>
        <span className="text-xs text-gray-500">세션 기준 정렬</span>
      </div>

      <div className="space-y-3">
        {sorted.map((char, i) => {
          const barWidth = (char.sessions / maxSessions) * 100;
          const isPremium = char.id === 'ren' || char.id === 'yujin';

          return (
            <div key={char.id} className="group">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600 w-4 text-right font-mono">{i + 1}</span>
                  <span className="text-sm font-medium text-white">{char.name}</span>
                  {isPremium && <Crown size={12} className="text-amber-400" />}
                  {getTrendIcon(char.trend)}
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span className="text-gray-500" title="세션">
                    {char.sessions.toLocaleString()} 세션
                  </span>
                  <span className="text-gray-500" title="평균 대화">
                    ~{char.avgMessages}회
                  </span>
                  <span className={getAffinityColor(char.avgAffinity)} title="평균 호감도">
                    ♥ {char.avgAffinity}
                  </span>
                  <span className="text-emerald-400 font-medium" title="전환 기여">
                    +{char.conversions}
                  </span>
                </div>
              </div>

              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    isPremium
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                      : 'bg-gradient-to-r from-pink-500 to-rose-500'
                  }`}
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* 인사이트 힌트 */}
      <div className="mt-4 p-3 bg-gray-800/50 rounded-xl">
        <p className="text-[11px] text-gray-500 leading-relaxed">
          <span className="text-amber-400 font-medium">인사이트:</span>{' '}
          렌(프리미엄)이 세션은 4위지만 평균 대화 41.7회로 1위 — 몰입도 최강. 전환 기여도도 민지 다음 2위. 프리미엄 앵커 캐릭터로 확정.
        </p>
      </div>
    </div>
  );
}
