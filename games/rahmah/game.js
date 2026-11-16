/*
  What makes this the Rahmah El Yunusiyyah game, for the shared story player
  (shared/story-engine.js). A story from modern history: each chapter carries
  `cite` instead of a verse reference. The scene names are the player's own keys:
  "village" is her home and her brother's school, "city" the town of Padang
  Panjang and her school, "palace" a grand hall (the Dutch office, al-Azhar).
*/
window.STORY_GAME = {
  slug: "rahmah",
  notesSource: "The notes give their sources: mainly the histories cited in Wikipedia's article on her (Audrey Kahin, Jeffrey Hadler, Pieternella van Doorn-Harder and others) and Fitriyanti et al., Journal of Educational Sciences, 2026.",
  titleArt: [],          // the title shows the cover picture (see index.html)
  titleMood: "pastoral",
  endMood: "triumph",
  endIcon: "🏫",
  sceneMood: {
    village: "pastoral", field: "pastoral", city: "joy", palace: "regal", sea: "wonder", desert: "trek",
    dawn: "triumph", dusk: "longing", night: "longing"
  },
  sceneAmb: { village: "birds", field: "birds", city: "crowd", palace: "birds", sea: "wind", desert: "wind" }
};
