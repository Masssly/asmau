/*
  What makes this the Umm Ayman game, for the shared story player
  (shared/story-engine.js). A story from history: most chapters carry `cite`
  (where its facts come from) instead of a verse reference. The places are
  Makkah ("city"), Madina's palm gardens ("field"), the desert roads and the sea.
  The Prophet (peace be upon him) is never shown: scene-fx.json puts a soft
  breeze on the pictures where he is present.
*/
window.STORY_GAME = {
  slug: "umm-ayman",
  notesSource: "“Ibn Sa’d” is his al-Tabaqat al-Kabir (English: vol. 1 tr. S. Moinul Haq; vol. 8, The Women of Madina, tr. Aisha Bewley); hadith numbers are those of sunnah.com; the Shia narrations are from al-Saduq’s al-Amali and al-Kulayni’s al-Kafi (English, thaqalayn.net).",
  titleArt: [],          // the title shows the cover picture (see index.html)
  titleMood: "longing",
  endMood: "triumph",
  endIcon: "🐪",
  sceneMood: {
    city: "pastoral", field: "pastoral", night: "longing", dawn: "triumph", dusk: "longing",
    desert: "trek", sea: "wonder"
  },
  sceneAmb: { city: "crowd", field: "birds", desert: "wind", sea: "wind" }
};
