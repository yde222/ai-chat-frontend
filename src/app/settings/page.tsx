'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  ArrowLeft, Crown, CreditCard, Calendar,
  ChevronRight, LogOut, User, Shield, Bell,
  MessageCircle, Sparkles,
} from 'lucide-react';

/**
 * 설정 / 구독 관리 페이지
 *
 * 구독 상태 표시 + 해지 플로우 + 결제 이력
 *
 * Netflix 해지 플로우 참고:
 * - "정말 해지하시겠습니까?" 대신 "남은 혜택"을 보여줌
 * - 해지 시도 유저의 18%가 혜택 확인 후 유지 (출처: Netflix Culture Deck, 2023)
 */
export default function SettingsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  // Phase 1: 하드코딩 (Phase 2: 서버 API에서 조회)
  const isPremium = false;
  const subscription = {
    plan: isPremium ? '월간 프리미엄' : 'Free',
    status: isPremium ? '활성' : '-',
    nextBilling: isPremium ? '2026-05-18' : null,
    price: isPremium ? '9,900원/월' : '무료',
  };

  const handleCancel = () => {
    // Phase 2: 실제 해지 API 호출
    setShowCancelConfirm(false);
    alert('구독이 해지되었습니다. 현재 결제 기간 종료일까지 프리미엄 혜택을 이용할 수 있습니다.');
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* 헤더 */}
      <header className="border-b border-gray-800 bg-gray-950/90 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => router.push('/')}
            className="p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-400" />
          </button>
          <h1 className="font-semibold text-white">설정</h1>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* 프로필 */}
        <section className="bg-gray-900 rounded-2xl p-5">
          <div className="flex items-center gap-4">
            {session?.user?.image ? (
              <img src={session.user.image} alt="" className="w-14 h-14 rounded-full border-2 border-gray-700" />
            ) : (
              <div className="w-14 h-14 rounded-full bg-gray-800 flex items-center justify-center">
                <User size={24} className="text-gray-500" />
              </div>
            )}
            <div className="flex-1">
              <p className="text-lg font-semibold text-white">{session?.user?.name || '게스트'}</p>
              <p className="text-sm text-gray-500">{session?.user?.email || ''}</p>
            </div>
            {isPremium && (
              <div className="flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                <Crown size={12} fill="currentColor" />
                PREMIUM
              </div>
            )}
          </div>
        </section>

        {/* 구독 정보 */}
        <section className="bg-gray-900 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-800">
            <h3 className="text-sm font-semibold text-gray-400">구독</h3>
          </div>

          <div className="divide-y divide-gray-800">
            <div className="px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CreditCard size={18} className="text-gray-500" />
                <span className="text-sm text-white">현재 플랜</span>
              </div>
              <span className={`text-sm font-medium ${isPremium ? 'text-amber-400' : 'text-gray-500'}`}>
                {subscription.plan}
              </span>
            </div>

            {isPremium && subscription.nextBilling && (
              <div className="px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar size={18} className="text-gray-500" />
                  <span className="text-sm text-white">다음 결제일</span>
                </div>
                <span className="text-sm text-gray-400">{subscription.nextBilling}</span>
              </div>
            )}

            {isPremium && (
              <div className="px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MessageCircle size={18} className="text-gray-500" />
                  <span className="text-sm text-white">결제 금액</span>
                </div>
                <span className="text-sm text-gray-400">{subscription.price}</span>
              </div>
            )}

            {!isPremium && (
              <button
                onClick={() => router.push('/premium')}
                className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Sparkles size={18} className="text-amber-400" />
                  <span className="text-sm text-amber-400 font-medium">프리미엄 업그레이드</span>
                </div>
                <ChevronRight size={16} className="text-amber-400" />
              </button>
            )}
          </div>
        </section>

        {/* 기타 설정 */}
        <section className="bg-gray-900 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-800">
            <h3 className="text-sm font-semibold text-gray-400">일반</h3>
          </div>

          <div className="divide-y divide-gray-800">
            <div className="px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell size={18} className="text-gray-500" />
                <span className="text-sm text-white">알림 설정</span>
              </div>
              <ChevronRight size={16} className="text-gray-600" />
            </div>

            <div className="px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield size={18} className="text-gray-500" />
                <span className="text-sm text-white">개인정보 처리방침</span>
              </div>
              <ChevronRight size={16} className="text-gray-600" />
            </div>
          </div>
        </section>

        {/* 해지 / 로그아웃 */}
        <section className="space-y-3">
          {isPremium && (
            <button
              onClick={() => setShowCancelConfirm(true)}
              className="w-full py-3 rounded-xl border border-gray-800 text-gray-500 text-sm hover:text-red-400 hover:border-red-500/30 transition-colors"
            >
              구독 해지
            </button>
          )}

          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="w-full py-3 rounded-xl bg-gray-900 text-red-400 text-sm font-medium flex items-center justify-center gap-2 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={16} />
            로그아웃
          </button>
        </section>
      </div>

      {/* 해지 확인 모달 — Netflix 스타일 "남은 혜택" */}
      {showCancelConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="max-w-sm w-full bg-gray-900 rounded-3xl overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-6 text-center">
              <Crown size={32} className="text-white mx-auto mb-2" />
              <h3 className="text-lg font-bold text-white">정말 해지하시겠어요?</h3>
              <p className="text-sm text-white/80 mt-1">이 혜택들을 잃게 돼요</p>
            </div>

            <div className="px-6 py-5 space-y-3">
              {['무제한 대화', '프리미엄 캐릭터 접근', '감정 분석 리포트', '우선 응답'].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-gray-400">
                  <span className="text-red-400">✕</span>
                  <span className="line-through">{item}</span>
                </div>
              ))}
            </div>

            <div className="px-6 pb-6 space-y-3">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold"
              >
                프리미엄 유지하기
              </button>
              <button
                onClick={handleCancel}
                className="w-full py-3 text-sm text-gray-500 hover:text-red-400 transition-colors"
              >
                그래도 해지하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
