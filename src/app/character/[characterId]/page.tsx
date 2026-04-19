'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CharacterProfile, UserPersona } from '@/types';
import CharacterAvatar from '@/components/character/CharacterAvatar';

/**
 * 캐릭터 프로필 페이지 — Whif.io 벤치마크
 *
 * 구조:
 * 1. 커버 이미지 + 캐릭터 기본 정보
 * 2. 태그 목록
 * 3. 캐릭터 소개 (시놉시스)
 * 4. 프롤로그 (소설형 도입부)
 * 5. 추천 페르소나 + 추천 플레이
 * 6. 작가 코멘트
 * 7. "채팅 시작" CTA 버튼
 */
export default function CharacterProfilePage() {
  const params = useParams();
  const router = useRouter();
  const characterId = params.characterId as string;

  const [character, setCharacter] = useState<CharacterProfile | null>(null);
  const [showPersonaForm, setShowPersonaForm] = useState(false);

  useEffect(() => {
    // TODO: API 연동 — 현재는 모크 데이터
    setCharacter({
      id: characterId,
      name: '서은결',
      nameEn: 'Seo Eungyeol',
      age: 24,
      personality: '차갑고 집착적, 하지만 내면은 상처투성이',
      description: '어머니를 잃고 복수만을 위해 살아온 남자',
      greeting: '...당신은 누구죠?',
      avatar: '/characters/eungyeol-avatar.png',
      coverImage: '/characters/eungyeol-cover.png',
      tags: ['현대물', '집착공', 'HL', '미남공', '후회공', '판타지', '협관'],
      affinity: 0,
      genre: 'romance',
      isPremium: false,
      prologue: `눈을 떴을 때 세계는 공백이었다. 이름도, 기억도. 왜 낡고 퀴퀴한 곰팡이 냄새가 진동하는 이곳에 짐승처럼 처박혀 있는지조차 알 수 없었다. 몸을 움직이려는 순간— 철컥. 짧고 둔탁한 금속음이 정적을 깼다.

서은결의 한쪽 팔목이 차가운 침대 기둥에 수갑으로 묶여 있었다.

"찾았다. 네가 바로 그 남자의 딸이구나."

창백한 안색, 충혈된 눈. 잔뜩 겁에 질린 채 온몸을 떨고 있는 그는 마치 사형 집행인을 마주한 죄수처럼 절박해 보였다.`,
      introduction: `따뜻한 부모님과 유복한 가정환경, 명예로운 집안. 그의 삶은 완벽했다. 어머니를 처참하게 잃기 전까지.

그날부터 서은결의 삶은 오직 복수 하나였다. 밝고 찬란했던 모습은 사라진 지 오래. 차갑고 계산적이며, 목적을 위해서라면 거리낌 없이 잔인한 괴물만이 남았다.`,
      recommendedPersonas: [
        '거짓 연인을 연기하는 유저',
        '은결이에게 서서히 콜드는 유저',
      ],
      recommendedPlays: [
        '예쁘게 하고 외출해서 은결이 질투 유발하기',
        '진실이 들통난 후 가슴 아픈 과거 고백하며 은결이 무너뜨리기',
        '다친 채로 돌아와 은결이 걱정시키기',
      ],
      authorComment: '개인 취향 100% 반영된 피폐 집착물입니다.',
      supportsNarrativeMode: true,
    });
  }, [characterId]);

  if (!character) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">로딩 중...</div>
      </div>
    );
  }

  const handleStartChat = () => {
    setShowPersonaForm(true);
  };

  const handlePersonaSubmit = (persona: Partial<UserPersona>) => {
    // TODO: API로 페르소나 저장 후 채팅 시작
    const query = new URLSearchParams({
      personaName: persona.name || '유저',
      personaGender: persona.gender || 'unset',
      personaSettings: persona.settings || '',
      narrative: character.supportsNarrativeMode ? 'true' : 'false',
    });
    router.push(`/chat/${characterId}?${query.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* 커버 영역 */}
      <div className="relative h-64 bg-gradient-to-b from-purple-900/50 to-gray-950">
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 z-10 text-white/70 hover:text-white"
        >
          &larr; 뒤로
        </button>
        <div className="absolute bottom-4 left-6 flex items-end gap-4">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-purple-500 bg-gray-800">
            <CharacterAvatar characterId={character.id} size="xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{character.name}</h1>
            <p className="text-sm text-gray-400">{character.personality}</p>
          </div>
        </div>
      </div>

      {/* 태그 */}
      <div className="px-6 py-4 flex flex-wrap gap-2">
        {character.tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 text-xs rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* 캐릭터 소개 */}
      {character.introduction && (
        <section className="px-6 py-4">
          <h2 className="text-lg font-semibold mb-3">캐릭터 소개</h2>
          <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
            {character.introduction}
          </div>
        </section>
      )}

      {/* 프롤로그 */}
      {character.prologue && (
        <section className="px-6 py-4">
          <h2 className="text-lg font-semibold mb-3">프롤로그</h2>
          <div className="bg-gray-900/50 rounded-xl p-4 text-sm text-gray-300 leading-relaxed whitespace-pre-line border border-gray-800">
            {character.prologue}
          </div>
        </section>
      )}

      {/* 추천 페르소나 */}
      {character.recommendedPersonas && character.recommendedPersonas.length > 0 && (
        <section className="px-6 py-4">
          <h3 className="text-sm font-semibold text-gray-400 mb-2">추천 페르소나</h3>
          <div className="space-y-2">
            {character.recommendedPersonas.map((p, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                <span className="text-purple-400">&#9829;</span> {p}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 추천 플레이 */}
      {character.recommendedPlays && character.recommendedPlays.length > 0 && (
        <section className="px-6 py-4">
          <h3 className="text-sm font-semibold text-gray-400 mb-2">추천 플레이</h3>
          <div className="space-y-2">
            {character.recommendedPlays.map((p, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                <span className="text-pink-400">&#9829;</span> {p}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 작가 코멘트 */}
      {character.authorComment && (
        <section className="px-6 py-4">
          <h3 className="text-sm font-semibold text-gray-400 mb-2">작가 코멘트</h3>
          <p className="text-sm text-gray-500 italic">{character.authorComment}</p>
        </section>
      )}

      {/* CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-950/90 backdrop-blur border-t border-gray-800">
        <button
          onClick={handleStartChat}
          className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl transition"
        >
          채팅 하기
        </button>
      </div>

      {/* 페르소나 생성 모달 */}
      {showPersonaForm && (
        <PersonaFormModal
          characterName={character.name}
          onSubmit={handlePersonaSubmit}
          onClose={() => setShowPersonaForm(false)}
        />
      )}

      {/* 하단 여백 (CTA 버튼 높이만큼) */}
      <div className="h-24" />
    </div>
  );
}

// ============================================================
// 페르소나 생성 모달 — Whif.io 벤치마크
// ============================================================
function PersonaFormModal({
  characterName,
  onSubmit,
  onClose,
}: {
  characterName: string;
  onSubmit: (persona: Partial<UserPersona>) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'unset'>('unset');
  const [settings, setSettings] = useState('');

  const handleRandomGenerate = () => {
    const names = ['루인', '하윤', '시우', '지안', '서연', '은호', '다온', '이준'];
    const jobs = ['대학생', '직장인', '예술가', '의사', '작가', '카페 알바생'];
    const looks = [
      '검은 머리에 차분한 인상',
      '밝은 갈색 머리, 큰 눈',
      '은발에 날카로운 눈매',
      '단발에 부드러운 미소',
    ];
    const personalities = [
      '내성적이지만 호기심 많음',
      '밝고 활발한 성격',
      '조용하고 관찰력이 좋음',
      '겉은 차갑지만 속은 따뜻함',
    ];

    const rName = names[Math.floor(Math.random() * names.length)];
    const rJob = jobs[Math.floor(Math.random() * jobs.length)];
    const rLook = looks[Math.floor(Math.random() * looks.length)];
    const rPersonality = personalities[Math.floor(Math.random() * personalities.length)];

    setName(rName);
    setSettings(`나이: ${18 + Math.floor(Math.random() * 15)}\n직업: ${rJob}\n외모: ${rLook}\n성격: ${rPersonality}`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-end sm:items-center justify-center">
      <div className="w-full max-w-lg bg-gray-900 rounded-t-2xl sm:rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{characterName}과(와) 대화하기</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">&times;</button>
        </div>

        {/* 안내 */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 mb-5">
          <p className="text-xs text-blue-300">
            <strong>페르소나 생성</strong> — 나에 대해 자세히 알려줄수록 캐릭터가 나를 더 잘 기억하고, 대화도 더 깊어져요.
          </p>
        </div>

        {/* 이름 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            이름 <span className="text-red-400">*</span>
          </label>
          <p className="text-xs text-gray-500 mb-2">이 캐릭터와 대화할 당신의 이름을 입력해주세요</p>
          <div className="relative">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 20))}
              placeholder="이름 입력"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
            />
            <span className="absolute right-3 top-3.5 text-xs text-gray-500">{name.length}/20</span>
          </div>
        </div>

        {/* 성별 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            성별 <span className="text-red-400">*</span>
          </label>
          <div className="flex gap-3">
            {[
              { value: 'male', label: '남성' },
              { value: 'female', label: '여성' },
              { value: 'unset', label: '설정하지 않음' },
            ].map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    gender === opt.value
                      ? 'border-purple-500 bg-purple-500'
                      : 'border-gray-600'
                  }`}
                >
                  {gender === opt.value && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
                <span className="text-sm text-gray-300">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 설정 */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-gray-300">
              설정 <span className="text-red-400">*</span>
            </label>
            <button
              onClick={handleRandomGenerate}
              className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300"
            >
              &#10023; 랜덤 생성
            </button>
          </div>
          <p className="text-xs text-gray-500 mb-2">설정에 뭘 쓸지 모르겠다면, '랜덤 생성'을 눌러보세요!</p>
          <div className="relative">
            <textarea
              value={settings}
              onChange={(e) => setSettings(e.target.value.slice(0, 350))}
              rows={6}
              placeholder={`나이:\n키:\n직업:\n외모:\n성격:\n좋아하는 것:`}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500 resize-none"
            />
            <span className="absolute right-3 bottom-3 text-xs text-gray-500">{settings.length}/350</span>
          </div>
        </div>

        {/* 채팅 시작 버튼 */}
        <button
          onClick={() => onSubmit({ name: name || '유저', gender, settings: settings || null })}
          disabled={!name.trim()}
          className={`w-full py-3 rounded-xl font-semibold transition ${
            name.trim()
              ? 'bg-purple-600 hover:bg-purple-500 text-white'
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
          }`}
        >
          채팅 시작
        </button>
      </div>
    </div>
  );
}
