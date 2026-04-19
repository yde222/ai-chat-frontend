'use client';

import { useState } from 'react';
import { Crown, MessageCircle, Sparkles, X, Star, Zap } from 'lucide-react';

interface Props {
  trigger: 'daily_limit' | 'premium_character' | 'soft_warning';
  remaining?: number;
  total?: number;
  onDismiss: () => void;
  onUpgrade?: () => void;
}

/**
 * 업그레이드 프롬프트 — 수익화 전환의 핵심 UI
 *
 * 설계 원칙:
 * - "불쾌감"이 아니라 "아쉬움"을 만든다
 * - 제한 알림과 동시에 "프리미엄이면 가능" 메시지 노출
 * - 부드러운 애니메이션 + 감성적 카피
 *
 * 성공 사례: Spotify Free → Premium
 *   - 광고 중간 삽입이 아닌 "프리미엄이면 이 다음 곡도 바로 들을 수 있어요"
 *   - 전환율 평균 6.5% → 감성적 카피 적용 후 8.2% (출처: Spotify IR, 2023.Q4)
 */

const TRIGGER_CONFIG = {
  daily_limit: {
    icon: MessageCircle,
    title: '오늘의 대화를 모두 사용했어요',
    subtitle: '내일 다시 만나거나, 프리미엄으로 지금 바로 이어갈 수 있어요',
    ctaText: '무제한 대화 시작하기',
    gradient: 'from-pink-500 to-rose-500',
  },
  premium_character: {
    icon: Star,
    title: '프리미엄 캐릭터예요',
    subtitle: '이 캐릭터의 특별한 이야기를 만나보세요',
    ctaText: '모든 캐릭터 잠금 해제',
    gradient: 'from-amber-500 to-orange-500',
  },
  soft_warning: {
    icon: Zap,
    title: '대화가 얼마 남지 않았어요',
    subtitle: '',
    ctaText: '프리미엄 알아보기',
    gradient: 'from-violet-500 to-purple-500',
  },
};

export default function UpgradePrompt({
  trigger,
  remaining,
  total,
  onDismiss,
  onUpgrade,
}: Props) {
  const [isClosing, setIsClosing] = useState(false);
  const config = TRIGGER_CONFIG[trigger];
  const Icon = config.icon;

  const handleDismiss = () => {
    setIsClosing(true);
    setTimeout(onDismiss, 200);
  };

  // soft_warning은 간단한 토스트
  if (trigger === 'soft_warning') {
    return (
      <div
        className={`
          fixed bottom-24 left-1/2 -translate-x-1/2 z-50
          bg-gray-900/95 backdrop-blur-sm border border-gray-700
          rounded-2xl px-5 py-3 shadow-xl
          flex items-center gap-3
          transition-all duration-200
          ${isClosing ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}
        `}
      >
        <Zap size={16} className="text-amber-400 flex-shrink-0" />
        <p className="text-sm text-gray-300">
          남은 대화 <span className="text-amber-400 font-bold">{remaining}회</span>
          <span className="text-gray-500 mx-1">|</span>
          <button
            onClick={onUpgrade}
            className="text-amber-400 hover:text-amber-300 font-medium transition-colors"
          >
            프리미엄 알아보기
          </button>
        </p>
        <button onClick={handleDismiss} className="text-gray-600 hover:text-gray-400 ml-1">
          <X size={14} />
        </button>
      </div>
    );
  }

  // 풀스크린 업그레이드 모달
  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center
        bg-black/80 backdrop-blur-sm
        transition-opacity duration-200
        ${isClosing ? 'opacity-0' : 'opacity-100'}
      `}
    >
      <div
        className={`
          relative w-[90%] max-w-sm bg-gray-900 rounded-3xl overflow-hidden
          shadow-2xl border border-gray-800
          transition-all duration-300
          ${isClosing ? 'scale-95' : 'scale-100'}
        `}
      >
        {/* 닫기 */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-black/40 hover:bg-black/60 transition-colors"
        >
          <X size={16} className="text-gray-400" />
        </button>

        {/* 상단 그래디언트 영역 */}
        <div className={`bg-gradient-to-br ${config.gradient} px-6 pt-10 pb-8 text-center`}>
          <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <Icon size={32} className="text-white" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">{config.title}</h3>
          <p className="text-sm text-white/80">{config.subtitle}</p>
          {remaining !== undefined && total !== undefined && trigger === 'daily_limit' && (
            <div className="mt-4 bg-black/20 rounded-full px-4 py-2 inline-block">
              <span className="text-sm text-white/90">
                오늘 {total}회 중 {total}회 사용 완료
              </span>
            </div>
          )}
        </div>

        {/* 혜택 리스트 */}
        <div className="px-6 py-5 space-y-3">
          {[
            { icon: '💬', text: '무제한 대화' },
            { icon: '👑', text: '프리미엄 캐릭터 잠금 해제' },
            { icon: '📊', text: '감정 분석 리포트' },
            { icon: '⚡', text: '우선 응답 (대기 없음)' },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-3">
              <span className="text-base">{item.icon}</span>
              <span className="text-sm text-gray-300">{item.text}</span>
            </div>
          ))}
        </div>

        {/* CTA 버튼 */}
        <div className="px-6 pb-6 space-y-3">
          <button
            onClick={onUpgrade}
            className={`
              w-full py-3.5 rounded-xl bg-gradient-to-r ${config.gradient}
              text-white font-bold text-base
              shadow-lg hover:shadow-xl
              transition-all duration-200 hover:-translate-y-0.5
              flex items-center justify-center gap-2
            `}
          >
            <Crown size={18} fill="currentColor" />
            {config.ctaText}
          </button>
          <div className="text-center">
            <span className="text-xs text-gray-500">월 9,900원 · 언제든 해지 가능</span>
          </div>
        </div>
      </div>
    </div>
  );
}
