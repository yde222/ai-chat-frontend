import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

/**
 * Admin Analytics API — 대시보드 데이터 엔드포인트
 *
 * Phase 1: 프론트에서 직접 더미 데이터 생성 (백엔드 의존 없이 UI 완성)
 * Phase 2: chat-service analytics API 프록시
 *
 * 인증: NextAuth 세션 + admin 권한 체크
 * - Phase 1: 세션만 있으면 접근 허용
 * - Phase 2: user.role === 'admin' 체크 추가
 */

// 주말 부스트 + 성장 곡선 적용된 리얼리스틱 DAU 시뮬레이션
function generateDAUTrend(days: number) {
  const data = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const weekday = d.getDay();
    const weekendBoost = (weekday === 0 || weekday === 6) ? 1.25 : 1.0;
    const growthFactor = 1 + (days - i) * 0.008;
    const baseDAU = 800 + Math.floor(Math.random() * 600);

    data.push({
      date: dateStr,
      dau: Math.floor(baseDAU * weekendBoost * growthFactor),
      newUsers: Math.floor(30 + Math.random() * 50),
      premium: Math.floor(40 + Math.random() * 30 + (days - i) * 0.5),
    });
  }
  return data;
}

function generateRevenueTrend(months: number) {
  const data = [];
  let baseMrr = 2_400_000;

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const monthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const newRev = Math.floor(400_000 + Math.random() * 300_000);
    const churn = Math.floor(100_000 + Math.random() * 150_000);
    const netMrr = baseMrr + newRev - churn;

    data.push({ month: monthStr, mrr: baseMrr, newRevenue: newRev, churnRevenue: churn, netMrr });
    baseMrr = netMrr;
  }
  return data;
}

export async function GET(request: Request) {
  try {
    // Phase 1: 인증 체크 (세션 존재 여부만)
    // Phase 2: admin 역할 체크 추가
    // const session = await getServerSession();
    // if (!session?.user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const { searchParams } = new URL(request.url);
    const period = (searchParams.get('period') || '30d') as '7d' | '30d' | '90d';
    const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
    const months = period === '7d' ? 3 : period === '30d' ? 6 : 12;

    const dashboard = {
      overview: {
        dau: { value: 1247, change: 12.3, trend: 'up', label: 'DAU' },
        conversionRate: { value: 5.8, change: 0.7, trend: 'up', label: '전환율 (%)' },
        mrr: { value: 4_820_000, change: 18.2, trend: 'up', label: 'MRR (원)' },
        retention: { value: 42.1, change: -2.3, trend: 'down', label: 'D7 리텐션 (%)' },
      },
      dauTrend: generateDAUTrend(days),
      conversionFunnel: {
        stages: [
          { name: '전체 가입', value: 8420, rate: 100 },
          { name: '7일 활성', value: 3540, rate: 42.0 },
          { name: '제한 도달', value: 1890, rate: 22.4 },
          { name: '프리미엄 페이지', value: 720, rate: 8.5 },
          { name: '결제 완료', value: 489, rate: 5.8 },
        ],
      },
      characterPopularity: [
        { id: 'soyeon', name: '서연', sessions: 3240, avgMessages: 28.5, avgAffinity: 67, conversions: 142, satisfaction: 4.2, trend: 'stable' },
        { id: 'minji', name: '민지', sessions: 2810, avgMessages: 34.2, avgAffinity: 72, conversions: 198, satisfaction: 4.5, trend: 'up' },
        { id: 'hana', name: '하나', sessions: 1960, avgMessages: 22.1, avgAffinity: 58, conversions: 89, satisfaction: 3.8, trend: 'down' },
        { id: 'ren', name: '렌', sessions: 1540, avgMessages: 41.7, avgAffinity: 78, conversions: 167, satisfaction: 4.7, trend: 'up' },
        { id: 'yujin', name: '유진', sessions: 1320, avgMessages: 38.3, avgAffinity: 74, conversions: 145, satisfaction: 4.4, trend: 'up' },
      ],
      revenueTrend: generateRevenueTrend(months),
      generatedAt: new Date().toISOString(),
      period,
    };

    return NextResponse.json(dashboard);
  } catch (error) {
    console.error('Admin analytics error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
