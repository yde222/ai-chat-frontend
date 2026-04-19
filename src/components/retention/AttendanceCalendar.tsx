'use client';

import { useState, useEffect } from 'react';
import { Calendar, Flame, Gift, X } from 'lucide-react';

interface Props {
  streak: number;
  monthlyDates: string[]; // ['2026-04-01', '2026-04-02', ...]
  todayReward: { bonusMessages: number; label: string; special?: string } | null;
  visible: boolean;
  onDismiss: () => void;
}

/**
 * 출석 캘린더 모달
 *
 * 쿠키런 킹덤 스타일: 달력 + 연속 출석 보상 트래커
 * 핵심: "빈 칸"이 유저를 다시 데려옴 (심리적 미완 효과)
 */
export default function AttendanceCalendar({
  streak,
  monthlyDates,
  todayReward,
  visible,
  onDismiss,
}: Props) {
  const [isClosing, setIsClosing] = useState(false);

  if (!visible) return null;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onDismiss, 200);
  };

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const today = now.getDate();

  const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
  const checkedDays = new Set(
    monthlyDates
      .filter((d) => d.startsWith(monthStr))
      .map((d) => parseInt(d.split('-')[2], 10))
  );

  // 연속 출석 마일스톤
  const milestones = [3, 5, 7, 14, 30];
  const nextMilestone = milestones.find((m) => m > streak) || 30;

  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center
        bg-black/70 backdrop-blur-sm
        transition-opacity duration-200
        ${isClosing ? 'opacity-0' : 'opacity-100'}
      `}
      onClick={handleClose}
    >
      <div
        className={`
          w-[90%] max-w-sm bg-gray-900 rounded-3xl overflow-hidden
          shadow-2xl border border-gray-800
          transition-all duration-300
          ${isClosing ? 'scale-95' : 'scale-100'}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-5 pt-6 pb-5 relative">
          <button onClick={handleClose} className="absolute top-3 right-3 p-1 rounded-full bg-black/20">
            <X size={16} className="text-white/80" />
          </button>

          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Calendar size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">출석 체크</h3>
              <p className="text-sm text-white/80">
                {year}년 {month + 1}월
              </p>
            </div>
          </div>

          {/* 연속 출석 */}
          <div className="flex items-center gap-2 bg-black/20 rounded-xl px-4 py-2.5">
            <Flame size={18} className="text-yellow-300" />
            <span className="text-sm text-white font-medium">
              {streak}일 연속 출석
            </span>
            <span className="text-xs text-white/60 ml-auto">
              다음 보상까지 {nextMilestone - streak}일
            </span>
          </div>
        </div>

        {/* 캘린더 그리드 */}
        <div className="px-5 py-4">
          <div className="grid grid-cols-7 gap-1 mb-1">
            {['일', '월', '화', '수', '목', '금', '토'].map((d) => (
              <div key={d} className="text-center text-[10px] text-gray-600 py-1">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {/* 빈 칸 (월 시작 요일 보정) */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="w-full aspect-square" />
            ))}
            {/* 날짜들 */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isChecked = checkedDays.has(day);
              const isToday = day === today;
              const isPast = day < today;

              return (
                <div
                  key={day}
                  className={`
                    w-full aspect-square rounded-lg flex items-center justify-center text-xs font-medium
                    transition-all duration-200
                    ${isChecked
                      ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/30'
                      : isToday
                        ? 'bg-orange-500/20 text-orange-400 ring-1 ring-orange-500/50'
                        : isPast
                          ? 'text-gray-600'
                          : 'text-gray-500'}
                  `}
                >
                  {isChecked ? '✓' : day}
                </div>
              );
            })}
          </div>
        </div>

        {/* 오늘의 보상 */}
        {todayReward && (
          <div className="px-5 pb-5">
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 flex items-center gap-3">
              <Gift size={20} className="text-amber-400 flex-shrink-0" />
              <div>
                <p className="text-sm text-amber-300 font-medium">{todayReward.label}</p>
                <p className="text-xs text-amber-400/70">
                  보너스 메시지 +{todayReward.bonusMessages}회
                  {todayReward.special && ` · ${todayReward.special}`}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
