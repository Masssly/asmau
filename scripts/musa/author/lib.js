/*
  A small writing aid for the Musa story. The chapter files (c1.js ...) call
  these helpers; build.js then writes the files the game and the picture
  tools read:

    games/musa/story.js        chapters, steps, music moods
    games/musa/narration.json  every spoken line
    scripts/musa-art/shots.json  one entry per picture: alt text and prompt

  Words, pictures and activities are written side by side here so they cannot
  drift apart. After changing a chapter file run:  node scripts/musa/author/build.js
*/
"use strict";

const STORY = [], LINES = [], SHOTS = {}, MOODS = {};
let C = null, flip = 0;

const TAF = "From Ibn Kathir's commentary";
const HAD = "From a hadith in al-Bukhari";

// People and places in the pictures: [name for the alt text, how the picture tool is told to draw them].
// Described by clothes and age, never by name, so the tool draws our people and not its own idea of the story.
const WHO = {
  MUM:   ["Musa's mother", "a gentle young mother in a rust-orange headscarf and a cream dress"],
  SIS:   ["Musa's sister", "a clever girl of ten in a yellow headscarf and a green dress"],
  BABY:  ["baby Musa", "a chubby smiling baby boy wrapped in white cloth"],
  CHEST: ["the little chest", "a small open wooden chest shaped like a cradle"],
  ASIYA: ["Queen Asiya", "a kind queen in a teal silk headscarf with a thin gold circlet and a white-and-gold gown"],
  PH:    ["Pharaoh", "a proud stern king with a short black beard, a tall blue-and-gold striped crown and a red-and-gold robe"],
  MY:    ["young Musa", "a strong kind young man with short black hair and no beard, in a white tunic with a blue sash"],
  MU:    ["Musa", "a strong kind man in his thirties with a short black beard, a cream turban and an indigo robe, holding a tall wooden staff"],
  HA:    ["Harun", "a gentle man with a short black beard, a white turban and a green robe"],
  ELD:   ["the old father", "a very old man with a long white beard, a white turban and a brown cloak"],
  DAU:   ["the two daughters", "two modest young women in long dresses and headscarves, one in purple and one in sky blue"],
  KH:    ["al-Khidr", "a wise old man with a white beard, in a green turban and a long green cloak"],
  YU:    ["Yusha", "a helpful boy of twelve in a short brown tunic and a small white cap"],
  SAM:   ["the Samiri", "a sly thin man in a grey robe and a dark red turban"],
  SORC:  ["the magicians", "a row of magicians in dark purple robes"],
  FOLK:  ["the people", "a crowd of families, men, women and children, in simple earth-coloured clothes"],
  ARMY:  ["the army", "soldiers with spears and round shields on horse-drawn chariots"],
  NILE:  ["the river", "a wide calm river with tall green reeds and date palms"],
  PAL:   ["the palace", "a grand sandstone palace with painted columns"],
  HALL:  ["the throne hall", "a grand throne hall with painted columns and hanging lamps"],
  CAMP:  ["the camp", "a camp of woven tents among rocks in the desert"]
};

function fill(text, which) {
  return text.replace(/\{([A-Z]+)\}/g, (m, k) => { if (!WHO[k]) throw new Error("unknown {" + k + "}"); return WHO[k][which]; });
}

function line(id, text) {
  if (LINES.some((l) => l.id === id)) throw new Error("line used twice: " + id);
  LINES.push({ id, text, lang: "en" });
  return id;
}
function full(ref) { return /^(m\d+|bg)-/.test(ref) ? ref : C.id + "-" + ref; }
function shot(id, desc) {
  const alt = fill(desc, 0).replace(/\s+/g, " ").trim();
  SHOTS[id] = { alt: alt.length > 170 ? alt.slice(0, alt.slice(0, 170).lastIndexOf(" ")) + "…" : alt, scene: fill(desc, 1) };
}
function extras(st, x) {
  x = x || {};
  if (x.mood) MOODS[st.say || st.line] = x.mood;
  for (const k of ["src", "amb", "fx", "cue"]) if (x[k]) st[k] = x[k];
  return st;
}

// A chapter. source is its main passage; more lists the other passages it draws on.
function chapter(id, icon, title, source, more, parent) {
  C = { id, icon, title, source, more: more || [], parent, steps: [] };
  STORY.push(C);
}

// A narrated picture. pic is a description of a new picture, or "=<line>" to show one drawn for another line.
function s(suffix, scene, text, pic, x) {
  const id = line(C.id + "-" + suffix, text), st = { say: id, scene };
  if (pic && pic[0] === "=") st.pic = full(pic.slice(1));
  else if (pic) shot(id, pic);
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

// A backdrop for activities in a scene that have no picture of their own.
function backdrop(scene, desc) { SHOTS["bg-" + scene] = { alt: desc, scene: desc }; }

module.exports = { STORY, LINES, SHOTS, MOODS, WHO, TAF, HAD, chapter, s, p, q, ord, mat, srt, chg, line, backdrop };
