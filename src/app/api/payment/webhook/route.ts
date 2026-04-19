import { NextRequest, NextResponse } from 'next/server';

/**
 * 토스페이먼츠 웹훅 — 비동기 결제 상태 변경 알림
 *
 * 수신 이벤트:
 * - DONE: 결제 완료 (confirm 성공과 별개로 최종 확인)
 * - CANCELED: 결제 취소
 * - PARTIAL_CANCELED: 부분 취소
 * - ABORTED: 결제 승인 실패
 * - EXPIRED: 결제 만료
 *
 * Phase 2에서 활성화:
 * - 정기결제 갱신 알림
 * - 결제 실패 시 구독 상태 변경
 * - Slack 알림 연동
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log('[Webhook] Toss event received:', {
      eventType: body.eventType,
      orderId: body.data?.orderId,
      status: body.data?.status,
    });

    // Phase 1: 로그만 기록
    // Phase 2: 이벤트별 처리 로직
    switch (body.eventType) {
      case 'PAYMENT_STATUS_CHANGED':
        // 결제 상태 변경 처리
        break;
      case 'BILLING_STATUS_CHANGED':
        // 정기결제 상태 변경 처리
        break;
      default:
        console.log(`[Webhook] Unhandled event: ${body.eventType}`);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[Webhook] Error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
