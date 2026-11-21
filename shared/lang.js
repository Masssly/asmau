/*
  Languages. English is the site's own language and the default; a family can choose another in For parents
  (localStorage "asmau-lang"). English stays in the code and the files as it is: a translation is a dictionary,
  English text -> translated text, and this script swaps the English on screen for the chosen language as pages are
  drawn (MutationObserver), so pictures, activities and page numbers never change.

    languages.json                 the languages the site offers ({ code: { name } })
    shared/i18n/<code>.json        the buttons and labels shared by every page
    games/<slug>/lang/<code>.json  a game's lines and labels: { "status": "draft"|"checked", "lines": { id: tr },
                                   "strings": { en: tr } } (lines by their id in narration.json; titles, labels by English)
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
  var dict = {}, pats = [], gameOk = {}, gameLines = {}, made = {};

  function add(strings) {
    Object.keys(strings || {}).forEach(function (k) {
      if (k.charAt(0) === "_") return;                                // "_note": a note for people, not a word on screen
      if (k.indexOf("re:") === 0) { try { pats.push([new RegExp(k.slice(3)), strings[k]]); } catch (e) { /* a bad pattern is skipped */ } }
      else { dict[norm(k)] = strings[k]; made[norm(strings[k])] = 1; }
    });
  }
  function norm(s) { return String(s).replace(/\s+/g, " ").trim(); }
  function getJSON(u) { return fetch(u).then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; }); }

  var here = new URL(location.href).href.indexOf(root.href) === 0 ? location.href.slice(root.href.length) : "";
  var g = /^games\/([^/]+)\//.exec(here), slug = g ? g[1] : null;
  var ready = lang === "en" ? Promise.resolve() : Promise.all([
    getJSON(new URL("shared/i18n/" + lang + ".json", root).href).then(function (d) { if (d) add(d); }),
    slug ? getJSON(new URL("games/" + slug + "/lang/" + lang + ".json", root).href).then(function (d) {
      if (d && (d.status === "checked" || preview)) { add(d.strings); gameLines = d.lines || {}; gameOk[slug] = true; }
    }) : null
  ]).then(function () {
    if (slug && !gameOk[slug]) { dict = {}; pats = []; }        // a game not (yet) in this language stays wholly English
  });

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

  // swap English on screen: text nodes, and the words people hear or read in attributes
  var ATTRS = ["aria-label", "placeholder", "title", "alt"];
  function swap(node) {
    if (node.nodeType === 3) {
      var v = node.nodeValue, k = norm(v);
      // the text as written may wrap over lines in the page's code: keep its leading and trailing space, swap the rest
      if (k && k.length < 600) { var tr = t(k); if (tr !== k) { var w = /^(\s*)[\s\S]*?(\s*)$/.exec(v); node.nodeValue = w[1] + tr + w[2]; } }
      return;
    }
    if (node.nodeType !== 1 || node.nodeName === "SCRIPT" || node.nodeName === "STYLE") return;
    ATTRS.forEach(function (a) { if (node.hasAttribute && node.hasAttribute(a)) { var x = node.getAttribute(a), y = t(x); if (y !== x) node.setAttribute(a, y); } });
    for (var c = node.firstChild; c; c = c.nextSibling) swap(c);
  }
  if (lang !== "en") {
    ready.then(function () {
      if (slug && !gameOk[slug]) return;
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
    names: { en: "English", id: "Bahasa Indonesia", ms: "Bahasa Melayu", de: "Deutsch" },              // each language by its own name
    code: function () { return lang; },
    preview: preview,
    ready: function () { return ready; },
    t: t,
    lines: function () { return gameLines; },                      // the game's lines in this language, by id
    add: function (strings) { add(strings); if (document.body) swap(document.body); },
    has: function (s) { return lang === "en" || !!gameOk[s]; },
    // which narration pack: English keeps "w"/"m"; another language "<code>-w"/"<code>-m", when the game is in it
    voicePack: function (v, s) { return lang === "en" || !gameOk[s || slug] ? v : lang + "-" + v; },
    audioDir: function (v, s) { return lang === "en" || !gameOk[s || slug] ? (v === "m" ? "audio-m" : "audio") : "audio-" + lang + (v === "m" ? "-m" : ""); },
    set: function (code) { try { localStorage.setItem("asmau-lang", code); } catch (e) { /* this visit only */ } },
    // the languages a game can be played in (English, and each translation that is checked; drafts with ?lang=)
    offered: function (s) {
      var codes = Object.keys(this.names).filter(function (c) { return c !== "en"; });
      return Promise.all(codes.map(function (c) {
        return getJSON(new URL("games/" + s + "/lang/" + c + ".json", root).href).then(function (d) { return d && (d.status === "checked" || preview) ? c : null; });
      })).then(function (r) { return ["en"].concat(r.filter(Boolean)); });
    }
  };
})();
