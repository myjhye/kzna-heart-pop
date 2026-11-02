/*
 * 효과음 — 외부 파일 없이 WebAudio로 합성한다.
 */
window.HP = window.HP || {};

HP.Audio = (function () {
  var ctx = null, master = null;
  var muted = false;
  try { muted = localStorage.getItem('hp_muted') === '1'; } catch (e) {}
  var lastAt = {};

  function ensure() {
    if (!ctx) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = muted ? 0 : 0.45;
      master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function limited(key, ms) {
    var n = performance.now();
    if (lastAt[key] && n - lastAt[key] < ms) return true;
    lastAt[key] = n;
    return false;
  }

  function tone(o) {
    if (muted || !ensure()) return;
    var t = ctx.currentTime + (o.delay || 0);
    var osc = ctx.createOscillator();
    var g = ctx.createGain();
    osc.type = o.type || 'sine';
    osc.frequency.setValueAtTime(o.freq, t);
    if (o.slideTo) osc.frequency.exponentialRampToValueAtTime(o.slideTo, t + (o.dur || 0.15));
    var vol = o.vol || 0.25;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + (o.attack || 0.006));
    g.gain.exponentialRampToValueAtTime(0.0001, t + (o.dur || 0.15));
    osc.connect(g); g.connect(master);
    osc.start(t); osc.stop(t + (o.dur || 0.15) + 0.03);
  }

  /* ---------- BGM: 코드로 연주하는 칩튠 신스팝 루프 (외부 음원 없음) ----------
   * 128 BPM, F장조, I–V–vi–IV (F–C–Dm–B♭) 8마디 루프
   * 베이스(옥타브 바운스) + 반짝이는 아르페지오 + 멜로디 + 가벼운 드럼
   */
  var BPM = 128;
  var STEP = 60 / BPM / 4;              // 16분음표 길이(초)
  var CHORDS = [
    { bass: 41, tones: [65, 69, 72] },  // F
    { bass: 36, tones: [64, 67, 72] },  // C
    { bass: 38, tones: [62, 65, 69] },  // Dm
    { bass: 34, tones: [62, 65, 70] }   // B♭
  ];
  // 8마디 × 8분음표 멜로디 (MIDI, 0 = 쉼표)
  var MELODY = [
    72, 0, 72, 74, 76, 0, 72, 0,
    79, 0, 76, 0, 74, 72, 74, 0,
    77, 0, 76, 74, 72, 0, 69, 0,
    70, 0, 72, 74, 72, 0, 0, 0,
    72, 72, 77, 0, 76, 74, 72, 0,
    76, 0, 79, 0, 81, 0, 79, 76,
    77, 76, 74, 0, 76, 77, 79, 0,
    77, 0, 76, 0, 72, 0, 0, 0
  ];
  var bgm = { on: false, gain: null, step: 0, next: 0, timer: null, noise: null };

  function mtof(m) { return 440 * Math.pow(2, (m - 69) / 12); }

  function note(midi, t, dur, type, vol, dest) {
    var o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(mtof(midi), t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(dest || bgm.gain);
    o.start(t); o.stop(t + dur + 0.02);
  }

  function noiseHit(t, dur, vol, hp) {
    if (!bgm.noise) {
      var len = ctx.sampleRate * 0.5, buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
      for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      bgm.noise = buf;
    }
    var s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = bgm.noise; f.type = 'highpass'; f.frequency.value = hp;
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(bgm.gain);
    s.start(t); s.stop(t + dur + 0.02);
  }

  function kick(t) {
    var o = ctx.createOscillator(), g = ctx.createGain();
    o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(45, t + 0.12);
    g.gain.setValueAtTime(0.55, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
    o.connect(g); g.connect(bgm.gain); o.start(t); o.stop(t + 0.18);
  }

  function scheduleStep(i, t) {
    var bar = Math.floor(i / 16) % 8, s = i % 16, ch = CHORDS[bar % 4];
    // 드럼
    if (s === 0 || s === 8) kick(t);
    if (s === 10 && bar % 2 === 1) kick(t);
    if (s === 4 || s === 12) noiseHit(t, 0.12, 0.16, 1800);
    if (s % 4 === 2) noiseHit(t, 0.04, 0.07, 7000);
    // 베이스 (8분음표 옥타브 바운스)
    if (s % 2 === 0) note(ch.bass + 12 + (s % 4 === 2 ? 12 : 0), t, STEP * 1.6, 'triangle', 0.22);
    // 아르페지오 (16분음표)
    var arp = ch.tones[s % 3] + (s >= 8 ? 12 : 0);
    note(arp, t, STEP * 0.9, 'square', 0.025);
    // 멜로디 (8분음표)
    if (s % 2 === 0) {
      var m = MELODY[bar * 8 + s / 2];
      if (m) { note(m, t, STEP * 1.8, 'square', 0.05); note(m + 12, t, STEP * 1.2, 'sine', 0.03); }
    }
  }

  function tick() {
    while (bgm.next < ctx.currentTime + 0.15) {
      scheduleStep(bgm.step, bgm.next);
      bgm.step++;
      bgm.next += STEP;
    }
  }

  function bgmStart() {
    if (!ensure()) return;
    if (!bgm.gain) {
      bgm.gain = ctx.createGain();
      var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 5200;
      bgm.gain.connect(lp); lp.connect(master);
    }
    bgm.gain.gain.cancelScheduledValues(ctx.currentTime);
    bgm.gain.gain.setValueAtTime(bgm.on ? bgm.gain.gain.value : 0.0001, ctx.currentTime);
    bgm.gain.gain.exponentialRampToValueAtTime(0.5, ctx.currentTime + 0.6);
    if (bgm.on) return;
    bgm.on = true;
    bgm.step = 0;
    bgm.next = ctx.currentTime + 0.08;
    bgm.timer = setInterval(tick, 25);
    tick();
  }

  function bgmStop(fadeSec) {
    if (!bgm.on || !ctx) return;
    var t = ctx.currentTime, f = fadeSec == null ? 0.8 : fadeSec;
    bgm.gain.gain.cancelScheduledValues(t);
    bgm.gain.gain.setValueAtTime(Math.max(0.0001, bgm.gain.gain.value), t);
    bgm.gain.gain.exponentialRampToValueAtTime(0.0001, t + f);
    clearInterval(bgm.timer);
    bgm.on = false;
  }

  // 백그라운드 탭에서는 소리를 멈춘다
  document.addEventListener('visibilitychange', function () {
    if (!ctx) return;
    if (document.hidden) ctx.suspend(); else ctx.resume();
  });

  return {
    unlock: ensure,
    bgmStart: bgmStart,
    bgmStop: bgmStop,
    isMuted: function () { return muted; },
    setMuted: function (m) {
      muted = !!m;
      try { localStorage.setItem('hp_muted', muted ? '1' : '0'); } catch (e) {}
      if (master) master.gain.value = muted ? 0 : 0.45;
    },
    tap: function () { tone({ freq: 880, type: 'triangle', dur: 0.06, vol: 0.12 }); },
    drop: function () { tone({ freq: 420, slideTo: 260, type: 'triangle', dur: 0.1, vol: 0.18 }); },
    merge: function (tier) {
      if (limited('merge', 35)) return;
      var f = 330 * Math.pow(1.12, tier);
      tone({ freq: f, slideTo: f * 1.5, type: 'sine', dur: 0.14, vol: 0.28 });
      tone({ freq: f * 2, type: 'triangle', dur: 0.08, vol: 0.08, delay: 0.02 });
    },
    launch: function () {
      if (limited('launch', 60)) return;
      tone({ freq: 700, slideTo: 1500, type: 'sine', dur: 0.22, vol: 0.07 });
    },
    arrive: function () {
      if (limited('arrive', 45)) return;
      var base = 1046 + Math.random() * 120;
      tone({ freq: base, type: 'sine', dur: 0.16, vol: 0.14 });
      tone({ freq: base * 1.5, type: 'sine', dur: 0.2, vol: 0.08, delay: 0.04 });
    },
    levelUp: function () {
      [523, 659, 784, 1046, 1318].forEach(function (f, i) {
        tone({ freq: f, type: 'triangle', dur: 0.22, vol: 0.18, delay: i * 0.07 });
      });
    },
    finish: function () {
      [784, 659, 523, 392].forEach(function (f, i) {
        tone({ freq: f, type: 'triangle', dur: 0.25, vol: 0.16, delay: i * 0.1 });
      });
    }
  };
})();
