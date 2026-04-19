/**
 * 결제 설정 — 토스페이먼츠 연동
 *
 * 토스페이먼츠 선택 근거:
 * - 국내 PG 점유율 1위 (출처: 금융감독원, 2024.Q1)
 * - 위젯 SDK: 카드/간편결제/계좌이체 올인원 UI 제공
 * - 정기결제(빌링키) 지원 → 구독 모델 필수
 * - 테스트 키로 즉시 개발 시작 가능
 *
 * Phase 1: 테스트 키로 개발/검증
 * Phase 2: 라이브 키 전환 + PCI DSS 대응
 */

// 플랜 정보
export const PLANS = {
  premium_monthly: {
    id: 'premium_monthly',
    name: '월간 프리미엄',
    price: 9900,
    priceLabel: '9,900원/월',
    period: '월간',
    features: [
      '무제한 대화',
      '프리미엄 캐릭터 잠금 해제',
      '감정 분석 리포트',
      '우선 응답 (대기 없음)',
      '광고 제거',
    ],
    badge: null,
  },
  premium_yearly: {
    id: 'premium_yearly',
    name: '연간 프리미엄',
    price: 79900,
    priceLabel: '79,900원/년',
    period: '연간',
    features: [
      '월간 프리미엄 모든 혜택',
      '연 33% 할인 (월 6,658원)',
      '전용 캐릭터 스킨',
      '얼리액세스 신규 캐릭터',
    ],
    badge: '인기',
  },
} as const;

export type PlanId = keyof typeof PLANS;

// 토스페이먼츠 설정
export const TOSS_CONFIG = {
  CLIENT_KEY: process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || 'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq',
  SECRET_KEY: process.env.TOSS_SECRET_KEY || 'test_sk_zXLkKEypNArWmo50nX3lmeaxYG5R',
  SUCCESS_URL: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/premium/success`,
  FAIL_URL: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/premium/fail`,
} as const;

/**
 * 주문 ID 생성
 * 형식: AIROMANCE_{userId 앞 8자}_{timestamp}
 */
export function generateOrderId(userId: string): string {
  const userPrefix = userId.replace(/-/g, '').slice(0, 8);
  const timestamp = Date.now().toString(36);
  return `AIROMANCE_${userPrefix}_${timestamp}`;
}
