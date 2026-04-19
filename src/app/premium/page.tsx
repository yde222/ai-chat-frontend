'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { PLANS, PlanId, generateOrderId, TOSS_CONFIG } from '@/lib/payment';
import { ArrowLeft, Crown, Check, Sparkles, Shield } from 'lucide-react';

/**
 * 프리미엄 플랜 선택 페이지
 *
 * Spotify Premium 가입 플로우 참고:
 * - 플랜 비교 → 선택 → 결제 → 즉시 활성화
 * - 연간 플랜에 "인기" 뱃지 → 연간 선택률 38% (출처: Spotify IR, 2023.Q4)
 *
 * 토스페이먼츠 위젯 SDK 연동:
 * - Phase 1: 결제 버튼 클릭 → confirm API → 성공 페이지
 * - Phase 2: 실제 위젯 임베드 (카드/간편결제 선택 UI)
 */
export default function PremiumPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [selectedPlan, setSelectedPlan] = useState<PlanId>('premium_yearly');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    if (!session?.user?.id) {
      router.push('/login');
      return;
    }

    setIsProcessing(true);

    try {
      const plan = PLANS[selectedPlan];
      const orderId = generateOrderId(session.user.id);

      // Phase 1: 테스트 결제 시뮬레이션
      // Phase 2: 토스페이먼츠 위젯 SDK loadPaymentWidget() 호출
      //
      // 실제 연동 코드 (Phase 2):
      // const paymentWidget = await loadPaymentWidget(TOSS_CONFIG.CLIENT_KEY, customerKey);
      // paymentWidget.renderPaymentMethods('#payment-widget', plan.price);
      // await paymentWidget.requestPayment({
      //   orderId, orderName: plan.name, customerName: session.user.name,
      //   successUrl: TOSS_CONFIG.SUCCESS_URL, failUrl: TOSS_CONFIG.FAIL_URL,
      // });

      // Phase 1: 바로 성공 페이지로 이동 (테스트 모드)
      const params = new URLSearchParams({
        paymentKey: `test_${Date.now()}`,
        orderId,
        amount: String(plan.price),
        plan: selectedPlan,
      });

      router.push(`/premium/success?${params.toString()}`);
    } catch (error) {
      console.error('Payment initiation failed:', error);
      router.push('/premium/fail?code=INIT_ERROR&message=결제+초기화에+실패했습니다');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* 헤더 */}
      <header className="border-b border-gray-800 bg-gray-950/90 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-400" />
          </button>
          <h1 className="font-semibold text-white">프리미엄 업그레이드</h1>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* 상단 카피 */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30">
            <Crown size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            더 깊은 이야기를 만나보세요
          </h2>
          <p className="text-gray-400 text-sm">
            모든 캐릭터, 무제한 대화, 특별한 기능까지
          </p>
        </div>

        {/* 플랜 카드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {(Object.entries(PLANS) as [PlanId, typeof PLANS[PlanId]][]).map(([id, plan]) => {
            const isSelected = selectedPlan === id;
            return (
              <button
                key={id}
                onClick={() => setSelectedPlan(id)}
                className={`
                  relative p-5 rounded-2xl border-2 text-left transition-all duration-200
                  ${isSelected
                    ? 'border-amber-500 bg-amber-500/5 shadow-lg shadow-amber-500/10'
                    : 'border-gray-800 bg-gray-900 hover:border-gray-700'}
                `}
              >
                {/* 인기 뱃지 */}
                {plan.badge && (
                  <div className="absolute -top-3 left-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg">
                    {plan.badge}
                  </div>
                )}

                {/* 라디오 인디케이터 */}
                <div className={`
                  absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center
                  ${isSelected ? 'border-amber-500 bg-amber-500' : 'border-gray-600'}
                `}>
                  {isSelected && <Check size={12} className="text-white" />}
                </div>

                <p className="text-sm text-gray-400 mb-1">{plan.period}</p>
                <p className="text-2xl font-bold text-white mb-1">{plan.priceLabel}</p>
                {id === 'premium_yearly' && (
                  <p className="text-xs text-amber-400 mb-3">월 6,658원 · 연 33% 절약</p>
                )}

                <div className="space-y-2 mt-4">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <Check size={14} className={isSelected ? 'text-amber-400' : 'text-gray-600'} />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        {/* CTA */}
        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className={`
            w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500
            text-white font-bold text-lg shadow-lg shadow-amber-500/20
            hover:shadow-xl hover:-translate-y-0.5
            transition-all duration-200
            flex items-center justify-center gap-2
            disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
          `}
        >
          {isProcessing ? (
            <span className="animate-pulse">결제 처리 중...</span>
          ) : (
            <>
              <Crown size={20} fill="currentColor" />
              {PLANS[selectedPlan].priceLabel}로 시작하기
            </>
          )}
        </button>

        {/* 보증 */}
        <div className="mt-6 flex items-center justify-center gap-6 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <Shield size={14} />
            <span>안전한 결제</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Sparkles size={14} />
            <span>즉시 활성화</span>
          </div>
          <span>언제든 해지 가능</span>
        </div>

        {/* 결제사 정보 */}
        <p className="text-center text-[11px] text-gray-600 mt-4">
          토스페이먼츠를 통한 안전한 결제 · PCI DSS 인증
        </p>
      </div>
    </div>
  );
}
