/*
  The shape of the story: chapters -> steps.

  A step is either
    { say: <line id>, scene, art }           a narrated picture, or
    { play: <activity>, line, scene, opts }  something for the child to do.

  Every word spoken or shown comes from narration.json (by line id), so the
  caption, the audio and the recording tool can never drift apart.

  art is a list of sprites: [kind, x%, y%, size, animation]. kind is an
  emoji, or one of the drawn pieces in game.js (GLOW, GLOWK, BROS, WELL,
  SACK, CUP, STORE, LAMP, COINS, BARS, RING, DOT:<colour>, T:<text>).
  No person is ever drawn: Yusuf is a warm glow (GLOWK once he is in
  charge of the storehouses), his brothers a huddle of dots.
*/
window.YUSUF_STORY = [
  {
    id: "c1", icon: "🌟", title: "The Dream", source: "12:4-6",
    steps: [
      { say: "c1-a", scene: "night", art: [["🌙", 80, 22, 56, "float"], ["⭐", 18, 20, 26, "twinkle"], ["⭐", 36, 12, 20, "twinkle"], ["⭐", 60, 16, 24, "twinkle"], ["GLOW", 50, 66, 70, "pulse"], ["💤", 63, 46, 30, "float"]] },
      { play: "sky", line: "c1-do", scene: "night", opts: { mode: "bow" } },
      { say: "c1-b", scene: "dusk", art: [["⛺", 34, 66, 96], ["💬", 52, 38, 40, "float"], ["GLOW", 68, 74, 56, "pulse"]] }
    ]
  },
  {
    id: "c2", icon: "🐺", title: "The Jealous Brothers", source: "12:8-18",
    steps: [
      { say: "c2-a", scene: "desert", art: [["BROS", 30, 70, 1], ["💢", 30, 46, 34, "float"], ["GLOW", 74, 70, 56, "pulse"]] },
      { say: "c2-b", scene: "desert", art: [["WELL", 54, 58, 150], ["GLOW", 54, 62, 22, "pulse"], ["BROS", 15, 76, 0.7, "fade"]] },
      { say: "c2-c", scene: "dusk", art: [["⛺", 70, 66, 96], ["BROS", 28, 76, 1], ["👕", 46, 44, 44, "float"], ["🐺", 16, 30, 40], ["❓", 28, 18, 28, "float"]] },
      {
        play: "choice", line: "c2-do", scene: "dusk",
        opts: {
          art: [["🐺", 50, 30, 80], ["❓", 68, 16, 34, "float"]],
          options: [{ label: "Yes, a wolf did it", icon: "🐺", ok: false }, { label: "No, it was not true", icon: "❌", ok: true }],
          wrong: "c2-wrong"
        }
      },
      { say: "c2-d", scene: "dusk", art: [["⛺", 50, 66, 110], ["✨", 50, 30, 40, "float"], ["🌙", 82, 18, 40]] }
    ]
  },
  {
    id: "c3", icon: "💧", title: "The Well", source: "12:19-20",
    steps: [
      { say: "c3-a", scene: "desert", art: [["WELL", 28, 58, 140], ["🐪", 60, 70, 56], ["🐪", 76, 74, 56], ["🌴", 92, 54, 64]] },
      { play: "pull", line: "c3-do", scene: "well" },
      { say: "c3-b", scene: "desert", art: [["🐪", 26, 72, 60, "walk"], ["🐪", 46, 72, 60, "walk"], ["🐪", 66, 72, 60, "walk"], ["GLOW", 46, 54, 40, "pulse"], ["✨", 60, 38, 30, "float"]] }
    ]
  },
  {
    id: "c4", icon: "🐪", title: "Far From Home", source: "12:20-22",
    steps: [
      { say: "c4-a", scene: "desert", art: [["🐪", 40, 72, 70, "walk"], ["GLOW", 40, 52, 40, "pulse"], ["☀️", 84, 18, 50]] },
      { play: "journey", line: "c4-do", scene: "desert", opts: { icon: "🐪", flip: true, rider: true, from: "🌴", to: "🏛️", steps: 6 } },
      { say: "c4-b", scene: "egypt", art: [["🏛️", 72, 50, 110], ["COINS", 30, 72, 1], ["GLOW", 50, 74, 50, "pulse"]] },
      { say: "c4-c", scene: "egypt", art: [["🏛️", 22, 50, 90], ["GLOW", 56, 64, 84, "pulse"], ["📜", 80, 52, 44, "float"], ["✨", 56, 26, 36, "float"]] }
    ]
  },
  {
    id: "c5", icon: "🕯️", title: "Patience in Prison", source: "12:23-35",
    steps: [
      { say: "c5-a", scene: "palace", art: [["🚫", 26, 54, 64], ["GLOW", 54, 72, 50, "walk"], ["🚪", 86, 60, 84]] },
      { say: "c5-b", scene: "palace", art: [["GLOW", 50, 68, 64, "pulse"], ["✨", 50, 32, 40, "float"]] },
      { say: "c5-c", scene: "prison", art: [["GLOW", 50, 62, 60, "pulse"], ["BARS", 0, 0, 1], ["⛓️", 14, 22, 40]] },
      { play: "hold", line: "c5-do", scene: "prison" },
      { say: "c5-d", scene: "prison", art: [["LAMP", 28, 54, 110, "lit"], ["GLOW", 64, 64, 70, "pulse"], ["✨", 64, 28, 34, "float"]] }
    ]
  },
  {
    id: "c6", icon: "🍇", title: "Two Dreams", source: "12:36-42",
    steps: [
      { say: "c6-a", scene: "prison", art: [["GLOW", 50, 70, 60, "pulse"], ["DOT:#7fb5d6", 20, 76, 34], ["DOT:#c9a0dc", 80, 76, 34], ["🍇", 20, 42, 44, "float"], ["🍞", 76, 44, 40, "float"], ["🐦", 86, 26, 32, "float"]] },
      { say: "c6-b", scene: "prison", art: [["T:الله", 50, 32, 64], ["GLOW", 50, 72, 56, "pulse"]] },
      {
        play: "match", line: "c6-do", scene: "prison",
        opts: { pairs: [{ a: "c6-d1", aIcon: "🍇", b: "c6-m1", bIcon: "🔓" }, { a: "c6-d2", aIcon: "🍞🐦", b: "c6-m2", bIcon: "💧" }] }
      },
      { say: "c6-c", scene: "prison", art: [["GLOW", 34, 68, 60, "pulse"], ["⏳", 60, 48, 56, "float"], ["DOT:#7fb5d6", 86, 74, 30, "fade"]] }
    ]
  },
  {
    id: "c7", icon: "🐄", title: "The King's Dream", source: "12:43-49",
    steps: [
      { say: "c7-a", scene: "palace", art: [["👑", 50, 18, 54, "float"], ["🐄", 22, 50, 50], ["🐄", 38, 50, 50], ["🐄", 62, 50, 46, "thin"], ["🐄", 76, 50, 46, "thin"], ["🌾", 24, 82, 40], ["🌾", 38, 82, 40], ["🌾", 62, 82, 40, "dry"], ["🌾", 76, 82, 40, "dry"]] },
      { say: "c7-b", scene: "palace", art: [["👑", 28, 40, 64], ["❓", 44, 22, 34, "float"], ["💡", 72, 34, 50, "float"], ["DOT:#7fb5d6", 72, 74, 34]] },
      { play: "reveal", line: "c7-do", scene: "palace", opts: { items: [{ line: "c7-good", kind: "good", label: "7 good years" }, { line: "c7-hard", kind: "hard", label: "7 hard years" }] } },
      { say: "c7-c", scene: "field", art: [["🌧️", 50, 22, 84, "float"], ["🌾", 22, 74, 48], ["🌾", 40, 80, 48], ["🌾", 60, 74, 48], ["🌾", 78, 80, 48]] }
    ]
  },
  {
    id: "c8", icon: "🔑", title: "Keeper of the Storehouses", source: "12:50-57",
    steps: [
      { say: "c8-a", scene: "palace", art: [["👑", 24, 38, 64], ["⚖️", 50, 28, 54, "float"], ["GLOW", 74, 66, 70, "pulse"], ["✨", 74, 30, 34, "float"]] },
      { say: "c8-b", scene: "egypt", art: [["STORE", 22, 58, 110], ["STORE", 44, 64, 90], ["🔑", 72, 30, 46, "float"], ["GLOWK", 74, 72, 60, "pulse"]] },
      { play: "catch", line: "c8-do", scene: "field", opts: { target: 7 } },
      { say: "c8-c", scene: "egypt", art: [["STORE", 32, 56, 130], ["🌾", 58, 74, 48], ["🌾", 70, 78, 48], ["🌾", 82, 74, 48], ["✨", 32, 18, 40, "float"]] }
    ]
  },
  {
    id: "c9", icon: "⚖️", title: "The Brothers Come", source: "12:58-62",
    steps: [
      { say: "c9-a", scene: "desert", art: [["BROS", 24, 76, 1, "walk"], ["🐪", 50, 70, 56], ["🏛️", 86, 50, 80]] },
      { say: "c9-b", scene: "egypt", art: [["GLOWK", 72, 62, 76, "pulse"], ["BROS", 26, 78, 1], ["❓", 26, 50, 36, "float"]] },
      { play: "fill", line: "c9-do", scene: "egypt", opts: { sacks: 5, taps: 3 } },
      { say: "c9-c", scene: "egypt", art: [["SACK", 26, 68, 90], ["SACK", 46, 72, 90], ["COINS", 36, 38, 1, "float"], ["GLOWK", 78, 64, 60, "pulse"]] }
    ]
  },
  {
    id: "c10", icon: "🏆", title: "The King's Cup", source: "12:63-79",
    steps: [
      { say: "c10-a", scene: "egypt", art: [["GLOWK", 42, 62, 76, "pulse"], ["DOT:#5fb3a0", 64, 74, 38], ["💛", 54, 30, 40, "float"]] },
      { say: "c10-b", scene: "egypt", art: [["SACK", 50, 68, 120], ["CUP", 50, 26, 60, "float"]] },
      { play: "search", line: "c10-do", scene: "egypt", opts: { bags: 5 } },
      { say: "c10-c", scene: "egypt", art: [["CUP", 20, 48, 70], ["GLOWK", 52, 62, 70, "pulse"], ["DOT:#5fb3a0", 72, 74, 38], ["BROS", 92, 84, 0.6, "fade"]] }
    ]
  },
  {
    id: "c11", icon: "💛", title: "“I Am Yusuf”", source: "12:80-92",
    steps: [
      { say: "c11-a", scene: "grey", art: [["⛺", 50, 66, 110], ["☁️", 30, 20, 60, "float"], ["💧", 44, 38, 30, "float"], ["💧", 58, 44, 26, "float"]] },
      { say: "c11-b", scene: "dusk", art: [["⛺", 34, 66, 100], ["🕯️", 58, 50, 50, "float"], ["BROS", 82, 80, 0.8, "walk"]] },
      { say: "c11-c", scene: "egypt", art: [["GLOWK", 64, 58, 96, "pulse"], ["✨", 64, 16, 40, "float"], ["BROS", 22, 80, 1], ["❗", 22, 52, 36, "float"]] },
      {
        play: "choice", line: "c11-do", scene: "egypt",
        opts: {
          art: [["GLOWK", 50, 34, 70, "pulse"]],
          options: [{ label: "He sent them away", icon: "🚪", ok: false }, { label: "He forgave them", icon: "💛", ok: true }],
          wrong: "c11-wrong"
        }
      },
      { say: "c11-d", scene: "egypt", art: [["GLOWK", 62, 60, 84, "pulse"], ["💛", 40, 34, 44, "float"], ["💛", 52, 20, 32, "float"], ["BROS", 22, 80, 1], ["DOT:#5fb3a0", 84, 78, 36]] }
    ]
  },
  {
    id: "c12", icon: "👕", title: "The Shirt", source: "12:93-98",
    steps: [
      { say: "c12-a", scene: "egypt", art: [["👕", 38, 46, 90, "float"], ["GLOWK", 72, 66, 64, "pulse"]] },
      { say: "c12-b", scene: "grey", art: [["⛺", 38, 66, 110], ["🌬️", 72, 34, 56, "float"], ["✨", 86, 24, 28, "float"]] },
      { play: "journey", line: "c12-do", scene: "desert", opts: { icon: "👕", from: "🏛️", to: "⛺", steps: 5, grey: true } },
      { say: "c12-c", scene: "dawn", art: [["⛺", 44, 66, 110], ["👕", 44, 34, 46, "float"], ["☀️", 82, 20, 60, "float"], ["✨", 22, 26, 34, "float"], ["BROS", 84, 82, 0.8]] }
    ]
  },
  {
    id: "c13", icon: "🌙", title: "The Dream Comes True", source: "12:99-101",
    steps: [
      { say: "c13-a", scene: "egypt", art: [["🐪", 16, 74, 50], ["🐪", 30, 78, 50], ["🏛️", 50, 44, 90], ["GLOWK", 72, 66, 80, "pulse"], ["💛", 72, 28, 40, "float"]] },
      { play: "sky", line: "c13-do", scene: "night", opts: { mode: "gather" } },
      { say: "c13-b", scene: "night", art: [["RING", 50, 52, 1], ["GLOWK", 50, 54, 70, "pulse"]] },
      { say: "c13-c", scene: "night", art: [["GLOWK", 50, 66, 84, "pulse"], ["🌙", 80, 22, 50, "float"], ["✨", 28, 26, 34, "float"], ["✨", 62, 16, 26, "float"]] }
    ]
  }
];
