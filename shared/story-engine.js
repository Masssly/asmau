(function () {
  "use strict";

  /*
    The story player, shared by every story game. A game's page loads its own
    data first, as globals, then this file:
      STORY_GAME    { slug, heroChild, heroAdult, groups }   (game.js)
      STORY         chapters and steps                        (story.js)
      STORY_MOODS   music mood per line                       (story.js)
      STORY_ART     which pictures exist                      (art.js)
      STORY_PEOPLE  the cast                                  (people.js)
    Everything here is about HOW a story is played; nothing here is about
    which story it is.
  */
  var CFG = window.STORY_GAME || {};
  var GAME = CFG.slug;
  var SAVE_KEY = "asmau-" + GAME;
  var HERO = CFG.heroChild, HERO_GROWN = CFG.heroAdult || CFG.heroChild;
  var story = window.STORY;
  var moods = window.STORY_MOODS || {};
  var music = window.AsmauMusic;
  var People = window.STORY_PEOPLE;
  var ART = window.STORY_ART || {};   // which pictures exist (art.js)
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

  // What a scene sounds and moves like unless a step says otherwise. A game can replace any
  // of these in game.js (sceneMood, sceneAmb, sceneFx), which is how each story gets its own feel.
  var SCENE_MOOD = merge({ night: "wonder", dusk: "sad", desert: "desert", well: "tense", egypt: "regal", palace: "regal", prison: "sad", field: "joy", grey: "sad", dawn: "joy" }, CFG.sceneMood);
  // the sounds of the place, under the music: see amb() in music.js
  var SCENE_AMB = merge({ night: "night", dusk: "night", desert: "wind", well: "wind", egypt: "crowd", field: "birds", grey: "wind", dawn: "birds",
    river: "river", city: "crowd", fire: "fire", mountain: "wind", sea: "sea", camp: "camp", storm: "rain" }, CFG.sceneAmb);
  // something always moving in the scene: see .fxl in story.css
  var SCENE_FX = merge({ night: "stars", desert: "dust", river: "water", sea: "water", fire: "embers", storm: "rain", mountain: "mist", camp: "embers", dawn: "rays" }, CFG.sceneFx);
  // what is drawn behind a narrated step that has no picture
  var SCENE_DECOR = {
    night: [["🌙", 82, 16, 44, "float"], ["⭐", 16, 20, 22, "twinkle"], ["⭐", 40, 10, 18, "twinkle"], ["⭐", 62, 22, 20, "twinkle"]],
    dusk: [["⭐", 20, 14, 18, "twinkle"], ["🌴", 12, 62, 70], ["🌴", 90, 66, 60]],
    desert: [["☀️", 84, 16, 46, "float"], ["🌵", 10, 70, 46], ["🐪", 88, 74, 44]],
    well: [["☀️", 84, 14, 40, "float"], ["🌳", 12, 58, 80], ["🐑", 86, 80, 36], ["🐑", 72, 86, 30]],
    egypt: [["☀️", 84, 14, 44, "float"], ["🌴", 8, 62, 64], ["🏛️", 90, 64, 64]],
    palace: [["🏛️", 14, 34, 70], ["🏛️", 86, 34, 70]],
    field: [["☀️", 84, 14, 40, "float"], ["🌳", 10, 58, 76], ["🐑", 88, 80, 34]],
    grey: [["☁️", 22, 18, 50, "float"], ["☁️", 76, 14, 44, "float"]],
    dawn: [["🌅", 50, 22, 70, "float"], ["🕊️", 22, 26, 30, "float"], ["🕊️", 78, 20, 26, "float"]],
    river: [["🌴", 8, 44, 70], ["🌴", 92, 48, 60], ["🌾", 18, 84, 40], ["🌾", 84, 86, 40]],
    city: [["🏠", 12, 60, 60], ["🏠", 88, 62, 56], ["🌴", 50, 30, 40]],
    fire: [["⭐", 16, 14, 18, "twinkle"], ["⭐", 80, 12, 20, "twinkle"], ["⛰️", 12, 60, 70], ["⛰️", 90, 62, 64]],
    mountain: [["⛰️", 16, 62, 90], ["⛰️", 84, 66, 80], ["☁️", 50, 16, 44, "float"]],
    sea: [["🌊", 14, 82, 50, "bob"], ["🌊", 50, 88, 50, "bob"], ["🌊", 86, 82, 50, "bob"], ["☁️", 24, 14, 40, "float"]],
    camp: [["⛺", 12, 66, 62], ["⛺", 88, 68, 56], ["☀️", 84, 14, 36, "float"]],
    storm: [["🌧️", 24, 16, 54, "float"], ["⛈️", 74, 14, 58, "float"], ["🏠", 14, 76, 48], ["🏠", 86, 78, 44]]
  };
  var GROUPS = CFG.groups || {};

  /* ---------- drawn pieces ---------- */
  var SVG = {
    WELL: '<svg viewBox="0 0 120 120"><rect x="22" y="70" width="76" height="40" rx="6" fill="#9a8f84" stroke="#5e554d" stroke-width="3"/><path d="M22 84h76M22 97h76M45 70v14M72 70v14M33 84v13M60 84v13M86 84v13M45 97v13M72 97v13" stroke="#5e554d" stroke-width="2"/><ellipse cx="60" cy="70" rx="38" ry="9" fill="#2a2420" stroke="#5e554d" stroke-width="3"/><path d="M28 70V28M92 70V28" stroke="#7a4a2b" stroke-width="6" stroke-linecap="round"/><path d="M18 30 60 8l42 22Z" fill="#a8603a" stroke="#6b3a1e" stroke-width="3" stroke-linejoin="round"/><path d="M60 30v30" stroke="#c9a15a" stroke-width="3"/></svg>',
    BUCKET: '<svg viewBox="0 0 60 60"><path d="M10 22h40l-6 32H16Z" fill="#a8703a" stroke="#6b4423" stroke-width="3" stroke-linejoin="round"/><path d="M10 22Q30-4 50 22" fill="none" stroke="#6b4423" stroke-width="3"/><path d="M13 34h34" stroke="#6b4423" stroke-width="3"/></svg>',
    SACK: '<svg viewBox="0 0 60 70"><path d="M14 22C4 40 6 62 30 64c24-2 26-24 16-42Z" fill="#c9a26a" stroke="#7a5a30" stroke-width="3"/><path d="M16 22c6-8 22-8 28 0" fill="#b08a50" stroke="#7a5a30" stroke-width="3"/><path d="M20 18 14 6M40 18l6-12M30 16V5" stroke="#7a5a30" stroke-width="3" stroke-linecap="round"/></svg>',
    CUP: '<svg viewBox="0 0 60 70"><path d="M12 8h36c0 22-8 32-18 32S12 30 12 8Z" fill="#f0b84b" stroke="#a87412" stroke-width="3" stroke-linejoin="round"/><path d="M30 40v16M18 60h24" stroke="#a87412" stroke-width="5" stroke-linecap="round"/><circle cx="30" cy="20" r="4" fill="#fff3c4"/></svg>',
    STORE: '<svg viewBox="0 0 80 90"><path d="M10 86V44c0-28 60-28 60 0v42Z" fill="#d9b06a" stroke="#8a6230" stroke-width="3"/><rect x="32" y="60" width="16" height="26" rx="8" fill="#6b4423"/><rect x="34" y="28" width="12" height="10" rx="2" fill="#6b4423"/></svg>',
    STAFF: '<svg viewBox="0 0 40 100"><path d="M22 96 19 30C18 16 8 14 9 6c1-6 12-5 13 2" fill="none" stroke="#5e3a1c" stroke-width="7" stroke-linecap="round"/><path d="M22 96 19 30C18 16 8 14 9 6c1-6 12-5 13 2" fill="none" stroke="#a8743e" stroke-width="3.5" stroke-linecap="round"/><path d="M20 52h2M20 70h2" stroke="#5e3a1c" stroke-width="3" stroke-linecap="round"/></svg>',
    ROCK: '<svg viewBox="0 0 80 64"><path d="M8 54C2 40 8 22 22 14c12-8 30-8 42 2 12 10 12 26 8 38Z" fill="#9c958c" stroke="#5f5850" stroke-width="3" stroke-linejoin="round"/><path d="M22 28c6-8 14-10 22-9M48 40c6 0 10-3 13-8" fill="none" stroke="#c9c2b8" stroke-width="3" stroke-linecap="round"/><path d="M26 46c4 2 8 2 12 0" fill="none" stroke="#5f5850" stroke-width="2.5" stroke-linecap="round"/></svg>',
    ROPE: '<svg viewBox="0 0 80 60"><path d="M6 44c10-22 18 14 28-8s16 14 26-10 12 4 14 8" fill="none" stroke="#8a6230" stroke-width="8" stroke-linecap="round"/><path d="M6 44c10-22 18 14 28-8s16 14 26-10 12 4 14 8" fill="none" stroke="#d9b06a" stroke-width="4" stroke-linecap="round" stroke-dasharray="5 5"/></svg>',
    CHEST: '<svg viewBox="0 0 90 64"><path d="M8 26h74l-8 30H16Z" fill="#b5793e" stroke="#6b4423" stroke-width="3" stroke-linejoin="round"/><path d="M8 26c8-16 66-16 74 0" fill="#f6ead0" stroke="#6b4423" stroke-width="3"/><path d="M20 26v30M36 26v30M54 26v30M70 26v30" stroke="#6b4423" stroke-width="2" opacity=".55"/><path d="M12 40h66" stroke="#6b4423" stroke-width="2.5"/></svg>',
    PLANK: '<svg viewBox="0 0 80 40" preserveAspectRatio="none"><rect x="4" y="6" width="72" height="28" rx="5" fill="#b5793e" stroke="#6b4423" stroke-width="3"/><path d="M14 16h30M30 25h34" stroke="#8a5a2c" stroke-width="2.5" stroke-linecap="round"/><circle cx="12" cy="20" r="2.2" fill="#6b4423"/><circle cx="68" cy="20" r="2.2" fill="#6b4423"/></svg>',
    LAMP: '<svg viewBox="0 0 60 80"><path d="M22 10h16M30 4v6" stroke="#8a6230" stroke-width="4" stroke-linecap="round"/><path d="M16 22 22 10h16l6 12Z" fill="#b8862f" stroke="#7a5518" stroke-width="2"/><rect class="lamp-glass" x="16" y="22" width="28" height="38" rx="4" fill="#3a3550" stroke="#7a5518" stroke-width="3"/><path d="M14 60h32l-4 12H18Z" fill="#b8862f" stroke="#7a5518" stroke-width="2"/><path class="lamp-flame" d="M30 54c-8-8-2-14 0-22 2 8 8 14 0 22Z" fill="#ffd45e" opacity=".15"/></svg>'
  };

  /* ---------- saved progress ---------- */
  // Where the child got to is saved by NAME (a chapter's id, the step's line, and which time
  // that line occurs in the chapter), so adding, removing or reordering steps later never
  // sends anyone to the wrong place. An older save made of plain numbers is still understood.
  function loadSave() {
    try {
      var s = JSON.parse(localStorage.getItem(SAVE_KEY) || "{}");
      return { done: s.done || {}, chapter: s.chapter || null, line: s.line || null, nth: s.nth || 0, at: s.at || 0, step: s.step || 0, music: s.music !== false,
        // the voice and the sounds have their own switches now; an older save had one for both
        voice: s.voice !== undefined ? s.voice !== false : s.sound !== false,
        sfx: s.sfx !== undefined ? s.sfx !== false : s.sound !== false };
    } catch (err) {
      return { done: {}, chapter: null, line: null, nth: 0, at: 0, step: 0, voice: true, sfx: true, music: true };
    }
  }
  function stepLine(st) { return st.say || st.line; }
  // Where a saved position points in today's story: { ci, si }, or null when there is none.
  function resumeAt() {
    var c = -1, s = 0;
    if (save.chapter) {
      story.forEach(function (ch, i) { if (ch.id === save.chapter) c = i; });
      if (c < 0) return null;                                    // that chapter no longer exists
      var seen = -1, first = -1;
      story[c].steps.forEach(function (st, i) {
        if (stepLine(st) !== save.line) return;
        seen += 1;
        if (first < 0) first = i;
        if (seen === save.nth) s = i;
      });
      if (first >= 0 && seen < save.nth) s = first;
      else if (first < 0) s = 0;                                  // the step is gone: start of its chapter
    } else if (save.at > 0 || save.step > 0) {
      c = Math.min(save.at, story.length - 1);
      s = Math.min(save.step, story[c].steps.length - 1);
    } else return null;
    return (c > 0 || s > 0) ? { ci: c, si: s } : null;
  }
  function rememberPlace() {
    var st = story[ci].steps[si], line = stepLine(st), nth = 0;
    for (var i = 0; i < si; i++) if (stepLine(story[ci].steps[i]) === line) nth += 1;
    save.chapter = story[ci].id; save.line = line; save.nth = nth; save.at = 0; save.step = 0;
  }
  function persist() {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); } catch (err) { /* private mode — play on without saving */ }
  }

  /* ---------- sound, music and buzz ---------- */
  var VIB = { tap: 8, boing: 10, wrong: 30, win: [20, 40, 20], heave: 12, coin: 8, tick: 12, clink: 25, pour: 6 };
  function vib(pattern) {
    if (!save.sfx) return;
    try { if (navigator.vibrate) navigator.vibrate(pattern); } catch (err) { /* not supported */ }
  }
  function fx(name, a, b) {
    music.fx(name, a, b);
    if (VIB[name]) vib(VIB[name]);
  }
  function blip(i) { fx("tap", i || 0); }
  function buzz() { fx("wrong"); }
  function fanfare() { fx("win"); }

  var currentSpoken = Promise.resolve();
  // Run fn once the step's own line has been read (or at once if it was cut off). Used by
  // activities that read their choices aloud after the question.
  function afterQuestion(fn) {
    var token = stepToken;
    Promise.resolve().then(function () { return currentSpoken; }).then(function () { if (token === stepToken) fn(); });
  }

  var sayToken = 0;
  function stopVoice() {
    sayToken += 1;
    window.AsmauNarration.stop();
    music.duck(false);
  }
  function say(id) {
    if (!save.voice) { stopVoice(); return Promise.resolve(); }
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
  function merge(a, b) { var o = {}, k; for (k in a) o[k] = a[k]; for (k in (b || {})) o[k] = b[k]; return o; }

  // An icon is an emoji, or the name of a drawn piece (STAFF, ROCK, CHEST ...): older tablets
  // have no emoji for those, so they are drawn.
  function ico(n, icon) {
    if (SVG[icon]) { n.innerHTML = SVG[icon]; n.classList.add("ico-svg"); }
    else { n.textContent = icon; n.classList.remove("ico-svg"); }
    return n;
  }
  function mkIco(tag, cls, icon) { return ico(mk(tag, cls), icon); }

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

  // A full picture for a step. If the file cannot be loaded the step falls
  // back to its drawn sprites, so a missing picture never leaves a blank scene.
  // The whole picture is always shown; on a wide stage a blurred copy of it
  // fills the space at the sides.
  function picture(id, fallback) {
    var src = "assets/img/" + id + ".webp";
    var fill = mk("img", "pic-fill");
    fill.alt = "";
    fill.setAttribute("aria-hidden", "true");
    fill.draggable = false;
    var img = mk("img", "pic");
    img.draggable = false;
    img.style.opacity = "0";
    stage.classList.add("pic-loading");
    img.addEventListener("load", function () {
      img.alt = ART[id] || "";
      img.style.opacity = "";
      stage.classList.remove("pic-loading");
    });
    img.addEventListener("error", function () {
      if (!img.parentNode) return;
      img.remove();
      fill.remove();
      stage.classList.remove("has-pic", "pic-loading");
      if (fallback) fallback();
    });
    fill.src = src;
    img.src = src;
    var both = document.createDocumentFragment();
    both.appendChild(fill);
    both.appendChild(img);
    return both;
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
    var hero = sprite(["P:" + (gather ? HERO_GROWN : HERO), 50, 52, 86, "bob", { expr: "happy" }]);
    stage.appendChild(hero);
    var chip = mk("div", "count-chip", "0 / 13");
    var bodies = [];
    stage.appendChild(chip);
    var n = 0;
    skyKinds().forEach(function (k, i) {
      var ang = (i / 13) * Math.PI * 2 - Math.PI / 2;
      var b = mk("button", "body" + (k === "⭐" ? "" : " big"), k);
      b.setAttribute("aria-label", k === "⭐" ? "star" : (k === "☀️" ? "sun" : "moon"));
      place(b, 50 + 40 * Math.cos(ang), 50 + 38 * Math.sin(ang));
      // the bow: each one leans in towards the boy in the middle, dips low, and stays bowed
      b.style.setProperty("--dx", (-Math.cos(ang) * 34) + "px");
      b.style.setProperty("--dy", (-Math.sin(ang) * 30) + "px");
      b.style.setProperty("--tilt", ((ang + Math.PI / 2) * 180 / Math.PI) + "deg");
      bodies.push(b);
      b.addEventListener("click", function () {
        if (b.disabled) return;
        b.disabled = true;
        n += 1;
        blip(n);
        if (gather) {
          place(b, 50 + 22 * Math.cos(ang), 50 + 25 * Math.sin(ang));
          b.classList.add("home");
        } else {
          b.classList.add("bowing");
          fx("whoosh", n);
          setTimeout(function () { b.classList.remove("bowing"); b.classList.add("bowed"); }, 900);
        }
        chip.textContent = n + " / 13";
        if (n === 13) {
          // all thirteen bow together once more, one after another round the circle
          setTimeout(function () {
            bodies.forEach(function (x, j) {
              x.style.animationDelay = (j * 0.07) + "s";
              x.classList.add("bow-all");
            });
            hero.classList.add("honoured");
            fx("sparkle");
          }, gather ? 300 : 950);
          setTimeout(done, gather ? 900 : 2100);
        }
      });
      stage.appendChild(b);
    });
    return function () {};
  };

  // One question, two answers.
  // Speech can fail in odd ways (a blocked sound, no voice installed). Nothing a child is
  // waiting for may depend on a line finishing, so waiting for one is capped.
  function spoken(line, maxMs) {
    return Promise.race([say(line), new Promise(function (r) { setTimeout(r, maxMs || 2500); })]);
  }

  // A wrong answer: say why, then put the question back on the screen.
  function sayWrong(wrongLine, questionLine, token) {
    setCaption(wrongLine);
    return spoken(wrongLine, 6000).then(function () { if (token === stepToken) setCaption(questionLine); });
  }

  // After the question has been read, read each of the things to choose from, one by one,
  // lighting each as it is spoken, so a child who cannot read can still choose. Tapping
  // anything stops the reading.
  function readAloud(token, items) {
    var stopped = false;
    function run(i) {
      if (stopped || token !== stepToken || i >= items.length) return Promise.resolve();
      items[i].el.classList.add("reading");
      return say(items[i].line).then(function () {
        items[i].el.classList.remove("reading");
        return run(i + 1);
      });
    }
    afterQuestion(function () { run(0); });
    return function () { stopped = true; items.forEach(function (it) { it.el.classList.remove("reading"); }); };
  }

  ACT.choice = function (opts, done) {
    var token = stepToken, question = opts._line, finished = false, reading = [], stopReading = function () {};
    drawArt(stage, opts.art);
    var box = mk("div", "choices");
    opts.options.forEach(function (o, i) {
      var b = mk("button", "choice");
      var line = question + "-opt" + (i + 1);
      b.appendChild(mkIco("span", "choice-ico", o.icon));
      b.appendChild(mk("span", "", o.label));
      b.appendChild(mk("span", "choice-ear", "🔊"));
      b.addEventListener("click", function () {
        if (finished) return;
        stopReading();
        if (o.ok) {
          finished = true;
          Array.prototype.forEach.call(box.children, function (x) { x.disabled = true; });
          b.classList.add("right");
          spoken(line).then(function () { if (token === stepToken) done(); });
        } else {
          shake(b);
          buzz();
          spoken(line).then(function () { if (token === stepToken && !finished) return sayWrong(opts.wrong, question, token); });
        }
      });
      box.appendChild(b);
      reading.push({ el: b, line: line });
    });
    stage.appendChild(box);
    stopReading = readAloud(token, reading);
    return function () { finished = true; stopReading(); };
  };

  // Haul the bucket up the well. Drag the rope upward, or tap; it slips back a little if you stop.
  ACT.pull = function (opts, done) {
    var p = 0, finished = false, dragged = false, down = false, startY = 0;
    var shaft = mk("div", "shaft");
    var lift = mk("div", "lift");
    // by default the hero is hauled up in a bucket; opts.icon lifts some other thing instead
    lift.innerHTML = '<div class="rope"></div><div class="lift-face"></div>' + (opts.icon ? '<span class="lift-thing"></span>' : SVG.BUCKET);
    if (opts.icon) ico(lift.querySelector(".lift-thing"), opts.icon);
    var face = lift.querySelector(".lift-face");
    function setFace(expr) { if (!opts.icon) face.innerHTML = People.svg(HERO, { expr: expr }); }
    setFace("scared");
    shaft.appendChild(lift);
    stage.appendChild(shaft);
    stage.appendChild(mk("div", "shaft-rim"));
    var btn = mk("button", "btn btn-teal pull-btn", opts.label || "Pull!");
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
    var from = mkIco("div", "marker", opts.from); place(from, 9, 62); stage.appendChild(from);
    var to = mkIco("div", "marker", opts.to); place(to, 91, 62); stage.appendChild(to);

    var mover = mk("button", "mover fresh");
    mover.setAttribute("aria-label", "Drag or tap to move forward");
    mover.appendChild(mkIco("span", opts.flip ? "flip" : "", opts.icon));
    if (opts.rider) {
      var rider = mk("span", "rider");
      rider.innerHTML = People.svg(HERO, { expr: "happy" });
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
    btn.innerHTML = '<svg class="ring" viewBox="0 0 120 120"><circle class="ring-bg" cx="60" cy="60" r="54"/><circle class="ring-fg" cx="60" cy="60" r="54"/></svg><span class="lamp-wrap">' + (opts.icon ? '<span class="hold-ico lamp-flame"></span>' : SVG.LAMP) + "</span>";
    if (opts.icon) ico(btn.querySelector(".hold-ico"), opts.icon);
    stage.appendChild(btn);
    var hint = mk("div", "hold-hint", opts.hint || "Press and hold");
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
      p = holding ? Math.min(1, p + dt / need) : Math.max(0, p - dt / 2600);
      paint();
      music.tension(p * 0.95);
      if (p >= 1) {
        finished = true;
        btn.classList.add("lit");
        hint.textContent = opts.done || "It shines!";
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
    // the finger is "captured" by the lamp, so sliding a little off it does not let go
    btn.addEventListener("pointerdown", function (e) { try { btn.setPointerCapture(e.pointerId); } catch (err) { /* optional */ } down(e); });
    ["pointerup", "pointercancel", "lostpointercapture"].forEach(function (ev) { btn.addEventListener(ev, up); });
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
      b.appendChild(mkIco("span", "mcard-ico", icon));
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
      b.appendChild(mkIco("span", "ocard-ico", c.icon));
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
          sayWrong(opts.wrong, opts._line, stepToken);
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
    if (!opts.icon) stage.appendChild(sprite(["P:" + HERO_GROWN, 90, 80, 72, "bob", { expr: "happy" }]));
    var store = mk("div", "store-box");
    if (opts.into) store.appendChild(mkIco("span", "store-ico", opts.into)); else store.innerHTML = SVG.STORE;
    var count = mk("div", "store-count", "0 / " + target);
    store.appendChild(count);
    stage.appendChild(store);

    function spawn() {
      if (finished || stage.querySelectorAll(".wheat").length >= 3) return;
      var w = mkIco("button", "wheat", opts.icon || "🌾");
      w.setAttribute("aria-label", opts.icon ? "tap me" : "grain");
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

  function shuffled(list) {
    var a = list.slice(), i, j, t;
    for (i = a.length - 1; i > 0; i--) { j = Math.floor(Math.random() * (i + 1)); t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }

  // A picture cut into squares and mixed up: tap two pieces to swap them.
  ACT.puzzle = function (opts, done) {
    var n = opts.n || 3, total = n * n;
    if (!ART[opts.pic]) { done(); return function () {}; }
    var order;
    do { order = shuffled(Array.apply(null, { length: total }).map(function (_, i) { return i; })); }
    while (order.some(function (v, i) { return v === i; }));
    var board = mk("div", "puzzle");
    // sized from the stage, and again whenever the screen turns or resizes
    function layout() {
      var side = Math.max(200, Math.min(stage.clientWidth, stage.clientHeight) - 16);
      board.style.width = board.style.height = side + "px";
    }
    layout();
    window.addEventListener("resize", layout);
    board.style.gridTemplateColumns = "repeat(" + n + ", 1fr)";
    var picked = -1, solved = false, tiles = [];
    function paint() {
      tiles.forEach(function (t, i) {
        var piece = order[i];
        t.style.backgroundPosition = ((piece % n) / (n - 1) * 100) + "% " + (Math.floor(piece / n) / (n - 1) * 100) + "%";
        t.classList.toggle("ok", piece === i);
        t.classList.toggle("picked", i === picked);
      });
    }
    for (var i = 0; i < total; i++) {
      (function (i) {
        var t = mk("button", "ptile");
        t.setAttribute("aria-label", "piece " + (i + 1) + " of " + total);
        t.style.backgroundImage = "url(assets/img/" + opts.pic + ".webp)";
        t.style.backgroundSize = (n * 100) + "% " + (n * 100) + "%";
        t.addEventListener("click", function () {
          if (solved) return;
          if (picked < 0) { picked = i; blip(1); paint(); return; }
          if (picked !== i) { var a = order[picked]; order[picked] = order[i]; order[i] = a; fx("swish"); }
          picked = -1;
          paint();
          if (order.every(function (v, k) { return v === k; })) { solved = true; board.classList.add("whole"); done(); }
        });
        tiles.push(t);
        board.appendChild(t);
      })(i);
    }
    paint();
    stage.appendChild(board);
    // hold to peek at the finished picture
    var peek = mk("button", "peek-btn", "👁 Peek");
    peek.setAttribute("aria-label", "Hold to see the whole picture");
    var full = mk("div", "peek-full");
    full.style.backgroundImage = "url(assets/img/" + opts.pic + ".webp)";
    function showFull(on) { full.classList.toggle("on", on); }
    peek.addEventListener("pointerdown", function (e) { try { peek.setPointerCapture(e.pointerId); } catch (err) { /* optional */ } showFull(true); });
    ["pointerup", "pointercancel", "lostpointercapture"].forEach(function (ev) { peek.addEventListener(ev, function () { showFull(false); }); });
    stage.appendChild(full);
    stage.appendChild(peek);
    return function () { window.removeEventListener("resize", layout); };
  };

  // Find the pairs. A wrong pair turns back over; nothing is timed.
  ACT.memory = function (opts, done) {
    var icons = opts.icons, deck = shuffled(icons.concat(icons)), open = [], found = 0, busy = false;
    var grid = mk("div", "mem-grid");
    deck.forEach(function (icon) {
      var c = mk("button", "mem");
      c.setAttribute("aria-label", "card");
      c.appendChild(mkIco("span", "mem-face", icon));
      c.dataset.icon = icon;
      c.addEventListener("click", function () {
        if (busy || c.classList.contains("up")) return;
        c.classList.add("up");
        blip(open.length + 2);
        open.push({ el: c, icon: icon });
        if (open.length < 2) return;
        if (open[0].icon === open[1].icon) {
          open.forEach(function (o) { o.el.classList.add("found"); });
          open = [];
          found += 1;
          fx("coin", found);
          if (found === icons.length) done();
        } else {
          busy = true;
          setTimeout(function () {
            open.forEach(function (o) { o.el.classList.remove("up"); });
            open = [];
            busy = false;
          }, 650);
        }
      });
      grid.appendChild(c);
    });
    stage.appendChild(grid);
    return function () {};
  };

  // Tap every one of the right things; the others shake their heads.
  // opts.items: [{ icon, n, ok, cls }]; opts.mark is shown on each one found.
  ACT.pick = function (opts, done) {
    var all = [], need = 0, got = 0;
    opts.items.forEach(function (it) {
      for (var i = 0; i < it.n; i++) all.push(it);
      if (it.ok) need += it.n;
    });
    var chip = mk("div", "count-chip", "0 / " + need);
    stage.appendChild(chip);
    var field = mk("div", "pick-field");
    shuffled(all).forEach(function (it) {
      var b = mk("button", "pick" + (it.cls ? " " + it.cls : ""));
      b.setAttribute("aria-label", it.name || "item");
      if (SVG[it.icon]) b.innerHTML = SVG[it.icon]; else b.textContent = it.icon;
      b.addEventListener("click", function () {
        if (b.disabled) return;
        if (!it.ok) { shake(b); buzz(); return; }
        b.disabled = true;
        b.classList.add("got");
        if (opts.mark) b.appendChild(mk("span", "pick-mark", opts.mark));
        got += 1;
        fx("coin", got);
        chip.textContent = got + " / " + need;
        if (got === need) done();
      });
      field.appendChild(b);
    });
    stage.appendChild(field);
    return function () {};
  };

  // One thing at a time: which of the two does it belong to?
  ACT.sort = function (opts, done) {
    var things = opts.things, at = 0, token = stepToken, question = opts._line, finished = false;
    function thingLine(i) { return question + "-it" + (i + 1); }
    var chip = mk("div", "count-chip", "0 / " + things.length);
    stage.appendChild(chip);
    var card = mk("div", "sort-card");
    var icoEl = mk("span", "sort-ico"), lab = mk("span", "sort-lab");
    card.appendChild(icoEl);
    card.appendChild(lab);
    stage.appendChild(card);
    var box = mk("div", "choices");
    function show(speak) {
      ico(icoEl, things[at].icon);
      lab.textContent = things[at].label;
      card.classList.remove("in"); void card.offsetWidth; card.classList.add("in");
      if (speak) say(thingLine(at));
    }
    card.addEventListener("click", function () { if (!finished && at < things.length) say(thingLine(at)); });
    opts.bins.forEach(function (bin, bi) {
      var b = mk("button", "choice");
      b.appendChild(mkIco("span", "choice-ico", bin.icon));
      b.appendChild(mk("span", "", bin.label));
      b.appendChild(mk("span", "choice-ear", "🔊"));
      b.addEventListener("click", function () {
        if (at >= things.length || finished) return;
        if (things[at].bin !== bi) {
          shake(card);
          buzz();
          spoken(question + "-bin" + (bi + 1)).then(function () { if (token === stepToken && opts.wrong) return sayWrong(opts.wrong, question, token); });
          return;
        }
        at += 1;
        fx("coin", at);
        chip.textContent = at + " / " + things.length;
        if (at === things.length) {
          card.classList.add("done");
          ico(icoEl, "✨");
          lab.textContent = "";
          Array.prototype.forEach.call(box.children, function (x) { x.disabled = true; });
          finished = true;
          done();
        } else {
          show(true);
        }
      });
      box.appendChild(b);
    });
    stage.appendChild(box);
    show(false);
    afterQuestion(function () { if (token === stepToken && !finished) say(thingLine(0)); });
    return function () { finished = true; };
  };

  // Count the coins: tap each one. Nothing is timed.
  ACT.count = function (opts, done) {
    var total = opts.total || 20, n = 0;
    var chip = mk("div", "count-chip", "0 / " + total);
    stage.appendChild(chip);
    var tray = mk("div", "coin-tray");
    for (var i = 0; i < total; i++) {
      (function () {
        var b = mk("button", "coin" + (opts.icon ? " thing" : ""));
        if (opts.icon) ico(b, opts.icon);
        b.setAttribute("aria-label", opts.icon ? "tap to count" : "silver coin");
        b.addEventListener("click", function () {
          if (b.disabled) return;
          b.disabled = true;
          n += 1;
          if (opts.got) { ico(b, opts.got); b.appendChild(mk("span", "coin-n", String(n))); }
          else if (opts.icon) b.appendChild(mk("span", "coin-n", String(n)));
          else b.textContent = String(n);
          b.classList.add("counted");
          fx("coin", n);
          chip.textContent = n + " / " + total;
          if (n === total) {
            if (opts.after) { setCaption(opts.after); say(opts.after); }
            done();
          }
        });
        tray.appendChild(b);
      })();
    }
    stage.appendChild(tray);
    return function () {};
  };

  // A different gate for each brother: tap an empty gate and the next brother
  // goes in by it. A gate that already has someone shakes its head.
  ACT.gates = function (opts, done) {
    var owners = opts.owners, total = owners.length, sent = 0;
    var wall = mk("div", "gate-row");
    var queue = mk("div", "gate-queue");
    var waiting = owners.map(function (name) {
      var f = mk("span", "gate-face");
      f.innerHTML = People.svg(name, { expr: "neutral" });
      queue.appendChild(f);
      return f;
    });
    function mark() {
      waiting.forEach(function (f, i) { f.classList.toggle("next", i === sent); });
    }
    owners.forEach(function (name, i) {
      var g = mk("button", "gate");
      g.setAttribute("aria-label", "gate " + (i + 1) + " of " + total);
      g.addEventListener("click", function () {
        if (sent >= total) return;
        if (g.classList.contains("taken")) { shake(g); buzz(); return; }
        g.classList.add("taken");
        var f = waiting[sent];
        f.classList.remove("next");
        g.appendChild(f);
        sent += 1;
        fx("whoosh", sent);
        mark();
        if (sent === total) done();
      });
      wall.appendChild(g);
    });
    mark();
    stage.appendChild(wall);
    stage.appendChild(queue);
    return function () {};
  };

  // Full measure: tap every sack up to the top.
  ACT.fill = function (opts, done) {
    var total = opts.sacks || 5, taps = opts.taps || 3, full = 0;
    stage.appendChild(sprite(["P:" + HERO_GROWN, 50, 30, 96, "bob", { expr: "happy" }]));
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
    stage.appendChild(sprite(["P:" + HERO_GROWN, 20, 28, 84, "bob", { expr: "calm" }]));
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

  // A thing that changes when it is tapped: a staff becomes a snake and a staff again.
  // opts.states: [{ icon, line, glow }]; the first is how it starts, each tap moves to the next.
  ACT.change = function (opts, done) {
    var states = opts.states, at = 0, token = stepToken, busy = false;
    var btn = mk("button", "chg-btn");
    var face = mk("span", "chg-face");
    btn.appendChild(face);
    btn.setAttribute("aria-label", "Tap to change it");
    function paint() { ico(face, states[at].icon); btn.classList.toggle("glow", !!states[at].glow); }
    btn.addEventListener("click", function () {
      if (busy || at >= states.length - 1) return;
      busy = true;
      at += 1;
      btn.classList.remove("poof"); void btn.offsetWidth; btn.classList.add("poof");
      fx(states[at].glow ? "sparkle" : "whoosh");
      burst();
      paint();
      var last = at === states.length - 1;
      // the new state says its line; a short pause keeps a flurry of taps from skipping a state
      if (states[at].line) { setCaption(states[at].line); say(states[at].line); }
      setTimeout(function () { busy = false; }, 1200);
      if (last) { btn.disabled = true; setTimeout(function () { if (token === stepToken) done(); }, 700); }
    });
    paint();
    stage.appendChild(btn);
    return function () {};
  };

  // Strike the sea: press and hold, and two walls of water draw apart to leave a dry path.
  ACT.part = function (opts, done) {
    var p = 0, holding = false, finished = false, last = 0, raf = 0, need = opts.ms || 3600;
    var sea = mk("div", "part-sea");
    var left = mk("div", "part-wall l"), right = mk("div", "part-wall r"), path = mk("div", "part-path");
    sea.appendChild(path); sea.appendChild(left); sea.appendChild(right);
    stage.appendChild(sea);
    var btn = mkIco("button", "part-btn", opts.icon || "STAFF");
    btn.setAttribute("aria-label", "Press and hold");
    stage.appendChild(btn);
    var hint = mk("div", "hold-hint", "Press and hold");
    stage.appendChild(hint);
    function paint() {
      left.style.transform = "translateX(" + (-p * 78) + "%)";
      right.style.transform = "translateX(" + (p * 78) + "%)";
      path.style.opacity = String(p);
    }
    function frame(t) {
      var dt = last ? t - last : 0;
      last = t;
      p = holding ? Math.min(1, p + dt / need) : Math.max(0, p - dt / 3000);
      paint();
      music.tension(p * 0.9);
      if (holding && Math.random() < 0.08) fx("pour", p * 3);
      if (p >= 1) {
        finished = true;
        hint.textContent = "The sea has opened!";
        btn.classList.add("lit");
        music.tension(0);
        fx("roar");
        done();
        return;
      }
      raf = requestAnimationFrame(frame);
    }
    function down(e) { if (e) e.preventDefault(); if (finished || holding) return; holding = true; hint.textContent = "Keep holding…"; fx("heave", 0.3); vib(40); }
    function up() { if (holding && !finished) hint.textContent = "Hold a little longer."; holding = false; }
    btn.addEventListener("pointerdown", function (e) { try { btn.setPointerCapture(e.pointerId); } catch (err) { /* optional */ } down(e); });
    ["pointerup", "pointercancel", "lostpointercapture"].forEach(function (ev) { btn.addEventListener(ev, up); });
    btn.addEventListener("keydown", function (e) { if (e.key === " " || e.key === "Enter") down(e); });
    btn.addEventListener("keyup", function (e) { if (e.key === " " || e.key === "Enter") up(); });
    btn.addEventListener("contextmenu", function (e) { e.preventDefault(); });
    paint();
    raf = requestAnimationFrame(frame);
    return function () { cancelAnimationFrame(raf); };
  };

  // A winding trail: one spot glows at a time; tap it and the walker moves there.
  // opts: n spots, icon for a spot, walker (who moves), round (the trail comes back on itself).
  ACT.trail = function (opts, done) {
    var n = opts.n || 7, at = 0, spots = [];
    var walker = mkIco("div", "trail-walker", opts.walker || "🚶");
    function pos(i) {
      var f = i / (n - 1);
      if (opts.round) { var a = f * Math.PI * 1.75 + Math.PI; return [50 + 34 * Math.cos(a), 54 + 30 * Math.sin(a)]; }
      return [10 + 80 * f, 58 + 24 * Math.sin(f * Math.PI * 2.2) * (i % 2 ? 1 : 0.6)];
    }
    for (var i = 0; i < n; i++) {
      (function (i) {
        var b = mkIco("button", "trail-spot", opts.icon || "👣");
        b.setAttribute("aria-label", "step " + (i + 1) + " of " + n);
        var xy = pos(i);
        place(b, xy[0], xy[1]);
        b.addEventListener("click", function () {
          if (i !== at) { if (i > at) { shake(b); } return; }
          b.classList.remove("next");
          b.classList.add("done");
          b.disabled = true;
          place(walker, xy[0], xy[1] - 12);
          walker.classList.remove("hop"); void walker.offsetWidth; walker.classList.add("hop");
          at += 1;
          blip(at);
          if (at < n) spots[at].classList.add("next"); else done();
        });
        spots.push(b);
        stage.appendChild(b);
      })(i);
    }
    var start = pos(0);
    place(walker, Math.max(4, start[0] - 6), start[1] - 12);
    stage.appendChild(walker);
    spots[0].classList.add("next");
    return function () {};
  };

  // Dark all around: the finger is a little light. Slide it about to find what is hidden, then tap it.
  ACT.seek = function (opts, done) {
    var found = false;
    var tx = 16 + Math.random() * 68, ty = 20 + Math.random() * 50;
    var target = mkIco("button", "seek-target", opts.icon || "🔥");
    target.setAttribute("aria-label", "the hidden thing");
    place(target, tx, ty);
    stage.appendChild(target);
    var dark = mk("div", "seek-dark");
    stage.appendChild(dark);
    function light(e) {
      var r = stage.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width * 100, y = (e.clientY - r.top) / r.height * 100;
      dark.style.background = "radial-gradient(circle " + (opts.r || 18) + "vmin at " + x + "% " + y + "%, rgba(4,6,20,0) 0%, rgba(4,6,20,.25) 55%, rgba(4,6,20,.96) 100%)";
      var near = Math.abs(x - tx) < 13 && Math.abs(y - ty) < 16;
      target.classList.toggle("near", near);
      return near;
    }
    function win() {
      if (found) return;
      found = true;
      dark.classList.add("gone");
      target.classList.add("found");
      fx("sparkle");
      done();
    }
    function touch(e) { if (found) return; if (light(e) && e.type === "pointerdown") win(); }
    stage.addEventListener("pointerdown", touch);
    stage.addEventListener("pointermove", touch);
    target.addEventListener("click", win);
    // a faint glimmer so that a small child is never truly lost
    var hintTimer = setTimeout(function () { target.classList.add("glimmer"); }, 9000);
    return function () { clearTimeout(hintTimer); stage.removeEventListener("pointerdown", touch); stage.removeEventListener("pointermove", touch); };
  };

  // Rub the scene clear: the storm, the water, the sand or the gold is wiped away by the finger.
  // opts.cover: storm | water | sand | gold; opts.under: an icon revealed in the middle.
  ACT.wipe = function (opts, done) {
    // cover: [top colour, bottom colour, icon scattered on it, what lies beneath when there is no picture, its icon]
    var COVER = {
      storm: ["#3d4257", "#5b6078", "🌧️", "linear-gradient(180deg, #6fc3f2 0%, #d6f0fb 62%, #cfe6a8 62.2%, #9fcf6f 100%)", "☀️"],
      water: ["#1f6f9e", "#3d9cc4", "🌊", "linear-gradient(180deg, #f3d9a0 0%, #dcb672 100%)", "👣"],
      sand: ["#c9a25c", "#e2c283", "⏳", "linear-gradient(180deg, #8a6230 0%, #5e3f1c 100%)", ""],
      gold: ["#b98a1e", "#f0c64b", "🐄", "linear-gradient(180deg, #bfe6f2 0%, #2f9fc4 55%, #17688f 100%)", "💨"]
    };
    var c = COVER[opts.cover] || COVER.storm, finished = false, down = false, moves = 0;
    if (!stage.classList.contains("has-pic")) {
      var beneath = mk("div", "wipe-beneath");
      beneath.style.background = c[3];
      stage.appendChild(beneath);
      if (!opts.under && c[4]) stage.appendChild(mkIco("div", "wipe-under", c[4]));
    }
    var weather = stage.querySelector(".fxl");
    if (opts.under) stage.appendChild(mkIco("div", "wipe-under", opts.under));
    var cv = mk("canvas", "wipe-cv");
    stage.appendChild(cv);
    var hint = mk("div", "hold-hint", "Rub with your finger");
    stage.appendChild(hint);
    var g = cv.getContext("2d"), W = 0, H = 0, COLS = 8, ROWS = 6, cells = [], cleared = 0;
    function fill() {
      W = cv.width = Math.max(200, stage.clientWidth); H = cv.height = Math.max(200, stage.clientHeight);
      var grad = g.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, c[0]); grad.addColorStop(1, c[1]);
      g.globalCompositeOperation = "source-over";
      g.fillStyle = grad; g.fillRect(0, 0, W, H);
      g.font = Math.round(H / 7) + "px serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.globalAlpha = 0.5;
      for (var i = 0; i < 9; i++) g.fillText(c[2], W * (0.12 + 0.19 * (i % 5)) + (i > 4 ? W * 0.09 : 0), H * (i > 4 ? 0.68 : 0.3));
      g.globalAlpha = 1;
      cells = []; cleared = 0;
      for (var k = 0; k < COLS * ROWS; k++) cells.push(false);
    }
    function rub(e) {
      if (finished) return;
      var r = cv.getBoundingClientRect(), x = (e.clientX - r.left) / r.width * W, y = (e.clientY - r.top) / r.height * H, rad = Math.max(W, H) / 9;
      g.globalCompositeOperation = "destination-out";
      g.beginPath(); g.arc(x, y, rad, 0, Math.PI * 2); g.fill();
      var cx = Math.min(COLS - 1, Math.max(0, Math.floor(x / W * COLS))), cy = Math.min(ROWS - 1, Math.max(0, Math.floor(y / H * ROWS)));
      if (!cells[cy * COLS + cx]) { cells[cy * COLS + cx] = true; cleared += 1; }
      if ((moves++ % 6) === 0) fx("swish");
      if (cleared >= COLS * ROWS * 0.6) {
        finished = true;
        cv.classList.add("gone");
        if (weather) weather.remove();
        hint.textContent = "All clear!";
        done();
      }
    }
    cv.addEventListener("pointerdown", function (e) { down = true; try { cv.setPointerCapture(e.pointerId); } catch (err) { /* optional */ } rub(e); });
    cv.addEventListener("pointermove", function (e) { if (down) rub(e); });
    ["pointerup", "pointercancel"].forEach(function (ev) { cv.addEventListener(ev, function () { down = false; }); });
    fill();
    return function () {};
  };

  // Build it piece by piece: every tap lays the next brick, from the bottom up.
  // opts: n pieces, cols across, icon for a piece, after (a line said when it is finished).
  ACT.build = function (opts, done) {
    var n = opts.n || 9, cols = opts.cols || 3, laid = 0;
    var chip = mk("div", "count-chip", "0 / " + n);
    stage.appendChild(chip);
    var wall = mk("div", "build-wall");
    wall.style.gridTemplateColumns = "repeat(" + cols + ", 1fr)";
    var slots = [];
    for (var i = 0; i < n; i++) { var s = mk("div", "build-slot"); slots.push(s); wall.appendChild(s); }
    stage.appendChild(wall);
    var btn = mk("button", "btn btn-teal build-btn", "Tap to build");
    function lay() {
      if (laid >= n) return;
      // rows fill from the bottom: the grid is drawn upside down in CSS
      var s = slots[laid];
      ico(s, opts.icon || "🧱");
      s.classList.add("laid");
      laid += 1;
      fx("thud", laid);
      chip.textContent = laid + " / " + n;
      if (laid === n) {
        btn.disabled = true;
        btn.textContent = "Done!";
        if (opts.after) { setCaption(opts.after); say(opts.after); }
        done();
      }
    }
    btn.addEventListener("click", lay);
    wall.addEventListener("click", lay);
    stage.appendChild(btn);
    return function () {};
  };

  /* ---------- flow ---------- */
  function teardown() {
    stepToken += 1;
    clearTimeout(skipTimer);
    music.tension(0);
    if (cleanup) { cleanup(); cleanup = null; }
  }

  var curView = "title", prevView = "title";
  function show(view) {
    curView = view;
    if ($("mapBtn")) $("mapBtn").setAttribute("aria-expanded", String(view === "chapters"));
    ["title", "play", "chapters", "end"].forEach(function (v) { $(v).hidden = v !== view; });
    if (view !== "play") { teardown(); stopVoice(); if (music.amb) music.amb("none"); }
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

  // Fetch the next step's picture (and backdrop) ahead of time so it is there when the page turns.
  // The blurred copy of a picture that fills the sides is only drawn when the stage is wide
  // enough to have sides; on a phone it is skipped (it costs a lot on a small tablet).
  function markWide() { stage.classList.toggle("wide", stage.clientWidth / Math.max(1, stage.clientHeight) > 1.15); }
  window.addEventListener("resize", markWide);

  function warmNext() {
    var steps = story[ci].steps, nxt = steps[si + 1] || (story[ci + 1] && story[ci + 1].steps[0]);
    if (!nxt) return;
    var o = nxt.opts || {}, id = nxt.pic || nxt.say || o.img;
    [id, !nxt.say && (o.bg || "bg-" + nxt.scene)].forEach(function (k) { if (k && ART[k]) new Image().src = "assets/img/" + k + ".webp"; });
  }

  // The title screen shows how far the pictures have got. The service worker is the one
  // downloading them (once, in the background); this only watches the saved copy, so it
  // never competes with that download. If nothing is saved for 20 seconds (no service
  // worker, or it is stuck), the page fetches the pictures itself.
  var prepared = false;
  function prepareAll() {
    var el = $("prep");
    if (prepared || !el) return;
    var keys = Object.keys(ART), total = keys.length;
    if (!total) return;
    prepared = true;
    el.hidden = false;
    var have = 0, fetched = 0, lastMove = Date.now(), selfFetching = false, stopped = false;
    function paint() {
      if (have >= total) { el.textContent = "✓ Ready — the pictures are saved on this device"; el.classList.add("ok"); stopped = true; return; }
      var slow = Date.now() - lastMove > 15000;
      el.innerHTML = (slow ? "Taking longer than usual. You can start now; pictures appear as you play." : "Getting the pictures ready…") + "<span class=\"prep-bar\"><i style=\"width:" + Math.round(have / total * 100) + "%\"></i></span>";
    }
    function selfFetch() {
      if (selfFetching) return;
      selfFetching = true;
      var next = 0, running = 0;
      (function pump() {
        while (running < 3 && next < total) {
          running += 1;
          (function (k) {
            var im = new Image(), t = setTimeout(fin, 10000);
            function fin() { clearTimeout(t); if (im) { im.onload = im.onerror = null; im = null; running -= 1; fetched += 1; if (fetched > have) { have = fetched; paint(); } pump(); } }
            im.onload = im.onerror = fin;
            im.src = "assets/img/" + k + ".webp";
          })(keys[next++]);
        }
      })();
    }
    function count() {
      if (stopped) return;
      var done = window.caches ? caches.open("asmau-media").then(function (c) { return c.keys(); }).then(function (reqs) {
        var seen = {};
        reqs.forEach(function (r) { var m = r.url.match(/assets\/img\/([^/]+)\.webp/); if (m && ART[m[1]]) seen[m[1]] = 1; });
        return Object.keys(seen).length;
      }) : Promise.resolve(0);
      done.catch(function () { return 0; }).then(function (n) {
        if (n > have) { have = n; lastMove = Date.now(); paint(); }
        if (have >= total) { paint(); return; }
        if (Date.now() - lastMove > 15000) paint();
        if (!selfFetching && (!navigator.serviceWorker || Date.now() - lastMove > 20000)) selfFetch();
        setTimeout(count, 600);
      });
    }
    paint();
    count();
  }

  // "Skip" is for a child who is stuck, not for one who is still playing: it only appears
  // after a quiet spell with no touching, and any touch starts the wait again.
  var SKIP_AFTER_MS = (/[?&]skipms=(\d+)/.exec(location.search) || [0, 22000])[1] * 1;   // ?skipms=300 is for the automated tests
  function armSkip(token) {
    clearTimeout(skipTimer);
    skipTimer = setTimeout(function () {
      if (token === stepToken && nextBtn.hidden) {
        setNext("Skip", true);
        nextBtn.hidden = false;
      }
    }, SKIP_AFTER_MS);
  }
  var shownAt = 0;

  function renderStep() {
    teardown();
    shownAt = Date.now();
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
    void stage.offsetWidth;
    stage.classList.add("enter");
    stage.style.backgroundImage = "";
    stage.dataset.scene = st.scene;
    stage.dataset.mode = st.say ? "story" : "play";
    stage.style.touchAction = st.say ? "pan-y" : "none";
    stage.innerHTML = "";

    if (pnoteFor !== ch.id) {
      pnoteFor = ch.id;
      var body = $("pnoteBody");
      body.innerHTML = "";
      (ch.parent || []).forEach(function (para) { body.appendChild(mk("p", "", para)); });
      // the chapter's main passage, then any others it draws on
      [ch.source].concat(ch.more || []).forEach(function (ref, i) {
        var more = mk("a", "pnote-link", i ? "Also: Qur’an " + ref.replace("-", "–") : "Read these verses on Quran.com");
        more.href = "https://quran.com/" + ref;
        more.target = "_blank";
        more.rel = "noopener";
        body.appendChild(more);
      });
      $("pnote").open = false;
    }

    var lineId = st.say || st.line;
    setCaption(lineId);
    music.mood(moodFor(st));
    if (si === 0) fx("swish");

    setNext("Next", false);
    nextBtn.classList.remove("ready");
    // A narrated step shows its picture (named after its line) if there is one;
    // an activity can name a picture in opts.img, or else gets a backdrop.
    var opts = st.opts || {};
    var picId = st.pic || st.say || opts.img;
    var hasPic = !!(picId && ART[picId]);
    if (hasPic) {
      stage.classList.add("has-pic");
      stage.appendChild(picture(picId, st.say ? function () { if (token === stepToken) drawArt(stage, fallbackArt(ch, st)); } : null));
      if (!st.say) opts = merge(opts, { art: null });
    } else if (!st.say) {
      var bg = opts.bg || ("bg-" + st.scene);
      if (ART[bg]) {
        stage.style.backgroundImage = "url(assets/img/" + bg + ".webp)";
        stage.classList.add("has-bg");
      }
    }
    markWide();
    if (st.src) stage.appendChild(mk("div", "src-chip", st.src));

    // the place is never still: something drifts, glints or falls in it, and it has its own sounds
    var motion = st.fx || SCENE_FX[st.scene];
    if (motion && motion !== "none") stage.appendChild(mk("div", "fxl fx-" + motion));
    if (music.amb) music.amb(st.amb || SCENE_AMB[st.scene] || "none");
    if (st.cue) setTimeout(function () { if (token === stepToken) fx(st.cue); }, 500);

    if (st.say) {
      drawArt(stage, hasPic ? st.over : fallbackArt(ch, st));
      nextBtn.hidden = false;
    } else {
      nextBtn.hidden = true;
      cleanup = ACT[st.play](merge(opts, { _line: lineId }), function () {
        if (token !== stepToken) return;
        fanfare();
        burst();
        clearTimeout(skipTimer);
        setNext("Next", false);
        nextBtn.classList.add("ready");
        nextBtn.hidden = false;
      });
      armSkip(token);
    }

    warmNext();
    currentSpoken = say(lineId);
    rememberPlace();
    persist();
  }

  // What a narrated step shows when it has no picture: its own sprites if it has any,
  // otherwise the look of the place with the step's (or the chapter's) icons in the middle.
  function fallbackArt(ch, st) {
    if (st.art) return st.art;
    var icons = st.e ? st.e.split(" ") : [ch.icon];
    var art = (SCENE_DECOR[st.scene] || []).slice();
    icons.forEach(function (ic, i) {
      var x = 50 + (i - (icons.length - 1) / 2) * (icons.length > 2 ? 24 : 30);
      art.push([ic, x, 52 + (i % 2 ? 6 : 0), icons.length > 2 ? 74 : 92, i % 2 ? "bob" : "float"]);
    });
    return art;
  }

  function next() {
    // a double tap (or a swipe that also hit the button) must not jump over a scene
    if (Date.now() - shownAt < 450) return;
    fx("tap", 6);
    var ch = story[ci];
    si += 1;
    if (si >= ch.steps.length) {
      save.done[ch.id] = true;
      si = 0;
      ci += 1;
      if (ci >= story.length) {
        ci = 0;
        save.chapter = null; save.line = null; save.nth = 0; save.at = 0; save.step = 0;
        persist();
        showEnd();
        return;
      }
    }
    renderStep();
  }

  function prev() {
    if (Date.now() - shownAt < 450) return;
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

  function hasProgress() { return !!resumeAt(); }

  function showTitle() {
    var resume = hasProgress();
    $("startBtn").textContent = resume ? "Continue — Chapter " + (resumeAt().ci + 1) : "Start the story";
    $("restartBtn").hidden = !resume;
    music.mood(CFG.titleMood || "wonder");
    if (music.amb) music.amb("none");
    show("title");
    prepareAll();
  }

  // ☰ opens the list of chapters, and a second tap (or Close) folds it away again,
  // back to exactly where the child was.
  function toggleChapters() {
    if (curView === "chapters") closeChapters(); else showChapters();
  }
  function closeChapters() {
    if (prevView === "play") { show("play"); renderStep(); }
    else if (prevView === "end") showEnd();
    else showTitle();
  }

  function showChapters() {
    if (curView !== "chapters") prevView = curView;
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
    music.mood(CFG.endMood || "joy");
    if (music.amb) music.amb("none");
    show("end");
    $("endText").textContent = lines["end-a"] || "";
    fanfare();
    say("end-a");
  }

  function paintToggles() {
    var s = $("soundBtn");
    s.classList.toggle("off", !save.sfx);
    s.setAttribute("aria-label", save.sfx ? "Sounds and effects are on" : "Sounds and effects are off");
    s.setAttribute("aria-pressed", String(save.sfx));
    var v = $("voiceBtn");
    if (v) {
      v.classList.toggle("off", !save.voice);
      v.setAttribute("aria-label", save.voice ? "The voice is on" : "The voice is off");
      v.setAttribute("aria-pressed", String(save.voice));
    }
    var m = $("musicBtn");
    m.classList.toggle("off", !save.music);
    m.setAttribute("aria-label", save.music ? "Music is on" : "Music is off");
    m.setAttribute("aria-pressed", String(save.music));
  }

  function buildTitleSky() {
    var sky = $("titleSky");
    // a game can give its own title scene (titleArt: a list of sprites) and end picture (endIcon)
    if (CFG.titleArt) drawArt(sky, CFG.titleArt);
    else {
      drawArt(sky, [["RING", 50, 52, 1]]);
      sky.appendChild(sprite(["P:" + HERO, 50, 54, 84, "bob", { expr: "happy" }]));
    }
    if (CFG.endIcon) ico($("endFig"), CFG.endIcon);
    else $("endFig").innerHTML = People.svg(HERO_GROWN, { expr: "happy" });
  }

  function wire() {
    ["click", "touchend", "keydown"].forEach(function (ev) { document.addEventListener(ev, music.unlock, true); });

    $("startBtn").addEventListener("click", function () { var r = resumeAt(); if (r) startChapter(r.ci, r.si); else startChapter(0); });
    $("restartBtn").addEventListener("click", function () { startChapter(0); });
    $("mapBtn").addEventListener("click", toggleChapters);
    if ($("chaptersClose")) $("chaptersClose").addEventListener("click", closeChapters);
    $("soundBtn").addEventListener("click", function () {
      save.sfx = !save.sfx;
      persist();
      music.setSfx(save.sfx);
      paintToggles();
    });
    if ($("voiceBtn")) $("voiceBtn").addEventListener("click", function () {
      save.voice = !save.voice;
      persist();
      paintToggles();
      if (!save.voice) stopVoice(); else if (currentLine) say(currentLine);
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
      if (stage.dataset.mode === "play" && nextBtn.hidden) armSkip(stepToken);
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
      if (Math.abs(dx) < 80 || Math.abs(dy) > Math.abs(dx) / 2 || dt > 700) return;
      if (stage.dataset.mode !== "story") return;
      if (dx < 0) next(); else prev();
    });
  }

  fetch("narration.json")
    .then(function (r) { return r.json(); })
    .then(function (list) {
      list.forEach(function (l) { lines[l.id] = l.text; });
      music.setMusic(save.music);
      music.setSfx(save.sfx);
      buildTitleSky();
      paintToggles();
      wire();
      showTitle();
    })
    .catch(function () {
      $("title").innerHTML = "<p>Couldn’t load the story. If you opened this as a file, serve the folder over http instead.</p>";
    });
})();
