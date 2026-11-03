/*
 * KZNA HEART POP — 화면 흐름 / HUD / 게임 루프
 * MERGE → HEART → LOVE GAUGE → LEVEL UP → MEMBER REACTION
 */
(function () {
  var CFG = HP.CONFIG;
  var $ = function (id) { return document.getElementById(id); };

  var els = {
    app: $('app'),
    select: $('screen-select'),
    game: $('screen-game'),
    result: $('screen-result'),
    memberGrid: $('memberGrid'),
    stage: $('stage'),
    avatar: $('avatar'),
    bubble: $('bubble'),
    memberName: $('memberName'),
    levelBanner: $('levelBanner'),
    lvVal: $('lvVal'),
    gauge: $('gauge'),
    gaugeFill: $('gaugeFill'),
    gaugeText: $('gaugeText'),
    loveHud: $('loveHud'),
    score: $('score'),
    best: $('best'),
    next: $('nextCanvas'),
    boardWrap: $('boardWrap'),
    board: $('board'),
    centerMsg: $('centerMsg'),
    fx: $('fx'),
    btnSound: $('btnSound'),
    btnRestart: $('btnRestart'),
    hwLive: $('hwLive')
  };

  /* ---------- 저장 ---------- */
  function load(key, d) { try { var v = localStorage.getItem(key); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }
  function save(key, v) { try { localStorage.setItem(key, JSON.stringify(v)); } catch (e) {} }

  /* ---------- 상태 ---------- */
  var state = 'select';     // select | playing | ending | result
  var member = null;
  var memberView = null;
  var score = 0;
  var best = load('hp_best', 0);
  var love = null;
  var combo = 0, lastMergeAt = -9999;
  var pendingLevelUp = 0;
  var endingAt = 0;
  var gaugeView = { level: 1, value: 0 };
  var hwBase = 0;          // 이번 판 시작 전까지 쌓인 HEARTWARE (멤버별 누적 LOVE)
  var hwCommitted = true;  // 이번 판 LOVE를 누적에 반영했는지
  var loopLast = performance.now();

  function newLove() { return { level: 1, gauge: 0, total: 0, hearts: 0 }; }

  /* HEARTWARE: 판이 끝나도 사라지지 않고 멤버별로 계속 쌓이는 팬 데이터 */
  function loadHW(id) { return Object.assign({ love: 0, hearts: 0, plays: 0 }, load('hp_hw_' + id, {})); }
  function commitHW() {
    if (hwCommitted || !member || !love) return;
    hwCommitted = true;
    var hw = loadHW(member.id);
    hw.love += love.total; hw.hearts += love.hearts; hw.plays += 1;
    save('hp_hw_' + member.id, hw);
    hwBase = hw.love - love.total;
  }

  /* LOVE 지급: 초과분은 다음 레벨로 이월 */
  function addLove(points) {
    love.total += points;
    love.hearts++;
    love.gauge += points;
    var ups = [];
    while (love.gauge >= CFG.love.needFor(love.level)) {
      love.gauge -= CFG.love.needFor(love.level);
      love.level++;
      ups.push(love.level);
    }
    return ups;
  }

  /* ---------- 게임판 ---------- */
  var board = new HP.Board(els.board, {
    onMerge: onMerge,
    onDrop: function () { HP.Audio.drop(); },
    onGameOver: onGameOver
  });

  function memberTarget() {
    var r = els.avatar.getBoundingClientRect();
    return { x: r.left + r.width * 0.5, y: r.top + r.height * 0.62 };
  }

  HP.Hearts.init(els.fx, {
    boardToScreen: function (x, y) { return board.toScreen(x, y); },
    target: memberTarget,
    onLaunch: function () { HP.Audio.launch(); },
    onArrive: onHeartArrive
  });

  function onMerge(e) {
    var now = performance.now();
    combo = now - lastMergeAt < CFG.love.combo.windowMs ? combo + 1 : 1;
    lastMergeAt = now;
    var base = CFG.love.perMergeTier[e.tier] || CFG.love.perMergeTier[CFG.love.perMergeTier.length - 1];
    var mult = 1 + Math.min(CFG.love.combo.maxBonus, (combo - 1) * CFG.love.combo.stepBonus);
    var points = Math.round(base * mult);

    score += e.vanish ? CFG.score.maxPair : CFG.score.forCreatedTier(e.newTier);
    if (score > best) { best = score; }
    updateScore();

    // 합성된 아이템은 게임판에 남고, 하트는 별도로 생성된다
    HP.Hearts.spawn({ bx: e.x, by: e.y, points: points, tier: e.tier });
    HP.Audio.merge(e.tier);
    if (combo >= 2) board.toast('COMBO ×' + combo, e.x, e.y);
  }

  function onHeartArrive(f, instant) {
    var ups = addLove(f.points);
    if (!instant) {
      HP.Audio.arrive();
      memberView.pulse();
      els.gauge.classList.remove('hit'); void els.gauge.offsetWidth; els.gauge.classList.add('hit');
      var hl = els.hwLive.parentNode; hl.classList.remove('tick'); void hl.offsetWidth; hl.classList.add('tick');
      if (!ups.length) {
        // 하트가 닿으면 레벨에 맞는 대사를 랜덤으로 (말풍선이 겹치지 않게 쿨다운)
        var line = null;
        if (Math.random() < CFG.reactions.lineChanceOnHeart && memberView.canSay()) line = HP.heartLine(member, love.level);
        memberView.react('happy', { line: line });
      }
    }
    if (ups.length) pendingLevelUp = Math.max(pendingLevelUp, ups[ups.length - 1]);
  }

  /* 레벨업 리액션 — 재생 중인 레벨업이 끝난 뒤 가장 최신 레벨 하나만 재생 */
  function processLevelUps() {
    if (!pendingLevelUp || memberView.isBusy(3) || gaugeView.level < pendingLevelUp) return;
    var lv = pendingLevelUp;
    pendingLevelUp = 0;
    var map = CFG.reactions.levelMap;
    var st = map[Math.min(lv, 7)] || 'celebrate';
    memberView.setLevel(lv);
    memberView.react(st, { priority: 3, duration: CFG.reactions.durations[st] + 300, line: HP.reactionLine(member, st) });
    showBanner(HP.t('levelUp'), 'HEARTWARE LV.' + lv);
    HP.Audio.levelUp();
    els.stage.classList.toggle('aura', lv >= 7);
    els.stage.style.setProperty('--aura', Math.min(1, (lv - 6) * 0.35));
    var r = memberTarget();
    HP.Hearts.burstAt(r.x, r.y, true);
  }

  function showBanner(main, sub) {
    els.levelBanner.innerHTML = '<b>' + main + '</b><span>' + sub + '</span>';
    els.levelBanner.classList.remove('show'); void els.levelBanner.offsetWidth;
    els.levelBanner.classList.add('show');
  }

  function pad2(n) { return n < 10 ? '0' + n : '' + n; }
  function fmt(n) { return Math.round(n).toLocaleString('en-US'); }

  function updateScore() {
    els.score.textContent = fmt(score);
    els.best.textContent = fmt(best);
  }

  /* 게이지 표시: 실제 값을 부드럽게 따라간다. 레벨업 시 끝까지 채운 뒤 0부터 다시 */
  function updateGauge(dt) {
    var need = CFG.love.needFor(gaugeView.level);
    var target = gaugeView.level < love.level ? need : love.gauge;
    var diff = target - gaugeView.value;
    var stepV = Math.max(Math.abs(diff) * Math.min(1, dt * 0.014), dt * need * 0.0012);
    gaugeView.value = Math.abs(diff) <= stepV ? target : gaugeView.value + Math.sign(diff) * stepV;
    if (gaugeView.level < love.level && gaugeView.value >= need - 0.5) {
      gaugeView.level++;
      gaugeView.value = 0;
      els.gauge.classList.remove('levelup'); void els.gauge.offsetWidth; els.gauge.classList.add('levelup');
      need = CFG.love.needFor(gaugeView.level);
    }
    els.gaugeFill.style.width = (Math.max(0, Math.min(1, gaugeView.value / need)) * 100).toFixed(2) + '%';
    els.gaugeText.textContent = fmt(gaugeView.value) + ' / ' + fmt(need);
    els.lvVal.textContent = 'LV.' + gaugeView.level;
    els.hwLive.textContent = fmt(hwBase + love.total);
  }

  function resizeBoard() {
    var r = els.boardWrap.getBoundingClientRect();
    board.resize(r.width, r.height);
  }

  /* ---------- 화면 전환 ---------- */
  function show(screen) {
    [els.select, els.game].forEach(function (s) { s.classList.toggle('active', s === screen); });
  }

  function buildSelect() {
    els.memberGrid.innerHTML = '';
    HP.MEMBERS.forEach(function (m, i) {
      var b = document.createElement('button');
      b.className = 'member-card';
      b.style.setProperty('--mc', m.color);
      b.style.setProperty('--tilt', (i % 2 ? 1.6 : -1.6) * (i < 2 ? 1 : -1) + 'deg');
      var bestLv = load('hp_love_' + m.id, 0);
      var hwc = loadHW(m.id);
      var art = (m.images && m.images.idle)
        ? '<img class="av-img" src="' + m.images.idle + '" alt="">'
        : HP.avatarSVG(m, 's' + i);
      var local = HP.memberLocalName(m);
      // チェキ(인스탁스) 스타일 카드: 마스킹테이프 + 사진 + 손글씨 이름
      b.innerHTML = '<span class="tape"></span>' +
        '<div class="card-art">' + art +
          '<div class="card-hw">' + fmt(hwc.love) + '</div>' +
          (bestLv ? '<div class="card-best"><small>LOVE</small>' + bestLv + '</div>' : '') +
        '</div>' +
        '<div class="card-cap"><span class="card-name">' + m.name + '</span>' + (local ? '<span class="card-sign">' + local + '</span>' : '') + '</div>';
      b.setAttribute('aria-label', m.name + (local ? ' ' + local : '') + ' — HEARTWARE ' + fmt(hwc.love));
      var svg = b.querySelector('.card-art svg');
      if (svg) HP.applyPose(svg, 'happy', 2);
      b.addEventListener('click', function () { HP.Audio.unlock(); HP.Audio.tap(); startGame(m); });
      els.memberGrid.appendChild(b);
    });
  }

  function startGame(m) {
    // 도중에 다시 시작해도 날아가던 하트까지 HEARTWARE에 남긴다
    if (state === 'playing' || state === 'ending') HP.Hearts.flushAll();
    commitHW();
    member = m || member;
    hwBase = loadHW(member.id).love;
    hwCommitted = false;
    els.app.style.setProperty('--mc', member.color);
    setMemberName();
    memberView = new HP.MemberView(els.avatar, member, els.bubble);
    els.stage.classList.toggle('has-img', memberView.useImages);
    score = 0;
    love = newLove();
    gaugeView = { level: 1, value: 0 };
    combo = 0; lastMergeAt = -9999; pendingLevelUp = 0;
    els.stage.classList.remove('aura');
    els.result.classList.remove('show');
    HP.Hearts.clear();
    board.reset();
    show(els.game);
    state = 'playing';
    HP.Audio.bgmStart();
    requestAnimationFrame(function () {
      resizeBoard();
      updateScore();
      updateGauge(0);
      board.drawPreview(els.next, board.next);
    });
    showCenter(HP.t('connect'), 900);
    setTimeout(function () { if (state === 'playing') showCenter(HP.t('start'), 1200); }, 950);
    memberView.react('happy', { duration: 1200, line: HP.reactionLine(member, 'happy') });
  }

  function showCenter(text, ms) {
    els.centerMsg.textContent = text;
    els.centerMsg.classList.remove('show'); void els.centerMsg.offsetWidth;
    els.centerMsg.classList.add('show');
    clearTimeout(showCenter._t);
    showCenter._t = setTimeout(function () { els.centerMsg.classList.remove('show'); }, ms);
  }

  function onGameOver() {
    if (state !== 'playing') return;
    state = 'ending';
    endingAt = performance.now();
    HP.Audio.bgmStop(1.2);
    HP.Audio.finish();
    showCenter(HP.t('finish'), 1600);
  }

  /* 비행 중인 하트가 모두 도착(또는 타임아웃)한 뒤 결과 표시 */
  function checkEnding(now) {
    var waited = now - endingAt;
    if (waited < 1300) return;
    var settled = HP.Hearts.inFlight() === 0 && !pendingLevelUp && gaugeView.level === love.level && Math.abs(gaugeView.value - love.gauge) < 1 && !memberView.isBusy(3);
    if (settled || waited > CFG.endFlushTimeoutMs) {
      HP.Hearts.flushAll();
      gaugeView.level = love.level;
      gaugeView.value = love.gauge;
      memberView.setLevel(love.level);
      pendingLevelUp = 0;
      showResult();
    }
  }

  function showResult() {
    state = 'result';
    var isBest = score > load('hp_best', 0);
    if (isBest) save('hp_best', score);
    best = Math.max(best, score);
    var prevLv = load('hp_love_' + member.id, 0);
    if (love.level > prevLv) save('hp_love_' + member.id, love.level);
    updateScore();
    commitHW();
    $('resHwTotal').textContent = fmt(hwBase + love.total);

    $('resScore').textContent = fmt(score);
    $('resMember').textContent = member.name;
    $('resLv').textContent = love.level;
    $('resLove').textContent = fmt(love.total);
    $('resBest').classList.toggle('show', isBest);
    $('resSpecial').classList.toggle('show', love.level >= 7);
    var art = $('resArt');
    var view = new HP.MemberView(art, member, null);
    view.setLevel(love.level);
    view.apply(love.level >= 6 ? 'special' : love.level >= 4 ? 'heart' : 'happy');
    resultQuote = HP.reactionLine(member, love.level >= 6 ? 'special' : love.level >= 3 ? 'heart' : 'happy');
    fillResultText();
    els.result.classList.add('show');
  }

  /* X 공유 링크 (window.open 대신 일반 링크 — 임베드/샌드박스 환경에서도 동작) */
  function updateShareLink() {
    var text = 'KZNA HEART POP\nSCORE ' + fmt(score) + ' / ' + member.name + ' LOVE LV.' + love.level + '\n' +
      HP.t('shareText', { name: HP.memberLocalName(member) || member.name, n: fmt(love.hearts), total: fmt(hwBase + love.total) });
    var inFrame = false;
    try { inFrame = window.top !== window; } catch (e) { inFrame = true; }
    var url = CFG.share.url || (!inFrame && location.protocol.indexOf('http') === 0 ? location.href.split('#')[0] : '');
    var q = 'text=' + encodeURIComponent(text) + '&hashtags=' + encodeURIComponent(CFG.share.hashtags.join(','));
    if (url) q += '&url=' + encodeURIComponent(url);
    $('btnShare').href = 'https://twitter.com/intent/tweet?' + q;
  }

  /* ---------- 다국어 ---------- */
  var resultQuote = '';

  function setMemberName() {
    if (!member) return;
    var local = HP.memberLocalName(member);
    els.memberName.innerHTML = member.name + (local ? '<small>' + local + '</small>' : '');
  }

  // 결과 화면 중 언어에 따라 바뀌는 부분
  function fillResultText() {
    if (!member || !love) return;
    $('resHearts').textContent = HP.t('heartsSent', { n: fmt(love.hearts) });
    $('resQuote').textContent = resultQuote ? HP.t('quote', { t: resultQuote }) : '';
    $('btnHome').href = HP.homepageUrl();
    updateShareLink();
  }

  function applyLang() {
    var nodes = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < nodes.length; i++) nodes[i].textContent = HP.t(nodes[i].getAttribute('data-i18n'));
    nodes = document.querySelectorAll('[data-i18n-aria]');
    for (i = 0; i < nodes.length; i++) nodes[i].setAttribute('aria-label', HP.t(nodes[i].getAttribute('data-i18n-aria')));
    var btns = document.querySelectorAll('#langSwitch button');
    for (i = 0; i < btns.length; i++) btns[i].classList.toggle('on', btns[i].getAttribute('data-lang') === HP.lang);
    $('btnHome').href = HP.homepageUrl();
    setMemberName();
    if (state === 'select') buildSelect();
    if (state === 'result') fillResultText();
  }

  HP.onLangChange(applyLang);
  $('langSwitch').addEventListener('click', function (e) {
    var l = e.target.getAttribute && e.target.getAttribute('data-lang');
    if (l) { HP.Audio.tap(); HP.setLang(l, true); }
  });

  /* ---------- 입력 ---------- */
  var holding = false;
  els.boardWrap.addEventListener('pointerdown', function (e) {
    if (state !== 'playing') return;
    HP.Audio.unlock();
    holding = true;
    board.setAim(board.toLogicalX(e.clientX));
    try { els.boardWrap.setPointerCapture(e.pointerId); } catch (err) {}
  });
  els.boardWrap.addEventListener('pointermove', function (e) {
    if (state !== 'playing') return;
    if (holding || e.pointerType === 'mouse') board.setAim(board.toLogicalX(e.clientX));
  });
  function release(e) {
    if (!holding) return;
    holding = false;
    if (state !== 'playing') return;
    board.setAim(board.toLogicalX(e.clientX));
    if (board.drop()) board.drawPreview(els.next, board.next);
  }
  els.boardWrap.addEventListener('pointerup', release);
  els.boardWrap.addEventListener('pointercancel', function () { holding = false; });

  window.addEventListener('keydown', function (e) {
    if (state !== 'playing') return;
    if (e.key === 'ArrowLeft') board.setAim(board.aimX - 12);
    else if (e.key === 'ArrowRight') board.setAim(board.aimX + 12);
    else if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      HP.Audio.unlock();
      if (board.drop()) board.drawPreview(els.next, board.next);
    }
  });

  function syncSoundBtn() { els.btnSound.classList.toggle('off', HP.Audio.isMuted()); }
  els.btnSound.addEventListener('click', function () { HP.Audio.setMuted(!HP.Audio.isMuted()); syncSoundBtn(); HP.Audio.tap(); });
  els.btnRestart.addEventListener('click', function () { HP.Audio.tap(); startGame(member); });
  $('btnAgain').addEventListener('click', function () { HP.Audio.tap(); startGame(member); });
  $('btnChange').addEventListener('click', function () {
    HP.Audio.tap();
    els.result.classList.remove('show');
    commitHW();
    HP.Hearts.clear();
    state = 'select';
    buildSelect();
    show(els.select);
  });
  syncSoundBtn();

  window.addEventListener('resize', function () { if (state !== 'select') { resizeBoard(); board.drawPreview(els.next, board.next); } });
  document.addEventListener('visibilitychange', function () { loopLast = performance.now(); });

  /* ---------- 루프 ---------- */
  function frame(now) {
    var dt = Math.min(50, now - loopLast);
    loopLast = now;
    if (state !== 'select') {
      if (state === 'playing') board.step(dt);
      board.draw(now, state === 'playing');
      HP.Hearts.update(dt, now);
      updateGauge(dt);
      processLevelUps();
      memberView.update(now);
      if (state === 'ending') checkEnding(now);
    } else {
      HP.Hearts.update(dt, now);
    }
    HP.Hearts.draw(now);
    requestAnimationFrame(frame);
  }

  buildSelect();
  applyLang();
  updateScore();
  requestAnimationFrame(frame);

  /* 테스트/디버그용 */
  HP.debug = {
    state: function () { return { state: state, score: score, love: Object.assign({}, love), gauge: Object.assign({}, gaugeView), ledger: HP.Hearts.ledger(), items: board.items().length, member: member && member.id }; },
    board: board,
    start: function (id) { startGame(HP.MEMBERS.filter(function (m) { return m.id === id; })[0] || HP.MEMBERS[0]); },
    spawn: function (tier, x, y) { return board.spawn(tier, x, y); },
    forceGameOver: function () { board.over = true; onGameOver(); }
  };
})();
