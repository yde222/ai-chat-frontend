'use client';

interface FunnelStage {
  name: string;
  value: number;
  rate: number;
}

interface ConversionFunnelProps {
  stages: FunnelStage[];
}

/**
 * 전환 퍼널 시각화
 *
 * Amplitude Funnel Analysis 패턴 참고:
 * - 각 단계별 절대값 + 전체 대비 % + 이탈률
 * - 막대 너비가 비율에 비례 → 직관적 이탈 시각화
 *
 * 벤치마크:
 * - Character.AI: 가입→유료 전환 6.2% (출처: The Information, 2024.01)
 * - Replika: 4.8%, Chai: 3.1% (출처: SimilarWeb, 2024.Q1)
 */
export default function ConversionFunnel({ stages }: ConversionFunnelProps) {
  const maxValue = stages[0]?.value || 1;

  const getBarColor = (index: number) => {
    const colors = [
      'from-sky-500 to-sky-600',
      'from-blue-500 to-blue-600',
      'from-violet-500 to-violet-600',
      'from-amber-500 to-amber-600',
      'from-emerald-500 to-emerald-600',
    ];
    return colors[index] || colors[0];
  };

  return (
    <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold text-gray-300">전환 퍼널</h3>
        <span className="text-xs text-gray-500">
          최종 전환: <span className="text-emerald-400 font-semibold">{stages[stages.length - 1]?.rate}%</span>
        </span>
      </div>

      <div className="space-y-3">
        {stages.map((stage, i) => {
          const widthPercent = (stage.value / maxValue) * 100;
          const dropRate = i > 0
            ? Math.round((1 - stage.value / stages[i - 1].value) * 100)
            : 0;

          return (
            <div key={stage.name}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 w-24 truncate">{stage.name}</span>
                  <span className="text-sm font-semibold text-white">{stage.value.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-3">
                  {i > 0 && (
                    <span className="text-[10px] text-red-400/70">-{dropRate}%</span>
                  )}
                  <span className="text-xs text-gray-500 w-12 text-right">{stage.rate}%</span>
                </div>
              </div>
              <div className="w-full h-6 bg-gray-800 rounded-lg overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${getBarColor(i)} rounded-lg transition-all duration-700`}
                  style={{ width: `${Math.max(widthPercent, 3)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
