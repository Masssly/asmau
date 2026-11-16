/* The people, places and source lines of this story, for the story kit (scripts/kit/author.js). */
"use strict";

const HIS = "From the histories of her life";

// People in the pictures: [name for the alt text, how the picture tool is told to draw them]. The Minangkabau of West
// Sumatra drawn as themselves (owner's rule for Great Muslims).
const DRESS = "a long loose baju kurung tunic of deep green over a long batik sarong, and a white headscarf that covers all her hair, her forehead and her neck";
const WHO = {
  RG: ["Rahmah", "a bright, curious Minangkabau girl of about eight with warm medium-brown skin and dark eyes, in " + DRESS],
  RY: ["Rahmah", "a determined, kind Minangkabau woman of about twenty-five with warm medium-brown skin and dark eyes, in " + DRESS],
  RO: ["Rahmah", "a dignified, kind Minangkabau woman of about fifty-five with warm medium-brown skin, a few lines on her face and dark eyes, in " + DRESS + "; not a single hair shows at her forehead"],
  GIRLS: ["the girls", "Minangkabau girls and young women with warm brown skin, in long loose tunics and sarongs, every one with a headscarf that covers all her hair"],
  MEN: ["men of the town", "Minangkabau men with warm brown skin in long shirts, sarongs and black velvet peci caps"],
  TOWN: ["Padang Panjang", "the hill town of Padang Panjang in West Sumatra in the early 1900s: Minangkabau houses with sweeping curved roofs that rise to points like buffalo horns, a mosque with a tiered roof, green rice fields, and tall volcanic mountains behind"],
  HERE: ["", "There is no man and no child shown in the picture"]
};

// The people who get a reference picture: drawn once, approved by a person, then shown to the
// picture tool with every scene they are in, so they look the same from scene to scene.
// (Groups and crowds are described, not referenced.)
const REFS = ["RG", "RY", "RO"];

module.exports = { WHO, REFS, SOURCES: { HIS } };
