/*
  A small writing aid for the Nana Asma'u story (copied from the Musa one). The chapter files (c1.js ...) call
  these helpers; build.js then writes the files the game and the picture
  tools read:

    games/nana-asmau/story.js        chapters, steps, music moods
    games/nana-asmau/narration.json  every spoken line
    scripts/asmau-art/shots.json  one entry per picture: alt text and prompt

  Words, pictures and activities are written side by side here so they cannot
  drift apart. After changing a chapter file run:  node scripts/asmau/author/build.js
*/
"use strict";

const STORY = [], LINES = [], SHOTS = {}, MOODS = {};
let C = null, flip = 0;

const HAD = "From a hadith in al-Bukhari";
const CW = "From Boyd and Mack, Collected Works";

// People and places in the pictures: [name for the alt text, how the picture tool is told to draw them].
// Described by clothes and age, never by name, so the tool draws our people and not its own idea of the story.
const WHO = {
  GIRL:  ["young Asma'u", "a bright, kind girl of about eight with deep dark brown skin, a cream cotton headscarf over her head and shoulders, a long-sleeved teal blouse and an indigo wrapper with small white diamond patterns"],
  ASMA:  ["Nana Asma'u", "a wise, warm woman in her forties with deep dark brown skin, a large cream head wrap over her hair and shoulders, and a long deep-green coat with narrow geometric trim over a cream under-robe"],
  OLD:   ["Nana Asma'u, grown old", "a gentle elderly woman of seventy with deep dark brown skin, a large cream head wrap over her hair and shoulders, and a long deep-green coat with narrow geometric trim"],
  SHEHU: ["the Shehu, her father", "a gentle elderly scholar with deep dark brown skin and a white beard, a white embroidered cap and a cream wide-sleeved robe"],
  HASSAN:["Hassan, her twin brother", "a cheerful boy of about eight with deep dark brown skin and short hair, in a sand-coloured tunic and a small white cap"],
  GIDADO:["Gidado", "a kind, dignified man with deep dark brown skin and a short black beard, a white cap and an indigo-and-white striped wide-sleeved robe"],
  BELLO: ["Muhammad Bello, her brother", "a tall, serious man with deep dark brown skin and a black beard, a white turban and a dark blue robe"],
  AISHA: ["Aisha, who raised her", "a kind woman with deep dark brown skin, a plum-coloured headscarf over her hair and shoulders and a long cream dress"],
  JAJI:  ["a jaji, a woman teacher", "a strong, smiling woman with deep dark brown skin wearing a tall, narrow, high-crowned woven straw hat (not wide-brimmed) bound with a red cloth band, over a headscarf that fully covers her hair and neck, and a loose long-sleeved ochre dress with a high neckline"],
  WOMEN: ["women of the villages", "Black African village women with deep dark brown skin in long colourful wrappers, every one with her hair covered by a headscarf"],
  FOLK:  ["the people", "families of Black African men, women and children with deep dark brown skin in simple long clothes"],
  DEGEL: ["Degel", "a small West African savanna village of round mud-brick houses with thatched roofs, baobab and acacia trees"],
  SOKOTO:["Sokoto", "a busy walled West African town of flat-roofed mud-brick houses, a mosque with a mud tower, and a market"]
};

function fill(text, which) {
  return text.replace(/\{([A-Z]+)\}/g, (m, k) => { if (!WHO[k]) throw new Error("unknown {" + k + "}"); return WHO[k][which]; });
}

function line(id, text) {
  if (LINES.some((l) => l.id === id)) throw new Error("line used twice: " + id);
  LINES.push({ id, text, lang: "en" });
  return id;
}
function full(ref) { return /^(a\d+|bg)-/.test(ref) ? ref : C.id + "-" + ref; }
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

// A small round portrait of a person, used as the walker or rider in an activity (icon "img:icon-<key>").
function portrait(key, who) {
  SHOTS["icon-" + key] = { alt: WHO[who][0], scene: fill("{" + who + "}", 1), who: [who], portrait: true };
  return "img:icon-" + key;
}

// A backdrop for activities in a scene that have no picture of their own.
function backdrop(scene, desc) { SHOTS["bg-" + scene] = { alt: desc, scene: desc, who: [] }; }

// The people who get a reference picture: drawn once, approved by a person, then shown to the
// picture tool with every scene they are in, so they look the same from scene to scene.
// (No reference for the baby: a standing toddler would teach the model the wrong baby.)
const REFS = ["GIRL", "ASMA", "SHEHU", "GIDADO", "JAJI"];

module.exports = { REFS, STORY, LINES, SHOTS, MOODS, WHO, HAD, CW, chapter, s, p, q, ord, mat, srt, chg, line, backdrop, portrait };
