'use client';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';

interface RevenueData {
  month: string;
  mrr: number;
  newRevenue: number;
  churnRevenue: number;
  netMrr: number;
}

interface RevenueChartProps {
  data: RevenueData[];
}

/**
 * 수익 추이 차트 — Stacked Bar + Net MRR Line
 *
 * SaaS 표준 Revenue 차트 (Stripe Atlas + Baremetrics 참고):
 * - New MRR (초록) + Churn (빨강) = 매달 순 변화
 * - Net MRR 라인 = 누적 성장 방향
 *
 * 핵심 원칙: "수익은 한 줄 그래프가 아니라, 구성요소를 보여줘야 한다"
 * (출처: Baremetrics SaaS Metrics Guide, 2024)
 */
export default function RevenueChart({ data }: RevenueChartProps) {
  const formatMonth = (monthStr: string) => {
    const [, m] = monthStr.split('-');
    return `${parseInt(m)}월`;
  };

  const formatCurrency = (value: number) => {
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
    return String(value);
  };

  // Net MRR를 계산한 차트 데이터
  const chartData = data.map((d) => ({
    ...d,
    churnNeg: -d.churnRevenue, // 음수로 표시
    displayMonth: formatMonth(d.month),
  }));

  return (
    <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-300">수익 추이 (MRR)</h3>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>신규 수익</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span>이탈 수익</span>
          </div>
        </div>
      </div>

      {/* MRR 요약 */}
      <div className="flex items-center gap-6 mb-4">
        <div>
          <p className="text-[10px] text-gray-500">현재 MRR</p>
          <p className="text-lg font-bold text-white">
            ₩{(data[data.length - 1]?.netMrr || 0).toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-gray-500">이번 달 신규</p>
          <p className="text-sm font-semibold text-emerald-400">
            +₩{(data[data.length - 1]?.newRevenue || 0).toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-gray-500">이번 달 이탈</p>
          <p className="text-sm font-semibold text-red-400">
            -₩{(data[data.length - 1]?.churnRevenue || 0).toLocaleString()}
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={chartData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis
            dataKey="displayMonth"
            tick={{ fill: '#6b7280', fontSize: 11 }}
            axisLine={{ stroke: '#374151' }}
            tickLine={false}
          />
          <YAxis
            tickFormatter={formatCurrency}
            tick={{ fill: '#6b7280', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#111827',
              border: '1px solid #374151',
              borderRadius: '12px',
              fontSize: '12px',
            }}
            formatter={(value, name) => {
              const numValue = typeof value === 'number' ? value : 0;
              const absValue = Math.abs(numValue);
              const label = name === 'newRevenue' ? '신규 수익' : name === 'churnNeg' ? '이탈 수익' : 'Net MRR';
              return [`₩${absValue.toLocaleString()}`, label];
            }}
          />
          <Bar dataKey="newRevenue" fill="#10b981" radius={[4, 4, 0, 0]} />
          <Bar dataKey="churnNeg" radius={[4, 4, 0, 0]}>
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill="#ef4444" fillOpacity={0.7} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
