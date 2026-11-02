/*
 * 하트 비행 + 보상 장부
 *
 * - 합성 지점(게임판 논리 좌표)에서 하트를 만들고, 매 프레임 화면 좌표로 다시 변환한다.
 *   → 화면 크기가 바뀌거나 스크롤돼도 경로가 어긋나지 않는다.
 * - 물리 엔진과 독립적으로 동작한다 (게임판이 멈춰도 하트는 계속 날아간다).
 * - 각 하트는 applied 플래그로 딱 한 번만 지급된다. flushAll() 은 남은 하트를 즉시 지급한다.
 */
window.HP = window.HP || {};

HP.Hearts = (function () {
  var TAU = Math.PI * 2;
  var canvas, ctx, dpr = 1;
  var sprite = null, spriteSize = 128;
  var flights = [];
  var particles = [];
  var seq = 0;
  var opts = {};
  var ledger = { generated: 0, delivered: 0, spawned: 0, arrived: 0 };
  var burst = { at: 0, n: 0 };

  function makeSprite() {
    var S = spriteSize;
    var cv = document.createElement('canvas');
    cv.width = cv.height = S;
    var c = cv.getContext('2d');
    var cx = S / 2, cy = S / 2 + 2, w = S * 0.66;
    // 바깥 글로우
    c.save();
    c.shadowColor = 'rgba(255,80,160,0.85)';
    c.shadowBlur = S * 0.14;
    HP.heartPath(c, cx, cy, w);
    var g = c.createLinearGradient(0, cy - w * 0.45, 0, cy + w * 0.45);
    g.addColorStop(0, 'rgba(255,170,215,0.95)');
    g.addColorStop(0.55, 'rgba(255,85,160,0.92)');
    g.addColorStop(1, 'rgba(230,40,120,0.95)');
    c.fillStyle = g;
    c.fill();
    c.restore();
    // 젤리 속광
    c.save();
    HP.heartPath(c, cx, cy, w);
    c.clip();
    var rg = c.createRadialGradient(cx + w * 0.12, cy + w * 0.12, 1, cx + w * 0.12, cy + w * 0.12, w * 0.5);
    rg.addColorStop(0, 'rgba(255,230,245,0.55)');
    rg.addColorStop(1, 'rgba(255,230,245,0)');
    c.fillStyle = rg;
    c.fillRect(0, 0, S, S);
    // 홀로그램 띠
    var hg = c.createLinearGradient(cx - w / 2, cy - w / 2, cx + w / 2, cy + w / 2);
    hg.addColorStop(0, 'rgba(150,240,255,0)');
    hg.addColorStop(0.45, 'rgba(150,240,255,0.35)');
    hg.addColorStop(0.55, 'rgba(210,180,255,0.3)');
    hg.addColorStop(0.7, 'rgba(150,240,255,0)');
    c.fillStyle = hg;
    c.fillRect(0, 0, S, S);
    c.restore();
    // 테두리
    HP.heartPath(c, cx, cy, w);
    var sg = c.createLinearGradient(cx - w / 2, cy - w / 2, cx + w / 2, cy + w / 2);
    sg.addColorStop(0, '#bff6ff');
    sg.addColorStop(0.5, '#ffffff');
    sg.addColorStop(1, '#ffc0ec');
    c.lineWidth = S * 0.05;
    c.strokeStyle = '#1e2a47';
    c.stroke();
    HP.heartPath(c, cx, cy, w * 0.9);
    c.lineWidth = S * 0.018;
    c.strokeStyle = sg;
    c.stroke();
    // 하이라이트
    c.save();
    c.translate(cx - w * 0.2, cy - w * 0.16);
    c.rotate(-0.6);
    c.beginPath();
    c.ellipse(0, 0, w * 0.13, w * 0.07, 0, 0, TAU);
    c.fillStyle = 'rgba(255,255,255,0.85)';
    c.fill();
    c.restore();
    c.beginPath();
    c.arc(cx + w * 0.22, cy - w * 0.2, w * 0.035, 0, TAU);
    c.fillStyle = 'rgba(255,255,255,0.9)';
    c.fill();
    return cv;
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 3);
    canvas.width = Math.round(window.innerWidth * dpr);
    canvas.height = Math.round(window.innerHeight * dpr);
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
  }

  function init(cv, o) {
    canvas = cv;
    ctx = canvas.getContext('2d');
    opts = o;
    sprite = makeSprite();
    resize();
    window.addEventListener('resize', resize);
  }

  function easeInOutCubic(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function easeOutBack(t) { var c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); }

  /* 하트 생성. bx/by 는 게임판 논리 좌표 */
  function spawn(o) {
    var now = performance.now();
    var cfg = HP.CONFIG.heart;
    if (now - burst.at > 220) burst.n = 0;
    burst.at = now;
    var delay = Math.min(cfg.staggerMaxMs, burst.n * cfg.staggerMs);
    burst.n++;
    var f = {
      id: ++seq,
      bx: o.bx, by: o.by,
      points: o.points,
      tier: o.tier || 0,
      size: cfg.baseSize * (1 + Math.min(1, o.points / 240) * 0.75),
      start: now + delay,
      dur: cfg.minMs + Math.random() * (cfg.maxMs - cfg.minMs),
      side: (Math.random() < 0.5 ? -1 : 1) * (0.6 + Math.random() * 0.5),
      applied: false,
      launched: false,
      trail: [],
      lastSpark: 0
    };
    flights.push(f);
    ledger.generated += o.points;
    ledger.spawned++;
    return f;
  }

  function target() {
    return opts.target();
  }

  /* 비행 경로 위의 점 (매번 현재 화면 좌표로 계산) */
  function pathPoint(f, u) {
    var S = opts.boardToScreen(f.bx, f.by);
    var E = target();
    var pop = 0.16;
    var lift = 22;
    if (u < pop) {
      var p = u / pop;
      return { x: S.x, y: S.y - lift * easeOutBack(p), scale: 0.2 + 0.95 * easeOutBack(p), tx: 0, ty: -1 };
    }
    var v = easeInOutCubic((u - pop) / (1 - pop));
    var P0 = { x: S.x, y: S.y - lift };
    var dy = E.y - P0.y;
    var C = {
      x: P0.x + (E.x - P0.x) * 0.15 + f.side * Math.min(150, Math.abs(dy) * 0.42 + 30),
      y: P0.y + dy * 0.55
    };
    var a = 1 - v;
    var x = a * a * P0.x + 2 * a * v * C.x + v * v * E.x;
    var y = a * a * P0.y + 2 * a * v * C.y + v * v * E.y;
    var tx = 2 * a * (C.x - P0.x) + 2 * v * (E.x - C.x);
    var ty = 2 * a * (C.y - P0.y) + 2 * v * (E.y - C.y);
    var scale = 1.15 - 0.15 * Math.min(1, v * 2) - 0.32 * Math.max(0, v - 0.6) / 0.4;
    return { x: x, y: y, scale: scale, tx: tx, ty: ty };
  }

  function addBurst(x, y, big) {
    var n = big ? 14 : 9;
    for (var i = 0; i < n; i++) {
      var a = (i / n) * TAU + Math.random() * 0.4;
      var sp = 1.2 + Math.random() * (big ? 2.6 : 1.8);
      particles.push({
        x: x, y: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 0.4,
        life: 0, max: 420 + Math.random() * 260,
        kind: i % 3 === 0 ? 'heart' : 'spark',
        size: i % 3 === 0 ? 7 + Math.random() * 5 : 2 + Math.random() * 2,
        color: ['#ffffff', '#ff8fc8', '#9fe9ff', '#d7c4ff'][i % 4]
      });
    }
    particles.push({ x: x, y: y, vx: 0, vy: 0, life: 0, max: 360, kind: 'ring', size: big ? 46 : 32, color: '#ffffff' });
  }

  function arrive(f, instant) {
    if (f.applied) return;
    f.applied = true;
    ledger.delivered += f.points;
    ledger.arrived++;
    if (!instant) {
      var E = target();
      addBurst(E.x, E.y, f.points >= 85);
    }
    if (opts.onArrive) opts.onArrive(f, !!instant);
  }

  function update(dt, now) {
    for (var i = 0; i < flights.length; i++) {
      var f = flights[i];
      if (f.applied || now < f.start) continue;
      if (!f.launched) { f.launched = true; if (opts.onLaunch) opts.onLaunch(f); }
      var u = (now - f.start) / f.dur;
      if (u >= 1) { arrive(f, false); continue; }
      var p = pathPoint(f, u);
      f.trail.push({ x: p.x, y: p.y, t: now });
      while (f.trail.length && now - f.trail[0].t > 170) f.trail.shift();
      if (u > 0.16 && now - f.lastSpark > 38) {
        f.lastSpark = now;
        particles.push({
          x: p.x + (Math.random() - 0.5) * 10, y: p.y + (Math.random() - 0.5) * 10,
          vx: (Math.random() - 0.5) * 0.4, vy: 0.3 + Math.random() * 0.4,
          life: 0, max: 380, kind: 'spark', size: 1.6 + Math.random() * 1.6,
          color: Math.random() < 0.5 ? '#ffffff' : (Math.random() < 0.5 ? '#9fe9ff' : '#ffb3dc')
        });
      }
    }
    flights = flights.filter(function (f) { return !f.applied; });
    for (i = 0; i < particles.length; i++) {
      var q = particles[i];
      q.life += dt;
      q.x += q.vx * dt * 0.06;
      q.y += q.vy * dt * 0.06;
      q.vx *= 0.96; q.vy = q.vy * 0.96 + 0.01;
    }
    particles = particles.filter(function (q) { return q.life < q.max; });
  }

  function drawSparkle(c, x, y, s) {
    c.beginPath();
    c.moveTo(x, y - s * 2);
    c.quadraticCurveTo(x, y, x + s * 2, y);
    c.quadraticCurveTo(x, y, x, y + s * 2);
    c.quadraticCurveTo(x, y, x - s * 2, y);
    c.quadraticCurveTo(x, y, x, y - s * 2);
    c.fill();
  }

  function draw(now) {
    var c = ctx;
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.setTransform(dpr, 0, 0, dpr, 0, 0);

    // 파티클
    for (var i = 0; i < particles.length; i++) {
      var q = particles[i];
      var k = q.life / q.max;
      c.globalAlpha = 1 - k;
      if (q.kind === 'ring') {
        c.lineWidth = 2.5 * (1 - k);
        c.strokeStyle = q.color;
        c.beginPath(); c.arc(q.x, q.y, q.size * (0.3 + k), 0, TAU); c.stroke();
      } else if (q.kind === 'heart') {
        var hs = q.size * (1 - k * 0.4);
        c.drawImage(sprite, q.x - hs, q.y - hs, hs * 2, hs * 2);
      } else {
        c.fillStyle = q.color;
        drawSparkle(c, q.x, q.y, q.size * (1 - k * 0.5));
      }
    }
    c.globalAlpha = 1;

    // 하트 + 트레일
    for (i = 0; i < flights.length; i++) {
      var f = flights[i];
      if (f.applied || now < f.start) continue;
      var tr = f.trail;
      for (var j = 1; j < tr.length; j++) {
        var a = j / tr.length;
        c.globalAlpha = a * 0.5;
        c.strokeStyle = j % 2 ? '#ffd1ea' : '#bff3ff';
        c.lineWidth = f.size * 0.32 * a;
        c.lineCap = 'round';
        c.beginPath(); c.moveTo(tr[j - 1].x, tr[j - 1].y); c.lineTo(tr[j].x, tr[j].y); c.stroke();
      }
      c.globalAlpha = 1;
      var u = Math.min(1, (now - f.start) / f.dur);
      var p = pathPoint(f, u);
      var s = f.size * p.scale * (1 + 0.05 * Math.sin(now / 70 + f.id));
      var lean = Math.atan2(p.tx, -p.ty) * 0.3;
      var wobble = Math.sin(now / 120 + f.id * 1.7) * 0.12;
      c.save();
      c.translate(p.x, p.y);
      c.rotate(lean + wobble);
      c.drawImage(sprite, -s, -s, s * 2, s * 2);
      c.restore();
    }
  }

  /* 아직 도착하지 않은 하트를 모두 즉시 지급 (게임 종료 시 유실 방지) */
  function flushAll() {
    var list = flights.slice();
    for (var i = 0; i < list.length; i++) arrive(list[i], true);
    flights = [];
  }

  /* 새 게임 시작 시: 이전 게임의 하트는 버린다 */
  function clear() {
    flights = [];
    particles = [];
    ledger = { generated: 0, delivered: 0, spawned: 0, arrived: 0 };
  }

  return {
    init: init,
    spawn: spawn,
    update: update,
    draw: draw,
    flushAll: flushAll,
    clear: clear,
    inFlight: function () { return flights.length; },
    ledger: function () { return Object.assign({ pending: flights.reduce(function (s, f) { return s + f.points; }, 0) }, ledger); },
    burstAt: addBurst
  };
})();
