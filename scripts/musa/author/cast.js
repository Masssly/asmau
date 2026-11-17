/* The people, places and source lines of this story, for the story kit (scripts/kit/author.js). */
"use strict";

const TAF = "From Ibn Kathir's commentary";
const HAD = "From a hadith in al-Bukhari";

// People and places in the pictures: [name for the alt text, how the picture tool is told to draw them].
// Described by clothes and age, never by name, so the tool draws our people and not its own idea of the story.
const WHO = {
  MUM:   ["Musa's mother", "a gentle young mother in a rust-orange headscarf and a cream dress"],
  SIS:   ["Musa's sister", "a clever girl of ten in a yellow headscarf draped over her head and shoulders that fully covers her hair, and a long-sleeved green dress"],
  BABY:  ["baby Musa", "a chubby smiling baby boy wrapped in white cloth"],
  CHEST: ["the little chest", "a small open wooden chest shaped like a cradle"],
  ASIYA: ["Queen Asiya", "a kind queen in a teal silk headscarf with a thin gold circlet and a white-and-gold gown"],
  PH:    ["Pharaoh", "a proud stern king with a short black beard, an ancient Nile-valley king's tall blue-and-gold striped headdress (not a European crown, no fur) and a red-and-gold robe"],
  MY:    ["young Musa", "a strong kind young man with short black hair and no beard, in a white tunic with a blue sash"],
  MU:    ["Musa", "a strong kind man in his thirties with a short black beard, a cream turban and an indigo robe, holding a tall wooden staff"],
  HA:    ["Harun", "a gentle man with a short black beard, a white turban and a long golden-ochre robe with brown trim"],
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

// The people who get a reference picture: drawn once, approved by a person, then shown to the
// picture tool with every scene they are in, so they look the same from scene to scene.
// (No reference for the baby: a standing toddler would teach the model the wrong baby.)
const REFS = ["MU", "MY", "HA", "PH", "ASIYA", "MUM", "SIS", "ELD", "DAU", "KH", "YU", "SAM"];

// In three or more pictures but kept without a reference on purpose: the baby (a standing toddler teaches the model the wrong baby), places and crowds. Anyone else seen that often gets one (scripts/art/ref-from.py).
const NOREF = ["BABY", "FOLK", "HALL", "NILE", "SORC", "CAMP", "PAL"];

module.exports = { WHO, REFS, NOREF, SOURCES: { TAF, HAD } };
