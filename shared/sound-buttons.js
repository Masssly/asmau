/*
  Asmau: the three sound buttons (🎵 music, 🍃 the sounds of the place and the effects, 🗣️ the voice).

  Each tap makes that sound one step louder; after the loudest it goes to off, and the next tap starts again
  from the quietest. A ring around the button shows the level, and a small label says it ("Voice 60%"). The
  level is kept on this device for every game (shared/music.js stores it); 0 means off.

  Use: give a button data-sound-btn="music" (or "sounds", "voice"), or put <div data-sound-levels></div> on a
  page to get the three buttons with their names (the For parents pages). Load after shared/music.js.
  Pages that care (the story player) listen for the "asmau-sound" event: { kind, level }.

  On an iPhone or iPad the browser does not let a page set how loud the voice is, so there the voice button
  only switches it on and off; the device's own volume buttons set its loudness.
*/
(function () {
  "use strict";
  var music = window.AsmauMusic;
  if (!music || !music.setLevel) return;
  var STEP = 0.1;                                    // ten steps from the quietest to the loudest
  var NAMES = { music: "Music", sounds: "Sounds", voice: "Voice" };
  var ICONS = { music: "🎵", sounds: "🍃", voice: "🗣️" };
  var LONG = { music: "Music", sounds: "Sounds of the place and effects", voice: "Voice (the story reader)" };
  var iphone = /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  var css = "" +
    "[data-sound-btn]{position:relative}" +
    "[data-sound-btn]::before{content:'';position:absolute;inset:-3px;border-radius:50%;pointer-events:none;" +
    "background:conic-gradient(#f0b84b calc(var(--lvl,1)*360deg),rgba(255,255,255,.16) 0);" +
    "-webkit-mask:radial-gradient(farthest-side,transparent calc(100% - 4px),#000 calc(100% - 3px));" +
    "mask:radial-gradient(farthest-side,transparent calc(100% - 4px),#000 calc(100% - 3px))}" +
    "[data-sound-btn].off{opacity:.55}" +
    ".snd-toast{position:fixed;z-index:2147482000;left:50%;top:calc(78px + env(safe-area-inset-top,0px));transform:translateX(-50%);" +
    "background:#fdf6e8;color:#1b1530;font:800 16px var(--font-display,system-ui,sans-serif);padding:8px 16px;border-radius:99px;" +
    "box-shadow:0 6px 18px rgba(0,0,0,.35);pointer-events:none;transition:opacity .3s ease;max-width:calc(100% - 32px);text-align:center}" +
    ".snd-toast.hide{opacity:0}" +
    ".snd-levels{display:flex;flex-wrap:wrap;gap:14px 18px;margin:10px 0 14px}" +
    ".snd-levels .snd-item{display:flex;align-items:center;gap:10px;font-size:14px}" +
    ".snd-levels .snd-item button{width:52px;height:52px;border-radius:50%;border:0;background:rgba(255,255,255,.1);font-size:24px;cursor:pointer}" +
    ".snd-levels .snd-item button:focus-visible{outline:3px solid #f0b84b;outline-offset:3px}" +
    ".snd-levels .snd-val{font-variant-numeric:tabular-nums;opacity:.85}" +
    ".snd-note{font-size:13px;opacity:.8;margin:0 0 10px}";
  var st = document.createElement("style"); st.textContent = css; (document.head || document.documentElement).appendChild(st);

  function level(kind) { return Math.max(0, Math.min(1, music.level(kind))); }
  function pct(v) { return Math.round(v * 100); }
  function label(kind, v) { return v ? NAMES[kind] + " " + pct(v) + "%" : NAMES[kind] + " off"; }
  function next(kind) {
    var v = level(kind);
    if (kind === "voice" && iphone) return v > 0 ? 0 : 1;
    if (v >= 1 - 1e-6) return 0;                         // after the loudest: off
    return Math.min(1, Math.round((Math.floor(v / STEP + 1e-6) + 1) * STEP * 100) / 100);
  }

  function paint(btn) {
    var kind = btn.getAttribute("data-sound-btn"), v = level(kind);
    btn.style.setProperty("--lvl", String(v));
    btn.classList.toggle("off", v === 0);
    btn.setAttribute("aria-label", label(kind, v) + ". Tap to make it louder; after the loudest it turns off.");
    var val = btn.parentNode && btn.parentNode.querySelector && btn.parentNode.querySelector(".snd-val[data-for='" + kind + "']");
    if (val) val.textContent = v ? pct(v) + "%" : "off";
  }
  function paintAll() { Array.prototype.forEach.call(document.querySelectorAll("[data-sound-btn]"), paint); }

  var toastEl = null, toastTimer = 0;
  function toast(msg) {
    if (!toastEl) { toastEl = document.createElement("div"); toastEl.className = "snd-toast hide"; toastEl.setAttribute("role", "status"); document.body.appendChild(toastEl); }
    toastEl.textContent = msg;
    toastEl.classList.remove("hide");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.add("hide"); }, 1400);
  }

  function tap(kind) {
    var v = next(kind);
    try { music.unlock(); } catch (e) { /* sound starts on a later tap */ }
    music.setLevel(kind, v);
    paintAll();
    toast(ICONS[kind] + " " + label(kind, v) + (kind === "voice" && iphone && v ? " (use the volume buttons for how loud)" : ""));
    if (kind === "sounds" && v) { try { music.fx("sparkle"); } catch (e) { /* no sound yet */ } }
    window.dispatchEvent(new CustomEvent("asmau-sound", { detail: { kind: kind, level: v } }));
  }

  document.addEventListener("click", function (e) {
    var b = e.target.closest ? e.target.closest("[data-sound-btn]") : null;
    if (!b) return;
    e.preventDefault();
    tap(b.getAttribute("data-sound-btn"));
  });

  // For parents: the three buttons with their names and levels
  function build(box) {
    box.classList.add("snd-levels");
    box.innerHTML = "";
    ["voice", "sounds", "music"].forEach(function (kind) {
      var item = document.createElement("div"); item.className = "snd-item";
      var b = document.createElement("button"); b.type = "button"; b.setAttribute("data-sound-btn", kind); b.textContent = ICONS[kind];
      var t = document.createElement("span"); t.innerHTML = "<strong></strong><br><span class='snd-val' data-for='" + kind + "'></span>";
      t.querySelector("strong").textContent = LONG[kind];
      item.appendChild(b); item.appendChild(t); box.appendChild(item);
    });
    var note = document.createElement("p"); note.className = "snd-note";
    note.textContent = "Tap a button to make it louder, one step at a time; after the loudest it turns off. The same buttons are at the top of every story, and the levels are kept on this device for every game." +
      (iphone ? " On an iPhone or iPad the voice button only turns the voice on or off: use the device's own volume buttons for how loud it is." : "");
    box.parentNode.insertBefore(note, box.nextSibling);
  }
  // The little ones' games: one small 🔊 in the corner. A grown-up presses and holds it, and the three buttons
  // unfold beside it; they fold away again after a few quiet seconds. A child's quick tap only says
  // "Grown-ups: press and hold", so the game is not disturbed. Put <div data-sound-dock></div> where it goes.
  var HOLD_MS = 700, IDLE_MS = 5000;
  var dockCss = "" +
    "[data-sound-dock]{position:relative;display:inline-flex;align-items:center}" +
    ".snd-dock-btn{width:44px;height:44px;border-radius:50%;border:0;background:rgba(255,255,255,.1);color:inherit;font-size:20px;" +
    "cursor:pointer;position:relative;overflow:hidden;touch-action:none;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}" +
    ".snd-dock-btn::after{content:'';position:absolute;inset:0;border-radius:50%;background:rgba(240,184,75,.45);transform:scale(0)}" +
    ".snd-dock-btn.holding::after{transform:scale(1);transition:transform " + HOLD_MS + "ms linear}" +
    ".snd-dock-btn:focus-visible{outline:3px solid #f0b84b;outline-offset:2px}" +
    ".snd-tray{position:absolute;top:calc(100% + 8px);right:0;z-index:50;display:flex;gap:10px;padding:10px;border-radius:99px;" +
    "background:#15244a;border:1px solid #2d3f74;box-shadow:0 10px 24px rgba(0,0,0,.45)}" +
    ".snd-tray[hidden]{display:none}" +
    ".snd-tray button{width:48px;height:48px;border-radius:50%;border:0;background:rgba(255,255,255,.1);font-size:22px;cursor:pointer}";
  var ds = document.createElement("style"); ds.textContent = dockCss; (document.head || document.documentElement).appendChild(ds);
  function dock(box) {
    box.innerHTML = "";
    var btn = document.createElement("button");
    btn.type = "button"; btn.className = "snd-dock-btn"; btn.textContent = "🔊";
    btn.setAttribute("aria-label", "Sound and volume, for grown-ups (press and hold)");
    btn.setAttribute("aria-expanded", "false");
    var tray = document.createElement("div"); tray.className = "snd-tray"; tray.hidden = true; tray.setAttribute("role", "group"); tray.setAttribute("aria-label", "Sound and volume");
    ["voice", "sounds", "music"].forEach(function (kind) {
      var b = document.createElement("button"); b.type = "button"; b.setAttribute("data-sound-btn", kind); b.textContent = ICONS[kind]; tray.appendChild(b);
    });
    box.appendChild(btn); box.appendChild(tray);
    var holdTimer = null, idle = null;
    function fold() { tray.hidden = true; btn.setAttribute("aria-expanded", "false"); clearTimeout(idle); }
    function rest() { clearTimeout(idle); idle = setTimeout(fold, IDLE_MS); }
    function unfold() { tray.hidden = false; btn.setAttribute("aria-expanded", "true"); paintAll(); rest(); }
    btn.addEventListener("pointerdown", function (e) {
      e.preventDefault();
      if (!tray.hidden) { fold(); return; }
      btn.classList.add("holding");
      holdTimer = setTimeout(function () { holdTimer = null; btn.classList.remove("holding"); unfold(); }, HOLD_MS);
    });
    function up() {
      btn.classList.remove("holding");
      if (holdTimer) { clearTimeout(holdTimer); holdTimer = null; toast("🔊 Grown-ups: press and hold"); }
    }
    ["pointerup", "pointercancel", "pointerleave"].forEach(function (ev) { btn.addEventListener(ev, up); });
    btn.addEventListener("contextmenu", function (e) { e.preventDefault(); });
    // the keyboard (Enter or Space) opens it straight away: a child does not use one
    btn.addEventListener("click", function (e) { if (e.detail === 0) { if (tray.hidden) unfold(); else fold(); } });
    tray.addEventListener("click", rest);
    document.addEventListener("pointerdown", function (e) { if (!tray.hidden && !box.contains(e.target)) fold(); }, true);
  }

  function init() {
    Array.prototype.forEach.call(document.querySelectorAll("[data-sound-levels]"), build);
    Array.prototype.forEach.call(document.querySelectorAll("[data-sound-dock]"), dock);
    paintAll();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
  window.AsmauSound = { level: level, paint: paintAll, tap: tap };
})();
