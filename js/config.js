/*
 * KZNA HEART POP — 게임 밸런스/연출 설정
 * 숫자 조정은 이 파일에서만 하면 된다.
 */
window.HP = window.HP || {};

HP.CONFIG = {
  /* 게임판(논리 좌표). 화면 크기와 무관하게 물리 계산은 이 크기로 한다. */
  board: {
    width: 360,
    height: 500,
    wall: 60,          // 보이지 않는 벽 두께
    deadlineY: 84,     // 이 선 위로 아이템이 머무르면 게임오버
    dropY: 44          // 들고 있는 아이템의 높이
  },

  physics: {
    gravity: 1.0,
    restitution: 0.56,     // 튕김 (0 = 안 튕김, 1 = 완전 탄성)
    friction: 0.1,         // 굴러가려면 약간의 마찰이 필요 (너무 낮으면 미끄러지기만 함)
    frictionStatic: 0.15,  // 낮을수록 경사에서 쉽게 굴러 내려감
    frictionAir: 0.001,    // 낮을수록 오래 굴러감
    density: 0.0012,
    mergePop: 3.0,         // 합성 직후 위로 튀어 오르는 힘
    stepMs: 1000 / 60
  },

  /* 아이템 티어 (0 = 가장 작음, 10 = 최종). glyph는 board.js의 그리기 함수 이름 */
  tiers: [
    { r: 14,  base: '#ffe27a', glyph: 'sparkle',  face: { eyes: 'dot',     mouth: 'w' } },
    { r: 19,  base: '#8fd3ff', glyph: 'note',     face: { eyes: 'happy',   mouth: 'smile' } },
    { r: 25,  base: '#c9a9ff', glyph: 'star',     face: { eyes: 'dot',     mouth: 'smile' }, accent: '#ffe27a' },
    { r: 32,  base: '#ff8fc1', glyph: 'heart',    face: { eyes: 'wink',    mouth: 'w' } },
    { r: 40,  base: '#7ee3c8', glyph: 'diamond',  face: { eyes: 'sparkle', mouth: 'smile' } },
    { r: 48,  base: '#8e9bff', glyph: 'moon',     face: { eyes: 'sleepy',  mouth: 'o' },     accent: '#ffe27a' },
    { r: 57,  base: '#ffb38a', glyph: 'flower',   face: { eyes: 'happy',   mouth: 'open' } },
    { r: 67,  base: '#5fb2ff', glyph: 'planet',   face: { eyes: 'sparkle', mouth: 'w' },     accent: '#ffe27a' },
    { r: 78,  base: '#ffd24d', glyph: 'crown',    face: { eyes: 'dot',     mouth: 'open' } },
    { r: 90,  base: '#ff5fa2', glyph: 'bigheart', face: { eyes: 'heart',   mouth: 'open' } },
    { r: 104, base: '#ffffff', glyph: 'kzna' }
  ],

  dropMaxTier: 4,        // 떨어뜨릴 수 있는 최대 티어
  dropCooldownMs: 420,   // 연속 드롭 간격

  /* SCORE (수박게임 실력 지표) — LOVE와 완전히 별개 */
  score: {
    forCreatedTier: function (t) { return (t * (t + 1)) / 2; },
    maxPair: 100           // 최종 티어끼리 합쳐져 사라질 때
  },

  /* LOVE (최애에게 전달한 하트의 누적 성과) */
  love: {
    // 합쳐진 두 아이템의 티어 → 하트 1개의 LOVE 포인트
    perMergeTier: [10, 20, 35, 55, 85, 125, 175, 240, 320, 420, 600],
    // 연쇄 합성 보너스: windowMs 안에 이어진 합성마다 +stepBonus (최대 +maxBonus)
    combo: { windowMs: 900, stepBonus: 0.15, maxBonus: 1.0 },
    // LV.1→2, LV.2→3 ... 에 필요한 게이지. 표 이후는 thresholdStepAfter씩 증가
    levelThresholds: [300, 500, 750, 1000, 1300, 1600, 2000],
    thresholdStepAfter: 500
  },

  /* 하트 비행 연출 */
  heart: {
    minMs: 780,
    maxMs: 1080,
    staggerMs: 70,         // 동시에 여러 하트가 생기면 이만큼씩 출발을 늦춤
    staggerMaxMs: 420,
    baseSize: 26           // px (화면 기준)
  },

  /* 멤버 리액션 */
  reactions: {
    durations: { happy: 650, cheer: 1500, heart: 1700, wink: 1500, special: 1900, celebrate: 2000 },
    // 레벨 도달 시 재생할 리액션. 7 이상은 모두 celebrate
    levelMap: { 2: 'happy', 3: 'cheer', 4: 'heart', 5: 'wink', 6: 'special', 7: 'celebrate' },
    lineChanceOnHeart: 1,      // 하트 도착 시 대사가 나올 확률 (대사는 js/lines.js)
    lineCooldownMs: 1600       // 말풍선 최소 간격 (연쇄 합성 때 겹치지 않게)
  },

  gameOver: {
    settleMs: 1000,   // 막 떨어뜨린 아이템은 이 시간 동안 판정 제외
    graceMs: 1800     // 데드라인 위에 이 시간 이상 머무르면 게임오버
  },

  // 게임 종료 후 비행 중인 하트를 기다리는 최대 시간 (초과 시 즉시 지급)
  endFlushTimeoutMs: 3200,

  // 언어 고정. 'ja' 로 두면 일본어만 쓰고 언어 전환 버튼도 숨긴다.
  // null 로 바꾸면 한국어/일본어/영어 자동 선택(IP 국가) + 전환 버튼이 다시 켜진다.
  fixedLang: 'ja',

  // 결과 화면 '공식 홈페이지' 버튼. 뒤에 /ko, /ja, /en 이 붙는다
  homepage: 'https://kzna-homepage-17280846291.asia-northeast3.run.app',

  // 접속 IP 국가 조회 API (응답 예: {"ip":"…","country":"KR"} 또는 "KR")
  geoApi: 'https://api.country.is/',

  share: {
    hashtags: ['KZNA', 'KZNAHEARTPOP'],
    url: 'https://kzna-heart-pop.pages.dev/'   // X 공유 글에 붙는 게임 링크 (Cloudflare Pages 기본 주소 = 항상 최신 배포)
  }
};

/* level 단계에서 다음 레벨까지 필요한 게이지 */
HP.CONFIG.love.needFor = function (level) {
  var t = HP.CONFIG.love.levelThresholds;
  if (level - 1 < t.length) return t[level - 1];
  return t[t.length - 1] + (level - t.length) * HP.CONFIG.love.thresholdStepAfter;
};
