'use client';

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPICardProps {
  label: string;
  value: number | string;
  change: number;
  trend: 'up' | 'down' | 'stable';
  format?: 'number' | 'percent' | 'currency';
  icon: React.ReactNode;
}

/**
 * KPI Card — 핵심 지표 카드
 *
 * Stripe Dashboard 디자인 참고:
 * - 큰 숫자 + 작은 변화율 + 방향 화살표
 * - "3초 안에 상태 파악" 원칙 (출처: Stripe Dashboard Design System, 2023)
 */
export default function KPICard({ label, value, change, trend, format = 'number', icon }: KPICardProps) {
  const formatValue = () => {
    if (format === 'currency') {
      return typeof value === 'number'
        ? `₩${value.toLocaleString()}`
        : value;
    }
    if (format === 'percent') return `${value}%`;
    return typeof value === 'number' ? value.toLocaleString() : value;
  };

  const trendColor = trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : 'text-gray-400';
  const trendBg = trend === 'up' ? 'bg-emerald-500/10' : trend === 'down' ? 'bg-red-500/10' : 'bg-gray-500/10';

  return (
    <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800 hover:border-gray-700 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-400">{label}</span>
        <div className="text-gray-500">{icon}</div>
      </div>

      <div className="flex items-end justify-between">
        <p className="text-2xl font-bold text-white">{formatValue()}</p>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${trendBg}`}>
          {trend === 'up' && <TrendingUp size={12} className={trendColor} />}
          {trend === 'down' && <TrendingDown size={12} className={trendColor} />}
          {trend === 'stable' && <Minus size={12} className={trendColor} />}
          <span className={`text-xs font-medium ${trendColor}`}>
            {change > 0 ? '+' : ''}{change}%
          </span>
        </div>
      </div>
    </div>
  );
}
