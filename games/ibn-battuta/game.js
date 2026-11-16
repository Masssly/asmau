/*
  What makes this the Ibn Battuta game, for the shared story player
  (shared/story-engine.js). A story from history: each chapter carries `cite`
  (its pages in his book, the Rihla) instead of a verse reference, except
  Makkah (22:27). The scene names are the player's own keys: "city" is any
  town, "village" Anatolia, "palace" Delhi, Sumatra and Fez, "field" the
  Maldives' palm groves.
*/
window.STORY_GAME = {
  slug: "ibn-battuta",
  notesSource: "Page numbers are those of The Travels of Ibn Battuta, tr. H. A. R. Gibb (vols. I-III) and C. F. Beckingham (vol. IV), Hakluyt Society, 1958-1994.",
  titleArt: [],          // the title shows the cover picture (see index.html)
  titleMood: "wonder",
  endMood: "triumph",
  endIcon: "🧳",
  sceneMood: {
    city: "joy", village: "pastoral", palace: "regal", sea: "wonder", desert: "trek", field: "pastoral",
    dawn: "triumph", dusk: "longing", night: "longing"
  },
  sceneAmb: { city: "crowd", village: "birds", palace: "birds", sea: "wind", desert: "wind", field: "birds" }
};
