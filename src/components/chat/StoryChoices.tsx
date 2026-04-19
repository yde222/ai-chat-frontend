'use client';

import { useState } from 'react';
import { StoryChoice } from '@/types';
import { Heart, HeartCrack, Minus } from 'lucide-react';

interface Props {
  choices: StoryChoice[];
  onSelect: (choice: StoryChoice) => void;
  disabled?: boolean;
}

const effectIcons = {
  positive: <Heart size={12} className="text-pink-400" />,
  neutral: <Minus size={12} className="text-gray-500" />,
  negative: <HeartCrack size={12} className="text-blue-400" />,
};

const effectBorders = {
  positive: 'border-pink-500/30 hover:border-pink-500/60 hover:bg-pink-500/5',
  neutral: 'border-gray-700 hover:border-gray-500 hover:bg-gray-800/50',
  negative: 'border-blue-500/20 hover:border-blue-500/40 hover:bg-blue-500/5',
};

const selectedStyles = {
  positive: 'border-pink-500 bg-pink-500/10 scale-[1.02]',
  neutral: 'border-gray-500 bg-gray-800 scale-[1.02]',
  negative: 'border-blue-500 bg-blue-500/10 scale-[1.02]',
};

export default function StoryChoices({ choices, onSelect, disabled }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  if (!choices || choices.length === 0) return null;

  const handleSelect = (choice: StoryChoice) => {
    if (disabled || selectedId || isAnimating) return;

    setSelectedId(choice.id);
    setIsAnimating(true);

    // 선택 애니메이션 후 콜백
    setTimeout(() => {
      onSelect(choice);
      setIsAnimating(false);
    }, 600);
  };

  return (
    <div className="msg-enter flex flex-col gap-2 max-w-[85%] mx-auto my-3">
      {/* 선택지 헤더 */}
      <div className="text-center text-xs text-gray-600 mb-1">
        어떻게 대답할까요?
      </div>

      {choices.map((choice, idx) => {
        const isSelected = selectedId === choice.id;
        const isOther = selectedId && !isSelected;

        return (
          <button
            key={choice.id}
            onClick={() => handleSelect(choice)}
            disabled={disabled || !!selectedId}
            className={`
              relative w-full text-left px-4 py-3 rounded-xl border text-sm
              transition-all duration-300 ease-out
              ${isSelected
                ? selectedStyles[choice.effect]
                : isOther
                  ? 'border-gray-800 bg-gray-900/50 opacity-40 scale-[0.98]'
                  : effectBorders[choice.effect]
              }
              ${!selectedId && !disabled ? 'cursor-pointer active:scale-[0.98]' : 'cursor-default'}
            `}
            style={{
              animationDelay: `${idx * 100}ms`,
              animation: !selectedId ? `fadeInUp 0.3s ease-out ${idx * 100}ms both` : undefined,
            }}
          >
            <div className="flex items-start gap-3">
              {/* 이모지 */}
              <span className="text-lg flex-shrink-0 mt-0.5">{choice.emoji}</span>

              <div className="flex-1 min-w-0">
                {/* 선택지 텍스트 */}
                <p className={`leading-relaxed ${
                  isSelected ? 'text-white font-medium' : isOther ? 'text-gray-600' : 'text-gray-200'
                }`}>
                  {choice.text}
                </p>

                {/* 호감도 힌트 */}
                {choice.affinityHint && !isOther && (
                  <div className="flex items-center gap-1 mt-1.5">
                    {effectIcons[choice.effect]}
                    <span className={`text-xs ${
                      choice.effect === 'positive' ? 'text-pink-400' :
                      choice.effect === 'negative' ? 'text-blue-400' : 'text-gray-500'
                    }`}>
                      {choice.affinityHint}
                    </span>
                  </div>
                )}
              </div>

              {/* 선택 체크 */}
              {isSelected && (
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-pink-500 flex items-center justify-center mt-0.5">
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
