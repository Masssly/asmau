/*
  Languages. English is the site's own language and the default; a family can choose another in For parents
  (localStorage "asmau-lang"). English stays in the code and the files as it is: a translation is a dictionary,
  English text -> translated text, and this script swaps the English on screen for the chosen language as pages are
  drawn (MutationObserver), so pictures, activities and page numbers never change.

    lang/<code>/site.json          the buttons and labels shared by every page (lang/README.md, for translators)
    lang/<code>/<slug>.json        a game's lines and labels: { "status": "draft"|"checked", "lines": { id: { en, t } },
                                   "strings": { en: tr } } (lines by their id in narration.json; titles, labels by English)
  A device downloads only the language in use: each language is its own pack, "core@<code>" (scripts/build-offline.js).
                                   A draft is shown only with ?lang=<code> in the address (for the person checking it);
                                   families see a game in a language only once it is "checked".
  Keys starting with "re:" are patterns: "re:^Chapter (\\d+)$": "Bab $1"; "$t1" puts a part back translated.

    AsmauLang.code()               the chosen language ("en", "id", ...)
    AsmauLang.ready()              a promise: the dictionaries are loaded
    AsmauLang.t(text)              the translation of a piece of English text (or the text itself)
    AsmauLang.has(slug)            whether the game is shown in the chosen language
    AsmauLang.voicePack(v)         the pack suffix of the narration to use: "w"/"m" in English, "id-w"/"id-m" in Indonesian
*/
window.AsmauLang = (function () {
  "use strict";
  var me = document.currentScript ? document.currentScript.src : location.href;
  var root = new URL("../", me);
  var q = /[?&]lang=([a-z]{2,3})\b/.exec(location.search), preview = !!q;
  function stored() { try { return localStorage.getItem("asmau-lang") || "en"; } catch (e) { return "en"; } }
  var lang = q ? q[1] : stored();
  var dict = {}, pats = [], gameOk = {}, gameLines = {}, gameVoices = {}, gameNotes = {}, made = {};

  function add(strings) {
    Object.keys(strings || {}).forEach(function (k) {
      if (k.charAt(0) === "_" || k === "status" || !strings[k]) return;  // notes for people, and words not translated yet
      if (k.indexOf("re:") === 0) { try { pats.push([new RegExp(k.slice(3)), strings[k]]); } catch (e) { /* a bad pattern is skipped */ } }
      else { dict[norm(k)] = strings[k]; made[norm(strings[k])] = 1; }
    });
  }
  function norm(s) { return String(s).replace(/\s+/g, " ").trim(); }
  function getJSON(u) { return fetch(u).then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; }); }

  var here = new URL(location.href).href.indexOf(root.href) === 0 ? location.href.slice(root.href.length) : "";
  // the game this page is (games/<slug>/), or is about (?g=<slug>: its notes on one page, its recorder)
  var g = /^games\/([^/]+)\//.exec(here), own = !!g;
  if (!g) g = /[?&]g=([a-z0-9-]+)/.exec(location.search);
  var slug = g ? g[1] : null;
  var ready = lang === "en" ? Promise.resolve() : Promise.all([
    getJSON(new URL("lang/" + lang + "/site.json", root).href).then(function (d) { if (d) add(d); }),
    slug ? getJSON(new URL("lang/" + lang + "/" + slug + ".json", root).href).then(function (d) {
      if (d && (d.status === "checked" || preview)) { add(d.strings); gameLines = {}; Object.keys(d.lines || {}).forEach(function (id) { var v = d.lines[id]; var tx = v && typeof v === "object" ? v.t : v; if (tx) gameLines[id] = tx; }); gameVoices[slug] = d.voices || []; gameOk[slug] = true;
        // the notes for parents, page by page ("notes": { "1.5": { en, t } })
        Object.keys(d.notes || {}).forEach(function (k) { var v = d.notes[k], tx = v && typeof v === "object" ? v.t : v; if (tx) gameNotes[k] = tx; }); }
    }) : null
  ]).then(function () {
    if (own && !gameOk[slug]) { dict = {}; pats = []; }         // a game not (yet) in this language stays wholly English
  });

  // a family in another language keeps all its words on this device (one small pack), so it works without internet
  if (lang !== "en" && !preview) {
    try {
      if (navigator.serviceWorker && navigator.serviceWorker.controller) navigator.serviceWorker.controller.postMessage({ type: "asmau-want", packs: ["core@" + lang] });
    } catch (e) { /* no service worker: the words are fetched as pages need them */ }
  }

  function t(text) {
    if (lang === "en" || text == null) return text;
    var k = norm(text);
    if (!k || made[k]) return text;                                // already translated (never translate twice)
    if (dict[k] !== undefined) return dict[k];
    for (var i = 0; i < pats.length; i++) {
      var m = pats[i][0].exec(k);
      // "$1" puts a part back as it is; "$t1" puts it back translated ("Source: $t1")
      if (m) return pats[i][1].replace(/\$(t?)(\d)/g, function (_, tr, n) { var g = m[+n] || ""; return tr ? t(g) : g; });
    }
    return text;
  }

  // a game in this language with no computer voice yet: read nothing aloud (the default), or the English voice
  // (localStorage "asmau-voice-fallback" = "en"; owner, 21 November 2026). Recordings play either way.
  function fallback() { try { return localStorage.getItem("asmau-voice-fallback") === "en" ? "en" : "silent"; } catch (e) { return "silent"; } }

  // swap English on screen: text nodes, and the words people hear or read in attributes. A sentence with a link or a bold
  // word inside it is translated whole, as its HTML (its key is the element's inner HTML, spaces folded), so a language
  // can put the bold word where its grammar needs it; only for plain inline markup, so no script's handle is lost
  var ATTRS = ["aria-label", "placeholder", "title", "alt"];
  var INLINE = { A: 1, STRONG: 1, B: 1, EM: 1, I: 1, BR: 1, SPAN: 1, SMALL: 1, CODE: 1, KBD: 1, ABBR: 1, SUP: 1, SUB: 1, U: 1, MARK: 1, Q: 1, BDI: 1 };
  function htmlKey(el) {
    if (!el.firstElementChild || el.nodeName === "SCRIPT" || el.nodeName === "STYLE") return null;
    var words = false;
    for (var c = el.firstChild; c; c = c.nextSibling) if (c.nodeType === 3 && /[A-Za-z]{2}/.test(c.nodeValue)) { words = true; break; }
    if (!words) return null;
    var all = el.getElementsByTagName("*");
    for (var i = 0; i < all.length; i++) {
      var e = all[i];
      if (!INLINE[e.nodeName] || e.id) return null;
      for (var j = 0; j < e.attributes.length; j++) { var an = e.attributes[j].name; if (/^(data-|on)/.test(an) && an !== "data-gate") return null; }
    }
    return norm(el.innerHTML);
  }
  function swap(node) {
    if (node.nodeType === 3) {
      var v = node.nodeValue, k = norm(v);
      // the text as written may wrap over lines in the page's code: keep its leading and trailing space, swap the rest
      if (k && k.length < 600) { var tr = t(k); if (tr !== k) { var w = /^(\s*)[\s\S]*?(\s*)$/.exec(v); node.nodeValue = w[1] + tr + w[2]; } }
      return;
    }
    if (node.nodeType !== 1 || node.nodeName === "SCRIPT" || node.nodeName === "STYLE") return;
    ATTRS.forEach(function (a) { if (node.hasAttribute && node.hasAttribute(a)) { var x = node.getAttribute(a), y = t(x); if (y !== x) node.setAttribute(a, y); } });
    var hk = htmlKey(node);
    if (hk && !made[hk] && dict[hk]) { node.innerHTML = dict[hk]; made[norm(node.innerHTML)] = 1; return; }
    for (var c = node.firstChild; c; c = c.nextSibling) swap(c);
  }
  // the English on a page that has no translation yet (scripts/lang-collect.js uses it to list what to translate)
  function collect(root) {
    var out = { text: [], html: [], attr: [] };
    (function walk(node) {
      if (node.nodeType === 3) { var k = norm(node.nodeValue); if (/[A-Za-z]{2}/.test(k) && !made[k] && t(k) === k) out.text.push(k); return; }
      if (node.nodeType !== 1 || node.nodeName === "SCRIPT" || node.nodeName === "STYLE" || node.hasAttribute("data-no-tr")) return;
      ATTRS.forEach(function (a) { var x = node.getAttribute(a); if (x && /[A-Za-z]{2}/.test(x) && !made[norm(x)] && t(x) === x) out.attr.push(norm(x)); });
      var hk = htmlKey(node);
      if (hk) {
        // listed unless its words were all translated piece by piece already
        var eng = false, w = document.createTreeWalker(node, 4), n;
        while ((n = w.nextNode())) { var nk = norm(n.nodeValue); if (/[A-Za-z]{2}/.test(nk) && !made[nk]) { eng = true; break; } }
        if (eng && !dict[hk] && !made[hk]) out.html.push(hk);
        return;
      }
      for (var c = node.firstChild; c; c = c.nextSibling) walk(c);
    })(root || document.body);
    return out;
  }
  if (lang !== "en") {
    ready.then(function () {
      if (own && !gameOk[slug]) return;
      document.documentElement.lang = lang;
      swap(document.body || document.documentElement);
      new MutationObserver(function (ms) {
        ms.forEach(function (m) {
          if (m.type === "characterData") swap(m.target);
          else m.addedNodes.forEach(swap);
        });
      }).observe(document.documentElement, { childList: true, subtree: true, characterData: true });
    });
  }

  return {
    names: { en: "English", id: "Bahasa Indonesia", ms: "Bahasa Melayu", de: "Deutsch", fr: "Français" },              // each language by its own name
    code: function () { return lang; },
    preview: preview,
    ready: function () { return ready; },
    t: t,
    collect: collect,
    lines: function () { return gameLines; },
    notes: function () { return gameNotes; },
    // another game's lines in this language (the recorder lists every game): { id: text }, empty if it has none
    linesOf: function (s) {
      if (lang === "en") return Promise.resolve({});
      return getJSON(new URL("lang/" + lang + "/" + s + ".json", root).href).then(function (d) {
        var out = {};
        if (d && (d.status === "checked" || preview)) Object.keys(d.lines || {}).forEach(function (id) { var v = d.lines[id], tx = v && typeof v === "object" ? v.t : v; if (tx) out[id] = tx; });
        return out;
      });
    },
    noVoice: function (s) { s = s || slug; return lang !== "en" && !!gameOk[s] && !(gameVoices[s] || []).length; },
    fallback: fallback,
    setFallback: function (f) { try { if (f === "en") localStorage.setItem("asmau-voice-fallback", "en"); else localStorage.removeItem("asmau-voice-fallback"); } catch (e) { /* this visit only */ } },                      // the notes for parents in this language, by page                      // the game's lines in this language, by id
    add: function (strings) { add(strings); if (document.body) swap(document.body); },
    has: function (s) { return lang === "en" || !!gameOk[s]; },
    // which narration pack: English keeps "w"/"m"; another language "<code>-w"/"<code>-m", when the game is in it
    // a translation may have both computer voices, one, or none yet ("voices" in its file): the one the family chose,
    // else the other one; with none, no computer voice reads it (never the English voice under translated words)
    // with none, the family chooses (For parents): silent, the default, or the English voice under the translated words
    voicePack: function (v, s) {
      s = s || slug; if (lang === "en" || !gameOk[s]) return v; var h = gameVoices[s] || [];
      if (!h.length) return fallback() === "en" ? v : lang + "-" + v;
      return lang + "-" + (h.indexOf(v) >= 0 ? v : h[0]);
    },
    audioDir: function (v, s) {
      s = s || slug;
      if (lang === "en" || !gameOk[s]) return v === "m" ? "audio-m" : "audio";
      var h = gameVoices[s] || []; if (!h.length) return fallback() === "en" ? (v === "m" ? "audio-m" : "audio") : null;
      return "audio-" + lang + ((h.indexOf(v) >= 0 ? v : h[0]) === "m" ? "-m" : "");
    },
    set: function (code) { try { localStorage.setItem("asmau-lang", code); } catch (e) { /* this visit only */ } },
    // the languages a game can be played in (English, and each translation that is checked; drafts with ?lang=)
    offered: function (s) {
      var codes = Object.keys(this.names).filter(function (c) { return c !== "en"; });
      return Promise.all(codes.map(function (c) {
        return getJSON(new URL("lang/" + c + "/" + s + ".json", root).href).then(function (d) { return d && (d.status === "checked" || preview) ? c : null; });
      })).then(function (r) { return ["en"].concat(r.filter(Boolean)); });
    }
  };
})();
