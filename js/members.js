/*
 * KZNA 멤버 데이터
 *
 * - color / hair / accessory 등은 임시 캐릭터(SVG)용 값이다.
 * - 실제 일러스트가 준비되면 images 에 표정별 경로를 넣으면 된다.
 *   예) images: { idle: 'assets/members/seha/idle.webp', happy: 'assets/members/seha/happy.webp', ... }
 *   비어 있는 상태는 idle 이미지로, idle 도 없으면 임시 캐릭터로 표시된다.
 * - lines 는 레벨업 리액션 대사(일본어 전용 덮어쓰기). 다국어 기본 대사는 js/i18n.js 의 REACTION_LINES,
 *   하트 도착 대사는 js/lines.js 에 있다.
 */
window.HP = window.HP || {};

HP.REACTION_STATES = ['idle', 'happy', 'cheer', 'heart', 'wink', 'celebrate', 'special'];

HP.MEMBERS = [
  {
    id: 'seha', name: 'SEHA', kana: 'セハ',
    color: '#6fb8ff', hair: '#2f3557', iris: '#4a7fd6',
    hairStyle: 'long', accessory: 'ribbon',
    images: {
      idle: 'assets/members/seha/idle.webp',
      happy: 'assets/members/seha/happy.webp',
      cheer: 'assets/members/seha/cheer.webp',
      heart: 'assets/members/seha/heart.webp',
      wink: 'assets/members/seha/wink.webp',
      special: 'assets/members/seha/special.webp',
      celebrate: 'assets/members/seha/celebrate.webp'
    },
    lines: {
      happy: ['ありがとう！', 'ハート、届いたよ'],
      cheer: ['すごい！', 'もっといけるよ！'],
      heart: ['大好き…って、こういうこと？'],
      special: ['あなたのハートで、わたしができてる']
    }
  },
  {
    id: 'hina', name: 'HINA', kana: 'ヒナ',
    color: '#ff7fb6', hair: '#6b4a3f', iris: '#d0567f',
    hairStyle: 'bob', accessory: 'star',
    images: {
      idle: 'assets/members/hina/idle.webp',
      happy: 'assets/members/hina/happy.webp',
      cheer: 'assets/members/hina/cheer.webp',
      heart: 'assets/members/hina/heart.webp',
      wink: 'assets/members/hina/wink.webp',
      special: 'assets/members/hina/special.webp',
      celebrate: 'assets/members/hina/celebrate.webp'
    },
    lines: {
      happy: ['やったー！受信完了！', 'ありがとう！'],
      cheer: ['すごいすごい！もっともっと！', 'その調子！'],
      heart: ['大好き！…あ、言えた！'],
      celebrate: ['HEARTWARE、あふれそう！']
    }
  },
  {
    id: 'rena', name: 'RENA', kana: 'レナ',
    color: '#a58cff', hair: '#1f2236', iris: '#7a5fd8',
    hairStyle: 'long', accessory: 'band',
    images: {
      idle: 'assets/members/rena/idle.webp',
      happy: 'assets/members/rena/happy.webp',
      cheer: 'assets/members/rena/cheer.webp',
      heart: 'assets/members/rena/heart.webp',
      wink: 'assets/members/rena/wink.webp',
      special: 'assets/members/rena/special.webp',
      celebrate: 'assets/members/rena/celebrate.webp'
    },
    lines: {
      happy: ['…受信。ありがとう。', 'ちゃんと届いたよ。'],
      cheer: ['すごい！', 'まだいけるでしょ？'],
      wink: ['ふふっ、データ以上だね'],
      special: ['こんな気持ち、知らなかった']
    }
  },
  {
    id: 'mio', name: 'MIO', kana: 'ミオ',
    color: '#5fd8c4', hair: '#c9cfe0', iris: '#2f9f8f',
    hairStyle: 'bob', accessory: 'clip',
    images: {
      idle: 'assets/members/mio/idle.webp',
      happy: 'assets/members/mio/happy.webp',
      cheer: 'assets/members/mio/cheer.webp',
      heart: 'assets/members/mio/heart.webp',
      wink: 'assets/members/mio/wink.webp',
      special: 'assets/members/mio/special.webp',
      celebrate: 'assets/members/mio/celebrate.webp'
    },
    lines: {
      happy: ['うれしい…あったかい', 'ありがとう！'],
      cheer: ['もっといけるよ！'],
      heart: ['これが、好き？']
    }
  }
];
