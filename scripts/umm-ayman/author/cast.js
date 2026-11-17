/* The people, places and source lines of this story, for the story kit (scripts/kit/author.js). */
"use strict";

const SAD = "From Ibn Sa'd's Tabaqat";
const MUS = "From Anas, in Sahih Muslim";
const ZUH = "From Ibn Shihab, in Sahih Muslim";

// People and places in the pictures: [name for the alt text, how the picture tool is told to draw them].
// Described by clothes and age, never by name, so the tool draws our people and not its own idea of the story.
const WHO = {
  UAY:   ["Barakah", "a young Abyssinian woman of about eighteen with deep dark brown skin, a gentle round face and kind eyes, in a long, loose, plain saffron-yellow dress with long sleeves down to her wrists, and a cream headscarf that fully covers her hair and neck"],
  UA:    ["Umm Ayman", "an East African woman from Abyssinia of about sixty with very deep dark brown skin, as dark as in her youth, a kind lined face and bright lively eyes, in a long, loose, plain saffron-yellow dress with long sleeves down to her wrists, and a cream headscarf that fully covers her hair and neck"],
  AMINA: ["Amina", "a gentle young Arab mother of about twenty with warm brown skin, in a long loose deep-blue dress and a white headscarf pulled well forward over her forehead, so that none of her hair shows at all"],
  GRAND: ["Abd al-Muttalib", "a tall, dignified, very old Arab man with warm brown skin and a long white beard, in a white robe and a white turban"],
  UNCLE: ["Abu Talib", "a kind Arab man of about forty with warm brown skin and a short black beard, in a brown robe and a dark red turban"],
  UBAYD: ["Ubayd", "a cheerful Arab man of about forty with warm brown skin and a short beard, in a sand-coloured tunic"],
  ZAYD:  ["Zayd", "a kind, strong Arab man of about forty with light brown skin and a short dark beard, in a plain green tunic and a white turban"],
  USAMA: ["Usamah", "a lively boy of about seven with deep dark brown skin and short black curly hair, in a small white tunic"],
  ANAS:  ["Anas", "a polite Arab boy of about eleven with warm brown skin and short black hair, in a light blue tunic"],
  FATIMA:["Fatimah", "a gentle young Arab bride of about eighteen with warm brown skin, in a simple long loose white dress and a white headscarf pulled well forward over her forehead, so that none of her hair shows at all"],
  ABUBAKR:["Abu Bakr", "a slim, gentle old Arab man of about sixty with light brown skin and a beard dyed orange-red with henna, in a simple white robe and a white turban"],
  UMAR:  ["Umar", "a very tall, strong Arab man of about fifty-five with warm brown skin and a full dark beard touched with grey, in a simple patched brown robe"],
  MUSLIMS:["the Muslims", "a few ordinary Muslims of Makkah, Arabs with warm brown skin: men in plain tunics and turbans, women in long dresses with headscarves that fully cover their hair"],
  MAKKAH:["Makkah", "Makkah, a town of simple flat-roofed houses of mud brick and stone in a dry, rocky valley between bare brown hills"],
  MADINA:["Madina", "Madina, an oasis town of low mud-brick houses with roofs of palm branches among green date-palm gardens"],
  CAMELS:["two camels", "two camels, the second one carrying a padded saddle with a small cloth canopy"],
  HERE:  ["", "There is no man and no child shown in the picture: a person is present but outside the picture"]
};

// The people who get a reference picture: drawn once, approved by a person, then shown to the
// picture tool with every scene they are in, so they look the same from scene to scene.
// (Groups and crowds are described, not referenced.)
const REFS = ["UAY", "UA", "AMINA", "ABUBAKR", "UMAR"];

// In three or more pictures but kept without a reference on purpose: HERE is the line that keeps the Prophet out of a picture; places and animals. Anyone else seen that often gets one (scripts/art/ref-from.py).
const NOREF = ["HERE", "MAKKAH", "MADINA", "CAMELS"];

module.exports = { WHO, REFS, NOREF, SOURCES: { SAD, MUS, ZUH } };
