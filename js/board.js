/*
 * 수박게임 물리 게임판 (Matter.js)
 *
 * 합성 시 다음 티어 아이템을 게임판에 남기고, hooks.onMerge 로 합성 위치를 알린다.
 * 하트 생성/비행은 이 파일과 독립적으로 hearts.js 가 담당한다.
 */
window.HP = window.HP || {};

(function () {
  var M = window.Matter;
  var TAU = Math.PI * 2;

  /* ---------- 아이템 그림 ---------- */
  function heartPath(c, x, y, w) {
    var h = w * 0.9;
    c.beginPath();
    c.moveTo(x, y + h * 0.45);
    c.bezierCurveTo(x - w * 0.1, y + h * 0.35, x - w * 0.5, y + h * 0.1, x - w * 0.5, y - h * 0.15);
    c.bezierCurveTo(x - w * 0.5, y - h * 0.42, x - w * 0.22, y - h * 0.5, x, y - h * 0.28);
    c.bezierCurveTo(x + w * 0.22, y - h * 0.5, x + w * 0.5, y - h * 0.42, x + w * 0.5, y - h * 0.15);
    c.bezierCurveTo(x + w * 0.5, y + h * 0.1, x + w * 0.1, y + h * 0.35, x, y + h * 0.45);
    c.closePath();
  }
  HP.heartPath = heartPath;

  function starPath(c, s, points, inner) {
    c.beginPath();
    for (var i = 0; i < points * 2; i++) {
      var rr = i % 2 ? s * inner : s;
      var a = -Math.PI / 2 + (i * Math.PI) / points;
      c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
    }
    c.closePath();
  }

  var GLYPHS = {
    sparkle: function (c, s) {
      c.beginPath();
      c.moveTo(0, -s);
      c.quadraticCurveTo(s * 0.12, -s * 0.12, s, 0);
      c.quadraticCurveTo(s * 0.12, s * 0.12, 0, s);
      c.quadraticCurveTo(-s * 0.12, s * 0.12, -s, 0);
      c.quadraticCurveTo(-s * 0.12, -s * 0.12, 0, -s);
      c.fill();
    },
    note: function (c, s) {
      c.save(); c.translate(-s * 0.2, s * 0.42); c.rotate(-0.45);
      c.beginPath(); c.ellipse(0, 0, s * 0.3, s * 0.21, 0, 0, TAU); c.fill(); c.restore();
      c.fillRect(s * 0.04, -s * 0.72, s * 0.13, s * 1.12);
      c.beginPath(); c.moveTo(s * 0.17, -s * 0.72);
      c.quadraticCurveTo(s * 0.6, -s * 0.5, s * 0.5, -s * 0.1);
      c.quadraticCurveTo(s * 0.45, -s * 0.38, s * 0.17, -s * 0.4); c.fill();
    },
    star: function (c, s) { starPath(c, s, 5, 0.46); c.fill(); },
    heart: function (c, s) { heartPath(c, 0, s * 0.08, s * 1.75); c.fill(); },
    diamond: function (c, s) {
      c.beginPath();
      c.moveTo(-s * 0.85, -s * 0.25); c.lineTo(-s * 0.45, -s * 0.7); c.lineTo(s * 0.45, -s * 0.7);
      c.lineTo(s * 0.85, -s * 0.25); c.lineTo(0, s * 0.85); c.closePath(); c.fill();
      c.globalCompositeOperation = 'destination-out';
      c.lineWidth = s * 0.07;
      c.beginPath(); c.moveTo(-s * 0.85, -s * 0.25); c.lineTo(s * 0.85, -s * 0.25);
      c.moveTo(-s * 0.3, -s * 0.25); c.lineTo(0, s * 0.8); c.lineTo(s * 0.3, -s * 0.25); c.stroke();
      c.globalCompositeOperation = 'source-over';
    },
    moon: function (c, s) {
      c.beginPath(); c.arc(0, 0, s * 0.8, 0, TAU); c.fill();
      c.globalCompositeOperation = 'destination-out';
      c.beginPath(); c.arc(s * 0.38, -s * 0.22, s * 0.68, 0, TAU); c.fill();
      c.globalCompositeOperation = 'source-over';
      c.save(); c.translate(s * 0.45, s * 0.35); starPath(c, s * 0.2, 4, 0.35); c.fill(); c.restore();
    },
    flower: function (c, s) {
      for (var i = 0; i < 5; i++) {
        var a = -Math.PI / 2 + (i * TAU) / 5;
        c.beginPath(); c.arc(Math.cos(a) * s * 0.45, Math.sin(a) * s * 0.45, s * 0.36, 0, TAU); c.fill();
      }
      c.globalCompositeOperation = 'destination-out';
      c.beginPath(); c.arc(0, 0, s * 0.2, 0, TAU); c.fill();
      c.globalCompositeOperation = 'source-over';
    },
    planet: function (c, s) {
      c.beginPath(); c.arc(0, 0, s * 0.5, 0, TAU); c.fill();
      c.save(); c.rotate(-0.4);
      c.lineWidth = s * 0.13;
      c.beginPath(); c.ellipse(0, 0, s * 0.95, s * 0.3, 0, 0.15, Math.PI - 0.15); c.stroke();
      c.globalAlpha = 0.6;
      c.beginPath(); c.ellipse(0, 0, s * 0.95, s * 0.3, 0, Math.PI + 0.55, TAU - 0.55); c.stroke();
      c.restore();
    },
    crown: function (c, s) {
      c.beginPath();
      c.moveTo(-s * 0.8, s * 0.45); c.lineTo(-s * 0.85, -s * 0.4); c.lineTo(-s * 0.4, -s * 0.02);
      c.lineTo(0, -s * 0.62); c.lineTo(s * 0.4, -s * 0.02); c.lineTo(s * 0.85, -s * 0.4);
      c.lineTo(s * 0.8, s * 0.45); c.closePath(); c.fill();
      [-0.85, 0, 0.85].forEach(function (x, i) {
        c.beginPath(); c.arc(x * s, (i === 1 ? -0.72 : -0.5) * s, s * 0.12, 0, TAU); c.fill();
      });
      c.fillRect(-s * 0.8, s * 0.55, s * 1.6, s * 0.18);
    },
    bigheart: function (c, s) {
      heartPath(c, 0, s * 0.08, s * 1.8); c.fill();
      c.globalCompositeOperation = 'destination-out';
      c.lineWidth = s * 0.08;
      heartPath(c, 0, s * 0.08, s * 1.15); c.stroke();
      c.globalCompositeOperation = 'source-over';
    },
    kzna: function (c, s) {
      // 공식 로고가 로드되어 있으면 은색 구슬 위에서 잘 보이도록 남색으로 칠해 사용
      var img = HP.logoImg;
      if (img && img.complete && img.naturalWidth) {
        var w = s * 2.3, h = w * img.naturalHeight / img.naturalWidth;
        var col = arguments[2] || '#2c3d63';
        var tmp = document.createElement('canvas');
        tmp.width = img.naturalWidth; tmp.height = img.naturalHeight;
        var tc = tmp.getContext('2d');
        tc.drawImage(img, 0, 0);
        tc.globalCompositeOperation = 'source-in';
        tc.fillStyle = col; tc.fillRect(0, 0, tmp.width, tmp.height);
        c.drawImage(tmp, -w / 2, -h / 2 - s * 0.02, w, h);
        return;
      }
      c.font = 'italic 700 ' + Math.round(s * 0.95) + 'px "Times New Roman", Georgia, serif';
      c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText('kzna', 0, -s * 0.05);
      c.lineWidth = s * 0.06; c.lineCap = 'round';
      c.beginPath(); c.moveTo(-s * 0.55, s * 0.42); c.quadraticCurveTo(0, s * 0.62, s * 0.6, s * 0.36); c.stroke();
    }
  };

  /* ---------- 공 디자인 ----------
   * 수박게임 과일처럼: 평평한 팝 컬러 + 굵은 잉크 외곽선 + 귀여운 얼굴
   * + 아이돌 모티프 액세서리(머리핀처럼). 최종 티어는 kzna 로고.
   */
  var INK = '#1e2a47';

  function shade(hex, amt) {
    var n = parseInt(hex.slice(1), 16);
    var r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    function f(v) { return Math.max(0, Math.min(255, Math.round(amt < 0 ? v * (1 + amt) : v + (255 - v) * amt))); }
    return 'rgb(' + f(r) + ',' + f(g) + ',' + f(b) + ')';
  }

  function heartAt(c, x, y, w, fill) {
    heartPath(c, x, y, w); c.fillStyle = fill; c.fill();
    c.lineWidth = Math.max(1, w * 0.14); c.strokeStyle = INK; c.stroke();
  }

  function drawFace(c, r, face) {
    var ey = r * 0.02, ex = r * 0.3;
    var lw = Math.max(1.4, r * 0.07);
    var er = Math.max(1.5, r * 0.09);
    c.lineCap = 'round'; c.lineJoin = 'round';
    c.strokeStyle = INK; c.fillStyle = INK; c.lineWidth = lw;

    // 볼터치
    c.save(); c.globalAlpha = 0.55; c.fillStyle = '#ff6fa8';
    c.beginPath(); c.ellipse(-r * 0.48, r * 0.2, r * 0.14, r * 0.085, 0, 0, TAU); c.fill();
    c.beginPath(); c.ellipse(r * 0.48, r * 0.2, r * 0.14, r * 0.085, 0, 0, TAU); c.fill();
    c.restore();
    c.strokeStyle = INK; c.fillStyle = INK;

    function dot(x) {
      c.beginPath(); c.arc(x, ey, er, 0, TAU); c.fill();
      if (r >= 24) { c.fillStyle = '#fff'; c.beginPath(); c.arc(x - er * 0.35, ey - er * 0.4, er * 0.38, 0, TAU); c.fill(); c.fillStyle = INK; }
    }
    function arcUp(x) { c.beginPath(); c.arc(x, ey + er * 0.6, er * 1.15, Math.PI * 1.15, Math.PI * 1.85); c.stroke(); }
    function sparkle(x) {
      c.beginPath(); c.ellipse(x, ey, er * 1.25, er * 1.5, 0, 0, TAU); c.fill();
      c.fillStyle = '#fff';
      c.beginPath(); c.arc(x - er * 0.4, ey - er * 0.55, er * 0.5, 0, TAU); c.fill();
      c.beginPath(); c.arc(x + er * 0.45, ey + er * 0.5, er * 0.25, 0, TAU); c.fill();
      c.fillStyle = INK;
    }
    function line(x) { c.beginPath(); c.moveTo(x - er * 1.1, ey + er * 0.2); c.quadraticCurveTo(x, ey + er * 0.9, x + er * 1.1, ey + er * 0.2); c.stroke(); }

    var e = face.eyes;
    if (e === 'dot') { dot(-ex); dot(ex); }
    else if (e === 'happy') { arcUp(-ex); arcUp(ex); }
    else if (e === 'wink') { dot(-ex); c.beginPath(); c.moveTo(ex + er, ey - er); c.lineTo(ex - er * 0.6, ey); c.lineTo(ex + er, ey + er); c.stroke(); }
    else if (e === 'sparkle') { sparkle(-ex); sparkle(ex); }
    else if (e === 'sleepy') { line(-ex); line(ex); }
    else if (e === 'heart') { heartAt(c, -ex, ey, er * 3, '#ff4f9a'); heartAt(c, ex, ey, er * 3, '#ff4f9a'); }

    // 입
    var my = r * 0.24, mw = Math.max(2.2, r * 0.11);
    c.strokeStyle = INK; c.fillStyle = INK; c.lineWidth = lw;
    var m = face.mouth;
    if (m === 'w') {
      c.beginPath(); c.arc(-mw * 0.5, my - mw * 0.2, mw * 0.5, 0.15, Math.PI - 0.15); c.arc(mw * 0.5, my - mw * 0.2, mw * 0.5, 0.15, Math.PI - 0.15); c.stroke();
    } else if (m === 'smile') {
      c.beginPath(); c.arc(0, my - mw * 0.5, mw, 0.25, Math.PI - 0.25); c.stroke();
    } else if (m === 'open') {
      c.beginPath(); c.moveTo(-mw, my - mw * 0.35); c.quadraticCurveTo(0, my + mw * 1.5, mw, my - mw * 0.35); c.closePath();
      c.fillStyle = '#ff6b8f'; c.fill(); c.stroke();
    } else if (m === 'o') {
      c.beginPath(); c.ellipse(0, my, mw * 0.45, mw * 0.55, 0, 0, TAU); c.stroke();
    }
  }

  /* 모티프를 흰색 + 잉크 외곽선 스티커로 */
  function drawMotif(c, glyph, x, y, s, pxPerUnit, color) {
    var size = Math.ceil(s * 2.6 * pxPerUnit);
    function layer(col) {
      var cv = document.createElement('canvas'); cv.width = cv.height = size;
      var g = cv.getContext('2d');
      g.scale(pxPerUnit, pxPerUnit); g.translate(s * 1.3, s * 1.3);
      g.fillStyle = col; g.strokeStyle = col;
      GLYPHS[glyph](g, s);
      return cv;
    }
    var ink = layer(INK), fill = layer(color);
    var o = Math.max(1.2, s * 0.16);
    c.save(); c.translate(x, y); c.rotate(0.25);
    for (var k = 0; k < 8; k++) {
      var a = (k / 8) * TAU;
      c.drawImage(ink, -s * 1.3 + Math.cos(a) * o, -s * 1.3 + Math.sin(a) * o, s * 2.6, s * 2.6);
    }
    c.drawImage(fill, -s * 1.3, -s * 1.3, s * 2.6, s * 2.6);
    c.restore();
  }

  function makeSprite(tier, pxPerUnit) {
    var r = tier.r;
    var pad = 4;
    var size = Math.ceil((r * 2 + pad * 2) * pxPerUnit);
    var cv = document.createElement('canvas');
    cv.width = cv.height = size;
    var c = cv.getContext('2d');
    c.scale(pxPerUnit, pxPerUnit);
    c.translate(r + pad, r + pad);

    // 몸통: 평평한 색 + 오른쪽 아래 납작한 그림자
    c.save();
    c.beginPath(); c.arc(0, 0, r, 0, TAU); c.clip();
    c.fillStyle = shade(tier.base, -0.16); c.fillRect(-r, -r, r * 2, r * 2);
    c.fillStyle = tier.base;
    c.beginPath(); c.arc(-r * 0.08, -r * 0.1, r * 0.94, 0, TAU); c.fill();
    // 망점 무늬 (큰 공만)
    if (r >= 40) {
      c.fillStyle = 'rgba(255,255,255,0.22)';
      var step = r * 0.22;
      for (var yy = -r; yy < r; yy += step) for (var xx = -r + ((yy / step) % 2 ? step / 2 : 0); xx < r; xx += step) {
        c.beginPath(); c.arc(xx, yy, r * 0.028, 0, TAU); c.fill();
      }
    }
    // 하이라이트 (평평한 흰 반달 + 점)
    c.fillStyle = 'rgba(255,255,255,0.85)';
    c.beginPath(); c.ellipse(-r * 0.46, -r * 0.5, r * 0.22, r * 0.12, -0.75, 0, TAU); c.fill();
    c.beginPath(); c.arc(-r * 0.2, -r * 0.7, r * 0.06, 0, TAU); c.fill();
    c.restore();

    if (tier.glyph === 'kzna') {
      // 최종 티어: kzna 로고 + 볼터치 + 반짝이
      GLYPHS.kzna(c, r * 0.6, INK);
      c.save(); c.globalAlpha = 0.5; c.fillStyle = '#ff6fa8';
      c.beginPath(); c.ellipse(-r * 0.5, r * 0.36, r * 0.12, r * 0.07, 0, 0, TAU); c.fill();
      c.beginPath(); c.ellipse(r * 0.5, r * 0.36, r * 0.12, r * 0.07, 0, 0, TAU); c.fill();
      c.restore();
      drawMotif(c, 'sparkle', r * 0.5, -r * 0.5, r * 0.14, pxPerUnit, '#ffd84d');
      drawMotif(c, 'sparkle', -r * 0.55, r * 0.55, r * 0.09, pxPerUnit, '#8fd3ff');
    } else {
      drawFace(c, r, tier.face);
      // 모티프 액세서리 (작은 공은 생략)
      if (r >= 24) drawMotif(c, tier.glyph, r * 0.5, -r * 0.52, r * 0.2, pxPerUnit, tier.accent || '#ffffff');
    }

    // 굵은 잉크 외곽선
    var ink = Math.max(2, Math.min(3.4, r * 0.12));
    c.lineWidth = ink;
    c.strokeStyle = INK;
    c.beginPath(); c.arc(0, 0, r - ink / 2, 0, TAU); c.stroke();
    return { canvas: cv, half: r + pad };
  }

  // 공식 로고 미리 로드 (최종 티어 아이템 문양)
  HP.logoImg = new Image();
  HP.logoImg.src = 'assets/kzna-logo.png';

  /* ---------- 게임판 ---------- */
  function Board(canvas, hooks) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.hooks = hooks || {};
    this.cfg = HP.CONFIG;
    this.W = this.cfg.board.width;
    this.H = this.cfg.board.height;
    this.sprites = [];
    this.spriteScale = 0;
    this.fx = [];
    this.texts = [];
    this.pendingPairs = [];
    this.engine = M.Engine.create({ gravity: { x: 0, y: this.cfg.physics.gravity } });
    this.engine.positionIterations = 8;
    this.engine.velocityIterations = 6;
    var self = this;
    var collect = function (ev) {
      for (var i = 0; i < ev.pairs.length; i++) {
        var a = ev.pairs[i].bodyA, b = ev.pairs[i].bodyB;
        if (a.label === 'item' && b.label === 'item' && a.plugin.tier === b.plugin.tier) self.pendingPairs.push([a, b]);
      }
    };
    M.Events.on(this.engine, 'collisionStart', collect);
    M.Events.on(this.engine, 'collisionActive', collect);
    this.buildWalls();
    this.reset();
    // 로고가 늦게 로드되면 스프라이트를 다시 만든다
    HP.logoImg.addEventListener('load', function () {
      if (self.scale) self.sprites = self.cfg.tiers.map(function (t) { return makeSprite(t, self.scale); });
    });
  }

  Board.prototype.buildWalls = function () {
    var W = this.W, H = this.H, t = this.cfg.board.wall;
    var opt = { isStatic: true, label: 'wall', friction: 0.5 };
    M.Composite.add(this.engine.world, [
      M.Bodies.rectangle(W / 2, H + t / 2, W + t * 2, t, opt),
      M.Bodies.rectangle(-t / 2, H / 2 - 400, t, H * 2 + 800, opt),
      M.Bodies.rectangle(W + t / 2, H / 2 - 400, t, H * 2 + 800, opt)
    ]);
  };

  Board.prototype.reset = function () {
    var items = this.items();
    for (var i = 0; i < items.length; i++) M.Composite.remove(this.engine.world, items[i]);
    this.fx = []; this.texts = []; this.pendingPairs = [];
    this.acc = 0;
    this.time = 0;
    this.aimX = this.W / 2;
    this.lastDropAt = -9999;
    this.dangerMs = 0;
    this.over = false;
    this.mergeCount = 0;
    this.current = this.randomDropTier(true);
    this.next = this.randomDropTier(true);
  };

  Board.prototype.randomDropTier = function (early) {
    var max = early ? 2 : this.cfg.dropMaxTier;
    // 큰 아이템이 나올수록 확률을 낮춘다
    var weights = [];
    var sum = 0;
    for (var t = 0; t <= max; t++) { var w = 1 / (1 + t * 0.45); weights.push(w); sum += w; }
    var r = Math.random() * sum;
    for (t = 0; t <= max; t++) { r -= weights[t]; if (r <= 0) return t; }
    return 0;
  };

  Board.prototype.items = function () {
    return M.Composite.allBodies(this.engine.world).filter(function (b) { return b.label === 'item'; });
  };

  Board.prototype.spawn = function (tier, x, y, vel) {
    var p = this.cfg.physics;
    var b = M.Bodies.circle(x, y, this.cfg.tiers[tier].r, {
      label: 'item',
      restitution: p.restitution,
      friction: p.friction,
      frictionStatic: p.frictionStatic,
      frictionAir: p.frictionAir,
      density: p.density
    });
    b.plugin = { tier: tier, born: this.time, merging: false };
    if (vel) M.Body.setVelocity(b, vel);
    M.Composite.add(this.engine.world, b);
    return b;
  };

  Board.prototype.clampAim = function (x) {
    var r = this.cfg.tiers[this.current].r;
    return Math.max(r + 1, Math.min(this.W - r - 1, x));
  };

  Board.prototype.setAim = function (x) { this.aimX = this.clampAim(x); };

  Board.prototype.canDrop = function () {
    return !this.over && this.time - this.lastDropAt >= this.cfg.dropCooldownMs;
  };

  Board.prototype.drop = function () {
    if (!this.canDrop()) return false;
    var x = this.clampAim(this.aimX);
    this.spawn(this.current, x, this.cfg.board.dropY, { x: 0, y: 1 });
    this.lastDropAt = this.time;
    this.current = this.next;
    this.next = this.randomDropTier(this.time < 8000);
    this.aimX = this.clampAim(this.aimX);
    if (this.hooks.onDrop) this.hooks.onDrop();
    return true;
  };

  Board.prototype.processMerges = function () {
    var pairs = this.pendingPairs;
    this.pendingPairs = [];
    var maxTier = this.cfg.tiers.length - 1;
    for (var i = 0; i < pairs.length; i++) {
      var a = pairs[i][0], b = pairs[i][1];
      if (a.plugin.merging || b.plugin.merging) continue;
      a.plugin.merging = b.plugin.merging = true;
      var tier = a.plugin.tier;
      var x = (a.position.x + b.position.x) / 2;
      var y = (a.position.y + b.position.y) / 2;
      M.Composite.remove(this.engine.world, a);
      M.Composite.remove(this.engine.world, b);
      var vanish = tier >= maxTier;
      if (!vanish) {
        var vel = { x: (a.velocity.x + b.velocity.x) / 2, y: Math.min(0, (a.velocity.y + b.velocity.y) / 2) - this.cfg.physics.mergePop };
        var nb = this.spawn(tier + 1, x, y, vel);
        // 합쳐진 두 공의 회전을 이어받아 굴러가는 느낌을 유지
        M.Body.setAngularVelocity(nb, (a.angularVelocity + b.angularVelocity) / 2);
      }
      this.mergeCount++;
      this.fx.push({ x: x, y: y, r: this.cfg.tiers[Math.min(tier + 1, maxTier)].r, t0: this.time, dur: 420, color: this.cfg.tiers[tier].base });
      if (this.hooks.onMerge) this.hooks.onMerge({ x: x, y: y, tier: tier, newTier: vanish ? null : tier + 1, vanish: vanish });
    }
  };

  Board.prototype.step = function (dt) {
    if (this.over) return;
    var stepMs = this.cfg.physics.stepMs;
    this.acc += dt;
    var n = 0;
    while (this.acc >= stepMs && n < 5) {
      M.Engine.update(this.engine, stepMs);
      this.time += stepMs;
      this.processMerges();
      this.acc -= stepMs;
      n++;
    }
    if (n === 5) this.acc = 0;
    this.checkDanger(dt);
  };

  Board.prototype.checkDanger = function (dt) {
    var items = this.items();
    var line = this.cfg.board.deadlineY;
    var danger = false;
    this.nearLine = false;
    for (var i = 0; i < items.length; i++) {
      var b = items[i];
      if (b.plugin.merging) continue;
      var top = b.position.y - b.circleRadius;
      if (top < line + 40) this.nearLine = true;
      if (this.time - b.plugin.born < this.cfg.gameOver.settleMs) continue;
      if (top < line) { danger = true; break; }
    }
    this.dangerMs = danger ? this.dangerMs + dt : 0;
    if (this.dangerMs >= this.cfg.gameOver.graceMs) {
      this.over = true;
      if (this.hooks.onGameOver) this.hooks.onGameOver();
    }
  };

  Board.prototype.toast = function (text, x, y) {
    // 연쇄 중에는 최신 콤보 하나만 보여서 겹치지 않게
    this.texts = [{ text: text, x: x, y: y, t0: this.time, dur: 900 }];
  };

  /* ---------- 좌표 변환 / 크기 ---------- */
  Board.prototype.resize = function (wrapW, wrapH) {
    var aspect = this.W / this.H;
    var cssW = Math.min(wrapW, wrapH * aspect);
    var cssH = cssW / aspect;
    var dpr = Math.min(window.devicePixelRatio || 1, 3);
    this.canvas.style.width = cssW + 'px';
    this.canvas.style.height = cssH + 'px';
    this.canvas.width = Math.round(cssW * dpr);
    this.canvas.height = Math.round(cssH * dpr);
    this.scale = (cssW * dpr) / this.W;
    if (Math.abs(this.scale - this.spriteScale) > 0.01) {
      this.spriteScale = this.scale;
      this.sprites = this.cfg.tiers.map(function (t) { return makeSprite(t, this.scale); }, this);
    }
  };

  /* 게임판 논리 좌표 → 화면(viewport) 좌표 */
  Board.prototype.toScreen = function (x, y) {
    var r = this.canvas.getBoundingClientRect();
    return { x: r.left + (x * r.width) / this.W, y: r.top + (y * r.height) / this.H };
  };

  Board.prototype.toLogicalX = function (clientX) {
    var r = this.canvas.getBoundingClientRect();
    return ((clientX - r.left) * this.W) / r.width;
  };

  /* ---------- 그리기 ---------- */
  Board.prototype.drawSprite = function (c, tier, x, y, angle, alpha) {
    var s = this.sprites[tier];
    if (!s) return;
    c.save();
    c.translate(x, y);
    if (angle) c.rotate(angle);
    if (alpha != null) c.globalAlpha = alpha;
    c.drawImage(s.canvas, -s.half, -s.half, s.half * 2, s.half * 2);
    c.restore();
  };

  Board.prototype.draw = function (now, playing) {
    var c = this.ctx;
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.clearRect(0, 0, this.canvas.width, this.canvas.height);
    c.setTransform(this.scale, 0, 0, this.scale, 0, 0);

    // 데드라인
    var line = this.cfg.board.deadlineY;
    var danger = this.dangerMs > 0;
    c.save();
    c.setLineDash([7, 6]);
    c.lineWidth = danger ? 2.4 : 1.4;
    var blink = danger ? 0.5 + 0.5 * Math.sin(now / 90) : 1;
    c.strokeStyle = danger ? 'rgba(255,60,120,' + (0.5 + 0.5 * blink) + ')' : (this.nearLine ? 'rgba(255,79,154,0.8)' : 'rgba(30,42,71,0.28)');
    c.beginPath(); c.moveTo(6, line); c.lineTo(this.W - 6, line); c.stroke();
    c.restore();

    // 조준 가이드 + 들고 있는 아이템
    if (playing && !this.over) {
      var ready = this.canDrop();
      var r = this.cfg.tiers[this.current].r;
      c.save();
      c.strokeStyle = 'rgba(120,170,230,0.45)';
      c.lineWidth = 1.5;
      c.setLineDash([3, 7]);
      c.beginPath(); c.moveTo(this.aimX, this.cfg.board.dropY + r + 4); c.lineTo(this.aimX, this.H); c.stroke();
      c.restore();
      this.drawSprite(c, this.current, this.aimX, this.cfg.board.dropY, 0, ready ? 1 : 0.45);
    }

    // 아이템
    var items = this.items();
    for (var i = 0; i < items.length; i++) {
      var b = items[i];
      var age = this.time - b.plugin.born;
      if (age < 140 && b.plugin.tier > 0) {
        // 합성 직후 살짝 팝
        var k = age / 140;
        var sc = 0.75 + 0.25 * (1 + 0.25 * Math.sin(k * Math.PI));
        c.save(); c.translate(b.position.x, b.position.y); c.scale(sc, sc);
        this.drawSprite(c, b.plugin.tier, 0, 0, b.angle);
        c.restore();
      } else {
        this.drawSprite(c, b.plugin.tier, b.position.x, b.position.y, b.angle);
      }
    }

    // 합성 이펙트 (링 + 반짝임)
    var t = this.time;
    this.fx = this.fx.filter(function (f) { return t - f.t0 < f.dur; });
    for (i = 0; i < this.fx.length; i++) {
      var f = this.fx[i];
      var p = (t - f.t0) / f.dur;
      var e = 1 - Math.pow(1 - p, 3);
      c.save();
      c.globalAlpha = 1 - p;
      c.lineWidth = 3 * (1 - p) + 0.5;
      c.strokeStyle = '#ffffff';
      c.beginPath(); c.arc(f.x, f.y, f.r * (0.8 + 0.7 * e), 0, TAU); c.stroke();
      c.strokeStyle = f.color;
      c.globalAlpha = (1 - p) * 0.6;
      c.beginPath(); c.arc(f.x, f.y, f.r * (0.9 + 0.9 * e), 0, TAU); c.stroke();
      c.fillStyle = '#ffffff';
      for (var s = 0; s < 6; s++) {
        var a = (s / 6) * TAU + f.t0;
        var d = f.r * (0.6 + 1.0 * e);
        c.globalAlpha = (1 - p);
        c.beginPath(); c.arc(f.x + Math.cos(a) * d, f.y + Math.sin(a) * d, 2.2 * (1 - p) + 0.4, 0, TAU); c.fill();
      }
      c.restore();
    }

    // 콤보 텍스트
    this.texts = this.texts.filter(function (x) { return t - x.t0 < x.dur; });
    for (i = 0; i < this.texts.length; i++) {
      var tx = this.texts[i];
      var q = (t - tx.t0) / tx.dur;
      c.save();
      c.globalAlpha = q < 0.7 ? 1 : 1 - (q - 0.7) / 0.3;
      c.font = '400 18px "Mochiy Pop One", "Jua", sans-serif';
      c.textAlign = 'center';
      c.lineJoin = 'round';
      c.lineWidth = 5; c.strokeStyle = '#1e2a47';
      var yy = tx.y - 28 - q * 26;
      var xx = Math.max(50, Math.min(this.W - 50, tx.x));
      c.strokeText(tx.text, xx, yy);
      c.fillStyle = '#ffd84d';
      c.fillText(tx.text, xx, yy);
      c.restore();
    }
  };

  /* NEXT 미리보기 */
  Board.prototype.drawPreview = function (cv, tier) {
    var dpr = Math.min(window.devicePixelRatio || 1, 3);
    var size = cv.clientWidth || 40;
    if (cv.width !== Math.round(size * dpr)) { cv.width = cv.height = Math.round(size * dpr); }
    var c = cv.getContext('2d');
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.clearRect(0, 0, cv.width, cv.height);
    var s = this.sprites[tier];
    if (!s) return;
    var r = this.cfg.tiers[tier].r;
    var target = (cv.width / 2) * (0.55 + 0.4 * (r / this.cfg.tiers[this.cfg.dropMaxTier].r));
    var k = target / (r * this.scale);
    var w = s.canvas.width * k;
    c.drawImage(s.canvas, (cv.width - w) / 2, (cv.height - w) / 2, w, w);
  };

  HP.Board = Board;
})();
