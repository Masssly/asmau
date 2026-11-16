/*
  The Rahmah El Yunusiyyah story: chapters -> steps. WRITTEN BY scripts/rahmah/author/build.js from the
  chapter files beside it. Change those, not this file.

  A step is { say, scene, pic?, src?, amb?, fx?, cue? } (a narrated picture) or
  { play, line, scene, opts } (something to do). See games/yusuf/story.js and
  shared/story-engine.js for what each field means. `more` lists the other passages
  a chapter draws on, beside its main `source`.
*/
window.STORY = [
  {
    id: "r1", icon: "🏔️", title: "A Girl in the Mountains", more: [], cite: "Histories of her life (Audrey Kahin, Jeffrey Hadler and others; see the notes)",
    steps: [
      {"say":"r1-a","scene":"field","src":"From the histories of her life","e":"⛰️ 🌾 👶🏽"},
      {"say":"r1-b","scene":"village","src":"From the histories of her life","e":"👧 📖 ⭐"},
      {"say":"r1-c","scene":"village","e":"🏠 🐃 ⛰️"},
      {"play":"memory","line":"r1-home","scene":"village","opts":{"icons":["⛰️","🌾","🏠","🐃","🕌","🌧️"],"img":"r1-c"}},
      {"play":"choice","line":"r1-q","scene":"field","opts":{"options":[{"label":"In the mountains of Sumatra","icon":"⛰️","ok":true},{"label":"In a big desert","icon":"🏜️","ok":false}],"wrong":"r1-q-no","img":"r1-a"}}
    ]
  },
  {
    id: "r2", icon: "📖", title: "Learning to Read", more: [], cite: "Histories of her life (Audrey Kahin, Jeffrey Hadler and others; see the notes)",
    steps: [
      {"say":"r2-a","scene":"dusk","src":"From the histories of her life","e":"👧 💧 🌇"},
      {"say":"r2-b","scene":"village","src":"From the histories of her life","e":"👧 ✍️ 📖"},
      {"play":"count","line":"r2-books","scene":"village","opts":{"total":6,"icon":"📖","got":"✨","img":"r2-b"}},
      {"say":"r2-c","scene":"village","src":"From the histories of her life","e":"👶🏽 🤲🏽"},
      {"play":"choice","line":"r2-q","scene":"village","opts":{"options":[{"label":"Nobody at all","icon":"🚫","ok":false},{"label":"Her father's students","icon":"📖","ok":true}],"wrong":"r2-q-no","img":"r2-b"}}
    ]
  },
  {
    id: "r3", icon: "🌙", title: "No More School", more: [], cite: "Histories of her life (Audrey Kahin, Jeffrey Hadler and others; see the notes)",
    steps: [
      {"say":"r3-a","scene":"village","src":"From the histories of her life","e":"👧 🏫 🌧️"},
      {"say":"r3-b","scene":"night","src":"From the histories of her life","e":"🌙 🧕🏽 📖"},
      {"play":"hold","line":"r3-learn","scene":"night","opts":{"ms":2500,"icon":"📚","hint":"Press and hold","done":"Never stop learning","img":"r3-b"}},
      {"say":"r3-c","scene":"dawn","src":"From the histories of her life","e":"🌅 🏫"},
      {"play":"choice","line":"r3-q","scene":"night","opts":{"options":[{"label":"She kept learning","icon":"📚","ok":true},{"label":"She stopped learning","icon":"😴","ok":false}],"wrong":"r3-q-no","img":"r3-b"}}
    ]
  },
  {
    id: "r4", icon: "🏫", title: "Back to School", more: [], cite: "Histories of her life (Audrey Kahin, Jeffrey Hadler and others; see the notes)",
    steps: [
      {"say":"r4-a","scene":"village","src":"From the histories of her life","e":"🏫 🧔🏽"},
      {"say":"r4-b","scene":"village","src":"From the histories of her life","e":"🧕🏽 🧕🏽 📖"},
      {"play":"count","line":"r4-girls","scene":"village","opts":{"total":7,"icon":"🧕🏽","got":"✨","img":"r4-b"}},
      {"say":"r4-c","scene":"field","src":"From the histories of her life","e":"⛰️ 💭"},
      {"play":"choice","line":"r4-q","scene":"field","opts":{"options":[{"label":"No school at all","icon":"🚫","ok":false},{"label":"A school of their own","icon":"🏫","ok":true}],"wrong":"r4-q-no","img":"r4-c"}}
    ]
  },
  {
    id: "r5", icon: "🕌", title: "A School for Girls", more: [], cite: "Histories of her life (Audrey Kahin, Jeffrey Hadler and others; see the notes)",
    steps: [
      {"say":"r5-a","scene":"city","src":"From the histories of her life","e":"🕌 🏫 ✨"},
      {"say":"r5-b","scene":"city","src":"From the histories of her life","e":"🕌 📖"},
      {"say":"r5-c","scene":"city","src":"From the histories of her life","e":"🧕🏽 👶🏽 📝"},
      {"play":"sort","line":"r5-lessons","scene":"city","opts":{"bins":[{"label":"They learned it","icon":"✅"},{"label":"Not on the list","icon":"❌"}],"things":[{"icon":"📖","label":"The Qur'an and Islam","bin":0},{"icon":"🎮","label":"Video games","bin":1},{"icon":"🔤","label":"Arabic","bin":0},{"icon":"🧵","label":"Sewing and crafts","bin":0},{"icon":"🎩","label":"Magic tricks","bin":1},{"icon":"🛹","label":"Skateboarding","bin":1}],"wrong":"r5-lessons-no","img":"r5-b"}},
      {"play":"choice","line":"r5-q","scene":"city","opts":{"options":[{"label":"In a mosque","icon":"🕌","ok":true},{"label":"In a palace","icon":"🏰","ok":false}],"wrong":"r5-q-no","img":"r5-b"}}
    ]
  },
  {
    id: "r6", icon: "💪", title: "Not Everyone Agreed", more: [], cite: "Histories of her life (Audrey Kahin, Jeffrey Hadler and others; see the notes)",
    steps: [
      {"say":"r6-a","scene":"city","src":"From the histories of her life","e":"😠 🧕🏽"},
      {"say":"r6-b","scene":"city","src":"From the histories of her life","e":"🧕🏽 👴🏽 🤝"},
      {"say":"r6-c","scene":"dusk","src":"From the histories of her life","e":"🪔 💪🏽"},
      {"play":"sort","line":"r6-going","scene":"dusk","opts":{"bins":[{"label":"Keep going","icon":"💪🏽"},{"label":"Give up","icon":"🏳️"}],"things":[{"icon":"🔁","label":"Try again tomorrow","bin":0},{"icon":"😤","label":"Throw it away","bin":1},{"icon":"🙋","label":"Ask for help","bin":0},{"icon":"🐢","label":"Go slowly but steadily","bin":0},{"icon":"🛑","label":"Stop at the first mistake","bin":1},{"icon":"😩","label":"Say: I can't do it","bin":1}],"wrong":"r6-going-no","img":"r6-c"}},
      {"play":"choice","line":"r6-q","scene":"dusk","opts":{"options":[{"label":"She gave up","icon":"🏳️","ok":false},{"label":"She kept going","icon":"💪🏽","ok":true}],"wrong":"r6-q-no","img":"r6-c"}}
    ]
  },
  {
    id: "r7", icon: "🏚️", title: "The Earthquake", more: [], cite: "Histories of her life (Audrey Kahin, Jeffrey Hadler and others; see the notes)",
    steps: [
      {"say":"r7-a","scene":"city","src":"From the histories of her life","e":"🏚️ ⛰️"},
      {"say":"r7-b","scene":"field","src":"From the histories of her life","e":"🛖 📖"},
      {"say":"r7-c","scene":"sea","src":"From the histories of her life","e":"⛵ 🏝️"},
      {"play":"journey","line":"r7-travel","scene":"sea","opts":{"from":"🏚️","to":"🏫","icon":"⛵","steps":6,"img":"r7-c"}},
      {"say":"r7-d","scene":"city","src":"From the histories of her life","e":"🏫 🎉"},
      {"play":"build","line":"r7-bricks","scene":"city","opts":{"n":8,"icon":"🧱","cols":4,"img":"r7-d"}}
    ]
  },
  {
    id: "r8", icon: "🌱", title: "On Her Own Feet", more: [], cite: "Histories of her life (Audrey Kahin, Jeffrey Hadler and others; see the notes)",
    steps: [
      {"say":"r8-a","scene":"palace","src":"From the histories of her life","e":"🙅🏽 💰"},
      {"say":"r8-b","scene":"city","src":"From the histories of her life","e":"🏫 🧕🏽 🧕🏽"},
      {"say":"r8-c","scene":"city","src":"From the histories of her life","e":"🍎 🧕🏽"},
      {"play":"sort","line":"r8-teacher","scene":"city","opts":{"bins":[{"label":"A good teacher","icon":"🍎"},{"label":"Not a good teacher","icon":"🙅🏽"}],"things":[{"icon":"👂🏽","label":"Listens to every child","bin":0},{"icon":"😆","label":"Laughs at mistakes","bin":1},{"icon":"🔁","label":"Explains again, kindly","bin":0},{"icon":"📢","label":"Shouts all the time","bin":1},{"icon":"🤲🏽","label":"Is patient","bin":0},{"icon":"👉🏽","label":"Helps only some children","bin":1}],"wrong":"r8-teacher-no","img":"r8-c"}}
    ]
  },
  {
    id: "r9", icon: "🚩", title: "A New Flag", more: [], cite: "Histories of her life (Audrey Kahin, Jeffrey Hadler and others; see the notes)",
    steps: [
      {"say":"r9-a","scene":"city","src":"From the histories of her life","e":"📻 🎉"},
      {"say":"r9-b","scene":"city","src":"From the histories of her life","e":"🚩 🏫"},
      {"play":"hold","line":"r9-flag","scene":"city","opts":{"ms":2500,"icon":"🚩","hint":"Press and hold","done":"The flag is flying!","img":"r9-b"}},
      {"play":"choice","line":"r9-q","scene":"city","opts":{"options":[{"label":"Red and white","icon":"🚩","ok":true},{"label":"Blue and yellow","icon":"💙","ok":false}],"wrong":"r9-q-no","img":"r9-b"}}
    ]
  },
  {
    id: "r10", icon: "🎓", title: "To Cairo", more: [], cite: "Histories of her life (Audrey Kahin, Jeffrey Hadler and others; see the notes)",
    steps: [
      {"say":"r10-a","scene":"city","src":"From the histories of her life","e":"👳 🏫"},
      {"say":"r10-b","scene":"desert","src":"From the histories of her life","e":"🕋 🤲🏽"},
      {"play":"journey","line":"r10-cairo","scene":"desert","opts":{"from":"⛰️","to":"🕌","icon":"🧳","steps":7,"img":"r10-b"}},
      {"say":"r10-c","scene":"palace","src":"From the histories of her life","e":"🎓 🏛️"},
      {"say":"r10-d","scene":"city","src":"From the histories of her life","e":"🧳 👋"},
      {"play":"choice","line":"r10-q","scene":"palace","opts":{"options":[{"label":"Queen","icon":"👑","ok":false},{"label":"Syaikhah: a great scholar","icon":"🎓","ok":true}],"wrong":"r10-q-no","img":"r10-c"}}
    ]
  },
  {
    id: "r11", icon: "🌟", title: "Her School Today", more: [], cite: "Histories of her life (Audrey Kahin, Jeffrey Hadler and others; see the notes)",
    steps: [
      {"say":"r11-a","scene":"city","src":"From the histories of her life","e":"🎀 🏫"},
      {"say":"r11-b","scene":"dusk","src":"From the histories of her life","e":"🌇 🏫"},
      {"say":"r11-c","scene":"city","src":"From the histories of her life","e":"🏫 🧕🏽 📚"},
      {"say":"r11-d","scene":"palace","src":"From the histories of her life","e":"🏅 🇮🇩"},
      {"play":"order","line":"r11-story","scene":"city","opts":{"cards":[{"icon":"⛰️","label":"Born in the mountains","line":"r11-story-c1"},{"icon":"📖","label":"She learned to read","line":"r11-story-c2"},{"icon":"🏫","label":"A school for girls","line":"r11-story-c3"},{"icon":"🏚️","label":"The earthquake","line":"r11-story-c4"},{"icon":"🚩","label":"The new flag","line":"r11-story-c5"},{"icon":"🎓","label":"Al-Azhar","line":"r11-story-c6"}],"wrong":"r11-story-no","img":"r11-c"}}
    ]
  }
];

/* Music for single lines; everything else uses its scene's music (sceneMood in game.js). */
window.STORY_MOODS = {"r1-a":"wonder", "r1-c":"joy", "r2-a":"sad", "r2-b":"joy", "r3-a":"longing", "r3-b":"wonder", "r3-c":"triumph", "r4-b":"joy", "r4-c":"awe", "r5-a":"triumph", "r5-c":"joy", "r6-a":"tense", "r6-c":"longing", "r7-a":"sad", "r7-b":"joy", "r7-d":"triumph", "r8-b":"joy", "r9-a":"triumph", "r9-b":"triumph", "r10-a":"awe", "r10-b":"awe", "r10-c":"triumph", "r10-d":"joy", "r11-a":"triumph", "r11-b":"sad", "r11-c":"joy", "r11-d":"triumph"};
