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

  A narrated step shows a picture instead of its sprites when art.js lists one
  under the step's line id; `over` lists sprites to keep on top of the picture.
  An activity can name a picture with opts.img, or a backdrop with opts.bg.
  `src` on a step puts a small label on the scene saying where a detail comes
  from, when it is from a commentary and not from the verse itself.

  Each chapter has `parent`: notes for the adult, shown under the scene. They
  say what the verses say beyond the child's version, name who a commentary
  is attributed to, and link to the verses. They paraphrase, they do not
  reproduce a translation.
*/
window.STORY = [
  {
    id: "c1", icon: "🌟", title: "The Dream", source: "12:4-6",
    parent: [
      "Verses 12:4–6. Yusuf tells his father about his dream, and his father warns him not to tell his brothers.",
      "Who the stars, sun and moon stand for is not spelled out in the verses. Ibn Kathir's tafsir (abridged English) reports that scholars including Ibn Abbas, Ad-Dahhak, Qatadah, Sufyan al-Thawri and Abd al-Rahman bin Zayd bin Aslam explained the eleven stars as his eleven brothers, and the sun and moon as his father and mother. The game tells children this in the last chapter."
    ],
    steps: [
      { say: "c1-a", scene: "night", art: [["🌙", 80, 18, 50, "float"], ["⭐", 16, 22, 26, "twinkle"], ["⭐", 36, 12, 20, "twinkle"], ["⭐", 62, 14, 24, "twinkle"], ["P:yusuf", 50, 61, 100, "bob", { expr: "sleep" }], ["🛏️", 50, 79, 130], ["💤", 68, 40, 30, "float"]] },
      { play: "sky", line: "c1-do", scene: "night", opts: { mode: "bow" } },
      { say: "c1-b", scene: "dusk", art: [["⛺", 50, 48, 120], ["P:yaqub", 70, 72, 100, "bob", { expr: "calm" }], ["P:yusuf", 30, 76, 84, "bob", { expr: "happy" }], ["💬", 50, 30, 36, "float"]] },
      { play: "choice", line: "c1-q", scene: "dusk", opts: { img: "c1-b", art: [["❓", 50, 28, 70, "float"]], options: [{ label: "Tell all his brothers", icon: "📣", ok: false }, { label: "Keep it from his brothers", icon: "🤫", ok: true }], wrong: "c1-qwrong" } },
      { play: "puzzle", line: "pz-do", scene: "night", opts: { pic: "c1-a" } }
    ]
  },
  {
    id: "c2", icon: "🐺", title: "The Jealous Brothers", source: "12:8-18",
    parent: [
      "Verses 12:8–18. The verses say one brother proposed killing Yusuf or banishing him, and another said not to kill him but to throw him into the well where a caravan might pick him up (12:9–10). The game says only that some wanted to get rid of him and one said not to hurt him.",
      "Verses 12:11–14. Before taking him, the brothers asked their father why he did not trust them with Yusuf, and asked to take him out the next day so that he would enjoy himself and play; they promised to look after him. Yaqub said it grieved him to let him go and that he feared a wolf would eat him while they were not paying attention; they answered that if a wolf ate him when there were so many of them, they would be losers. Ibn Kathir's tafsir (abridged English) gives the same reason, 'so that we all enjoy ourselves and play', reported from Qatadah, Ad-Dahhak and As-Suddi. Some retellings add that the brothers said Yusuf stayed indoors too much and needed to grow strong; that is not in the verses or in that tafsir, so the game does not say it. Notice with your child that the brothers later used the very thing their father had said he feared: the wolf.",
      "Yaqub's answer, that patience is best and that he seeks Allah's help against what they describe (12:18), is kept.",
      "In the well: the verse says Allah revealed to Yusuf that he would one day tell his brothers of this while they did not realise (12:15). Ibn Kathir's tafsir (abridged English) explains this as comfort sent in his distress, and reports from Ibn Abbas that the brothers would not recognise him when he reminded them. The same tafsir relates that Yusuf stood on a stone in the water of the well; the picture shows that. The stone is from the commentary, not from the verse.",
      "The shirt: the verse says they brought his shirt with false blood on it (12:18). Ibn Kathir's tafsir (abridged English) says, citing Mujahid, As-Suddi and others, that the blood was a sheep's, and that the brothers forgot to tear the shirt, which is why Yaqub did not believe them. The untorn shirt, which the game turns into a question, is from this commentary, not from the verse."
    ],
    steps: [
      { say: "c2-a", scene: "desert", art: [["G:brothers", 36, 72, 200, "bob", { expr: "angry" }], ["P:yusuf", 82, 74, 80, "bob", { expr: "happy" }], ["💢", 30, 40, 34, "float"]] },
      { say: "c2-p1", scene: "dusk", art: [["⛺", 74, 50, 110], ["P:yaqub", 72, 72, 92, "bob", { expr: "calm" }], ["P:yusuf", 86, 76, 60, "bob", { expr: "happy" }], ["G:brothers", 30, 78, 190, "bob", { expr: "happy" }], ["💬", 34, 38, 36, "float"]] },
      { say: "c2-p2", scene: "dusk", art: [["P:yaqub", 56, 70, 100, "bob", { expr: "worried" }], ["P:yusuf", 40, 74, 70, "bob", { expr: "calm" }], ["🐺", 16, 30, 40, "float"], ["🌲", 8, 52, 50]] },
      { play: "choice", line: "c2-pq", scene: "dusk", opts: { img: "c2-p2", options: [{ label: "A storm", icon: "⛈️", ok: false }, { label: "A wolf", icon: "🐺", ok: true }], wrong: "c2-pqwrong" } },
      { say: "c2-p3", scene: "desert", art: [["G:brothers", 40, 74, 190, "walk", { expr: "happy" }], ["P:yusuf", 66, 76, 64, "walk", { expr: "happy" }], ["P:yaqub", 88, 72, 70, "bob", { expr: "worried" }]] },
      { say: "c2-b", scene: "desert", art: [["P:yusuf", 54, 50, 44, null, { expr: "scared" }], ["WELL", 54, 58, 150], ["G:brothers", 22, 80, 130, "bob", { expr: "neutral" }]] },
      { say: "c2-w", scene: "night", src: "The stone: Ibn Kathir's tafsir", art: [["🌙", 50, 9, 30], ["P:yusuf", 50, 62, 96, "bob", { expr: "calm" }], ["✨", 30, 34, 34, "float"], ["✨", 70, 40, 28, "float"]] },
      { say: "c2-c", scene: "dusk", art: [["⛺", 74, 50, 110], ["P:yaqub", 74, 72, 92, "bob", { expr: "worried" }], ["G:brothers", 32, 78, 190, "bob", { expr: "cry" }], ["👕", 50, 40, 44, "float"], ["🐺", 14, 24, 40], ["💭", 28, 38, 34, "float"]] },
      {
        play: "choice", line: "c2-s", scene: "dusk", src: "The untorn shirt: Ibn Kathir's tafsir",
        opts: {
          img: "c2-s",
          art: [["👕", 50, 30, 104, "float"], ["🔍", 70, 16, 36, "float"]],
          options: [{ label: "Yes, it is torn", icon: "✂️", ok: false }, { label: "No, not one tear", icon: "👕", ok: true }],
          wrong: "c2-swrong"
        }
      },
      {
        play: "choice", line: "c2-do", scene: "dusk",
        opts: {
          art: [["🐺", 50, 30, 80], ["❓", 68, 16, 34, "float"]],
          options: [{ label: "Yes, a wolf did it", icon: "🐺", ok: false }, { label: "No, it was not true", icon: "❌", ok: true }],
          wrong: "c2-wrong"
        }
      },
      { say: "c2-d", scene: "dusk", art: [["⛺", 50, 48, 120], ["P:yaqub", 50, 70, 104, "bob", { expr: "calm" }], ["✨", 50, 22, 40, "float"], ["🌙", 82, 18, 40]] },
      { play: "order", line: "c8-do-o", scene: "dusk", opts: { wrong: "c8-wrong-o", cards: [{ line: "c2-o1", icon: "😠", label: "The brothers are jealous" }, { line: "c2-o2", icon: "💧", label: "Yusuf is put in the well" }, { line: "c2-o3", icon: "👕", label: "They show the shirt" }, { line: "c2-o4", icon: "🤲", label: "Yaqub is patient" }] } },
      { play: "memory", line: "mem-do", scene: "dusk", opts: { icons: ["🐑", "🐺", "👕", "🌙", "⭐", "💧"] } }
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
      { say: "c3-b", scene: "desert", art: [["P:traveller", 28, 68, 100, "bob", { expr: "surprised" }], ["P:yusuf", 52, 74, 84, "bob", { expr: "happy" }], ["🐪", 76, 74, 60, "walk"], ["🐪", 92, 78, 50, "walk"], ["✨", 40, 36, 32, "float"]] },
      { play: "choice", line: "c3-q", scene: "desert", opts: { img: "c3-b", art: [["❓", 50, 28, 70, "float"]], options: [{ label: "Good news! Here is a boy!", icon: "🎉", ok: true }, { label: "Oh no, my bucket!", icon: "🪣", ok: false }], wrong: "c3-qwrong" } },
      { play: "puzzle", line: "pz-do", scene: "desert", opts: { pic: "c3-b" } }
    ]
  },
  {
    id: "c4", icon: "🐪", title: "Far From Home", source: "12:20-22",
    parent: [
      "Verses 12:20–22. Yusuf is sold for a few pieces of silver. The Egyptian who bought him tells his wife to look after him well (12:21), and when Yusuf reaches maturity Allah gives him judgement and knowledge (12:22).",
      "The twenty coins: the verse says only 'a few dirhams' (12:20). Ibn Kathir's tafsir (abridged English) gives the number as twenty dirhams, according to Abdullah bin Mas'ud, and says the same was reported from Ibn Abbas, Nawf al-Bikali, As-Suddi, Qatadah and Atiyah al-Awfi. The number in the counting game is from this commentary, not from the verse.",
      "Who sold him: the same tafsir reports from Ibn Abbas, Mujahid and Ad-Dahhak that 'they sold him' refers to Yusuf's brothers, who sold him to the caravan. The game's wording does not say who sold him. The line that they did not know how precious he was follows Ad-Dahhak's comment, in the same tafsir, that they had no knowledge of his prophethood and rank with Allah."
    ],
    steps: [
      { play: "count", line: "c4-count", scene: "desert", src: "Twenty coins: Ibn Kathir's tafsir", opts: { total: 20, after: "c4-counted", bg: "bg-market" } },
      { say: "c4-a", scene: "desert", art: [["🐪", 40, 74, 76, "walk"], ["P:yusuf", 40, 56, 42, "walk", { expr: "worried" }], ["☀️", 84, 18, 50]] },
      { play: "journey", line: "c4-do", scene: "desert", opts: { icon: "🐪", flip: true, rider: true, from: "🌴", to: "🏛️", steps: 6 } },
      { say: "c4-b", scene: "egypt", art: [["🏛️", 76, 44, 110], ["P:master", 70, 72, 96, "bob", { expr: "calm" }], ["P:yusuf", 40, 76, 80, "bob", { expr: "sad" }], ["COINS", 18, 76, 1]] },
      { play: "choice", line: "c4-q", scene: "egypt", opts: { img: "c4-b", art: [["❓", 50, 28, 70, "float"]], options: [{ label: "Send him away", icon: "🚪", ok: false }, { label: "Look after him well", icon: "💛", ok: true }], wrong: "c4-qwrong" } },
      { say: "c4-c", scene: "egypt", art: [["🏛️", 22, 50, 90], ["P:yusufYouth", 56, 66, 96, "bob", { expr: "happy" }], ["📜", 82, 52, 44, "float"], ["✨", 56, 26, 36, "float"]] },
      { play: "memory", line: "mem-do", scene: "egypt", opts: { icons: ["🐪", "🌴", "🪙", "🏛️", "☀️", "📜"] } }
    ]
  },
  {
    id: "c5", icon: "🕯️", title: "Patience in Prison", source: "12:23-35",
    parent: [
      "Verses 12:23–35. The verses are more explicit than the game. The woman of the house bolted the doors and called him to her (12:23); Yusuf refused, they raced for the door, and she tore his shirt from behind (12:25). The game says only that she tried to make him do something wrong.",
      "The shirt test is in the verses: a member of her household suggested that a shirt torn at the front would mean she was telling the truth, and one torn at the back that Yusuf was (12:26–27). Her husband saw that it was torn at the back (12:28).",
      "The women of the city (12:30–31): they gossiped that the governor's wife was trying to seduce her servant; she invited them to a banquet, gave each a knife, and told Yusuf to come out; stunned by his beauty they cut their hands and said he could not be mortal but must be a noble angel. The game keeps the banquet, the knives and their words, and says only that the women were 'gossiping'. That they were cutting fruit (citron) is from Ibn Kathir's tafsir, reported from Ibn Abbas, Sa'id bin Jubayr, Mujahid, Al-Hasan, As-Suddi and others; the same tafsir quotes the authentic hadith that Yusuf 'was given half of all beauty'. Left out: her words in 12:32, that she had tried to seduce him and that he would be imprisoned if he did not obey her.",
      "Kept: Yusuf's prayer that prison is better for him than what they ask (12:33–34), and the decision to imprison him even after the signs of his innocence had been seen (12:35)."
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
      { say: "c5-w1", scene: "palace", src: "The fruit: Ibn Kathir's tafsir", art: [["🍊", 30, 60, 50], ["🍎", 44, 64, 44], ["🔪", 58, 62, 40], ["🧕", 72, 66, 70], ["🧕", 86, 68, 60]] },
      { say: "c5-w2", scene: "palace", art: [["P:yusufYouth", 50, 64, 100, "bob", { expr: "calm" }], ["✨", 50, 22, 44, "float"], ["😮", 18, 70, 46], ["😮", 82, 70, 46]] },
      { play: "choice", line: "c5-wq", scene: "palace", opts: { img: "c5-w2", options: [{ label: "The fruit was too hard", icon: "🍊", ok: false }, { label: "They were amazed by Yusuf", icon: "✨", ok: true }], wrong: "c5-wqwrong" } },
      { say: "c5-b4", scene: "palace", art: [["P:yusufYouth", 50, 64, 104, "bob", { expr: "calm" }], ["🤲", 50, 90, 44], ["✨", 50, 24, 40, "float"]] },
      { say: "c5-c", scene: "prison", art: [["P:yusufYouth", 50, 66, 100, "bob", { expr: "sad" }], ["BARS", 0, 0, 1], ["⛓️", 14, 22, 40]] },
      { play: "hold", line: "c5-do", scene: "prison" },
      { say: "c5-d", scene: "prison", art: [["LAMP", 24, 56, 100, "lit"], ["P:yusufYouth", 66, 68, 100, "bob", { expr: "calm" }], ["✨", 66, 26, 34, "float"]] },
      { play: "order", line: "c8-do-o", scene: "prison", opts: { wrong: "c8-wrong-o", cards: [{ line: "c5-o1", icon: "🚪", label: "Yusuf runs for the door" }, { line: "c5-o2", icon: "👕", label: "His shirt is torn" }, { line: "c5-o3", icon: "💡", label: "Look at the shirt!" }, { line: "c5-o4", icon: "🕯️", label: "Patient in prison" }] } },
      { play: "puzzle", line: "pz-do", scene: "palace", opts: { pic: "c5-b4" } }
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
      { say: "c6-b", scene: "prison", over: [["T:الله", 50, 16, 54]], art: [["T:الله", 50, 28, 60], ["P:yusufYouth", 50, 68, 100, "bob", { expr: "calm" }], ["P:prisoner1", 16, 78, 66, "bob", { expr: "calm" }], ["P:prisoner2", 84, 78, 66, "bob", { expr: "calm", flip: true }]] },
      { play: "choice", line: "c6-q", scene: "prison", opts: { img: "c6-b", art: [["❓", 50, 28, 70, "float"]], options: [{ label: "Worship Allah alone", icon: "☝️", ok: true }, { label: "Dig a tunnel", icon: "⛏️", ok: false }], wrong: "c6-qwrong" } },
      {
        play: "match", line: "c6-do", scene: "prison",
        opts: {
          pairs: [
            { a: "c6-d1", aIcon: "🍇", aLabel: "Pressing grapes", b: "c6-m1", bIcon: "🔓", bLabel: "Saved" },
            { a: "c6-d2", aIcon: "🍞🐦", aLabel: "Bread and birds", b: "c6-m2", bIcon: "💧", bLabel: "A sad end" }
          ]
        }
      },
      { say: "c6-c", scene: "prison", art: [["P:yusufYouth", 34, 70, 96, "bob", { expr: "sad" }], ["⏳", 60, 46, 52, "float"], ["P:prisoner1", 86, 76, 68, "bob", { expr: "happy", flip: true }]] },
      { play: "memory", line: "mem-do", scene: "prison", opts: { icons: ["🍇", "🍞", "🐦", "🔓", "🕯️", "⏳"] } }
    ]
  },
  {
    id: "c7", icon: "🐄", title: "The King's Dream", source: "12:43-49",
    parent: [
      "Verses 12:43–49. The king dreams of seven fat cows eaten by seven lean ones, and of seven green ears of grain and seven withered ones. Yusuf's interpretation: seven years of sowing as usual with the harvest stored, seven hard years that use up the store, and then a year of abundant rain (12:47–49). The freed prisoner finally remembered Yusuf and asked to go and find out the meaning (12:45)."
    ],
    steps: [
      { say: "c7-a", scene: "palace", art: [["P:king", 50, 22, 76, "bob", { expr: "sleep" }], ["🐄", 22, 56, 50], ["🐄", 38, 56, 50], ["🐄", 62, 56, 46, "thin"], ["🐄", 76, 56, 46, "thin"], ["🌾", 24, 84, 40], ["🌾", 38, 84, 40], ["🌾", 62, 84, 40, "dry"], ["🌾", 76, 84, 40, "dry"]] },
      { play: "pick", line: "c7-pick", scene: "field", opts: { items: [{ icon: "🐄", n: 7, ok: true, name: "fat cow" }, { icon: "🐄", n: 7, ok: false, cls: "thin", name: "thin cow" }] } },
      { say: "c7-b", scene: "palace", art: [["P:king", 28, 62, 100, "bob", { expr: "worried" }], ["❓", 44, 26, 34, "float"], ["💡", 74, 32, 50, "float"], ["P:prisoner1", 74, 74, 84, "bob", { expr: "surprised", flip: true }]] },
      { play: "reveal", line: "c7-do", scene: "palace", opts: { items: [{ line: "c7-good", kind: "good", label: "7 good years" }, { line: "c7-hard", kind: "hard", label: "7 hard years" }] } },
      { say: "c7-c", scene: "field", art: [["🌧️", 50, 22, 84, "float"], ["🌾", 22, 74, 48], ["🌾", 40, 80, 48], ["🌾", 60, 74, 48], ["🌾", 78, 80, 48]] },
      { play: "sort", line: "c7-sort", scene: "field", opts: { wrong: "c7-swrong", bins: [{ label: "Good years", icon: "🌾" }, { label: "Hard years", icon: "🍂" }], things: [{ icon: "🌱", label: "Plant the fields", bin: 0 }, { icon: "🍞", label: "Eat what was saved", bin: 1 }, { icon: "🏺", label: "Save the grain", bin: 0 }, { icon: "🔑", label: "Open the storehouse", bin: 1 }, { icon: "🧺", label: "Bring in the harvest", bin: 0 }] } }
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
      { say: "c8-c", scene: "egypt", art: [["STORE", 30, 56, 130], ["🌾", 56, 82, 48], ["🌾", 40, 86, 48], ["P:yusufMan", 76, 68, 100, "bob", { expr: "happy" }], ["✨", 30, 18, 40, "float"]] },
      { play: "puzzle", line: "pz-do", scene: "egypt", opts: { pic: "c8-c" } }
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
      { play: "choice", line: "c9-q", scene: "egypt", opts: { img: "c9-b", art: [["❓", 50, 28, 70, "float"]], options: [{ label: "Yes, straight away", icon: "👀", ok: false }, { label: "No, they did not know him", icon: "🙈", ok: true }], wrong: "c9-qwrong" } },
      { play: "fill", line: "c9-do", scene: "egypt", opts: { sacks: 5, taps: 3 } },
      { say: "c9-c", scene: "egypt", art: [["SACK", 24, 72, 90], ["SACK", 42, 76, 90], ["COINS", 32, 40, 1, "float"], ["P:yusufMan", 76, 66, 100, "bob", { expr: "happy" }]] },
      { play: "pick", line: "c9-pick", scene: "egypt", opts: { mark: "🪙", items: [{ icon: "SACK", n: 5, ok: true, name: "sack" }] } }
    ]
  },
  {
    id: "c10", icon: "🏆", title: "The King's Cup", source: "12:63-79",
    parent: [
      "The gates: Yaqub told his sons not to enter by one gate but by different gates, adding that he could not protect them from anything Allah had decreed and that he put his trust in Allah (12:67). The verse does not give his reason. Ibn Kathir's tafsir (abridged English) reports from Ibn Abbas, Muhammad bin Ka'b, Mujahid, Ad-Dahhak, Qatadah, As-Suddi and others that he feared the evil eye for them. The game shows the gates and leaves the reason for you to explain.",
      "Verses 12:63–79. Yaqub let Benjamin go only after his sons swore to bring him back (12:63–66). Yusuf told Benjamin privately that he was his brother (12:69), and the king's cup was put in Benjamin's pack (12:70). The verse says Yusuf searched the other bags first and then his brother's, where he found the cup (12:76), so the game keeps that order: the cup is in the last bag on purpose. The same verse says this was a plan Allah devised for Yusuf.",
      "The brothers' own rule (12:74–76): asked what the penalty should be if one of them was lying, the brothers said the one in whose bag the cup was found would be held as the penalty, 'this is how we punish wrongdoers'. The verse says Yusuf could not have held his brother under the king's law. Ibn Kathir's tafsir (abridged English) says this was the law of Prophet Ibrahim, that a thief be handed to the one he stole from, and reports from Ad-Dahhak and others that it was not the law of the king of Egypt. The verse's word for the penalty is servitude; the game says 'must stay behind'."
    ],
    steps: [
      { say: "c10-g", scene: "dusk", art: [["⛺", 26, 50, 100], ["P:yaqub", 26, 72, 96, "bob", { expr: "calm" }], ["G:brothers", 68, 78, 170, "bob", { expr: "neutral", flip: true }], ["🚪", 60, 30, 34, "float"], ["🚪", 76, 24, 34, "float"], ["🚪", 90, 32, 34, "float"]] },
      { play: "gates", line: "c10-gdo", scene: "egypt", opts: { owners: ["b1", "b3", "b2", "b4", "benjamin"], bg: "bg-wall" } },
      { say: "c10-a", scene: "egypt", art: [["P:yusufMan", 38, 66, 100, "bob", { expr: "happy" }], ["P:benjamin", 68, 74, 84, "bob", { expr: "happy" }], ["💛", 54, 28, 40, "float"]] },
      { say: "c10-b", scene: "egypt", art: [["SACK", 50, 72, 120], ["CUP", 50, 26, 60, "float"], ["P:yusufMan", 18, 66, 90, "bob", { expr: "calm" }], ["P:benjamin", 84, 74, 70, "bob", { expr: "neutral", flip: true }]] },
      { play: "choice", line: "c10-q", scene: "egypt", opts: { img: "c10-b", art: [["❓", 50, 28, 70, "float"]], options: [{ label: "Allah made it for Yusuf", icon: "✨", ok: true }, { label: "The brothers made it", icon: "👥", ok: false }], wrong: "c10-qwrong" } },
      { say: "c10-l1", scene: "egypt", art: [["📣", 20, 34, 56, "float"], ["G:brothers", 60, 76, 190, "bob", { expr: "surprised" }], ["SACK", 88, 82, 70]] },
      { play: "choice", line: "c10-lq", scene: "egypt", opts: { img: "c10-l1", options: [{ label: "The brothers' own rule", icon: "🗣️", ok: true }, { label: "The king of Egypt's rule", icon: "👑", ok: false }], wrong: "c10-lqwrong" } },
      { play: "search", line: "c10-do", scene: "egypt", opts: { owners: ["b1", "b3", "b2", "b4", "benjamin"], nope: "c10-nope" } },
      { say: "c10-c", scene: "egypt", art: [["CUP", 18, 46, 70], ["P:yusufMan", 50, 64, 100, "bob", { expr: "happy" }], ["P:benjamin", 78, 74, 84, "bob", { expr: "happy" }], ["✨", 50, 22, 36, "float"]] },
      { play: "puzzle", line: "pz-do", scene: "egypt", opts: { pic: "c10-c" } }
    ]
  },
  {
    id: "c11", icon: "💛", title: "“I Am Yusuf”", source: "12:80-92",
    parent: [
      "Verses 12:80–92. Yaqub's eyes went white with grief (12:84), yet he told his sons not to despair of Allah's mercy (12:87). When the brothers came again, Yusuf asked whether they understood what they had done, and revealed himself (12:89–90). The brothers admitted they had been in the wrong (12:91). Yusuf said there would be no reproach that day and asked Allah to forgive them (12:92).",
      "The eldest brother (12:78–80): the brothers asked Yusuf to take one of them instead, because their father was very old; he said it would be unjust to take anyone but the one with whom the cup was found. The eldest then reminded the others of their solemn promise to their father and of how they had failed over Yusuf, and said he would not leave the land until his father gave him leave or Allah decided for him. So nine went home. The verse does not name him, and the commentators differ on who he was, so the game does not name him either."
    ],
    steps: [
      { say: "c11-v", scene: "egypt", art: [["G:brothers", 34, 78, 170, "bob", { expr: "sad" }], ["P:b1", 76, 72, 96, "bob", { expr: "worried" }], ["🤝", 76, 34, 40, "float"]] },
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
      { say: "c11-d", scene: "egypt", art: [["P:yusufMan", 68, 64, 100, "bob", { expr: "happy" }], ["G:brothers", 30, 78, 170, "bob", { expr: "happy" }], ["P:benjamin", 91, 80, 56, "bob", { expr: "happy", flip: true }], ["💛", 40, 32, 44, "float"], ["💛", 54, 18, 32, "float"]] },
      { play: "order", line: "c8-do-o", scene: "egypt", opts: { wrong: "c8-wrong-o", cards: [{ line: "c11-o1", icon: "🕯️", label: "Never lose hope" }, { line: "c11-o2", icon: "💛", label: "I am Yusuf" }, { line: "c11-o3", icon: "😔", label: "We were wrong" }, { line: "c11-o4", icon: "🤝", label: "Yusuf forgives" }] } },
      { play: "puzzle", line: "pz-do", scene: "egypt", opts: { pic: "c11-d" } }
    ]
  },
  {
    id: "c12", icon: "👕", title: "The Shirt", source: "12:93-98",
    parent: [
      "Verses 12:93–98. Yusuf sent his shirt to be laid over his father's face (12:93). Yaqub said he could smell Yusuf (12:94), and when the shirt was laid on his face his sight returned (12:96). The brothers asked him to seek forgiveness for them, and he said he would (12:97–98).",
      "The wind: the verse says that when the caravan departed, Yaqub said he could sense the scent of Yusuf (12:94). Ibn Kathir's tafsir (abridged English) reports, through Abd al-Razzaq, that Ibn Abbas said a wind began to blow and carried the scent of the shirt to Yaqub from a distance of eight days' travel. The wind in the game's telling is from this report, not from the verse."
    ],
    steps: [
      { say: "c12-a", scene: "egypt", art: [["👕", 34, 42, 90, "float"], ["P:yusufMan", 72, 66, 104, "bob", { expr: "calm" }]] },
      { say: "c12-b", scene: "grey", art: [["⛺", 38, 56, 110], ["P:yaqub", 38, 74, 96, "bob", { expr: "surprised" }], ["🌬️", 74, 34, 56, "float"], ["✨", 86, 24, 28, "float"]] },
      { play: "journey", line: "c12-do", scene: "desert", opts: { icon: "👕", from: "🏛️", to: "⛺", steps: 5, grey: true } },
      { say: "c12-c", scene: "dawn", art: [["⛺", 42, 56, 110], ["P:yaqub", 42, 74, 100, "bob", { expr: "happy" }], ["👕", 42, 30, 46, "float"], ["☀️", 84, 18, 60, "float"], ["✨", 20, 26, 34, "float"], ["G:brothers", 76, 84, 120, "bob", { expr: "happy" }]] },
      { play: "choice", line: "c12-q", scene: "dawn", opts: { img: "c12-c", art: [["❓", 50, 28, 70, "float"]], options: [{ label: "He fell asleep", icon: "😴", ok: false }, { label: "He could see again", icon: "👁️", ok: true }], wrong: "c12-qwrong" } },
      { play: "memory", line: "mem-do", scene: "dawn", opts: { icons: ["👕", "🐪", "🌬️", "👁️", "☀️", "💛"] } }
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
      { play: "sort", line: "c13-sort", scene: "night", opts: { wrong: "c13-swrong", bins: [{ label: "Like Yusuf", icon: "🌟" }, { label: "Not like Yusuf", icon: "🚫" }], things: [{ icon: "⏳", label: "Being patient", bin: 0 }, { icon: "🤥", label: "Making up a story", bin: 1 }, { icon: "🗣️", label: "Telling the truth", bin: 0 }, { icon: "😠", label: "Staying angry", bin: 1 }, { icon: "🤝", label: "Forgiving", bin: 0 }, { icon: "🤲", label: "Trusting Allah", bin: 0 }] } },
      { play: "puzzle", line: "pz-do", scene: "night", opts: { pic: "c13-b0" } },
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
window.STORY_MOODS = {
  "c1-b": "wonder",
  "c2-a": "tense", "c2-b": "tense", "c2-w": "wonder", "c2-c": "tense", "c2-s": "tense", "c2-do": "tense",
  "c2-p1": "tense", "c2-p2": "sad", "c2-pq": "sad", "c2-p3": "tense",
  "c3-b": "joy",
  "c4-count": "sad", "c4-b": "sad",
  "c5-a": "tense", "c5-b1": "tense", "c5-b2": "tense", "c5-do2": "tense", "c5-b3": "wonder", "c5-b4": "wonder", "c5-do": "tense", "c5-d": "wonder",
  "c6-b": "wonder", "c6-do": "wonder",
  "c7-a": "tense", "c7-b": "tense", "c7-do": "wonder",
  "c8-a1": "tense", "c8-a2": "tense", "c8-do-o": "wonder", "c8-c": "joy",
  "c9-b": "tense", "c9-do": "desert",
  "c10-g": "wonder", "c10-gdo": "regal", "c10-b": "tense", "c10-do": "tense", "c10-c": "joy",
  "c11-c": "tense", "c11-e": "sad", "c11-do": "tense", "c11-d": "joy",
  "c12-a": "joy",
  "c13-a": "joy", "c13-b": "joy", "c13-q": "wonder", "c13-b0": "joy", "c13-c": "wonder"
};
