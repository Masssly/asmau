/*
  Count with Me: a counting game for children of about 1.5 to 4.

  A round shows a few things. The child taps them one by one; each tap lights,
  pops, picks or feeds one thing, says the next number and shows it as a big
  numeral. When all are counted the game says "Mashallah!" and moves on by
  itself (or with the one big button). There are four levels: count to 5, 10,
  15 or 20. From "count to 10" up, every third round asks "How many?" with two
  or three answers (always of ten things or fewer, so they can be counted by eye).
  With more than ten things on the screen they are drawn smaller, so the two
  higher levels are for older fingers.

  Rules this file keeps:
  - one thing is counted once, however many fingers land and however fast
  - nothing is ever lost or marked wrong, and nothing depends on being quick
  - every tap, even one that misses, makes a sound and something to see
  - Arabic is shown as text and only ever spoken from a real recording
    (lang "ar" is passed to AsmauNarration, which never synthesizes it)
  - no people are drawn; the only animal is one simple sheep
*/
(function () {
  "use strict";

  var GAME = "count-the-crescents";
  var narr = window.AsmauNarration, music = window.AsmauMusic;

  var WORDS = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
    "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen", "Twenty"];
  var AR_WORDS = ["", "وَاحِد", "اِثْنَان", "ثَلَاثَة", "أَرْبَعَة", "خَمْسَة", "سِتَّة", "سَبْعَة", "ثَمَانِيَة", "تِسْعَة", "عَشَرَة",
    "أَحَدَ عَشَرَ", "اِثْنَا عَشَرَ", "ثَلَاثَةَ عَشَرَ", "أَرْبَعَةَ عَشَرَ", "خَمْسَةَ عَشَرَ", "سِتَّةَ عَشَرَ", "سَبْعَةَ عَشَرَ", "ثَمَانِيَةَ عَشَرَ", "تِسْعَةَ عَشَرَ", "عِشْرُونَ"];
  var TOP = 20;        // the most things a round can show
  // how each level chooses how many: the first rounds in order, then anything in its range
  var LEVELS = {
    5:  { first: [2, 3, 3, 4, 5], any: function () { return pick([1, 2, 3, 3, 4, 4, 5, 5, 5]); } },
    10: { first: [3, 5, 6, 8, 10, 7], any: function () { return rand(4, 10); } },
    15: { first: [6, 9, 11, 13, 15, 12], any: function () { return rand(8, 15); } },
    20: { first: [8, 12, 16, 20, 14, 18], any: function () { return rand(11, 20); } }
  };
  var AR_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  // every spoken line, by its id in narration.json
  var LINES = {
    "prompt-moons": "Tap the moons!",
    "prompt-stars": "Tap the stars!",
    "prompt-lanterns": "Light the lanterns!",
    "prompt-beads": "Count the beads!",
    "prompt-rain": "Pop the raindrops!",
    "prompt-dates": "Pick the dates!",
    "prompt-sheep": "Feed the sheep!",
    "how-many": "How many?",
    "lets-count": "Let's count!",
    "mashallah": "Mashallah!",
    "well-done": "Well done!",
    "counted-all": "You counted them all!"
  };
  for (var w = 1; w <= TOP; w++) { LINES["count-" + w] = WORDS[w]; LINES["ar-" + w] = AR_WORDS[w]; }
  var PRAISE = ["mashallah", "well-done", "mashallah", "counted-all"];

  function $(id) { return document.getElementById(id); }
  function now() { return Date.now(); }
  function rand(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function pick(list) { return list[Math.floor(Math.random() * list.length)]; }
  function shuffle(list) {
    for (var i = list.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = list[i]; list[i] = list[j]; list[j] = t; }
    return list;
  }
  function arNum(n) { return String(n).split("").map(function (d) { return AR_DIGITS[+d]; }).join(""); }
  function wait(ms) { return new Promise(function (resolve) { setTimeout(resolve, ms); }); }
  function both(a, b) { return Promise.all([a, b]); }
  function first(a, b) { return Promise.race([a, b]); }

  var reduced = false;
  try { reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (err) { /* old browser */ }

  /* ---------- pictures: drawn here, coloured by the gradients in index.html ---------- */
  var MOON = "M61.8 11.7A40 40 0 1 0 89.8 45.4A28 28 0 1 1 61.8 11.7Z";
  function starPts(cx, cy, R, r) {
    var p = [];
    for (var i = 0; i < 10; i++) {
      var a = -Math.PI / 2 + i * Math.PI / 5, q = i % 2 ? r : R;
      p.push((cx + q * Math.cos(a)).toFixed(1) + "," + (cy + q * Math.sin(a)).toFixed(1));
    }
    return p.join(" ");
  }
  var STAR = starPts(50, 53, 43, 21);
  var BLOOMS = [["#ff8fb1", "#ffd3e0"], ["#fff3b0", "#ffc94a"], ["#c5adff", "#8a5cf0"], ["#ffb38a", "#ff7a59"], ["#ffffff", "#bfe3ff"]];
  function svg(body, box) { return '<svg viewBox="' + (box || "0 0 100 100") + '" aria-hidden="true" focusable="false">' + body + "</svg>"; }

  var ART = {
    moon: function () {
      return svg(
        '<path class="off" d="' + MOON + '" fill="#3c50a0" stroke="#8ea3ea" stroke-width="3.5" stroke-linejoin="round"/>' +
        '<g class="on"><path d="' + MOON + '" fill="url(#cGold)" stroke="#c98f2b" stroke-width="3.5" stroke-linejoin="round"/>' +
        '<path d="M19 61.3A33 33 0 0 1 23 31.1" fill="none" stroke="#fffbe6" stroke-width="6" stroke-linecap="round" opacity=".85"/></g>');
    },
    star: function () {
      return svg(
        '<polygon class="off" points="' + STAR + '" fill="#3c50a0" stroke="#8ea3ea" stroke-width="5" stroke-linejoin="round"/>' +
        '<g class="on"><polygon points="' + STAR + '" fill="url(#cGold)" stroke="#c98f2b" stroke-width="5" stroke-linejoin="round"/>' +
        '<path d="M40 40 46 28" fill="none" stroke="#fffbe6" stroke-width="5" stroke-linecap="round" opacity=".85"/></g>');
    },
    lantern: function () {
      var glass = "M36 36H64L77 58 66 82H34L23 58Z";
      return svg(
        '<path d="M50 0V11" stroke="#f0c463" stroke-width="3" stroke-linecap="round"/>' +
        '<circle cx="50" cy="15" r="4.5" fill="none" stroke="#f0c463" stroke-width="3"/>' +
        '<path d="M36 31Q50 12 64 31Z" fill="#c98f2b"/><rect x="31" y="30" width="38" height="7" rx="3.5" fill="#f0c463"/>' +
        '<path class="off" d="' + glass + '" fill="#2b3a7c"/>' +
        '<g class="on"><path d="' + glass + '" fill="url(#cFlame)"/><path d="M50 47C58 57 57 68 50 71 43 68 42 57 50 47Z" fill="#fff8d6"/></g>' +
        '<path d="' + glass + 'M50 36V82M36 36 34 82M64 36 66 82" fill="none" stroke="#c98f2b" stroke-width="3" stroke-linejoin="round"/>' +
        '<rect x="29" y="81" width="42" height="8" rx="4" fill="#f0c463"/><rect x="40" y="89" width="20" height="6" rx="3" fill="#c98f2b"/>');
    },
    bead: function (i) {
      return svg(
        '<circle class="off" cx="50" cy="50" r="41" fill="url(#cBeadOff)" stroke="#2f4a5e" stroke-width="3"/>' +
        '<g class="on"><circle cx="50" cy="50" r="41" fill="url(#cBead' + (i % 5) + ')" stroke="rgba(0,0,0,.28)" stroke-width="3"/></g>' +
        '<ellipse cx="36" cy="33" rx="11" ry="7" fill="#fff" opacity=".7" transform="rotate(-35 36 33)"/>');
    },
    drop: function (i) {
      var c = BLOOMS[i % BLOOMS.length], petals = "";
      for (var k = 0; k < 6; k++) {
        var a = k * Math.PI / 3;
        petals += '<circle cx="' + (50 + 18 * Math.cos(a)).toFixed(1) + '" cy="' + (40 + 18 * Math.sin(a)).toFixed(1) + '" r="13" fill="' + c[0] + '" stroke="' + c[1] + '" stroke-width="2.5"/>';
      }
      return svg(
        '<g class="off"><path d="M50 6C50 6 20 44 20 64A30 30 0 0 0 80 64C80 44 50 6 50 6Z" fill="url(#cDrop)" stroke="#1f5fc0" stroke-width="3.5" stroke-linejoin="round"/>' +
        '<path d="M34 62A17 17 0 0 0 44 78" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".85"/></g>' +
        '<g class="on"><path d="M50 98V56" stroke="#2f8f4c" stroke-width="7" stroke-linecap="round"/>' +
        '<path d="M50 84C37 83 30 75 30 67 43 67 50 75 50 84Z" fill="#4fb768"/><path d="M50 88C63 87 70 79 70 71 57 71 50 79 50 88Z" fill="#4fb768"/>' +
        petals + '<circle cx="50" cy="40" r="11" fill="#ffd24a" stroke="#c98f2b" stroke-width="2.5"/></g>');
    },
    date: function () {
      return svg(
        '<g transform="rotate(16 50 54)"><path d="M50 14V6" stroke="#7a5a2a" stroke-width="5" stroke-linecap="round"/>' +
        '<ellipse cx="50" cy="56" rx="25" ry="37" fill="url(#cDate)" stroke="#4a2409" stroke-width="3.5"/>' +
        '<ellipse cx="50" cy="20" rx="11" ry="6" fill="#e5c07a" stroke="#8a6230" stroke-width="2.5"/>' +
        '<path d="M38 40C34 52 35 66 40 76" fill="none" stroke="#f2b877" stroke-width="5" stroke-linecap="round" opacity=".7"/></g>');
    },
    apple: function () {
      return svg(
        '<path d="M50 34Q49 22 57 14" fill="none" stroke="#6b4423" stroke-width="5" stroke-linecap="round"/>' +
        '<path d="M58 22C64 10 78 10 84 14 80 26 68 28 58 22Z" fill="#57b96d" stroke="#2f8f4c" stroke-width="2.5" stroke-linejoin="round"/>' +
        '<path d="M50 35C38 22 14 28 14 54 14 78 34 94 50 87 66 94 86 78 86 54 86 28 62 22 50 35Z" fill="url(#cApple)" stroke="#a81f26" stroke-width="3.5" stroke-linejoin="round"/>' +
        '<path d="M27 46C25 54 27 64 32 70" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".7"/>');
    }
  };

  function twinkles(n) {
    var out = "";
    for (var i = 0; i < n; i++) {
      var s = 2 + Math.random() * 3;
      out += '<i class="twinkle" style="left:' + (Math.random() * 96 + 2).toFixed(1) + "%;top:" + (Math.random() * 80 + 2).toFixed(1) + "%;width:" + s.toFixed(1) + "px;height:" + s.toFixed(1) + "px;animation-delay:-" + (Math.random() * 3).toFixed(2) + 's"></i>';
    }
    return out;
  }
  var SKYLINE = '<svg class="skyline" viewBox="0 0 400 60" preserveAspectRatio="xMidYMax slice">' +
    '<g fill="#101b56"><rect x="0" y="44" width="400" height="16"/>' +
    '<path d="M150 46A50 34 0 0 1 250 46Z"/><rect x="197" y="2" width="6" height="12" rx="3"/>' +
    '<rect x="112" y="14" width="12" height="34"/><path d="M110 16 118 2 126 16Z"/>' +
    '<rect x="276" y="14" width="12" height="34"/><path d="M274 16 282 2 290 16Z"/>' +
    '<path d="M30 46A26 20 0 0 1 82 46Z"/><path d="M318 46A26 20 0 0 1 370 46Z"/>' +
    '<rect x="0" y="34" width="26" height="14"/><rect x="376" y="30" width="24" height="18"/></g>' +
    '<g fill="#ffe07a"><rect x="190" y="30" width="6" height="9" rx="3"/><rect x="204" y="30" width="6" height="9" rx="3"/><rect x="115" y="24" width="6" height="8" rx="3"/><rect x="279" y="24" width="6" height="8" rx="3"/></g></svg>';
  var CLOUD = svg('<g fill="#fff"><circle cx="36" cy="36" r="20"/><circle cx="62" cy="27" r="25"/><circle cx="88" cy="38" r="19"/><rect x="18" y="36" width="88" height="20" rx="10"/></g>', "0 0 124 58");
  var PALM = (function () {
    var ends = [[14, 70], [62, 96], [128, 108], [200, 112], [272, 108], [338, 96], [386, 70]], s = "";
    ends.forEach(function (e) {
      var cx = (200 + e[0]) / 2, cy = e[1] * 0.2, tip = " " + e[0] + " " + e[1];
      s += '<path d="M200 -8Q' + cx + " " + (cy - 16) + tip + "Q" + cx + " " + (cy + 26) + ' 200 -8Z" fill="#3f9b57" stroke="#2a7f45" stroke-width="3" stroke-linejoin="round"/>' +
        '<path d="M200 -8Q' + cx + " " + (cy + 4) + tip + '" fill="none" stroke="#86d694" stroke-width="3" stroke-linecap="round"/>';
    });
    return svg(s + '<circle cx="200" cy="-2" r="20" fill="#8a5f2a"/>', "0 0 400 114");
  })();
  var SHEEP = svg(
    '<g fill="#5a4646"><rect x="62" y="116" width="13" height="42" rx="6.5"/><rect x="86" y="120" width="13" height="38" rx="6.5"/><rect x="118" y="120" width="13" height="38" rx="6.5"/><rect x="142" y="116" width="13" height="42" rx="6.5"/></g>' +
    '<g fill="#fffaf0" stroke="#e3d8c0" stroke-width="5"><circle cx="176" cy="88" r="11"/><circle cx="62" cy="92" r="30"/><circle cx="92" cy="72" r="34"/><circle cx="126" cy="72" r="34"/><circle cx="152" cy="94" r="30"/><circle cx="128" cy="112" r="30"/><circle cx="94" cy="114" r="30"/></g>' +
    '<g fill="#fffaf0"><circle cx="62" cy="92" r="28"/><circle cx="92" cy="72" r="32"/><circle cx="126" cy="72" r="32"/><circle cx="152" cy="94" r="28"/><circle cx="128" cy="112" r="28"/><circle cx="94" cy="114" r="28"/><circle cx="108" cy="92" r="30"/></g>' +
    '<g fill="#5a4646"><ellipse cx="17" cy="66" rx="13" ry="7" transform="rotate(-24 17 66)"/><ellipse cx="68" cy="64" rx="13" ry="7" transform="rotate(24 68 64)"/><ellipse cx="42" cy="78" rx="25" ry="29"/></g>' +
    '<g fill="#fffaf0" stroke="#e3d8c0" stroke-width="2.5"><circle cx="33" cy="52" r="12"/><circle cx="50" cy="50" r="13"/></g>' +
    '<circle cx="33" cy="76" r="5" fill="#fff"/><circle cx="51" cy="76" r="5" fill="#fff"/><circle cx="34" cy="77" r="2.4" fill="#1b1530"/><circle cx="52" cy="77" r="2.4" fill="#1b1530"/>' +
    '<path d="M36 92Q42 98 48 92" fill="none" stroke="#2b1f1f" stroke-width="3" stroke-linecap="round"/>', "0 0 200 162");
  var BASKET = svg(
    '<path d="M18 26H182L164 96Q100 108 36 96Z" fill="#d49a3a" stroke="#8a5f18" stroke-width="4" stroke-linejoin="round"/>' +
    '<path d="M25 50H175M30 72H170M60 30 68 98M100 30V101M140 30 132 98" fill="none" stroke="#a8741f" stroke-width="4" stroke-linecap="round"/>' +
    '<rect x="8" y="14" width="184" height="18" rx="9" fill="#efc063" stroke="#8a5f18" stroke-width="4"/>', "0 0 200 108");
  var TASSEL = svg('<path d="M13 0V16" stroke="#ffe07a" stroke-width="3"/><circle cx="13" cy="18" r="6" fill="#ffe07a"/><path d="M6 22H20L22 52H4Z" fill="#f0a92a"/><path d="M9 26V50M13 26V50M17 26V50" stroke="#ffe07a" stroke-width="1.5"/>', "0 0 26 54");
  var TROPHY = svg('<polygon points="' + STAR + '" fill="#ffe07a" stroke="#c98f2b" stroke-width="6" stroke-linejoin="round"/>');

  /* ---------- the activities ---------- */
  // mech: light = lights up where it is; bloom = pops and a flower grows; fly = goes to the basket or the sheep
  var ACTS = {
    moons:    { one: "moon",    prompt: "prompt-moons",    bg: "bg-night",  mech: "light", art: ART.moon,    fx: "tap",   jitter: true,
                deco: function () { return twinkles(22) + SKYLINE; } },
    stars:    { one: "star",    prompt: "prompt-stars",    bg: "bg-night",  mech: "light", art: ART.star,    fx: "tap",   jitter: true,
                deco: function () { return twinkles(26) + SKYLINE; } },
    lanterns: { one: "lantern", prompt: "prompt-lanterns", bg: "bg-dusk",   mech: "light", art: ART.lantern, fx: "coin",  garland: true,
                deco: function () { return twinkles(14); } },
    beads:    { one: "bead",    prompt: "prompt-beads",    bg: "bg-teal",   mech: "light", art: ART.bead,    fx: "clink", ring: true,
                deco: function () { return '<svg class="string"><ellipse fill="none" stroke="#ffe07a" stroke-width="4"/></svg><div class="tassel">' + TASSEL + "</div>"; } },
    rain:     { one: "raindrop", prompt: "prompt-rain",    bg: "bg-rain",   mech: "bloom", art: ART.drop,    fx: "boing", jitter: true,
                deco: function () { return '<div class="hill grass"></div><div class="cloud c1">' + CLOUD + '</div><div class="cloud c2" data-keep="top">' + CLOUD + '</div><div class="cloud c3">' + CLOUD + "</div>"; } },
    dates:    { one: "date",    prompt: "prompt-dates",    bg: "bg-desert", mech: "fly",   art: ART.date,    fx: "coin",  jitter: true,
                deco: function () { return '<div class="hill sand"></div><div class="palm" data-keep="top">' + PALM + '</div><div class="basket" data-keep="end"><div class="basket-in">' + BASKET + '</div><div class="basket-fill"></div><i class="fly-target"></i></div>'; } },
    sheep:    { one: "apple",   prompt: "prompt-sheep",    bg: "bg-meadow", mech: "fly",   art: ART.apple,   fx: "boing", jitter: true,
                deco: function () { return '<div class="sun"></div><div class="hill grass"></div><div class="sheep" data-keep="end"><div class="sheep-in">' + SHEEP + '</div><i class="fly-target"></i></div>'; } }
  };
  var ACT_NAMES = ["moons", "rain", "lanterns", "sheep", "stars", "dates", "beads"];
  // "How many?" shows things that are already bright, on a plain scene
  var QUIZ = {
    moons:  { act: "moons",  deco: function () { return twinkles(22) + SKYLINE; } },
    stars:  { act: "stars",  deco: function () { return twinkles(26) + SKYLINE; } },
    apples: { act: "sheep",  deco: function () { return '<div class="sun"></div><div class="hill grass"></div>'; } },
    dates:  { act: "dates",  deco: function () { return '<div class="hill sand"></div>'; } }
  };

  /* ---------- settings (kept on this device) ---------- */
  var SAVE_KEY = "asmau-count-with-me";
  var settings = (function () {
    var s = {};
    try { s = JSON.parse(localStorage.getItem(SAVE_KEY) || "{}") || {}; } catch (err) { s = {}; }
    return { voice: s.voice !== false, sfx: s.sfx !== false, music: s.music !== false, arabic: s.arabic !== false };
  })();
  function persist() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(settings)); } catch (err) { /* private mode: play on */ } }

  /* ---------- sound ---------- */
  function fx(name, a) { try { music.fx(name, a); } catch (err) { /* a sound must never break the game */ } }

  var speakSeq = 0;
  // Says one line. The promise resolves when it has finished or been cut off by a newer one.
  function speak(id, lang) {
    var my = ++speakSeq;
    function done() { if (my === speakSeq) music.duck(false); }
    if (!settings.voice) { narr.stop(); done(); return Promise.resolve(); }
    music.duck(true);
    return narr.say(GAME, id, LINES[id], { lang: lang || "en" }).then(done, done);
  }

  // An Arabic number word is spoken only when a real recording of it exists: one made on this
  // device, or a file a person recorded and committed. Looked up once for each number.
  var arReady = {};
  function arRecorded(n) {
    if (!arReady[n]) {
      var id = "ar-" + n;
      arReady[n] = narr.getRecordedClip(GAME, id).then(function (blob) {
        if (blob) return true;
        return fetch("assets/audio/" + id + ".mp3").then(function (r) { return !!r.ok; });
      }).catch(function () { return false; });
    }
    return arReady[n];
  }

  var talk = 0;
  // "Three", then the Arabic word if a person has recorded it.
  function sayNumber(n) {
    var my = ++talk;
    var recorded = settings.arabic && settings.voice ? arRecorded(n) : Promise.resolve(false);
    return both(speak("count-" + n), wait(350)).then(function () {
      if (my !== talk) return;
      return recorded.then(function (ok) { if (ok && my === talk) return speak("ar-" + n, "ar"); });
    });
  }

  /* ---------- the page ---------- */
  var body = document.body;
  var startEl = $("start"), playEl = $("play"), panel = $("panel"), numeral = $("numeral"), arabic = $("arabic"), dots = $("dots");
  var stage = $("stage"), deco = $("deco"), itemsEl = $("items"), answersEl = $("answers"), fxLayer = $("fxLayer");
  var cheer = $("cheer"), cheerWord = $("cheerWord"), nextBtn = $("nextBtn"), trophiesEl = $("trophies");
  var parents = $("parents"), sheet = parents.querySelector(".sheet"), tip = $("tip");

  var state = {
    screen: "start", level: 5, round: 0, counts: 0, quizzes: 0, trophies: 0,
    act: null, quiz: false, target: 0, count: 0, items: [],
    locked: false, hinting: false, done: false, guardUntil: 0, nextGuard: 0, token: 0, hintToken: 0,
    lastAct: null, lastQuiz: null, lastTarget: 0, bag: [], praise: 0, zone: null
  };
  var timers = [];
  function later(fn, ms) { var id = setTimeout(fn, ms); timers.push(id); return id; }
  function clearTimers() { timers.forEach(clearTimeout); timers = []; }

  /* ---------- choosing what comes next ---------- */
  function nextAct() {
    if (!state.bag.length) {
      state.bag = state.lastAct ? shuffle(ACT_NAMES.slice()) : ACT_NAMES.slice();   // the very first round is always the moons
      if (state.bag[0] === state.lastAct) state.bag.push(state.bag.shift());
    }
    state.lastAct = state.bag.shift();
    return state.lastAct;
  }
  function nextTarget(quiz) {
    var lvl = LEVELS[state.level] || LEVELS[5];
    var seq = quiz ? [3, 2, 4, 5] : lvl.first;
    var at = quiz ? state.quizzes : state.counts, n = at < seq.length ? seq[at] : 0, tries = 0;
    while (!n || (at >= seq.length && n === state.lastTarget && tries++ < 8)) {
      n = quiz ? rand(3, 10) : lvl.any();
    }
    if (quiz) state.quizzes += 1; else state.counts += 1;
    state.lastTarget = n;
    return n;
  }
  function answersFor(n, quizzes) {
    var want = quizzes <= 2 ? 2 : 3, set = [n], tries = 0;
    while (set.length < want && tries++ < 60) {
      var c = n + pick([-2, -1, 1, 2]);
      if (c >= 1 && c <= 10 && set.indexOf(c) < 0) set.push(c);
    }
    return set.sort(function (a, b) { return a - b; });
  }

  /* ---------- a round ---------- */
  function currentAct() { return ACTS[state.quiz ? QUIZ[state.act].act : state.act]; }

  // `forced` ({ act, n, quiz }) is only used by AsmauCounting.show, for the tests
  function startRound(forced) {
    clearTimers();
    state.token += 1;
    state.hintToken += 1;
    state.round += 1;
    state.quiz = forced ? !!forced.quiz : state.level >= 10 && state.round % 3 === 0;
    if (forced) {
      state.act = forced.act;
    } else if (state.quiz) {
      var names = Object.keys(QUIZ).filter(function (k) { return k !== state.lastQuiz; });
      state.act = state.lastQuiz = pick(names);
    } else {
      state.act = nextAct();
    }
    var act = currentAct();
    state.target = forced ? forced.n : nextTarget(state.quiz);
    state.count = 0;
    state.locked = state.hinting = state.done = false;
    state.items = [];
    if (state.trophies >= 5) { state.trophies = 0; paintTrophies(); }

    stage.className = "stage " + act.bg;
    deco.innerHTML = state.quiz ? QUIZ[state.act].deco() : act.deco();
    itemsEl.innerHTML = "";
    fxLayer.innerHTML = "";
    answersEl.innerHTML = "";
    answersEl.hidden = !state.quiz;
    cheer.hidden = true;
    panel.className = "panel" + (state.quiz ? " asking" : "");

    for (var i = 0; i < state.target; i++) {
      var el = document.createElement("button");
      el.type = "button";
      el.className = "item m-" + (state.quiz ? "light bright" : act.mech);
      el.setAttribute("aria-label", act.one);
      el.setAttribute("data-i", i);
      el.style.animationDelay = (i * 55) + "ms";
      el.innerHTML = '<span class="art">' + act.art(i) + '</span><span class="badge"></span>';
      itemsEl.appendChild(el);
      state.items.push({ el: el, art: el.firstChild, badge: el.lastChild, counted: false, n: 0, jx: Math.random() * 2 - 1, jy: Math.random() * 2 - 1 });
    }
    if (state.quiz) {
      answersFor(state.target, state.quizzes).forEach(function (n, k) {
        var b = document.createElement("button"), pips = "";
        for (var p = 0; p < n; p++) pips += "<i></i>";
        b.type = "button";
        b.className = "answer";
        b.setAttribute("data-n", n);
        b.setAttribute("aria-label", WORDS[n]);
        b.style.animationDelay = (300 + k * 90) + "ms";
        b.innerHTML = '<span class="a-num">' + n + '</span><span class="a-pips">' + pips + "</span>";
        answersEl.appendChild(b);
      });
    }

    numeral.className = "numeral";
    numeral.innerHTML = state.quiz ? "?" : '<span class="icon">' + act.art(0) + "</span>";
    arabic.textContent = "";
    var d = "";
    for (var k = 0; k < state.target; k++) d += '<i class="dot"></i>';
    dots.innerHTML = d;
    dots.classList.toggle("many", state.target > 10);

    layout();
    state.guardUntil = now() + 400;             // a hand already hammering the screen does not eat the new round
    speak(state.quiz ? "how-many" : act.prompt);
    armHint();
  }

  /* ---------- where things go ---------- */
  function place(it, x, y, size) {
    it.el.style.left = Math.round(x) + "px";
    it.el.style.top = Math.round(y) + "px";
    it.el.style.width = it.el.style.height = Math.round(size) + "px";
  }
  function freeZone(W, H, wide) {
    var z = { l: 12, t: 12, r: W - 12, b: H - 12 }, sr = stage.getBoundingClientRect();
    var keeps = deco.querySelectorAll("[data-keep]");
    for (var i = 0; i < keeps.length; i++) {
      var k = keeps[i].getAttribute("data-keep"), r = keeps[i].getBoundingClientRect();
      if (k === "top") z.t = Math.max(z.t, r.bottom - sr.top + 4);
      else if (wide) z.r = Math.min(z.r, r.left - sr.left - 6);
      else z.b = Math.min(z.b, r.top - sr.top - 6);
    }
    if (state.quiz) z.b = Math.min(z.b, answersEl.getBoundingClientRect().top - sr.top - 10);
    return z;
  }
  function layout() {
    if (state.screen !== "play" || !state.items.length) return;
    var W = stage.clientWidth, H = stage.clientHeight;
    if (!W || !H) return;
    var wide = W > H * 1.25;
    stage.classList.toggle("wide", wide);
    var act = currentAct(), z = freeZone(W, H, wide);
    var cap = Math.max(132, Math.min(W, H) * 0.26) * (state.items.length <= 3 ? 1.25 : 1);   // a few things can be bigger
    state.zone = z;
    // more than ten beads will not fit on one string: they go in rows like everything else
    if (act.ring && !state.quiz && state.items.length <= 10) ringLayout(z, cap); else gridLayout(z, cap, act);
  }
  function gridLayout(z, cap, act) {
    var items = state.items, n = items.length, w = z.r - z.l, h = z.b - z.t, best = null, c;
    for (c = 1; c <= n; c++) {
      var rows = Math.ceil(n / c), s = Math.min(w / c, h / rows);
      if (!best || s > best.s + 0.5) best = { c: c, r: rows, s: s };
    }
    // up to ten things are never smaller than 72px; more than ten may be, but never so big that two touch
    var size = Math.max(n > 10 ? 44 : 72, Math.min(best.s * 0.8, cap));
    if (n > 10) size = Math.min(size, best.s * 0.92);
    var cw = Math.min(w / best.c, size * 1.45), ch = Math.min(h / best.r, size * 1.45);
    var top = z.t + (h - ch * best.r) / 2, rowTops = [];
    for (var i = 0; i < n; i++) {
      var row = Math.floor(i / best.c), inRow = row === best.r - 1 ? n - row * best.c : best.c, col = i - row * best.c;
      var left = z.l + (w - cw * inRow) / 2 + cw * col + (cw - size) / 2, y = top + ch * row + (ch - size) / 2;
      if (act.jitter && !state.quiz) {
        left += items[i].jx * Math.max(0, cw - size) * 0.4;
        y += items[i].jy * Math.max(0, ch - size) * 0.4;
      }
      place(items[i], left, y, size);
      rowTops[row] = y;
    }
    var old = deco.querySelectorAll(".garland");
    for (var g = 0; g < old.length; g++) old[g].parentNode.removeChild(old[g]);
    if (act.garland && !state.quiz) rowTops.forEach(function (y) {
      var line = document.createElement("div");
      line.className = "garland";
      line.style.top = Math.round(y) + "px";
      deco.appendChild(line);
    });
  }
  // prayer beads sit evenly along an oval string, with the tassel at the bottom
  function ringLayout(z, cap) {
    var items = state.items, n = items.length, w = z.r - z.l, h = z.b - z.t - 44;
    var size = Math.min(cap, 110), rx = 0, ry = 0, pts = [], total = 0, i, k;
    for (var pass = 0; pass < 3; pass++) {
      rx = Math.max(10, Math.min(w / 2 - size / 2, h * 0.95));
      ry = Math.max(10, Math.min(h / 2 - size / 2, w * 0.95));
      pts = []; total = 0;
      for (k = 0; k <= 360; k++) {
        var a = Math.PI / 2 + k * Math.PI / 180, p = { x: rx * Math.cos(a), y: ry * Math.sin(a), d: 0 };
        if (k) total += Math.sqrt(Math.pow(p.x - pts[k - 1].x, 2) + Math.pow(p.y - pts[k - 1].y, 2));
        p.d = total;
        pts.push(p);
      }
      size = Math.max(72, Math.min(cap, 110, total / n * 0.84));
    }
    var cx = (z.l + z.r) / 2, cy = z.t + h / 2;
    for (i = 0; i < n; i++) {
      var want = total * (i + 0.5) / n;
      for (k = 1; k < pts.length - 1 && pts[k].d < want; k++) { /* walk along the string */ }
      place(items[i], cx + pts[k].x - size / 2, cy + pts[k].y - size / 2, size);
    }
    var string = deco.querySelector(".string ellipse"), tassel = deco.querySelector(".tassel");
    if (string) { string.setAttribute("cx", cx); string.setAttribute("cy", cy); string.setAttribute("rx", rx); string.setAttribute("ry", ry); }
    if (tassel) { tassel.style.left = cx + "px"; tassel.style.top = (cy + ry) + "px"; }
  }

  /* ---------- small rewards ---------- */
  function stagePoint(x, y) { var r = stage.getBoundingClientRect(); return { x: x - r.left, y: y - r.top }; }
  function drop(el, ms) { fxLayer.appendChild(el); setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, ms); }
  function sparkle(x, y, colour) {
    if (reduced) return;
    var p = stagePoint(x, y);
    for (var i = 0; i < 7; i++) {
      var s = document.createElement("i"), a = Math.random() * Math.PI * 2, d = 34 + Math.random() * 30;
      s.className = "spark";
      s.style.left = p.x + "px"; s.style.top = p.y + "px";
      if (colour) s.style.background = colour;
      s.style.setProperty("--dx", (Math.cos(a) * d).toFixed(0) + "px");
      s.style.setProperty("--dy", (Math.sin(a) * d).toFixed(0) + "px");
      drop(s, 650);
    }
  }
  function puff(x, y) {
    if (reduced) return;
    var p = stagePoint(x, y), el = document.createElement("i");
    el.className = "puff";
    el.style.left = p.x + "px"; el.style.top = p.y + "px";
    drop(el, 600);
  }
  var CONFETTI = ["#ffe07a", "#ff8fb1", "#8fe6d0", "#7fd0ff", "#c5adff", "#ffffff"];
  function confetti(n) {
    if (reduced) return;
    var W = stage.clientWidth, H = stage.clientHeight;
    for (var i = 0; i < n; i++) {
      var c = document.createElement("i"), a = Math.random() * Math.PI * 2, d = 0.25 + Math.random() * 0.4;
      c.className = "conf" + (i % 3 ? "" : " round");
      c.style.background = CONFETTI[i % CONFETTI.length];
      c.style.animationDelay = (Math.random() * 0.15).toFixed(2) + "s";
      c.style.setProperty("--dx", (Math.cos(a) * W * d).toFixed(0) + "px");
      c.style.setProperty("--dy", (Math.sin(a) * H * d + H * 0.1).toFixed(0) + "px");
      c.style.setProperty("--rot", rand(-540, 540) + "deg");
      drop(c, 1700);
    }
  }
  function restart(el, cls) { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); }
  function wiggle(it) { restart(it.el, "wiggle"); }
  function centre(el) { var r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }

  function paintTrophies() {
    var stars = trophiesEl.children;
    for (var i = 0; i < stars.length; i++) stars[i].classList.toggle("won", i < state.trophies);
    trophiesEl.classList.toggle("full", state.trophies >= 5);
  }

  /* ---------- counting ---------- */
  function showCount(n) {
    numeral.textContent = String(n);
    restart(numeral, "bump");
    arabic.innerHTML = '<span class="ar-digit">' + arNum(n) + "</span><span>" + AR_WORDS[n] + "</span>";
    var all = dots.children;
    for (var i = 0; i < all.length; i++) all[i].classList.toggle("on", i < n);
  }

  // Marks one thing as counted: the picture, the sound, the number. Returns when the number has been said.
  function mark(it) {
    var act = currentAct(), n = state.count + 1, c = centre(it.el);
    state.count = n;
    it.counted = true;
    it.n = n;
    it.badge.textContent = String(n);
    it.el.classList.remove("hint");
    it.el.classList.add("counted");
    it.el.setAttribute("aria-label", act.one + " " + n);
    if (act.mech === "fly" && !state.quiz) fly(it);
    fx(act.fx, n - 1);
    sparkle(c.x, c.y, act.mech === "light" ? "#ffe07a" : "#fff");
    showCount(n);
    return sayNumber(n);
  }

  function fly(it) {
    var target = deco.querySelector(".fly-target");
    if (!target) return;
    var a = centre(it.el), b = centre(target), box = target.parentNode, fill = box.querySelector(".basket-fill"), token = state.token;
    it.art.style.transform = "translate(" + Math.round(b.x - a.x) + "px," + Math.round(b.y - a.y) + "px) scale(.28)";
    later(function () {
      if (token !== state.token) return;
      restart(box, "munch");
      if (fill) { var mini = document.createElement("i"); mini.innerHTML = ART.date(); fill.appendChild(mini); }
    }, reduced ? 0 : 430);
  }

  function count(it) {
    var said = mark(it);
    armHint();
    if (state.count < state.target) return;
    if (state.quiz) { showRightAnswer(); return; }
    state.locked = true;
    finish(said);
  }

  // The last number is said in full, then a short breath, then the celebration.
  function finish(said) {
    var token = state.token;
    first(said, wait(3500)).then(function () { return wait(350); }).then(function () {
      if (token === state.token) celebrate();
    });
  }

  function celebrate() {
    var token = state.token, n = state.target, praise = PRAISE[state.praise % PRAISE.length];
    state.praise += 1;
    state.done = true;
    state.nextGuard = now() + 700;
    clearHint();
    stage.classList.add("party");
    panel.classList.remove("asking");
    numeral.className = "numeral big";
    cheerWord.textContent = LINES[praise];
    var flew = currentAct().mech === "fly" && !state.quiz && state.zone;
    nextBtn.style.left = flew ? Math.round((state.zone.l + state.zone.r) / 2) + "px" : "";
    nextBtn.style.top = flew ? Math.round((state.zone.t + state.zone.b) / 2 - 58) + "px" : "";
    nextBtn.style.bottom = flew ? "auto" : "";
    cheer.hidden = false;
    fx("win");
    confetti(22);
    state.trophies += 1;
    paintTrophies();
    if (state.trophies >= 5) later(function () { fx("sparkle"); confetti(30); }, 700);

    // "Five!" once more, because the last number is how many there are; then the praise; then on we go.
    speak("count-" + n).then(function () { return wait(120); }).then(function () {
      if (token !== state.token) return;
      return speak(praise);
    }).then(function () {
      if (token !== state.token) return;
      later(function () { if (token === state.token) goNext(true); }, 2600);
    });
    later(function () { if (token === state.token) goNext(true); }, 12000);   // in case a sound never ends
  }

  function goNext(byItself) {
    if (!state.done) return;
    if (!byItself && now() < state.nextGuard) return;
    if (byItself && (!parents.hidden || document.hidden)) { later(function () { goNext(true); }, 1500); return; }   // wait while a grown-up reads, or the screen is off
    state.done = false;
    if (!byItself) fx("whoosh");
    startRound();
  }

  /* ---------- "How many?" ---------- */
  function answerButton(n) { return answersEl.querySelector('[data-n="' + n + '"]'); }
  function showRightAnswer() { var b = answerButton(state.target); if (b) b.classList.add("pulse"); }

  function answer(btn) {
    if (!state.quiz || state.locked || now() < state.guardUntil) return;
    var n = +btn.getAttribute("data-n");
    if (n !== state.target) {
      // never "wrong": the button steps back and the game counts along with the child
      restart(btn, "nope");
      fx("wilt");
      if (!state.hinting) countAlong();
      return;
    }
    state.locked = true;
    state.hinting = false;
    state.hintToken += 1;
    clearHint();
    btn.classList.remove("pulse");
    btn.classList.add("right");
    state.items.forEach(function (it) {
      if (it.counted) return;
      state.count += 1;
      it.counted = true; it.n = state.count;
      it.badge.textContent = String(state.count);
      it.el.classList.add("counted");
    });
    state.count = state.target;
    panel.classList.remove("asking");
    showCount(state.target);
    fx("coin", 4);
    var c = centre(btn);
    sparkle(c.x, c.y, "#ffe07a");
    finish(sayNumber(state.target));
  }

  // Counts every thing aloud, one by one, then shows which answer that is.
  function countAlong() {
    var token = state.token, mine = ++state.hintToken;
    state.hinting = true;
    clearHint();
    state.items.forEach(function (it) {
      it.counted = false; it.n = 0;
      it.el.classList.remove("counted");
    });
    state.count = 0;
    function live() { return token === state.token && mine === state.hintToken; }
    function step() {
      if (!live()) return;
      if (state.count >= state.target) { state.hinting = false; showRightAnswer(); armHint(); return; }
      both(first(mark(state.items[state.count]), wait(3000)), wait(750)).then(step);
    }
    both(speak("lets-count"), wait(500)).then(step);
  }

  /* ---------- a nudge for a child who has stopped ---------- */
  var hintTimer = null, sayAgainTimer = null;
  function clearHint() {
    clearTimeout(hintTimer); clearTimeout(sayAgainTimer);
    state.items.forEach(function (it) { it.el.classList.remove("hint"); });
  }
  function armHint() {
    clearHint();
    if (state.screen !== "play" || state.done || state.locked || state.hinting) return;
    var token = state.token;
    hintTimer = setTimeout(function () {
      if (token !== state.token || state.done || state.locked || state.hinting) return;
      var left = state.items.filter(function (it) { return !it.counted; });
      if (left.length) left[0].el.classList.add("hint"); else if (state.quiz) showRightAnswer();
    }, 4500);
    sayAgainTimer = setTimeout(function () {
      if (token !== state.token || state.done || state.locked || state.hinting || !parents.hidden) return;
      if (state.count === 0) speak(state.quiz ? "how-many" : currentAct().prompt);
    }, 14000);
  }

  /* ---------- fingers ---------- */
  var POINTER = !!window.PointerEvent;
  // fn(target, x, y) for every finger or mouse button that goes down on el
  function onDown(el, fn) {
    if (POINTER) {
      el.addEventListener("pointerdown", function (e) {
        if (e.pointerType === "mouse" && e.button !== 0) return;
        fn(e.target, e.clientX, e.clientY, e);
      });
    } else {
      el.addEventListener("touchstart", function (e) {
        e.preventDefault();
        for (var i = 0; i < e.changedTouches.length; i++) fn(e.changedTouches[i].target, e.changedTouches[i].clientX, e.changedTouches[i].clientY, e);
      }, { passive: false });
      el.addEventListener("mousedown", function (e) { if (e.button === 0) fn(e.target, e.clientX, e.clientY, e); });
    }
  }
  function onUp(el, fn) {
    (POINTER ? ["pointerup", "pointercancel", "pointerleave"] : ["touchend", "touchcancel", "mouseup", "mouseleave"]).forEach(function (ev) { el.addEventListener(ev, fn); });
  }
  function closest(node, sel) {
    while (node && node.nodeType !== 1) node = node.parentNode;
    return node && node.closest ? node.closest(sel) : null;
  }
  function itemOf(el) { return state.items[+el.getAttribute("data-i")] || null; }

  // A sloppy tap that lands just beside something still counts it.
  function nearest(x, y) {
    var best = null, bestD = Infinity;
    state.items.forEach(function (it) {
      if (it.counted) return;
      var r = it.el.getBoundingClientRect(), slop = 30;
      if (x < r.left - slop || x > r.right + slop || y < r.top - slop || y > r.bottom + slop) return;
      var d = Math.pow(x - (r.left + r.width / 2), 2) + Math.pow(y - (r.top + r.height / 2), 2);
      if (d < bestD) { bestD = d; best = it; }
    });
    return best;
  }

  function tapItem(it, x, y) {
    if (now() < state.guardUntil) { puff(x, y); fx("pour"); return; }
    if (it.counted || state.locked || state.hinting) { wiggle(it); fx("pour", it.n % 5); sparkle(x, y); return; }
    count(it);
  }

  function stageDown(target, x, y) {
    if (state.screen !== "play") return;
    if (closest(target, ".next")) { goNext(false); return; }
    var a = closest(target, ".answer");
    if (a) { answer(a); return; }
    var el = closest(target, ".item"), it = el ? itemOf(el) : null;
    if (!it && !state.locked && !state.hinting && now() >= state.guardUntil) it = nearest(x, y);
    if (it) { tapItem(it, x, y); return; }
    puff(x, y);                     // a tap on nothing still gets a little something
    sparkle(x, y);
    fx("pour", rand(0, 4));
  }
  onDown(stage, stageDown);
  // the keyboard (and switch devices) arrive as a click with no pointer before it
  stage.addEventListener("click", function (e) {
    if (e.detail !== 0) return;
    var r = e.target.getBoundingClientRect();
    stageDown(e.target, r.left + r.width / 2, r.top + r.height / 2);
  });

  /* ---------- press and hold: the way out and the parents' note ---------- */
  var tipTimer = null;
  function showTip(el) {
    var r = el.getBoundingClientRect();
    tip.hidden = false;
    tip.style.left = tip.style.right = "auto";
    if (r.left < window.innerWidth / 2) tip.style.left = Math.max(8, r.left) + "px"; else tip.style.right = Math.max(8, window.innerWidth - r.right) + "px";
    clearTimeout(tipTimer);
    tipTimer = setTimeout(function () { tip.hidden = true; }, 1800);
  }
  function holdButton(el, ms, action) {
    var timer = null;
    el.style.setProperty("--hold", ms + "ms");
    onDown(el, function () {
      clearTimeout(timer);
      el.classList.add("holding");
      timer = setTimeout(function () { timer = null; el.classList.remove("holding"); tip.hidden = true; action(); }, ms);
    });
    onUp(el, function () {
      if (timer) { clearTimeout(timer); timer = null; showTip(el); }
      el.classList.remove("holding");
    });
    el.addEventListener("click", function (e) { e.preventDefault(); if (e.detail === 0) action(); });
  }
  holdButton($("homeBtn"), 1400, function () { window.location.href = $("homeBtn").getAttribute("href"); });
  holdButton($("parentsBtn"), 900, openParents);

  /* ---------- for parents ---------- */
  var SWITCHES = { swVoice: "voice", swSfx: "sfx", swMusic: "music", swArabic: "arabic" };
  var SEGS = { segLittle: 5, segBig: 10, seg15: 15, seg20: 20 };
  function applySettings() {
    music.setMusic(settings.music);
    music.setSfx(settings.sfx);
    body.classList.toggle("no-arabic", !settings.arabic);
    Object.keys(SWITCHES).forEach(function (id) { $(id).setAttribute("aria-checked", settings[SWITCHES[id]] ? "true" : "false"); });
    Object.keys(SEGS).forEach(function (id) { $(id).setAttribute("aria-pressed", state.level === SEGS[id] ? "true" : "false"); });
  }
  Object.keys(SWITCHES).forEach(function (id) {
    $(id).addEventListener("click", function () {
      var key = SWITCHES[id];
      settings[key] = !settings[key];
      persist();
      applySettings();
      if (key === "voice" && !settings.voice) { narr.stop(); music.duck(false); }
    });
  });
  Object.keys(SEGS).forEach(function (id) { $(id).addEventListener("click", function () { state.level = SEGS[id]; applySettings(); }); });
  function openParents() {
    narr.stop();
    music.duck(false);
    parents.hidden = false;
    sheet.scrollTop = 0;
    try { sheet.focus({ preventScroll: true }); } catch (err) { sheet.focus(); }
  }
  function closeParents() {
    if (parents.hidden) return;
    parents.hidden = true;
    armHint();
  }
  $("parentsClose").addEventListener("click", closeParents);
  parents.addEventListener("click", function (e) { if (e.target === parents) closeParents(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeParents(); });

  /* ---------- starting ---------- */
  function startGame(level) {
    if (state.screen === "play") return;
    state.screen = "play";
    state.level = level;
    body.classList.remove("at-start");
    startEl.hidden = true;
    playEl.hidden = false;
    applySettings();
    music.unlock();
    music.mood("wonder");
    fx("sparkle");
    startRound();
  }
  $("startLittle").addEventListener("click", function () { startGame(5); });
  $("startBig").addEventListener("click", function () { startGame(10); });
  $("start15").addEventListener("click", function () { startGame(15); });
  $("start20").addEventListener("click", function () { startGame(20); });

  /* ---------- keeping the page still ---------- */
  function inSheet(e) { return !!closest(e.target, ".sheet"); }
  function stopIt(e) { if (!inSheet(e)) e.preventDefault(); }
  document.addEventListener("contextmenu", stopIt);
  document.addEventListener("selectstart", stopIt);
  document.addEventListener("dragstart", stopIt);
  document.addEventListener("dblclick", stopIt);
  document.addEventListener("gesturestart", function (e) { e.preventDefault(); });
  document.addEventListener("touchmove", stopIt, { passive: false });
  document.addEventListener("wheel", stopIt, { passive: false });
  window.addEventListener("scroll", function () { if (window.pageXOffset || window.pageYOffset) window.scrollTo(0, 0); });

  // sound may only start after a touch: these wake the music engine on the first one
  ["click", "touchend", "keydown"].forEach(function (ev) { document.addEventListener(ev, music.unlock, true); });

  var resizeTimer = null;
  function relayout() { clearTimeout(resizeTimer); resizeTimer = setTimeout(layout, 80); }
  window.addEventListener("resize", relayout);
  window.addEventListener("orientationchange", relayout);

  /* ---------- the first screen ---------- */
  body.classList.add("at-start");
  $("startSky").innerHTML = twinkles(28);
  $("startHero").innerHTML = ART.moon().replace('class="off"', 'class="off" opacity="0"').replace('class="on"', "");
  var pips = document.querySelectorAll("[data-pips]");
  for (var p = 0; p < pips.length; p++) {
    var html = "";
    for (var q = 0; q < +pips[p].getAttribute("data-pips"); q++) html += "<i>" + svg('<polygon points="' + STAR + '" fill="#fff" stroke="rgba(0,0,0,.35)" stroke-width="7" stroke-linejoin="round"/>') + "</i>";
    pips[p].innerHTML = html;
  }
  var th = "";
  for (var t = 0; t < 5; t++) th += '<i class="trophy">' + TROPHY + "</i>";
  trophiesEl.innerHTML = th;
  applySettings();

  // for the tests, and for a curious parent in the console
  window.AsmauCounting = {
    lines: LINES,
    activities: ACT_NAMES.slice(),
    questions: Object.keys(QUIZ),
    // jump straight to one activity with n things (a question when quiz is true)
    show: function (act, n, quiz) {
      if (!(quiz ? QUIZ : ACTS)[act] || !(n >= 1 && n <= (quiz ? 10 : TOP))) return false;
      if (state.screen !== "play") startGame(n > 15 ? 20 : n > 10 ? 15 : n > 5 ? 10 : 5);
      startRound({ act: act, n: n, quiz: !!quiz });
      return true;
    },
    state: function () {
      return {
        screen: state.screen, level: state.level, round: state.round, activity: state.act, quiz: state.quiz,
        target: state.target, count: state.count, done: state.done, locked: state.locked, hinting: state.hinting,
        trophies: state.trophies, settings: { voice: settings.voice, sfx: settings.sfx, music: settings.music, arabic: settings.arabic }
      };
    }
  };
})();
