/* The people, places and source lines of this story, for the story kit (scripts/kit/author.js). */
"use strict";

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

// The people who get a reference picture: drawn once, approved by a person, then shown to the
// picture tool with every scene they are in, so they look the same from scene to scene.
// (No reference for the baby: a standing toddler would teach the model the wrong baby.)
const REFS = ["GIRL", "ASMA", "SHEHU", "GIDADO", "JAJI"];

// In three or more pictures but kept without a reference on purpose: places, and a crowd. Anyone else seen that often gets one (scripts/art/ref-from.py).
const NOREF = ["SOKOTO", "DEGEL", "WOMEN"];

module.exports = { WHO, REFS, NOREF, SOURCES: { HAD, CW } };
