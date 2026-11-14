/*
  The story of Nana Asma'u: chapters -> steps. WRITTEN BY scripts/asmau/author/build.js from the
  chapter files beside it. Change those, not this file.

  A step is { say, scene, pic?, src?, amb?, fx?, cue? } (a narrated picture) or
  { play, line, scene, opts } (something to do). See games/yusuf/story.js and
  shared/story-engine.js for what each field means. A chapter has no Qur'an `source`: `cite`
  says where its facts come from (see scripts/asmau/RESEARCH.md).
*/
window.STORY = [
  {
    id: "a1", icon: "👶🏿", title: "Two Babies in Degel", cite: "Boyd and Mack, The Collected Works of Nana Asma'u (1997): the introduction and the outline chronology",
    parent: [
      "Nana Asma'u was born in about 1793 in Degel, a village north-west of Sokoto in what is now northern Nigeria, a twin; her brother was Hassan. Her birth year is worked out from her age when she died, so it is 'about'. Source: Boyd and Mack, The Collected Works of Nana Asma'u (1997), drawing on the Sokoto historian Waziri Junaidu.",
      "Twins were customarily named Hassan and Hussain, after the Prophet's ﷺ grandsons, so she would have been Hussaina. Her father, the Shehu Usman dan Fodio, a scholar and teacher, chose instead to name her after Asma bint Abi Bakr. Same source; also Wikipedia."
    ],
    steps: [
      {"say":"a1-a","scene":"dusk","amb":"night","e":"👶🏿 👶🏿 🌙"},
      {"say":"a1-b","scene":"dusk","e":"🧔🏿 👶🏿"},
      {"say":"a1-c","scene":"dusk","e":"🧔🏿 👶🏿 💛"},
      {"play":"choice","line":"a1-q","scene":"dusk","opts":{"options":[{"label":"Asma'u","icon":"👧🏿","ok":true},{"label":"Hussaina","icon":"🍼","ok":false}],"wrong":"a1-q-no","img":"a1-c"}},
      {"play":"memory","line":"a1-mem","scene":"dusk","opts":{"icons":["👶🏿","🌙","⭐","🏠","🐐","🌴"]}}
    ]
  },
  {
    id: "a2", icon: "🎀", title: "The Girl with Two Belts", cite: "Sahih al-Bukhari 2979 and 3907",
    parent: [
      "Asma bint Abi Bakr was a Companion of the Prophet ﷺ and the daughter of Abu Bakr. When the Prophet ﷺ and Abu Bakr left Makkah for Madinah, she prepared their food and water. Having nothing else to tie them with, she cut her waistband in two, tying the water-skin with one piece and the food with the other; so she was called 'the one with the two belts' (Dhat an-Nitaqayn). Sahih al-Bukhari 2979 and 3907.",
      "Asma bint Abi Bakr is shown only from behind and by her hands. The Prophet ﷺ and Abu Bakr are mentioned, not shown."
    ],
    steps: [
      {"say":"a2-a","scene":"night","e":"🌙 🏠"},
      {"say":"a2-b","scene":"night","src":"From a hadith in al-Bukhari","e":"💧 🍞 🎗️"},
      {"play":"change","line":"a2-tear","scene":"night","opts":{"states":[{"icon":"🎗️","line":null,"glow":false},{"icon":"✂️","line":"a2-tear-s1","glow":false}],"img":"a2-b"},"src":"From a hadith in al-Bukhari"},
      {"say":"a2-c","scene":"night","src":"From a hadith in al-Bukhari","e":"🎗️ 💧 🍞"},
      {"play":"match","line":"a2-match","scene":"night","opts":{"pairs":[{"a":"a2-match-a1","aIcon":"🎗️","aLabel":"The first piece","b":"a2-match-b1","bIcon":"💧","bLabel":"tied the water"},{"a":"a2-match-a2","aIcon":"🎗️","aLabel":"The second piece","b":"a2-match-b2","bIcon":"🍞","bLabel":"tied the food"}]}},
      {"say":"a2-d","scene":"dusk","pic":"a1-c","e":"👧🏿 💛"}
    ]
  },
  {
    id: "a3", icon: "📖", title: "Learning at Home", cite: "Boyd and Mack, The Collected Works of Nana Asma'u (1997): the introduction and the outline chronology",
    parent: [
      "Her mother died when she was small (the source gives 1795 and marks the date as uncertain). She was brought up by her father's wives Aisha and Hauwa; Hauwa was the mother of her brother Muhammad Bello. Source: Boyd and Mack, Collected Works, outline chronology.",
      "She learned the Qur'an by heart while young (Collected Works, introduction). Learning to write on a wooden board, washed clean and used again, is how children there learned and still learn; the sources do not describe her own lessons, so the game says 'like children there still do'."
    ],
    steps: [
      {"say":"a3-a","scene":"field","e":"👩🏿 👧🏿 💛"},
      {"say":"a3-b","scene":"field","e":"👧🏿 👦🏿 📖"},
      {"play":"trail","line":"a3-trace","scene":"field","opts":{"n":7,"icon":"✒️","walker":"✏️","img":"a3-b"}},
      {"play":"wipe","line":"a3-wash","scene":"field","opts":{"cover":"sand","img":"a3-b"}},
      {"say":"a3-c","scene":"field","e":"👧🏿 📖 ✨"},
      {"play":"count","line":"a3-verses","scene":"field","opts":{"total":10,"icon":"⭐","got":"🌟"}},
      {"play":"choice","line":"a3-q","scene":"field","opts":{"options":[{"label":"Only the boys","icon":"👦🏿","ok":false},{"label":"Girls and boys","icon":"👧🏿👦🏿","ok":true}],"wrong":"a3-q-no","img":"a3-b"}}
    ]
  },
  {
    id: "a4", icon: "🚶🏿", title: "The Journey", cite: "Boyd and Mack, The Collected Works of Nana Asma'u (1997): the introduction and the outline chronology",
    parent: [
      "On 21 February 1804 the Shehu and his community left Degel for Gudu: the hijra, or emigration, that began the jihad, years of war against the rulers of Gobir (1804 to 1808). Asma'u was about eleven. Source: Collected Works, outline chronology. She later wrote about these years in poems, among them 'The Journey'.",
      "The game says only that the family had to leave their home and walk to a new place. It says only that 'it was no longer safe' for them; the conflict with the rulers of Gobir, the war and its losses are left for parents (next chapter's note)."
    ],
    steps: [
      {"say":"a4-a","scene":"desert","e":"🚶🏿 🚶🏿 🌅"},
      {"play":"sort","line":"a4-pack","scene":"desert","opts":{"bins":[{"label":"Take it","icon":"🎒"},{"label":"Too heavy","icon":"🪨"}],"things":[{"icon":"💧","label":"A pot of water","bin":0},{"icon":"🛏️","label":"A big wooden bed","bin":1},{"icon":"📖","label":"Their books","bin":0},{"icon":"🌾","label":"A bag of grain","bin":0},{"icon":"🚪","label":"The front door","bin":1}],"wrong":"a4-pack-no"}},
      {"play":"journey","line":"a4-walk","scene":"desert","opts":{"from":"🏡","to":"⛺","icon":"img:icon-girl","steps":8}},
      {"say":"a4-b","scene":"camp","e":"👧🏿 🔥 ✒️"}
    ]
  },
  {
    id: "a5", icon: "🤲🏿", title: "Hard Years", cite: "Boyd and Mack, The Collected Works of Nana Asma'u (1997): the introduction and the outline chronology",
    parent: [
      "The years after 1804 were years of war (the Sokoto jihad, 1804 to 1808), with battles and heavy losses on both sides; Muhammad Bello wrote that about two thousand of the Shehu's people were killed at Tsuntsuwa in 1804. Source: Collected Works, outline chronology and notes.",
      "The game says only that 'there was fighting' and shows the women's work at home. According to the same source, women of the community organised food for the army, brought up orphans, gave out goods to the poor and taught. Captives and enslavement, part of this history, are not told to children.",
      "Talk with older children about how war hurts families, and about the women who cared for others in it."
    ],
    steps: [
      {"say":"a5-a","scene":"grey","e":"☁️ 😢"},
      {"say":"a5-b","scene":"camp","e":"🍲 🥣 🤲🏿"},
      {"play":"count","line":"a5-bowls","scene":"camp","opts":{"total":8,"icon":"🥣","got":"😊","img":"a5-b"}},
      {"say":"a5-c","scene":"camp","pic":"a5-b","e":"👧🏿 🥣 💛"},
      {"play":"choice","line":"a5-q","scene":"camp","opts":{"options":[{"label":"Cared for others and shared","icon":"🤲🏿","ok":true},{"label":"Hid and did nothing","icon":"🙈","ok":false}],"wrong":"a5-q-no","img":"a5-b"}}
    ]
  },
  {
    id: "a6", icon: "🏘️", title: "A New Town", cite: "Boyd and Mack, The Collected Works of Nana Asma'u (1997): the introduction and the outline chronology",
    parent: [
      "In 1807 Asma'u married Usman Gidado, a close friend of her brother Muhammad Bello; Gidado later became vizier (chief minister). In 1809 she went to live in Sokoto, the new town built by Bello. Her first son, Abdulkadir, was born about 1810. Source: Collected Works, outline chronology.",
      "She ran a household of several hundred people, seeing that they had food, clothing and shelter (Collected Works, introduction)."
    ],
    steps: [
      {"say":"a6-a","scene":"egypt","amb":"crowd","e":"👩🏿 🧔🏿 🏘️"},
      {"play":"build","line":"a6-home","scene":"egypt","opts":{"n":12,"icon":"🧱","cols":4}},
      {"say":"a6-b","scene":"egypt","amb":"crowd","e":"🍲 👕 🏠"},
      {"play":"sort","line":"a6-care","scene":"egypt","opts":{"bins":[{"label":"Food","icon":"🍲"},{"label":"Clothes","icon":"👕"}],"things":[{"icon":"🍚","label":"A bowl of rice","bin":0},{"icon":"🧣","label":"A warm scarf","bin":1},{"icon":"🍞","label":"Fresh bread","bin":0},{"icon":"👗","label":"A new dress","bin":1},{"icon":"🥛","label":"A cup of milk","bin":0}],"wrong":"a6-care-no","img":"a6-b"}}
    ]
  },
  {
    id: "a7", icon: "📜", title: "Saving the Books", cite: "Boyd and Mack, The Collected Works of Nana Asma'u (1997): the introduction and the outline chronology",
    parent: [
      "On 20 April 1817 the Shehu died; that November her twin Hassan died too. Asma'u and Gidado then collected all the Shehu's papers and had them copied. Source: Collected Works, outline chronology.",
      "She wrote elegies, poems of mourning, for many of the people she lost (Collected Works)."
    ],
    steps: [
      {"say":"a7-a","scene":"dusk","e":"👩🏿 🤲🏿 🕯️"},
      {"say":"a7-b","scene":"dusk","e":"📜 📜 🧺"},
      {"play":"pick","line":"a7-pages","scene":"dusk","opts":{"items":[{"icon":"📜","n":8,"ok":true,"name":"a page"},{"icon":"🏺","n":2,"ok":false,"name":"a pot"},{"icon":"🧺","n":2,"ok":false,"name":"a basket"}],"mark":"✨","img":"a7-b"}},
      {"say":"a7-c","scene":"dusk","e":"✒️ 📜 📜"},
      {"play":"order","line":"a7-ord","scene":"dusk","opts":{"cards":[{"icon":"📜","label":"Gather the pages","line":"a7-ord-c1"},{"icon":"✒️","label":"Copy them","line":"a7-ord-c2"},{"icon":"🤲🏿","label":"Share them","line":"a7-ord-c3"}],"wrong":"a7-ord-no"}}
    ]
  },
  {
    id: "a8", icon: "✒️", title: "Words in Four Languages", cite: "Boyd and Mack, The Collected Works of Nana Asma'u (1997): the introduction and the outline chronology",
    parent: [
      "Her first written work, The Way of the Pious, dates from 1820. She knew four languages, Arabic, Fulfulde, Hausa and Tamasheq, and wrote in the first three, using Arabic letters for all of them (ajami), so that people who did not read Arabic could learn. More than sixty of her works survive. Sources: Collected Works; Wikipedia.",
      "In 1829 she wrote a poem that names every sura of the Qur'an, made to be easy to remember (Collected Works, chronology and introduction; Yaqeen Institute). The game's activity uses the first four suras in their order in the Qur'an."
    ],
    steps: [
      {"say":"a8-a","scene":"palace","e":"👩🏿 ✒️ 📜"},
      {"say":"a8-b","scene":"palace","e":"👩🏿 📖 👩🏿"},
      {"play":"choice","line":"a8-q1","scene":"palace","opts":{"options":[{"label":"To keep it a secret","icon":"🤫","ok":false},{"label":"So everyone could learn","icon":"🤲🏿","ok":true}],"wrong":"a8-q1-no","img":"a8-b"}},
      {"say":"a8-c","scene":"palace","pic":"a8-a","e":"📖 ✨"},
      {"play":"order","line":"a8-suras","scene":"palace","opts":{"cards":[{"icon":"1️⃣","label":"Al-Fatiha","line":"a8-suras-c1"},{"icon":"2️⃣","label":"Al-Baqarah","line":"a8-suras-c2"},{"icon":"3️⃣","label":"Al Imran","line":"a8-suras-c3"},{"icon":"4️⃣","label":"An-Nisa","line":"a8-suras-c4"}],"wrong":"a8-suras-no"}}
    ]
  },
  {
    id: "a9", icon: "👒", title: "The Teacher of Teachers", cite: "Boyd and Mack, The Collected Works of Nana Asma'u (1997): the introduction and the outline chronology; Wikipedia",
    parent: [
      "Asma'u trained women leaders called jaji, who came to her to learn and then taught women in their homes and villages, mostly through poems that were easy to remember. Their groups were called the 'Yan Taru, 'those who come together', the sisterhood. Each jaji wore a tall hat, the malfa, as a sign of her office. Sources: Collected Works; Wikipedia.",
      "The sources differ on when this began: Wikipedia says from about 1830, another summary says 1840. The game gives no year. The same sources say the network also began as a way to bring women captured in the wars into the community; the game does not tell children this.",
      "The 'Yan Taru still meet today."
    ],
    steps: [
      {"say":"a9-a","scene":"egypt","e":"👩🏿 👒 👒"},
      {"say":"a9-b","scene":"egypt","e":"👒 ✨"},
      {"play":"count","line":"a9-hats","scene":"egypt","opts":{"total":6,"icon":"🧕🏿","got":"👒","img":"a9-b"}},
      {"say":"a9-c","scene":"desert","e":"👒 🚶🏿 🛖"},
      {"play":"trail","line":"a9-villages","scene":"desert","opts":{"n":6,"icon":"🛖","walker":"img:icon-jaji","img":"a9-c"}},
      {"say":"a9-d","scene":"field","e":"🪔 👩🏿 👧🏿"},
      {"play":"catch","line":"a9-lamps","scene":"night","opts":{"target":8,"icon":"🪔","into":"✨"}},
      {"play":"choice","line":"a9-q","scene":"field","opts":{"options":[{"label":"Taught women in the villages","icon":"🛖","ok":true},{"label":"Kept the lessons to themselves","icon":"🔒","ok":false}],"wrong":"a9-q-no","img":"a9-d"}}
    ]
  },
  {
    id: "a10", icon: "🏠", title: "Mother of the Town", cite: "Boyd and Mack, The Collected Works of Nana Asma'u (1997): the introduction and the outline chronology",
    parent: [
      "From about the 1830s Asma'u was known as 'Uwar Gari', mother of the town (Collected Works). She advised the rulers who followed her brother Bello, and wrote poems of guidance for them (Wikipedia; Collected Works).",
      "She wrote elegies for those she lost, among them her brother Bello, her husband Gidado and her close friend Aisha (Collected Works)."
    ],
    steps: [
      {"say":"a10-a","scene":"egypt","amb":"crowd","e":"👩🏿 🤝🏿 🏠"},
      {"play":"sort","line":"a10-good","scene":"egypt","opts":{"bins":[{"label":"Kind","icon":"💛"},{"label":"Not kind","icon":"💢"}],"things":[{"icon":"🤝🏿","label":"Helping a neighbour","bin":0},{"icon":"😤","label":"Shouting at a friend","bin":1},{"icon":"🍲","label":"Sharing your food","bin":0},{"icon":"📖","label":"Teaching what you know","bin":0},{"icon":"🙈","label":"Laughing at someone","bin":1}],"wrong":"a10-good-no","img":"a10-a"}},
      {"say":"a10-b","scene":"egypt","e":"👩🏿 💛 👩🏿"}
    ]
  },
  {
    id: "a11", icon: "🌟", title: "Remembered Today", cite: "Boyd and Mack, The Collected Works of Nana Asma'u (1997): the introduction and the outline chronology; Wikipedia",
    parent: [
      "Nana Asma'u died in 1864 (some sources give 1865), aged about seventy. Schools, women's organisations and meeting halls in northern Nigeria are named after her. Source: Wikipedia; Collected Works.",
      "This website is named after her."
    ],
    steps: [
      {"say":"a11-a","scene":"dawn","e":"👵🏿 📖 👧🏿"},
      {"say":"a11-b","scene":"dawn","e":"🏫 👧🏿 📖"},
      {"play":"order","line":"a11-ord","scene":"dawn","opts":{"cards":[{"icon":"👶🏿","label":"Born a twin","line":"a11-ord-c1"},{"icon":"🚶🏿‍♀️","label":"The long journey","line":"a11-ord-c2"},{"icon":"📜","label":"Saving the books","line":"a11-ord-c3"},{"icon":"👒","label":"Training teachers","line":"a11-ord-c4"}],"wrong":"a11-ord-no"}},
      {"say":"a11-c","scene":"dawn","pic":"a11-a","e":"📖 💛 ✨"},
      {"play":"memory","line":"a11-mem","scene":"dawn","opts":{"icons":["👶🏿","🎀","📖","🚶🏿‍♀️","📜","👒"]}}
    ]
  }
];

/* Music for single lines; everything else uses its scene's music (sceneMood in game.js). */
window.STORY_MOODS = {"a1-a":"nile", "a1-b":"wonder", "a1-c":"wonder", "a2-a":"longing", "a2-c":"triumph", "a2-d":"wonder", "a3-a":"longing", "a3-b":"pastoral", "a3-c":"awe", "a4-a":"trek", "a4-b":"longing", "a5-a":"dread", "a5-b":"pastoral", "a5-c":"triumph", "a6-a":"triumph", "a6-b":"pastoral", "a7-a":"longing", "a7-b":"awe", "a7-c":"triumph", "a8-a":"wonder", "a8-b":"pastoral", "a8-c":"wonder", "a9-a":"awe", "a9-b":"triumph", "a9-c":"trek", "a9-d":"triumph", "a10-a":"pastoral", "a10-b":"longing", "a11-a":"awe", "a11-b":"triumph", "a11-c":"triumph"};
