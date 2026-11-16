/*
  The Ibn Battuta story: chapters -> steps. WRITTEN BY scripts/ibn-battuta/author/build.js from the
  chapter files beside it. Change those, not this file.

  A step is { say, scene, pic?, src?, amb?, fx?, cue? } (a narrated picture) or
  { play, line, scene, opts } (something to do). See games/yusuf/story.js and
  shared/story-engine.js for what each field means. `more` lists the other passages
  a chapter draws on, beside its main `source`.
*/
window.STORY = [
  {
    id: "i1", icon: "🧳", title: "Leaving Home", more: [], cite: "The Rihla, tr. Gibb, vol. I, pp. 7-8",
    steps: [
      {"say":"i1-a","scene":"city","e":"🏙️ 🌊 🌅"},
      {"say":"i1-b","scene":"dawn","src":"From his book, the Rihla","e":"🧔🏿 🌅 🧭"},
      {"say":"i1-c","scene":"city","src":"From his book, the Rihla","e":"👴🏿 👵 🧔🏿"},
      {"play":"sort","line":"i1-pack","scene":"city","opts":{"bins":[{"label":"Pack it","icon":"🎒"},{"label":"Leave it","icon":"🏠"}],"things":[{"icon":"💧","label":"A water skin","bin":0},{"icon":"🛏️","label":"A big bed","bin":1},{"icon":"🍞","label":"Bread and dates","bin":0},{"icon":"🧥","label":"A warm cloak","bin":0},{"icon":"🪑","label":"A heavy table","bin":1},{"icon":"📦","label":"A box of toys","bin":1}],"wrong":"i1-pack-no","img":"i1-c"}},
      {"say":"i1-d","scene":"desert","src":"From his book, the Rihla","e":"🐦 🪺 🛤️"},
      {"play":"choice","line":"i1-q","scene":"desert","opts":{"options":[{"label":"To go on Hajj to Makkah","icon":"🕋","ok":true},{"label":"To find treasure","icon":"💰","ok":false}],"wrong":"i1-q-no","img":"i1-d"}}
    ]
  },
  {
    id: "i2", icon: "🧓", title: "The Old Man of Alexandria", more: [], cite: "The Rihla, tr. Gibb, vol. I, pp. 18, 22-23",
    steps: [
      {"say":"i2-a","scene":"sea","src":"From his book, the Rihla","e":"🗼 ⛵ 🌊"},
      {"say":"i2-b","scene":"city","src":"From his book, the Rihla","e":"👴🏿 🧔🏿"},
      {"say":"i2-c","scene":"city","src":"From his book, the Rihla","e":"👴🏿 ☝🏿 🌏"},
      {"say":"i2-d","scene":"sea","src":"From his book, the Rihla","e":"⛵ 🌅"},
      {"play":"memory","line":"i2-lands","scene":"sea","opts":{"icons":["🐪","⛵","🕌","🌴","🐘","🏮"],"img":"i2-d"}},
      {"play":"choice","line":"i2-q","scene":"city","opts":{"options":[{"label":"Go straight back home","icon":"🏠","ok":false},{"label":"Greet his brothers far away","icon":"👋","ok":true}],"wrong":"i2-q-no","img":"i2-c"}}
    ]
  },
  {
    id: "i3", icon: "🍽️", title: "The Broken Dish", more: [], cite: "The Rihla, tr. Gibb, vol. I, p. 147",
    steps: [
      {"say":"i3-a","scene":"city","src":"From his book, the Rihla","e":"🏛️ ⛲"},
      {"say":"i3-b","scene":"city","src":"From his book, the Rihla","e":"👦🏿 🍽️ 💥"},
      {"say":"i3-c","scene":"city","src":"From his book, the Rihla","e":"👥 👉🏿"},
      {"say":"i3-d","scene":"city","src":"From his book, the Rihla","e":"👴🏿 🪙 😊"},
      {"play":"puzzle","line":"i3-mend","scene":"city","opts":{"pic":"i3-d","n":2}},
      {"say":"i3-e","scene":"city","src":"From his book, the Rihla","e":"🧔🏿 📖 💛"},
      {"play":"sort","line":"i3-hearts","scene":"city","opts":{"bins":[{"label":"Mends a heart","icon":"💛"},{"label":"Breaks a heart","icon":"💔"}],"things":[{"icon":"🤝","label":"Helping someone who dropped something","bin":0},{"icon":"😆","label":"Laughing at a mistake","bin":1},{"icon":"🍪","label":"Sharing your snack","bin":0},{"icon":"😠","label":"Shouting at someone","bin":1},{"icon":"🤗","label":"Saying: it's all right","bin":0},{"icon":"🗣️","label":"Telling everyone about it","bin":1}],"wrong":"i3-hearts-no","img":"i3-e"}}
    ]
  },
  {
    id: "i4", icon: "🕋", title: "Makkah", source: "22:27", more: [],
    steps: [
      {"say":"i4-a","scene":"desert","src":"From his book, the Rihla","e":"🐪 🐪 🏜️"},
      {"say":"i4-b","scene":"city","e":"🕋 ⚪"},
      {"say":"i4-c","scene":"city","e":"⛰️ 🐪 🚶🏿"},
      {"play":"order","line":"i4-hajj","scene":"city","opts":{"cards":[{"icon":"⚪","label":"Put on simple white clothes","line":"i4-hajj-c1"},{"icon":"🕋","label":"Walk around the Ka'bah","line":"i4-hajj-c2"},{"icon":"⛰️","label":"Pray at Arafat","line":"i4-hajj-c3"},{"icon":"🐑","label":"Celebrate Eid","line":"i4-hajj-c4"}],"wrong":"i4-hajj-no","img":"i4-c"}},
      {"say":"i4-d","scene":"dawn","src":"From his book, the Rihla","e":"🧔🏿 🛤️ 🌅"},
      {"play":"choice","line":"i4-q","scene":"city","opts":{"options":[{"label":"Simple white clothes","icon":"⚪","ok":true},{"label":"Party costumes","icon":"🎭","ok":false}],"wrong":"i4-q-no","img":"i4-b"}}
    ]
  },
  {
    id: "i5", icon: "🤝", title: "Brothers Who Welcome Strangers", more: [], cite: "The Rihla, tr. Gibb, vol. II, pp. 417-419",
    steps: [
      {"say":"i5-a","scene":"village","src":"From his book, the Rihla","e":"🤝 🏘️"},
      {"say":"i5-b","scene":"village","src":"From his book, the Rihla","e":"🪙 🧺 🍞"},
      {"say":"i5-c","scene":"village","src":"From his book, the Rihla","e":"🍲 😊"},
      {"play":"count","line":"i5-bowls","scene":"village","opts":{"total":6,"icon":"🍲","got":"😊","img":"i5-c"}},
      {"play":"choice","line":"i5-q","scene":"village","opts":{"options":[{"label":"Sent them away","icon":"🚫","ok":false},{"label":"Gave them food and a place to stay","icon":"🍲","ok":true}],"wrong":"i5-q-no","img":"i5-b"}}
    ]
  },
  {
    id: "i6", icon: "⚖️", title: "A Judge in Delhi", more: [], cite: "The Rihla, tr. Gibb, vol. III, pp. 746-747",
    steps: [
      {"say":"i6-a","scene":"palace","src":"From his book, the Rihla","e":"🏰 🐘"},
      {"say":"i6-b","scene":"palace","src":"From his book, the Rihla","e":"👑 🧔🏿"},
      {"say":"i6-c","scene":"palace","src":"From his book, the Rihla","e":"⚖️ 📖"},
      {"play":"sort","line":"i6-fair","scene":"palace","opts":{"bins":[{"label":"Fair","icon":"⚖️"},{"label":"Not fair","icon":"🙅🏿"}],"things":[{"icon":"👂🏿","label":"Listening to both sides","bin":0},{"icon":"🎁","label":"Taking a present to help one side","bin":1},{"icon":"🤲🏿","label":"The same rules for rich and poor","bin":0},{"icon":"😤","label":"Deciding before listening","bin":1},{"icon":"✅","label":"Telling the truth","bin":0},{"icon":"👯","label":"Helping only your friends","bin":1}],"wrong":"i6-fair-no","img":"i6-c"}}
    ]
  },
  {
    id: "i7", icon: "🏝️", title: "Two Thousand Islands", more: [], cite: "The Rihla, tr. Gibb and Beckingham, vol. IV, pp. 821-822",
    steps: [
      {"say":"i7-a","scene":"sea","src":"From his book, the Rihla","e":"🏝️ 🏝️ 🌊"},
      {"say":"i7-b","scene":"sea","src":"From his book, the Rihla","e":"🏝️ 🤗"},
      {"say":"i7-c","scene":"field","src":"From his book, the Rihla","e":"🥥 🐟"},
      {"play":"catch","line":"i7-coconuts","scene":"field","opts":{"target":8,"icon":"🥥","into":"🧺","img":"i7-c"}},
      {"say":"i7-d","scene":"sea","src":"From his book, the Rihla","e":"🌴 🌅"},
      {"play":"choice","line":"i7-q","scene":"field","opts":{"options":[{"label":"Coconut palms","icon":"🌴","ok":true},{"label":"Apple trees","icon":"🍎","ok":false}],"wrong":"i7-q-no","img":"i7-c"}}
    ]
  },
  {
    id: "i8", icon: "🥭", title: "The Kind Sultan of Sumatra", more: [], cite: "The Rihla, tr. Gibb and Beckingham, vol. IV, pp. 875-877",
    steps: [
      {"say":"i8-a","scene":"sea","src":"From his book, the Rihla","e":"⛵ 🏝️"},
      {"say":"i8-b","scene":"sea","src":"From his book, the Rihla","e":"🛶 🍌 🥭"},
      {"play":"memory","line":"i8-gifts","scene":"sea","opts":{"icons":["🥥","🍌","🥭","🐟","⛵","🌴"],"img":"i8-b"}},
      {"say":"i8-c","scene":"palace","src":"From his book, the Rihla","e":"👑 📖"},
      {"say":"i8-d","scene":"city","src":"From his book, the Rihla","e":"🚶🏿 🕌"},
      {"play":"choice","line":"i8-q","scene":"city","opts":{"options":[{"label":"On a golden throne","icon":"👑","ok":false},{"label":"He walked, like everyone","icon":"🚶🏿","ok":true}],"wrong":"i8-q-no","img":"i8-d"}}
    ]
  },
  {
    id: "i9", icon: "🏮", title: "China", more: [], cite: "The Rihla, tr. Gibb and Beckingham, vol. IV, pp. 889-892",
    steps: [
      {"say":"i9-a","scene":"sea","src":"From his book, the Rihla","e":"⛵ 🏮"},
      {"say":"i9-b","scene":"city","src":"From his book, the Rihla","e":"📜 💰"},
      {"play":"count","line":"i9-notes","scene":"city","opts":{"total":5,"icon":"📜","got":"✅","img":"i9-b"}},
      {"say":"i9-c","scene":"city","src":"From his book, the Rihla","e":"🏺 🎨"},
      {"say":"i9-d","scene":"night","src":"From his book, the Rihla","e":"🏮 🌙"},
      {"play":"choice","line":"i9-q","scene":"city","opts":{"options":[{"label":"Paper","icon":"📜","ok":true},{"label":"Chocolate","icon":"🍫","ok":false}],"wrong":"i9-q-no","img":"i9-b"}}
    ]
  },
  {
    id: "i10", icon: "🏡", title: "Home Again", more: [], cite: "The Rihla, tr. Gibb and Beckingham, vol. IV, pp. 920-925",
    steps: [
      {"say":"i10-a","scene":"sea","src":"From his book, the Rihla","e":"⛵ 🌅"},
      {"say":"i10-b","scene":"dusk","src":"From his book, the Rihla","e":"🤲🏿 🌇"},
      {"play":"hold","line":"i10-dua","scene":"dusk","opts":{"ms":2500,"icon":"🤲🏿","hint":"Press and hold","done":"May Allah have mercy on her","img":"i10-b"}},
      {"say":"i10-c","scene":"city","src":"From his book, the Rihla","e":"🕌 🚪"},
      {"play":"order","line":"i10-way","scene":"city","opts":{"cards":[{"icon":"🏮","label":"China","line":"i10-way-c1"},{"icon":"🐘","label":"India","line":"i10-way-c2"},{"icon":"🕋","label":"Makkah","line":"i10-way-c3"},{"icon":"🏡","label":"Morocco","line":"i10-way-c4"}],"wrong":"i10-way-no","img":"i10-c"}}
    ]
  },
  {
    id: "i11", icon: "📖", title: "Mali, and the Book", more: [], cite: "The Rihla, tr. Gibb and Beckingham, vol. IV, pp. 964-966; Ibn Juzayy's introduction, vol. I",
    steps: [
      {"say":"i11-a","scene":"desert","src":"From his book, the Rihla","e":"🐪 🏜️"},
      {"play":"journey","line":"i11-sahara","scene":"desert","opts":{"from":"🏜️","to":"🕌","icon":"🐪","steps":7,"img":"i11-a"}},
      {"say":"i11-b","scene":"city","src":"From his book, the Rihla","e":"🏘️ 🐪"},
      {"say":"i11-c","scene":"city","src":"From his book, the Rihla","e":"🕌 ⚪"},
      {"say":"i11-d","scene":"city","src":"From his book, the Rihla","e":"📖 👦🏿"},
      {"say":"i11-e","scene":"palace","src":"From his book, the Rihla","e":"✍️ 📜"},
      {"play":"order","line":"i11-story","scene":"palace","opts":{"cards":[{"icon":"🧳","label":"Tangier","line":"i11-story-c1"},{"icon":"🕋","label":"Makkah","line":"i11-story-c2"},{"icon":"⚖️","label":"India","line":"i11-story-c3"},{"icon":"🏝️","label":"The islands","line":"i11-story-c4"},{"icon":"🏮","label":"China","line":"i11-story-c5"},{"icon":"🕌","label":"Mali","line":"i11-story-c6"}],"wrong":"i11-story-no","img":"i11-e"}}
    ]
  }
];

/* Music for single lines; everything else uses its scene's music (sceneMood in game.js). */
window.STORY_MOODS = {"i1-a":"wonder", "i1-c":"sad", "i1-d":"longing", "i2-a":"wonder", "i2-c":"awe", "i2-d":"wonder", "i3-b":"tense", "i3-d":"joy", "i4-a":"trek", "i4-b":"awe", "i4-c":"awe", "i4-d":"wonder", "i5-a":"joy", "i5-c":"joy", "i6-a":"awe", "i7-a":"wonder", "i7-b":"joy", "i7-d":"longing", "i8-a":"wonder", "i8-b":"joy", "i8-d":"joy", "i9-a":"wonder", "i9-b":"joy", "i9-d":"longing", "i10-a":"longing", "i10-b":"sad", "i11-a":"trek", "i11-c":"awe", "i11-e":"triumph"};
