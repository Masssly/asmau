/* The people, places and source lines of this story, for the story kit (scripts/kit/author.js). */
"use strict";

const TAF = "From Ibn Kathir's commentary";
const BUK = "From Ibn Abbas, in al-Bukhari";
const BOTH = "Told in Sunni and Shia narrations";
const NAR = "From narrations in Majlisi's Hayat al-Qulub";

// People and places in the pictures: [name for the alt text, how the picture tool is told to draw them].
// Described by clothes and age, never by name, so the tool draws our people and not its own idea of the story.
const WHO = {
  NUH:    ["Nuh", "a tall, strong, kind old man with deep dark brown skin, a full white beard and short white hair, in a long simple indigo-blue robe over a cream tunic"],
  SON:    ["Nuh's son", "a proud young man of about twenty with deep dark brown skin, short black hair and a thin beard, in a long-sleeved rust-orange tunic that reaches below his knees, over loose brown trousers"],
  BELIEVERS: ["the believers", "a small group of ordinary believers with deep dark brown skin: men in plain sand-coloured and white tunics, women in long simple dresses with headscarves that fully cover their hair, and a few children"],
  CHIEFS: ["the proud chiefs", "three proud rich men with deep dark brown skin in heavy red and gold robes and large turbans, with gold rings and folded arms"],
  PEOPLE: ["the people", "a crowd of villagers with deep dark brown skin in simple tunics and long dresses; every woman's and girl's hair is covered by a headscarf"],
  GOODMEN:["the good men", "three kind, humble old men with deep dark brown skin and grey beards, in plain white tunics"],
  STATUES:["the statues", "five tall rough stone statues of standing figures, plain and weathered, their faces worn smooth and blank"],
  ARK:    ["the Ark", "a huge simple wooden ship built of long planks held with big iron nails, with a high curved hull and a wooden roof over its deck"],
  VILLAGE:["the village", "a village of round mud houses with thatched roofs among palm trees and fields, in a wide green valley"]
};

// The people who get a reference picture: drawn once, approved by a person, then shown to the
// picture tool with every scene they are in, so they look the same from scene to scene.
// (Groups and crowds are described, not referenced.)
const REFS = ["NUH", "SON"];

// In three or more pictures but kept without a reference on purpose: the Ark, a place, and groups. Anyone else seen that often gets one (scripts/art/ref-from.py).
const NOREF = ["ARK", "BELIEVERS", "VILLAGE", "CHIEFS"];

module.exports = { WHO, REFS, NOREF, SOURCES: { TAF, BUK, BOTH, NAR } };
