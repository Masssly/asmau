/*
  What makes this the Nuh game, for the shared story player
  (shared/story-engine.js): its name, and its own sound and look.
*/
window.STORY_GAME = {
  slug: "nuh",
  notesSource: "“The commentary” is Ibn Kathir’s tafsir (abridged English translation, and the full Arabic where a note says so); “Shia narrations” are those collected in Majlisi’s Hayat al-Qulub (English, al-islam.org).",
  titleArt: [],          // the title shows the cover picture (see index.html)
  titleMood: "wonder",
  endMood: "triumph",
  endIcon: "🚢",
  sceneMood: {
    village: "pastoral", field: "pastoral", night: "longing", dawn: "triumph", dusk: "longing",
    storm: "tense", grey: "sad", mountain: "wonder"
  },
  sceneAmb: { village: "birds", storm: "rain", mountain: "wind" },
  sceneFx: { storm: "rain" }
};
