/*
 * KZNA 멤버 데이터
 *
 * - color / hair / accessory 등은 임시 캐릭터(SVG)용 값이다.
 * - 실제 일러스트가 준비되면 images 에 표정별 경로를 넣으면 된다.
 *   예) images: { idle: 'assets/members/seha/idle.webp', happy: 'assets/members/seha/happy.webp', ... }
 *   비어 있는 상태는 idle 이미지로, idle 도 없으면 임시 캐릭터로 표시된다.
 * - lines 는 캐릭터 성격에 맞게 자유롭게 교체한다. 비어 있는 상태는 DEFAULT_LINES 를 쓴다.
 */
window.HP = window.HP || {};

HP.REACTION_STATES = ['idle', 'happy', 'cheer', 'heart', 'wink', 'celebrate', 'special'];

HP.DEFAULT_LINES = {
  happy:     ['ありがとう！', 'とどいたよ！', 'うれしい！'],
  cheer:     ['すごい！', 'その調子！', 'もっといけるよ！'],
  heart:     ['大好き！', 'ハート、受け取ったよ！'],
  wink:      ['ふふっ、見てた？', 'ちゃんと届いてるよ♪'],
  special:   ['ずっと一緒にいてね！', 'あなたが一番！'],
  celebrate: ['最高！ありがとう！', '胸がいっぱいだよ！']
};

HP.MEMBERS = [
  {
    id: 'seha', name: 'SEHA', kana: 'セハ',
    color: '#6fb8ff', hair: '#2f3557', iris: '#4a7fd6',
    hairStyle: 'long', accessory: 'ribbon',
    images: {},
    lines: {
      happy: ['ありがとう！', 'とどいたよ！'],
      cheer: ['すごい！', 'もっといけるよ！'],
      heart: ['大好き！'],
      special: ['ずっと一緒にいてね！']
    }
  },
  {
    id: 'hina', name: 'HINA', kana: 'ヒナ',
    color: '#ff7fb6', hair: '#6b4a3f', iris: '#d0567f',
    hairStyle: 'bob', accessory: 'star',
    images: {},
    lines: {
      happy: ['やったー！', 'ありがとう！'],
      cheer: ['すごいすごい！', 'その調子！'],
      heart: ['大好き！'],
      celebrate: ['最高！ありがとう！']
    }
  },
  {
    id: 'rena', name: 'RENA', kana: 'レナ',
    color: '#a58cff', hair: '#1f2236', iris: '#7a5fd8',
    hairStyle: 'long', accessory: 'band',
    images: {},
    lines: {
      happy: ['ありがとう。', 'ちゃんと届いたよ。'],
      cheer: ['すごい！', 'まだいけるでしょ？'],
      wink: ['ふふっ、見てた？']
    }
  },
  {
    id: 'mio', name: 'MIO', kana: 'ミオ',
    color: '#5fd8c4', hair: '#c9cfe0', iris: '#2f9f8f',
    hairStyle: 'bob', accessory: 'clip',
    images: {},
    lines: {
      happy: ['ありがとう！', 'うれしい！'],
      cheer: ['もっといけるよ！'],
      heart: ['大好きだよ！']
    }
  }
];

HP.lineFor = function (member, state) {
  var list = (member.lines && member.lines[state]) || HP.DEFAULT_LINES[state];
  if (!list || !list.length) return '';
  return list[Math.floor(Math.random() * list.length)];
};
