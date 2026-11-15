/*
  The Adam story: chapters -> steps. WRITTEN BY scripts/adam/author/build.js from the
  chapter files beside it. Change those, not this file.

  A step is { say, scene, pic?, src?, amb?, fx?, cue? } (a narrated picture) or
  { play, line, scene, opts } (something to do). See games/yusuf/story.js and
  shared/story-engine.js for what each field means. `more` lists the other passages
  a chapter draws on, beside its main `source`.
*/
window.STORY = [
  {
    id: "d1", icon: "✨", title: "Someone New", source: "2:30-33", more: [],
    parent: [
      "'Successor' (khalifa) is told as 'someone new, to look after the earth'.",
      "The angels' question is a question, not a refusal: when they could not name the things Allah showed them they said, 'We have knowledge only of what You have taught us' (2:32). The game tells that part in chapter 4."
    ],
    steps: [
      {"say":"d1-a","scene":"heaven","e":"✨ ☁️ ✨"},
      {"say":"d1-b","scene":"heaven","e":"🌍 ✨"},
      {"say":"d1-c","scene":"heaven","e":"✨ 🙇🏿"},
      {"play":"choice","line":"d1-q","scene":"heaven","opts":{"options":[{"label":"I know what you do not know","icon":"✨","ok":true},{"label":"You are right","icon":"👍🏿","ok":false}],"wrong":"d1-q-no","img":"d1-c"}},
      {"play":"memory","line":"d1-mem","scene":"heaven","opts":{"icons":["☀️","🌙","⭐","☁️","🌊","⛰️"]}}
    ]
  },
  {
    id: "d2", icon: "🟤", title: "Made from Earth", source: "15:28-29", more: ["38:71-72","3:59"],
    parent: [
      "Earth of every kind: al-Tirmidhi and Abu Dawud report that Adam was made from a handful taken from all of the earth, so his children came like the earth, of many colours, some gentle and some rough. The Shia narrations give the same from Imam Ali: Adam was made 'from the soil of all the surface of the earth'.",
      "The pictures in Asmau show everyone dark-skinned; the lesson about colours is told in words and shown with the earth itself."
    ],
    steps: [
      {"say":"d2-a","scene":"desert","src":"Told in Sunni and Shia narrations","e":"🟤 🟫 🟠"},
      {"play":"build","line":"d2-gather","scene":"desert","opts":{"n":8,"icon":"🟤","cols":4,"img":"d2-a"}},
      {"say":"d2-b","scene":"desert","e":"🟤 💧"},
      {"say":"d2-c","scene":"dawn","e":"🧑🏿 🌅"},
      {"say":"d2-d","scene":"dawn","src":"Told in Sunni and Shia narrations","e":"🤲🏿 🟤"},
      {"play":"choice","line":"d2-q","scene":"dawn","opts":{"options":[{"label":"Fire","icon":"🔥","ok":false},{"label":"Earth and clay","icon":"🟤","ok":true}],"wrong":"d2-q-no","img":"d2-c"}}
    ]
  },
  {
    id: "d3", icon: "🤲", title: "First Words", more: [], cite: "Ibn Abbas in Ibn Kathir's commentary on 2:37; al-Bukhari and Muslim; Majlisi, Hayat al-Qulub",
    parent: [
      "The sneeze: in the commentary on 2:37, Ibn Abbas has Adam remind Allah, 'when I sneezed You said, May Allah grant you His mercy'. The Shia narrations give the same: Adam said 'al-hamdu lillah' and was answered 'yarhamuk Allah'.",
      "The greeting: al-Bukhari and Muslim report that Allah told Adam to greet a group of angels and to listen to their answer, which would be the greeting of his children. The Shia narrations give the same greeting.",
      "Neither is in the Qur'an."
    ],
    steps: [
      {"say":"d3-a","scene":"dawn","src":"Told in Sunni and Shia narrations","e":"🧑🏿 🤧 ✨"},
      {"say":"d3-b","scene":"dawn","src":"Told in Sunni and Shia narrations","e":"🧑🏿 💛"},
      {"play":"choice","line":"d3-q","scene":"dawn","opts":{"options":[{"label":"Al-hamdu lillah","icon":"🤲🏿","ok":true},{"label":"Nothing at all","icon":"🤐","ok":false}],"wrong":"d3-q-no","img":"d3-a"}},
      {"say":"d3-c","scene":"heaven","src":"From a hadith in al-Bukhari","e":"🧑🏿 👋 ✨"},
      {"say":"d3-d","scene":"heaven","src":"From a hadith in al-Bukhari","e":"🕊️ ✨ 💛"},
      {"play":"match","line":"d3-say","scene":"dawn","opts":{"pairs":[{"a":"d3-say-a1","aIcon":"🤧","aLabel":"When we sneeze","b":"d3-say-b1","bIcon":"🤲🏿","bLabel":"Al-hamdu lillah"},{"a":"d3-say-a2","aIcon":"👋","aLabel":"When we meet someone","b":"d3-say-b2","bIcon":"🕊️","bLabel":"As-salamu alaykum"},{"a":"d3-say-a3","aIcon":"💬","aLabel":"When someone greets us","b":"d3-say-b3","bIcon":"💛","bLabel":"Wa alaykum as-salam"}],"img":"d3-d"}}
    ]
  },
  {
    id: "d4", icon: "🦁", title: "The Names", source: "2:31-33", more: [],
    parent: [
      "The commentary reports from Ibn Abbas that 'the names' are the names people use for everything, of every kind; al-Bukhari's hadith of intercession has people say to Adam, 'Allah ... taught you the names of everything'.",
      "Al-Tabatabai's al-Mizan reads the named things as 'sublime creations, hidden from the heavens and the earth'. The game keeps to the plain meaning both share: Allah taught Adam what the angels did not know."
    ],
    steps: [
      {"say":"d4-a","scene":"heaven","e":"🧑🏿 🦁 🐪"},
      {"play":"match","line":"d4-homes","scene":"heaven","opts":{"pairs":[{"a":"d4-homes-a1","aIcon":"🐪","aLabel":"Camel","b":"d4-homes-b1","bIcon":"🏜️","bLabel":"Desert"},{"a":"d4-homes-a2","aIcon":"🐟","aLabel":"Fish","b":"d4-homes-b2","bIcon":"🌊","bLabel":"Sea"},{"a":"d4-homes-a3","aIcon":"🐦","aLabel":"Bird","b":"d4-homes-b3","bIcon":"🪺","bLabel":"Nest"},{"a":"d4-homes-a4","aIcon":"🐝","aLabel":"Bee","b":"d4-homes-b4","bIcon":"🌸","bLabel":"Flower"}],"img":"d4-a"}},
      {"say":"d4-b","scene":"heaven","e":"✨ 🙇🏿 🦁"},
      {"say":"d4-c","scene":"heaven","e":"🧑🏿 👉🏿 🐦"},
      {"play":"memory","line":"d4-mem","scene":"heaven","opts":{"icons":["🦁","🐪","🐘","🐦","🌳","⛰️"]}},
      {"play":"choice","line":"d4-q","scene":"heaven","opts":{"options":[{"label":"The angels","icon":"☁️","ok":false},{"label":"Allah","icon":"✨","ok":true}],"wrong":"d4-q-no","img":"d4-c"}}
    ]
  },
  {
    id: "d5", icon: "🔥", title: "The Proud One", source: "2:34", more: ["7:11-18","15:30-42","38:73-85","18:50"],
    parent: [
      "Iblis 'was one of the jinn' (18:50), made from fire (7:12). The commentary calls the bow Allah honouring Adam; al-Tabatabai's al-Mizan says the angels bowed to Adam 'as he was the symbol of humanity'. It is a bow of respect at Allah's command, not worship.",
      "Iblis's vow to come at people 'from their front and their back, from their right and their left' is 7:17; 'you will have no power over My servants' is 15:42.",
      "Asking Allah for protection (a'udhu billahi min ash-shaytan ir-rajim) is not in these verses; the game adds it as what children can do."
    ],
    steps: [
      {"say":"d5-a","scene":"heaven","e":"✨ 🙇🏿 🧑🏿"},
      {"say":"d5-b","scene":"heaven","e":"🔥 🙅🏿"},
      {"say":"d5-c","scene":"grey","e":"🔥 😤"},
      {"play":"sort","line":"d5-proud","scene":"grey","opts":{"bins":[{"label":"Humble","icon":"🙇🏿"},{"label":"Proud","icon":"😤"}],"things":[{"icon":"🙇🏿","label":"Doing what Allah asks","bin":0},{"icon":"🤝","label":"Saying sorry","bin":0},{"icon":"😤","label":"Saying: I am better than you","bin":1},{"icon":"🙅🏿","label":"Refusing to listen","bin":1},{"icon":"🤲🏿","label":"Thanking Allah","bin":0},{"icon":"👎","label":"Laughing at others","bin":1}],"wrong":"d5-proud-no","img":"d5-c"}},
      {"say":"d5-d","scene":"grey","e":"🔥 💨"},
      {"say":"d5-e","scene":"night","e":"🌙 🏠 ✨"},
      {"play":"hold","line":"d5-refuge","scene":"night","opts":{"ms":2500,"icon":"🛡️","hint":"Press and hold","done":"Allah keeps us safe","img":"d5-e"}}
    ]
  },
  {
    id: "d6", icon: "🌳", title: "The Garden", source: "2:35", more: ["7:19","20:117-119","4:1"],
    parent: [
      "How Hawwa was made is told in two ways. The commentary reports, from Ibn Ishaq and 'the People of the Book', that she was made from Adam's rib while he slept. Narrations of the Imams of Ahl al-Bayt say she was made from the clay left over from Adam (Imam al-Baqir), and al-Tabatabai's al-Mizan prefers that. The Qur'an says Allah made his mate 'from it', the single soul (4:1). The game says only that Allah made Hawwa for Adam.",
      "The tree is not named in the Qur'an. The commentary quotes al-Tabari: 'We do not know which tree that was.' Shia narrations call it wheat or a vine (Imam al-Rida: 'both traditions are true'). The game names no fruit.",
      "The Garden: the commentary says most scholars place it in the heavens; al-Tabatabai says it was 'in the heaven, although it was not the Garden of eternal abode'."
    ],
    steps: [
      {"say":"d6-a","scene":"garden","e":"🧑🏿 🌸 🧕🏿"},
      {"say":"d6-b","scene":"garden","e":"🌳 🍎 🦌"},
      {"play":"catch","line":"d6-fruit","scene":"garden","opts":{"target":8,"icon":"🍎","into":"🧺","img":"d6-b"}},
      {"say":"d6-c","scene":"garden","e":"🌳 🚫"},
      {"play":"seek","line":"d6-tree","scene":"garden","opts":{"icon":"🌳","r":20,"img":"d6-c"}},
      {"play":"choice","line":"d6-q","scene":"garden","opts":{"options":[{"label":"Do not go near it","icon":"🚫","ok":true},{"label":"Eat all of it","icon":"😋","ok":false}],"wrong":"d6-q-no","img":"d6-c"}}
    ]
  },
  {
    id: "d7", icon: "🍃", title: "The Whisper", source: "7:20-22", more: ["20:115","20:120-121"],
    parent: [
      "'He forgot' is 20:115; the same passage also says 'Adam disobeyed his Lord' (20:121). How to understand this differs. In the hadith of intercession quoted in the commentary, Adam remembers his error and is ashamed before his Lord. Al-Tabatabai's al-Mizan says the command was 'only an advice', given before any law, so the eating was 'neither a sin ... nor an injustice against Allah'; Shia narrations call it leaving the better (tark al-awla) before prophethood (Imam al-Rida). The game uses the Qur'an's own words: he forgot, they ate, they were sorry, and they were forgiven.",
      "The verses say their nakedness became exposed to them (7:22, 20:121). The game says only that they felt ashamed and covered themselves with leaves, and the pictures show the leaves, not the people.",
      "Al-Tabatabai calls the stories of a serpent and a peacock helping Iblis 'extremely unreliable'; the game leaves them out."
    ],
    steps: [
      {"say":"d7-a","scene":"garden","e":"💨 🌳"},
      {"say":"d7-b","scene":"garden","e":"💨 🌿"},
      {"play":"choice","line":"d7-q","scene":"garden","opts":{"options":[{"label":"Yes, he was a friend","icon":"🤝","ok":false},{"label":"No, it was a lie","icon":"🙅🏿","ok":true}],"wrong":"d7-q-no","img":"d7-b"}},
      {"say":"d7-c","scene":"garden","e":"🍎 🍃"},
      {"say":"d7-d","scene":"garden","e":"🍃 🤲🏿"},
      {"say":"d7-e","scene":"grey","e":"🌳 🌆"},
      {"play":"sort","line":"d7-listen","scene":"grey","opts":{"bins":[{"label":"Do it","icon":"✅"},{"label":"Say no","icon":"🚫"}],"things":[{"icon":"🕌","label":"Pray on time","bin":0},{"icon":"🤥","label":"Tell a little lie","bin":1},{"icon":"🤲🏿","label":"Say sorry","bin":0},{"icon":"😠","label":"Hit your brother","bin":1},{"icon":"💛","label":"Help at home","bin":0},{"icon":"🍪","label":"Take a sweet without asking","bin":1}],"wrong":"d7-listen-no","img":"d7-e"}}
    ]
  },
  {
    id: "d8", icon: "🤲", title: "Sorry", source: "7:23", more: ["2:37","20:122"],
    parent: [
      "The 'words' Adam received (2:37): the commentary reports from many early scholars that they are the prayer of 7:23, which the game uses, and from Ibn Abbas a conversation in which Adam asks for Allah's mercy. Al-Tabatabai prefers other words, which al-Kafi gives from the fifth or sixth Imam: 'There is no god except Thee; Glory be to Thee, O Allah! and praise! I have committed evil and been unjust to myself; therefore, forgive me.' Other narrations, Shia (al-Kafi) and Sunni (al-Suyuti's al-Durr al-Manthur), have Adam ask by the right of the Prophet Muhammad ﷺ, the Shia ones also by the right of Ali, Fatimah, al-Hasan and al-Husayn.",
      "Iblis blamed Allah: 'because You have put me in the wrong' (7:16). Adam and Hawwa blamed no one but themselves (7:23). The game draws that difference for children."
    ],
    steps: [
      {"say":"d8-a","scene":"dusk","e":"🧑🏿 🧕🏿 🤲🏿"},
      {"play":"order","line":"d8-dua","scene":"dusk","opts":{"cards":[{"icon":"🤲🏿","label":"Our Lord","line":"d8-dua-c1"},{"icon":"💔","label":"we have wronged ourselves","line":"d8-dua-c2"},{"icon":"🙏","label":"if You do not forgive us","line":"d8-dua-c3"},{"icon":"💛","label":"and have mercy on us","line":"d8-dua-c4"},{"icon":"😢","label":"we will be lost","line":"d8-dua-c5"}],"wrong":"d8-dua-no","img":"d8-a"}},
      {"say":"d8-b","scene":"dawn","e":"🌅 💛"},
      {"play":"hold","line":"d8-sorry","scene":"dawn","opts":{"ms":3000,"icon":"🤲🏿","hint":"Press and hold","done":"Allah is the Most Merciful","img":"d8-b"}},
      {"play":"choice","line":"d8-q","scene":"dawn","opts":{"options":[{"label":"Said sorry to Allah","icon":"🤲🏿","ok":true},{"label":"Blamed someone else","icon":"👉🏿","ok":false}],"wrong":"d8-q-no","img":"d8-b"}}
    ]
  },
  {
    id: "d9", icon: "🌾", title: "Life on Earth", source: "7:24-25", more: ["2:36-38"],
    parent: [
      "Where they came down: the commentary reports Adam in India or between Mecca and Ta'if, and Hawwa near Jeddah; a Shia narration (al-Qummi, quoted in al-Mizan) puts Adam on al-Safa and Hawwa on al-Marwa. The game says only that they came down apart and found each other again near Mecca.",
      "Jibril teaching Adam to farm and to pray is from Imam al-Baqir, in Majlisi's Hayat al-Qulub."
    ],
    steps: [
      {"say":"d9-a","scene":"desert","e":"🧑🏿 ⛰️"},
      {"say":"d9-b","scene":"desert","src":"Told in Sunni and Shia narrations","e":"🧑🏿 💛 🧕🏿"},
      {"play":"journey","line":"d9-find","scene":"desert","opts":{"from":"⛰️","to":"💛","icon":"🧑🏿","steps":7,"img":"d9-b"}},
      {"say":"d9-c","scene":"field","src":"From narrations in Majlisi's Hayat al-Qulub","e":"🧑🏿 🌱 ✨"},
      {"play":"count","line":"d9-plant","scene":"field","opts":{"total":7,"icon":"🟫","got":"🌱","img":"d9-c"}},
      {"say":"d9-d","scene":"field","e":"🌾 🏠"},
      {"play":"pick","line":"d9-harvest","scene":"field","opts":{"items":[{"icon":"🌾","n":6,"ok":true,"name":"ripe wheat"},{"icon":"🌱","n":3,"ok":false,"name":"a young shoot"}],"mark":"✨","img":"d9-d"}}
    ]
  },
  {
    id: "d10", icon: "🐑", title: "Two Brothers", source: "5:27-31", more: ["5:32"],
    parent: [
      "The Qur'an does not name the brothers. Tradition calls them Habil and Qabil (Abel and Cain), as do Shia narrations (Imam Zayn al-Abidin). The game does not name them.",
      "The verse says 'he killed him' (5:30). The game says the angry brother hurt him so badly that he died, and no picture shows the harm. The lesson of 5:32 is told without its opening words ('We decreed to the Children of Israel').",
      "If your child is very young, you can skip this chapter; the next one does not need it."
    ],
    steps: [
      {"say":"d10-a","scene":"field","e":"🐑 🧺"},
      {"say":"d10-b","scene":"field","e":"🐑 ✨ 😠"},
      {"say":"d10-c","scene":"dusk","e":"🤲🏿 😠"},
      {"play":"choice","line":"d10-q","scene":"dusk","opts":{"options":[{"label":"I will hit you back","icon":"👊","ok":false},{"label":"I will never hurt you","icon":"🤝","ok":true}],"wrong":"d10-q-no","img":"d10-c"}},
      {"say":"d10-d","scene":"grey","e":"🐑 ☁️"},
      {"say":"d10-e","scene":"grey","e":"🐦‍⬛ 😢"},
      {"say":"d10-f","scene":"dawn","e":"🤲🏿 🐦 🌅"},
      {"play":"sort","line":"d10-kind","scene":"dawn","opts":{"bins":[{"label":"Kind","icon":"💛"},{"label":"Unkind","icon":"💢"}],"things":[{"icon":"🤝","label":"Sharing your toys","bin":0},{"icon":"😠","label":"Pushing someone","bin":1},{"icon":"🩹","label":"Helping someone who is hurt","bin":0},{"icon":"😒","label":"Staying jealous and angry","bin":1},{"icon":"🧸","label":"Making up after a fight","bin":0},{"icon":"👊","label":"Hitting back","bin":1}],"wrong":"d10-kind-no","img":"d10-f"}}
    ]
  },
  {
    id: "d11", icon: "🌍", title: "Children of Adam", source: "7:26", more: ["7:27"],
    parent: [
      "Shith (Seth), Adam's son after Habil and his successor, called Hibatullah, and Adam's bequest to him: Imam al-Baqir and Imam al-Sadiq, in Majlisi's Hayat al-Qulub.",
      "7:27 warns the children of Adam not to let Satan seduce them 'as he did your parents'."
    ],
    steps: [
      {"say":"d11-a","scene":"field","src":"From narrations in Majlisi's Hayat al-Qulub","e":"🧔🏿 👦🏿 🌳"},
      {"say":"d11-b","scene":"dusk","e":"👨🏿‍👩🏿‍👧‍👦🏿 ⭐"},
      {"say":"d11-c","scene":"dawn","e":"🌅 🏘️"},
      {"say":"d11-d","scene":"dawn","e":"🤝 💛 🌍"},
      {"play":"order","line":"d11-story","scene":"dawn","opts":{"cards":[{"icon":"🟤","label":"Made from earth","line":"d11-story-c1"},{"icon":"🦁","label":"The names","line":"d11-story-c2"},{"icon":"🔥","label":"Iblis would not bow","line":"d11-story-c3"},{"icon":"🌳","label":"The Garden and the tree","line":"d11-story-c4"},{"icon":"🤲🏿","label":"Sorry","line":"d11-story-c5"},{"icon":"🌾","label":"Life on earth","line":"d11-story-c6"}],"wrong":"d11-story-no","img":"d11-d"}}
    ]
  }
];

/* Music for single lines; everything else uses its scene's music (sceneMood in game.js). */
window.STORY_MOODS = {"d1-a":"awe", "d2-c":"awe", "d4-c":"triumph", "d5-a":"awe", "d5-b":"dread", "d5-e":"wonder", "d6-a":"wonder", "d7-a":"tense", "d7-b":"tense", "d7-e":"sad", "d8-a":"longing", "d8-b":"triumph", "d9-a":"trek", "d9-b":"joy", "d9-c":"pastoral", "d9-d":"pastoral", "d10-b":"tense", "d10-c":"tense", "d10-d":"sad", "d10-e":"sad", "d10-f":"triumph", "d11-b":"longing", "d11-d":"joy"};
