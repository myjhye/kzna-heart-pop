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

  return {
    unlock: ensure,
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
