(function () {
  "use strict";

  var GAME = "yusuf";
  var SAVE_KEY = "asmau-yusuf";
  var story = window.YUSUF_STORY;
  var lines = {};

  var $ = function (id) { return document.getElementById(id); };
  var stage = $("stage");
  var captionText = $("captionText");
  var nextBtn = $("nextBtn");

  var ci = 0;          // chapter index
  var si = 0;          // step index within the chapter
  var stepToken = 0;   // bumps on every step change, so stale timers can tell
  var cleanup = null;  // teardown for the running activity
  var currentLine = null;
  var save = loadSave();

  /* ---------- drawn pieces (no newer-emoji dependencies) ---------- */
  var SVG = {
    WELL: '<svg viewBox="0 0 120 120"><rect x="22" y="70" width="76" height="40" rx="6" fill="#9a8f84" stroke="#5e554d" stroke-width="3"/><path d="M22 84h76M22 97h76M45 70v14M72 70v14M33 84v13M60 84v13M86 84v13M45 97v13M72 97v13" stroke="#5e554d" stroke-width="2"/><ellipse cx="60" cy="70" rx="38" ry="9" fill="#2a2420" stroke="#5e554d" stroke-width="3"/><path d="M28 70V28M92 70V28" stroke="#7a4a2b" stroke-width="6" stroke-linecap="round"/><path d="M18 30 60 8l42 22Z" fill="#a8603a" stroke="#6b3a1e" stroke-width="3" stroke-linejoin="round"/><path d="M60 30v30" stroke="#c9a15a" stroke-width="3"/></svg>',
    BUCKET: '<svg viewBox="0 0 60 60"><path d="M10 22h40l-6 32H16Z" fill="#a8703a" stroke="#6b4423" stroke-width="3" stroke-linejoin="round"/><path d="M10 22Q30-4 50 22" fill="none" stroke="#6b4423" stroke-width="3"/><path d="M13 34h34" stroke="#6b4423" stroke-width="3"/></svg>',
    SACK: '<svg viewBox="0 0 60 70"><path d="M14 22C4 40 6 62 30 64c24-2 26-24 16-42Z" fill="#c9a26a" stroke="#7a5a30" stroke-width="3"/><path d="M16 22c6-8 22-8 28 0" fill="#b08a50" stroke="#7a5a30" stroke-width="3"/><path d="M20 18 14 6M40 18l6-12M30 16V5" stroke="#7a5a30" stroke-width="3" stroke-linecap="round"/></svg>',
    CUP: '<svg viewBox="0 0 60 70"><path d="M12 8h36c0 22-8 32-18 32S12 30 12 8Z" fill="#f0b84b" stroke="#a87412" stroke-width="3" stroke-linejoin="round"/><path d="M30 40v16M18 60h24" stroke="#a87412" stroke-width="5" stroke-linecap="round"/><circle cx="30" cy="20" r="4" fill="#fff3c4"/></svg>',
    STORE: '<svg viewBox="0 0 80 90"><path d="M10 86V44c0-28 60-28 60 0v42Z" fill="#d9b06a" stroke="#8a6230" stroke-width="3"/><rect x="32" y="60" width="16" height="26" rx="8" fill="#6b4423"/><rect x="34" y="28" width="12" height="10" rx="2" fill="#6b4423"/></svg>',
    LAMP: '<svg viewBox="0 0 60 80"><path d="M22 10h16M30 4v6" stroke="#8a6230" stroke-width="4" stroke-linecap="round"/><path d="M16 22 22 10h16l6 12Z" fill="#b8862f" stroke="#7a5518" stroke-width="2"/><rect class="lamp-glass" x="16" y="22" width="28" height="38" rx="4" fill="#3a3550" stroke="#7a5518" stroke-width="3"/><path d="M14 60h32l-4 12H18Z" fill="#b8862f" stroke="#7a5518" stroke-width="2"/><path class="lamp-flame" d="M30 54c-8-8-2-14 0-22 2 8 8 14 0 22Z" fill="#ffd45e" opacity=".15"/></svg>'
  };
  var BRO_COLOURS = ["#8d99b8", "#a58d7a", "#7f9a8a", "#9a86a8", "#b09a6a"];

  /* ---------- saved progress ---------- */
  function loadSave() {
    try {
      var s = JSON.parse(localStorage.getItem(SAVE_KEY) || "{}");
      return { done: s.done || {}, at: s.at || 0, sound: s.sound !== false };
    } catch (err) {
      return { done: {}, at: 0, sound: true };
    }
  }
  function persist() {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); } catch (err) { /* private mode — play on without saving */ }
  }

  /* ---------- sound ---------- */
  var actx = null;
  function tone(freq, dur, when, type) {
    if (!save.sound) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      if (actx.state === "suspended") actx.resume();
      var t = actx.currentTime + (when || 0);
      var osc = actx.createOscillator();
      var gain = actx.createGain();
      osc.type = type || "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.16, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      osc.connect(gain);
      gain.connect(actx.destination);
      osc.start(t);
      osc.stop(t + dur + 0.02);
    } catch (err) { /* no Web Audio — stay silent */ }
  }
  var SCALE = [523, 587, 659, 784, 880, 1047, 1175, 1319];
  function blip(i) { tone(SCALE[(i || 0) % SCALE.length], 0.18); }
  function buzz() { tone(196, 0.22, 0, "triangle"); }
  function fanfare() { [523, 659, 784, 1047].forEach(function (f, i) { tone(f, 0.26, i * 0.11, "triangle"); }); }

  function say(id) {
    if (!save.sound) { window.AsmauNarration.stop(); return Promise.resolve(); }
    return window.AsmauNarration.say(GAME, id, lines[id] || "", { lang: "en" });
  }
  function setCaption(id) {
    currentLine = id;
    captionText.textContent = lines[id] || "";
  }

  /* ---------- small DOM helpers ---------- */
  function mk(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function place(n, x, y) { n.style.left = x + "%"; n.style.top = y + "%"; }
  function shake(n) { n.classList.remove("shake"); void n.offsetWidth; n.classList.add("shake"); }

  function sprite(spec) {
    var kind = spec[0], x = spec[1], y = spec[2], size = spec[3], anim = spec[4];
    if (kind === "BARS") return mk("div", "bars");

    var n = mk("div", "sp" + (anim ? " a-" + anim : ""));
    place(n, x, y);
    var inner = mk("div", "sp-in");

    if (kind === "GLOW" || kind === "GLOWK") {
      inner.className += " glow";
      inner.style.width = inner.style.height = size + "px";
      if (kind === "GLOWK") {
        var crown = mk("span", "crown", "👑");
        crown.style.fontSize = (size * 0.5) + "px";
        inner.appendChild(crown);
      }
    } else if (kind === "BROS") {
      var pack = mk("div", "bros-pack");
      pack.style.transform = "scale(" + size + ")";
      for (var i = 0; i < 10; i++) {
        var d = mk("i");
        d.style.background = BRO_COLOURS[i % BRO_COLOURS.length];
        pack.appendChild(d);
      }
      inner.appendChild(pack);
    } else if (kind.indexOf("DOT:") === 0) {
      inner.className += " dot";
      inner.style.background = kind.slice(4);
      inner.style.width = inner.style.height = size + "px";
    } else if (kind.indexOf("T:") === 0) {
      inner.className += " txt";
      inner.textContent = kind.slice(2);
      inner.style.fontSize = size + "px";
    } else if (kind === "COINS") {
      inner.className += " coins";
      for (var c = 0; c < 3; c++) inner.appendChild(mk("i"));
    } else if (SVG[kind]) {
      inner.innerHTML = SVG[kind];
      inner.style.width = size + "px";
    } else {
      inner.className += " emo";
      inner.textContent = kind;
      inner.style.fontSize = size + "px";
    }
    n.appendChild(inner);
    return n;
  }

  function skyKinds() {
    var kinds = [];
    for (var i = 0; i < 11; i++) kinds.push("⭐");
    kinds.splice(3, 0, "☀️");
    kinds.splice(9, 0, "🌙");
    return kinds; // eleven stars, the sun and the moon
  }

  function drawArt(target, art) {
    (art || []).forEach(function (spec) {
      if (spec[0] === "RING") {
        skyKinds().forEach(function (k, i) {
          var ang = (i / 13) * Math.PI * 2 - Math.PI / 2;
          target.appendChild(sprite([k, spec[1] + 30 * Math.cos(ang), spec[2] + 34 * Math.sin(ang), k === "⭐" ? 24 : 32]));
        });
        return;
      }
      target.appendChild(sprite(spec));
    });
  }

  function burst() {
    for (var i = 0; i < 9; i++) {
      var s = mk("span", "spark", "✨");
      place(s, 8 + Math.random() * 84, 10 + Math.random() * 75);
      s.style.animationDelay = (Math.random() * 0.3) + "s";
      stage.appendChild(s);
      setTimeout(function (el) { el.remove(); }, 1500, s);
    }
  }

  /* ---------- activities: each returns its own teardown ---------- */
  var ACT = {};

  // Tap the eleven stars, the sun and the moon.
  ACT.sky = function (opts, done) {
    var gather = opts.mode === "gather";
    stage.appendChild(sprite([gather ? "GLOWK" : "GLOW", 50, 50, 60, "pulse"]));
    var chip = mk("div", "count-chip", "0 / 13");
    stage.appendChild(chip);
    var n = 0;
    skyKinds().forEach(function (k, i) {
      var ang = (i / 13) * Math.PI * 2 - Math.PI / 2;
      var b = mk("button", "body" + (k === "⭐" ? "" : " big"), k);
      b.setAttribute("aria-label", k === "⭐" ? "star" : (k === "☀️" ? "sun" : "moon"));
      place(b, 50 + 40 * Math.cos(ang), 50 + 38 * Math.sin(ang));
      b.addEventListener("click", function () {
        if (b.disabled) return;
        b.disabled = true;
        n += 1;
        blip(n);
        if (gather) {
          place(b, 50 + 22 * Math.cos(ang), 50 + 25 * Math.sin(ang));
          b.classList.add("home");
        } else {
          b.classList.add("bowed");
        }
        chip.textContent = n + " / 13";
        if (n === 13) done();
      });
      stage.appendChild(b);
    });
    return function () {};
  };

  // One question, two answers.
  ACT.choice = function (opts, done) {
    drawArt(stage, opts.art);
    var box = mk("div", "choices");
    opts.options.forEach(function (o) {
      var b = mk("button", "choice");
      b.appendChild(mk("span", "choice-ico", o.icon));
      b.appendChild(mk("span", "", o.label));
      b.addEventListener("click", function () {
        if (o.ok) {
          Array.prototype.forEach.call(box.children, function (x) { x.disabled = true; });
          b.classList.add("right");
          done();
        } else {
          shake(b);
          buzz();
          setCaption(opts.wrong);
          say(opts.wrong);
        }
      });
      box.appendChild(b);
    });
    stage.appendChild(box);
    return function () {};
  };

  // Haul the bucket up the well; it slips back a little if you stop.
  ACT.pull = function (opts, done) {
    var p = 0, finished = false;
    var shaft = mk("div", "shaft");
    var lift = mk("div", "lift");
    lift.innerHTML = '<div class="rope"></div>' + SVG.BUCKET + '<div class="lift-glow"></div>';
    var glow = lift.querySelector(".lift-glow");
    shaft.appendChild(lift);
    stage.appendChild(shaft);
    stage.appendChild(mk("div", "shaft-rim"));
    var btn = mk("button", "btn btn-teal pull-btn", "Pull!");
    stage.appendChild(btn);

    function paint() {
      lift.style.bottom = (3 + p * 72) + "%";
      glow.style.opacity = String(0.3 + 0.7 * p);
    }
    function tug() {
      if (finished) return;
      p = Math.min(1, p + 0.09);
      blip(Math.floor(p * 7));
      lift.classList.remove("tug"); void lift.offsetWidth; lift.classList.add("tug");
      paint();
      if (p >= 1) {
        finished = true;
        btn.disabled = true;
        btn.textContent = "You did it!";
        done();
      }
    }
    btn.addEventListener("click", tug);
    shaft.addEventListener("click", tug);
    var timer = setInterval(function () {
      if (!finished && p > 0) { p = Math.max(0, p - 0.012); paint(); }
    }, 200);
    paint();
    return function () { clearInterval(timer); };
  };

  // Tap the traveller along a path, one hop at a time.
  ACT.journey = function (opts, done) {
    var k = 0, steps = opts.steps || 6;
    if (opts.grey) {
      // Start grey at once; only the return of colour should be animated.
      stage.style.transition = "none";
      stage.classList.add("grey");
      void stage.offsetWidth;
      stage.style.transition = "";
    }
    stage.appendChild(mk("div", "path"));
    var from = mk("div", "marker", opts.from); place(from, 9, 62); stage.appendChild(from);
    var to = mk("div", "marker", opts.to); place(to, 91, 62); stage.appendChild(to);

    var mover = mk("button", "mover fresh");
    mover.setAttribute("aria-label", "Tap to move forward");
    mover.appendChild(mk("span", opts.flip ? "flip" : "", opts.icon));
    if (opts.rider) mover.appendChild(mk("span", "glow rider"));
    function paint() { place(mover, 30 + (44 * k / steps), 70 - 10 * Math.sin(Math.PI * k / steps)); }
    mover.addEventListener("click", function () {
      if (k >= steps) return;
      k += 1;
      blip(k);
      mover.classList.remove("fresh");
      mover.classList.remove("hop"); void mover.offsetWidth; mover.classList.add("hop");
      paint();
      if (k === steps) {
        mover.disabled = true;
        stage.classList.remove("grey");
        done();
      }
    });
    stage.appendChild(mover);
    paint();
    return function () {};
  };

  // Patience: keep a finger on the lamp until it is fully lit.
  ACT.hold = function (opts, done) {
    var p = 0, holding = false, finished = false, last = 0, raf = 0;
    var need = opts.ms || 3200;
    var dark = mk("div", "dark");
    stage.appendChild(dark);
    var btn = mk("button", "lamp-btn");
    btn.setAttribute("aria-label", "Press and hold the lamp");
    btn.innerHTML = '<svg class="ring" viewBox="0 0 120 120"><circle class="ring-bg" cx="60" cy="60" r="54"/><circle class="ring-fg" cx="60" cy="60" r="54"/></svg><span class="lamp-wrap">' + SVG.LAMP + "</span>";
    stage.appendChild(btn);
    var hint = mk("div", "hold-hint", "Press and hold");
    stage.appendChild(hint);

    var fg = btn.querySelector(".ring-fg");
    var flame = btn.querySelector(".lamp-flame");
    var C = 2 * Math.PI * 54;
    fg.style.strokeDasharray = String(C);

    function paint() {
      fg.style.strokeDashoffset = String(C * (1 - p));
      flame.style.opacity = String(0.15 + 0.85 * p);
      dark.style.opacity = String(0.7 * (1 - p));
    }
    function frame(t) {
      var dt = last ? t - last : 0;
      last = t;
      p = holding ? Math.min(1, p + dt / need) : Math.max(0, p - dt / 900);
      paint();
      if (p >= 1) {
        finished = true;
        btn.classList.add("lit");
        hint.textContent = "It shines!";
        done();
        return;
      }
      raf = requestAnimationFrame(frame);
    }
    function down(e) {
      if (e) e.preventDefault();
      if (finished || holding) return;
      holding = true;
      hint.textContent = "Keep holding…";
      tone(330, 0.15);
    }
    function up() {
      if (holding && !finished) hint.textContent = "Almost! Hold a little longer.";
      holding = false;
    }
    btn.addEventListener("pointerdown", down);
    ["pointerup", "pointercancel", "pointerleave"].forEach(function (ev) { btn.addEventListener(ev, up); });
    btn.addEventListener("keydown", function (e) { if (e.key === " " || e.key === "Enter") down(e); });
    btn.addEventListener("keyup", function (e) { if (e.key === " " || e.key === "Enter") up(); });
    btn.addEventListener("contextmenu", function (e) { e.preventDefault(); });
    paint();
    raf = requestAnimationFrame(frame);
    return function () { cancelAnimationFrame(raf); };
  };

  // Tap a dream, then tap its meaning. Every card reads itself aloud.
  ACT.match = function (opts, done) {
    stage.classList.add("flow");
    var sel = null, matched = 0;
    var grid = mk("div", "match");
    var left = mk("div", "match-col");
    var right = mk("div", "match-col");

    function card(id, icon, side, pair) {
      var b = mk("button", "mcard " + side);
      b.appendChild(mk("span", "mcard-ico", icon));
      b.appendChild(mk("span", "", lines[id]));
      b.addEventListener("click", function () {
        if (b.classList.contains("matched")) return;
        if (side === "a") {
          if (sel) sel.classList.remove("sel");
          sel = b;
          b.classList.add("sel");
          say(id);
          return;
        }
        if (!sel) { say(id); shake(left); return; }
        if (sel.pair === pair) {
          sel.classList.remove("sel");
          sel.classList.add("matched");
          b.classList.add("matched");
          sel = null;
          matched += 1;
          blip(matched * 2);
          say(id);
          if (matched === opts.pairs.length) done(true);
        } else {
          shake(b);
          buzz();
        }
      });
      b.pair = pair;
      return b;
    }
    opts.pairs.forEach(function (p, i) { left.appendChild(card(p.a, p.aIcon, "a", i)); });
    opts.pairs.slice().reverse().forEach(function (p, i) { right.appendChild(card(p.b, p.bIcon, "b", opts.pairs.length - 1 - i)); });
    grid.appendChild(left);
    grid.appendChild(right);
    stage.appendChild(grid);
    return function () {};
  };

  // Tap each half of the king's dream to hear what it means.
  ACT.reveal = function (opts, done) {
    stage.classList.add("flow");
    var grid = mk("div", "reveal");
    var seen = 0;
    opts.items.forEach(function (it) {
      var b = mk("button", "rcard " + it.kind);
      var cows = mk("div", "rrow");
      var grain = mk("div", "rrow");
      for (var i = 0; i < 7; i++) {
        cows.appendChild(mk("span", "cow", "🐄"));
        grain.appendChild(mk("span", "grain", "🌾"));
      }
      var meaning = mk("div", "rmeaning", it.label);
      meaning.hidden = true;
      b.appendChild(cows);
      b.appendChild(grain);
      b.appendChild(meaning);
      b.addEventListener("click", function () {
        setCaption(it.line);
        say(it.line);
        if (b.classList.contains("seen")) return;
        b.classList.add("seen");
        meaning.hidden = false;
        seen += 1;
        if (seen === opts.items.length) done(true);
      });
      grid.appendChild(b);
    });
    stage.appendChild(grid);
    return function () {};
  };

  // Grain sprouts around the field; tap it before it wilts.
  ACT["catch"] = function (opts, done) {
    var target = opts.target || 7, n = 0, finished = false;
    var store = mk("div", "store-box");
    store.innerHTML = SVG.STORE;
    var count = mk("div", "store-count", "0 / " + target);
    store.appendChild(count);
    stage.appendChild(store);

    function spawn() {
      if (finished || stage.querySelectorAll(".wheat").length >= 3) return;
      var w = mk("button", "wheat", "🌾");
      w.setAttribute("aria-label", "grain");
      place(w, 10 + Math.random() * 56, 58 + Math.random() * 30);
      var gone = setTimeout(function () {
        w.classList.add("wilt");
        setTimeout(function () { w.remove(); }, 400);
      }, 2800);
      w.addEventListener("click", function () {
        if (w.disabled || finished) return;
        w.disabled = true;
        clearTimeout(gone);
        n += 1;
        blip(n);
        count.textContent = n + " / " + target;
        place(w, 88, 20);
        w.classList.add("fly");
        setTimeout(function () { w.remove(); }, 480);
        if (n >= target) { finished = true; done(); }
      });
      stage.appendChild(w);
    }
    var timer = setInterval(spawn, 700);
    spawn();
    return function () { finished = true; clearInterval(timer); };
  };

  // Full measure: tap every sack up to the top.
  ACT.fill = function (opts, done) {
    var total = opts.sacks || 5, taps = opts.taps || 3, full = 0;
    var row = mk("div", "sack-row");
    for (var i = 0; i < total; i++) {
      (function () {
        var level = 0;
        var b = mk("button", "fsack");
        b.setAttribute("aria-label", "sack of grain");
        var fillEl = mk("span", "fsack-fill");
        b.appendChild(fillEl);
        b.addEventListener("click", function () {
          if (level >= taps) return;
          level += 1;
          blip(level + full);
          fillEl.style.height = (level / taps * 100) + "%";
          if (level === taps) {
            b.classList.add("full");
            full += 1;
            if (full === total) done();
          }
        });
        row.appendChild(b);
      })();
    }
    stage.appendChild(row);
    return function () {};
  };

  // Search the bags. As in the story, the cup turns up in the last one.
  ACT.search = function (opts, done) {
    var total = opts.bags || 5, opened = 0;
    var row = mk("div", "sack-row");
    for (var i = 0; i < total; i++) {
      (function () {
        var b = mk("button", "bag");
        b.setAttribute("aria-label", "bag");
        b.innerHTML = SVG.SACK;
        b.addEventListener("click", function () {
          if (b.disabled) return;
          b.disabled = true;
          opened += 1;
          if (opened === total) {
            b.classList.add("found");
            var cup = mk("span", "bag-cup");
            cup.innerHTML = SVG.CUP;
            b.appendChild(cup);
            done();
          } else {
            b.classList.add("empty");
            blip(opened);
          }
        });
        row.appendChild(b);
      })();
    }
    stage.appendChild(row);
    return function () {};
  };

  /* ---------- flow ---------- */
  function teardown() {
    stepToken += 1;
    if (cleanup) { cleanup(); cleanup = null; }
  }

  function show(view) {
    ["title", "play", "chapters", "end"].forEach(function (v) { $(v).hidden = v !== view; });
    if (view !== "play") { teardown(); window.AsmauNarration.stop(); }
    window.scrollTo(0, 0);
  }

  function renderTrail() {
    var trail = $("trail");
    trail.innerHTML = "";
    story.forEach(function (ch, i) {
      var b = mk("button", (i === ci ? "on" : (save.done[ch.id] ? "done" : "")));
      b.setAttribute("aria-label", "Chapter " + (i + 1) + ": " + ch.title);
      b.addEventListener("click", function () { startChapter(i); });
      trail.appendChild(b);
    });
  }

  function renderStep() {
    teardown();
    var token = stepToken;
    var ch = story[ci];
    var st = ch.steps[si];

    $("chNum").textContent = "Chapter " + (ci + 1) + " of " + story.length;
    $("chTitle").textContent = ch.title;
    var src = $("chSource");
    src.textContent = "Qur’an " + ch.source.replace("-", "–");
    src.href = "https://quran.com/" + ch.source;
    renderTrail();

    stage.className = "stage";
    stage.dataset.scene = st.scene;
    stage.innerHTML = "";

    var lineId = st.say || st.line;
    setCaption(lineId);

    if (st.say) {
      drawArt(stage, st.art);
      nextBtn.hidden = false;
    } else {
      nextBtn.hidden = true;
      cleanup = ACT[st.play](st.opts || {}, function (waitForTap) {
        if (token !== stepToken) return;
        fanfare();
        burst();
        if (waitForTap) { nextBtn.hidden = false; return; }
        setTimeout(function () { if (token === stepToken) next(); }, 1300);
      });
    }

    say(lineId);
    save.at = ci;
    persist();
  }

  function next() {
    var ch = story[ci];
    si += 1;
    if (si >= ch.steps.length) {
      save.done[ch.id] = true;
      si = 0;
      ci += 1;
      if (ci >= story.length) {
        ci = 0;
        save.at = 0;
        persist();
        showEnd();
        return;
      }
    }
    renderStep();
  }

  function prev() {
    if (si > 0) {
      si -= 1;
    } else if (ci > 0) {
      ci -= 1;
      si = story[ci].steps.length - 1;
    } else {
      showTitle();
      return;
    }
    renderStep();
  }

  function startChapter(i) {
    ci = i;
    si = 0;
    show("play");
    renderStep();
  }

  function showTitle() {
    var resume = save.at > 0 && save.at < story.length;
    $("startBtn").textContent = resume ? "Continue — Chapter " + (save.at + 1) : "Start the story";
    $("restartBtn").hidden = !resume;
    show("title");
  }

  function showChapters() {
    var grid = $("chapterGrid");
    grid.innerHTML = "";
    story.forEach(function (ch, i) {
      var b = mk("button", "chapter-tile");
      b.appendChild(mk("span", "ico", ch.icon));
      b.appendChild(mk("span", "n", "Chapter " + (i + 1)));
      b.appendChild(mk("span", "t", ch.title));
      b.appendChild(mk("span", "star", save.done[ch.id] ? "⭐" : ""));
      b.addEventListener("click", function () { startChapter(i); });
      grid.appendChild(b);
    });
    show("chapters");
  }

  function showEnd() {
    show("end");
    $("endText").textContent = lines["end-a"] || "";
    fanfare();
    say("end-a");
  }

  function paintSound() {
    var b = $("soundBtn");
    b.textContent = save.sound ? "🔊" : "🔇";
    b.setAttribute("aria-label", save.sound ? "Sound is on" : "Sound is off");
  }

  function buildTitleSky() {
    var sky = $("titleSky");
    drawArt(sky, [["RING", 50, 52, 1], ["GLOW", 50, 54, 64, "pulse"]]);
  }

  function wire() {
    $("startBtn").addEventListener("click", function () { startChapter(save.at > 0 && save.at < story.length ? save.at : 0); });
    $("restartBtn").addEventListener("click", function () { startChapter(0); });
    $("mapBtn").addEventListener("click", showChapters);
    $("soundBtn").addEventListener("click", function () {
      save.sound = !save.sound;
      persist();
      paintSound();
      if (!save.sound) window.AsmauNarration.stop();
    });
    $("caption").addEventListener("click", function () { if (currentLine) say(currentLine); });
    nextBtn.addEventListener("click", next);
    $("prevBtn").addEventListener("click", prev);
    $("againBtn").addEventListener("click", function () { startChapter(0); });
    $("endChaptersBtn").addEventListener("click", showChapters);
  }

  fetch("narration.json")
    .then(function (r) { return r.json(); })
    .then(function (list) {
      list.forEach(function (l) { lines[l.id] = l.text; });
      buildTitleSky();
      paintSound();
      wire();
      showTitle();
    })
    .catch(function () {
      $("title").innerHTML = "<p>Couldn’t load the story. If you opened this as a file, serve the folder over http instead.</p>";
    });
})();
