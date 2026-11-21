#!/usr/bin/env node
/*
  A page for the native speaker who checks a translation: every line and label, English beside the translation,
  each marked right or corrected. Published as a claude.ai artifact (it keeps the answers in the artifact's own
  store, or, without one, lets the checker copy them as text to send back).
    node scripts/lang-review.js <slug> <code> <out.html>
  Afterwards Claude reads the answers back and puts the corrections into lang/<code>/<slug>.json and
  lang/<code>/site.json; when every row is right, the translation's status becomes "checked".
*/
"use strict";
const fs = require("fs"), path = require("path"), vm = require("vm"), crypto = require("crypto");
const ROOT = path.join(__dirname, "..");
const { needs } = require("./lang-strings.js");
const [slug, code, out] = process.argv.slice(2);
if (!out) { console.error("usage: node scripts/lang-review.js <slug> <code> <out.html>"); process.exit(2); }

const dir = path.join(ROOT, "games", slug);
const LF = require("./lang-files.js");
const tr = LF.read(LF.gameFile(code, slug));
Object.keys(tr.lines || {}).forEach((id) => { tr.lines[id] = LF.lineText(tr.lines[id]); });
const ui = LF.read(LF.siteFile(code)) || {};
const lines = JSON.parse(fs.readFileSync(path.join(dir, "narration.json"), "utf8"));
const game = JSON.parse(fs.readFileSync(path.join(dir, "game.json"), "utf8"));
const box = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(dir, "story.js"), "utf8"), box);
const story = box.window.STORY;
const where = {};
story.forEach((ch, ci) => {
  let page = 0;
  ch.steps.forEach((st) => {
    page++;
    const id = st.say || st.line, opts = st.opts || {};
    const tag = "Bab " + (ci + 1) + " · halaman " + (ci + 1) + "." + page;
    if (id) where[id] = tag;
    if (opts.wrong) where[opts.wrong] = tag;
  });
});
const key = (s) => crypto.createHash("sha1").update(s).digest("hex").slice(0, 12);
const kind = (id) => /-opt\d|-it\d|-bin\d|-c\d$/.test(id) ? "jawaban" : /-no$/.test(id) ? "jika salah" : /-q$/.test(id) ? "pertanyaan" : "";
const rows = [];
for (const l of lines) {
  if (l.lang === "ar") continue;
  const base = l.id.replace(/-(opt|it|bin|c)\d+$|-no$/, "");
  rows.push({ k: "line-" + l.id, g: "story", ctx: (where[l.id] || where[base] || (l.id === "end-a" ? "Tamat" : "")) + (kind(l.id) ? " · " + kind(l.id) : ""),
    en: l.text, tr: (tr.lines || {})[l.id] || "" });
}
const n = needs(slug);
for (const s of n.strings) {
  if ((tr.strings || {})[s] !== undefined) rows.push({ k: "str-" + key(s), g: "labels", ctx: "", en: s, tr: tr.strings[s], src: s });
}
const human = (s) => s.replace(/^\^|\$$/g, "").replace(/\\([().+?*\[\]$^])/g, "$1").replace(/\((?:[^()]|\([^)]*\))*\)/g, "…");
for (const [k, v] of Object.entries(ui)) {
  if (k.startsWith("_")) continue;
  const re = k.startsWith("re:");
  rows.push({ k: "ui-" + key(k), g: "ui", ctx: re ? "pola: … adalah angka atau nama" : "", en: re ? human(k.slice(3)) : k,
    tr: re ? v.replace(/\$t?\d/g, "…") : v, src: k });
}
const data = { slug, code, title: game.title, status: tr.status, play: "https://asmau.org/games/" + slug + "/index.html?lang=" + code, rows };

const html = `<title>Periksa Terjemahan ${game.title}</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700&family=Mada:wght@400;500;700&display=swap">
<style>
/* A reading desk: English quiet on the left, the translation large on the right, the answer under it. Asmau's night and gold. */
:root {
  --bg: #fbf6ea; --panel: #fffdf7; --line: #e6dcc6; --fg: #23200f; --muted: #6d6550; --accent: #a86f12; --accent-bg: #f6e3bb;
  --ok: #2f7d5b; --ok-bg: #dff0e6; --fix: #b2541a; --fix-bg: #fbe6d6; --focus: #c98f2b;
  --display: 'Baloo 2', ui-rounded, system-ui, sans-serif; --body: 'Mada', 'Nunito', system-ui, sans-serif;
}
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) {
  --bg: #0c1530; --panel: #15244a; --line: #2a3d6e; --fg: #fdf6e8; --muted: #a9b3cf; --accent: #f0b84b; --accent-bg: #3a3420;
  --ok: #7fd3ad; --ok-bg: #173b33; --fix: #f3a676; --fix-bg: #44291c; --focus: #f0b84b; color-scheme: dark } }
:root[data-theme="dark"] {
  --bg: #0c1530; --panel: #15244a; --line: #2a3d6e; --fg: #fdf6e8; --muted: #a9b3cf; --accent: #f0b84b; --accent-bg: #3a3420;
  --ok: #7fd3ad; --ok-bg: #173b33; --fix: #f3a676; --fix-bg: #44291c; --focus: #f0b84b; color-scheme: dark }
body { background: var(--bg); color: var(--fg); font: 17px/1.5 var(--body); padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); padding-block: 24px 64px; }
.wrap { max-width: 860px; margin: 0 auto; display: grid; gap: 20px; }
h1, h2 { font-family: var(--display); line-height: 1.15; text-wrap: balance; margin: 0; }
h1 { font-size: clamp(28px, 6vw, 40px); }
h2 { font-size: 22px; margin-top: 12px; }
.eyebrow { font-size: 13px; letter-spacing: .08em; text-transform: uppercase; color: var(--accent); font-weight: 700; }
.intro { display: grid; gap: 8px; max-width: 65ch; }
.intro p { margin: 0; }
.intro .en { color: var(--muted); font-size: 15px; }
a { color: var(--accent); }
.play { display: inline-flex; align-items: center; gap: 8px; font-weight: 700; text-decoration: none; background: var(--accent-bg); padding: 10px 16px; border-radius: 12px; width: fit-content; }
.bar { position: sticky; top: env(safe-area-inset-top, 0px); z-index: 5; background: var(--bg); padding-block: 10px; display: grid; gap: 10px; border-bottom: 1px solid var(--line); }
body::before { content: ""; position: fixed; inset: 0 0 auto; height: env(safe-area-inset-top, 0px); z-index: 10; background: var(--bg); }
.meter { height: 8px; border-radius: 4px; background: var(--line); overflow: hidden; display: flex; }
.meter i { display: block; height: 100%; }
.meter .m-ok { background: var(--ok); } .meter .m-fix { background: var(--fix); }
.counts { display: flex; flex-wrap: wrap; gap: 6px 16px; font-size: 15px; color: var(--muted); font-variant-numeric: tabular-nums; }
.counts b { color: var(--fg); }
.filters { display: flex; flex-wrap: wrap; gap: 8px; }
.chip { font: 600 15px var(--body); border: 1px solid var(--line); background: var(--panel); color: var(--fg); border-radius: 999px; padding: 6px 14px; cursor: pointer; }
.chip[aria-pressed="true"] { background: var(--fg); color: var(--bg); border-color: var(--fg); }
.save-state { font-size: 14px; color: var(--muted); }
.rows { display: grid; gap: 12px; }
.row { background: var(--panel); border: 1px solid var(--line); border-radius: 14px; padding: 14px 16px; display: grid; gap: 8px; }
.row[data-v="ok"] { border-color: color-mix(in srgb, var(--ok) 45%, var(--line)); }
.row[data-v="change"] { border-color: color-mix(in srgb, var(--fix) 55%, var(--line)); }
.ctx { font-size: 13px; color: var(--muted); letter-spacing: .02em; }
.pair { display: grid; grid-template-columns: 1fr 1.3fr; gap: 16px; }
@media (max-width: 620px) { .pair { grid-template-columns: 1fr; gap: 6px; } }
.pair > div { min-width: 0; }
.en-t { color: var(--muted); font-size: 15px; }
.tr-t { font-size: 18px; font-weight: 500; }
.lab { display: block; font-size: 12px; text-transform: uppercase; letter-spacing: .08em; color: var(--muted); margin-bottom: 2px; }
.acts { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
.btn { font: 700 15px var(--body); border-radius: 10px; padding: 8px 14px; cursor: pointer; border: 1px solid var(--line); background: transparent; color: var(--fg); }
.btn.ok[aria-pressed="true"] { background: var(--ok-bg); color: var(--ok); border-color: var(--ok); }
.btn.fix[aria-pressed="true"] { background: var(--fix-bg); color: var(--fix); border-color: var(--fix); }
.btn.primary { background: var(--accent); color: var(--bg); border-color: var(--accent); }
.edit { display: grid; gap: 8px; }
.edit label { font-size: 14px; color: var(--muted); }
textarea { width: 100%; box-sizing: border-box; font: 17px/1.45 var(--body); color: var(--fg); background: var(--bg); border: 1px solid var(--line); border-radius: 10px; padding: 10px 12px; resize: vertical; }
button:focus-visible, textarea:focus-visible, a:focus-visible { outline: 3px solid var(--focus); outline-offset: 2px; }
.mine { font-size: 14px; color: var(--fix); }
.empty { color: var(--muted); }
.send { display: grid; gap: 8px; border-top: 1px solid var(--line); padding-top: 16px; }
.send pre { white-space: pre-wrap; word-break: break-word; background: var(--panel); border: 1px solid var(--line); border-radius: 10px; padding: 12px; font-size: 14px; max-height: 260px; overflow: auto; }
@media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
</style>

<div class="wrap">
  <header class="intro">
    <span class="eyebrow">Asmau · Bahasa Indonesia</span>
    <h1>Periksa terjemahan: ${game.title}</h1>
    <p>Terima kasih sudah membantu. Ini adalah permainan cerita untuk anak-anak usia 5 sampai 9 tahun. Bacalah setiap baris
      bahasa Indonesia. Jika sudah benar dan wajar untuk anak-anak, tekan <b>✓ Benar</b>. Jika perlu diubah, tekan
      <b>✎ Perbaiki</b>, lalu tulis kalimat yang lebih baik.</p>
    <p>Anda juga bisa memainkan permainannya dalam bahasa Indonesia (dengan suara) untuk mendengar bagaimana kalimatnya dibacakan:</p>
    <a class="play" href="${data.play}" target="_blank" rel="noopener">▶ Mainkan versi bahasa Indonesia</a>
    <p class="en">For the native speaker checking the Indonesian: mark each line right, or correct it. The game itself (with the
      Indonesian voices) opens with the link above. Nothing is shown to families until every line is checked.</p>
  </header>

  <div class="bar" role="region" aria-label="Kemajuan">
    <div class="meter" aria-hidden="true"><i class="m-ok" id="mOk"></i><i class="m-fix" id="mFix"></i></div>
    <div class="counts" id="counts"></div>
    <div class="filters" role="group" aria-label="Tampilkan">
      <button class="chip" data-f="todo" aria-pressed="true">Belum diperiksa</button>
      <button class="chip" data-f="change" aria-pressed="false">Perlu diubah</button>
      <button class="chip" data-f="all" aria-pressed="false">Semua</button>
    </div>
    <div class="save-state" id="saveState">Memuat…</div>
  </div>

  <main id="main"></main>

  <section class="send" aria-labelledby="sendH">
    <h2 id="sendH">Kirim koreksi Anda</h2>
    <p id="sendTxt">Jawaban Anda tersimpan otomatis di halaman ini. Jika halaman ini tidak bisa menyimpan (misalnya Anda tidak masuk/login), salin teks di bawah ini dan kirimkan kepada kami.</p>
    <div class="acts"><button class="btn primary" id="copyBtn" type="button">Salin semua jawaban</button><span class="save-state" id="copyState"></span></div>
    <pre id="dump"></pre>
  </section>
</div>

<script id="data" type="application/json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>
<script>
(function () {
  "use strict";
  var D = JSON.parse(document.getElementById("data").textContent);
  var GROUPS = { story: "Cerita: kalimat yang dibacakan", labels: "Judul dan tulisan di layar", ui: "Tombol dan tulisan di semua permainan" };
  var answers = {}, filter = "todo", db = null, me = null, LS = "asmau-review-" + D.slug + "-" + D.code;
  try { answers = JSON.parse(localStorage.getItem(LS) || "{}") || {}; } catch (e) { answers = {}; }
  var open = {};

  function el(t, c, txt) { var n = document.createElement(t); if (c) n.className = c; if (txt != null) n.textContent = txt; return n; }
  function verdict(r) { return answers[r.k] && answers[r.k].verdict; }

  function counts() {
    var ok = 0, ch = 0, n = D.rows.length;
    D.rows.forEach(function (r) { var v = verdict(r); if (v === "ok") ok++; else if (v === "change") ch++; });
    document.getElementById("mOk").style.width = (ok / n * 100) + "%";
    document.getElementById("mFix").style.width = (ch / n * 100) + "%";
    var c = document.getElementById("counts");
    c.innerHTML = "";
    [["Benar", ok], ["Perlu diubah", ch], ["Belum diperiksa", n - ok - ch], ["Jumlah", n]].forEach(function (x) {
      var s = el("span"); s.appendChild(el("b", "", String(x[1]))); s.appendChild(document.createTextNode(" " + x[0].toLowerCase())); c.appendChild(s);
    });
    dump();
  }

  function dump() {
    var out = ["Asmau · " + D.title + " · " + D.code, ""];
    D.rows.forEach(function (r) {
      var a = answers[r.k]; if (!a) return;
      if (a.verdict === "ok") out.push("✓ " + r.k);
      else out.push("✎ " + r.k + "\\n   EN: " + r.en + "\\n   ID: " + r.tr + "\\n   BARU: " + (a.text || "") + (a.note ? "\\n   CATATAN: " + a.note : ""));
    });
    document.getElementById("dump").textContent = out.length > 2 ? out.join("\\n") : "Belum ada jawaban.";
  }

  function store(r, a) {
    a.at = Date.now();
    answers[r.k] = a;
    try { localStorage.setItem(LS, JSON.stringify(answers)); } catch (e) { /* this visit only */ }
    counts();
    if (!db) return;
    var s = document.getElementById("saveState");
    s.textContent = "Menyimpan…";
    db.doc("reviews/" + r.k).set({ verdict: a.verdict, text: a.text || "", note: a.note || "", at: a.at, by: me || "" })
      .then(function () { s.textContent = "✓ Tersimpan"; })
      .catch(function () { s.textContent = "Tidak bisa menyimpan di sini. Jawaban tetap ada di perangkat ini; salin dan kirimkan (di bawah)."; });
  }

  function rowEl(r) {
    var a = answers[r.k] || {}, box = el("article", "row");
    box.setAttribute("data-v", a.verdict || "");
    if (r.ctx) box.appendChild(el("div", "ctx", r.ctx));
    var pair = el("div", "pair"), en = el("div"), tr = el("div");
    en.appendChild(el("span", "lab", "English")); en.appendChild(el("div", "en-t", r.en));
    tr.appendChild(el("span", "lab", "Bahasa Indonesia")); var t = el("div", "tr-t", r.tr); t.lang = "id"; tr.appendChild(t);
    pair.appendChild(en); pair.appendChild(tr); box.appendChild(pair);
    if (a.verdict === "change" && a.text && !open[r.k]) box.appendChild(el("div", "mine", "Usulan Anda: " + a.text));
    var acts = el("div", "acts");
    var ok = el("button", "btn ok", "✓ Benar"); ok.type = "button"; ok.setAttribute("aria-pressed", String(a.verdict === "ok"));
    var fx = el("button", "btn fix", "✎ Perbaiki"); fx.type = "button"; fx.setAttribute("aria-pressed", String(a.verdict === "change"));
    ok.addEventListener("click", function () { delete open[r.k]; store(r, { verdict: "ok" }); render(); });
    fx.addEventListener("click", function () { open[r.k] = true; render(); var ta = document.getElementById("ta-" + r.k); if (ta) ta.focus(); });
    acts.appendChild(ok); acts.appendChild(fx); box.appendChild(acts);
    if (open[r.k]) {
      var ed = el("div", "edit");
      var l1 = el("label", "", "Kalimat yang lebih baik"); l1.htmlFor = "ta-" + r.k;
      var ta = el("textarea"); ta.id = "ta-" + r.k; ta.rows = 3; ta.lang = "id"; ta.value = a.text || r.tr;
      var l2 = el("label", "", "Catatan (tidak wajib)"); l2.htmlFor = "nt-" + r.k;
      var nt = el("textarea"); nt.id = "nt-" + r.k; nt.rows = 2; nt.value = a.note || "";
      var sv = el("button", "btn primary", "Simpan"); sv.type = "button";
      sv.addEventListener("click", function () { delete open[r.k]; store(r, { verdict: "change", text: ta.value.trim(), note: nt.value.trim() }); render(); });
      ed.appendChild(l1); ed.appendChild(ta); ed.appendChild(l2); ed.appendChild(nt); ed.appendChild(sv);
      box.appendChild(ed);
    }
    return box;
  }

  function render() {
    var main = document.getElementById("main"); main.innerHTML = "";
    var shown = 0;
    Object.keys(GROUPS).forEach(function (g) {
      var rs = D.rows.filter(function (r) {
        if (r.g !== g) return false;
        var v = verdict(r);
        return open[r.k] || filter === "all" || (filter === "todo" && !v) || (filter === "change" && v === "change");
      });
      if (!rs.length) return;
      main.appendChild(el("h2", "", GROUPS[g]));
      var list = el("div", "rows"); rs.forEach(function (r) { list.appendChild(rowEl(r)); }); main.appendChild(list);
      shown += rs.length;
    });
    if (!shown) main.appendChild(el("p", "empty", filter === "todo" ? "Semua baris sudah diperiksa. Terima kasih!" : "Tidak ada baris di sini."));
  }

  Array.prototype.forEach.call(document.querySelectorAll(".chip"), function (c) {
    c.addEventListener("click", function () {
      filter = c.getAttribute("data-f");
      Array.prototype.forEach.call(document.querySelectorAll(".chip"), function (x) { x.setAttribute("aria-pressed", String(x === c)); });
      render();
    });
  });
  document.getElementById("copyBtn").addEventListener("click", function () {
    var txt = document.getElementById("dump").textContent, st = document.getElementById("copyState");
    var sel = function () { var r = document.createRange(); r.selectNodeContents(document.getElementById("dump")); var s = getSelection(); s.removeAllRanges(); s.addRange(r); st.textContent = "Teks sudah dipilih: salin dengan Ctrl+C atau tekan lama."; };
    try { navigator.clipboard.writeText(txt).then(function () { st.textContent = "✓ Tersalin"; }, sel); } catch (e) { sel(); }
  });

  counts(); render();
  document.getElementById("saveState").textContent = "Jawaban disimpan di perangkat ini.";

  // the artifact's own store: answers reach Asmau directly, and a second visit (or another device) sees them
  if (window.claude && window.claude.use) {
    Promise.all([window.claude.use("db"), window.claude.use("user")]).then(function (r) {
      db = r[0]; var user = r[1];
      if (!db) return;
      var timer = setTimeout(function () { document.getElementById("saveState").textContent = "Jawaban disimpan di perangkat ini."; }, 10000);
      if (user && user.id) user.id().then(function (id) { me = id; }).catch(function () {});
      db.collection("reviews").limit(1000).onSnapshot(function (snap) {
        clearTimeout(timer);
        var docs = snap.docs || [];
        docs.forEach(function (d) {
          var v = d.data ? d.data() : d.data, id = d.id;
          if (v && (!answers[id] || (v.at || 0) >= (answers[id].at || 0))) answers[id] = v;
        });
        try { localStorage.setItem(LS, JSON.stringify(answers)); } catch (e) { /* */ }
        document.getElementById("saveState").textContent = "✓ Jawaban tersimpan untuk Asmau.";
        counts(); if (!Object.keys(open).length) render();      // never redraw over a correction being typed
      }, function () {
        clearTimeout(timer);
        db = null;
        document.getElementById("saveState").textContent = "Jawaban disimpan di perangkat ini. Salin dan kirimkan (di bawah).";
      });
    }).catch(function () {});
  }
})();
</script>
`;
fs.writeFileSync(out, html);
console.log(out + ": " + rows.length + " rows (" + rows.filter((r) => r.g === "story").length + " lines)");
