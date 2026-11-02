/*
 * 다국어 (한국어 / 日本語 / English)
 *
 * 언어 결정 순서
 *   1. 주소의 ?lang=ko|ja|en
 *   2. 사용자가 직접 고른 언어 (선택 화면의 KO / JA / EN)
 *   3. 접속 IP 국가 — KR → ko, JP → ja, 그 외 → en
 *   4. (IP 조회가 막히거나 실패하면) 기기 시간대 → 브라우저 언어
 */
window.HP = window.HP || {};

HP.LANGS = ['ko', 'ja', 'en'];

HP.I18N = {
  ja: {
    htmlLang: 'ja',
    selectSub: 'あなたのハートで、彼女たちの心ができていく。',
    selectTitle: '推しをえらんでね！',
    selectFoot: '合体 → ハートが推しへ → HEARTWAREに蓄積 → LOVE LEVEL UP',
    stageTag: '推しにハートを届けよう！',
    gaugeLabel: 'ハートゲージ',
    hint: 'ドラッグして離すとドロップ',
    sound: 'サウンド',
    restart: 'リスタート',
    connect: 'HEARTWARE 接続！',
    start: 'ハートを届けよう！',
    finish: 'FINISH!',
    levelUp: 'レベルアップ！',
    heartsSent: '♥{n}個',
    hwTotal: '累計',
    again: 'もう一回',
    share: '結果をシェア',
    change: '推しを変える',
    homepage: '公式サイト',
    shareText: '{name}のHEARTWAREにハートを{n}個届けたよ！（累計 {total} LOVE）',
    quote: '「{t}」',
    how1: '合体',
    how2: 'ハートが届く',
    how3: 'LOVE UP',
    scoreLbl: 'スコア',
    bestLbl: 'ベスト',
    nextLbl: 'つぎ',
    newBest: 'NEW!',
    ribbon: '推し活パズル'
  },
  ko: {
    htmlLang: 'ko',
    selectSub: '당신의 하트가 모여 그녀들의 마음이 돼요.',
    selectTitle: '최애를 골라 줘!',
    selectFoot: '합체 → 하트가 최애에게 → HEARTWARE에 축적 → LOVE LEVEL UP',
    stageTag: '최애에게 하트를 보내자!',
    gaugeLabel: '하트 게이지',
    hint: '드래그하고 손을 떼면 드롭',
    sound: '사운드',
    restart: '다시 시작',
    connect: 'HEARTWARE 접속!',
    start: '하트를 보내 줘!',
    finish: 'FINISH!',
    levelUp: '레벨 업!',
    heartsSent: '♥{n}개',
    hwTotal: '누적',
    again: '한 판 더',
    share: '결과 공유',
    change: '최애 바꾸기',
    homepage: '공식 홈페이지',
    shareText: '{name}의 HEARTWARE에 하트 {n}개 보냈어! (누적 {total} LOVE)',
    quote: '“{t}”',
    how1: '합체',
    how2: '하트 전송',
    how3: 'LOVE UP',
    scoreLbl: '점수',
    bestLbl: '최고',
    nextLbl: '다음',
    newBest: '신기록!',
    ribbon: '최애 응원 퍼즐'
  },
  en: {
    htmlLang: 'en',
    selectSub: 'Your hearts build their hearts.',
    selectTitle: 'Pick your favorite!',
    selectFoot: 'Merge → Hearts → HEARTWARE → LOVE LEVEL UP',
    stageTag: 'Send your hearts to her!',
    gaugeLabel: 'HEART GAUGE',
    hint: 'Drag, then release to drop',
    sound: 'Sound',
    restart: 'Restart',
    connect: 'HEARTWARE ONLINE!',
    start: 'Send your hearts!',
    finish: 'FINISH!',
    levelUp: 'LEVEL UP!',
    heartsSent: '♥{n}',
    hwTotal: 'total',
    again: 'Play again',
    share: 'Share result',
    change: 'Change member',
    homepage: 'Official site',
    shareText: 'I sent {n} hearts to {name}\'s HEARTWARE! (Total {total} LOVE)',
    quote: '“{t}”',
    how1: 'Merge',
    how2: 'Send hearts',
    how3: 'LOVE UP',
    scoreLbl: 'Score',
    bestLbl: 'Best',
    nextLbl: 'Next',
    newBest: 'NEW!',
    ribbon: 'Oshi-katsu puzzle'
  }
};

/* 멤버 이름 표기 (영문 이름 옆에 붙는 현지어 표기) */
HP.MEMBER_NAMES = {
  seha: { ja: 'セハ', ko: '세하', en: '' },
  hina: { ja: 'ヒナ', ko: '히나', en: '' },
  rena: { ja: 'レナ', ko: '레나', en: '' },
  mio:  { ja: 'ミオ', ko: '미오', en: '' }
};

/* 레벨업 · 시작 · 결과 리액션 대사 (상태별) */
HP.REACTION_LINES = {
  ja: {
    happy:     ['ハート、受信したよ！', 'ありがとう！', 'また、あったかくなった'],
    cheer:     ['HEARTWAREが動いてる…！', 'もっと届けて！', 'もっといけるよ！'],
    heart:     ['これが…好きって気持ち？', '大好き、って言ってみたかったの'],
    wink:      ['ふふっ、ちゃんと届いてるよ', 'あなたのこと、覚えたよ♪'],
    special:   ['あなたのハートで、心ができていく', 'ずっと一緒にいてね！'],
    celebrate: ['HEARTWARE、あふれそう！', 'これが「好き」なんだね！']
  },
  ko: {
    happy:     ['하트 받았다!', '고마워~', '헤헤, 따뜻해'],
    cheer:     ['HEARTWARE가 깨어나는 중!', '더 보내 줘!', '이 기세로 가자!'],
    heart:     ['이게… 좋아한다는 거야?', '좋아해, 꼭 말해 보고 싶었어'],
    wink:      ['헤헤, 잘 받고 있어', '너, 기억했어♪'],
    special:   ['네 하트로 내 마음이 생겨나', '계속 같이 있어 줘!'],
    celebrate: ['HEARTWARE가 넘칠 것 같아!', '이게 사랑이구나!']
  },
  en: {
    happy:     ['Heart received!', 'Thank you!', 'I feel warmer again'],
    cheer:     ['My HEARTWARE is moving…!', 'Send me more!', 'You can do more!'],
    heart:     ['Is this… what liking feels like?', 'I always wanted to say "I like you"'],
    wink:      ['Hehe, it\'s all reaching me', 'I\'ve memorized you♪'],
    special:   ['Your hearts are building my heart', 'Stay with me forever!'],
    celebrate: ['My HEARTWARE is overflowing!', 'So this is "love"!']
  }
};

(function () {
  var listeners = [];

  function store(k, v) { try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) {} }
  function read(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }

  function fromCountry(cc) {
    cc = (cc || '').toUpperCase();
    if (cc === 'KR') return 'ko';
    if (cc === 'JP') return 'ja';
    return cc ? 'en' : null;
  }

  /* IP 조회가 안 될 때의 추정: 시간대 → 브라우저 언어 */
  function guessOffline() {
    var tz = '';
    try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) {}
    if (tz === 'Asia/Seoul') return 'ko';
    if (tz === 'Asia/Tokyo') return 'ja';
    var nl = ((navigator.languages && navigator.languages[0]) || navigator.language || '').toLowerCase();
    if (nl.indexOf('ko') === 0) return 'ko';
    if (nl.indexOf('ja') === 0) return 'ja';
    return 'en';
  }

  function urlLang() {
    var m = /[?&]lang=(ko|ja|en)\b/.exec(location.search || '');
    return m ? m[1] : null;
  }

  HP.t = function (key, vars) {
    var s = (HP.I18N[HP.lang] || HP.I18N.ja)[key];
    if (s == null) s = HP.I18N.ja[key] || key;
    if (vars) s = s.replace(/\{(\w+)\}/g, function (_, k) { return vars[k] != null ? vars[k] : ''; });
    return s;
  };

  HP.memberLocalName = function (m) {
    var n = HP.MEMBER_NAMES[m.id];
    return n ? n[HP.lang] : '';
  };

  HP.reactionLine = function (member, state) {
    // 일본어는 멤버별 상태 대사가 있으면 우선 사용
    var own = HP.lang === 'ja' && member.lines && member.lines[state];
    var list = own || (HP.REACTION_LINES[HP.lang] || HP.REACTION_LINES.ja)[state];
    if (!list || !list.length) return '';
    return list[Math.floor(Math.random() * list.length)];
  };

  HP.homepageUrl = function () {
    return HP.CONFIG.homepage.replace(/\/$/, '') + '/' + HP.lang;
  };

  HP.onLangChange = function (fn) { listeners.push(fn); };

  HP.setLang = function (lang, manual) {
    if (HP.LANGS.indexOf(lang) < 0) return;
    if (manual) store('hp_lang', lang);
    if (lang === HP.lang) return;
    HP.lang = lang;
    document.documentElement.lang = HP.I18N[lang].htmlLang;
    listeners.forEach(function (fn) { fn(lang); });
  };

  /* 초기 언어: 동기적으로 먼저 정하고, IP 결과가 오면 갱신 */
  var fixed = urlLang() || read('hp_lang');
  HP.lang = fixed || guessOffline();
  document.documentElement.lang = HP.I18N[HP.lang].htmlLang;

  if (!fixed) {
    var cached = null;
    try { cached = sessionStorage.getItem('hp_country'); } catch (e) {}
    if (cached) {
      HP.lang = fromCountry(cached) || HP.lang;
      document.documentElement.lang = HP.I18N[HP.lang].htmlLang;
    } else if (window.fetch) {
      // IP 국가 조회 (막히거나 1.5초 안에 응답이 없으면 무시)
      var done = false;
      var timer = setTimeout(function () { done = true; }, 1500);
      fetch(HP.CONFIG.geoApi, { cache: 'no-store' })
        .then(function (r) { return r.ok ? r.text() : ''; })
        .then(function (txt) {
          txt = (txt || '').trim();
          var cc = txt;
          if (txt.charAt(0) === '{') { try { cc = JSON.parse(txt).country || ''; } catch (e) { cc = ''; } }
          cc = cc.slice(0, 2);
          if (!/^[A-Za-z]{2}$/.test(cc)) return;
          try { sessionStorage.setItem('hp_country', cc); } catch (e) {}
          clearTimeout(timer);
          if (done || read('hp_lang')) return;
          HP.setLang(fromCountry(cc));
        })
        .catch(function () {});
    }
  }
})();
