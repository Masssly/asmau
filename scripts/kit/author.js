/*
  The writing aid every story game shares (the "story kit", scripts/kit/README.md). A game's chapter files
  (scripts/<game>/author/c1.js ...) call these helpers; scripts/kit/build.js then writes the files the game and the
  picture tools read. What differs between games is in its scripts/<game>/kit.json and author/cast.js:

    cast.js   WHO     the people and places in the pictures: [name for the alt text, how the picture tool draws them]
              REFS    who gets a reference picture (drawn once, approved, shown with every scene they are in)
              SOURCES short source lines used on pages ("From Ibn Kathir's commentary"), exported by name

  A game's author/lib.js is one line:  module.exports = require("../../kit/author")("<game folder in scripts/>");
*/
"use strict";
const fs = require("fs"), path = require("path");

module.exports = function kit(dir) {
  const HERE = path.join(__dirname, "..", dir);
  const cfg = JSON.parse(fs.readFileSync(path.join(HERE, "kit.json"), "utf8"));
  const cast = require(path.join(HERE, "author", "cast.js"));
  const WHO = cast.WHO, REFS = cast.REFS || [];
  const FULL = new RegExp("^" + cfg.prefix + "\\d+-");
  const STORY = [], LINES = [], SHOTS = {}, MOODS = {};
  let C = null, flip = 0;

  function fill(text, which) {
    return text.replace(/\{([A-Z]+)\}/g, (m, k) => { if (!WHO[k]) throw new Error("unknown {" + k + "}"); return WHO[k][which]; });
  }

  function line(id, text) {
    if (LINES.some((l) => l.id === id)) throw new Error("line used twice: " + id);
    LINES.push({ id, text, lang: "en" });
    return id;
  }
  function full(ref) { return FULL.test(ref) || /^bg-/.test(ref) ? ref : C.id + "-" + ref; }
  function shot(id, desc) {
    const alt = fill(desc, 0).replace(/\s+/g, " ").trim();
    // who: the people in it, in order, so the right reference pictures go with the prompt
    const who = [...new Set([...desc.matchAll(/\{([A-Z]+)\}/g)].map((m) => m[1]))];
    SHOTS[id] = { alt: alt.length > 170 ? alt.slice(0, alt.slice(0, 170).lastIndexOf(" ")) + "…" : alt, scene: fill(desc, 1), who };
  }
  function extras(st, x) {
    x = x || {};
    if (x.mood) MOODS[st.say || st.line] = x.mood;
    for (const k of ["src", "amb", "fx", "cue"]) if (x[k]) st[k] = x[k];
    return st;
  }

  // A chapter. source is its main passage; more lists the other passages it draws on.
  // A chapter told from hadith rather than verses gives source null and names its sources in cite.
  function chapter(id, icon, title, source, more, parent, cite) {
    // a story from history names its sources in place of verses (cfg.sourceIsCite: the old Nana Asma'u chapter files)
    if (cfg.sourceIsCite) { cite = source; source = null; }
    C = { id, icon, title, source, more: more || [], parent, steps: [] };
    if (cite) C.cite = cite;
    STORY.push(C);
  }

  // A narrated picture. pic is a description of a new picture, or "=<line>" to show one drawn for another line.
  function s(suffix, scene, text, pic, x) {
    const id = line(C.id + "-" + suffix, text), st = { say: id, scene };
    if (pic && pic[0] === "=") throw new Error(id + ": every page needs its own picture (it borrows " + pic + "); write a description for it");
    else if (pic) { shot(id, pic); if (x && x.presence) SHOTS[id].presence = true; }
    C.steps.push(extras(st, x));
  }

  // Something to do. x.img names the picture to play in front of ("a" = this chapter's line a).
  function p(play, suffix, scene, text, opts, x) {
    const id = line(C.id + "-" + suffix, text);
    opts = Object.assign({}, opts);
    if (x && x.img) opts.img = full(x.img);
    C.steps.push(extras({ play, line: id, scene, opts }, x));
    return id;
  }

  // One question, a right answer and a wrong one: [label, icon]. The right one is not always first.
  function q(suffix, scene, text, right, wrong, no, x) {
    const id = C.id + "-" + suffix, first = (flip++ % 2) === 0;
    const options = (first ? [right, wrong] : [wrong, right]).map((o) => ({ label: o[0], icon: o[1], ok: o === right }));
    p("choice", suffix, scene, text, { options, wrong: id + "-no" }, x);
    options.forEach((o, i) => line(id + "-opt" + (i + 1), o.label));
    line(id + "-no", no);
  }

  // Put things in order. cards: [icon, label, what is said when it is placed].
  function ord(suffix, scene, text, cards, no, x) {
    const id = C.id + "-" + suffix;
    p("order", suffix, scene, text, { cards: cards.map((c, i) => ({ icon: c[0], label: c[1], line: id + "-c" + (i + 1) })), wrong: id + "-no" }, x);
    cards.forEach((c, i) => line(id + "-c" + (i + 1), c[2] || c[1]));
    line(id + "-no", no);
  }

  // Match pairs: [iconA, labelA, iconB, labelB].
  function mat(suffix, scene, text, pairs, x) {
    const id = C.id + "-" + suffix;
    p("match", suffix, scene, text, { pairs: pairs.map((r, i) => ({ a: id + "-a" + (i + 1), aIcon: r[0], aLabel: r[1], b: id + "-b" + (i + 1), bIcon: r[2], bLabel: r[3] })) }, x);
    pairs.forEach((r, i) => { line(id + "-a" + (i + 1), r[1]); line(id + "-b" + (i + 1), r[3]); });
  }

  // Sort things into two bins: bins are [label, icon]; things are [icon, label, 0 or 1].
  function srt(suffix, scene, text, binA, binB, things, no, x) {
    const id = C.id + "-" + suffix;
    p("sort", suffix, scene, text, { bins: [binA, binB].map((b) => ({ label: b[0], icon: b[1] })), things: things.map((t) => ({ icon: t[0], label: t[1], bin: t[2] })), wrong: id + "-no" }, x);
    [binA, binB].forEach((b, i) => line(id + "-bin" + (i + 1), b[0]));
    things.forEach((t, i) => line(id + "-it" + (i + 1), t[1]));
    line(id + "-no", no);
  }

  // Tap a thing and it changes: states are [icon, what is said, glow?]. The first state is how it starts.
  function chg(suffix, scene, text, states, x) {
    const id = C.id + "-" + suffix;
    p("change", suffix, scene, text, { states: states.map((st, i) => ({ icon: st[0], line: i ? id + "-s" + i : null, glow: !!st[2] })) }, x);
    states.forEach((st, i) => { if (i) line(id + "-s" + i, st[1]); });
  }

  // A small round portrait of a person, used as the walker or rider in an activity (icon "img:icon-<key>").
  function portrait(key, who) {
    SHOTS["icon-" + key] = { alt: WHO[who][0], scene: fill("{" + who + "}", 1), who: [who], portrait: true };
    return "img:icon-" + key;
  }

  // A backdrop for activities in a scene that have no picture of their own.
  function backdrop(scene, desc) { SHOTS["bg-" + scene] = { alt: desc, scene: desc, who: [] }; }

  return Object.assign({ cfg, dir, REFS, STORY, LINES, SHOTS, MOODS, WHO, chapter, s, p, q, ord, mat, srt, chg, line, backdrop, portrait }, cast.SOURCES || {});
};
