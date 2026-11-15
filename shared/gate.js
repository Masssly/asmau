/* Asmau: the grown-up check, and the app mode.

   Grown-up check: any link that leaves Asmau (another website, an email address) first asks a grown-up to
   answer a sum written in words, such as "What is seven times eight?". A child who taps by chance cannot get
   past it; a parent can in a moment. Required by Apple's Kids category, and sensible on the website too.
   It works for every link on the page, including the ones the story writes later (the verse links).

   App mode: the store apps open the site as index.html?app=ios (or android, huawei). The device remembers it
   (?app=web forgets it). In app mode, html gets data-asmau-app, and everything marked .web-only (the donation
   links and passages) is hidden; .app-only shows instead. The apps carry no donation link at all. */
(function () {
  "use strict";
  var root = document.documentElement;

  // ---- app mode ----
  var KEY = "asmau-app", app = null;
  try {
    var m = /[?&]app=(ios|android|huawei|web)\b/.exec(location.search);
    if (m) { if (m[1] === "web") localStorage.removeItem(KEY); else localStorage.setItem(KEY, m[1]); }
    app = localStorage.getItem(KEY);
  } catch (e) { /* private mode: the website as usual */ }
  if (!app && window.Capacitor) app = "app";
  if (app) root.setAttribute("data-asmau-app", app);
  window.AsmauApp = app;

  // ---- grown-up check ----
  var WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
  var css = "" +
    ".agate-back{position:fixed;inset:0;z-index:2147483000;background:rgba(6,10,26,.78);display:grid;place-items:center;" +
    "padding:16px max(16px,env(safe-area-inset-right,0px)) 16px max(16px,env(safe-area-inset-left,0px))}" +
    ".agate-box{background:#fdf6e8;color:#1b1530;border-radius:22px;padding:22px 22px 18px;width:min(420px,100%);" +
    "box-shadow:0 20px 50px rgba(0,0,0,.5);font-family:var(--font-body,system-ui,sans-serif);text-align:center}" +
    ".agate-box h2{font-family:var(--font-display,system-ui,sans-serif);font-size:24px;margin:0 0 6px}" +
    ".agate-box p{margin:0 0 12px;font-size:15px;line-height:1.45;color:#3b3550}" +
    ".agate-q{font-family:var(--font-display,system-ui,sans-serif);font-size:22px;font-weight:800;color:#1b1530;margin:4px 0 10px}" +
    ".agate-box input{font:700 26px var(--font-display,system-ui,sans-serif);width:120px;text-align:center;padding:8px;" +
    "border:2px solid #c98f2b;border-radius:14px;background:#fff;color:#1b1530}" +
    ".agate-box input:focus{outline:3px solid #f0b84b;outline-offset:2px}" +
    ".agate-err{min-height:20px;font-size:14px;color:#a3321e;margin:8px 0 4px}" +
    ".agate-row{display:flex;gap:10px;justify-content:center;margin-top:6px}" +
    ".agate-row button{font:800 18px var(--font-display,system-ui,sans-serif);border:0;border-radius:16px;padding:12px 20px;cursor:pointer}" +
    ".agate-go{background:linear-gradient(180deg,#ffe48a,#f5a524);color:#2b1a05}" +
    ".agate-no{background:#e4e0ef;color:#1b1530}" +
    ".agate-row button:focus-visible{outline:3px solid #4a63c9;outline-offset:2px}";

  function leaves(a) {
    var href = a.getAttribute("href");
    if (!href || href.charAt(0) === "#") return false;
    if (/^(mailto|tel|sms):/i.test(href)) return true;
    try { return new URL(href, location.href).origin !== location.origin; } catch (e) { return false; }
  }

  var open = null;
  function ask(go) {
    if (open) return;
    if (!document.getElementById("agate-style")) {
      var st = document.createElement("style"); st.id = "agate-style"; st.textContent = css; document.head.appendChild(st);
    }
    var back = document.createElement("div"), x, y, before = document.activeElement;
    back.className = "agate-back";
    back.innerHTML = '<div class="agate-box" role="dialog" aria-modal="true" aria-labelledby="agate-h">' +
      '<h2 id="agate-h">Ask a grown-up</h2>' +
      '<p>This opens a page outside Asmau. Grown-ups: type the answer to carry on.</p>' +
      '<div class="agate-q" id="agate-q"></div>' +
      '<input id="agate-a" type="text" inputmode="numeric" pattern="[0-9]*" autocomplete="off" aria-labelledby="agate-q">' +
      '<div class="agate-err" id="agate-err" aria-live="polite"></div>' +
      '<div class="agate-row"><button type="button" class="agate-no" id="agate-no">Cancel</button>' +
      '<button type="button" class="agate-go" id="agate-go">Continue</button></div></div>';
    function q(id) { return back.querySelector("#" + id); }
    function newSum() {
      x = 3 + Math.floor(Math.random() * 7); y = 3 + Math.floor(Math.random() * 7);
      q("agate-q").textContent = "What is " + WORDS[x] + " times " + WORDS[y] + "?";
      q("agate-a").value = "";
    }
    function close() { document.removeEventListener("keydown", key, true); back.remove(); open = null; if (before && before.focus) before.focus(); }
    function check() {
      if (parseInt(q("agate-a").value, 10) === x * y) { close(); go(); return; }
      q("agate-err").textContent = "That is not it. Here is another one.";
      newSum(); q("agate-a").focus();
    }
    function key(e) {
      if (e.key === "Escape") { e.preventDefault(); close(); }
      else if (e.key === "Enter" && document.activeElement === q("agate-a")) { e.preventDefault(); check(); }
    }
    newSum();
    q("agate-go").addEventListener("click", check);
    q("agate-no").addEventListener("click", close);
    back.addEventListener("click", function (e) { if (e.target === back) close(); });
    document.addEventListener("keydown", key, true);
    document.body.appendChild(back);
    open = back;
    q("agate-a").focus();
  }

  function guard(e) {
    var a = e.target.closest ? e.target.closest("a[href]") : null;
    if (!a || !leaves(a)) return;
    e.preventDefault();
    e.stopPropagation();
    var href = a.href, blank = a.target === "_blank" || e.button === 1 || e.metaKey || e.ctrlKey || e.shiftKey;
    ask(function () {
      if (!blank) { location.href = href; return; }
      var w = window.open(href, "_blank");            // opened from the Continue tap, so it is not blocked
      if (w) w.opener = null; else location.href = href;
    });
  }
  document.addEventListener("click", guard, true);       // taps and clicks, with or without keys held
  document.addEventListener("auxclick", guard, true);    // the middle mouse button

  window.AsmauGate = { ask: ask };
})();
