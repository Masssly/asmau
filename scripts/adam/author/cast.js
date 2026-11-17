/* The people, places and source lines of this story, for the story kit (scripts/kit/author.js). */
"use strict";

const TAF = "From Ibn Kathir's commentary";
const HAD = "From a hadith in al-Bukhari";
const BOTH = "Told in Sunni and Shia narrations";
const NAR = "From narrations in Majlisi's Hayat al-Qulub";

// People and places in the pictures: [name for the alt text, how the picture tool is told to draw them].
// Described by clothes and age, never by name, so the tool draws our people and not its own idea of the story.
const WHO = {
  ADAM:  ["Adam", "a tall, strong, gentle man with deep dark brown skin, short black hair and a short black beard, in a long simple cream-white garment"],
  HAWWA: ["Hawwa", "a kind, graceful young woman with deep dark brown skin, a soft sage-green headscarf over her head and shoulders that fully covers her hair, and a long simple cream garment"],
  ANG:   ["the angels", "tall gentle beings made of soft white-gold light with great feathered wings, their faces hidden in glowing light"],
  IBL:   ["Iblis", "a tall shadowy shape made of dim smokeless red-orange flame and dark smoke, like a hooded figure of fire, with no face to be seen"],
  HAB:   ["the kind brother", "a gentle young shepherd with deep dark brown skin, short black hair and a small beard, in a long sand-coloured tunic that reaches his ankles"],
  QAB:   ["the angry brother", "a young farmer with deep dark brown skin, short black hair and a small beard, in a dark rust-red tunic"],
  SHITH: ["Shith", "a calm, kind boy of about ten with deep dark brown skin and short black hair, in a long cream tunic that reaches his ankles"],
  GARDEN:["the Garden", "a vast peaceful garden of tall fruit trees, clear streams, flowers and soft golden light, real and natural"],
  EARTH: ["the earth", "a wide valley of dry earth and rocky hills under a big sky"]
};

// The people who get a reference picture: drawn once, approved by a person, then shown to the
// picture tool with every scene they are in, so they look the same from scene to scene.
// (No reference for the angels or Iblis: they are light and flame, never a face.)
const REFS = ["ADAM", "HAWWA", "HAB", "QAB", "SHITH"];

// In three or more pictures but kept without a reference on purpose: the angels and Iblis are light and flame, never a face; the Garden is a place. Anyone else seen that often gets one (scripts/art/ref-from.py).
const NOREF = ["ANG", "IBL", "GARDEN"];

module.exports = { WHO, REFS, NOREF, SOURCES: { TAF, HAD, BOTH, NAR } };
