'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import CharacterCard from '@/components/character/CharacterCard';
import DailyMissionPanel from '@/components/retention/DailyMissionPanel';
import AttendanceCalendar from '@/components/retention/AttendanceCalendar';
import RewardToast from '@/components/retention/RewardToast';
import { characters } from '@/lib/characters';
import { Heart, Sparkles, LogOut, User, Calendar, Flame, Settings, BarChart3 } from 'lucide-react';

/**
 * Phase 1: 클라이언트 더미 데이터로 리텐션 UI 렌더링
 * Phase 2: 서버 API 연동 (소켓 이벤트 → 실시간 동기화)
 */

// 더미 출석 데이터 (Phase 1)
const generateDummyAttendance = () => {
  const dates: string[] = [];
  const now = new Date();
  const today = now.getDate();
  // 최근 5일 출석한 것으로 가정
  for (let i = 4; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(today - i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
};

// 미션 타입
interface Mission {
  id: string;
  type: string;
  title: string;
  description: string;
  emoji: string;
  current: number;
  target: number;
  status: 'active' | 'completed' | 'claimed';
  reward: { bonusMessages: number; affinityBoost: number };
}

// 더미 미션 데이터 (Phase 1)
const DUMMY_MISSIONS: Mission[] = [
  {
    id: 'm1',
    type: 'chat_count',
    title: '수다쟁이',
    description: '캐릭터와 5번 대화하기',
    emoji: '💬',
    current: 0,
    target: 5,
    status: 'active',
    reward: { bonusMessages: 3, affinityBoost: 0 },
  },
  {
    id: 'm2',
    type: 'choice_select',
    title: '운명의 선택',
    description: '스토리 선택지 2번 선택하기',
    emoji: '🎯',
    current: 0,
    target: 2,
    status: 'active',
    reward: { bonusMessages: 2, affinityBoost: 3 },
  },
  {
    id: 'm3',
    type: 'emotion_collect',
    title: '감정 수집가',
    description: '3가지 이상의 감정 반응 이끌어내기',
    emoji: '🎭',
    current: 0,
    target: 3,
    status: 'active',
    reward: { bonusMessages: 3, affinityBoost: 2 },
  },
];

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();
  const userIsPremium = false;

  const [showCalendar, setShowCalendar] = useState(false);
  const [showRewardToast, setShowRewardToast] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);
  const [missions, setMissions] = useState(DUMMY_MISSIONS);
  const streak = 5;
  const monthlyDates = generateDummyAttendance();

  // 첫 진입 시 출석 체크 (Phase 1: 자동)
  useEffect(() => {
    if (session?.user && !checkedIn) {
      setCheckedIn(true);
      // 출석 보상 토스트 표시
      setTimeout(() => setShowRewardToast(true), 800);
    }
  }, [session?.user]);

  const handleClaimReward = (missionId: string) => {
    setMissions((prev) =>
      prev.map((m) => m.id === missionId ? { ...m, status: 'claimed' as const } : m),
    );
  };

  return (
    <main className="min-h-screen">
      {/* 출석 보상 토스트 */}
      <RewardToast
        type="attendance"
        message={`${streak}일 연속 출석!`}
        bonusMessages={5}
        visible={showRewardToast}
        onDismiss={() => setShowRewardToast(false)}
      />

      {/* 출석 캘린더 모달 */}
      <AttendanceCalendar
        streak={streak}
        monthlyDates={monthlyDates}
        todayReward={{ bonusMessages: 5, label: '5일 연속!' }}
        visible={showCalendar}
        onDismiss={() => setShowCalendar(false)}
      />

      {/* 헤더 */}
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="text-pink-500" size={24} />
            <h1 className="text-xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
              AI Romance
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {/* 연속 출석 뱃지 */}
            <button
              onClick={() => setShowCalendar(true)}
              className="flex items-center gap-1.5 text-xs bg-orange-500/10 text-orange-400 rounded-full px-3 py-1.5 hover:bg-orange-500/20 transition-colors"
            >
              <Flame size={14} />
              <span className="font-medium">{streak}일</span>
            </button>

            {/* 출석 캘린더 버튼 */}
            <button
              onClick={() => setShowCalendar(true)}
              className="p-1.5 rounded-lg hover:bg-gray-800 transition-colors text-gray-500 hover:text-gray-300"
              title="출석 캘린더"
            >
              <Calendar size={16} />
            </button>

            {/* 유저 정보 + 로그아웃 */}
            {session?.user && (
              <>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt=""
                      className="w-7 h-7 rounded-full border border-gray-700"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center">
                      <User size={14} className="text-gray-500" />
                    </div>
                  )}
                  <span className="hidden sm:inline">{session.user.name}</span>
                </div>
                <button
                  onClick={() => router.push('/admin')}
                  className="p-1.5 rounded-lg hover:bg-gray-800 transition-colors text-gray-500 hover:text-sky-400"
                  title="운영 대시보드"
                >
                  <BarChart3 size={16} />
                </button>
                <button
                  onClick={() => router.push('/settings')}
                  className="p-1.5 rounded-lg hover:bg-gray-800 transition-colors text-gray-500 hover:text-gray-300"
                  title="설정"
                >
                  <Settings size={16} />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 히어로 */}
      <section className="max-w-5xl mx-auto px-4 py-10 text-center">
        <div className="inline-flex items-center gap-2 bg-pink-500/10 border border-pink-500/20 rounded-full px-4 py-1.5 mb-6">
          <Sparkles size={14} className="text-pink-400" />
          <span className="text-sm text-pink-300">AI 실시간 대화</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">
          설레는 만남,
          <br />
          <span className="bg-gradient-to-r from-pink-400 via-rose-400 to-red-400 bg-clip-text text-transparent">
            나만의 이야기
          </span>
        </h2>
        <p className="text-gray-400 max-w-md mx-auto leading-relaxed">
          AI 캐릭터와 실시간으로 대화하며 나만의 연애 스토리를 만들어보세요.
          당신의 선택이 관계를 바꿉니다.
        </p>
      </section>

      {/* 일일 미션 패널 + 캐릭터 그리드 */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        {/* 일일 미션 */}
        <DailyMissionPanel
          missions={missions}
          onClaimReward={handleClaimReward}
          className="mb-8"
        />

        {/* 캐릭터 */}
        <div className="flex items-center gap-2 mb-6">
          <h3 className="text-lg font-semibold">캐릭터</h3>
          <span className="text-sm text-gray-500">{characters.length}명</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {characters.map((char) => (
            <CharacterCard key={char.id} character={char} userIsPremium={userIsPremium} />
          ))}
        </div>
      </section>
    </main>
  );
}
