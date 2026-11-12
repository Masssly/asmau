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

  Each chapter has `parent`: notes for the adult, shown under the scene. They
  say what the verses say beyond the child's version, name who a commentary
  is attributed to, and link to the verses. They paraphrase, they do not
  reproduce a translation.
*/
window.YUSUF_STORY = [
  {
    id: "c1", icon: "🌟", title: "The Dream", source: "12:4-6",
    parent: [
      "Verses 12:4–6. Yusuf tells his father about his dream, and his father warns him not to tell his brothers.",
      "Who the stars, sun and moon stand for is not spelled out in the verses. Ibn Kathir's tafsir (abridged English) reports that scholars including Ibn Abbas, Ad-Dahhak, Qatadah, Sufyan al-Thawri and Abd al-Rahman bin Zayd bin Aslam explained the eleven stars as his eleven brothers, and the sun and moon as his father and mother. The game tells children this in the last chapter."
    ],
    steps: [
      { say: "c1-a", scene: "night", art: [["🌙", 80, 18, 50, "float"], ["⭐", 16, 22, 26, "twinkle"], ["⭐", 36, 12, 20, "twinkle"], ["⭐", 62, 14, 24, "twinkle"], ["P:yusuf", 50, 61, 100, "bob", { expr: "sleep" }], ["🛏️", 50, 79, 130], ["💤", 68, 40, 30, "float"]] },
      { play: "sky", line: "c1-do", scene: "night", opts: { mode: "bow" } },
      { say: "c1-b", scene: "dusk", art: [["⛺", 50, 48, 120], ["P:yaqub", 70, 72, 100, "bob", { expr: "calm" }], ["P:yusuf", 30, 76, 84, "bob", { expr: "happy" }], ["💬", 50, 30, 36, "float"]] }
    ]
  },
  {
    id: "c2", icon: "🐺", title: "The Jealous Brothers", source: "12:8-18",
    parent: [
      "Verses 12:8–18. The verses say one brother proposed killing Yusuf or banishing him, and another said not to kill him but to throw him into the well where a caravan might pick him up (12:9–10). The game says only that some wanted to get rid of him and one said not to hurt him.",
      "Yaqub's answer, that patience is best and that he seeks Allah's help against what they describe (12:18), is kept."
    ],
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
    parent: [
      "Verses 12:19–20. A caravan sends someone to draw water, he lets down his bucket and finds a boy (12:19). The verses then say they hid him like merchandise and sold him for a small price (12:20), which the next chapter picks up. The bucket in the game is the one in the verse."
    ],
    steps: [
      { say: "c3-a", scene: "desert", art: [["WELL", 26, 58, 140], ["P:traveller", 70, 70, 100, "bob", { expr: "happy" }], ["🐪", 90, 76, 52], ["🌴", 92, 50, 60]] },
      { play: "pull", line: "c3-do", scene: "well" },
      { say: "c3-b", scene: "desert", art: [["P:traveller", 28, 68, 100, "bob", { expr: "surprised" }], ["P:yusuf", 52, 74, 84, "bob", { expr: "happy" }], ["🐪", 76, 74, 60, "walk"], ["🐪", 92, 78, 50, "walk"], ["✨", 40, 36, 32, "float"]] }
    ]
  },
  {
    id: "c4", icon: "🐪", title: "Far From Home", source: "12:20-22",
    parent: [
      "Verses 12:20–22. Yusuf is sold for a few pieces of silver. The Egyptian who bought him tells his wife to look after him well (12:21), and when Yusuf reaches maturity Allah gives him judgement and knowledge (12:22)."
    ],
    steps: [
      { say: "c4-a", scene: "desert", art: [["🐪", 40, 74, 76, "walk"], ["P:yusuf", 40, 56, 42, "walk", { expr: "worried" }], ["☀️", 84, 18, 50]] },
      { play: "journey", line: "c4-do", scene: "desert", opts: { icon: "🐪", flip: true, rider: true, from: "🌴", to: "🏛️", steps: 6 } },
      { say: "c4-b", scene: "egypt", art: [["🏛️", 76, 44, 110], ["P:master", 70, 72, 96, "bob", { expr: "calm" }], ["P:yusuf", 40, 76, 80, "bob", { expr: "sad" }], ["COINS", 18, 76, 1]] },
      { say: "c4-c", scene: "egypt", art: [["🏛️", 22, 50, 90], ["P:yusufYouth", 56, 66, 96, "bob", { expr: "happy" }], ["📜", 82, 52, 44, "float"], ["✨", 56, 26, 36, "float"]] }
    ]
  },
  {
    id: "c5", icon: "🕯️", title: "Patience in Prison", source: "12:23-35",
    parent: [
      "Verses 12:23–35. The verses are more explicit than the game. The woman of the house bolted the doors and called him to her (12:23); Yusuf refused, they raced for the door, and she tore his shirt from behind (12:25). The game says only that she tried to make him do something wrong.",
      "The shirt test is in the verses: a member of her household suggested that a shirt torn at the front would mean she was telling the truth, and one torn at the back that Yusuf was (12:26–27). Her husband saw that it was torn at the back (12:28).",
      "Left out entirely: the gossip of the women of the city and the banquet with knives (12:30–32). Kept: Yusuf's prayer that prison is better for him than what they ask (12:33–34), and the decision to imprison him even after the signs of his innocence had been seen (12:35)."
    ],
    steps: [
      { say: "c5-a", scene: "palace", art: [["🚫", 22, 50, 56], ["P:yusufYouth", 52, 68, 96, "walk", { expr: "worried" }], ["🚪", 86, 58, 84]] },
      { say: "c5-b1", scene: "palace", art: [["🚪", 88, 58, 80], ["P:yusufYouth", 62, 70, 92, "bob", { expr: "scared" }], ["👕", 28, 54, 76, "float"], ["💢", 22, 28, 30, "float"]] },
      { say: "c5-b2", scene: "palace", art: [["P:helper", 26, 68, 96, "bob", { expr: "calm" }], ["P:yusufYouth", 64, 70, 92, "bob", { expr: "worried" }], ["👕", 45, 34, 56, "float"], ["💡", 26, 32, 36, "float"]] },
      {
        play: "choice", line: "c5-do2", scene: "palace",
        opts: {
          art: [["👕", 50, 30, 100, "float"], ["❓", 70, 16, 34, "float"]],
          options: [{ label: "At the front", icon: "🙂", ok: false }, { label: "At the back", icon: "🔙", ok: true }],
          wrong: "c5-wrong2"
        }
      },
      { say: "c5-b3", scene: "palace", art: [["P:helper", 26, 68, 96, "bob", { expr: "happy" }], ["P:yusufYouth", 64, 70, 92, "bob", { expr: "happy" }], ["👕", 45, 48, 60], ["✨", 45, 24, 34, "float"]] },
      { say: "c5-b4", scene: "palace", art: [["P:yusufYouth", 50, 64, 104, "bob", { expr: "calm" }], ["🤲", 50, 90, 44], ["✨", 50, 24, 40, "float"]] },
      { say: "c5-c", scene: "prison", art: [["P:yusufYouth", 50, 66, 100, "bob", { expr: "sad" }], ["BARS", 0, 0, 1], ["⛓️", 14, 22, 40]] },
      { play: "hold", line: "c5-do", scene: "prison" },
      { say: "c5-d", scene: "prison", art: [["LAMP", 24, 56, 100, "lit"], ["P:yusufYouth", 66, 68, 100, "bob", { expr: "calm" }], ["✨", 66, 26, 34, "float"]] }
    ]
  },
  {
    id: "c6", icon: "🍇", title: "Two Dreams", source: "12:36-42",
    parent: [
      "Verses 12:36–42. Yusuf first calls the two prisoners to worship Allah alone (12:37–40), then interprets the dreams (12:41).",
      "The verse says the second prisoner would be crucified and birds would eat from his head. The game says only that he would be put to death. Ibn Kathir's tafsir (abridged English) notes that Yusuf spoke without naming either man, to lessen the second man's grief; the game follows that gentleness.",
      "The freed prisoner forgot to mention Yusuf to his master, so Yusuf stayed in prison for some years (12:42)."
    ],
    steps: [
      { say: "c6-a", scene: "prison", art: [["P:yusufYouth", 50, 70, 90, "bob", { expr: "calm" }], ["P:prisoner1", 18, 74, 78, "bob", { expr: "worried" }], ["P:prisoner2", 82, 74, 78, "bob", { expr: "worried", flip: true }], ["🍇", 18, 42, 40, "float"], ["🍞", 80, 44, 36, "float"], ["🐦", 90, 26, 30, "float"]] },
      { say: "c6-b", scene: "prison", art: [["T:الله", 50, 28, 60], ["P:yusufYouth", 50, 68, 100, "bob", { expr: "calm" }], ["P:prisoner1", 16, 78, 66, "bob", { expr: "calm" }], ["P:prisoner2", 84, 78, 66, "bob", { expr: "calm", flip: true }]] },
      {
        play: "match", line: "c6-do", scene: "prison",
        opts: {
          pairs: [
            { a: "c6-d1", aIcon: "🍇", aLabel: "Pressing grapes", b: "c6-m1", bIcon: "🔓", bLabel: "Saved" },
            { a: "c6-d2", aIcon: "🍞🐦", aLabel: "Bread and birds", b: "c6-m2", bIcon: "💧", bLabel: "A sad end" }
          ]
        }
      },
      { say: "c6-c", scene: "prison", art: [["P:yusufYouth", 34, 70, 96, "bob", { expr: "sad" }], ["⏳", 60, 46, 52, "float"], ["P:prisoner1", 86, 76, 68, "bob", { expr: "happy", flip: true }]] }
    ]
  },
  {
    id: "c7", icon: "🐄", title: "The King's Dream", source: "12:43-49",
    parent: [
      "Verses 12:43–49. The king dreams of seven fat cows eaten by seven lean ones, and of seven green ears of grain and seven withered ones. Yusuf's interpretation: seven years of sowing as usual with the harvest stored, seven hard years that use up the store, and then a year of abundant rain (12:47–49). The freed prisoner finally remembered Yusuf and asked to go and find out the meaning (12:45)."
    ],
    steps: [
      { say: "c7-a", scene: "palace", art: [["P:king", 50, 22, 76, "bob", { expr: "sleep" }], ["🐄", 22, 56, 50], ["🐄", 38, 56, 50], ["🐄", 62, 56, 46, "thin"], ["🐄", 76, 56, 46, "thin"], ["🌾", 24, 84, 40], ["🌾", 38, 84, 40], ["🌾", 62, 84, 40, "dry"], ["🌾", 76, 84, 40, "dry"]] },
      { say: "c7-b", scene: "palace", art: [["P:king", 28, 62, 100, "bob", { expr: "worried" }], ["❓", 44, 26, 34, "float"], ["💡", 74, 32, 50, "float"], ["P:prisoner1", 74, 74, 84, "bob", { expr: "surprised", flip: true }]] },
      { play: "reveal", line: "c7-do", scene: "palace", opts: { items: [{ line: "c7-good", kind: "good", label: "7 good years" }, { line: "c7-hard", kind: "hard", label: "7 hard years" }] } },
      { say: "c7-c", scene: "field", art: [["🌧️", 50, 22, 84, "float"], ["🌾", 22, 74, 48], ["🌾", 40, 80, 48], ["🌾", 60, 74, 48], ["🌾", 78, 80, 48]] }
    ]
  },
  {
    id: "c8", icon: "🔑", title: "Truth and Trust", source: "12:50-57",
    parent: [
      "Verses 12:50–57. When the king's messenger came, Yusuf asked first that the king look into what had happened (12:50). Ibn Kathir's tafsir (abridged English) says he refused to leave prison until the king and his people declared his innocence. The king questioned the women; they said they knew no evil of Yusuf, and the woman of the house said the truth had come out and that Yusuf was among the truthful (12:51).",
      "Verses 12:52–53 are left out of the game because scholars differ on who is speaking. Ibn Kathir's tafsir (abridged English) favours them as the woman's words, and says Ibn Jarir al-Tabari and Ibn Abi Hatim took them as Yusuf's. Some translations put them in Yusuf's mouth. Read them with your child, and with a scholar if you wish.",
      "The king then trusted Yusuf (12:54), and Yusuf asked to be put in charge of the storehouses (12:55)."
    ],
    steps: [
      { say: "c8-a1", scene: "prison", art: [["P:yusufYouth", 50, 66, 100, "bob", { expr: "calm" }], ["BARS", 0, 0, 1], ["👑", 82, 22, 46, "float"], ["✉️", 18, 24, 40, "float"]] },
      { say: "c8-a2", scene: "palace", art: [["P:king", 28, 66, 100, "bob", { expr: "neutral" }], ["P:woman1", 64, 72, 92, "bob", { expr: "sad" }], ["P:woman2", 90, 78, 66, "bob", { expr: "neutral", flip: true }], ["❓", 28, 30, 34, "float"], ["💡", 64, 30, 40, "float"]] },
      {
        play: "order", line: "c8-do-o", scene: "palace",
        opts: {
          wrong: "c8-wrong-o",
          cards: [
            { line: "c8-o1", icon: "🔒", label: "Yusuf asks for the truth" },
            { line: "c8-o2", icon: "👑", label: "The king asks what happened" },
            { line: "c8-o3", icon: "🗣️", label: "The woman tells the truth" },
            { line: "c8-o4", icon: "🔑", label: "The king trusts Yusuf" }
          ]
        }
      },
      { say: "c8-b", scene: "egypt", art: [["STORE", 20, 58, 110], ["STORE", 42, 64, 90], ["🔑", 66, 26, 46, "float"], ["P:yusufMan", 78, 72, 100, "bob", { expr: "happy" }]] },
      { play: "catch", line: "c8-do", scene: "field", opts: { target: 7 } },
      { say: "c8-c", scene: "egypt", art: [["STORE", 30, 56, 130], ["🌾", 56, 82, 48], ["🌾", 40, 86, 48], ["P:yusufMan", 76, 68, 100, "bob", { expr: "happy" }], ["✨", 30, 18, 40, "float"]] }
    ]
  },
  {
    id: "c9", icon: "⚖️", title: "The Brothers Come", source: "12:58-62",
    parent: [
      "Verses 12:58–62. Yusuf recognised his brothers but they did not recognise him (12:58). He asked them to bring their other brother, and had their goods put back into their saddlebags (12:59–62)."
    ],
    steps: [
      { say: "c9-a", scene: "desert", art: [["G:brothers", 34, 74, 180, "walk", { expr: "neutral" }], ["🐪", 62, 74, 56], ["🏛️", 88, 48, 80]] },
      { say: "c9-b", scene: "egypt", art: [["P:yusufMan", 76, 66, 104, "bob", { expr: "neutral" }], ["G:brothers", 32, 78, 190, "bob", { expr: "worried" }], ["❓", 26, 44, 36, "float"]] },
      { play: "fill", line: "c9-do", scene: "egypt", opts: { sacks: 5, taps: 3 } },
      { say: "c9-c", scene: "egypt", art: [["SACK", 24, 72, 90], ["SACK", 42, 76, 90], ["COINS", 32, 40, 1, "float"], ["P:yusufMan", 76, 66, 100, "bob", { expr: "happy" }]] }
    ]
  },
  {
    id: "c10", icon: "🏆", title: "The King's Cup", source: "12:63-79",
    parent: [
      "Verses 12:63–79. Yaqub let Benjamin go only after his sons swore to bring him back (12:63–66). Yusuf told Benjamin privately that he was his brother (12:69), and the king's cup was put in Benjamin's pack (12:70). The verse says Yusuf searched the other bags first and then his brother's, where he found the cup (12:76), so the game keeps that order: the cup is in the last bag on purpose. The same verse says this was a plan Allah devised for Yusuf."
    ],
    steps: [
      { say: "c10-a", scene: "egypt", art: [["P:yusufMan", 38, 66, 100, "bob", { expr: "happy" }], ["P:benjamin", 68, 74, 84, "bob", { expr: "happy" }], ["💛", 54, 28, 40, "float"]] },
      { say: "c10-b", scene: "egypt", art: [["SACK", 50, 72, 120], ["CUP", 50, 26, 60, "float"], ["P:yusufMan", 18, 66, 90, "bob", { expr: "calm" }], ["P:benjamin", 84, 74, 70, "bob", { expr: "neutral", flip: true }]] },
      { play: "search", line: "c10-do", scene: "egypt", opts: { owners: ["b1", "b3", "b2", "b4", "benjamin"], nope: "c10-nope" } },
      { say: "c10-c", scene: "egypt", art: [["CUP", 18, 46, 70], ["P:yusufMan", 50, 64, 100, "bob", { expr: "happy" }], ["P:benjamin", 78, 74, 84, "bob", { expr: "happy" }], ["✨", 50, 22, 36, "float"]] }
    ]
  },
  {
    id: "c11", icon: "💛", title: "“I Am Yusuf”", source: "12:80-92",
    parent: [
      "Verses 12:80–92. Yaqub's eyes went white with grief (12:84), yet he told his sons not to despair of Allah's mercy (12:87). When the brothers came again, Yusuf asked whether they understood what they had done, and revealed himself (12:89–90). The brothers admitted they had been in the wrong (12:91). Yusuf said there would be no reproach that day and asked Allah to forgive them (12:92)."
    ],
    steps: [
      { say: "c11-a", scene: "grey", art: [["⛺", 52, 54, 110], ["P:yaqub", 50, 72, 104, "bob", { expr: "cry", blind: true }], ["☁️", 28, 20, 60, "float"], ["💧", 70, 34, 28, "float"]] },
      { say: "c11-b", scene: "dusk", art: [["⛺", 28, 52, 100], ["P:yaqub", 28, 72, 92, "bob", { expr: "sad" }], ["🕯️", 54, 48, 50, "float"], ["G:brothers", 70, 78, 150, "walk", { expr: "neutral", flip: true }]] },
      { say: "c11-c", scene: "egypt", art: [["P:yusufMan", 68, 64, 104, "bob", { expr: "happy" }], ["G:brothers", 32, 78, 190, "bob", { expr: "surprised" }], ["❗", 24, 46, 36, "float"], ["✨", 68, 16, 40, "float"]] },
      { say: "c11-e", scene: "egypt", art: [["P:yusufMan", 68, 64, 104, "bob", { expr: "calm" }], ["G:brothers", 32, 78, 190, "bob", { expr: "sad" }]] },
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
    parent: [
      "Verses 12:93–98. Yusuf sent his shirt to be laid over his father's face (12:93). Yaqub said he could smell Yusuf (12:94), and when the shirt was laid on his face his sight returned (12:96). The brothers asked him to seek forgiveness for them, and he said he would (12:97–98)."
    ],
    steps: [
      { say: "c12-a", scene: "egypt", art: [["👕", 34, 42, 90, "float"], ["P:yusufMan", 72, 66, 104, "bob", { expr: "calm" }]] },
      { say: "c12-b", scene: "grey", art: [["⛺", 38, 56, 110], ["P:yaqub", 38, 74, 96, "bob", { expr: "surprised" }], ["🌬️", 74, 34, 56, "float"], ["✨", 86, 24, 28, "float"]] },
      { play: "journey", line: "c12-do", scene: "desert", opts: { icon: "👕", from: "🏛️", to: "⛺", steps: 5, grey: true } },
      { say: "c12-c", scene: "dawn", art: [["⛺", 42, 56, 110], ["P:yaqub", 42, 74, 100, "bob", { expr: "happy" }], ["👕", 42, 30, 46, "float"], ["☀️", 84, 18, 60, "float"], ["✨", 20, 26, 34, "float"], ["G:brothers", 76, 84, 120, "bob", { expr: "happy" }]] }
    ]
  },
  {
    id: "c13", icon: "🌙", title: "The Dream Comes True", source: "12:99-101",
    parent: [
      "Verses 12:99–101. Yusuf welcomed his parents to Egypt, they all bowed down before him, and he said this was the fulfilment of his dream (12:99–100). He ends with a prayer (12:101), which the game keeps.",
      "The bowing: Ibn Kathir's tafsir (abridged English) says that, according to Qatadah and other scholars, prostrating to people of authority as a greeting was allowed in the laws of earlier prophets and was later prohibited, and that in Islam prostration is for Allah alone. It is worth explaining this to a child, so the scene is not read as an example to follow.",
      "Scholars differ on whether Yusuf's mother was still alive. As-Suddi and Abd al-Rahman bin Zayd bin Aslam said his parents were his father and his maternal aunt; Muhammad bin Ishaq and Ibn Jarir al-Tabari said both parents were alive (Ibn Kathir's tafsir, abridged English). The game says only 'his parents'.",
      "The stars, sun and moon: see chapter 1 for the explanation attributed to Ibn Abbas and others, which the game gives children here."
    ],
    steps: [
      { say: "c13-a", scene: "egypt", art: [["🐪", 12, 78, 50], ["🏛️", 40, 42, 90], ["P:yaqub", 58, 72, 96, "bob", { expr: "happy" }], ["P:yusufMan", 82, 68, 96, "bob", { expr: "happy", flip: true }], ["💛", 70, 30, 40, "float"]] },
      { play: "sky", line: "c13-do", scene: "night", opts: { mode: "gather" } },
      { say: "c13-b", scene: "night", art: [["RING", 50, 44, 1], ["P:yusufMan", 50, 46, 80, "bob", { expr: "happy" }], ["P:yaqub", 22, 80, 80, "bob", { expr: "calm", rot: 28 }], ["G:brothers", 74, 84, 150, "bob", { expr: "calm", rot: -24 }]] },
      {
        play: "choice", line: "c13-q", scene: "night",
        opts: {
          art: [["RING", 50, 36, 1], ["P:yusufMan", 50, 38, 70, "bob", { expr: "calm" }]],
          options: [{ label: "His eleven brothers", icon: "🌟", ok: true }, { label: "Eleven camels", icon: "🐪", ok: false }],
          wrong: "c13-qwrong"
        }
      },
      { say: "c13-b0", scene: "night", art: [["RING", 50, 44, 1], ["P:yusufMan", 50, 46, 80, "bob", { expr: "happy" }]] },
      { say: "c13-c", scene: "night", art: [["P:yusufMan", 50, 62, 104, "bob", { expr: "calm" }], ["🤲", 50, 88, 44], ["🌙", 80, 20, 50, "float"], ["✨", 28, 26, 34, "float"], ["✨", 64, 16, 26, "float"]] }
    ]
  }
];

/*
  Which music plays on a step, by its line id. Anything not listed uses its
  scene's default (see SCENE_MOOD in game.js). Keyed by line id, not by
  position, so adding or moving a step never silently shifts the music.
  Moods: wonder, desert, tense, sad, regal, joy.
*/
window.YUSUF_MOODS = {
  "c1-b": "wonder",
  "c2-a": "tense", "c2-b": "tense", "c2-c": "tense", "c2-do": "tense",
  "c3-b": "joy",
  "c4-b": "sad",
  "c5-a": "tense", "c5-b1": "tense", "c5-b2": "tense", "c5-do2": "tense", "c5-b3": "wonder", "c5-b4": "wonder", "c5-do": "tense", "c5-d": "wonder",
  "c6-b": "wonder", "c6-do": "wonder",
  "c7-a": "tense", "c7-b": "tense", "c7-do": "wonder",
  "c8-a1": "tense", "c8-a2": "tense", "c8-do-o": "wonder", "c8-c": "joy",
  "c9-b": "tense", "c9-do": "desert",
  "c10-b": "tense", "c10-do": "tense", "c10-c": "joy",
  "c11-c": "tense", "c11-e": "sad", "c11-do": "tense", "c11-d": "joy",
  "c12-a": "joy",
  "c13-a": "joy", "c13-b": "joy", "c13-q": "wonder", "c13-b0": "joy", "c13-c": "wonder"
};
