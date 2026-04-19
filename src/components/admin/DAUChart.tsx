'use client';

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

interface DAUChartProps {
  data: Array<{
    date: string;
    dau: number;
    newUsers: number;
    premium: number;
  }>;
}

/**
 * DAU 트렌드 차트 — Area Chart
 *
 * 선택 이유: Line Chart보다 면적 채우기가 "성장 방향성"을 직관적으로 전달
 * Vercel Analytics + Mixpanel 대시보드 UX 참고
 *
 * 3개 레이어:
 * - DAU (전체) — 하늘색 면적
 * - 프리미엄 유저 — 골드 면적
 * - 신규 가입 — 초록색 라인
 */
export default function DAUChart({ data }: DAUChartProps) {
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  };

  return (
    <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-300">DAU 트렌드</h3>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-sky-500" />
            <span>전체 DAU</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>프리미엄</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>신규</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="dauGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="premiumGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            tick={{ fill: '#6b7280', fontSize: 11 }}
            axisLine={{ stroke: '#374151' }}
            tickLine={false}
          />
          <YAxis
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
            labelFormatter={(label) => `날짜: ${label}`}
          />
          <Area
            type="monotone"
            dataKey="dau"
            name="전체 DAU"
            stroke="#0ea5e9"
            fill="url(#dauGradient)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="premium"
            name="프리미엄"
            stroke="#f59e0b"
            fill="url(#premiumGradient)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="newUsers"
            name="신규 가입"
            stroke="#10b981"
            fill="none"
            strokeWidth={1.5}
            strokeDasharray="5 5"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
