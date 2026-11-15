/*
  What makes this the Musa game, for the shared story player
  (shared/story-engine.js): its name, and its own sound and look. The music
  for each kind of place is from the second family of moods in shared/music.js,
  so this story does not sound like the Yusuf one.
*/
window.STORY_GAME = {
  slug: "musa",
  notesSource: "“The commentary” is Ibn Kathir’s tafsir (abridged English translation); “Shia narrations” are those collected in Majlisi’s Hayat al-Qulub (English, al-islam.org).",
  titleArt: [],          // the title shows the cover picture (see index.html)
  titleMood: "nile",
  endMood: "triumph",
  endIcon: "STAFF",
  sceneMood: {
    river: "nile", palace: "court", city: "dread", desert: "trek", well: "pastoral", field: "pastoral",
    night: "longing", fire: "awe", mountain: "awe", sea: "dread", camp: "trek", storm: "dread",
    egypt: "court", dawn: "triumph", dusk: "longing", grey: "longing"
  }
};
