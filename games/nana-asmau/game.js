/*
  What makes this the Nana Asma'u game, for the shared story player
  (shared/story-engine.js). A story from history, not from the Qur'an: each
  chapter carries `cite` (where its facts come from) instead of a verse
  reference. The places are the Sahel and Sokoto; the scene names are the
  player's own keys (for example "egypt" is used here for the town of Sokoto).
*/
window.STORY_GAME = {
  slug: "nana-asmau",
  titleArt: [["📜", 30, 46, 64, "float"], ["✒️", 70, 40, 56, "bob"], ["⭐", 18, 18, 26, "twinkle"], ["⭐", 82, 16, 22, "twinkle"], ["🌙", 50, 16, 40, "float"], ["👒", 50, 70, 70, "bob"]],
  titleMood: "pastoral",
  endMood: "triumph",
  endIcon: "📜",
  sceneMood: {
    dusk: "wonder", night: "longing", field: "pastoral", desert: "trek", camp: "trek", grey: "longing",
    egypt: "joy", palace: "wonder", dawn: "triumph"
  },
  // Sokoto is a town, not a royal court: the town and the study sound like a busy street and quiet birds
  sceneAmb: { egypt: "crowd", palace: "birds", field: "birds" }
};
