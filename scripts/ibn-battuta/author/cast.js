/* The people, places and source lines of this story, for the story kit (scripts/kit/author.js). */
"use strict";

const RIH = "From his book, the Rihla";

// People in the pictures: [name for the alt text, how the picture tool is told to draw them]. Each land's people are
// drawn as themselves (owner's rule for Great Muslims), described in each scene.
const WHO = {
  IBY: ["Ibn Battuta", "a young Moroccan man of about twenty-one with warm light-brown skin, a short neat dark beard and kind, curious eyes, in a cream hooded wool travelling cloak over a long white tunic, a white turban and a leather bag across his chest"],
  IB:  ["Ibn Battuta", "a Moroccan man of about forty-five with warm light-brown skin and a full dark beard touched with grey, kind, curious eyes, in a cream hooded wool travelling cloak over a long white tunic, a white turban and a leather bag across his chest"],
  HERE: ["", "There is no man and no child shown in the picture"]
};

// The people who get a reference picture: drawn once, approved by a person, then shown to the
// picture tool with every scene they are in, so they look the same from scene to scene.
// (Groups and crowds are described, not referenced.)
const REFS = ["IBY", "IB"];

// In three or more pictures but kept without a reference on purpose. Anyone else seen that often gets one (scripts/art/ref-from.py).
const NOREF = [];

module.exports = { WHO, REFS, NOREF, SOURCES: { RIH } };
