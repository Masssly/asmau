(function () {
  "use strict";

  var GAME = "yusuf";
  var SAVE_KEY = "asmau-yusuf";
  var story = window.YUSUF_STORY;
  var moods = window.YUSUF_MOODS || {};
  var music = window.AsmauMusic;
  var People = window.YusufPeople;
  var lines = {};

  var $ = function (id) { return document.getElementById(id); };
  var stage = $("stage");
  var captionText = $("captionText");
  var nextBtn = $("nextBtn");
  var prevBtn = $("prevBtn");

  var ci = 0;          // chapter index
  var si = 0;          // step index within the chapter
  var stepToken = 0;   // bumps on every step change, so stale timers can tell
  var cleanup = null;  // teardown for the running activity
  var skipTimer = null;
  var currentLine = null;
  var pnoteFor = null;
  var save = loadSave();

  var SCENE_MOOD = { night: "wonder", dusk: "sad", desert: "desert", well: "tense", egypt: "regal", palace: "regal", prison: "sad", field: "joy", grey: "sad", dawn: "joy" };
  var GROUPS = { brothers: ["b1", "b3", "b2", "b4"] };

  /* ---------- drawn pieces ---------- */
  var SVG = {
    WELL: '<svg viewBox="0 0 120 120"><rect x="22" y="70" width="76" height="40" rx="6" fill="#9a8f84" stroke="#5e554d" stroke-width="3"/><path d="M22 84h76M22 97h76M45 70v14M72 70v14M33 84v13M60 84v13M86 84v13M45 97v13M72 97v13" stroke="#5e554d" stroke-width="2"/><ellipse cx="60" cy="70" rx="38" ry="9" fill="#2a2420" stroke="#5e554d" stroke-width="3"/><path d="M28 70V28M92 70V28" stroke="#7a4a2b" stroke-width="6" stroke-linecap="round"/><path d="M18 30 60 8l42 22Z" fill="#a8603a" stroke="#6b3a1e" stroke-width="3" stroke-linejoin="round"/><path d="M60 30v30" stroke="#c9a15a" stroke-width="3"/></svg>',
    BUCKET: '<svg viewBox="0 0 60 60"><path d="M10 22h40l-6 32H16Z" fill="#a8703a" stroke="#6b4423" stroke-width="3" stroke-linejoin="round"/><path d="M10 22Q30-4 50 22" fill="none" stroke="#6b4423" stroke-width="3"/><path d="M13 34h34" stroke="#6b4423" stroke-width="3"/></svg>',
    SACK: '<svg viewBox="0 0 60 70"><path d="M14 22C4 40 6 62 30 64c24-2 26-24 16-42Z" fill="#c9a26a" stroke="#7a5a30" stroke-width="3"/><path d="M16 22c6-8 22-8 28 0" fill="#b08a50" stroke="#7a5a30" stroke-width="3"/><path d="M20 18 14 6M40 18l6-12M30 16V5" stroke="#7a5a30" stroke-width="3" stroke-linecap="round"/></svg>',
    CUP: '<svg viewBox="0 0 60 70"><path d="M12 8h36c0 22-8 32-18 32S12 30 12 8Z" fill="#f0b84b" stroke="#a87412" stroke-width="3" stroke-linejoin="round"/><path d="M30 40v16M18 60h24" stroke="#a87412" stroke-width="5" stroke-linecap="round"/><circle cx="30" cy="20" r="4" fill="#fff3c4"/></svg>',
    STORE: '<svg viewBox="0 0 80 90"><path d="M10 86V44c0-28 60-28 60 0v42Z" fill="#d9b06a" stroke="#8a6230" stroke-width="3"/><rect x="32" y="60" width="16" height="26" rx="8" fill="#6b4423"/><rect x="34" y="28" width="12" height="10" rx="2" fill="#6b4423"/></svg>',
    LAMP: '<svg viewBox="0 0 60 80"><path d="M22 10h16M30 4v6" stroke="#8a6230" stroke-width="4" stroke-linecap="round"/><path d="M16 22 22 10h16l6 12Z" fill="#b8862f" stroke="#7a5518" stroke-width="2"/><rect class="lamp-glass" x="16" y="22" width="28" height="38" rx="4" fill="#3a3550" stroke="#7a5518" stroke-width="3"/><path d="M14 60h32l-4 12H18Z" fill="#b8862f" stroke="#7a5518" stroke-width="2"/><path class="lamp-flame" d="M30 54c-8-8-2-14 0-22 2 8 8 14 0 22Z" fill="#ffd45e" opacity=".15"/></svg>'
  };

  /* ---------- saved progress ---------- */
  function loadSave() {
    try {
      var s = JSON.parse(localStorage.getItem(SAVE_KEY) || "{}");
      return { done: s.done || {}, at: s.at || 0, step: s.step || 0, sound: s.sound !== false, music: s.music !== false };
    } catch (err) {
      return { done: {}, at: 0, step: 0, sound: true, music: true };
    }
  }
  function persist() {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); } catch (err) { /* private mode — play on without saving */ }
  }

  /* ---------- sound, music and buzz ---------- */
  var VIB = { tap: 8, boing: 10, wrong: 30, win: [20, 40, 20], heave: 12, coin: 8, tick: 12, clink: 25, pour: 6 };
  function vib(pattern) {
    if (!save.sound) return;
    try { if (navigator.vibrate) navigator.vibrate(pattern); } catch (err) { /* not supported */ }
  }
  function fx(name, a, b) {
    music.fx(name, a, b);
    if (VIB[name]) vib(VIB[name]);
  }
  function blip(i) { fx("tap", i || 0); }
  function buzz() { fx("wrong"); }
  function fanfare() { fx("win"); }

  var sayToken = 0;
  function stopVoice() {
    sayToken += 1;
    window.AsmauNarration.stop();
    music.duck(false);
  }
  function say(id) {
    if (!save.sound) { stopVoice(); return Promise.resolve(); }
    var mine = ++sayToken;
    music.duck(true);
    return window.AsmauNarration.say(GAME, id, lines[id] || "", { lang: "en" }).then(function () {
      if (mine === sayToken) music.duck(false);
    });
  }
  function setCaption(id) {
    currentLine = id;
    captionText.textContent = lines[id] || "";
  }
  function moodFor(st) {
    return moods[st.say || st.line] || SCENE_MOOD[st.scene] || "wonder";
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
  function merge(a, b) { var o = {}, k; for (k in a) o[k] = a[k]; for (k in b) o[k] = b[k]; return o; }

  function setNext(label, skip) {
    nextBtn.querySelector(".lbl").textContent = label;
    nextBtn.classList.toggle("skip", !!skip);
  }

  function personEl(name, o) {
    var el = mk("span", "touchy person");
    el._fig = { name: name, o: o || {} };
    el.innerHTML = People.svg(name, o);
    return el;
  }

  function sprite(spec) {
    var kind = spec[0], x = spec[1], y = spec[2], size = spec[3], anim = spec[4], o = spec[5] || {};
    if (kind === "BARS") return mk("div", "bars");

    var n = mk("div", "sp" + (anim ? " a-" + anim : ""));
    place(n, x, y);
    var inner = mk("div", "sp-in touchy");
    n.style.animationDelay = "0s";
    inner.style.animationDelay = "-" + (Math.round(Math.random() * 30) / 10) + "s";

    if (kind.indexOf("P:") === 0) {
      inner.className += " person";
      inner._fig = { name: kind.slice(2), o: o };
      inner.innerHTML = People.svg(kind.slice(2), o);
      inner.style.width = size + "px";
    } else if (kind.indexOf("G:") === 0) {
      inner.className = "sp-in group";
      (GROUPS[kind.slice(2)] || []).forEach(function (nm, i) {
        var p = personEl(nm, o);
        p.style.width = (size * 0.33) + "px";
        p.style.marginLeft = i ? (-size * 0.08) + "px" : "0";
        p.style.marginBottom = (i % 2 ? 0 : 8) + "px";
        inner.appendChild(p);
      });
    } else if (kind.indexOf("T:") === 0) {
      inner.className = "sp-in txt";
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

  /* ---------- touching the scene ---------- */
  function pop(e, glyph) {
    var r = stage.getBoundingClientRect();
    var s = mk("span", "spark", glyph || "✨");
    s.style.left = ((e.clientX - r.left) / r.width * 100) + "%";
    s.style.top = ((e.clientY - r.top) / r.height * 100) + "%";
    stage.appendChild(s);
    setTimeout(function () { s.remove(); }, 1200);
  }

  function react(el, e) {
    el.classList.remove("react");
    void el.offsetWidth;
    el.classList.add("react");
    setTimeout(function () { el.classList.remove("react"); }, 650);
    fx("boing", Math.floor(Math.random() * 6));
    pop(e, el._fig ? "💛" : "✨");
    if (el._fig && !el._flash) {
      el._flash = true;
      el.innerHTML = People.svg(el._fig.name, merge(el._fig.o, { expr: "happy" }));
      setTimeout(function () { el.innerHTML = People.svg(el._fig.name, el._fig.o); el._flash = false; }, 1100);
    }
  }

  /* ---------- activities: each returns its own teardown ---------- */
  var ACT = {};

  // Tap the eleven stars, the sun and the moon.
  ACT.sky = function (opts, done) {
    var gather = opts.mode === "gather";
    stage.appendChild(sprite([gather ? "P:yusufMan" : "P:yusuf", 50, 52, 86, "bob", { expr: "happy" }]));
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

  // Haul the bucket up the well. Drag the rope upward, or tap; it slips back a little if you stop.
  ACT.pull = function (opts, done) {
    var p = 0, finished = false, dragged = false, down = false, startY = 0;
    var shaft = mk("div", "shaft");
    var lift = mk("div", "lift");
    lift.innerHTML = '<div class="rope"></div><div class="lift-face"></div>' + SVG.BUCKET;
    var face = lift.querySelector(".lift-face");
    function setFace(expr) { face.innerHTML = People.svg("yusuf", { expr: expr }); }
    setFace("scared");
    shaft.appendChild(lift);
    stage.appendChild(shaft);
    stage.appendChild(mk("div", "shaft-rim"));
    var btn = mk("button", "btn btn-teal pull-btn", "Pull!");
    stage.appendChild(btn);

    function paint() { lift.style.bottom = (3 + p * 72) + "%"; }
    function tug() {
      if (finished) return;
      p = Math.min(1, p + 0.09);
      fx("heave", p);
      music.tension(p * 0.95);
      lift.classList.remove("tug"); void lift.offsetWidth; lift.classList.add("tug");
      paint();
      if (p >= 0.5) setFace("worried");
      if (p >= 1) {
        finished = true;
        btn.disabled = true;
        btn.textContent = "You did it!";
        setFace("happy");
        music.tension(0);
        done();
      }
    }
    btn.addEventListener("click", tug);
    shaft.addEventListener("click", function () {
      if (dragged) { dragged = false; return; }
      tug();
    });
    shaft.addEventListener("pointerdown", function (e) {
      down = true; dragged = false; startY = e.clientY;
      try { shaft.setPointerCapture(e.pointerId); } catch (err) { /* capture is optional */ }
    });
    shaft.addEventListener("pointermove", function (e) {
      if (!down) return;
      var dy = startY - e.clientY;
      if (dy < 0) { startY = e.clientY; return; }
      if (dy > 8) dragged = true;
      var n = Math.floor(dy / 24);
      if (n > 0) { for (var i = 0; i < n; i++) tug(); startY -= n * 24; }
    });
    ["pointerup", "pointercancel"].forEach(function (ev) { shaft.addEventListener(ev, function () { down = false; }); });

    var timer = setInterval(function () {
      if (!finished && p > 0) { p = Math.max(0, p - 0.012); paint(); music.tension(p * 0.95); }
    }, 200);
    paint();
    return function () { clearInterval(timer); };
  };

  // Walk the traveller along a path: drag them, or tap for one step at a time.
  ACT.journey = function (opts, done) {
    var k = 0, steps = opts.steps || 6, dragging = false, moved = false;
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
    mover.setAttribute("aria-label", "Drag or tap to move forward");
    mover.appendChild(mk("span", opts.flip ? "flip" : "", opts.icon));
    if (opts.rider) {
      var rider = mk("span", "rider");
      rider.innerHTML = People.svg("yusuf", { expr: "happy" });
      mover.appendChild(rider);
    }
    function paint() { place(mover, 30 + (44 * k / steps), 70 - 10 * Math.sin(Math.PI * k / steps)); }
    function advanceTo(target) {
      while (k < target && k < steps) {
        k += 1;
        blip(k);
        mover.classList.remove("fresh");
        mover.classList.remove("hop"); void mover.offsetWidth; mover.classList.add("hop");
      }
      paint();
      if (k >= steps && !mover.disabled) {
        mover.disabled = true;
        stage.classList.remove("grey");
        done();
      }
    }
    mover.addEventListener("click", function () {
      if (moved) { moved = false; return; }
      advanceTo(k + 1);
    });
    mover.addEventListener("pointerdown", function (e) {
      dragging = true; moved = false;
      try { mover.setPointerCapture(e.pointerId); } catch (err) { /* capture is optional */ }
    });
    mover.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      var r = stage.getBoundingClientRect();
      var xp = (e.clientX - r.left) / r.width * 100;
      var target = Math.round((xp - 30) / 44 * steps);
      if (target > k) { moved = true; advanceTo(target); }
    });
    ["pointerup", "pointercancel"].forEach(function (ev) { mover.addEventListener(ev, function () { dragging = false; }); });
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
      music.tension(p * 0.95);
      if (p >= 1) {
        finished = true;
        btn.classList.add("lit");
        hint.textContent = "It shines!";
        music.tension(0);
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
      fx("tick", 0);
      vib(40);
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

    function card(id, icon, label, side, pair) {
      var b = mk("button", "mcard " + side);
      b.setAttribute("aria-label", lines[id]);
      b.appendChild(mk("span", "mcard-ico", icon));
      b.appendChild(mk("span", "mcard-label", label || lines[id]));
      b.addEventListener("click", function () {
        if (b.classList.contains("matched")) return;
        if (side === "a") {
          if (sel) sel.classList.remove("sel");
          sel = b;
          b.classList.add("sel");
          blip(1);
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
          fx("coin", matched * 2);
          say(id);
          if (matched === opts.pairs.length) done();
        } else {
          shake(b);
          buzz();
        }
      });
      b.pair = pair;
      return b;
    }
    opts.pairs.forEach(function (p, i) { left.appendChild(card(p.a, p.aIcon, p.aLabel, "a", i)); });
    opts.pairs.slice().reverse().forEach(function (p, i) { right.appendChild(card(p.b, p.bIcon, p.bLabel, "b", opts.pairs.length - 1 - i)); });
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
        fx("sparkle");
        say(it.line);
        if (b.classList.contains("seen")) return;
        b.classList.add("seen");
        meaning.hidden = false;
        seen += 1;
        if (seen === opts.items.length) done();
      });
      grid.appendChild(b);
    });
    stage.appendChild(grid);
    return function () {};
  };

  // Put the events in the order they happened: tap them one after another.
  ACT.order = function (opts, done) {
    stage.classList.add("flow");
    var cards = opts.cards, nextIdx = 0, shuffled = cards.slice();
    do {
      for (var i = shuffled.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1)), t = shuffled[i];
        shuffled[i] = shuffled[j];
        shuffled[j] = t;
      }
    } while (shuffled.every(function (c, k) { return c === cards[k]; }));
    var grid = mk("div", "order");
    shuffled.forEach(function (c) {
      var b = mk("button", "ocard");
      b.setAttribute("aria-label", lines[c.line]);
      b.appendChild(mk("span", "ocard-ico", c.icon));
      b.appendChild(mk("span", "ocard-label", c.label));
      var badge = mk("span", "ocard-n");
      b.appendChild(badge);
      b.addEventListener("click", function () {
        if (b.classList.contains("placed")) return;
        if (c === cards[nextIdx]) {
          b.classList.add("placed");
          nextIdx += 1;
          badge.textContent = String(nextIdx);
          fx("coin", nextIdx * 2);
          setCaption(c.line);
          say(c.line);
          if (nextIdx === cards.length) done();
        } else {
          shake(b);
          buzz();
          setCaption(opts.wrong);
          say(opts.wrong);
        }
      });
      grid.appendChild(b);
    });
    stage.appendChild(grid);
    return function () {};
  };

  // Grain sprouts around the field and waits until it is tapped. Nothing is timed.
  ACT["catch"] = function (opts, done) {
    var target = opts.target || 7, n = 0, finished = false;
    stage.appendChild(sprite(["P:yusufMan", 90, 80, 72, "bob", { expr: "happy" }]));
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
      w.addEventListener("click", function () {
        if (w.disabled || finished) return;
        w.disabled = true;
        n += 1;
        fx("coin", n);
        music.tension(0.15 + 0.75 * n / target);
        count.textContent = n + " / " + target;
        place(w, 88, 20);
        w.classList.add("fly");
        setTimeout(function () { w.remove(); }, 480);
        if (n >= target) { finished = true; music.tension(0); done(); }
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
    stage.appendChild(sprite(["P:yusufMan", 50, 30, 96, "bob", { expr: "happy" }]));
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
          fx("pour", level);
          fillEl.style.height = (level / taps * 100) + "%";
          if (level === taps) {
            b.classList.add("full");
            fx("coin", full + 1);
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

  // Search the bags one brother at a time. The verse has Yusuf search the other
  // bags first and his brother's last, so the cup is in the last bag on purpose
  // and the bags open in order.
  ACT.search = function (opts, done) {
    var owners = opts.owners, total = owners.length, opened = 0, bags = [];
    stage.appendChild(sprite(["P:yusufMan", 20, 28, 84, "bob", { expr: "calm" }]));
    var row = mk("div", "bag-row");

    function refresh() {
      bags.forEach(function (b, i) {
        b.classList.toggle("locked", i > opened);
        b.classList.toggle("next", i === opened && opened < total);
      });
    }
    owners.forEach(function (name, i) {
      var cell = mk("div", "bag-cell");
      var face = mk("span", "bag-face");
      face.innerHTML = People.svg(name, { expr: i === total - 1 ? "worried" : "neutral" });
      var b = mk("button", "bag locked");
      b.setAttribute("aria-label", "bag " + (i + 1) + " of " + total);
      b.innerHTML = SVG.SACK;
      b.addEventListener("click", function () {
        if (b.disabled) return;
        if (i !== opened) { shake(cell); buzz(); return; }
        b.disabled = true;
        opened += 1;
        refresh();
        if (opened === total) {
          b.classList.add("found");
          fx("clink");
          music.tension(0);
          var cup = mk("span", "bag-cup");
          cup.innerHTML = SVG.CUP;
          b.appendChild(cup);
          done();
        } else {
          b.classList.add("empty");
          fx("tick", opened);
          music.tension(0.9 * opened / total);
          say(opts.nope);
        }
      });
      cell.appendChild(face);
      cell.appendChild(b);
      row.appendChild(cell);
      bags.push(b);
    });
    refresh();
    stage.appendChild(row);
    return function () {};
  };

  /* ---------- flow ---------- */
  function teardown() {
    stepToken += 1;
    clearTimeout(skipTimer);
    music.tension(0);
    if (cleanup) { cleanup(); cleanup = null; }
  }

  function show(view) {
    ["title", "play", "chapters", "end"].forEach(function (v) { $(v).hidden = v !== view; });
    if (view !== "play") { teardown(); stopVoice(); }
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
    stage.dataset.mode = st.say ? "story" : "play";
    stage.style.touchAction = st.say ? "pan-y" : "none";
    stage.innerHTML = "";

    if (pnoteFor !== ch.id) {
      pnoteFor = ch.id;
      var body = $("pnoteBody");
      body.innerHTML = "";
      (ch.parent || []).forEach(function (para) { body.appendChild(mk("p", "", para)); });
      var more = mk("a", "pnote-link", "Read these verses on Quran.com");
      more.href = "https://quran.com/" + ch.source;
      more.target = "_blank";
      more.rel = "noopener";
      body.appendChild(more);
      $("pnote").open = false;
    }

    var lineId = st.say || st.line;
    setCaption(lineId);
    music.mood(moodFor(st));
    if (si === 0) fx("swish");

    setNext("Next", false);
    nextBtn.classList.remove("ready");
    if (st.say) {
      drawArt(stage, st.art);
      nextBtn.hidden = false;
    } else {
      nextBtn.hidden = true;
      cleanup = ACT[st.play](st.opts || {}, function () {
        if (token !== stepToken) return;
        fanfare();
        burst();
        clearTimeout(skipTimer);
        setNext("Next", false);
        nextBtn.classList.add("ready");
        nextBtn.hidden = false;
      });
      skipTimer = setTimeout(function () {
        if (token === stepToken && nextBtn.hidden) {
          setNext("Skip", true);
          nextBtn.hidden = false;
        }
      }, 9000);
    }

    say(lineId);
    save.at = ci;
    save.step = si;
    persist();
  }

  function next() {
    fx("tap", 6);
    var ch = story[ci];
    si += 1;
    if (si >= ch.steps.length) {
      save.done[ch.id] = true;
      si = 0;
      ci += 1;
      if (ci >= story.length) {
        ci = 0;
        save.at = 0;
        save.step = 0;
        persist();
        showEnd();
        return;
      }
    }
    renderStep();
  }

  function prev() {
    fx("boing", 2);
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

  function startChapter(i, stepIdx) {
    ci = Math.max(0, Math.min(i, story.length - 1));
    si = Math.max(0, Math.min(stepIdx || 0, story[ci].steps.length - 1));
    show("play");
    renderStep();
  }

  function hasProgress() { return (save.at > 0 || save.step > 0) && save.at < story.length; }

  function showTitle() {
    var resume = hasProgress();
    $("startBtn").textContent = resume ? "Continue — Chapter " + (save.at + 1) : "Start the story";
    $("restartBtn").hidden = !resume;
    music.mood("wonder");
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
    music.mood("wonder");
    show("chapters");
  }

  function showEnd() {
    music.mood("joy");
    show("end");
    $("endText").textContent = lines["end-a"] || "";
    fanfare();
    say("end-a");
  }

  function paintToggles() {
    var s = $("soundBtn");
    s.textContent = save.sound ? "🔊" : "🔇";
    s.setAttribute("aria-label", save.sound ? "Voice and effects are on" : "Voice and effects are off");
    var m = $("musicBtn");
    m.classList.toggle("off", !save.music);
    m.setAttribute("aria-label", save.music ? "Music is on" : "Music is off");
    m.setAttribute("aria-pressed", String(save.music));
  }

  function buildTitleSky() {
    var sky = $("titleSky");
    drawArt(sky, [["RING", 50, 52, 1]]);
    sky.appendChild(sprite(["P:yusuf", 50, 54, 84, "bob", { expr: "happy" }]));
    $("endFig").innerHTML = People.svg("yusufMan", { expr: "happy" });
  }

  function wire() {
    ["click", "touchend", "keydown"].forEach(function (ev) { document.addEventListener(ev, music.unlock, true); });

    $("startBtn").addEventListener("click", function () { if (hasProgress()) startChapter(save.at, save.step); else startChapter(0); });
    $("restartBtn").addEventListener("click", function () { startChapter(0); });
    $("mapBtn").addEventListener("click", showChapters);
    $("soundBtn").addEventListener("click", function () {
      save.sound = !save.sound;
      persist();
      music.setSfx(save.sound);
      paintToggles();
      if (!save.sound) stopVoice();
    });
    $("musicBtn").addEventListener("click", function () {
      save.music = !save.music;
      persist();
      music.setMusic(save.music);
      paintToggles();
    });
    $("caption").addEventListener("click", function () { if (currentLine) say(currentLine); });
    nextBtn.addEventListener("click", next);
    prevBtn.addEventListener("click", prev);
    $("againBtn").addEventListener("click", function () { startChapter(0); });
    $("endChaptersBtn").addEventListener("click", showChapters);

    // touching the scene: sprites wiggle and giggle, empty sky sparkles
    var swipe = null;
    stage.addEventListener("pointerdown", function (e) {
      swipe = { x: e.clientX, y: e.clientY, t: Date.now() };
      var t = e.target.closest ? e.target.closest(".touchy") : null;
      if (t && stage.contains(t)) react(t, e);
    });
    stage.addEventListener("click", function (e) {
      if (stage.dataset.mode !== "story") return;
      if (e.target.closest && (e.target.closest(".touchy") || e.target.closest("button"))) return;
      pop(e);
      fx("tap", Math.floor(Math.random() * 5));
    });
    // swipe the scene to turn the page
    stage.addEventListener("pointerup", function (e) {
      if (!swipe) return;
      var dx = e.clientX - swipe.x, dy = e.clientY - swipe.y, dt = Date.now() - swipe.t;
      swipe = null;
      if (Math.abs(dx) < 60 || Math.abs(dy) > 70 || dt > 700) return;
      if (stage.dataset.mode !== "story") return;
      if (dx < 0) next(); else prev();
    });
  }

  fetch("narration.json")
    .then(function (r) { return r.json(); })
    .then(function (list) {
      list.forEach(function (l) { lines[l.id] = l.text; });
      music.setMusic(save.music);
      music.setSfx(save.sound);
      buildTitleSky();
      paintToggles();
      wire();
      showTitle();
    })
    .catch(function () {
      $("title").innerHTML = "<p>Couldn’t load the story. If you opened this as a file, serve the folder over http instead.</p>";
    });
})();
