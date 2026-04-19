'use client';

import { NarrativeBlock } from '@/types';

/**
 * NarrativeRenderer — 내러티브 블록을 소설형 UI로 렌더링
 *
 * BagelChat + Whif.io 벤치마크 기반:
 * - narrative: 일반 텍스트 (소설 서술체)
 * - dialogue: 말풍선 (화자에 따라 좌/우 배치)
 * - action: 이탤릭 행동 묘사
 * - image_trigger: 이미지 삽입 (TODO: 이미지 서비스 연동)
 *
 * 다크 테마 기본 — 경쟁사 모두 다크 테마 사용
 */

interface NarrativeRendererProps {
  blocks: NarrativeBlock[];
  characterName: string;
  userName: string;
  characterAvatar?: string;
}

export function NarrativeRenderer({
  blocks,
  characterName,
  userName,
  characterAvatar,
}: NarrativeRendererProps) {
  return (
    <div className="space-y-4 px-4 py-2">
      {blocks.map((block, index) => (
        <NarrativeBlockView
          key={index}
          block={block}
          characterName={characterName}
          userName={userName}
          characterAvatar={characterAvatar}
        />
      ))}
    </div>
  );
}

function NarrativeBlockView({
  block,
  characterName,
  userName,
  characterAvatar,
}: {
  block: NarrativeBlock;
  characterName: string;
  userName: string;
  characterAvatar?: string;
}) {
  switch (block.type) {
    case 'narrative':
      return <NarrativeText content={block.content} characterName={characterName} />;
    case 'dialogue':
      return (
        <DialogueBubble
          content={block.content}
          speaker={block.speaker || characterName}
          isUser={block.speaker === userName}
          characterName={characterName}
          characterAvatar={characterAvatar}
        />
      );
    case 'action':
      return <ActionText content={block.content} />;
    case 'image_trigger':
      return <ImagePlaceholder tag={block.imageTag || ''} />;
    default:
      return null;
  }
}

// ============================================================
// 서술체 텍스트 — 소설의 본문
// ============================================================
function NarrativeText({
  content,
  characterName,
}: {
  content: string;
  characterName: string;
}) {
  // 캐릭터 이름을 하이라이트 (Whif.io 스타일)
  const highlightedContent = content.split(characterName).map((part, i, arr) => (
    <span key={i}>
      {part}
      {i < arr.length - 1 && (
        <span className="text-purple-400 font-medium">{characterName}</span>
      )}
    </span>
  ));

  return (
    <div className="text-sm text-gray-300 leading-7 py-1">
      {highlightedContent}
    </div>
  );
}

// ============================================================
// 대사 말풍선 — 화자에 따라 스타일 분기
// ============================================================
function DialogueBubble({
  content,
  speaker,
  isUser,
  characterName,
  characterAvatar,
}: {
  content: string;
  speaker: string;
  isUser: boolean;
  characterName: string;
  characterAvatar?: string;
}) {
  if (isUser) {
    // 유저 대사 — 우측, 보라색 배경
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] px-4 py-2.5 bg-purple-600/80 text-white text-sm rounded-2xl rounded-br-sm">
          {content}
        </div>
      </div>
    );
  }

  // 캐릭터 대사 — 좌측, 어두운 배경
  return (
    <div className="flex items-start gap-2">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 overflow-hidden flex items-center justify-center text-xs">
        {characterAvatar ? (
          <img src={characterAvatar} alt={characterName} className="w-full h-full object-cover" />
        ) : (
          characterName[0]
        )}
      </div>
      <div className="max-w-[80%] px-4 py-2.5 bg-gray-800/80 text-gray-200 text-sm rounded-2xl rounded-bl-sm">
        {content}
      </div>
    </div>
  );
}

// ============================================================
// 행동 묘사 — 이탤릭, 센터 정렬
// ============================================================
function ActionText({ content }: { content: string }) {
  return (
    <div className="text-sm text-gray-400 italic py-1 px-2 border-l-2 border-purple-500/30">
      {content}
    </div>
  );
}

// ============================================================
// 이미지 트리거 — 이미지 서비스 연동 전 플레이스홀더
// ============================================================
function ImagePlaceholder({ tag }: { tag: string }) {
  return (
    <div className="flex justify-center py-3">
      <div className="w-64 h-48 bg-gray-800/50 rounded-xl border border-gray-700/50 flex items-center justify-center">
        <span className="text-xs text-gray-600">(이미지: {tag})</span>
      </div>
    </div>
  );
}
