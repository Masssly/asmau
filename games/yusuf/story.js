/*
  The shape of the story: chapters -> steps.

  A step is either
    { say: <line id>, scene, art }           a narrated picture, or
    { play: <activity>, line, scene, opts }  something for the child to do.

  Every word spoken or shown comes from narration.json (by line id), so the
  caption, the audio and the recording tool can never drift apart.

  art is a list of sprites: [kind, x%, y%, size, animation, options].
  kind is an emoji, a drawn piece from game.js (WELL, SACK, CUP, STORE, LAMP,
  COINS, BARS, RING, T:<text>), a person "P:<name>" or a group "G:<name>"
  (see people.js). For people, size is their width in px and options can set
  expr (their expression), blind, flip and rot (lean forward, to bow).
  Everyone is drawn with dark skin.
*/
window.YUSUF_STORY = [
  {
    id: "c1", icon: "🌟", title: "The Dream", source: "12:4-6",
    steps: [
      { say: "c1-a", scene: "night", art: [["🌙", 80, 18, 50, "float"], ["⭐", 16, 22, 26, "twinkle"], ["⭐", 36, 12, 20, "twinkle"], ["⭐", 62, 14, 24, "twinkle"], ["P:yusuf", 50, 61, 100, "bob", { expr: "sleep" }], ["🛏️", 50, 79, 130], ["💤", 68, 40, 30, "float"]] },
      { play: "sky", line: "c1-do", scene: "night", opts: { mode: "bow" } },
      { say: "c1-b", scene: "dusk", art: [["⛺", 50, 48, 120], ["P:yaqub", 70, 72, 100, "bob", { expr: "calm" }], ["P:yusuf", 30, 76, 84, "bob", { expr: "happy" }], ["💬", 50, 30, 36, "float"]] }
    ]
  },
  {
    id: "c2", icon: "🐺", title: "The Jealous Brothers", source: "12:8-18",
    steps: [
      { say: "c2-a", scene: "desert", art: [["G:brothers", 36, 72, 200, "bob", { expr: "angry" }], ["P:yusuf", 82, 74, 80, "bob", { expr: "happy" }], ["💢", 30, 40, 34, "float"]] },
      { say: "c2-b", scene: "desert", art: [["P:yusuf", 54, 50, 44, null, { expr: "scared" }], ["WELL", 54, 58, 150], ["G:brothers", 22, 80, 130, "bob", { expr: "neutral" }]] },
      { say: "c2-c", scene: "dusk", art: [["⛺", 74, 50, 110], ["P:yaqub", 74, 72, 92, "bob", { expr: "worried" }], ["G:brothers", 32, 78, 190, "bob", { expr: "cry" }], ["👕", 50, 40, 44, "float"], ["🐺", 14, 24, 40], ["💭", 28, 38, 34, "float"]] },
      {
        play: "choice", line: "c2-do", scene: "dusk",
        opts: {
          art: [["🐺", 50, 30, 80], ["❓", 68, 16, 34, "float"]],
          options: [{ label: "Yes, a wolf did it", icon: "🐺", ok: false }, { label: "No, it was not true", icon: "❌", ok: true }],
          wrong: "c2-wrong"
        }
      },
      { say: "c2-d", scene: "dusk", art: [["⛺", 50, 48, 120], ["P:yaqub", 50, 70, 104, "bob", { expr: "calm" }], ["✨", 50, 22, 40, "float"], ["🌙", 82, 18, 40]] }
    ]
  },
  {
    id: "c3", icon: "💧", title: "The Well", source: "12:19-20",
    steps: [
      { say: "c3-a", scene: "desert", art: [["WELL", 26, 58, 140], ["P:traveller", 70, 70, 100, "bob", { expr: "happy" }], ["🐪", 90, 76, 52], ["🌴", 92, 50, 60]] },
      { play: "pull", line: "c3-do", scene: "well" },
      { say: "c3-b", scene: "desert", art: [["P:traveller", 28, 68, 100, "bob", { expr: "surprised" }], ["P:yusuf", 52, 74, 84, "bob", { expr: "happy" }], ["🐪", 76, 74, 60, "walk"], ["🐪", 92, 78, 50, "walk"], ["✨", 40, 36, 32, "float"]] }
    ]
  },
  {
    id: "c4", icon: "🐪", title: "Far From Home", source: "12:20-22",
    steps: [
      { say: "c4-a", scene: "desert", art: [["🐪", 40, 74, 76, "walk"], ["P:yusuf", 40, 56, 42, "walk", { expr: "worried" }], ["☀️", 84, 18, 50]] },
      { play: "journey", line: "c4-do", scene: "desert", opts: { icon: "🐪", flip: true, rider: true, from: "🌴", to: "🏛️", steps: 6 } },
      { say: "c4-b", scene: "egypt", art: [["🏛️", 76, 44, 110], ["P:master", 70, 72, 96, "bob", { expr: "calm" }], ["P:yusuf", 40, 76, 80, "bob", { expr: "sad" }], ["COINS", 18, 76, 1]] },
      { say: "c4-c", scene: "egypt", art: [["🏛️", 22, 50, 90], ["P:yusufYouth", 56, 66, 96, "bob", { expr: "happy" }], ["📜", 82, 52, 44, "float"], ["✨", 56, 26, 36, "float"]] }
    ]
  },
  {
    id: "c5", icon: "🕯️", title: "Patience in Prison", source: "12:23-35",
    steps: [
      { say: "c5-a", scene: "palace", art: [["🚫", 24, 50, 60], ["P:yusufYouth", 54, 70, 96, "walk", { expr: "worried" }], ["🚪", 86, 60, 84]] },
      { say: "c5-b", scene: "palace", art: [["P:yusufYouth", 50, 64, 104, "bob", { expr: "calm" }], ["🤲", 50, 90, 44], ["✨", 50, 24, 40, "float"]] },
      { say: "c5-c", scene: "prison", art: [["P:yusufYouth", 50, 66, 100, "bob", { expr: "sad" }], ["BARS", 0, 0, 1], ["⛓️", 14, 22, 40]] },
      { play: "hold", line: "c5-do", scene: "prison" },
      { say: "c5-d", scene: "prison", art: [["LAMP", 24, 56, 100, "lit"], ["P:yusufYouth", 66, 68, 100, "bob", { expr: "calm" }], ["✨", 66, 26, 34, "float"]] }
    ]
  },
  {
    id: "c6", icon: "🍇", title: "Two Dreams", source: "12:36-42",
    steps: [
      { say: "c6-a", scene: "prison", art: [["P:yusufYouth", 50, 70, 90, "bob", { expr: "calm" }], ["P:prisoner1", 18, 74, 78, "bob", { expr: "worried" }], ["P:prisoner2", 82, 74, 78, "bob", { expr: "worried", flip: true }], ["🍇", 18, 42, 40, "float"], ["🍞", 80, 44, 36, "float"], ["🐦", 90, 26, 30, "float"]] },
      { say: "c6-b", scene: "prison", art: [["T:الله", 50, 28, 60], ["P:yusufYouth", 50, 68, 100, "bob", { expr: "calm" }], ["P:prisoner1", 16, 78, 66, "bob", { expr: "calm" }], ["P:prisoner2", 84, 78, 66, "bob", { expr: "calm", flip: true }]] },
      {
        play: "match", line: "c6-do", scene: "prison",
        opts: { pairs: [{ a: "c6-d1", aIcon: "🍇", b: "c6-m1", bIcon: "🔓" }, { a: "c6-d2", aIcon: "🍞🐦", b: "c6-m2", bIcon: "💧" }] }
      },
      { say: "c6-c", scene: "prison", art: [["P:yusufYouth", 34, 70, 96, "bob", { expr: "sad" }], ["⏳", 60, 46, 52, "float"], ["P:prisoner1", 86, 76, 68, "bob", { expr: "happy", flip: true }]] }
    ]
  },
  {
    id: "c7", icon: "🐄", title: "The King's Dream", source: "12:43-49",
    steps: [
      { say: "c7-a", scene: "palace", art: [["P:king", 50, 22, 76, "bob", { expr: "sleep" }], ["🐄", 22, 56, 50], ["🐄", 38, 56, 50], ["🐄", 62, 56, 46, "thin"], ["🐄", 76, 56, 46, "thin"], ["🌾", 24, 84, 40], ["🌾", 38, 84, 40], ["🌾", 62, 84, 40, "dry"], ["🌾", 76, 84, 40, "dry"]] },
      { say: "c7-b", scene: "palace", art: [["P:king", 28, 62, 100, "bob", { expr: "worried" }], ["❓", 44, 26, 34, "float"], ["💡", 74, 32, 50, "float"], ["P:prisoner1", 74, 74, 84, "bob", { expr: "surprised", flip: true }]] },
      { play: "reveal", line: "c7-do", scene: "palace", opts: { items: [{ line: "c7-good", kind: "good", label: "7 good years" }, { line: "c7-hard", kind: "hard", label: "7 hard years" }] } },
      { say: "c7-c", scene: "field", art: [["🌧️", 50, 22, 84, "float"], ["🌾", 22, 74, 48], ["🌾", 40, 80, 48], ["🌾", 60, 74, 48], ["🌾", 78, 80, 48]] }
    ]
  },
  {
    id: "c8", icon: "🔑", title: "Keeper of the Storehouses", source: "12:50-57",
    steps: [
      { say: "c8-a", scene: "palace", art: [["P:king", 24, 68, 96, "bob", { expr: "happy" }], ["⚖️", 50, 26, 54, "float"], ["P:yusufMan", 76, 70, 100, "bob", { expr: "calm" }], ["✨", 76, 30, 34, "float"]] },
      { say: "c8-b", scene: "egypt", art: [["STORE", 20, 58, 110], ["STORE", 42, 64, 90], ["🔑", 66, 26, 46, "float"], ["P:yusufMan", 78, 72, 100, "bob", { expr: "happy" }]] },
      { play: "catch", line: "c8-do", scene: "field", opts: { target: 7 } },
      { say: "c8-c", scene: "egypt", art: [["STORE", 30, 56, 130], ["🌾", 56, 82, 48], ["🌾", 40, 86, 48], ["P:yusufMan", 76, 68, 100, "bob", { expr: "happy" }], ["✨", 30, 18, 40, "float"]] }
    ]
  },
  {
    id: "c9", icon: "⚖️", title: "The Brothers Come", source: "12:58-62",
    steps: [
      { say: "c9-a", scene: "desert", art: [["G:brothers", 34, 74, 180, "walk", { expr: "neutral" }], ["🐪", 62, 74, 56], ["🏛️", 88, 48, 80]] },
      { say: "c9-b", scene: "egypt", art: [["P:yusufMan", 76, 66, 104, "bob", { expr: "neutral" }], ["G:brothers", 32, 78, 190, "bob", { expr: "worried" }], ["❓", 26, 44, 36, "float"]] },
      { play: "fill", line: "c9-do", scene: "egypt", opts: { sacks: 5, taps: 3 } },
      { say: "c9-c", scene: "egypt", art: [["SACK", 24, 72, 90], ["SACK", 42, 76, 90], ["COINS", 32, 40, 1, "float"], ["P:yusufMan", 76, 66, 100, "bob", { expr: "happy" }]] }
    ]
  },
  {
    id: "c10", icon: "🏆", title: "The King's Cup", source: "12:63-79",
    steps: [
      { say: "c10-a", scene: "egypt", art: [["P:yusufMan", 38, 66, 100, "bob", { expr: "happy" }], ["P:benjamin", 68, 74, 84, "bob", { expr: "happy" }], ["💛", 54, 28, 40, "float"]] },
      { say: "c10-b", scene: "egypt", art: [["SACK", 50, 72, 120], ["CUP", 50, 26, 60, "float"], ["P:yusufMan", 18, 66, 90, "bob", { expr: "calm" }], ["P:benjamin", 84, 74, 70, "bob", { expr: "neutral", flip: true }]] },
      { play: "search", line: "c10-do", scene: "egypt", opts: { bags: 5 } },
      { say: "c10-c", scene: "egypt", art: [["CUP", 18, 46, 70], ["P:yusufMan", 50, 64, 100, "bob", { expr: "happy" }], ["P:benjamin", 78, 74, 84, "bob", { expr: "happy" }], ["✨", 50, 22, 36, "float"]] }
    ]
  },
  {
    id: "c11", icon: "💛", title: "“I Am Yusuf”", source: "12:80-92",
    steps: [
      { say: "c11-a", scene: "grey", art: [["⛺", 52, 54, 110], ["P:yaqub", 50, 72, 104, "bob", { expr: "cry", blind: true }], ["☁️", 28, 20, 60, "float"], ["💧", 70, 34, 28, "float"]] },
      { say: "c11-b", scene: "dusk", art: [["⛺", 28, 52, 100], ["P:yaqub", 28, 72, 92, "bob", { expr: "sad" }], ["🕯️", 54, 48, 50, "float"], ["G:brothers", 70, 78, 150, "walk", { expr: "neutral", flip: true }]] },
      { say: "c11-c", scene: "egypt", art: [["P:yusufMan", 68, 64, 104, "bob", { expr: "happy" }], ["G:brothers", 32, 78, 190, "bob", { expr: "surprised" }], ["❗", 24, 46, 36, "float"], ["✨", 68, 16, 40, "float"]] },
      {
        play: "choice", line: "c11-do", scene: "egypt",
        opts: {
          art: [["P:yusufMan", 50, 38, 96, "bob", { expr: "calm" }]],
          options: [{ label: "He sent them away", icon: "🚪", ok: false }, { label: "He forgave them", icon: "💛", ok: true }],
          wrong: "c11-wrong"
        }
      },
      { say: "c11-d", scene: "egypt", art: [["P:yusufMan", 68, 64, 100, "bob", { expr: "happy" }], ["G:brothers", 30, 78, 170, "bob", { expr: "happy" }], ["P:benjamin", 91, 80, 56, "bob", { expr: "happy", flip: true }], ["💛", 40, 32, 44, "float"], ["💛", 54, 18, 32, "float"]] }
    ]
  },
  {
    id: "c12", icon: "👕", title: "The Shirt", source: "12:93-98",
    steps: [
      { say: "c12-a", scene: "egypt", art: [["👕", 34, 42, 90, "float"], ["P:yusufMan", 72, 66, 104, "bob", { expr: "calm" }]] },
      { say: "c12-b", scene: "grey", art: [["⛺", 38, 56, 110], ["P:yaqub", 38, 74, 96, "bob", { expr: "surprised" }], ["🌬️", 74, 34, 56, "float"], ["✨", 86, 24, 28, "float"]] },
      { play: "journey", line: "c12-do", scene: "desert", opts: { icon: "👕", from: "🏛️", to: "⛺", steps: 5, grey: true } },
      { say: "c12-c", scene: "dawn", art: [["⛺", 42, 56, 110], ["P:yaqub", 42, 74, 100, "bob", { expr: "happy" }], ["👕", 42, 30, 46, "float"], ["☀️", 84, 18, 60, "float"], ["✨", 20, 26, 34, "float"], ["G:brothers", 76, 84, 120, "bob", { expr: "happy" }]] }
    ]
  },
  {
    id: "c13", icon: "🌙", title: "The Dream Comes True", source: "12:99-101",
    steps: [
      { say: "c13-a", scene: "egypt", art: [["🐪", 12, 78, 50], ["🏛️", 40, 42, 90], ["P:yaqub", 58, 72, 96, "bob", { expr: "happy" }], ["P:yusufMan", 82, 68, 96, "bob", { expr: "happy", flip: true }], ["💛", 70, 30, 40, "float"]] },
      { play: "sky", line: "c13-do", scene: "night", opts: { mode: "gather" } },
      { say: "c13-b", scene: "night", art: [["RING", 50, 44, 1], ["P:yusufMan", 50, 46, 80, "bob", { expr: "happy" }], ["P:yaqub", 22, 80, 80, "bob", { expr: "calm", rot: 28 }], ["G:brothers", 74, 84, 150, "bob", { expr: "calm", rot: -24 }]] },
      { say: "c13-c", scene: "night", art: [["P:yusufMan", 50, 62, 104, "bob", { expr: "calm" }], ["🤲", 50, 88, 44], ["🌙", 80, 20, 50, "float"], ["✨", 28, 26, 34, "float"], ["✨", 64, 16, 26, "float"]] }
    ]
  }
];

/*
  Which music plays on each step, as "chapter:step". Anything not listed
  uses its scene's default (see SCENE_MOOD in game.js).
  Moods: wonder, desert, tense, sad, regal, joy.
*/
window.YUSUF_MOODS = {
  "c1:2": "wonder",
  "c2:0": "tense", "c2:1": "tense", "c2:2": "tense", "c2:3": "tense",
  "c3:2": "joy",
  "c4:2": "sad",
  "c5:0": "tense", "c5:1": "wonder", "c5:3": "tense", "c5:4": "wonder",
  "c6:1": "wonder", "c6:2": "wonder",
  "c7:0": "tense", "c7:1": "tense", "c7:2": "wonder",
  "c8:3": "joy",
  "c9:1": "tense", "c9:2": "desert",
  "c10:1": "tense", "c10:2": "tense", "c10:3": "joy",
  "c11:2": "tense", "c11:3": "tense", "c11:4": "joy",
  "c12:0": "joy",
  "c13:0": "joy", "c13:2": "joy", "c13:3": "wonder"
};
