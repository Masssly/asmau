/*
  The Musa story: chapters -> steps. WRITTEN BY scripts/musa/author/build.js from the
  chapter files beside it. Change those, not this file.

  A step is { say, scene, pic?, src?, amb?, fx?, cue? } (a narrated picture) or
  { play, line, scene, opts } (something to do). See games/yusuf/story.js and
  shared/story-engine.js for what each field means. `more` lists the other passages
  a chapter draws on, beside its main `source`.
*/
window.STORY = [
  {
    id: "m1", icon: "👑", title: "A Proud King", source: "28:3-6", more: [],
    parent: [
      "Verses 28:3–6. Pharaoh raised himself high in the land and split its people into groups. He oppressed one group: the verse says he slaughtered their sons and let their women live. The game says only that their baby boys were to be taken away.",
      "Verses 28:5–6 give Allah's plan: to favour the oppressed, make them leaders and heirs, and show Pharaoh, Haman and their armies the very thing they feared."
    ],
    steps: [
      {"say":"m1-a","scene":"egypt","e":"👑 🏛️"},
      {"say":"m1-b","scene":"grey","e":"😢 👶🏿 🛡️"},
      {"say":"m1-c","scene":"dawn","e":"🌅 🤲🏿"},
      {"play":"choice","line":"m1-q","scene":"dawn","opts":{"options":[{"label":"Allah","icon":"✨","ok":true},{"label":"Pharaoh","icon":"👑","ok":false}],"wrong":"m1-q-no","img":"m1-c"}},
      {"play":"memory","line":"m1-mem","scene":"egypt","opts":{"icons":["👑","🌴","🐪","🏺","☀️","🐊"]}}
    ]
  },
  {
    id: "m2", icon: "🧺", title: "The Baby on the River", source: "28:7", more: ["20:38-39"],
    parent: [
      "Verse 28:7 and verses 20:38–39. Musa's mother is inspired to nurse him and, when she fears for him, to put him into the chest and the chest into the river, with the promise that he will be returned to her and made a messenger. 20:39 adds that Allah cast His love over Musa and that he was reared under Allah's watchful eye.",
      "The chest is in the verse (20:39). Ibn Kathir's tafsir (abridged English) adds details the verses do not give: that her house was on the bank of the Nile and that she made a box into a cradle for him. The game's 'getting the chest ready' activity is built on that."
    ],
    steps: [
      {"say":"m2-a","scene":"river","e":"🤱🏿"},
      {"say":"m2-b","scene":"river","e":"🤱🏿 ✨"},
      {"play":"build","line":"m2-build","scene":"river","opts":{"n":8,"icon":"PLANK","cols":4},"src":"From Ibn Kathir's commentary"},
      {"say":"m2-c","scene":"river","cue":"splash","e":"CHEST 👶🏿"},
      {"play":"journey","line":"m2-push","scene":"river","opts":{"from":"🏠","to":"🌊","icon":"CHEST","steps":6}},
      {"say":"m2-d","scene":"river","e":"CHEST 🌊"},
      {"play":"trail","line":"m2-ripples","scene":"river","opts":{"n":7,"icon":"🌊","walker":"CHEST"}},
      {"play":"choice","line":"m2-q","scene":"river","opts":{"options":[{"label":"Hide and cry","icon":"😢","ok":false},{"label":"Do not be afraid","icon":"💛","ok":true}],"wrong":"m2-q-no","img":"m2-b"}}
    ]
  },
  {
    id: "m3", icon: "💛", title: "The Queen's Heart", source: "28:8-9", more: ["20:39"],
    parent: [
      "Verses 28:8–9. Pharaoh's household picked the child up, not knowing he would become their opponent. Pharaoh's wife said he would be a joy to the eye for her and for Pharaoh, and said: do not kill him; he may be useful to us, or we may adopt him. The game says 'do not harm him'.",
      "The verses do not name her. Ibn Kathir's tafsir (abridged English) names her Asiyah bint Muzahim, says the servant women brought the chest to her unopened, and that Allah filled her heart with love when she saw the child. It also reports Pharaoh's reply, 'For you he may be, but not for me', which the game leaves out.",
      "On 20:39, 'I cast My love over you', the same tafsir comments that no one saw Musa without loving him. The hearts activity is built on that."
    ],
    steps: [
      {"say":"m3-a","scene":"palace","e":"CHEST 🏛️"},
      {"play":"pull","line":"m3-pull","scene":"river","opts":{"icon":"CHEST","label":"Pull!"}},
      {"say":"m3-b","scene":"palace","src":"From Ibn Kathir's commentary","e":"CHEST 👸🏿"},
      {"play":"change","line":"m3-open","scene":"palace","opts":{"states":[{"icon":"CHEST","line":null,"glow":false},{"icon":"👶🏿","line":"m3-open-s1","glow":false}],"img":"m3-b"}},
      {"say":"m3-c","scene":"palace","e":"👸🏿 👶🏿 💛"},
      {"play":"count","line":"m3-hearts","scene":"palace","opts":{"total":8,"icon":"🤍","got":"💛","img":"m3-c"},"src":"From Ibn Kathir's commentary"},
      {"say":"m3-d","scene":"palace","e":"👸🏿 👶🏿 👑"},
      {"say":"m3-e","scene":"palace","pic":"m3-d","e":"👶🏿 🏛️"},
      {"play":"choice","line":"m3-q","scene":"palace","opts":{"options":[{"label":"Asiya, the queen","icon":"👸🏿","ok":true},{"label":"A soldier","icon":"🛡️","ok":false}],"wrong":"m3-q-no","img":"m3-c"}}
    ]
  },
  {
    id: "m4", icon: "🤱", title: "A Sister's Clever Plan", source: "28:10-13", more: ["20:40"],
    parent: [
      "Verses 28:10–13 and 20:40. The heart of Musa's mother became empty; she would have given him away had Allah not strengthened her heart. She told his sister to follow him, and the sister watched from a distance unnoticed. Allah had made him refuse every wet nurse, and the sister offered a household that would bring him up. He was returned to his mother so that she would be comforted and would know that Allah's promise is true.",
      "From Ibn Kathir's tafsir (abridged English), not the verses: that 'empty' means she could think of nothing but Musa (reported from Ibn Abbas, Mujahid, Ikrimah, Sa'id bin Jubayr and others); that the sister was the older child; that the queen paid the mother; and that only about a day and a night passed between the distress and the relief, 'and Allah knows best'.",
      "The same tafsir reports from Ibn Abbas that the palace people doubted the sister and seized her until she explained herself. The game leaves that out."
    ],
    steps: [
      {"say":"m4-a","scene":"river","e":"🧕🏿 💭"},
      {"say":"m4-b","scene":"river","e":"🧕🏿 👣 CHEST"},
      {"play":"trail","line":"m4-follow","scene":"river","opts":{"n":7,"icon":"👣","walker":"🧕🏿"}},
      {"say":"m4-c","scene":"palace","cue":"cry","e":"👶🏿 😭 🍼"},
      {"play":"count","line":"m4-nurses","scene":"palace","opts":{"total":5,"icon":"🧕🏿","got":"🙅🏿","img":"m4-c"}},
      {"say":"m4-d","scene":"palace","e":"🧕🏿 💬 👸🏿"},
      {"say":"m4-e","scene":"river","e":"🤱🏿 💛"},
      {"say":"m4-f","scene":"river","pic":"m4-e","src":"From Ibn Kathir's commentary","e":"👸🏿 💰 🤱🏿"},
      {"play":"choice","line":"m4-q","scene":"river","opts":{"options":[{"label":"A palace nurse","icon":"🧕🏿","ok":false},{"label":"His own mother","icon":"🤱🏿","ok":true}],"wrong":"m4-q-no","img":"m4-e"}},
      {"play":"order","line":"m4-ord","scene":"river","opts":{"cards":[{"icon":"🌊","label":"Into the river","line":"m4-ord-c1"},{"icon":"👸🏿","label":"Found at the palace","line":"m4-ord-c2"},{"icon":"🍼","label":"He will not drink","line":"m4-ord-c3"},{"icon":"🤱🏿","label":"Back with his mother","line":"m4-ord-c4"}],"wrong":"m4-ord-no"}}
    ]
  },
  {
    id: "m5", icon: "🏛️", title: "Growing Up in the Palace", source: "28:14", more: ["20:27-28"],
    parent: [
      "Verse 28:14. When Musa reached full maturity Allah gave him wisdom and knowledge: 'this is how We reward those who do good'.",
      "The hot coal is not in the Qur'an. Ibn Kathir's tafsir (abridged English), explaining the prayer 'untie the knot in my tongue' (20:27), says Musa had a lisp from an incident in which he was offered a date and a hot coal and put the coal on his tongue. The tafsir gives it in one sentence and refers elsewhere for the full story; the game adds nothing to it. The same tafsir says that as a child Musa stayed in Pharaoh's own room.",
      "The sorting activity (safe to eat, or too hot to touch) is a safety game of ours hung on that report."
    ],
    steps: [
      {"say":"m5-a","scene":"palace","src":"From Ibn Kathir's commentary","e":"👦🏿 🏛️"},
      {"say":"m5-b","scene":"palace","src":"From Ibn Kathir's commentary","e":"🌴 ♨️ 👦🏿"},
      {"play":"sort","line":"m5-sort","scene":"palace","opts":{"bins":[{"label":"Safe to eat","icon":"😋"},{"label":"Too hot! Do not touch","icon":"🔥"}],"things":[{"icon":"🌴","label":"A sweet date","bin":0},{"icon":"♨️","label":"A glowing coal","bin":1},{"icon":"🍞","label":"Warm bread","bin":0},{"icon":"🕯️","label":"A candle flame","bin":1},{"icon":"🥛","label":"A cup of milk","bin":0}],"wrong":"m5-sort-no"}},
      {"say":"m5-c","scene":"palace","e":"🧑🏿 💡"},
      {"play":"choice","line":"m5-q","scene":"palace","opts":{"options":[{"label":"Wisdom and knowledge","icon":"💡","ok":true},{"label":"A golden crown","icon":"👑","ok":false}],"wrong":"m5-q-no","img":"m5-c"}}
    ]
  },
  {
    id: "m6", icon: "🏃", title: "A Big Mistake", source: "28:15-21", more: [],
    parent: [
      "Verses 28:15–21. Musa entered the city unnoticed and found two men fighting, one of his own people and one an enemy. His kinsman called for help; Musa struck the other with his fist and killed him. The game says the man 'fell down and did not get up again'. Musa said 'this is Satan's work', asked forgiveness and was forgiven, and promised never to support wrongdoers.",
      "Left out: verses 28:18–19, where the same kinsman calls for help again the next day, Musa calls him a troublemaker, and the man lets slip what happened the day before.",
      "In verse 28:20 the man who came running says the authorities are talking about killing Musa. The game says they are 'coming to punish' him."
    ],
    steps: [
      {"say":"m6-a","scene":"city","e":"🧑🏿 🤼"},
      {"say":"m6-b","scene":"city","e":"🧑🏿 ✊🏿 😟"},
      {"say":"m6-c","scene":"city","e":"🧑🏿 🤲🏿"},
      {"play":"hold","line":"m6-sorry","scene":"city","opts":{"ms":3000,"icon":"🤲🏿","hint":"Press and hold","done":"Allah is the Most Forgiving","img":"m6-c"}},
      {"play":"choice","line":"m6-q","scene":"city","opts":{"options":[{"label":"He pretended nothing happened","icon":"🙈","ok":false},{"label":"He asked Allah to forgive him","icon":"🤲🏿","ok":true}],"wrong":"m6-q-no","img":"m6-c"}},
      {"say":"m6-d","scene":"city","e":"🏃🏿 💬 🧑🏿"},
      {"say":"m6-e","scene":"desert","e":"🏃🏿 🏜️"},
      {"play":"journey","line":"m6-flee","scene":"desert","opts":{"from":"🏙️","to":"🏜️","icon":"🚶🏿","steps":7}}
    ]
  },
  {
    id: "m7", icon: "🐑", title: "The Well of Madyan", source: "28:22-24", more: ["28:26"],
    parent: [
      "Verses 28:22–24. Musa turned towards Madyan hoping his Lord would guide him. At its water he found men watering flocks and two women holding theirs back; they could not water until the shepherds left, and their father was very old. He watered for them, withdrew to the shade and prayed: 'My Lord, I am in dire need of whatever good You send me.'",
      "The heavy rock is not in the verses. Ibn Kathir's tafsir (abridged English), on 'the strong, the trustworthy' in 28:26, reports from Umar, Ibn Abbas, Shurayh, Abu Malik, Qatadah, Ibn Ishaq and others that the daughter said Musa had lifted a rock that only ten men could lift. The same tafsir says he sat beneath a tree (Ibn Abbas, Ibn Mas'ud, As-Suddi).",
      "The tafsir also mentions, with 'and Allah knows best', a report that an angel on a horse showed Musa the way. The game does not use it."
    ],
    steps: [
      {"say":"m7-a","scene":"desert","e":"🚶🏿 🏜️"},
      {"play":"trail","line":"m7-walk","scene":"desert","opts":{"n":8,"icon":"👣","walker":"🚶🏿"}},
      {"say":"m7-b","scene":"well","e":"🐑 🧔🏿 🧕🏿"},
      {"say":"m7-c","scene":"well","e":"🧑🏿 💬 🧕🏿"},
      {"say":"m7-d","scene":"well","src":"From Ibn Kathir's commentary","e":"🧑🏿 ROCK"},
      {"play":"pull","line":"m7-rock","scene":"well","opts":{"icon":"ROCK","label":"Lift!"},"src":"From Ibn Kathir's commentary"},
      {"play":"count","line":"m7-sheep","scene":"well","opts":{"total":8,"icon":"🐑","got":"💧"}},
      {"say":"m7-e","scene":"well","e":"🧑🏿 🌳 🤲🏿"},
      {"play":"choice","line":"m7-q","scene":"well","opts":{"options":[{"label":"Allah","icon":"🤲🏿","ok":true},{"label":"The shepherds","icon":"🧔🏿","ok":false}],"wrong":"m7-q-no","img":"m7-e"}},
      {"play":"memory","line":"m7-mem","scene":"well","opts":{"icons":["🐑","ROCK","💧","🌳","🐐","☀️"]}}
    ]
  },
  {
    id: "m8", icon: "🏡", title: "A New Home", source: "28:25-28", more: [],
    parent: [
      "Verses 28:25–28. One of the two women came walking shyly with her father's invitation. Musa told his story and the old man said: do not be afraid, you are safe now. A daughter said: hire him, the best to hire is the strong and trustworthy. The father offered marriage to one of his daughters for eight years of work, ten if Musa chose, and Musa agreed. The verses do not name the father.",
      "From Ibn Kathir's tafsir (abridged English), not the verses: Musa asked her to walk behind him and throw a pebble to show the way (reported from Umar, Ibn Abbas and others, as her explanation of 'trustworthy'); and Musa completed the longer term, ten years, which the tafsir quotes from al-Bukhari on the authority of Ibn Abbas."
    ],
    steps: [
      {"say":"m8-a","scene":"well","e":"🧕🏿 💬 🧑🏿"},
      {"say":"m8-b","scene":"desert","src":"From Ibn Kathir's commentary","e":"🚶🏿 ROCK 🧕🏿"},
      {"play":"trail","line":"m8-pebble","scene":"desert","opts":{"n":6,"icon":"ROCK","walker":"🚶🏿"},"src":"From Ibn Kathir's commentary"},
      {"say":"m8-c","scene":"field","e":"👴🏿 🧑🏿 🍲"},
      {"say":"m8-d","scene":"field","pic":"m8-c","e":"🧕🏿 💬 👴🏿"},
      {"play":"choice","line":"m8-q","scene":"field","opts":{"options":[{"label":"Loud and bossy","icon":"📢","ok":false},{"label":"Strong, and can be trusted","icon":"💪🏿","ok":true}],"wrong":"m8-q-no","img":"m8-c"}},
      {"say":"m8-e","scene":"field","e":"👴🏿 🤝 🧑🏿"},
      {"play":"count","line":"m8-years","scene":"field","opts":{"total":10,"icon":"☀️"},"src":"From a hadith in al-Bukhari"},
      {"play":"catch","line":"m8-flock","scene":"field","opts":{"target":7,"icon":"🐑","into":"🏡"}}
    ]
  },
  {
    id: "m9", icon: "🔥", title: "The Fire on the Mountain", source: "20:9-14", more: ["28:29-30"],
    parent: [
      "Verses 20:9–14 and 28:29–30. When his term was complete Musa was travelling with his family and saw a fire. He told them to wait: he might bring a burning brand, or find guidance there. He was called: 'Musa! I am your Lord. Take off your shoes: you are in the sacred valley of Tuwa. I have chosen you, so listen to what is revealed. I am Allah; there is no god but Me. So worship Me and keep up the prayer so that you remember Me.' Verse 28:30 says the call came from the right side of the valley, from a tree on blessed ground.",
      "The pictures show a fire and a light, and nothing else. Allah is not shown, and no angel is shown anywhere in this game."
    ],
    steps: [
      {"say":"m9-a","scene":"night","e":"⛺ 🧔🏿 🔥"},
      {"say":"m9-b","scene":"night","pic":"m9-a","e":"🧔🏿 👉🏿 🔥"},
      {"play":"seek","line":"m9-seek","scene":"night","opts":{"icon":"🔥","r":20}},
      {"play":"journey","line":"m9-climb","scene":"night","opts":{"from":"⛺","to":"🔥","icon":"🚶🏿","steps":7}},
      {"say":"m9-c","scene":"fire","e":"🌳 🔥 🧔🏿"},
      {"play":"count","line":"m9-sandals","scene":"fire","opts":{"total":2,"icon":"👡","got":"✨","img":"m9-c"}},
      {"say":"m9-d","scene":"fire","e":"🧔🏿 ✨"},
      {"play":"hold","line":"m9-listen","scene":"fire","opts":{"ms":3200,"icon":"✨","hint":"Press and hold","done":"There is no god but Allah","img":"m9-d"}},
      {"play":"choice","line":"m9-q","scene":"fire","opts":{"options":[{"label":"Allah, his Lord","icon":"✨","ok":true},{"label":"A shepherd","icon":"🐑","ok":false}],"wrong":"m9-q-no","img":"m9-d"}}
    ]
  },
  {
    id: "m10", icon: "🐍", title: "The Staff and the Shining Hand", source: "20:17-24", more: ["28:31-32"],
    parent: [
      "Verses 20:17–24 and 28:31–32. Asked what was in his right hand, Musa said it was his staff: he leaned on it, kept his sheep in order with it, and had other uses for it. Thrown down, it became a fast-moving snake and he turned to flee; he was told to pick it up without fear and it would return to its former state. His hand, drawn out from his side, came out white and unharmed. These were two signs for Pharaoh and his chiefs.",
      "'Shone like the moon' is from Ibn Kathir's tafsir (abridged English): the hand came out 'shining as if it were a half moon', free of any disease (reported from Ibn Abbas, Mujahid, Ikrimah, Qatadah, Ad-Dahhak and As-Suddi); Al-Hasan al-Basri said 'as if it were a lamp'."
    ],
    steps: [
      {"say":"m10-a","scene":"fire","e":"🧔🏿 STAFF"},
      {"play":"change","line":"m10-staff","scene":"fire","opts":{"states":[{"icon":"STAFF","line":null,"glow":false},{"icon":"🐍","line":"m10-staff-s1","glow":false},{"icon":"STAFF","line":"m10-staff-s2","glow":false}]},"cue":"hiss"},
      {"say":"m10-b","scene":"fire","e":"🐍 😮"},
      {"play":"change","line":"m10-hand","scene":"fire","opts":{"states":[{"icon":"✋🏿","line":null,"glow":false},{"icon":"✋🏿","line":"m10-hand-s1","glow":true},{"icon":"✋🏿","line":"m10-hand-s2","glow":false}]}},
      {"say":"m10-c","scene":"fire","src":"From Ibn Kathir's commentary","e":"✋🏿 ✨"},
      {"say":"m10-d","scene":"fire","pic":"m10-c","e":"🧔🏿 ➡️ 👑"},
      {"play":"match","line":"m10-match","scene":"fire","opts":{"pairs":[{"a":"m10-match-a1","aIcon":"STAFF","aLabel":"The staff","b":"m10-match-b1","bIcon":"🐍","bLabel":"became a snake"},{"a":"m10-match-a2","aIcon":"✋🏿","aLabel":"The hand","b":"m10-match-b2","bIcon":"🌕","bLabel":"shone white"},{"a":"m10-match-a3","aIcon":"👡","aLabel":"The sandals","b":"m10-match-b3","bIcon":"⛰️","bLabel":"came off in the holy valley"}]}},
      {"play":"memory","line":"m10-mem","scene":"fire","opts":{"icons":["🔥","🐍","✋🏿","👡","⛰️","🌕"]}}
    ]
  },
  {
    id: "m11", icon: "🤲", title: "Musa's Prayer", source: "20:25-36", more: ["28:33-35","20:42-46"],
    parent: [
      "Verses 20:25–36. Musa asked: lift up my heart, ease my task, untie my tongue so they may understand my words, and give me a helper from my family, Harun my brother; strengthen me through him and let him share my task, so that we may glorify and remember You much. He was told: your request is granted.",
      "Verses 28:33–35: Musa says he killed one of their men and fears they may kill him, and that Harun is the better speaker. The game says only that he was afraid of what they might do to him. Verses 20:42–46: go, both of you; speak to him gently so that he may take heed or show respect; do not be afraid, I am with you both, hearing and seeing.",
      "Ibn Kathir's tafsir (abridged English) reports from Ibn Abbas that Harun was made a prophet at that same moment, and that A'ishah agreed with a man who said no brother was ever more useful to his brother than Musa was in this prayer."
    ],
    steps: [
      {"say":"m11-a","scene":"fire","e":"🧔🏿 😟"},
      {"say":"m11-b","scene":"fire","e":"🧔🏿 🤲🏿"},
      {"say":"m11-c","scene":"fire","pic":"m11-b","e":"🧔🏿 🤝 🧔🏿"},
      {"play":"order","line":"m11-ord","scene":"fire","opts":{"cards":[{"icon":"💛","label":"Open up my heart","line":"m11-ord-c1"},{"icon":"🌤️","label":"Make my task easy","line":"m11-ord-c2"},{"icon":"👅🏿","label":"Untie my tongue","line":"m11-ord-c3"},{"icon":"🤝","label":"Give me my brother","line":"m11-ord-c4"}],"wrong":"m11-ord-no","img":"m11-b"}},
      {"say":"m11-d","scene":"fire","pic":"m11-b","e":"✨ 🤲🏿"},
      {"say":"m11-e","scene":"desert","e":"🧔🏿 🧔🏿 🕊️"},
      {"play":"choice","line":"m11-q","scene":"desert","opts":{"options":[{"label":"With shouting","icon":"😡","ok":false},{"label":"Gently","icon":"🕊️","ok":true}],"wrong":"m11-q-no","img":"m11-e"}},
      {"play":"sort","line":"m11-sort","scene":"desert","opts":{"bins":[{"label":"Gentle","icon":"🕊️"},{"label":"Harsh","icon":"🌩️"}],"things":[{"icon":"🙂","label":"Please listen to me","bin":0},{"icon":"😠","label":"You are stupid!","bin":1},{"icon":"🤝","label":"Let us talk together","bin":0},{"icon":"👉🏿","label":"Go away!","bin":1},{"icon":"💛","label":"Peace be with you","bin":0}],"wrong":"m11-sort-no"}}
    ]
  },
  {
    id: "m12", icon: "🏛️", title: "Before Pharaoh", source: "20:47-59", more: ["28:36-37"],
    parent: [
      "Verses 20:47–59 and 28:36–37. The two brothers say: we are messengers of your Lord; send the Children of Israel with us and do not oppress them. When Musa brought clear signs, Pharaoh's people called them conjuring tricks never heard of from their forefathers. Pharaoh accused Musa of coming to drive them from their land with sorcery and demanded an appointment; Musa named the day of the feast, with the people gathered when the sun is high.",
      "The long exchange about who the Lord is (20:49–55) is left out of the game."
    ],
    steps: [
      {"say":"m12-a","scene":"palace","e":"🧔🏿 🧔🏿 👑"},
      {"say":"m12-b","scene":"palace","e":"✋🏿 ✨ 👑"},
      {"play":"pick","line":"m12-signs","scene":"palace","opts":{"items":[{"icon":"STAFF","n":1,"ok":true,"name":"the staff"},{"icon":"✋🏿","n":1,"ok":true,"name":"the hand"},{"icon":"👑","n":1,"ok":false,"name":"a crown"},{"icon":"💰","n":1,"ok":false,"name":"gold"},{"icon":"🗡️","n":1,"ok":false,"name":"a sword"},{"icon":"🐎","n":1,"ok":false,"name":"a horse"}],"mark":"✨"}},
      {"say":"m12-c","scene":"palace","e":"👑 😤"},
      {"say":"m12-d","scene":"palace","pic":"m12-c","e":"👑 👉🏿"},
      {"say":"m12-e","scene":"palace","e":"🧔🏿 ☀️ 🎪"},
      {"play":"choice","line":"m12-q","scene":"palace","opts":{"options":[{"label":"The day of the festival, with everyone watching","icon":"🎪","ok":true},{"label":"A secret night, with nobody there","icon":"🌙","ok":false}],"wrong":"m12-q-no","img":"m12-e"}},
      {"play":"catch","line":"m12-crowd","scene":"egypt","opts":{"target":8,"icon":"🧑🏿","into":"🎪"}}
    ]
  },
  {
    id: "m13", icon: "🎪", title: "The Day of the Festival", source: "20:60-70", more: [],
    parent: [
      "Verses 20:60–70. Pharaoh gathered his resources and returned. Musa warned the sorcerers not to invent lies against Allah. They asked whether he would throw first; he told them to throw. Through their sorcery their ropes and staffs seemed to him to be moving, and Musa was inwardly alarmed. He was told: do not be afraid, you have the upper hand; throw what is in your right hand and it will swallow what they have produced, which is only a sorcerer's trick. The sorcerers threw themselves down and said: we believe in the Lord of Harun and Musa."
    ],
    steps: [
      {"say":"m13-a","scene":"egypt","amb":"crowd","e":"🎪 🧙🏿 🧙🏿"},
      {"say":"m13-b","scene":"egypt","pic":"m13-a","amb":"crowd","e":"🧔🏿 💬 🧙🏿"},
      {"play":"choice","line":"m13-q1","scene":"egypt","opts":{"options":[{"label":"Musa","icon":"STAFF","ok":false},{"label":"The magicians","icon":"🧙🏿","ok":true}],"wrong":"m13-q1-no","img":"m13-a"}},
      {"say":"m13-c","scene":"egypt","amb":"crowd","e":"ROPE 🐍 ROPE"},
      {"play":"count","line":"m13-ropes","scene":"egypt","opts":{"total":9,"icon":"🐍","got":"ROPE"}},
      {"say":"m13-d","scene":"egypt","amb":"crowd","e":"🧔🏿 😟 ✨"},
      {"play":"change","line":"m13-throw","scene":"egypt","opts":{"states":[{"icon":"STAFF","line":null,"glow":false},{"icon":"🐍","line":"m13-throw-s1","glow":false}]},"cue":"hiss"},
      {"say":"m13-e","scene":"egypt","amb":"crowd","e":"🐍 ROPE"},
      {"play":"catch","line":"m13-swallow","scene":"egypt","opts":{"target":8,"icon":"ROPE","into":"🐍"}},
      {"say":"m13-f","scene":"egypt","amb":"crowd","e":"🧙🏿 🙇🏿 ✨"},
      {"play":"choice","line":"m13-q2","scene":"egypt","opts":{"options":[{"label":"They saw it was no trick. It was from Allah","icon":"✨","ok":true},{"label":"Pharaoh told them to","icon":"👑","ok":false}],"wrong":"m13-q2-no","img":"m13-f"}}
    ]
  },
  {
    id: "m14", icon: "🦁", title: "Brave Hearts", source: "20:71-73", more: ["40:28","66:11","28:38-39"],
    parent: [
      "Verses 20:71–73. Pharaoh said: how dare you believe before I give you permission? He threatened to cut off their hands and feet on opposite sides and crucify them on palm trunks. The game says only that he would punish them terribly. They answered that they would never prefer him to the clear signs and to their Creator: 'decide whatever you will: you can only decide matters of this present life.'",
      "Verse 40:28: a believing man of Pharaoh's family who had hidden his faith said, 'How can you kill a man just for saying, My Lord is Allah?' The game says 'hurt'. Verse 66:11 gives the prayer of Pharaoh's wife. The verses do not name her; the name Asiya comes from the commentary (see chapter 3). The Qur'an does not say at what point in the story the believing man spoke or the queen prayed; the game places them here.",
      "Verses 28:38–39: Pharaoh tells his chiefs he knows of no god for them but himself, and orders Haman to bake clay bricks and build a tall building so that he may climb to Musa's God. The verses fetched for this game do not say what became of the building, so neither does the game."
    ],
    steps: [
      {"say":"m14-a","scene":"palace","e":"👑 😡"},
      {"say":"m14-b","scene":"palace","e":"🧙🏿 💛 ✨"},
      {"play":"choice","line":"m14-q","scene":"palace","opts":{"options":[{"label":"Pharaoh's gold","icon":"💰","ok":false},{"label":"The truth from Allah","icon":"✨","ok":true}],"wrong":"m14-q-no","img":"m14-b"}},
      {"say":"m14-c","scene":"palace","e":"🧔🏿 ☝🏿 👑"},
      {"say":"m14-d","scene":"palace","e":"👸🏿 🤲🏿"},
      {"play":"hold","line":"m14-dua","scene":"palace","opts":{"ms":3000,"icon":"🤲🏿","hint":"Press and hold","done":"My Lord, build me a house near You","img":"m14-d"}},
      {"say":"m14-e","scene":"egypt","e":"👑 🧱 ☁️"},
      {"play":"build","line":"m14-tower","scene":"egypt","opts":{"n":12,"icon":"🧱","cols":3,"after":"m14-tower-after"}},
      {"play":"match","line":"m14-match","scene":"palace","opts":{"pairs":[{"a":"m14-match-a1","aIcon":"🧙🏿","aLabel":"The magicians","b":"m14-match-b1","bIcon":"✨","bLabel":"We believe in the Lord of Harun and Musa"},{"a":"m14-match-a2","aIcon":"👸🏿","aLabel":"Asiya the queen","b":"m14-match-b2","bIcon":"🏡","bLabel":"Build me a house near You in the Garden"},{"a":"m14-match-a3","aIcon":"🧔🏿","aLabel":"The secret believer","b":"m14-match-b3","bIcon":"☝🏿","bLabel":"My Lord is Allah"}]}}
    ]
  },
  {
    id: "m15", icon: "🐸", title: "Sign after Sign", source: "7:130-135", more: [],
    parent: [
      "Verses 7:130–135. Pharaoh's people were afflicted with years of drought and crop failure; when good came they claimed it as their due, and when harm came they blamed Musa. They said they would never believe whatever sign he brought. Then came the flood, the locusts, the lice, the frogs and the blood, 'all clear signs'. Each time they asked Musa to pray and promised to believe and release the Children of Israel, and each time they broke the promise.",
      "Details from Ibn Kathir's tafsir (abridged English), not the verses. The 'flood': Ibn Abbas said it was heavy rain that ruined crops and fruit; he is also reported to have said mass death, and Mujahid said water carrying plague, so the early scholars differed. The locusts eating the nails of the doors is reported from Mujahid. The third sign (qummal): Ibn Abbas said grain weevils, or small wingless locusts; Al-Hasan and Sa'id bin Jubayr said small black insects; the game says 'tiny bugs in the grain'. Frogs in the houses, food, pots and clothes is from Sa'id bin Jubayr and Ibn Ishaq.",
      "The fifth sign is blood: the tafsir says rivers, wells and containers of water turned to blood. The game says the water 'turned red'."
    ],
    steps: [
      {"say":"m15-a","scene":"egypt","e":"☀️ 🌾 🥀"},
      {"say":"m15-b","scene":"storm","src":"From Ibn Kathir's commentary","cue":"thunder","e":"🌧️ 🌊"},
      {"say":"m15-c","scene":"egypt","src":"From Ibn Kathir's commentary","e":"🦗 🦗 🌿"},
      {"play":"catch","line":"m15-locusts","scene":"egypt","opts":{"target":8,"icon":"🦗","into":"💨"}},
      {"say":"m15-d","scene":"egypt","src":"From Ibn Kathir's commentary","cue":"croak","e":"🐸 🏺 🐸"},
      {"play":"pick","line":"m15-frogs","scene":"egypt","opts":{"items":[{"icon":"🐸","n":7,"ok":true,"name":"a frog"},{"icon":"🏺","n":2,"ok":false,"name":"a pot"},{"icon":"🍞","n":2,"ok":false,"name":"bread"},{"icon":"🥣","n":1,"ok":false,"name":"a bowl"}],"mark":"✨","img":"m15-d"}},
      {"say":"m15-e","scene":"egypt","e":"🌊 🔴"},
      {"say":"m15-f","scene":"storm","e":"🧔🏿 🤲🏿"},
      {"play":"wipe","line":"m15-clear","scene":"storm","opts":{"cover":"storm","img":"m1-c"}},
      {"say":"m15-g","scene":"egypt","e":"👑 💔"},
      {"play":"choice","line":"m15-q","scene":"egypt","opts":{"options":[{"label":"They broke their promise","icon":"💔","ok":true},{"label":"They kept their promise","icon":"🤝","ok":false}],"wrong":"m15-q-no","img":"m15-g"}},
      {"play":"order","line":"m15-ord","scene":"egypt","opts":{"cards":[{"icon":"🌧️","label":"The flood","line":"m15-ord-c1"},{"icon":"🦗","label":"The locusts","line":"m15-ord-c2"},{"icon":"🐜","label":"The tiny bugs","line":"m15-ord-c3"},{"icon":"🐸","label":"The frogs","line":"m15-ord-c4"},{"icon":"🔴","label":"The red water","line":"m15-ord-c5"}],"wrong":"m15-ord-no"}}
    ]
  },
  {
    id: "m16", icon: "🌙", title: "Leaving by Night", source: "26:60-62", more: ["20:77"],
    parent: [
      "Verse 20:77: 'Go out at night with My servants and strike a dry path for them across the sea. Have no fear of being overtaken.' Verses 26:60–62: Pharaoh and his people pursued them at sunrise; when the two sides came in sight of each other Musa's followers said, 'We shall definitely be caught', and Musa said, 'No, my Lord is with me: He will guide me.'",
      "Ibn Kathir's tafsir (abridged English) says they were caught up with at the shore, the sea in front and Pharaoh behind. The lamps in the 'wake the families' activity are ours."
    ],
    steps: [
      {"say":"m16-a","scene":"night","e":"🧔🏿 🌙"},
      {"play":"count","line":"m16-wake","scene":"night","opts":{"total":8,"icon":"🏠","got":"🏮"}},
      {"say":"m16-b","scene":"night","e":"🚶🏿 🚶🏿 🌙"},
      {"play":"journey","line":"m16-leave","scene":"night","opts":{"from":"🏘️","to":"🌊","icon":"🚶🏿","steps":8}},
      {"say":"m16-c","scene":"dawn","cue":"thunder","e":"👑 🐎 🐎"},
      {"say":"m16-d","scene":"sea","e":"🌊 😨 🐎"},
      {"say":"m16-e","scene":"sea","e":"🧔🏿 STAFF 🌊"},
      {"play":"choice","line":"m16-q","scene":"sea","opts":{"options":[{"label":"We are lost","icon":"😱","ok":false},{"label":"My Lord is with me","icon":"💛","ok":true}],"wrong":"m16-q-no","img":"m16-e"}}
    ]
  },
  {
    id: "m17", icon: "🌊", title: "The Sea Opens", source: "26:63-66", more: ["20:77-78","10:90-92"],
    parent: [
      "Verses 26:63–66: 'Strike the sea with your staff.' It parted, each side like a mighty mountain; Musa and all his companions were saved and the others were drowned. The game says the sea 'came crashing back' and that the army 'was gone'. Verses 10:90–92: as he was drowning Pharaoh said he believed in the God of the Children of Israel, and was answered, 'Now? When you had always been a rebel?' Only his body was saved, as a sign for those after him.",
      "From Ibn Kathir's tafsir (abridged English), not the verses: the twelve paths, one for each tribe (reported from Ibn Abbas); the openings like windows in the water through which they saw one another (As-Suddi); and the wind sent to dry the sea bed. The same tafsir gives an account in which the angels Jibril and Mika'il ride at the sea; the game does not use it.",
      "Ashura: the tafsir quotes al-Bukhari, from Ibn Abbas, that the Prophet ﷺ found the Jews of Madinah fasting the day Musa was given victory over Pharaoh and said, 'You have more right to Musa than they, so fast it.' The Prophet ﷺ is mentioned in the narration and is not shown."
    ],
    steps: [
      {"say":"m17-a","scene":"sea","e":"🧔🏿 STAFF 🌊"},
      {"play":"part","line":"m17-part","scene":"sea","opts":{"ms":3600,"icon":"STAFF"}},
      {"say":"m17-b","scene":"sea","cue":"roar","e":"🌊 👣 🌊"},
      {"say":"m17-c","scene":"sea","src":"From Ibn Kathir's commentary","e":"🌊 👣 🌊"},
      {"play":"wipe","line":"m17-dry","scene":"sea","opts":{"cover":"water","img":"m17-b"},"src":"From Ibn Kathir's commentary"},
      {"play":"count","line":"m17-paths","scene":"sea","opts":{"total":12,"icon":"🌊","got":"👣"},"src":"From Ibn Kathir's commentary"},
      {"play":"journey","line":"m17-cross","scene":"sea","opts":{"from":"🏖️","to":"🌅","icon":"🚶🏿","steps":8,"img":"m17-b"}},
      {"say":"m17-d","scene":"sea","e":"🚶🏿 🚶🏿 🙌🏿"},
      {"say":"m17-e","scene":"sea","cue":"roar","e":"🌊 🌊 🌊"},
      {"say":"m17-f","scene":"sea","e":"👑 🌊"},
      {"say":"m17-g","scene":"dawn","src":"From a hadith in al-Bukhari","e":"🙌🏿 🌅"},
      {"play":"choice","line":"m17-q","scene":"dawn","opts":{"options":[{"label":"Allah","icon":"✨","ok":true},{"label":"A big boat","icon":"⛵","ok":false}],"wrong":"m17-q-no","img":"m17-g"}},
      {"play":"order","line":"m17-ord","scene":"sea","opts":{"cards":[{"icon":"😨","label":"Caught at the sea","line":"m17-ord-c1"},{"icon":"STAFF","label":"Musa strikes the sea","line":"m17-ord-c2"},{"icon":"👣","label":"A dry path","line":"m17-ord-c3"},{"icon":"🌊","label":"The sea closes","line":"m17-ord-c4"}],"wrong":"m17-ord-no"}}
    ]
  },
  {
    id: "m18", icon: "💧", title: "Food from the Sky, Water from the Rock", source: "2:57-60", more: [],
    parent: [
      "Verse 2:57: clouds were made to shade them, and manna and quails were sent down: 'Eat the good things We have provided for you.' Verse 2:60: Musa prayed for water for his people and was told to strike the rock with his staff; twelve springs gushed out and each group knew its drinking place.",
      "Ibn Kathir's tafsir (abridged English) reports from Ibn Abbas that it was a square stone and that three springs came from each side, one spring for each tribe. The game does not say what manna looked like; the sparkles in the gathering activity are only a stand-in."
    ],
    steps: [
      {"say":"m18-a","scene":"desert","e":"☁️ 🚶🏿"},
      {"say":"m18-b","scene":"camp","e":"✨ 🐦 ⛺"},
      {"play":"catch","line":"m18-manna","scene":"camp","opts":{"target":8,"icon":"✨","into":"🧺"}},
      {"play":"catch","line":"m18-quail","scene":"camp","opts":{"target":6,"icon":"🐦","into":"⛺"}},
      {"say":"m18-c","scene":"desert","e":"🧔🏿 STAFF ROCK"},
      {"play":"count","line":"m18-springs","scene":"desert","opts":{"total":12,"icon":"ROCK","got":"💧"}},
      {"say":"m18-d","scene":"desert","src":"From Ibn Kathir's commentary","cue":"gush","e":"ROCK 💧 💧"},
      {"play":"choice","line":"m18-q","scene":"desert","opts":{"options":[{"label":"Two","icon":"✌️","ok":false},{"label":"Twelve","icon":"💧","ok":true}],"wrong":"m18-q-no","img":"m18-d"}},
      {"play":"memory","line":"m18-mem","scene":"camp","opts":{"icons":["☁️","🐦","💧","ROCK","✨","⛺"]}}
    ]
  },
  {
    id: "m19", icon: "⛰️", title: "The Mountain and the Tablets", source: "7:142-145", more: [],
    parent: [
      "Verses 7:142–145. Allah appointed thirty nights for Musa and added ten, making forty. Musa told Harun to take his place and act rightly. On the mountain Musa asked to see his Lord and was told: 'You will never see Me, but look at that mountain: if it remains firmly in its place, you will see Me.' When his Lord revealed Himself to the mountain He made it crumble, and Musa fell unconscious. On recovering he said: 'Glory be to You! To You I turn in repentance! I am the first to believe!' He was told to hold on to what he had been given and be thankful, and was given the Tablets.",
      "The picture shows a mountain crumbling and nothing else. Allah is never shown."
    ],
    steps: [
      {"say":"m19-a","scene":"camp","e":"🧔🏿 🤝 🧔🏿"},
      {"play":"choice","line":"m19-q1","scene":"camp","opts":{"options":[{"label":"Forty","icon":"🌙","ok":true},{"label":"Thirteen","icon":"⭐","ok":false}],"wrong":"m19-q1-no","img":"m19-a"}},
      {"play":"journey","line":"m19-climb","scene":"mountain","opts":{"from":"⛺","to":"⛰️","icon":"🚶🏿","steps":8}},
      {"say":"m19-b","scene":"mountain","e":"🧔🏿 ⛰️"},
      {"say":"m19-c","scene":"mountain","cue":"thunder","e":"⛰️ 💨"},
      {"play":"choice","line":"m19-q2","scene":"mountain","opts":{"options":[{"label":"It grew taller","icon":"⛰️","ok":false},{"label":"It crumbled into dust","icon":"💨","ok":true}],"wrong":"m19-q2-no","img":"m19-c"}},
      {"say":"m19-d","scene":"mountain","e":"🧔🏿 🙇🏿"},
      {"say":"m19-e","scene":"mountain","e":"🧔🏿 📜"},
      {"play":"sort","line":"m19-sort","scene":"mountain","opts":{"bins":[{"label":"Thankful","icon":"💛"},{"label":"Not thankful","icon":"🙄"}],"things":[{"icon":"🤲🏿","label":"Saying: thank You, Allah","bin":0},{"icon":"😤","label":"Saying: I want more, more, more","bin":1},{"icon":"🍞","label":"Sharing your food","bin":0},{"icon":"🗑️","label":"Throwing good food away","bin":1}],"wrong":"m19-sort-no"}}
    ]
  },
  {
    id: "m20", icon: "🐄", title: "The Golden Calf", source: "20:83-97", more: ["7:148-151"],
    parent: [
      "Verses 20:83–97 and 7:148–151. In Musa's absence the Samiri led the people astray. They had thrown the jewellery they carried into the fire and he brought out a calf that made a lowing sound; it gave them no answer and had no power to harm or benefit them. Harun told them it was a test and that their Lord is the Lord of Mercy; they refused to stop until Musa returned. Musa came back angry and grieved, threw down the Tablets and seized his brother by the hair and beard; Harun said the people had overpowered him and almost killed him. Musa prayed for forgiveness for himself and his brother, told the Samiri to go away, and said the calf would be ground down and scattered in the sea. The people later regretted what they had done (7:149).",
      "The game says Musa 'put down' the Tablets and 'took hold of' his brother, and that the people 'would not listen' to Harun.",
      "From Ibn Kathir's tafsir (abridged English): Mujahid said the calf's sound came from the wind blowing through it; Ibn Abbas, by way of Ibn Ishaq, said the Samiri came from a people who worshipped cows. What the Samiri says he 'saw' and took a handful of (20:96) is explained in that tafsir as the track of the angel Jibril's horse; the game leaves it out."
    ],
    steps: [
      {"say":"m20-a","scene":"camp","amb":"fire","e":"🔥 💍 🐄"},
      {"say":"m20-b","scene":"camp","src":"From Ibn Kathir's commentary","e":"🐄 🙇🏿"},
      {"say":"m20-c","scene":"camp","e":"🐄 🚫"},
      {"play":"choice","line":"m20-q","scene":"camp","opts":{"options":[{"label":"No. It was only gold","icon":"🚫","ok":true},{"label":"Yes, it could","icon":"🐄","ok":false}],"wrong":"m20-q-no","img":"m20-c"}},
      {"play":"sort","line":"m20-sort","scene":"camp","opts":{"bins":[{"label":"Only Allah","icon":"✨"},{"label":"The golden calf","icon":"🐄"}],"things":[{"icon":"🌍","label":"Made the earth and the sky","bin":0},{"icon":"🔨","label":"Was made by a man's hands","bin":1},{"icon":"👂🏿","label":"Hears every prayer","bin":0},{"icon":"🤐","label":"Cannot say a single word","bin":1},{"icon":"🍎","label":"Gives us our food and water","bin":0}],"wrong":"m20-sort-no"}},
      {"say":"m20-d","scene":"camp","e":"🧔🏿 ✋🏿 🐄"},
      {"say":"m20-e","scene":"camp","e":"🧔🏿 😠 📜"},
      {"say":"m20-f","scene":"sea","e":"🐄 💨 🌊"},
      {"play":"wipe","line":"m20-grind","scene":"camp","opts":{"cover":"gold","img":"m20-f"}},
      {"say":"m20-g","scene":"camp","e":"🧔🏿 ☝🏿"},
      {"play":"order","line":"m20-ord","scene":"camp","opts":{"cards":[{"icon":"🔥","label":"Gold into the fire","line":"m20-ord-c1"},{"icon":"🐄","label":"The calf","line":"m20-ord-c2"},{"icon":"😠","label":"Musa comes back","line":"m20-ord-c3"},{"icon":"🌊","label":"Dust in the sea","line":"m20-ord-c4"}],"wrong":"m20-ord-no"}}
    ]
  },
  {
    id: "m21", icon: "🐮", title: "The Yellow Cow", source: "2:67-71", more: ["2:72-73"],
    parent: [
      "Verses 2:67–71. Musa told his people that Allah commands them to sacrifice a cow. They asked if he was mocking them, then asked what sort (neither old nor young, but in between), what colour (bright yellow, pleasing to the eye), and exactly which (unblemished, not trained to plough the earth or water the fields). They slaughtered it, 'though they almost failed to do so'.",
      "Left for parents: verses 2:72–73 give the reason. A person had been killed and the people were accusing one another; they were told to strike the body with part of the cow, and so Allah showed them how He gives life to the dead. The game tells only the cow and the questions."
    ],
    steps: [
      {"say":"m21-a","scene":"camp","e":"🧔🏿 💬 🐄"},
      {"say":"m21-b","scene":"field","e":"🐄 ❓"},
      {"say":"m21-c","scene":"field","e":"🐄 ✨"},
      {"say":"m21-d","scene":"field","pic":"m21-c","e":"🐄 🔍"},
      {"play":"pick","line":"m21-cow","scene":"field","opts":{"items":[{"icon":"🐄","n":1,"ok":true,"cls":"cow-yellow","name":"the yellow cow"},{"icon":"🐄","n":3,"ok":false,"name":"a spotted cow"},{"icon":"🐂","n":2,"ok":false,"name":"a brown ox"},{"icon":"🐃","n":2,"ok":false,"name":"a dark buffalo"}],"mark":"✨"}},
      {"say":"m21-e","scene":"field","e":"🐄 👍🏿"},
      {"play":"choice","line":"m21-q","scene":"field","opts":{"options":[{"label":"Asked more and more questions","icon":"❓","ok":false},{"label":"Done as they were told, straight away","icon":"👍🏿","ok":true}],"wrong":"m21-q-no","img":"m21-e"}},
      {"play":"order","line":"m21-ord","scene":"field","opts":{"cards":[{"icon":"🐄","label":"What kind of cow?","line":"m21-ord-c1"},{"icon":"🎨","label":"What colour?","line":"m21-ord-c2"},{"icon":"🔍","label":"Which one exactly?","line":"m21-ord-c3"}],"wrong":"m21-ord-no"}}
    ]
  },
  {
    id: "m22", icon: "🚪", title: "The Holy Land", source: "5:20-26", more: [],
    parent: [
      "Verses 5:20–26. Musa reminded his people of Allah's blessings and told them to enter the holy land Allah had ordained for them and not turn back. They said a fearsome people lived there and they would not enter until those people left. Two men whom Allah had blessed said: go in through the gate, and you will be victorious; put your trust in Allah. The people answered: 'You and your Lord go and fight; we will stay here.' Musa said he had authority over no one but himself and his brother. The land was forbidden to them for forty years, during which they would wander.",
      "The verses do not name the two men."
    ],
    steps: [
      {"say":"m22-a","scene":"desert","e":"🧔🏿 👉🏿 🏞️"},
      {"say":"m22-b","scene":"desert","e":"😨 🏰"},
      {"say":"m22-c","scene":"desert","e":"🧑🏿 🧑🏿 🚪"},
      {"play":"choice","line":"m22-q","scene":"desert","opts":{"options":[{"label":"Trust Allah, and go in","icon":"🚪","ok":true},{"label":"Run away and hide","icon":"🏃🏿","ok":false}],"wrong":"m22-q-no","img":"m22-c"}},
      {"say":"m22-d","scene":"desert","e":"🙅🏿 ⛺"},
      {"say":"m22-e","scene":"desert","e":"🚶🏿 🏜️ 🔄"},
      {"play":"trail","line":"m22-wander","scene":"desert","opts":{"n":8,"icon":"👣","walker":"🚶🏿","round":true}},
      {"play":"sort","line":"m22-sort","scene":"desert","opts":{"bins":[{"label":"Brave trust","icon":"🦁"},{"label":"Fearful excuse","icon":"🙈"}],"things":[{"icon":"🚪","label":"Go in through the gate!","bin":0},{"icon":"🪑","label":"We are staying right here","bin":1},{"icon":"💛","label":"Put your trust in Allah","bin":0},{"icon":"👉🏿","label":"You go. We will wait","bin":1}],"wrong":"m22-sort-no"}}
    ]
  },
  {
    id: "m23", icon: "🐟", title: "The Fish That Swam Away", source: "18:60-70", more: [],
    parent: [
      "Verses 18:60–70. Musa told his servant he would not stop until he reached the place where the two seas meet. There they forgot their fish, which made its way into the sea. Later, tired and asking for the meal, the servant remembered: he had forgotten the fish by the rock, and only Satan made him forget. Musa said that was the place they were seeking, and they retraced their steps. They found a servant of Allah who had been given mercy and knowledge. He warned Musa he would not be able to bear with him patiently; Musa promised patience; the condition was that Musa ask about nothing until he himself spoke of it.",
      "From a hadith of Ubayy bin Ka'b in al-Bukhari, as quoted in Ibn Kathir's tafsir (abridged English), not from the verses: Musa was asked who was the most learned of people and said 'I am', and was told of a servant who knew more; he was told to carry a fish in a basket and that he would find the man where he lost the fish; the servant boy was Yusha bin Nun; the water stood like an arch over the fish's path; and the man's name was al-Khidr."
    ],
    steps: [
      {"say":"m23-a","scene":"camp","src":"From a hadith in al-Bukhari","e":"🧔🏿 💬"},
      {"say":"m23-b","scene":"desert","e":"🧔🏿 👦🏿 🐟"},
      {"play":"journey","line":"m23-go","scene":"desert","opts":{"from":"⛺","to":"🌊","icon":"🚶🏿","steps":8}},
      {"say":"m23-c","scene":"sea","src":"From a hadith in al-Bukhari","cue":"splash","e":"🐟 💦 🌊"},
      {"play":"trail","line":"m23-fish","scene":"sea","opts":{"n":7,"icon":"💦","walker":"🐟"}},
      {"say":"m23-d","scene":"desert","e":"👦🏿 😮 🧺"},
      {"say":"m23-e","scene":"desert","e":"🧔🏿 👉🏿 👣"},
      {"play":"trail","line":"m23-back","scene":"desert","opts":{"n":7,"icon":"👣","walker":"🚶🏿"}},
      {"say":"m23-f","scene":"sea","src":"From a hadith in al-Bukhari","e":"👴🏿 ✨"},
      {"say":"m23-g","scene":"sea","e":"🧔🏿 🤝 👴🏿"},
      {"play":"choice","line":"m23-q","scene":"sea","opts":{"options":[{"label":"To ask lots of questions","icon":"❓","ok":false},{"label":"To be patient, and not to ask","icon":"🤐","ok":true}],"wrong":"m23-q-no","img":"m23-g"}}
    ]
  },
  {
    id: "m24", icon: "⛵", title: "Three Strange Things", source: "18:71-82", more: [],
    parent: [
      "Verses 18:71–82. In the boat the man made a hole in it, and Musa objected. Verse 18:74 then says they met a young boy and the man killed him, and Musa protested more strongly. The game does not tell this to small children: it says only that the second thing was about a boy and is 'a story for when you are older'. The explanation in 18:80–81 is that the boy's parents were people of faith, that he would have burdened them with wickedness and disbelief, and that their Lord would give them a better child in his place.",
      "The third: a town refused them food, and the man repaired a wall that was about to fall; Musa said he could have taken payment. The explanations: the boat belonged to needy people who worked at sea, and a king was seizing every sound boat by force; the wall belonged to two orphans, with a treasure beneath it, and their father had been righteous. 'I did not do these things of my own accord.'",
      "From the hadith in al-Bukhari quoted in Ibn Kathir's tafsir (abridged English), not the verses: the crew knew al-Khidr and carried them without a fare; the bird that dipped its beak in the sea and what al-Khidr said about knowledge; and the Prophet's ﷺ words, 'We wish that Musa had been patient, so that Allah would have told us more about the two of them.' The closing sentence about good hidden inside a thing that looks bad is the game's own summary of the lesson."
    ],
    steps: [
      {"say":"m24-a","scene":"sea","src":"From a hadith in al-Bukhari","e":"⛵ 🔨"},
      {"say":"m24-b","scene":"sea","e":"🧔🏿 😮 👴🏿"},
      {"say":"m24-c","scene":"sea","src":"From a hadith in al-Bukhari","e":"🐦 🌊"},
      {"play":"choice","line":"m24-q1","scene":"sea","opts":{"options":[{"label":"Like one little sip from the sea","icon":"🐦","ok":true},{"label":"Like the whole sea","icon":"🌊","ok":false}],"wrong":"m24-q1-no","img":"m24-c"}},
      {"say":"m24-d","scene":"city","e":"🧔🏿 😟 👴🏿"},
      {"say":"m24-e","scene":"city","e":"🧱 👴🏿"},
      {"play":"build","line":"m24-wall","scene":"city","opts":{"n":12,"icon":"🧱","cols":4}},
      {"say":"m24-f","scene":"city","e":"👴🏿 💬 🧔🏿"},
      {"say":"m24-g","scene":"sea","e":"⛵ 👑"},
      {"say":"m24-h","scene":"city","e":"🧱 💰 👦🏿"},
      {"play":"wipe","line":"m24-treasure","scene":"city","opts":{"cover":"sand","under":"💰"}},
      {"play":"match","line":"m24-match","scene":"city","opts":{"pairs":[{"a":"m24-match-a1","aIcon":"⛵","aLabel":"A hole in the boat","b":"m24-match-b1","bIcon":"👑","bLabel":"kept it safe from a greedy king"},{"a":"m24-match-a2","aIcon":"🧱","aLabel":"A mended wall","b":"m24-match-b2","bIcon":"💰","bLabel":"kept a treasure safe for two orphans"}]}},
      {"say":"m24-i","scene":"sea","src":"From a hadith in al-Bukhari","e":"🧔🏿 🌅"},
      {"play":"choice","line":"m24-q2","scene":"sea","opts":{"options":[{"label":"That he knew everything","icon":"🤓","ok":false},{"label":"Allah knows what we do not know","icon":"✨","ok":true}],"wrong":"m24-q2-no","img":"m24-i"}}
    ]
  },
  {
    id: "m25", icon: "📜", title: "Allah Was with Him", source: "28:43", more: ["20:46","26:62"],
    parent: [
      "Verse 28:43: Musa was given the Scripture, to give people insight, guidance and mercy, so that they might take heed. The chapter looks back over the whole story; 'I am with you both, hearing and seeing' is 20:46 and 'My Lord is with me: He will guide me' is 26:62.",
      "This game tells a large part of what the Qur'an says about Musa, not all of it: the story is spread over many surahs. A good next step with an older child is to read Surah Ta-Ha (20) and Surah Al-Qasas (28) together."
    ],
    steps: [
      {"say":"m25-a","scene":"river","pic":"m2-d","e":"🧺 🐑 STAFF"},
      {"say":"m25-b","scene":"sea","pic":"m16-e","e":"🧔🏿 ✨"},
      {"say":"m25-c","scene":"mountain","pic":"m19-e","e":"📜 ✨"},
      {"play":"order","line":"m25-ord","scene":"dawn","opts":{"cards":[{"icon":"🧺","label":"The baby on the river","line":"m25-ord-c1"},{"icon":"🐑","label":"The shepherd at the well","line":"m25-ord-c2"},{"icon":"🔥","label":"The fire on the mountain","line":"m25-ord-c3"},{"icon":"🌊","label":"The sea opens","line":"m25-ord-c4"},{"icon":"📜","label":"The Tablets","line":"m25-ord-c5"}],"wrong":"m25-ord-no"}},
      {"play":"match","line":"m25-match","scene":"dawn","opts":{"pairs":[{"a":"m25-match-a1","aIcon":"👸🏿","aLabel":"Asiya","b":"m25-match-b1","bIcon":"💛","bLabel":"the queen who loved baby Musa"},{"a":"m25-match-a2","aIcon":"🧕🏿","aLabel":"Musa's sister","b":"m25-match-b2","bIcon":"👣","bLabel":"followed the chest along the river"},{"a":"m25-match-a3","aIcon":"🤝","aLabel":"Harun","b":"m25-match-b3","bIcon":"🗣️","bLabel":"the brother who helped him speak"},{"a":"m25-match-a4","aIcon":"👑","aLabel":"Pharaoh","b":"m25-match-b4","bIcon":"🌊","bLabel":"the proud king, lost in the sea"}]}},
      {"play":"memory","line":"m25-mem","scene":"dawn","opts":{"icons":["🧺","🐑","🔥","STAFF","🐸","🌊","💧","📜"]}}
    ]
  }
];

/* Music for single lines; everything else uses its scene's music (sceneMood in game.js). */
window.STORY_MOODS = {"m1-b":"longing", "m1-c":"nile", "m2-a":"longing", "m2-d":"nile", "m3-c":"nile", "m4-a":"longing", "m4-e":"triumph", "m4-f":"triumph", "m5-a":"nile", "m6-b":"dread", "m6-c":"longing", "m6-d":"dread", "m6-e":"dread", "m7-a":"trek", "m7-e":"longing", "m8-b":"pastoral", "m8-e":"triumph", "m9-c":"awe", "m9-d":"awe", "m10-a":"awe", "m10-b":"awe", "m10-c":"awe", "m10-d":"dread", "m11-a":"longing", "m11-b":"awe", "m11-c":"awe", "m11-d":"triumph", "m11-e":"triumph", "m12-a":"court", "m12-b":"awe", "m12-c":"court", "m12-d":"court", "m12-e":"court", "m13-a":"court", "m13-b":"court", "m13-c":"dread", "m13-d":"longing", "m13-e":"awe", "m13-f":"triumph", "m14-a":"dread", "m14-b":"triumph", "m14-c":"court", "m14-d":"longing", "m14-e":"court", "m15-a":"dread", "m15-c":"dread", "m15-e":"dread", "m15-f":"longing", "m15-g":"court", "m16-a":"longing", "m16-b":"trek", "m16-c":"dread", "m16-d":"dread", "m16-e":"awe", "m17-a":"awe", "m17-b":"awe", "m17-c":"triumph", "m17-d":"triumph", "m17-e":"dread", "m17-f":"longing", "m17-g":"triumph", "m18-a":"trek", "m18-b":"triumph", "m18-c":"longing", "m18-d":"triumph", "m19-a":"trek", "m19-b":"awe", "m19-c":"awe", "m19-d":"awe", "m19-e":"triumph", "m20-a":"dread", "m20-b":"dread", "m20-c":"longing", "m20-d":"dread", "m20-e":"longing", "m20-f":"triumph", "m20-g":"awe", "m21-a":"pastoral", "m21-b":"pastoral", "m21-c":"pastoral", "m21-d":"pastoral", "m21-e":"pastoral", "m22-a":"trek", "m22-b":"dread", "m22-c":"triumph", "m22-d":"longing", "m22-e":"longing", "m23-a":"pastoral", "m23-b":"trek", "m23-d":"trek", "m23-e":"triumph", "m23-f":"awe", "m23-g":"pastoral", "m24-a":"dread", "m24-b":"pastoral", "m24-c":"awe", "m24-d":"longing", "m24-e":"pastoral", "m24-f":"awe", "m24-g":"triumph", "m24-h":"triumph", "m24-i":"awe", "m25-a":"nile", "m25-b":"awe", "m25-c":"triumph"};
