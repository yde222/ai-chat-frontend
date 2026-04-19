'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Heart, Sparkles, MessageCircleHeart } from 'lucide-react';

export default function LoginPage() {
  const [nickname, setNickname] = useState('');
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleSocialLogin = async (provider: string) => {
    setIsLoading(provider);
    await signIn(provider, { callbackUrl: '/' });
  };

  const handleGuestLogin = async () => {
    if (!nickname.trim()) return;
    setIsLoading('guest');
    await signIn('guest', {
      nickname: nickname.trim(),
      callbackUrl: '/',
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* 배경 그라디언트 효과 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-rose-500/5 rounded-full blur-2xl" />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        {/* 로고 */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 mb-4 shadow-lg shadow-pink-500/25">
            <Heart size={32} className="text-white" fill="white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">
            <span className="bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 bg-clip-text text-transparent">
              AI Romance
            </span>
          </h1>
          <p className="text-gray-500 text-sm">당신의 이야기가 시작되는 곳</p>
        </div>

        {/* 소셜 로그인 버튼 */}
        <div className="space-y-3 mb-6">
          {/* Google */}
          <button
            onClick={() => handleSocialLogin('google')}
            disabled={isLoading !== null}
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 font-medium py-3 px-4 rounded-xl hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            {isLoading === 'google' ? '로그인 중...' : 'Google로 시작하기'}
          </button>

          {/* Kakao */}
          <button
            onClick={() => handleSocialLogin('kakao')}
            disabled={isLoading !== null}
            className="w-full flex items-center justify-center gap-3 font-medium py-3 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#FEE500', color: '#191919' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#191919" d="M12 3C6.48 3 2 6.48 2 10.5c0 2.58 1.68 4.85 4.22 6.13-.13.47-.84 3.05-.87 3.24 0 0-.02.14.07.2.09.05.2.02.2.02.26-.04 3.04-2 3.98-2.63.77.11 1.57.17 2.4.17 5.52 0 10-3.48 10-7.5S17.52 3 12 3z" />
            </svg>
            {isLoading === 'kakao' ? '로그인 중...' : '카카오로 시작하기'}
          </button>
        </div>

        {/* 구분선 */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-gray-800" />
          <span className="text-xs text-gray-600">또는</span>
          <div className="flex-1 h-px bg-gray-800" />
        </div>

        {/* 게스트 로그인 */}
        <div className="space-y-3">
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGuestLogin()}
            placeholder="닉네임을 입력하세요"
            maxLength={12}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/25 transition-colors"
          />
          <button
            onClick={handleGuestLogin}
            disabled={!nickname.trim() || isLoading !== null}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium py-3 px-4 rounded-xl hover:shadow-lg hover:shadow-pink-500/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Sparkles size={16} />
            {isLoading === 'guest' ? '입장 중...' : '게스트로 시작하기'}
          </button>
        </div>

        {/* 하단 안내 */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs text-gray-600">
            <MessageCircleHeart size={14} className="text-pink-500/50" />
            <span>AI 캐릭터와 나만의 연애 시뮬레이션</span>
          </div>
        </div>
      </div>
    </div>
  );
}
