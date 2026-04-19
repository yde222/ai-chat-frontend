'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Character } from '@/types';
import { Heart, Lock, Crown } from 'lucide-react';
import PremiumBadge from '@/components/monetization/PremiumBadge';
import UpgradePrompt from '@/components/monetization/UpgradePrompt';

interface Props {
  character: Character;
  userIsPremium?: boolean;
}

export default function CharacterCard({ character, userIsPremium = false }: Props) {
  const [showUpgrade, setShowUpgrade] = useState(false);
  const isLocked = character.isPremium && !userIsPremium;

  const handleClick = (e: React.MouseEvent) => {
    if (isLocked) {
      e.preventDefault();
      setShowUpgrade(true);
    }
  };

  const cardContent = (
    <div
      className={`
        group relative overflow-hidden rounded-2xl border bg-gray-900 transition-all duration-300 cursor-pointer
        ${isLocked
          ? 'border-amber-500/30 hover:border-amber-500/60 hover:shadow-lg hover:shadow-amber-500/10'
          : 'border-gray-800 hover:border-pink-500/50 hover:shadow-lg hover:shadow-pink-500/10'}
        hover:-translate-y-1
      `}
      onClick={handleClick}
    >
      {/* 캐릭터 아바타 영역 */}
      <div className="relative h-48 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center overflow-hidden">
        {character.avatarImage ? (
          <div className={`relative w-32 h-32 group-hover:scale-110 transition-transform duration-300 ${isLocked ? 'opacity-70' : ''}`}>
            <img
              src={character.avatarImage}
              alt={character.name}
              className="w-full h-full object-cover rounded-full shadow-xl"
            />
            <div className="absolute inset-0 rounded-full bg-pink-500/0 group-hover:bg-pink-500/10 transition-colors duration-300" />
          </div>
        ) : (
          <span className={`text-7xl group-hover:scale-110 transition-transform duration-300 ${isLocked ? 'opacity-70' : ''}`}>
            {character.avatar}
          </span>
        )}

        {/* 잠금 오버레이 */}
        {isLocked && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
            <div className="bg-black/60 rounded-2xl px-4 py-3 flex flex-col items-center gap-1.5">
              <Lock size={24} className="text-amber-400" />
              <span className="text-xs text-amber-300 font-medium">프리미엄 전용</span>
            </div>
          </div>
        )}

        {/* 프리미엄 뱃지 (좌상단) */}
        {character.isPremium && (
          <div className="absolute top-3 left-3">
            <PremiumBadge size="sm" />
          </div>
        )}

        {/* 호감도 뱃지 */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1 text-xs">
          <Heart size={12} className="text-pink-400" />
          <span className="text-pink-300">{character.affinity}%</span>
        </div>

        {/* 성격 태그 */}
        <div className="absolute bottom-3 left-3">
          <span className={`text-xs px-2 py-0.5 rounded-full border ${
            isLocked
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
              : 'bg-pink-500/20 text-pink-300 border-pink-500/30'
          }`}>
            {character.personality}
          </span>
        </div>
      </div>

      {/* 캐릭터 정보 */}
      <div className="p-4">
        <div className="flex items-baseline gap-2 mb-1">
          <h3 className="text-lg font-bold text-white">{character.name}</h3>
          <span className="text-xs text-gray-500">{character.age}세</span>
          {character.isPremium && (
            <Crown size={14} className="text-amber-400" />
          )}
        </div>
        <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">
          {character.description}
        </p>

        {/* 태그 */}
        <div className="flex gap-1.5 mt-3 flex-wrap">
          {character.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs text-gray-500 bg-gray-800 rounded-full px-2 py-0.5"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* CTA 버튼 */}
        <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className={`w-full py-2 rounded-lg text-center text-sm font-medium text-white bg-gradient-to-r ${
            isLocked
              ? 'from-amber-500 to-orange-500'
              : 'from-pink-500 to-rose-500'
          }`}>
            {isLocked ? '잠금 해제하기' : '대화 시작하기'}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {isLocked ? (
        <div>{cardContent}</div>
      ) : (
        <Link href={`/chat/${character.id}`}>{cardContent}</Link>
      )}

      {showUpgrade && (
        <UpgradePrompt
          trigger="premium_character"
          onDismiss={() => setShowUpgrade(false)}
          onUpgrade={() => {
            // Phase 2: 실제 결제 플로우 연결
            alert('프리미엄 결제 페이지로 이동합니다. (Phase 2에서 구현)');
            setShowUpgrade(false);
          }}
        />
      )}
    </>
  );
}
