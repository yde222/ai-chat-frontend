'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, RefreshCw } from 'lucide-react';

function PaymentFailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const errorCode = searchParams.get('code') || 'UNKNOWN';
  const errorMessage = searchParams.get('message') || '알 수 없는 오류가 발생했습니다.';

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="max-w-sm w-full text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-2xl flex items-center justify-center">
          <span className="text-3xl">😔</span>
        </div>

        <h2 className="text-xl font-bold text-white mb-2">결제가 완료되지 않았어요</h2>
        <p className="text-sm text-gray-400 mb-2">{decodeURIComponent(errorMessage)}</p>
        <p className="text-[11px] text-gray-600 mb-8">에러 코드: {errorCode}</p>

        <div className="space-y-3">
          <button
            onClick={() => router.push('/premium')}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium flex items-center justify-center gap-2 hover:shadow-lg transition-all"
          >
            <RefreshCw size={16} />
            다시 시도하기
          </button>
          <button
            onClick={() => router.push('/')}
            className="w-full py-3 rounded-xl bg-gray-800 text-gray-300 font-medium hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft size={16} />
            홈으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PaymentFailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-950 flex items-center justify-center"><p className="text-gray-400">로딩 중...</p></div>}>
      <PaymentFailContent />
    </Suspense>
  );
}
