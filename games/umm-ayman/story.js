/*
  The Umm Ayman story: chapters -> steps. WRITTEN BY scripts/umm-ayman/author/build.js from the
  chapter files beside it. Change those, not this file.

  A step is { say, scene, pic?, src?, amb?, fx?, cue? } (a narrated picture) or
  { play, line, scene, opts } (something to do). See games/yusuf/story.js and
  shared/story-engine.js for what each field means. `more` lists the other passages
  a chapter draws on, beside its main `source`.
*/
window.STORY = [
  {
    id: "u1", icon: "⛵", title: "From Across the Sea", more: [], cite: "Ibn Shihab in Sahih Muslim (1771); Ibn Sa'd, al-Tabaqat",
    steps: [
      {"say":"u1-a","scene":"sea","e":"⛰️ 🌿 🌍"},
      {"say":"u1-b","scene":"sea","src":"From Ibn Shihab, in Sahih Muslim","e":"🧕🏿 ⛵ 🌊"},
      {"play":"journey","line":"u1-sail","scene":"sea","opts":{"from":"⛰️","to":"🏜️","icon":"⛵","steps":6,"img":"u1-b"}},
      {"say":"u1-c","scene":"city","src":"From Ibn Shihab, in Sahih Muslim","e":"🧕🏿 🏺 🏘️"},
      {"say":"u1-d","scene":"city","src":"From Ibn Sa'd's Tabaqat","e":"🧕🏿 🤲🏿 💧"},
      {"play":"choice","line":"u1-q","scene":"city","opts":{"options":[{"label":"From Abyssinia, across the sea","icon":"⛵","ok":true},{"label":"From the next street","icon":"🏘️","ok":false}],"wrong":"u1-q-no","img":"u1-c"}}
    ]
  },
  {
    id: "u2", icon: "🍼", title: "A Baby Is Born", more: [], cite: "Ibn Shihab in Sahih Muslim (1771); Ibn Sa'd, al-Tabaqat",
    steps: [
      {"say":"u2-a","scene":"night","e":"🌙 🍼 ✨"},
      {"say":"u2-b","scene":"dawn","src":"From Ibn Shihab, in Sahih Muslim","e":"🧕🏿 🍼 🌅"},
      {"play":"hold","line":"u2-rock","scene":"dawn","opts":{"ms":2500,"icon":"🌙","hint":"Press and hold","done":"Fast asleep","img":"u2-b"}},
      {"say":"u2-c","scene":"city","src":"From Ibn Sa'd's Tabaqat","e":"🐪 🐑 🧕🏿"},
      {"play":"count","line":"u2-camels","scene":"city","opts":{"total":5,"icon":"🐪","got":"✨","img":"u2-c"}},
      {"play":"choice","line":"u2-q","scene":"dawn","opts":{"options":[{"label":"Nobody at all","icon":"🚫","ok":false},{"label":"Barakah","icon":"🤲🏿","ok":true}],"wrong":"u2-q-no","img":"u2-b"}}
    ]
  },
  {
    id: "u3", icon: "🕊️", title: "A Month in Madina", more: [], cite: "Ibn Sa'd, al-Tabaqat (vol. 1)",
    steps: [
      {"say":"u3-a","scene":"desert","src":"From Ibn Sa'd's Tabaqat","e":"🐪 🐪 🏜️"},
      {"say":"u3-b","scene":"field","src":"From Ibn Sa'd's Tabaqat","e":"🌴 🏠 🥛"},
      {"say":"u3-c","scene":"field","src":"From Ibn Sa'd's Tabaqat","e":"🕊️ 💧 🌴"},
      {"play":"count","line":"u3-pigeons","scene":"field","opts":{"total":7,"icon":"🕊️","got":"✨","img":"u3-c"}},
      {"play":"memory","line":"u3-pairs","scene":"field","opts":{"icons":["🌴","🐪","🕊️","💧","🏠","🌙"],"img":"u3-b"}}
    ]
  },
  {
    id: "u4", icon: "🐪", title: "The Road Home", source: "93:6", more: [],
    steps: [
      {"say":"u4-a","scene":"dusk","src":"From Ibn Sa'd's Tabaqat","e":"⛺ 🌳 🌇"},
      {"say":"u4-b","scene":"dusk","src":"From Ibn Sa'd's Tabaqat","e":"🌳 🤲🏿 💧"},
      {"say":"u4-c","scene":"night","src":"From Ibn Sa'd's Tabaqat","e":"🌙 🐪 ⭐"},
      {"play":"journey","line":"u4-home","scene":"night","opts":{"from":"🌳","to":"🏠","icon":"🐪","steps":7,"img":"u4-c"}},
      {"say":"u4-d","scene":"dawn","e":"🌅 🐪 🏘️"},
      {"play":"choice","line":"u4-q","scene":"dawn","opts":{"options":[{"label":"Barakah, on the camels","icon":"🐪","ok":true},{"label":"He walked home alone","icon":"🚶🏿","ok":false}],"wrong":"u4-q-no","img":"u4-d"}}
    ]
  },
  {
    id: "u5", icon: "🌟", title: "O Blessed One", more: [], cite: "Ibn Sa'd, al-Tabaqat (vol. 1)",
    steps: [
      {"say":"u5-a","scene":"city","src":"From Ibn Sa'd's Tabaqat","e":"👴🏿 🏘️"},
      {"say":"u5-b","scene":"city","src":"From Ibn Sa'd's Tabaqat","e":"👴🏿 🧕🏿 🌟"},
      {"play":"choice","line":"u5-q","scene":"city","opts":{"options":[{"label":"O lazy one","icon":"😴","ok":false},{"label":"O blessed one","icon":"🌟","ok":true}],"wrong":"u5-q-no","img":"u5-b"}},
      {"say":"u5-c","scene":"dusk","src":"From Ibn Sa'd's Tabaqat","e":"🌇 💧"},
      {"say":"u5-d","scene":"city","src":"From Ibn Sa'd's Tabaqat","e":"🧔🏿 🏠 🤗"},
      {"play":"order","line":"u5-care","scene":"city","opts":{"cards":[{"icon":"🤱🏿","label":"His mother Amina","line":"u5-care-c1"},{"icon":"👴🏿","label":"His grandfather","line":"u5-care-c2"},{"icon":"🧔🏿","label":"His uncle Abu Talib","line":"u5-care-c3"}],"wrong":"u5-care-no","img":"u5-d"}}
    ]
  },
  {
    id: "u6", icon: "🏠", title: "Free, and a Family", more: [], cite: "Ibn Sa'd, al-Tabaqat (vol. 8); Ibn Shihab in Sahih Muslim (1771); al-Bukhari (3737)",
    steps: [
      {"say":"u6-a","scene":"city","src":"From Ibn Sa'd's Tabaqat","e":"🕊️ 🧕🏿 ☀️"},
      {"say":"u6-b","scene":"city","src":"From Ibn Sa'd's Tabaqat","e":"🧕🏿 👶🏿 😊"},
      {"say":"u6-c","scene":"city","src":"From Ibn Sa'd's Tabaqat","e":"🧕🏿 🥛 💛"},
      {"say":"u6-d","scene":"field","src":"From Ibn Sa'd's Tabaqat","e":"🌴 🌟"},
      {"say":"u6-e","scene":"city","src":"From Ibn Shihab, in Sahih Muslim","e":"🧔🏿 🧕🏿 👦🏿"},
      {"play":"match","line":"u6-names","scene":"city","opts":{"pairs":[{"a":"u6-names-a1","aIcon":"🌟","aLabel":"Barakah","b":"u6-names-b1","bIcon":"🎁","bLabel":"Blessing"},{"a":"u6-names-a2","aIcon":"👩🏿","aLabel":"Umm Ayman","b":"u6-names-b2","bIcon":"👶🏿","bLabel":"The mother of Ayman"},{"a":"u6-names-a3","aIcon":"👦🏿","aLabel":"Usamah","b":"u6-names-b3","bIcon":"👨🏿‍👩🏿‍👦🏿","bLabel":"Son of Zayd and Umm Ayman"}],"img":"u6-e"}}
    ]
  },
  {
    id: "u7", icon: "💧", title: "The Long Walk", more: [], cite: "Ibn Sa'd, al-Tabaqat (vols. 1 and 8)",
    steps: [
      {"say":"u7-a","scene":"night","e":"🌙 🐪 🏘️"},
      {"say":"u7-b","scene":"desert","src":"From Ibn Sa'd's Tabaqat","e":"🧕🏿 🏜️ ☀️"},
      {"say":"u7-c","scene":"desert","src":"From Ibn Sa'd's Tabaqat","e":"🧕🏿 🥵 🏜️"},
      {"play":"hold","line":"u7-patient","scene":"desert","opts":{"ms":3000,"icon":"🤲🏿","hint":"Press and hold","done":"Patient, like Umm Ayman","img":"u7-c"}},
      {"say":"u7-d","scene":"desert","src":"From Ibn Sa'd's Tabaqat","e":"🪣 💧 ☁️"},
      {"play":"catch","line":"u7-drops","scene":"desert","opts":{"target":8,"icon":"💧","into":"🪣","img":"u7-d"}},
      {"say":"u7-e","scene":"field","e":"🌴 🤗"}
    ]
  },
  {
    id: "u8", icon: "🫶", title: "Water for the Hurt", more: [], cite: "Ibn Sa'd, al-Tabaqat (vol. 8)",
    steps: [
      {"say":"u8-a","scene":"field","src":"From Ibn Sa'd's Tabaqat","e":"🧕🏿 💧 ⛰️"},
      {"say":"u8-b","scene":"desert","src":"From Ibn Sa'd's Tabaqat","e":"💧 🤲🏿 🩹"},
      {"play":"count","line":"u8-cups","scene":"desert","opts":{"total":6,"icon":"💧","got":"😊","img":"u8-b"}},
      {"say":"u8-c","scene":"field","src":"From Ibn Sa'd's Tabaqat","e":"⛺ 🌴 🩹"},
      {"play":"choice","line":"u8-q","scene":"field","opts":{"options":[{"label":"Water","icon":"💧","ok":true},{"label":"Toys","icon":"🧸","ok":false}],"wrong":"u8-q-no","img":"u8-c"}}
    ]
  },
  {
    id: "u9", icon: "🌴", title: "Ten Palm Trees", more: [], cite: "Anas in Sahih Muslim (1771, 2453) and al-Bukhari (2630); Ibn Sa'd, al-Tabaqat (vol. 8)",
    steps: [
      {"say":"u9-a","scene":"field","src":"From Anas, in Sahih Muslim","e":"🌴 🧕🏿"},
      {"say":"u9-b","scene":"field","src":"From Anas, in Sahih Muslim","e":"👦🏿 🌴 🧕🏿"},
      {"say":"u9-c","scene":"field","src":"From Anas, in Sahih Muslim","e":"🙅🏿 🌴"},
      {"say":"u9-d","scene":"field","src":"From Anas, in Sahih Muslim","e":"🌴 🌴 😄"},
      {"play":"count","line":"u9-palms","scene":"field","opts":{"total":10,"icon":"🌴","got":"✨","img":"u9-d"}},
      {"say":"u9-e","scene":"city","src":"From Ibn Sa'd's Tabaqat","e":"🐪 😄"},
      {"play":"choice","line":"u9-q","scene":"city","opts":{"options":[{"label":"A tiny baby camel","icon":"🍼","ok":false},{"label":"A big grown-up camel","icon":"🐪","ok":true}],"wrong":"u9-q-no","img":"u9-e"}}
    ]
  },
  {
    id: "u10", icon: "💐", title: "Fatimah's Wedding", more: [], cite: "Ibn Sa'd, al-Tabaqat (vol. 8)",
    steps: [
      {"say":"u10-a","scene":"city","src":"From Ibn Sa'd's Tabaqat","e":"🧕🏿 💐"},
      {"say":"u10-b","scene":"city","src":"From Ibn Sa'd's Tabaqat","e":"🌴 💧 🏺"},
      {"play":"sort","line":"u10-pack","scene":"city","opts":{"bins":[{"label":"In her home","icon":"🏠"},{"label":"Not there","icon":"🚫"}],"things":[{"icon":"🌴","label":"A bed of palm leaves","bin":0},{"icon":"👑","label":"A golden crown","bin":1},{"icon":"💧","label":"A waterskin","bin":0},{"icon":"🛋️","label":"A big silk sofa","bin":1},{"icon":"🏖️","label":"Soft sand on the floor","bin":0},{"icon":"💎","label":"A box of jewels","bin":1}],"wrong":"u10-pack-no","img":"u10-b"}},
      {"say":"u10-c","scene":"dusk","e":"🏠 🪔 💛"},
      {"play":"build","line":"u10-bricks","scene":"dusk","opts":{"n":6,"icon":"🧱","cols":3,"img":"u10-c"}}
    ]
  },
  {
    id: "u11", icon: "✨", title: "The News of Heaven", source: "3:144", more: [],
    steps: [
      {"say":"u11-a","scene":"city","src":"From Anas, in Sahih Muslim","e":"🧕🏿 🥛 🚪"},
      {"say":"u11-b","scene":"city","src":"From Anas, in Sahih Muslim","e":"🥛 ☝🏿 😄"},
      {"say":"u11-c","scene":"dusk","e":"🌇 🪔"},
      {"say":"u11-g","scene":"night","e":"⭐ 🌙 🌴"},
      {"say":"u11-d","scene":"city","src":"From Anas, in Sahih Muslim","e":"👴🏿 🧔🏿 🚪"},
      {"say":"u11-e","scene":"city","src":"From Anas, in Sahih Muslim","e":"🧕🏿 💧 ✨"},
      {"say":"u11-f","scene":"city","src":"From Anas, in Sahih Muslim","e":"🤲🏿 💧"},
      {"play":"choice","line":"u11-q","scene":"city","opts":{"options":[{"label":"The revelation had stopped","icon":"✨","ok":true},{"label":"She was hungry","icon":"🍞","ok":false}],"wrong":"u11-q-no","img":"u11-e"}},
      {"play":"order","line":"u11-story","scene":"city","opts":{"cards":[{"icon":"⛵","label":"From Abyssinia","line":"u11-story-c1"},{"icon":"🍼","label":"She cared for the baby","line":"u11-story-c2"},{"icon":"🐪","label":"She brought him home","line":"u11-story-c3"},{"icon":"🕊️","label":"Free, with a family","line":"u11-story-c4"},{"icon":"💧","label":"Water for the hurt","line":"u11-story-c5"},{"icon":"🌴","label":"Ten palm trees","line":"u11-story-c6"}],"wrong":"u11-story-no","img":"u11-f"}}
    ]
  }
];

/* Music for single lines; everything else uses its scene's music (sceneMood in game.js). */
window.STORY_MOODS = {"u1-a":"wonder", "u1-d":"sad", "u2-a":"wonder", "u3-c":"joy", "u4-a":"sad", "u4-b":"sad", "u4-c":"longing", "u4-d":"triumph", "u5-c":"sad", "u5-d":"joy", "u6-a":"triumph", "u6-b":"joy", "u6-d":"wonder", "u6-e":"joy", "u7-a":"tense", "u7-c":"longing", "u7-d":"wonder", "u7-e":"joy", "u9-d":"joy", "u9-e":"joy", "u10-a":"joy", "u10-c":"longing", "u11-b":"joy", "u11-c":"sad", "u11-g":"wonder", "u11-e":"sad", "u11-f":"longing"};
