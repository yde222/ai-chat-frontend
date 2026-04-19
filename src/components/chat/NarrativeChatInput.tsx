'use client';

import { useState, useRef, KeyboardEvent } from 'react';

/**
 * NarrativeChatInput — 내러티브 모드 전용 입력 컴포넌트
 *
 * Whif.io 벤치마크:
 * - 기본: 대사 + 지문 혼합 입력
 * - 하단 태그: ❝❞ 대사, ✱ 이탤릭(지문), + 추천
 * - *사이에 대사 지문을 넣어보세요* 가이드
 *
 * 입력 규칙:
 * - "큰따옴표" → 대사 (캐릭터가 유저 발화로 인식)
 * - *별표* → 지문/행동 (캐릭터가 유저 행동으로 인식)
 * - 그냥 텍스트 → 대사로 자동 처리
 */

interface NarrativeChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function NarrativeChatInput({
  onSend,
  disabled = false,
  placeholder,
}: NarrativeChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (!message.trim() || disabled) return;
    onSend(message.trim());
    setMessage('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const insertWrapper = (wrapper: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = message.slice(start, end);

    let newText: string;
    let cursorPos: number;

    if (selected) {
      // 선택된 텍스트를 래핑
      newText = message.slice(0, start) + wrapper + selected + wrapper + message.slice(end);
      cursorPos = end + wrapper.length * 2;
    } else {
      // 빈 래퍼 삽입 후 커서를 안에 배치
      newText = message.slice(0, start) + wrapper + wrapper + message.slice(end);
      cursorPos = start + wrapper.length;
    }

    setMessage(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = cursorPos;
    }, 0);
  };

  const handleAutoResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
  };

  return (
    <div className="border-t border-gray-800 bg-gray-950/90 backdrop-blur">
      {/* 입력 태그 바 */}
      <div className="flex items-center gap-2 px-4 pt-2">
        <button
          onClick={() => insertWrapper('"')}
          className="flex items-center gap-1 px-2 py-1 text-xs text-purple-400 bg-purple-500/10 rounded-full hover:bg-purple-500/20 transition"
        >
          &#10077;&#10078; 대사
        </button>
        <button
          onClick={() => insertWrapper('*')}
          className="flex items-center gap-1 px-2 py-1 text-xs text-pink-400 bg-pink-500/10 rounded-full hover:bg-pink-500/20 transition"
        >
          &#10023; 이탤릭
        </button>
      </div>

      {/* 입력 영역 */}
      <div className="flex items-end gap-2 px-4 py-3">
        <button className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-300 transition">
          +
        </button>
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleAutoResize}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          rows={1}
          placeholder={placeholder || '*사이에 대사 지문을 넣어보세요.'}
          className="flex-1 px-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-xl text-sm text-white placeholder-gray-600 resize-none focus:outline-none focus:border-purple-500/50 min-h-[40px]"
        />
        <button
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg transition ${
            message.trim() && !disabled
              ? 'bg-purple-600 text-white hover:bg-purple-500'
              : 'bg-gray-800 text-gray-600'
          }`}
        >
          &#187;
        </button>
      </div>
    </div>
  );
}
