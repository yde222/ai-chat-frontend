'use client';

import { ChatMessage, StoryChoice } from '@/types';
import StoryChoices from './StoryChoices';

interface Props {
  message: ChatMessage;
  characterAvatar?: string;
  onSelectChoice?: (choice: StoryChoice) => void;
}

const emotionEmoji: Record<string, string> = {
  NEUTRAL: '',
  JOY: '😊',
  SADNESS: '😢',
  ANGER: '😤',
  SURPRISE: '😮',
  AFFECTION: '🥰',
  FEAR: '😰',
  DISGUST: '😒',
  EXCITEMENT: '✨',
  SHY: '😳',
};

export default function ChatBubble({ message, characterAvatar, onSelectChoice }: Props) {
  const isUser = message.role === 'user';
  const hasChoices = !isUser && message.choices && message.choices.length > 0;

  return (
    <div>
      <div className={`msg-enter flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
        {/* 아바타 */}
        {!isUser && (
          <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-lg">
            {characterAvatar || '🤖'}
          </div>
        )}

        {/* 메시지 */}
        <div className={`max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
          <div
            className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
              isUser
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-tr-sm'
                : 'bg-gray-800 text-gray-100 rounded-tl-sm'
            } ${message.isStreaming ? 'streaming-cursor' : ''}`}
          >
            {message.content}
          </div>

          {/* 감정 + 시간 */}
          <div className={`flex items-center gap-1.5 mt-1 text-xs text-gray-600 ${isUser ? 'justify-end' : ''}`}>
            {message.emotion && emotionEmoji[message.emotion] && (
              <span>{emotionEmoji[message.emotion]}</span>
            )}
            <span>
              {new Date(message.timestamp).toLocaleTimeString('ko-KR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        </div>
      </div>

      {/* 스토리 선택지 */}
      {hasChoices && onSelectChoice && (
        <StoryChoices
          choices={message.choices!}
          onSelect={onSelectChoice}
          disabled={!!message.selectedChoiceId}
        />
      )}
    </div>
  );
}
