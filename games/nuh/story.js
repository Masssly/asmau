/*
  The Nuh story: chapters -> steps. WRITTEN BY scripts/nuh/author/build.js from the
  chapter files beside it. Change those, not this file.

  A step is { say, scene, pic?, src?, amb?, fx?, cue? } (a narrated picture) or
  { play, line, scene, opts } (something to do). See games/yusuf/story.js and
  shared/story-engine.js for what each field means. `more` lists the other passages
  a chapter draws on, beside its main `source`.
*/
window.STORY = [
  {
    id: "n1", icon: "🗿", title: "Forgetting Allah", source: "71:23", more: [],
    steps: [
      {"say":"n1-a","scene":"village","src":"From Ibn Abbas, in al-Bukhari","e":"👴🏿 🌴 🤝"},
      {"say":"n1-b","scene":"village","src":"From Ibn Abbas, in al-Bukhari","e":"🗿 🔨"},
      {"say":"n1-c","scene":"dusk","src":"From Ibn Abbas, in al-Bukhari","e":"🗿 🌆"},
      {"say":"n1-d","scene":"dusk","e":"🙇🏿 🗿"},
      {"play":"sort","line":"n1-made","scene":"village","opts":{"bins":[{"label":"Allah made it","icon":"✨"},{"label":"People made it","icon":"🔨"}],"things":[{"icon":"☀️","label":"The sun","bin":0},{"icon":"🗿","label":"A statue","bin":1},{"icon":"🌳","label":"A tree","bin":0},{"icon":"🏠","label":"A house","bin":1},{"icon":"🌧️","label":"The rain","bin":0},{"icon":"🪑","label":"A chair","bin":1}],"wrong":"n1-made-no","img":"n1-a"}},
      {"play":"choice","line":"n1-q","scene":"dusk","opts":{"options":[{"label":"No, only Allah can","icon":"✨","ok":true},{"label":"Yes, it can","icon":"🗿","ok":false}],"wrong":"n1-q-no","img":"n1-d"}}
    ]
  },
  {
    id: "n2", icon: "🌟", title: "Nuh Is Sent", source: "71:1-4", more: ["11:25-26","29:14"],
    steps: [
      {"say":"n2-a","scene":"dawn","e":"🧔🏿 🌅"},
      {"say":"n2-b","scene":"village","e":"🧔🏿 🗣️ 👥"},
      {"play":"choice","line":"n2-q","scene":"village","opts":{"options":[{"label":"Worship the statues","icon":"🗿","ok":false},{"label":"Worship Allah alone","icon":"✨","ok":true}],"wrong":"n2-q-no","img":"n2-b"}},
      {"say":"n2-c","scene":"field","e":"🧔🏿 🛤️ ⭐"},
      {"play":"count","line":"n2-years","scene":"field","opts":{"total":9,"icon":"⭐","got":"🌟","img":"n2-c"}}
    ]
  },
  {
    id: "n3", icon: "🌙", title: "Night and Day", source: "71:5-9", more: [],
    steps: [
      {"say":"n3-a","scene":"field","e":"☀️ 🧔🏿 🌾"},
      {"say":"n3-b","scene":"night","e":"🌙 🧔🏿 🏠"},
      {"say":"n3-c","scene":"village","e":"🧔🏿 🤫 👥"},
      {"play":"sort","line":"n3-when","scene":"night","opts":{"bins":[{"label":"Day","icon":"☀️"},{"label":"Night","icon":"🌙"}],"things":[{"icon":"☀️","label":"The sun is shining","bin":0},{"icon":"🌙","label":"The moon is out","bin":1},{"icon":"🐓","label":"The rooster crows","bin":0},{"icon":"🦉","label":"The owl hoots","bin":1},{"icon":"⭐","label":"The stars twinkle","bin":1},{"icon":"🌻","label":"The flowers open","bin":0}],"wrong":"n3-when-no","img":"n3-b"}},
      {"say":"n3-d","scene":"village","e":"🙉 🧔🏿"},
      {"play":"choice","line":"n3-q","scene":"village","opts":{"options":[{"label":"Put their fingers in their ears","icon":"🙉","ok":true},{"label":"Listened carefully","icon":"👂🏿","ok":false}],"wrong":"n3-q-no","img":"n3-d"}}
    ]
  },
  {
    id: "n4", icon: "🌧️", title: "Look at Allah's World", source: "71:10-20", more: [],
    steps: [
      {"say":"n4-a","scene":"field","e":"🌧️ 🌾"},
      {"play":"count","line":"n4-rain","scene":"field","opts":{"total":6,"icon":"☁️","got":"🌧️","img":"n4-a"}},
      {"say":"n4-b","scene":"field","e":"👪 🌳 🏞️"},
      {"say":"n4-c","scene":"night","e":"🌙 ☀️ ⭐"},
      {"say":"n4-d","scene":"dawn","e":"🌱 🛤️ 🌍"},
      {"play":"match","line":"n4-gifts","scene":"dawn","opts":{"pairs":[{"a":"n4-gifts-a1","aIcon":"🌧️","aLabel":"Rain","b":"n4-gifts-b1","bIcon":"🌱","bLabel":"Plants that grow"},{"a":"n4-gifts-a2","aIcon":"☀️","aLabel":"The sun","b":"n4-gifts-b2","bIcon":"🔥","bLabel":"Light and warmth"},{"a":"n4-gifts-a3","aIcon":"🌙","aLabel":"The moon","b":"n4-gifts-b3","bIcon":"🌃","bLabel":"Light at night"},{"a":"n4-gifts-a4","aIcon":"🏞️","aLabel":"Rivers","b":"n4-gifts-b4","bIcon":"💧","bLabel":"Water to drink"}],"img":"n4-d"}}
    ]
  },
  {
    id: "n5", icon: "🤗", title: "Everyone Is Welcome", source: "11:27-31", more: [],
    steps: [
      {"say":"n5-a","scene":"village","e":"😤 🧔🏿"},
      {"say":"n5-b","scene":"village","e":"🧔🏿 🤗 👥"},
      {"say":"n5-c","scene":"village","e":"🧔🏿 🤲🏿"},
      {"play":"sort","line":"n5-welcome","scene":"village","opts":{"bins":[{"label":"Welcoming","icon":"🤗"},{"label":"Not welcoming","icon":"🚫"}],"things":[{"icon":"🤝","label":"Playing with the new child","bin":0},{"icon":"🙅🏿","label":"Saying: you can't play with us","bin":1},{"icon":"🍞","label":"Sharing your food","bin":0},{"icon":"😒","label":"Laughing at someone's clothes","bin":1},{"icon":"👋","label":"Saying salam to everyone","bin":0},{"icon":"🤫","label":"Whispering about someone","bin":1}],"wrong":"n5-welcome-no","img":"n5-b"}},
      {"play":"choice","line":"n5-q","scene":"village","opts":{"options":[{"label":"Go away","icon":"🚫","ok":false},{"label":"I will never send them away","icon":"🤗","ok":true}],"wrong":"n5-q-no","img":"n5-b"}}
    ]
  },
  {
    id: "n6", icon: "🪵", title: "Build the Ark", source: "11:36-37", more: ["23:27","54:13"],
    steps: [
      {"say":"n6-a","scene":"dusk","e":"🧔🏿 🌆"},
      {"say":"n6-b","scene":"dawn","e":"🧔🏿 🪵 🌅"},
      {"say":"n6-c","scene":"field","src":"From Ibn Kathir's commentary","e":"🪚 🪵"},
      {"play":"build","line":"n6-planks","scene":"field","opts":{"n":8,"icon":"🪵","cols":4,"img":"n6-c"}},
      {"say":"n6-d","scene":"field","e":"🔨 🔩"},
      {"play":"count","line":"n6-nails","scene":"field","opts":{"total":8,"icon":"🔩","got":"🔨","img":"n6-d"}}
    ]
  },
  {
    id: "n7", icon: "😏", title: "They Laughed", source: "11:38-39", more: [],
    steps: [
      {"say":"n7-a","scene":"field","e":"😆 🚢"},
      {"say":"n7-b","scene":"field","e":"🧔🏿 🔨 🚢"},
      {"play":"choice","line":"n7-q","scene":"field","opts":{"options":[{"label":"Kept on building","icon":"🔨","ok":true},{"label":"Gave up","icon":"😞","ok":false}],"wrong":"n7-q-no","img":"n7-b"}},
      {"say":"n7-c","scene":"dusk","e":"🚢 🌅"},
      {"play":"hold","line":"n7-patient","scene":"dusk","opts":{"ms":3000,"icon":"🔨","hint":"Press and hold","done":"Patient, like Nuh","img":"n7-c"}}
    ]
  },
  {
    id: "n8", icon: "🐘", title: "Two by Two", source: "11:40", more: ["23:27","54:11-12"],
    steps: [
      {"say":"n8-a","scene":"storm","src":"From Ibn Kathir's commentary","e":"💧 ⛲"},
      {"say":"n8-b","scene":"storm","e":"🌧️ 🏠"},
      {"say":"n8-c","scene":"field","e":"🐘 🐪 🦒"},
      {"play":"memory","line":"n8-pairs","scene":"field","opts":{"icons":["🐘","🐪","🦒","🐑","🦁","🐦"]}},
      {"play":"journey","line":"n8-board","scene":"field","opts":{"from":"🌾","to":"🚢","icon":"🐘","steps":6,"img":"n8-c"}},
      {"say":"n8-d","scene":"field","src":"Told in Sunni and Shia narrations","e":"👥 🚢"}
    ]
  },
  {
    id: "n9", icon: "🤲", title: "Bismillah", source: "11:41", more: ["23:28-29"],
    steps: [
      {"say":"n9-a","scene":"storm","e":"🧔🏿 🚢 🌧️"},
      {"say":"n9-b","scene":"storm","e":"🤲🏿 🪔"},
      {"play":"choice","line":"n9-q","scene":"storm","opts":{"options":[{"label":"Nothing at all","icon":"🤐","ok":false},{"label":"Bismillah","icon":"🤲🏿","ok":true}],"wrong":"n9-q-no","img":"n9-b"}},
      {"say":"n9-c","scene":"storm","e":"🤲🏿 🪔 👥"},
      {"play":"order","line":"n9-dua","scene":"storm","opts":{"cards":[{"icon":"🤲🏿","label":"Praise be to Allah","line":"n9-dua-c1"},{"icon":"🛟","label":"who saved us","line":"n9-dua-c2"},{"icon":"🙏","label":"My Lord, let me land","line":"n9-dua-c3"},{"icon":"✨","label":"in a blessed place","line":"n9-dua-c4"}],"wrong":"n9-dua-no","img":"n9-c"}}
    ]
  },
  {
    id: "n10", icon: "🌊", title: "The Big Waves", source: "11:42-47", more: [],
    steps: [
      {"say":"n10-a","scene":"storm","e":"🚢 🌊"},
      {"play":"hold","line":"n10-steady","scene":"storm","opts":{"ms":2500,"icon":"🚢","hint":"Press and hold","done":"Safe in the Ark","img":"n10-a"}},
      {"say":"n10-b","scene":"storm","e":"🧔🏿 🌊 ⛰️"},
      {"say":"n10-c","scene":"storm","e":"🧗 ⛰️"},
      {"say":"n10-d","scene":"grey","e":"🌊 🌊"},
      {"play":"choice","line":"n10-q","scene":"grey","opts":{"options":[{"label":"Allah","icon":"✨","ok":true},{"label":"A high mountain","icon":"⛰️","ok":false}],"wrong":"n10-q-no","img":"n10-d"}},
      {"say":"n10-e","scene":"grey","e":"🧔🏿 🤲🏿 🌧️"},
      {"say":"n10-f","scene":"grey","e":"🧔🏿 🙇🏿"}
    ]
  },
  {
    id: "n11", icon: "⛰️", title: "The Humble Mountain", source: "11:44", more: ["11:48","17:3","71:28"],
    steps: [
      {"say":"n11-a","scene":"dawn","e":"🌤️ 🚢"},
      {"play":"wipe","line":"n11-dry","scene":"dawn","opts":{"cover":"water","img":"n11-a"}},
      {"say":"n11-b","scene":"mountain","e":"🚢 ⛰️"},
      {"say":"n11-c","scene":"mountain","src":"Told in Sunni and Shia narrations","e":"⛰️ 🙇🏿"},
      {"play":"choice","line":"n11-q","scene":"mountain","opts":{"options":[{"label":"It was the tallest","icon":"🗻","ok":false},{"label":"It was humble","icon":"🙇🏿","ok":true}],"wrong":"n11-q-no","img":"n11-c"}},
      {"say":"n11-d","scene":"mountain","e":"🧔🏿 👥 🐑"},
      {"say":"n11-e","scene":"dawn","e":"🧔🏿 🤲🏿 🌅"},
      {"say":"n11-f","scene":"dawn","e":"🏠 🧔🏿 👥"},
      {"play":"order","line":"n11-forgive","scene":"dawn","opts":{"cards":[{"icon":"🤲🏿","label":"My Lord, forgive me","line":"n11-forgive-c1"},{"icon":"👪","label":"and my parents","line":"n11-forgive-c2"},{"icon":"🏠","label":"and everyone in my house","line":"n11-forgive-c3"},{"icon":"🌍","label":"and all the believers","line":"n11-forgive-c4"}],"wrong":"n11-forgive-no","img":"n11-f"}},
      {"play":"order","line":"n11-story","scene":"dawn","opts":{"cards":[{"icon":"🗿","label":"People forgot Allah","line":"n11-story-c1"},{"icon":"🌟","label":"Nuh called them","line":"n11-story-c2"},{"icon":"🪵","label":"He built the Ark","line":"n11-story-c3"},{"icon":"🐘","label":"Two by two","line":"n11-story-c4"},{"icon":"🌊","label":"The big waves","line":"n11-story-c5"},{"icon":"⛰️","label":"Al-Judi","line":"n11-story-c6"}],"wrong":"n11-story-no","img":"n11-e"}}
    ]
  }
];

/* Music for single lines; everything else uses its scene's music (sceneMood in game.js). */
window.STORY_MOODS = {"n1-c":"longing", "n1-d":"tense", "n2-a":"awe", "n4-b":"joy", "n4-c":"wonder", "n5-a":"tense", "n6-a":"longing", "n6-b":"awe", "n7-a":"tense", "n7-c":"triumph", "n8-a":"tense", "n8-b":"tense", "n8-c":"joy", "n9-c":"wonder", "n10-a":"dread", "n10-b":"tense", "n10-d":"sad", "n10-e":"sad", "n10-f":"longing", "n11-a":"triumph", "n11-b":"wonder", "n11-d":"joy", "n11-e":"triumph"};
