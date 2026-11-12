/*
  Asmau music and sound effects, made on the spot with the Web Audio API,
  so there are no audio files to license or download.

  - mood(name)     background music; changes by crossfade, never restarts the
                   same mood. Moods: wonder, desert, tense, sad, regal, joy.
  - tension(0..1)  makes whatever is playing more urgent: faster, brighter,
                   a heartbeat, hi-hats, and a rising drone. Activities set it
                   from their own progress and clear it when they finish.
  - fx(name, a, b) one-shot effects: tap, boing, wrong, win, heave, whoosh,
                   swish, coin, wilt, tick, clink, sparkle, pour.
  - duck(on)       lowers the music while a line of narration is speaking.
  - setMusic / setSfx  two independent switches, because families differ on
                   music in children's media and narration must survive both.

  Desert and palace moods use a hijaz-style scale (a Western-tuned
  approximation, not a maqam performance). All of it is synthesized, so it
  sounds like a game, not like a recording.
*/
window.AsmauMusic = (function () {
  "use strict";

  var N = null;
  var MUSIC_LEVEL = 0.7;
  var DUCK_LEVEL = 0.35;
  var LOOKAHEAD = 0.3;
  var PUMP_MS = 50;

  var SCALES = {
    pent:  [0, 2, 4, 7, 9],
    hijaz: [0, 1, 4, 5, 7, 8, 10],
    phryg: [0, 1, 3, 5, 7, 8, 10],
    minor: [0, 2, 3, 5, 7, 8, 10]
  };

  // 16 eighth-note steps = two bars. Each of the two chords lasts 8 steps.
  // Pattern entries are scale degrees (can be negative or above the scale).
  var MOODS = {
    wonder: {
      bpm: 66, root: 62, scale: SCALES.pent, padOct: -1, bassOct: -2, arpOct: 0,
      chords: [[0, 2, 3], [-1, 1, 3]],
      bass: [0, N, N, N, N, N, N, N, -1, N, N, N, N, N, N, N],
      arp:  [5, N, 7, N, 9, N, 7, N, 8, N, 6, N, 7, N, 5, N],
      drums: {},
      wave: { pad: "sine", arp: "triangle", bass: "sine" },
      vol: { pad: 0.07, arp: 0.05, bass: 0.1, drum: 0 }, arpDecay: 0.5
    },
    desert: {
      bpm: 104, root: 62, scale: SCALES.hijaz, padOct: -1, bassOct: -2, arpOct: 0,
      chords: [[0, 2, 4], [1, 3, 5]],
      bass: [0, N, N, 0, N, 0, N, N, 1, N, N, 1, N, 1, N, N],
      arp:  [4, N, 5, 4, 2, N, 0, N, 5, N, 4, 3, 1, N, 3, N],
      drums: { d: [0, 4, 8, 12], t: [2, 3, 6, 10, 11, 14] },
      wave: { pad: "triangle", arp: "square", bass: "triangle" },
      vol: { pad: 0.05, arp: 0.04, bass: 0.12, drum: 0.5 }, arpDecay: 0.18, arpLp: 2600
    },
    tense: {
      bpm: 108, root: 50, scale: SCALES.phryg, padOct: 0, bassOct: -1, arpOct: 1,
      chords: [[0, 2, 4], [1, 3, 5]],
      bass: [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
      arp:  [N, N, N, 4, N, N, 4, N, N, N, N, 5, N, N, 3, N],
      drums: { k: [0, 8] },
      wave: { pad: "sawtooth", arp: "square", bass: "sawtooth" },
      vol: { pad: 0.035, arp: 0.035, bass: 0.07, drum: 0.7 }, arpDecay: 0.12, bassLp: 420, padLp: 700, arpLp: 2200
    },
    sad: {
      bpm: 58, root: 57, scale: SCALES.minor, padOct: -1, bassOct: -2, arpOct: 0,
      chords: [[0, 2, 4], [-2, 0, 2]],
      bass: [0, N, N, N, N, N, N, N, -2, N, N, N, N, N, N, N],
      arp:  [4, N, N, N, 2, N, N, N, 0, N, N, N, 2, N, N, N],
      drums: {},
      wave: { pad: "sine", arp: "triangle", bass: "sine" },
      vol: { pad: 0.07, arp: 0.06, bass: 0.1, drum: 0 }, arpDecay: 0.9
    },
    regal: {
      bpm: 80, root: 50, scale: SCALES.hijaz, padOct: 0, bassOct: -1, arpOct: 1,
      chords: [[0, 2, 4], [1, 3, 5]],
      bass: [0, N, N, N, 0, N, N, N, 1, N, N, N, 1, N, N, N],
      arp:  [N, N, N, N, 4, N, 5, N, N, N, N, N, 3, N, 1, N],
      drums: { d: [0, 8], t: [4, 12] },
      wave: { pad: "sawtooth", arp: "triangle", bass: "triangle" },
      vol: { pad: 0.04, arp: 0.05, bass: 0.11, drum: 0.45 }, arpDecay: 0.35, padLp: 1100
    },
    joy: {
      bpm: 124, root: 62, scale: SCALES.pent, padOct: -1, bassOct: -2, arpOct: 0,
      chords: [[0, 2, 3], [1, 3, 5]],
      bass: [0, N, N, 0, N, 0, 0, N, 1, N, N, 1, N, 1, 1, N],
      arp:  [5, 7, 9, 7, 5, 7, 4, 7, 6, 8, 10, 8, 6, 8, 5, 8],
      drums: { k: [0, 4, 8, 12], s: [2, 6, 10, 14], h: [1, 3, 5, 7, 9, 11, 13, 15] },
      wave: { pad: "triangle", arp: "triangle", bass: "triangle" },
      vol: { pad: 0.05, arp: 0.055, bass: 0.12, drum: 0.55 }, arpDecay: 0.16
    }
  };

  function mtof(m) { return 440 * Math.pow(2, (m - 69) / 12); }
  function deg(m, d) {
    var n = m.scale.length;
    var oct = Math.floor(d / n);
    return m.root + m.scale[d - oct * n] + 12 * oct;
  }
  function has(arr, v) { return !!arr && arr.indexOf(v) >= 0; }
  function noop() {}

  function makeNoise(ctx) {
    var len = ctx.sampleRate;
    var buf = ctx.createBuffer(1, len, ctx.sampleRate);
    var d = buf.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    return buf;
  }

  // The few building blocks every sound is made from.
  function kit(ctx) {
    var noise = makeNoise(ctx);

    function env(g, t, peak, atk, dur) {
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(peak, t + atk);
      g.gain.exponentialRampToValueAtTime(0.0001, t + atk + dur);
    }

    // short percussive tone with an optional pitch sweep
    function tone(bus, type, f0, f1, t, dur, vol, lp) {
      var o = ctx.createOscillator();
      o.type = type;
      o.frequency.setValueAtTime(f0, t);
      if (f1 && f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, t + dur);
      var g = ctx.createGain();
      env(g, t, vol, 0.006, dur);
      o.connect(g);
      var tail = g;
      if (lp) {
        var f = ctx.createBiquadFilter();
        f.type = "lowpass";
        f.frequency.value = lp;
        g.connect(f);
        tail = f;
      }
      tail.connect(bus);
      o.start(t);
      o.stop(t + dur + 0.05);
    }

    // filtered noise burst (dur must stay under 0.5s)
    function hiss(bus, t, dur, vol, ftype, f0, f1, q) {
      var s = ctx.createBufferSource();
      s.buffer = noise;
      var f = ctx.createBiquadFilter();
      f.type = ftype;
      f.Q.value = q || 1;
      f.frequency.setValueAtTime(f0, t);
      if (f1 && f1 !== f0) f.frequency.exponentialRampToValueAtTime(f1, t + dur);
      var g = ctx.createGain();
      env(g, t, vol, Math.min(0.01, dur / 3), dur);
      s.connect(f);
      f.connect(g);
      g.connect(bus);
      s.start(t, Math.random() * 0.45);
      s.stop(t + dur + 0.05);
    }

    // sustained or plucked musical note: attack, hold, then a release tail
    function note(bus, type, freq, t, hold, vol, atk, rel, lp, detune) {
      var o = ctx.createOscillator();
      o.type = type;
      o.frequency.setValueAtTime(freq, t);
      if (detune) o.detune.value = detune;
      var g = ctx.createGain();
      var up = t + atk;
      var end = Math.max(up, t + hold);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(vol, up);
      g.gain.setTargetAtTime(0.0001, end, rel);
      o.connect(g);
      var tail = g;
      if (lp) {
        var f = ctx.createBiquadFilter();
        f.type = "lowpass";
        f.frequency.value = lp;
        g.connect(f);
        tail = f;
      }
      tail.connect(bus);
      o.start(t);
      o.stop(end + rel * 6);
    }

    return { tone: tone, hiss: hiss, note: note };
  }

  function makeEngine(ctx, out, now) {
    var k = kit(ctx);

    var lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 3500;
    lp.connect(out);

    // the rising drone that tension() drives
    var riser = ctx.createOscillator();
    riser.type = "sawtooth";
    riser.frequency.value = 80;
    var riserLp = ctx.createBiquadFilter();
    riserLp.type = "lowpass";
    riserLp.frequency.value = 800;
    var riserGain = ctx.createGain();
    riserGain.gain.value = 0;
    riser.connect(riserLp);
    riserLp.connect(riserGain);
    riserGain.connect(out);
    riser.start();

    var bus = null, cur = null, curName = null;
    var step = 0, nextT = 0, tension = 0;

    function setMood(name) {
      if (name === curName) return;
      var t = now();
      if (bus) {
        var old = bus;
        old.gain.cancelScheduledValues(t);
        old.gain.setTargetAtTime(0, t, 0.12);
        setTimeout(function () { try { old.disconnect(); } catch (err) { /* already gone */ } }, 1500);
      }
      curName = name;
      cur = MOODS[name] || null;
      bus = ctx.createGain();
      bus.gain.value = 0;
      bus.connect(lp);
      bus.gain.setTargetAtTime(1, t, 0.15);
      step = 0;
      nextT = t + 0.05;
    }

    function setTension(x) {
      x = Math.max(0, Math.min(1, x || 0));
      if (Math.abs(x - tension) < 0.02 && !(x === 0 && tension !== 0)) return;
      tension = x;
      var t = now();
      lp.frequency.setTargetAtTime(3500 + 8500 * x, t, 0.1);
      riser.frequency.setTargetAtTime(80 * Math.pow(2, 2.2 * x), t, 0.1);
      riserGain.gain.setTargetAtTime(0.05 * x * x, t, 0.1);
    }

    function playStep(m, st, t, sd) {
      var sp = st % 16, v = m.vol, tn = tension;

      if (sp % 8 === 0) {
        m.chords[Math.floor(st / 8) % m.chords.length].forEach(function (d) {
          var f = mtof(deg(m, d) + 12 * m.padOct);
          k.note(bus, m.wave.pad, f, t, sd * 7, v.pad / 2, 0.4, 0.6, m.padLp, -7);
          k.note(bus, m.wave.pad, f, t, sd * 7, v.pad / 2, 0.4, 0.6, m.padLp, 7);
        });
      }
      if (m.bass[sp] != null) {
        k.note(bus, m.wave.bass, mtof(deg(m, m.bass[sp]) + 12 * m.bassOct), t, sd * 0.9, v.bass, 0.012, 0.1, m.bassLp);
      }
      if (m.arp[sp] != null) {
        k.note(bus, m.wave.arp, mtof(deg(m, m.arp[sp]) + 12 * m.arpOct), t, 0.02, v.arp, 0.004, m.arpDecay, m.arpLp);
      }

      var dm = m.drums || {}, dv = v.drum || 0.5;
      if (has(dm.k, sp)) k.tone(bus, "sine", 150, 45, t, 0.16, 0.5 * dv);
      else if (tn > 0.3 && sp % 2 === 0) k.tone(bus, "sine", 150, 45, t, 0.16, 0.35 * dv * tn);
      if (has(dm.d, sp)) k.tone(bus, "sine", 135, 70, t, 0.14, 0.45 * dv);
      if (has(dm.t, sp)) k.hiss(bus, t, 0.05, 0.2 * dv, "bandpass", 2800, 2800, 2);
      if (has(dm.s, sp) || (tn > 0.8 && sp % 4 === 2)) {
        k.hiss(bus, t, 0.11, 0.25 * dv, "bandpass", 1800, 1200, 0.8);
        k.tone(bus, "triangle", 220, 150, t, 0.08, 0.15 * dv);
      }
      if (has(dm.h, sp) || (tn > 0.6 && sp % 2 === 1)) k.hiss(bus, t, 0.03, 0.12 * dv, "highpass", 7000, 7000, 0.7);
    }

    function scheduleUntil(limit) {
      var n = now();
      if (nextT < n - 0.05) nextT = n + 0.02;
      if (!cur) { nextT = Math.max(nextT, n); return; }
      var guard = 0;
      while (nextT < limit && guard++ < 400) {
        var sd = 60 / cur.bpm / 2 / (1 + 0.3 * tension);
        playStep(cur, step, nextT, sd);
        nextT += sd;
        step += 1;
      }
    }

    return {
      setMood: setMood,
      setTension: setTension,
      scheduleUntil: scheduleUntil,
      mood: function () { return curName; },
      tension: function () { return tension; }
    };
  }

  function makeSfx(ctx, out) {
    var k = kit(ctx);
    var PENT = [0, 2, 4, 7, 9];
    function pent(i) { i = Math.max(0, i | 0); return PENT[i % 5] + 12 * Math.floor(i / 5); }

    return {
      tap: function (t, i) {
        var f = mtof(72 + pent(Math.min(i || 0, 9)));
        k.tone(out, "triangle", f, f, t, 0.18, 0.2);
        k.tone(out, "sine", f * 2, f * 2, t, 0.1, 0.07);
      },
      boing: function (t, i) {
        var f = 260 + 45 * ((i || 0) % 6);
        k.tone(out, "sine", f, f * 2.1, t, 0.2, 0.22);
        k.tone(out, "triangle", f * 2, f * 4.2, t, 0.14, 0.05);
      },
      wrong: function (t) {
        k.tone(out, "square", 196, 150, t, 0.2, 0.1, 900);
        k.tone(out, "square", 147, 110, t + 0.13, 0.26, 0.1, 900);
      },
      win: function (t) {
        [523, 659, 784, 1047, 1319].forEach(function (f, i) {
          var s = t + i * 0.085;
          k.tone(out, "triangle", f, f, s, 0.4, 0.2);
          k.tone(out, "sine", f * 2, f * 2, s, 0.25, 0.06);
        });
        k.hiss(out, t + 0.2, 0.45, 0.07, "highpass", 5000, 9000, 0.7);
      },
      heave: function (t, p) {
        p = p || 0;
        k.tone(out, "sine", 110, 46, t, 0.18, 0.35);
        k.hiss(out, t, 0.16, 0.14, "bandpass", 450 + 900 * p, 300 + 700 * p, 6);
      },
      whoosh: function (t) { k.hiss(out, t, 0.45, 0.5, "bandpass", 250, 2600, 1.5); },
      swish: function (t) { k.hiss(out, t, 0.3, 0.3, "lowpass", 2200, 500, 0.8); },
      coin: function (t, i) {
        var f = 1568 * Math.pow(2, Math.min(i || 0, 12) / 24);
        k.tone(out, "sine", f, f, t, 0.14, 0.18);
        k.tone(out, "sine", f * 1.5, f * 1.5, t + 0.07, 0.24, 0.16);
      },
      wilt: function (t) { k.tone(out, "sine", 520, 200, t, 0.3, 0.12); },
      tick: function (t, i) {
        k.tone(out, "square", 640 + 50 * (i || 0), 640 + 50 * (i || 0), t, 0.05, 0.1);
        k.tone(out, "sine", 95, 55, t, 0.12, 0.35);
      },
      clink: function (t) {
        [[2093, 0.5, 0.2], [3271, 0.4, 0.12], [5203, 0.3, 0.07]].forEach(function (p) {
          k.tone(out, "sine", p[0], p[0], t, p[1], p[2]);
        });
        k.hiss(out, t, 0.04, 0.12, "highpass", 6000, 6000, 0.8);
      },
      sparkle: function (t) {
        for (var i = 0; i < 8; i++) {
          var f = mtof(84 + pent(i));
          k.tone(out, "triangle", f, f, t + i * 0.045, 0.22, 0.12);
        }
      },
      pour: function (t, l) {
        k.hiss(out, t, 0.12, 0.16, "highpass", 2500, 2500, 0.8);
        k.tone(out, "sine", 380 + 130 * (l || 0), 380 + 130 * (l || 0), t, 0.1, 0.06);
      }
    };
  }

  // The one signal chain, used live and by the offline tests so they agree:
  //   music -> music level -> duck -> master -+
  //   effects -> effects level ---------------+-> compressor -> output
  function buildGraph(c, nowFn, isDucked) {
    var comp = c.createDynamicsCompressor();
    comp.threshold.value = -16;
    comp.knee.value = 12;
    comp.ratio.value = 5;
    comp.attack.value = 0.004;
    comp.release.value = 0.2;
    comp.connect(c.destination);

    var master = c.createGain();
    master.gain.value = 0.9;
    master.connect(comp);

    var duckGain = c.createGain();
    duckGain.gain.value = isDucked ? DUCK_LEVEL : 1;
    duckGain.connect(master);
    var musicVol = c.createGain();
    musicVol.gain.value = MUSIC_LEVEL;
    musicVol.connect(duckGain);

    var sfxBus = c.createGain();
    sfxBus.gain.value = 1.8;
    sfxBus.connect(master);

    return { comp: comp, duckGain: duckGain, engine: makeEngine(c, musicVol, nowFn), sfx: makeSfx(c, sfxBus) };
  }

  /* ---------- the live instance ---------- */
  var ctx = null, engine = null, sfx = null, comp = null;
  var duckGain = null, analyser = null, timer = null;
  var enabled = { music: true, sfx: true };
  var wantMood = "wonder", wantTension = 0, ducked = false;
  var stats = {};

  function resume() {
    try {
      var p = ctx.resume();
      if (p && p.catch) p.catch(noop);
    } catch (err) { /* nothing to resume */ }
  }

  function pump() {
    if (!enabled.music || ctx.state !== "running") return;
    engine.scheduleUntil(ctx.currentTime + LOOKAHEAD);
  }

  function ensure() {
    if (ctx) {
      if (ctx.state === "suspended") resume();
      return true;
    }
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    try { ctx = new AC(); } catch (err) { ctx = null; return false; }

    var g = buildGraph(ctx, function () { return ctx.currentTime; }, ducked);
    comp = g.comp;
    duckGain = g.duckGain;
    engine = g.engine;
    sfx = g.sfx;
    analyser = ctx.createAnalyser();
    analyser.fftSize = 1024;
    comp.connect(analyser);
    engine.setMood(enabled.music ? wantMood : "none");
    engine.setTension(wantTension);
    timer = setInterval(pump, PUMP_MS);

    document.addEventListener("visibilitychange", function () {
      if (!ctx) return;
      if (document.hidden) { try { ctx.suspend(); } catch (err) { /* ignore */ } }
      else resume();
    });
    resume();
    return true;
  }

  function unlock() { ensure(); }

  function mood(name) {
    wantMood = name;
    if (ctx && enabled.music) engine.setMood(name);
  }

  function tension(x) {
    wantTension = Math.max(0, Math.min(1, x || 0));
    if (ctx) engine.setTension(wantTension);
  }

  function setMusic(on) {
    enabled.music = !!on;
    if (ctx) engine.setMood(enabled.music ? wantMood : "none");
  }

  function setSfx(on) { enabled.sfx = !!on; }

  function duck(on) {
    ducked = !!on;
    if (ctx) duckGain.gain.setTargetAtTime(ducked ? DUCK_LEVEL : 1, ctx.currentTime, 0.12);
  }

  function fx(name, a, b) {
    if (!enabled.sfx || !ensure() || !sfx[name]) return;
    stats[name] = (stats[name] || 0) + 1;
    try { sfx[name](ctx.currentTime + 0.005, a, b); } catch (err) { /* an effect must never break the game */ }
  }

  /* ---------- test hooks: offline renders and a live level meter ---------- */
  function render(kind, name, seconds, arg) {
    var sr = 44100;
    var oc = new OfflineAudioContext(1, Math.ceil(sr * seconds), sr);
    var dest = oc.createGain();
    dest.connect(oc.destination);
    if (kind === "mood") {
      var eng = makeEngine(oc, dest, function () { return 0; });
      eng.setMood(name);
      eng.setTension(arg || 0);
      eng.scheduleUntil(seconds);
    } else {
      makeSfx(oc, dest)[name](0.01, arg || 0, 1);
    }
    return oc.startRendering().then(function (buf) {
      var d = buf.getChannelData(0), peak = 0, sum = 0, dc = 0, bad = 0;
      for (var i = 0; i < d.length; i++) {
        var v = d[i];
        if (v !== v) { bad++; continue; }
        if (Math.abs(v) > peak) peak = Math.abs(v);
        sum += v * v;
        dc += v;
      }
      return { peak: peak, rms: Math.sqrt(sum / d.length), dc: dc / d.length, nan: bad };
    });
  }

  // Worst-case check: a mood at some tension with effects firing, through the real chain.
  function renderMix(name, tn, sfxNames, seconds, duckedMix) {
    var sr = 44100;
    var oc = new OfflineAudioContext(1, Math.ceil(sr * seconds), sr);
    var g = buildGraph(oc, function () { return 0; }, !!duckedMix);
    g.engine.setMood(name);
    g.engine.setTension(tn);
    g.engine.scheduleUntil(seconds);
    sfxNames.forEach(function (n, i) { g.sfx[n](0.5 + i * 0.35, 6, 1); });
    return oc.startRendering().then(function (buf) {
      var d = buf.getChannelData(0), peak = 0, sum = 0;
      for (var i = 0; i < d.length; i++) { var a = Math.abs(d[i]); if (a > peak) peak = a; sum += d[i] * d[i]; }
      return { peak: peak, rms: Math.sqrt(sum / d.length) };
    });
  }

  function level() {
    if (!analyser) return 0;
    var d = new Float32Array(analyser.fftSize), s = 0;
    analyser.getFloatTimeDomainData(d);
    for (var i = 0; i < d.length; i++) s += d[i] * d[i];
    return Math.sqrt(s / d.length);
  }

  return {
    unlock: unlock,
    mood: mood,
    tension: tension,
    setMusic: setMusic,
    setSfx: setSfx,
    duck: duck,
    fx: fx,
    moodNames: Object.keys(MOODS),
    sfxNames: ["tap", "boing", "wrong", "win", "heave", "whoosh", "swish", "coin", "wilt", "tick", "clink", "sparkle", "pour"],
    MUSIC_LEVEL: MUSIC_LEVEL,
    state: function () {
      return { mood: engine ? engine.mood() : null, tension: engine ? engine.tension() : 0, running: ctx ? ctx.state : "none", ducked: ducked, stats: stats };
    },
    _render: render,
    _renderMix: renderMix,
    _level: level
  };
})();
