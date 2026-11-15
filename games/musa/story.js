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
    steps: [
      {"say":"m3-a","scene":"palace","e":"CHEST 🏛️"},
      {"play":"pull","line":"m3-pull","scene":"river","opts":{"icon":"CHEST","label":"Pull!"}},
      {"say":"m3-b","scene":"palace","src":"From Ibn Kathir's commentary","e":"CHEST 👸🏿"},
      {"play":"change","line":"m3-open","scene":"palace","opts":{"states":[{"icon":"CHEST","line":null,"glow":false},{"icon":"👶🏿","line":"m3-open-s1","glow":false}],"img":"m3-b"}},
      {"say":"m3-c","scene":"palace","e":"👸🏿 👶🏿 💛"},
      {"play":"count","line":"m3-hearts","scene":"palace","opts":{"total":8,"icon":"🤍","got":"💛","img":"m3-c"},"src":"From Ibn Kathir's commentary"},
      {"say":"m3-d","scene":"palace","e":"👸🏿 👶🏿 👑"},
      {"say":"m3-e","scene":"palace","e":"👶🏿 🏛️"},
      {"play":"choice","line":"m3-q","scene":"palace","opts":{"options":[{"label":"Asiya, the queen","icon":"👸🏿","ok":true},{"label":"A soldier","icon":"🛡️","ok":false}],"wrong":"m3-q-no","img":"m3-c"}}
    ]
  },
  {
    id: "m4", icon: "🤱", title: "A Sister's Clever Plan", source: "28:10-13", more: ["20:40"],
    steps: [
      {"say":"m4-a","scene":"river","e":"🧕🏿 💭"},
      {"say":"m4-b","scene":"river","e":"🧕🏿 👣 CHEST"},
      {"play":"trail","line":"m4-follow","scene":"river","opts":{"n":7,"icon":"👣","walker":"img:icon-sister"}},
      {"say":"m4-c","scene":"palace","cue":"cry","e":"👶🏿 😭 🍼"},
      {"play":"count","line":"m4-nurses","scene":"palace","opts":{"total":5,"icon":"🧕🏿","got":"🙅🏿","img":"m4-c"}},
      {"say":"m4-d","scene":"palace","e":"🧕🏿 💬 👸🏿"},
      {"say":"m4-e","scene":"river","e":"🤱🏿 💛"},
      {"say":"m4-f","scene":"river","src":"From Ibn Kathir's commentary","e":"👸🏿 💰 🤱🏿"},
      {"play":"choice","line":"m4-q","scene":"river","opts":{"options":[{"label":"A palace nurse","icon":"🧕🏿","ok":false},{"label":"His own mother","icon":"🤱🏿","ok":true}],"wrong":"m4-q-no","img":"m4-e"}},
      {"play":"order","line":"m4-ord","scene":"river","opts":{"cards":[{"icon":"🌊","label":"Into the river","line":"m4-ord-c1"},{"icon":"👸🏿","label":"Found at the palace","line":"m4-ord-c2"},{"icon":"🍼","label":"He will not drink","line":"m4-ord-c3"},{"icon":"🤱🏿","label":"Back with his mother","line":"m4-ord-c4"}],"wrong":"m4-ord-no"}}
    ]
  },
  {
    id: "m5", icon: "🏛️", title: "Growing Up in the Palace", source: "28:14", more: ["20:27-28"],
    steps: [
      {"say":"m5-a","scene":"palace","src":"From Ibn Kathir's commentary","e":"👦🏿 🏛️"},
      {"say":"m5-b","scene":"palace","src":"From Ibn Kathir's commentary","e":"🌴 ♨️ 👦🏿"},
      {"play":"sort","line":"m5-sort","scene":"palace","opts":{"bins":[{"label":"Safe to eat","icon":"😋"},{"label":"Too hot! Do not touch","icon":"🔥"}],"things":[{"icon":"🌴","label":"A sweet date","bin":0},{"icon":"♨️","label":"A glowing coal","bin":1},{"icon":"🍞","label":"Warm bread","bin":0},{"icon":"🕯️","label":"A candle flame","bin":1},{"icon":"🥛","label":"A cup of milk","bin":0}],"wrong":"m5-sort-no"}},
      {"say":"m5-c","scene":"palace","e":"🧑🏿 💡"},
      {"play":"puzzle","line":"m5-puz","scene":"palace","opts":{"pic":"m5-c","n":2}},
      {"play":"choice","line":"m5-q","scene":"palace","opts":{"options":[{"label":"Wisdom and knowledge","icon":"💡","ok":true},{"label":"A golden crown","icon":"👑","ok":false}],"wrong":"m5-q-no","img":"m5-c"}}
    ]
  },
  {
    id: "m6", icon: "🏃", title: "A Big Mistake", source: "28:15-21", more: [],
    steps: [
      {"say":"m6-a","scene":"city","e":"🧑🏿 🤼"},
      {"say":"m6-b","scene":"city","e":"🧑🏿 ✊🏿 😟"},
      {"say":"m6-c","scene":"city","e":"🧑🏿 🤲🏿"},
      {"play":"hold","line":"m6-sorry","scene":"city","opts":{"ms":3000,"icon":"🤲🏿","hint":"Press and hold","done":"Allah is the Most Forgiving","img":"m6-c"}},
      {"play":"choice","line":"m6-q","scene":"city","opts":{"options":[{"label":"He pretended nothing happened","icon":"🙈","ok":false},{"label":"He asked Allah to forgive him","icon":"🤲🏿","ok":true}],"wrong":"m6-q-no","img":"m6-c"}},
      {"say":"m6-d","scene":"city","e":"🏃🏿 💬 🧑🏿"},
      {"say":"m6-e","scene":"desert","e":"🏃🏿 🏜️"},
      {"play":"journey","line":"m6-flee","scene":"desert","opts":{"from":"🏙️","to":"🏜️","icon":"img:icon-young","steps":7}}
    ]
  },
  {
    id: "m7", icon: "🐑", title: "The Well of Madyan", source: "28:22-24", more: ["28:26"],
    steps: [
      {"say":"m7-a","scene":"desert","e":"🚶🏿 🏜️"},
      {"play":"trail","line":"m7-walk","scene":"desert","opts":{"n":8,"icon":"👣","walker":"img:icon-young"}},
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
    steps: [
      {"say":"m8-a","scene":"well","e":"🧕🏿 💬 🧑🏿"},
      {"say":"m8-b","scene":"desert","src":"From Ibn Kathir's commentary","e":"🚶🏿 ROCK 🧕🏿"},
      {"play":"trail","line":"m8-pebble","scene":"desert","opts":{"n":6,"icon":"ROCK","walker":"img:icon-young"},"src":"From Ibn Kathir's commentary"},
      {"say":"m8-c","scene":"field","e":"👴🏿 🧑🏿 🍲"},
      {"say":"m8-d","scene":"field","e":"🧕🏿 💬 👴🏿"},
      {"play":"choice","line":"m8-q","scene":"field","opts":{"options":[{"label":"Loud and bossy","icon":"📢","ok":false},{"label":"Strong, and can be trusted","icon":"💪🏿","ok":true}],"wrong":"m8-q-no","img":"m8-c"}},
      {"say":"m8-e","scene":"field","e":"👴🏿 🤝 🧑🏿"},
      {"play":"count","line":"m8-years","scene":"field","opts":{"total":10,"icon":"☀️"},"src":"From a hadith in al-Bukhari"},
      {"play":"catch","line":"m8-flock","scene":"field","opts":{"target":7,"icon":"🐑","into":"🏡"}},
      {"play":"puzzle","line":"m8-puz","scene":"field","opts":{"pic":"m8-e","n":3}}
    ]
  },
  {
    id: "m9", icon: "🔥", title: "The Fire on the Mountain", source: "20:9-14", more: ["28:29-30"],
    steps: [
      {"say":"m9-a","scene":"night","e":"⛺ 🧔🏿 🔥"},
      {"say":"m9-b","scene":"night","e":"🧔🏿 👉🏿 🔥"},
      {"play":"seek","line":"m9-seek","scene":"night","opts":{"icon":"🔥","r":20}},
      {"play":"journey","line":"m9-climb","scene":"night","opts":{"from":"⛺","to":"🔥","icon":"img:icon-musa","steps":7}},
      {"say":"m9-c","scene":"fire","e":"🌳 🔥 🧔🏿"},
      {"play":"count","line":"m9-sandals","scene":"fire","opts":{"total":2,"icon":"👡","got":"✨","img":"m9-c"}},
      {"say":"m9-d","scene":"fire","e":"🧔🏿 ✨"},
      {"play":"hold","line":"m9-listen","scene":"fire","opts":{"ms":3200,"icon":"✨","hint":"Press and hold","done":"There is no god but Allah","img":"m9-d"}},
      {"play":"choice","line":"m9-q","scene":"fire","opts":{"options":[{"label":"Allah, his Lord","icon":"✨","ok":true},{"label":"A shepherd","icon":"🐑","ok":false}],"wrong":"m9-q-no","img":"m9-d"}}
    ]
  },
  {
    id: "m10", icon: "🐍", title: "The Staff and the Shining Hand", source: "20:17-24", more: ["28:31-32"],
    steps: [
      {"say":"m10-a","scene":"fire","e":"🧔🏿 STAFF"},
      {"play":"change","line":"m10-staff","scene":"fire","opts":{"states":[{"icon":"STAFF","line":null,"glow":false},{"icon":"🐍","line":"m10-staff-s1","glow":false},{"icon":"STAFF","line":"m10-staff-s2","glow":false}]},"cue":"hiss"},
      {"say":"m10-b","scene":"fire","e":"🐍 😮"},
      {"play":"change","line":"m10-hand","scene":"fire","opts":{"states":[{"icon":"✋🏿","line":null,"glow":false},{"icon":"✋🏿","line":"m10-hand-s1","glow":true},{"icon":"✋🏿","line":"m10-hand-s2","glow":false}]}},
      {"say":"m10-c","scene":"fire","src":"From Ibn Kathir's commentary","e":"✋🏿 ✨"},
      {"say":"m10-d","scene":"fire","e":"🧔🏿 ➡️ 👑"},
      {"play":"match","line":"m10-match","scene":"fire","opts":{"pairs":[{"a":"m10-match-a1","aIcon":"STAFF","aLabel":"The staff","b":"m10-match-b1","bIcon":"🐍","bLabel":"became a snake"},{"a":"m10-match-a2","aIcon":"✋🏿","aLabel":"The hand","b":"m10-match-b2","bIcon":"🌕","bLabel":"shone white"},{"a":"m10-match-a3","aIcon":"👡","aLabel":"The sandals","b":"m10-match-b3","bIcon":"⛰️","bLabel":"came off in the holy valley"}]}},
      {"play":"memory","line":"m10-mem","scene":"fire","opts":{"icons":["🔥","🐍","✋🏿","👡","⛰️","🌕"]}}
    ]
  },
  {
    id: "m11", icon: "🤲", title: "Musa's Prayer", source: "20:25-36", more: ["28:33-35","20:42-46"],
    steps: [
      {"say":"m11-a","scene":"fire","e":"🧔🏿 😟"},
      {"say":"m11-b","scene":"fire","e":"🧔🏿 🤲🏿"},
      {"say":"m11-c","scene":"fire","e":"🧔🏿 🤝 🧔🏿"},
      {"play":"order","line":"m11-ord","scene":"fire","opts":{"cards":[{"icon":"💛","label":"Open up my heart","line":"m11-ord-c1"},{"icon":"🌤️","label":"Make my task easy","line":"m11-ord-c2"},{"icon":"👅","label":"Untie my tongue","line":"m11-ord-c3"},{"icon":"🤝","label":"Give me my brother","line":"m11-ord-c4"}],"wrong":"m11-ord-no","img":"m11-b"}},
      {"say":"m11-d","scene":"fire","e":"✨ 🤲🏿"},
      {"say":"m11-e0","scene":"desert","e":"🧔🏿 🧔🏿 🚶🏿"},
      {"say":"m11-e","scene":"desert","e":"🧔🏿 🧔🏿 🕊️"},
      {"play":"choice","line":"m11-q","scene":"desert","opts":{"options":[{"label":"With shouting","icon":"😡","ok":false},{"label":"Gently","icon":"🕊️","ok":true}],"wrong":"m11-q-no","img":"m11-e"}},
      {"play":"sort","line":"m11-sort","scene":"desert","opts":{"bins":[{"label":"Gentle","icon":"🕊️"},{"label":"Harsh","icon":"🌩️"}],"things":[{"icon":"🙂","label":"Please listen to me","bin":0},{"icon":"😠","label":"You are stupid!","bin":1},{"icon":"🤝","label":"Let us talk together","bin":0},{"icon":"👉🏿","label":"Go away!","bin":1},{"icon":"💛","label":"Peace be with you","bin":0}],"wrong":"m11-sort-no"}}
    ]
  },
  {
    id: "m12", icon: "🏛️", title: "Before Pharaoh", source: "20:47-59", more: ["28:36-37"],
    steps: [
      {"say":"m12-a","scene":"palace","e":"🧔🏿 🧔🏿 👑"},
      {"say":"m12-b","scene":"palace","e":"✋🏿 ✨ 👑"},
      {"play":"pick","line":"m12-signs","scene":"palace","opts":{"items":[{"icon":"STAFF","n":1,"ok":true,"name":"the staff"},{"icon":"✋🏿","n":1,"ok":true,"name":"the hand"},{"icon":"👑","n":1,"ok":false,"name":"a crown"},{"icon":"💰","n":1,"ok":false,"name":"gold"},{"icon":"🗡️","n":1,"ok":false,"name":"a sword"},{"icon":"🐎","n":1,"ok":false,"name":"a horse"}],"mark":"✨"}},
      {"say":"m12-c","scene":"palace","e":"👑 😤"},
      {"say":"m12-d","scene":"palace","e":"👑 👉🏿"},
      {"say":"m12-e","scene":"palace","e":"🧔🏿 ☀️ 🎪"},
      {"play":"choice","line":"m12-q","scene":"palace","opts":{"options":[{"label":"The day of the festival, with everyone watching","icon":"🎪","ok":true},{"label":"A secret night, with nobody there","icon":"🌙","ok":false}],"wrong":"m12-q-no","img":"m12-e"}},
      {"play":"catch","line":"m12-crowd","scene":"egypt","opts":{"target":8,"icon":"🧑🏿","into":"🎪"}},
      {"play":"puzzle","line":"m12-puz","scene":"palace","opts":{"pic":"m12-a","n":3}}
    ]
  },
  {
    id: "m13", icon: "🎪", title: "The Day of the Festival", source: "20:60-70", more: [],
    steps: [
      {"say":"m13-a","scene":"egypt","amb":"crowd","e":"🎪 🧙🏿 🧙🏿"},
      {"say":"m13-b","scene":"egypt","amb":"crowd","e":"🧔🏿 💬 🧙🏿"},
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
    steps: [
      {"say":"m15-a","scene":"egypt","e":"☀️ 🌾 🥀"},
      {"say":"m15-b","scene":"storm","src":"From Ibn Kathir's commentary","cue":"thunder","e":"🌧️ 🌊"},
      {"say":"m15-c","scene":"egypt","src":"From Ibn Kathir's commentary","e":"🦗 🦗 🌿"},
      {"play":"catch","line":"m15-locusts","scene":"egypt","opts":{"target":8,"icon":"🦗","into":"💨"}},
      {"say":"m15-d","scene":"egypt","src":"From Ibn Kathir's commentary","cue":"croak","e":"🐸 🏺 🐸"},
      {"play":"pick","line":"m15-frogs","scene":"egypt","opts":{"items":[{"icon":"🐸","n":7,"ok":true,"name":"a frog"},{"icon":"🏺","n":2,"ok":false,"name":"a pot"},{"icon":"🍞","n":2,"ok":false,"name":"bread"},{"icon":"🥣","n":1,"ok":false,"name":"a bowl"}],"mark":"✨","img":"m15-d"}},
      {"say":"m15-e","scene":"egypt","e":"🌊 🔴"},
      {"say":"m15-f","scene":"storm","e":"🧔🏿 🤲🏿"},
      {"play":"wipe","line":"m15-clear","scene":"storm","opts":{"cover":"storm","img":"m15-g"}},
      {"say":"m15-g","scene":"egypt","e":"👑 💔"},
      {"play":"choice","line":"m15-q","scene":"egypt","opts":{"options":[{"label":"They broke their promise","icon":"💔","ok":true},{"label":"They kept their promise","icon":"🤝","ok":false}],"wrong":"m15-q-no","img":"m15-g"}},
      {"play":"order","line":"m15-ord","scene":"egypt","opts":{"cards":[{"icon":"🌧️","label":"The flood","line":"m15-ord-c1"},{"icon":"🦗","label":"The locusts","line":"m15-ord-c2"},{"icon":"🐜","label":"The tiny bugs","line":"m15-ord-c3"},{"icon":"🐸","label":"The frogs","line":"m15-ord-c4"},{"icon":"🔴","label":"The red water","line":"m15-ord-c5"}],"wrong":"m15-ord-no"}}
    ]
  },
  {
    id: "m16", icon: "🌙", title: "Leaving by Night", source: "26:60-62", more: ["20:77"],
    steps: [
      {"say":"m16-a","scene":"night","e":"🧔🏿 🌙"},
      {"play":"count","line":"m16-wake","scene":"night","opts":{"total":8,"icon":"🏠","got":"🏮"}},
      {"say":"m16-b","scene":"night","e":"🚶🏿 🚶🏿 🌙"},
      {"play":"journey","line":"m16-leave","scene":"night","opts":{"from":"🏘️","to":"🌊","icon":"img:icon-musa","steps":8}},
      {"say":"m16-c","scene":"dawn","cue":"thunder","e":"👑 🐎 🐎"},
      {"say":"m16-d","scene":"sea","e":"🌊 😨 🐎"},
      {"say":"m16-e","scene":"sea","e":"🧔🏿 STAFF 🌊"},
      {"play":"choice","line":"m16-q","scene":"sea","opts":{"options":[{"label":"We are lost","icon":"😱","ok":false},{"label":"My Lord is with me","icon":"💛","ok":true}],"wrong":"m16-q-no","img":"m16-e"}},
      {"play":"puzzle","line":"m16-puz","scene":"sea","opts":{"pic":"m16-e","n":3}}
    ]
  },
  {
    id: "m17", icon: "🌊", title: "The Sea Opens", source: "26:63-66", more: ["20:77-78","10:90-92"],
    steps: [
      {"say":"m17-a","scene":"sea","e":"🧔🏿 STAFF 🌊"},
      {"play":"part","line":"m17-part","scene":"sea","opts":{"ms":3600,"icon":"STAFF"}},
      {"say":"m17-b","scene":"sea","cue":"roar","e":"🌊 👣 🌊"},
      {"say":"m17-c","scene":"sea","src":"From Ibn Kathir's commentary","e":"🌊 👣 🌊"},
      {"play":"wipe","line":"m17-dry","scene":"sea","opts":{"cover":"water","img":"m17-b"},"src":"From Ibn Kathir's commentary"},
      {"play":"count","line":"m17-paths","scene":"sea","opts":{"total":12,"icon":"🌊","got":"👣"},"src":"From Ibn Kathir's commentary"},
      {"play":"journey","line":"m17-cross","scene":"sea","opts":{"from":"🏖️","to":"🌅","icon":"img:icon-musa","steps":8,"img":"m17-b"}},
      {"say":"m17-d","scene":"sea","e":"🚶🏿 🚶🏿 🙌🏿"},
      {"say":"m17-e","scene":"sea","cue":"roar","e":"🌊 🌊 🌊"},
      {"say":"m17-f0","scene":"sea","e":"👑 🌊"},
      {"say":"m17-f","scene":"sea","e":"👑 🌊"},
      {"say":"m17-g","scene":"dawn","src":"From a hadith in al-Bukhari","e":"🙌🏿 🌅"},
      {"play":"choice","line":"m17-q","scene":"dawn","opts":{"options":[{"label":"Allah","icon":"✨","ok":true},{"label":"A big boat","icon":"⛵","ok":false}],"wrong":"m17-q-no","img":"m17-g"}},
      {"play":"order","line":"m17-ord","scene":"sea","opts":{"cards":[{"icon":"😨","label":"Caught at the sea","line":"m17-ord-c1"},{"icon":"STAFF","label":"Musa strikes the sea","line":"m17-ord-c2"},{"icon":"👣","label":"A dry path","line":"m17-ord-c3"},{"icon":"🌊","label":"The sea closes","line":"m17-ord-c4"}],"wrong":"m17-ord-no"}}
    ]
  },
  {
    id: "m18", icon: "💧", title: "Food from the Sky, Water from the Rock", source: "2:57-60", more: [],
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
    steps: [
      {"say":"m19-a","scene":"camp","e":"🧔🏿 🤝 🧔🏿"},
      {"play":"choice","line":"m19-q1","scene":"camp","opts":{"options":[{"label":"Forty","icon":"🌙","ok":true},{"label":"Thirteen","icon":"⭐","ok":false}],"wrong":"m19-q1-no","img":"m19-a"}},
      {"play":"journey","line":"m19-climb","scene":"mountain","opts":{"from":"⛺","to":"⛰️","icon":"img:icon-musa","steps":8}},
      {"say":"m19-b","scene":"mountain","e":"🧔🏿 ⛰️"},
      {"say":"m19-c","scene":"mountain","cue":"thunder","e":"⛰️ 💨"},
      {"play":"choice","line":"m19-q2","scene":"mountain","opts":{"options":[{"label":"It grew taller","icon":"⛰️","ok":false},{"label":"It crumbled into dust","icon":"💨","ok":true}],"wrong":"m19-q2-no","img":"m19-c"}},
      {"say":"m19-d","scene":"mountain","e":"🧔🏿 🙇🏿"},
      {"say":"m19-e","scene":"mountain","e":"🧔🏿 📜"},
      {"play":"puzzle","line":"m19-puz","scene":"mountain","opts":{"pic":"m19-e","n":3}},
      {"play":"sort","line":"m19-sort","scene":"mountain","opts":{"bins":[{"label":"Thankful","icon":"💛"},{"label":"Not thankful","icon":"🙄"}],"things":[{"icon":"🤲🏿","label":"Saying: thank You, Allah","bin":0},{"icon":"😤","label":"Saying: I want more, more, more","bin":1},{"icon":"🍞","label":"Sharing your food","bin":0},{"icon":"🗑️","label":"Throwing good food away","bin":1}],"wrong":"m19-sort-no"}}
    ]
  },
  {
    id: "m20", icon: "🐄", title: "The Golden Calf", source: "20:83-97", more: ["7:148-151"],
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
    steps: [
      {"say":"m21-a","scene":"camp","e":"🧔🏿 💬 🐄"},
      {"say":"m21-b","scene":"field","e":"🐄 ❓"},
      {"say":"m21-c","scene":"field","e":"🐄 ✨"},
      {"say":"m21-d","scene":"field","e":"🐄 🔍"},
      {"say":"m21-d1","scene":"field","src":"From a Shia narration (Imam al-Rida)","e":"👴🏿 😴 🐄"},
      {"play":"pick","line":"m21-cow","scene":"field","opts":{"items":[{"icon":"🐄","n":1,"ok":true,"cls":"cow-yellow","name":"the yellow cow"},{"icon":"🐄","n":3,"ok":false,"name":"a spotted cow"},{"icon":"🐂","n":2,"ok":false,"name":"a brown ox"},{"icon":"🐃","n":2,"ok":false,"name":"a dark buffalo"}],"mark":"✨"}},
      {"say":"m21-e","scene":"field","e":"🐄 👍🏿"},
      {"play":"choice","line":"m21-q","scene":"field","opts":{"options":[{"label":"Asked more and more questions","icon":"❓","ok":false},{"label":"Done as they were told, straight away","icon":"👍🏿","ok":true}],"wrong":"m21-q-no","img":"m21-e"}},
      {"play":"order","line":"m21-ord","scene":"field","opts":{"cards":[{"icon":"🐄","label":"What kind of cow?","line":"m21-ord-c1"},{"icon":"🎨","label":"What colour?","line":"m21-ord-c2"},{"icon":"🔍","label":"Which one exactly?","line":"m21-ord-c3"}],"wrong":"m21-ord-no"}}
    ]
  },
  {
    id: "m22", icon: "🚪", title: "The Holy Land", source: "5:20-26", more: [],
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
    steps: [
      {"say":"m23-a","scene":"camp","src":"From a hadith in al-Bukhari","e":"🧔🏿 💬"},
      {"say":"m23-b","scene":"desert","e":"🧔🏿 👦🏿 🐟"},
      {"play":"journey","line":"m23-go","scene":"desert","opts":{"from":"⛺","to":"🌊","icon":"img:icon-musa","steps":8}},
      {"say":"m23-c","scene":"sea","src":"From a hadith in al-Bukhari","cue":"splash","e":"🐟 💦 🌊"},
      {"play":"trail","line":"m23-fish","scene":"sea","opts":{"n":7,"icon":"💦","walker":"🐟"}},
      {"say":"m23-d","scene":"desert","e":"👦🏿 😮 🧺"},
      {"say":"m23-e","scene":"desert","e":"🧔🏿 👉🏿 👣"},
      {"play":"trail","line":"m23-back","scene":"desert","opts":{"n":7,"icon":"👣","walker":"img:icon-musa"}},
      {"say":"m23-f","scene":"sea","src":"From a hadith in al-Bukhari","e":"👴🏿 ✨"},
      {"say":"m23-f1","scene":"sea","src":"Told in al-Bukhari and in Shia narrations","e":"🧔🏿 🌱 🌸"},
      {"say":"m23-g0","scene":"sea","e":"🧔🏿 💬 👴🏿"},
      {"say":"m23-g","scene":"sea","e":"🧔🏿 🤝 👴🏿"},
      {"play":"choice","line":"m23-q","scene":"sea","opts":{"options":[{"label":"To ask lots of questions","icon":"❓","ok":false},{"label":"To be patient, and not to ask","icon":"🤐","ok":true}],"wrong":"m23-q-no","img":"m23-g"}}
    ]
  },
  {
    id: "m24", icon: "⛵", title: "Three Strange Things", source: "18:71-82", more: [],
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
      {"say":"m24-i","scene":"sea","e":"🧔🏿 🌅"},
      {"say":"m24-i2","scene":"sea","src":"From a hadith in al-Bukhari","e":"🌊 🐦"},
      {"play":"choice","line":"m24-q2","scene":"sea","opts":{"options":[{"label":"That he knew everything","icon":"🤓","ok":false},{"label":"Allah knows what we do not know","icon":"✨","ok":true}],"wrong":"m24-q2-no","img":"m24-i"}}
    ]
  },
  {
    id: "m25", icon: "📜", title: "Allah Was with Him", source: "28:43", more: ["20:46","26:62"],
    steps: [
      {"say":"m25-a","scene":"river","e":"🧺 🐑 STAFF"},
      {"say":"m25-b","scene":"sea","e":"🧔🏿 ✨"},
      {"say":"m25-c","scene":"mountain","e":"📜 ✨"},
      {"play":"order","line":"m25-ord","scene":"dawn","opts":{"cards":[{"icon":"🧺","label":"The baby on the river","line":"m25-ord-c1"},{"icon":"🐑","label":"The shepherd at the well","line":"m25-ord-c2"},{"icon":"🔥","label":"The fire on the mountain","line":"m25-ord-c3"},{"icon":"🌊","label":"The sea opens","line":"m25-ord-c4"},{"icon":"📜","label":"The Tablets","line":"m25-ord-c5"}],"wrong":"m25-ord-no"}},
      {"play":"match","line":"m25-match","scene":"dawn","opts":{"pairs":[{"a":"m25-match-a1","aIcon":"👸🏿","aLabel":"Asiya","b":"m25-match-b1","bIcon":"💛","bLabel":"the queen who loved baby Musa"},{"a":"m25-match-a2","aIcon":"🧕🏿","aLabel":"Musa's sister","b":"m25-match-b2","bIcon":"👣","bLabel":"followed the chest along the river"},{"a":"m25-match-a3","aIcon":"🤝","aLabel":"Harun","b":"m25-match-b3","bIcon":"🗣️","bLabel":"the brother who helped him speak"},{"a":"m25-match-a4","aIcon":"👑","aLabel":"Pharaoh","b":"m25-match-b4","bIcon":"🌊","bLabel":"the proud king, lost in the sea"}]}},
      {"play":"memory","line":"m25-mem","scene":"dawn","opts":{"icons":["🧺","🐑","🔥","STAFF","🐸","🌊","💧","📜"]}},
      {"play":"puzzle","line":"m25-puz","scene":"sea","opts":{"pic":"m17-b","n":3}}
    ]
  }
];

/* Music for single lines; everything else uses its scene's music (sceneMood in game.js). */
window.STORY_MOODS = {"m1-b":"longing", "m1-c":"nile", "m2-a":"longing", "m2-d":"nile", "m3-c":"nile", "m4-a":"longing", "m4-e":"triumph", "m4-f":"triumph", "m5-a":"nile", "m6-b":"dread", "m6-c":"longing", "m6-d":"dread", "m6-e":"dread", "m7-a":"trek", "m7-e":"longing", "m8-b":"pastoral", "m8-e":"triumph", "m9-c":"awe", "m9-d":"awe", "m10-a":"awe", "m10-b":"awe", "m10-c":"awe", "m10-d":"dread", "m11-a":"longing", "m11-b":"awe", "m11-c":"awe", "m11-d":"triumph", "m11-e0":"trek", "m11-e":"triumph", "m12-a":"court", "m12-b":"awe", "m12-c":"court", "m12-d":"court", "m12-e":"court", "m13-a":"court", "m13-b":"court", "m13-c":"dread", "m13-d":"longing", "m13-e":"awe", "m13-f":"triumph", "m14-a":"dread", "m14-b":"triumph", "m14-c":"court", "m14-d":"longing", "m14-e":"court", "m15-a":"dread", "m15-c":"dread", "m15-e":"dread", "m15-f":"longing", "m15-g":"court", "m16-a":"longing", "m16-b":"trek", "m16-c":"dread", "m16-d":"dread", "m16-e":"awe", "m17-a":"awe", "m17-b":"awe", "m17-c":"triumph", "m17-d":"triumph", "m17-e":"dread", "m17-f0":"dread", "m17-f":"longing", "m17-g":"triumph", "m18-a":"trek", "m18-b":"triumph", "m18-c":"longing", "m18-d":"triumph", "m19-a":"trek", "m19-b":"awe", "m19-c":"awe", "m19-d":"awe", "m19-e":"triumph", "m20-a":"dread", "m20-b":"dread", "m20-c":"longing", "m20-d":"dread", "m20-e":"longing", "m20-f":"triumph", "m20-g":"awe", "m21-a":"pastoral", "m21-b":"pastoral", "m21-c":"pastoral", "m21-d":"pastoral", "m21-d1":"pastoral", "m21-e":"pastoral", "m22-a":"trek", "m22-b":"dread", "m22-c":"triumph", "m22-d":"longing", "m22-e":"longing", "m23-a":"pastoral", "m23-b":"trek", "m23-d":"trek", "m23-e":"triumph", "m23-f":"awe", "m23-f1":"wonder", "m23-g0":"pastoral", "m23-g":"pastoral", "m24-a":"dread", "m24-b":"pastoral", "m24-c":"awe", "m24-d":"longing", "m24-e":"pastoral", "m24-f":"awe", "m24-g":"triumph", "m24-h":"triumph", "m24-i":"awe", "m24-i2":"awe", "m25-a":"nile", "m25-b":"awe", "m25-c":"triumph"};
