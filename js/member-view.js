/*
 * 상단 멤버 표시 + 리액션 상태 머신
 *
 * 상태: idle / happy / cheer / heart / wink / celebrate / special
 * 우선순위가 높은 리액션(레벨업)이 재생 중이면 낮은 리액션(하트 도착 happy)은 무시한다.
 */
window.HP = window.HP || {};

(function () {
  var PRIORITY = { idle: 0, happy: 1, cheer: 2, heart: 2, wink: 2, special: 3, celebrate: 3 };

  // 상태 → 임시 캐릭터의 눈/입/손 조합
  var POSE = {
    idle:      { eyes: 'open',  mouth: 'neutral', hands: 'none' },
    happy:     { eyes: 'happy', mouth: 'open',    hands: 'none' },
    cheer:     { eyes: 'open',  mouth: 'open',    hands: 'wave' },
    heart:     { eyes: 'happy', mouth: 'smile',   hands: 'heart' },
    wink:      { eyes: 'wink',  mouth: 'smile',   hands: 'none' },
    special:   { eyes: 'happy', mouth: 'open',    hands: 'double' },
    celebrate: { eyes: 'happy', mouth: 'open',    hands: 'double' }
  };

  function heartD(x, y, w) {
    var h = w * 0.9;
    return 'M' + x + ' ' + (y + h * 0.45) +
      ' C' + (x - w * 0.1) + ' ' + (y + h * 0.35) + ' ' + (x - w * 0.5) + ' ' + (y + h * 0.1) + ' ' + (x - w * 0.5) + ' ' + (y - h * 0.15) +
      ' C' + (x - w * 0.5) + ' ' + (y - h * 0.42) + ' ' + (x - w * 0.22) + ' ' + (y - h * 0.5) + ' ' + x + ' ' + (y - h * 0.28) +
      ' C' + (x + w * 0.22) + ' ' + (y - h * 0.5) + ' ' + (x + w * 0.5) + ' ' + (y - h * 0.42) + ' ' + (x + w * 0.5) + ' ' + (y - h * 0.15) +
      ' C' + (x + w * 0.5) + ' ' + (y + h * 0.1) + ' ' + (x + w * 0.1) + ' ' + (y + h * 0.35) + ' ' + x + ' ' + (y + h * 0.45) + 'Z';
  }
  HP.heartD = heartD;

  /* 임시 캐릭터 상반신 SVG */
  function avatarSVG(m, uid) {
    var skin = '#ffe8de', line = '#2b2f4a';
    var back = m.hairStyle === 'bob'
      ? '<path d="M40 96 C36 44 68 20 100 20 C132 20 164 44 160 96 L162 138 C150 146 140 140 136 130 L64 130 C60 140 50 146 38 138 Z" fill="' + m.hair + '"/>'
      : '<path d="M38 96 C34 44 68 20 100 20 C132 20 166 44 162 96 L170 178 L30 178 Z" fill="' + m.hair + '"/>';
    var acc = '';
    if (m.accessory === 'ribbon') acc = '<g transform="translate(140 44) rotate(18)"><path d="M0 0 L-16 -10 L-16 10 Z M0 0 L16 -10 L16 10 Z" fill="' + m.color + '"/><circle r="4" fill="#fff"/></g>';
    if (m.accessory === 'star') acc = '<path transform="translate(138 48) scale(0.9)" d="M0 -12 L3.5 -4 L12 -3.7 L5.5 2 L7.4 10.5 L0 6 L-7.4 10.5 L-5.5 2 L-12 -3.7 L-3.5 -4 Z" fill="#ffe27a" stroke="#fff" stroke-width="1.5"/>';
    if (m.accessory === 'band') acc = '<path d="M58 54 C74 32 126 32 142 54" fill="none" stroke="' + m.color + '" stroke-width="6" stroke-linecap="round"/>';
    if (m.accessory === 'clip') acc = '<g fill="' + m.color + '"><rect x="128" y="50" width="16" height="5" rx="2.5" transform="rotate(-20 136 52)"/><rect x="130" y="59" width="16" height="5" rx="2.5" transform="rotate(-20 138 61)"/></g>';

    function eye(cx, cy) {
      return '<g class="eye-open" style="transform-origin:' + cx + 'px ' + cy + 'px">' +
        '<ellipse cx="' + cx + '" cy="' + cy + '" rx="7.5" ry="9.5" fill="' + line + '"/>' +
        '<ellipse cx="' + cx + '" cy="' + (cy + 2) + '" rx="5.5" ry="6.5" fill="' + m.iris + '"/>' +
        '<circle cx="' + (cx - 2.5) + '" cy="' + (cy - 3.5) + '" r="2.6" fill="#fff"/>' +
        '<circle cx="' + (cx + 2.5) + '" cy="' + (cy + 3.5) + '" r="1.2" fill="#fff" opacity=".8"/></g>';
    }
    function happyEye(cx, cy) {
      return '<path d="M' + (cx - 8) + ' ' + (cy + 2) + ' Q' + cx + ' ' + (cy - 8) + ' ' + (cx + 8) + ' ' + (cy + 2) + '" fill="none" stroke="' + line + '" stroke-width="3.2" stroke-linecap="round"/>';
    }

    return '' +
      '<svg class="av-svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<defs>' +
        '<linearGradient id="out' + uid + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".45" stop-color="#d7e3f2"/><stop offset="1" stop-color="#a9bad3"/></linearGradient>' +
        '<linearGradient id="pk' + uid + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff9fd0"/><stop offset="1" stop-color="#ff3f93"/></linearGradient>' +
      '</defs>' +
      back +
      '<rect x="88" y="124" width="24" height="28" fill="' + skin + '"/>' +
      '<path d="M26 200 C30 162 60 146 100 146 C140 146 170 162 174 200 Z" fill="url(#out' + uid + ')" stroke="#9fb2cc" stroke-width="1.5"/>' +
      '<path d="M84 147 L100 168 L116 147" fill="none" stroke="' + m.color + '" stroke-width="5" stroke-linejoin="round"/>' +
      '<ellipse cx="100" cy="92" rx="44" ry="46" fill="' + skin + '"/>' +
      '<path d="M56 90 C54 50 78 34 100 34 C124 34 148 50 146 90 C136 72 124 62 114 58 C108 70 94 74 82 68 C74 78 64 84 56 90 Z" fill="' + m.hair + '"/>' +
      '<path d="M57 84 C52 104 54 122 60 134 L64 104 Z M143 84 C148 104 146 122 140 134 L136 104 Z" fill="' + m.hair + '"/>' +
      acc +
      '<g class="g-eyes" data-k="open">' + eye(82, 98) + eye(118, 98) + '</g>' +
      '<g class="g-eyes" data-k="happy">' + happyEye(82, 99) + happyEye(118, 99) + '</g>' +
      '<g class="g-eyes" data-k="wink">' + eye(82, 98) + happyEye(118, 99) +
        '<path transform="translate(140 84)" d="M0 -7 Q1 -1 7 0 Q1 1 0 7 Q-1 1 -7 0 Q-1 -1 0 -7Z" fill="#ffd34d"/></g>' +
      '<ellipse class="blush" cx="70" cy="113" rx="8" ry="4.5" fill="#ff8fb5"/>' +
      '<ellipse class="blush" cx="130" cy="113" rx="8" ry="4.5" fill="#ff8fb5"/>' +
      '<g class="g-mouth" data-k="neutral"><path d="M95 121 Q100 123.5 105 121" fill="none" stroke="' + line + '" stroke-width="2.4" stroke-linecap="round"/></g>' +
      '<g class="g-mouth" data-k="smile"><path d="M92 118 Q100 127 108 118" fill="none" stroke="' + line + '" stroke-width="2.6" stroke-linecap="round"/></g>' +
      '<g class="g-mouth" data-k="open"><path d="M91 117 Q100 133 109 117 Z" fill="#e8577f" stroke="' + line + '" stroke-width="2" stroke-linejoin="round"/></g>' +
      '<g class="g-hands" data-k="wave">' +
        '<path d="M160 190 C168 168 170 150 166 130" fill="none" stroke="url(#out' + uid + ')" stroke-width="16" stroke-linecap="round"/>' +
        '<ellipse cx="166" cy="120" rx="10" ry="12" fill="' + skin + '" stroke="#e8c3b6"/>' +
        '<path d="M178 104 l6 -5 M182 116 l8 -1 M174 96 l2 -7" stroke="' + m.color + '" stroke-width="2.5" stroke-linecap="round"/></g>' +
      '<g class="g-hands" data-k="heart">' +
        '<path d="' + heartD(100, 172, 30) + '" fill="url(#pk' + uid + ')" stroke="#fff" stroke-width="2"/>' +
        '<circle cx="86" cy="176" r="8" fill="' + skin + '" stroke="#e8c3b6"/><circle cx="114" cy="176" r="8" fill="' + skin + '" stroke="#e8c3b6"/></g>' +
      '<g class="g-hands" data-k="double">' +
        '<path d="' + heartD(100, 172, 52) + '" fill="url(#pk' + uid + ')" stroke="#fff" stroke-width="2.5"/>' +
        '<circle cx="74" cy="168" r="9" fill="' + skin + '" stroke="#e8c3b6"/><circle cx="126" cy="168" r="9" fill="' + skin + '" stroke="#e8c3b6"/>' +
        '<path d="' + heartD(44, 60, 14) + '" fill="#ff7fb6"/><path d="' + heartD(158, 40, 11) + '" fill="#ff9fd0"/></g>' +
      '</svg>';
  }
  HP.avatarSVG = avatarSVG;

  var uidSeq = 0;

  function MemberView(el, member, bubbleEl) {
    this.el = el;
    this.member = member;
    this.bubble = bubbleEl || null;
    this.level = 1;
    this.cur = null;
    this.nextBlink = 0;
    this.lastLineAt = 0;
    this.useImages = !!(member.images && member.images.idle);
    el.innerHTML = '';
    if (this.useImages) {
      this.img = document.createElement('img');
      this.img.className = 'av-img';
      this.img.alt = member.name;
      this.img.src = member.images.idle;
      el.appendChild(this.img);
    } else {
      el.innerHTML = avatarSVG(member, 'u' + (uidSeq++));
      this.svg = el.querySelector('svg');
    }
    this.apply('idle');
  }

  MemberView.prototype.setLevel = function (lv) {
    this.level = lv;
    if (!this.cur) this.apply('idle');
  };

  MemberView.prototype.apply = function (state) {
    this.el.setAttribute('data-state', state);
    if (this.useImages) {
      var src = this.member.images[state] || this.member.images.idle;
      if (this.img.getAttribute('src') !== src) this.img.src = src;
      return;
    }
    applyPose(this.svg, state, this.level);
  };

  /* 임시 캐릭터 SVG에 표정/포즈 적용 */
  function applyPose(svg, state, level) {
    var pose = Object.assign({}, POSE[state] || POSE.idle);
    // LV.2 이상은 평상시에도 밝은 미소
    if (state === 'idle' && level >= 2) pose.mouth = 'smile';
    ['eyes', 'mouth', 'hands'].forEach(function (g) {
      var nodes = svg.querySelectorAll('.g-' + g);
      for (var i = 0; i < nodes.length; i++) {
        nodes[i].style.display = nodes[i].getAttribute('data-k') === pose[g] ? '' : 'none';
      }
    });
    svg.classList.toggle('blushing', state !== 'idle' || level >= 3);
  }
  HP.applyPose = applyPose;

  MemberView.prototype.isBusy = function (minPriority) {
    return !!(this.cur && performance.now() < this.cur.until && this.cur.priority >= minPriority);
  };

  /* 리액션 재생. 더 높은 우선순위 리액션이 재생 중이면 false */
  MemberView.prototype.react = function (state, opts) {
    opts = opts || {};
    var now = performance.now();
    var pr = opts.priority != null ? opts.priority : (PRIORITY[state] || 0);
    if (this.cur && now < this.cur.until && pr < this.cur.priority) return false;
    var dur = opts.duration || HP.CONFIG.reactions.durations[state] || 800;
    this.cur = { state: state, priority: pr, until: now + dur };
    this.apply(state);
    this.el.classList.remove('react');
    void this.el.offsetWidth;
    this.el.classList.add('react');
    if (opts.line) this.say(opts.line, Math.max(dur, 1200));
    return true;
  };

  MemberView.prototype.say = function (text, ms) {
    if (!this.bubble || !text) return;
    this.lastLineAt = performance.now();
    this.bubble.textContent = text;
    this.bubble.classList.remove('show');
    void this.bubble.offsetWidth;
    this.bubble.classList.add('show');
    clearTimeout(this._sayT);
    var b = this.bubble;
    this._sayT = setTimeout(function () { b.classList.remove('show'); }, ms || 1400);
  };

  MemberView.prototype.canSay = function () {
    return performance.now() - this.lastLineAt > HP.CONFIG.reactions.lineCooldownMs && !this.isBusy(2);
  };

  /* 하트 도착 시 약한 스케일 펄스 */
  MemberView.prototype.pulse = function () {
    this.el.classList.remove('pulse');
    void this.el.offsetWidth;
    this.el.classList.add('pulse');
  };

  MemberView.prototype.update = function (now) {
    if (this.cur && now >= this.cur.until) {
      this.cur = null;
      this.apply('idle');
    }
    // 평상시 눈 깜빡임
    if (!this.useImages && !this.cur) {
      if (!this.nextBlink) this.nextBlink = now + 1500 + Math.random() * 2500;
      if (now >= this.nextBlink) {
        this.nextBlink = now + 2200 + Math.random() * 3000;
        var svg = this.svg;
        svg.classList.add('blink');
        setTimeout(function () { svg.classList.remove('blink'); }, 150);
      }
    }
  };

  HP.MemberView = MemberView;
})();
