'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Crown, Check, ArrowRight } from 'lucide-react';

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'confirming' | 'success' | 'error'>('confirming');
  const [errorMessage, setErrorMessage] = useState('');

  const paymentKey = searchParams.get('paymentKey');
  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');

  useEffect(() => {
    if (!paymentKey || !orderId || !amount) {
      setStatus('error');
      setErrorMessage('결제 정보가 누락되었습니다.');
      return;
    }
    confirmPayment();
  }, []);

  const confirmPayment = async () => {
    try {
      const response = await fetch('/api/payment/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentKey, orderId, amount: Number(amount) }),
      });
      const data = await response.json();
      if (data.success) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMessage(data.error || '결제 승인에 실패했습니다.');
      }
    } catch {
      setStatus('error');
      setErrorMessage('서버와 통신에 실패했습니다.');
    }
  };

  if (status === 'confirming') {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-white font-medium">결제를 확인하고 있어요...</p>
          <p className="text-sm text-gray-500 mt-1">잠시만 기다려주세요</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
        <div className="max-w-sm w-full text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-2xl flex items-center justify-center">
            <span className="text-3xl">😢</span>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">결제에 실패했어요</h2>
          <p className="text-sm text-gray-400 mb-6">{errorMessage}</p>
          <button
            onClick={() => router.push('/premium')}
            className="w-full py-3 rounded-xl bg-gray-800 text-white font-medium hover:bg-gray-700 transition-colors"
          >
            다시 시도하기
          </button>
          <button
            onClick={() => router.push('/')}
            className="w-full py-3 mt-2 text-sm text-gray-500 hover:text-gray-300 transition-colors"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="max-w-sm w-full text-center">
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl shadow-amber-500/30 animate-bounce">
            <Crown size={40} className="text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
            <Check size={16} className="text-white" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">프리미엄 활성화 완료!</h2>
        <p className="text-sm text-gray-400 mb-8">이제 모든 캐릭터와 무제한으로 대화할 수 있어요</p>

        <div className="bg-gray-900 rounded-2xl p-5 mb-6 text-left space-y-3">
          {[
            { icon: '💬', text: '무제한 대화' },
            { icon: '👑', text: '프리미엄 캐릭터 잠금 해제' },
            { icon: '📊', text: '감정 분석 리포트' },
            { icon: '⚡', text: '우선 응답' },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-3">
              <span>{item.icon}</span>
              <span className="text-sm text-gray-300">{item.text}</span>
              <Check size={14} className="text-green-400 ml-auto" />
            </div>
          ))}
        </div>

        <button
          onClick={() => router.push('/')}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
        >
          대화 시작하기
          <ArrowRight size={18} />
        </button>

        <p className="text-[11px] text-gray-600 mt-4">주문번호: {orderId}</p>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-950 flex items-center justify-center"><div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" /></div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
