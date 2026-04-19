import { NextRequest, NextResponse } from 'next/server';
import { TOSS_CONFIG } from '@/lib/payment';

/**
 * 결제 승인 API — 토스페이먼츠 서버 대 서버
 *
 * 플로우:
 * 1. 클라이언트에서 토스 위젯으로 결제 요청
 * 2. 성공 시 successUrl로 리다이렉트 (paymentKey, orderId, amount 쿼리)
 * 3. 이 API에서 토스 승인 API 호출 (서버 사이드)
 * 4. 승인 성공 → 유저 tier 업데이트
 *
 * 보안 포인트:
 * - SECRET_KEY는 서버에서만 사용 (NEXT_PUBLIC_ 접두사 없음)
 * - amount 검증 → 클라이언트 변조 방어
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentKey, orderId, amount } = body;

    if (!paymentKey || !orderId || !amount) {
      return NextResponse.json(
        { error: '필수 파라미터가 누락되었습니다.' },
        { status: 400 },
      );
    }

    // 금액 검증 (9900 또는 79900만 허용)
    const validAmounts = [9900, 79900];
    if (!validAmounts.includes(Number(amount))) {
      return NextResponse.json(
        { error: '유효하지 않은 결제 금액입니다.' },
        { status: 400 },
      );
    }

    // 토스페이먼츠 승인 API 호출
    const encryptedSecretKey = Buffer.from(`${TOSS_CONFIG.SECRET_KEY}:`).toString('base64');

    const tossResponse = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${encryptedSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paymentKey, orderId, amount }),
    });

    const tossData = await tossResponse.json();

    if (!tossResponse.ok) {
      console.error('Toss confirm failed:', tossData);
      return NextResponse.json(
        {
          error: tossData.message || '결제 승인에 실패했습니다.',
          code: tossData.code,
        },
        { status: tossResponse.status },
      );
    }

    // 승인 성공 → 구독 정보 업데이트
    // Phase 1: 로컬 상태 업데이트 (프론트엔드에서 처리)
    // Phase 2: chat-service에 gRPC로 SubscriptionService.upgradeToPremium() 호출
    const plan = Number(amount) === 9900 ? 'premium_monthly' : 'premium_yearly';

    return NextResponse.json({
      success: true,
      payment: {
        paymentKey: tossData.paymentKey,
        orderId: tossData.orderId,
        totalAmount: tossData.totalAmount,
        method: tossData.method,
        approvedAt: tossData.approvedAt,
        plan,
      },
    });
  } catch (error: any) {
    console.error('Payment confirm error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}
