'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  ArrowLeft, RefreshCw, Users, TrendingUp, DollarSign, Activity,
  BarChart3, Crown,
} from 'lucide-react';
import KPICard from '@/components/admin/KPICard';
import DAUChart from '@/components/admin/DAUChart';
import ConversionFunnel from '@/components/admin/ConversionFunnel';
import CharacterRanking from '@/components/admin/CharacterRanking';
import RevenueChart from '@/components/admin/RevenueChart';

/**
 * 관리자 대시보드 — 운영 가시성의 심장
 *
 * "데이터를 보지 않으면 의사결정이 아니라 추측이다."
 *
 * 설계 원칙 (Mixpanel + Amplitude 참고):
 * 1. 한 화면, 3초 — KPI 카드 4개로 즉시 상태 파악
 * 2. 드릴다운 가능 — 차트 클릭 시 세부 데이터
 * 3. 기간 필터 — 7일/30일/90일 전환
 * 4. 실시간 지표 — WebSocket 기반 (Phase 2)
 *
 * 성공 사례: Spotify for Artists 대시보드
 * - 아티스트가 데이터를 보고 콘텐츠 전략 수정
 * - 대시보드 도입 후 아티스트 리텐션 34% 향상 (출처: Spotify IR, 2023)
 */

interface DashboardData {
  overview: {
    dau: { value: number; change: number; trend: string; label: string };
    conversionRate: { value: number; change: number; trend: string; label: string };
    mrr: { value: number; change: number; trend: string; label: string };
    retention: { value: number; change: number; trend: string; label: string };
  };
  dauTrend: Array<{ date: string; dau: number; newUsers: number; premium: number }>;
  conversionFunnel: {
    stages: Array<{ name: string; value: number; rate: number }>;
  };
  characterPopularity: Array<{
    id: string;
    name: string;
    sessions: number;
    avgMessages: number;
    avgAffinity: number;
    conversions: number;
    satisfaction: number;
    trend: string;
  }>;
  revenueTrend: Array<{
    month: string;
    mrr: number;
    newRevenue: number;
    churnRevenue: number;
    netMrr: number;
  }>;
  generatedAt: string;
  period: string;
}

type Period = '7d' | '30d' | '90d';

export default function AdminDashboard() {
  const router = useRouter();
  const { data: session } = useSession();
  const [data, setData] = useState<DashboardData | null>(null);
  const [period, setPeriod] = useState<Period>('30d');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async (p: Period = period) => {
    try {
      const res = await fetch(`/api/admin/analytics?period=${p}`);
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error('Dashboard fetch error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePeriodChange = (p: Period) => {
    setPeriod(p);
    setRefreshing(true);
    fetchData(p);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <BarChart3 size={40} className="text-sky-500 mx-auto mb-3 animate-pulse" />
          <p className="text-gray-400 text-sm">대시보드 로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-gray-500">데이터를 불러올 수 없습니다.</p>
      </div>
    );
  }

  const { overview } = data;

  return (
    <div className="min-h-screen bg-gray-950">
      {/* 헤더 */}
      <header className="border-b border-gray-800 bg-gray-950/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/')}
              className="p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-400" />
            </button>
            <div className="flex items-center gap-2">
              <BarChart3 size={20} className="text-sky-500" />
              <h1 className="font-semibold text-white">운영 대시보드</h1>
            </div>
            {session?.user?.name && (
              <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded-full">
                {session.user.name}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* 기간 필터 */}
            <div className="flex items-center bg-gray-900 rounded-xl p-0.5">
              {(['7d', '30d', '90d'] as Period[]).map((p) => (
                <button
                  key={p}
                  onClick={() => handlePeriodChange(p)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    period === p
                      ? 'bg-sky-500 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {p === '7d' ? '7일' : p === '30d' ? '30일' : '90일'}
                </button>
              ))}
            </div>

            {/* 새로고침 */}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 rounded-lg hover:bg-gray-800 transition-colors text-gray-400 hover:text-white disabled:opacity-50"
              title="새로고침"
            >
              <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* KPI 카드 4개 — 3초 안에 상태 파악 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            label={overview.dau.label}
            value={overview.dau.value}
            change={overview.dau.change}
            trend={overview.dau.trend as 'up' | 'down' | 'stable'}
            icon={<Users size={18} />}
          />
          <KPICard
            label={overview.conversionRate.label}
            value={overview.conversionRate.value}
            change={overview.conversionRate.change}
            trend={overview.conversionRate.trend as 'up' | 'down' | 'stable'}
            format="percent"
            icon={<TrendingUp size={18} />}
          />
          <KPICard
            label={overview.mrr.label}
            value={overview.mrr.value}
            change={overview.mrr.change}
            trend={overview.mrr.trend as 'up' | 'down' | 'stable'}
            format="currency"
            icon={<DollarSign size={18} />}
          />
          <KPICard
            label={overview.retention.label}
            value={overview.retention.value}
            change={overview.retention.change}
            trend={overview.retention.trend as 'up' | 'down' | 'stable'}
            format="percent"
            icon={<Activity size={18} />}
          />
        </div>

        {/* DAU 트렌드 (풀 폭) */}
        <DAUChart data={data.dauTrend} />

        {/* 전환 퍼널 + 캐릭터 인기도 (2컬럼) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ConversionFunnel stages={data.conversionFunnel.stages} />
          <CharacterRanking data={data.characterPopularity} />
        </div>

        {/* 수익 추이 (풀 폭) */}
        <RevenueChart data={data.revenueTrend} />

        {/* 푸터 */}
        <div className="flex items-center justify-between py-4 text-[11px] text-gray-600">
          <span>최종 갱신: {new Date(data.generatedAt).toLocaleString('ko-KR')}</span>
          <span>Phase 1: 더미 데이터 · Phase 2: 실시간 DB 연동</span>
        </div>
      </div>
    </div>
  );
}
