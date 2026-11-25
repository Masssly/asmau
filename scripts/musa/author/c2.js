/* Chapters 9 to 17: the fire, the signs, Pharaoh, the magicians, the plagues, the sea. */
"use strict";
const { chapter, s, p, q, ord, mat, srt, chg, TAF, HAD } = require("./lib");

chapter("m9", "🔥", "The Fire on the Mountain", "20:9-14", ["28:29-30"], null);
s("a", "night", "When his years of work were done, Musa set off on a journey with his family. One cold, dark night, he saw a fire, far away on the side of the mountain.",
  "A cold starry night in rocky desert mountains: {MU} stands beside a small tent and a few sheep with his wife in a purple headscarf, pointing at a tiny bright fire glowing far off on a dark mountainside.");
s("b", "night", "He said to his family: wait here. I can see a fire. Maybe I can bring you a burning stick to warm you, or find someone there to show us the way.", "A cold starry night in rocky desert mountains: {MU} turns back toward his wife in a purple headscarf, who sits wrapped in a warm blanket beside a small tent with a few sheep, and raises one open hand gently as if to say wait here; behind him a stony path climbs the dark mountain toward a tiny bright fire.");
p("seek", "seek", "night", "It is so dark. Slide your finger around to look, and find the fire.", { icon: "🔥", r: 20 });
p("journey", "climb", "night", "Walk with Musa up to the fire.", { from: "⛺", to: "🔥", icon: "img:icon-musa", steps: 7 });
s("c", "fire", "When he came close, a voice called out: Musa! I am your Lord. Take off your sandals. You are in the holy valley of Tuwa.",
  "Night in a rocky valley: a green tree glows with brilliant golden fire-like light that does not burn its leaves; {MU} stands before it shielding his eyes in awe, his sandals still on his feet.", { mood: "awe" });
p("count", "sandals", "fire", "Help Musa take off his sandals. Tap each one.", { total: 2, icon: "🩴", got: "✨" }, { img: "c" });
s("d", "fire", "I have chosen you, so listen. I am Allah. There is no god but Me. So worship Me, and keep up the prayer, to remember Me.",
  "{MU} kneels barefoot on the ground with his head bowed and his staff laid beside him, before a tree shining with golden light in a dark rocky valley; his sandals rest on a stone.", { mood: "awe" });
p("hold", "listen", "fire", "Be very still and listen, like Musa. Press and hold the light.", { ms: 3200, icon: "✨", hint: "Press and hold", done: "There is no god but Allah" }, { img: "d" });
q("q", "fire", "Who called to Musa in the holy valley?", ["Allah, his Lord", "✨"], ["A shepherd", "🐑"], "No. It was Allah who called: Musa, I am your Lord.", { img: "d" });

chapter("m10", "🐍", "The Staff and the Shining Hand", "20:17-24", ["28:31-32"], null);
s("a", "fire", "Allah asked: what is that in your right hand, Musa? He said: it is my staff. I lean on it. I look after my sheep with it. And I use it for other things too.",
  "{MU}, barefoot in a rocky valley lit by golden light from one side, holds out his plain wooden staff in both hands and looks at it.", { mood: "awe" });
chg("staff", "fire", "Allah said: throw it down. Tap the staff to throw it.", [
  ["STAFF", ""], ["🐍", "It became a snake, moving fast! Musa turned to run. Allah said: pick it up, and do not be afraid. Tap the snake."], ["STAFF", "And it was a staff again."]
], { cue: "hiss" });
s("b", "fire", "The staff had become a real snake, and then a staff again. It was a sign from Allah.",
  "A large golden-brown snake rears up from the ground where a staff was thrown; {MU}, barefoot and empty-handed, steps back in surprise; the valley glows with golden light from one side.", { mood: "awe" });
chg("hand", "fire", "Then Allah said: put your hand inside your shirt, and take it out. Tap the hand.", [
  ["✋", ""], ["✋", "It shone with a bright, beautiful light, and it did not hurt at all! Tap it again.", true], ["✋", "And it was just as before."]
]);
s("c", "fire", "Musa's hand shone bright. It is told that it shone like the moon. This was another sign.",
  "{MU} looks in wonder at his own raised right hand, which shines with soft pure white light that lights up his face, in a dark rocky valley at night.", { src: TAF, mood: "awe" });
s("d", "fire", "Then Allah said: now go to Pharaoh. He has gone much too far.", "{MU} stands in a dark rocky valley at night, staff in hand, looking far off into the distance where, beyond the desert, the faint lights of a great river city and a palace glow on the horizon; a soft gentle light falls on him from above. He looks serious and determined.", { mood: "dread" });
mat("match", "fire", "Match each thing to what happened. Tap one on the left, then its partner on the right.", [
  ["STAFF", "The staff", "🐍", "became a snake"],
  ["✋", "The hand", "🌕", "shone bright"],
  ["🩴", "The sandals", "⛰️", "came off in the holy valley"]
]);
p("memory", "mem", "fire", "Find the pairs from that wonderful night.", { icons: ["🔥", "🐍", "✋", "🩴", "⛰️", "🌕"] });

chapter("m11", "🤲", "Musa's Prayer", "20:25-36", ["28:33-35", "20:42-46"], null);
s("a", "fire", "Musa was worried. He said: my Lord, I am afraid of what they may do to me. And speaking is hard for me. My brother Harun speaks better than I do.",
  "{MU} kneels barefoot in the glowing valley, one hand on his chest and a worried look on his face, speaking upward toward the golden light.", { mood: "longing" });
s("b", "fire", "So he prayed a beautiful prayer: my Lord, open up my heart. Make my task easy for me. And untie the knot in my tongue, so that they can understand my words.",
  "{MU} kneels with both palms raised in prayer and eyes closed, calm now, golden light on his face, stars above the rocky valley.", { mood: "awe" });
s("c", "fire", "And give me a helper from my family: Harun, my brother. Make me strong through him, and let him share my task, so that we may praise You and remember You a great deal.", "Far away in Egypt at dawn, {HA} stands at the door of a humble mud-brick house by the river, looking out toward the desert with a hopeful, kind face, a small clay oil lamp in his hand; date palms and the quiet river behind him.", { mood: "awe" });
ord("ord", "fire", "Say Musa's prayer with him. Tap the parts in order.", [
  ["💛", "Open up my heart", "My Lord, open up my heart."],
  ["🌤️", "Make my task easy", "Make my task easy for me."],
  ["👅", "Untie my tongue", "Untie the knot in my tongue."],
  ["🤝", "Give me my brother", "And give me my brother to help me."]
], "Not yet. Listen again: heart, task, tongue, brother.", { img: "b" });
s("d", "fire", "Allah said: Musa, you have been given what you asked for.", "In the rocky valley, the first gentle light of dawn breaks over the mountains; {MU} rises from his knees with a face full of joy and peace, one hand on his heart and his staff in the other.", { mood: "triumph" });
s("e0", "desert", "So Musa set off back to Egypt, with his brother Harun at his side.", "{MU} and {HA} embrace warmly as brothers meeting on a desert road at sunrise, a river city far behind them.", { mood: "triumph" });
s("e", "desert", "Allah told them: go to Pharaoh, both of you. Speak to him gently, so that he may think, and remember. Do not be afraid. I am with you both. I hear and I see everything.",
  "{MU} and {HA} walk side by side along a desert road toward a river city with date palms in warm late-afternoon light, seen from behind and a little to the side, their long shadows stretching ahead of them.", { mood: "trek" });
q("q", "desert", "How should Musa and Harun speak to Pharaoh?", ["Gently", "🕊️"], ["With shouting", "😡"], "No. Allah told them: speak to him gently.", { img: "e" });
srt("sort", "desert", "Is it a gentle word, or a harsh word?", ["Gentle", "🕊️"], ["Harsh", "🌩️"], [
  ["🙂", "Please listen to me", 0], ["😠", "You are stupid!", 1], ["🤝", "Let us talk together", 0], ["👉", "Go away!", 1], ["💛", "Peace be with you", 0]
], "Think again. How would it feel to hear that?");

chapter("m12", "🏛️", "Before Pharaoh", "20:47-59", ["28:36-37"], null);
s("a", "palace", "Musa and Harun stood before Pharaoh in his great hall. They said: we are messengers from your Lord. Let the Children of Israel go with us, and stop hurting them.",
  "In {HALL}, {MU} and {HA} stand side by side, calm and upright, before {PH} seated high on a golden throne with guards and ministers around him.", { mood: "court" });
s("b", "palace", "Musa showed them the clear signs that Allah had given him.",
  "In {HALL}, {MU} holds up his right hand which shines with soft white light; courtiers and ministers lean back shading their eyes, {PH} grips his throne.", { mood: "awe" });
p("pick", "signs", "palace", "Which two signs did Allah give Musa? Tap them.", { items: [{ icon: "STAFF", n: 1, ok: true, name: "the staff", cls: "lit" }, { icon: "✋", n: 1, ok: true, name: "the hand", cls: "lit" }, { icon: "👑", n: 1, ok: false, name: "a crown" }, { icon: "💰", n: 1, ok: false, name: "gold" }, { icon: "🗡️", n: 1, ok: false, name: "a sword" }, { icon: "🐎", n: 1, ok: false, name: "a horse" }], mark: "✨" });
s("c", "palace", "But Pharaoh and his chiefs said: this is nothing but magic tricks! We never heard of anything like this from our fathers.",
  "{PH} stands up from his throne and waves a hand dismissively, laughing, while his ministers in rich robes whisper and smirk behind him.", { mood: "court" });
s("d", "palace", "Pharaoh said: have you come to push us out of our land with your magic, Musa? We will bring you magic just like it. So choose a day!", "In {HALL}, seen from the side: on the right {PH} leans forward on his throne and points a finger across the hall; on the left, facing him a few steps away, {MU} and {HA} stand calm and unafraid. There are only these three people in the picture.", { mood: "court" });
s("e", "palace", "Musa said: let it be the day of the festival. And let all the people gather when the sun is high.",
  "{MU} stands calmly in {HALL} and points with his staff toward a tall bright window where the sun shines; {HA} stands beside him.", { mood: "court" });
q("q", "palace", "Which day did Musa choose?", ["The day of the festival, with everyone watching", "🎪"], ["A secret night, with nobody there", "🌙"], "No. Musa chose the festival day, so that everyone could see the truth.", { img: "e" });
p("catch", "crowd", "egypt", "Help gather all the people for the big day. Tap them as they come.", { target: 8, icon: "🧑", into: "🎪" });
p("puzzle", "puz", "palace", "Put the picture back together. Tap two pieces to swap them.", { pic: "m12-a", n: 3 });

chapter("m13", "🎪", "The Day of the Festival", "20:60-70", [], null);
s("a", "egypt", "The big day came. The sun was high, and the whole city was there. Pharaoh's magicians stood in a row, with their ropes and their sticks.",
  "A huge open festival ground under a high bright sun, packed with a cheering crowd: {SORC} stand in a row holding coils of rope and wooden sticks, facing {MU} and {HA}; {PH} watches from a shaded platform.", { mood: "court", amb: "crowd" });
s("b", "egypt", "Musa warned them: do not make up lies about Allah! Then they said: Musa, will you throw first, or shall we? Musa said: you throw.", "Close up on the festival ground under a high bright sun: {MU} raises one open hand toward {SORC} in an earnest warning, his staff in the other hand, {HA} beside him; the magicians clutch their ropes and sticks and glance at each other uneasily. A crowd watches behind them.", { mood: "court", amb: "crowd" });
q("q1", "egypt", "Who threw first?", ["The magicians", "🧙"], ["Musa", "STAFF"], "No. Musa said to the magicians: you throw first.", { img: "a" });
s("c", "egypt", "The magicians threw down their ropes and their sticks. And by their magic, the ropes seemed to wriggle and slither, just like snakes!",
  "On a sandy festival ground, dozens of ropes and sticks lie scattered and seem to twist and wriggle like snakes; {SORC} raise their arms proudly, the crowd gasps.", { mood: "dread", amb: "crowd" });
p("count", "ropes", "egypt", "Look closely. They are only ropes! Tap each one to see what it really is.", { total: 9, icon: "🐍", got: "ROPE" });
s("d", "egypt", "Even Musa felt afraid inside. But Allah said: do not be afraid. You will win. Throw down what is in your right hand.",
  "{MU} stands firm on the sandy festival ground gripping his staff, eyes closed for a moment, a soft light on his face; wriggling ropes lie before him and {HA} stands at his shoulder.", { mood: "longing", amb: "crowd" });
chg("throw", "egypt", "Throw down the staff! Tap it.", [["STAFF", ""], ["🐍", "It swallowed up everything the magicians had made!"]], { cue: "hiss" });
s("e", "egypt", "Musa's staff swallowed up everything they had made, every rope and every stick, until nothing was left.",
  "One enormous golden-brown snake sweeps across the sandy festival ground swallowing ropes and sticks; {SORC} stumble backward with wide eyes; {MU} stands calm.", { mood: "awe", amb: "crowd" });
p("catch", "swallow", "egypt", "Help the staff swallow the tricks. Tap the ropes as they appear.", { target: 8, icon: "ROPE", into: "🐍" });
s("f", "egypt", "The magicians knew magic, and they knew this was no trick. They fell to the ground and said: we believe in the Lord of Harun and Musa!",
  "{SORC} kneel and bow down with their foreheads to the sandy ground in a row, ropes lying still around them; {MU} and {HA} stand behind; the crowd stares in amazement.", { mood: "triumph", amb: "crowd" });
q("q2", "egypt", "Why did the magicians believe?", ["They saw it was no trick. It was from Allah", "✨"], ["Pharaoh told them to", "👑"], "No. Pharaoh was furious! They believed because they saw it was truly from Allah.", { img: "f" });

chapter("m14", "🦁", "Brave Hearts", "20:71-73", ["40:28", "66:11", "28:38-39"], null);
s("a", "palace", "Pharaoh was furious. He shouted: how dare you believe before I say you may? And he said he would punish them terribly.",
  "{PH} stands on his platform shouting with a clenched fist raised, his face angry, guards rushing forward below him.", { mood: "dread" });
s("b", "palace", "But the magicians were not afraid any more. They said: we will never choose you over the clear signs that have come to us. Do what you like. You only rule this short life. Allah is better, and Allah lasts for ever.",
  "{SORC} stand together shoulder to shoulder, calm and brave, looking up without fear; guards with spears surround them; warm light falls on their faces.", { mood: "triumph" });
q("q", "palace", "What did the magicians choose?", ["The truth from Allah", "✨"], ["Pharaoh's gold", "💰"], "No. They gave up Pharaoh's rewards. They chose the truth from Allah.", { img: "b" });
s("c", "palace", "There was a man in Pharaoh's own family who had kept his faith a secret. He spoke up: would you hurt a man only because he says, my Lord is Allah? He has brought you clear signs!",
  "In {HALL}, a nobleman in a fine blue-and-white robe steps out from among the ministers and speaks boldly with an open hand toward {PH}, who glares from the throne.", { mood: "court" });
s("d", "palace", "And Asiya the queen believed too. She prayed: my Lord, build me a house near You in the Garden. And save me from Pharaoh, and from what he does.",
  "{ASIYA} kneels alone by a tall palace window at night with her palms raised in prayer, moonlight on her peaceful face.", { mood: "longing" });
p("hold", "dua", "palace", "Make her prayer with her. Press and hold the hands until they shine.", { ms: 3000, icon: "🤲", hint: "Press and hold", done: "My Lord, build me a house near You" }, { img: "d" });
s("e", "egypt", "But proud Pharaoh said to his chiefs: I know of no god for you but me! Haman, bake bricks of clay, and build me a tall tower, so that I can climb up and look for the God of Musa. I think he is lying.",
  "{PH} points up at the sky, giving orders to a tall minister in a black-and-gold robe, while workers behind them stack clay bricks into the base of a huge unfinished tower.", { mood: "court" });
p("build", "tower", "egypt", "Pharaoh thought a tower could reach the sky. Tap to stack the bricks and see.", { n: 12, icon: "🧱", cols: 3, after: "m14-tower-after" });
require("./lib").line("m14-tower-after", "Up and up it went. But no tower can reach Allah. Pharaoh and his armies were proud in the land, with no right to be.");
mat("match", "palace", "Who said it? Match the brave hearts to their words.", [
  ["🧙", "The magicians", "✨", "We believe in the Lord of Harun and Musa"],
  ["👸", "Asiya the queen", "🏡", "Build me a house near You in the Garden"],
  ["🧔", "The secret believer", "☝️", "My Lord is Allah"]
]);

chapter("m15", "🐸", "Sign after Sign", "7:130-135", [], null);
s("a", "egypt", "Still Pharaoh would not let the people go. So Allah sent signs to Pharaoh's people, to wake them up. First came years with no rain, and hardly any food grew.",
  "A dry cracked field under a harsh sun with withered brown crops and an empty irrigation channel; a farmer in a linen kilt and head-cloth looks at the sky, a river city in the distance.", { mood: "dread" });
s("b", "storm", "Then came a great flood of rain. It is told that it spoiled the crops and the fruit.",
  "Heavy dark storm clouds pour rain over a river city; fields are flooded, people run for shelter under palm-leaf roofs holding cloths over their heads.", { src: TAF, cue: "thunder" });
s("c", "egypt", "Then came clouds of locusts that ate up the plants. It is told that they even chewed the nails out of the doors!",
  "A huge swarm of locusts darkens the sky over green fields and mud-brick houses; people wave cloths at them; locusts cover a wooden door.", { src: TAF, mood: "dread" });
p("catch", "locusts", "egypt", "Shoo! Tap the locusts to chase them off the plants.", { target: 8, icon: "🦗", into: "💨" });
s("d", "egypt", "Then tiny bugs got into the grain. And then came frogs. Frogs, frogs, everywhere! It is told that they were in the pots, in the beds, and even in the clothes.",
  "A comical kitchen in a mud-brick house overrun with dozens of green frogs: frogs in the cooking pots, on the bed, on shelves and peeking out of a basket of clothes, while a cook throws up his hands.", { src: TAF, cue: "croak" });
p("pick", "frogs", "egypt", "Find every frog hiding in the kitchen. Tap them all.", { items: [{ icon: "🐸", n: 7, ok: true, name: "a frog" }, { icon: "🏺", n: 2, ok: false, name: "a pot" }, { icon: "🍞", n: 2, ok: false, name: "bread" }, { icon: "🥣", n: 1, ok: false, name: "a bowl" }], mark: "✨" }, { img: "d" });
s("e", "egypt", "And then the water of the river turned red. Every one of these was a clear sign.",
  "A wide river running deep red between its green banks under a pale sky; people stand on the shore with empty water jars, staring in dismay.", { mood: "dread" });
s("f", "storm", "Each time, they begged: Musa, pray to your Lord for us! If the trouble goes away, we will believe, and we will let your people go. Musa prayed, and Allah took the trouble away.",
  "Under a stormy sky, a group of noblemen in rich robes plead with clasped hands before {MU}, who raises his palms in prayer.", { mood: "longing" });
p("wipe", "clear", "storm", "Musa prays, and the trouble is lifted. Rub the sky until it is clear.", { cover: "storm" }, { img: "g" });
s("g", "egypt", "But every time the trouble was gone, they broke their promise.",
  "Under a clear blue sky, {PH} turns his back and walks away up palace steps with a wave of his hand, while {MU} and {HA} stand below watching him go.", { mood: "court" });
q("q", "egypt", "What did they do each time the trouble went away?", ["They broke their promise", "💔"], ["They kept their promise", "🤝"], "No. Every time, they broke their promise.", { img: "g" });
ord("ord", "egypt", "Five signs came, one after another. Tap them in order.", [
  ["🌧️", "The flood", "First, the flood."], ["🦗", "The locusts", "Then the locusts."], ["🐜", "The tiny bugs", "Then the tiny bugs."], ["🐸", "The frogs", "Then the frogs."], ["🔴", "The red water", "And then the red water."]
], "Not that one yet. Rain, locusts, bugs, frogs, red water.");

chapter("m16", "🌙", "Leaving by Night", "26:60-62", ["20:77"], null);
s("a", "night", "At last, Allah told Musa: leave by night, with My servants.",
  "A moonlit night in a quarter of small mud-brick homes: {MU} walks quietly from door to door with his staff, a finger to his lips, as families peek out with small oil lamps.", { mood: "longing" });
p("count", "wake", "night", "Quietly wake the families. Tap each house to light its lamp.", { total: 8, icon: "🏠", got: "🏮" });
s("b", "night", "Quietly, quietly, in the dark, the families took what they could carry, and followed Musa out of Egypt.",
  "A long line of {FOLK} walks out of a sleeping river city under a starry sky, carrying bundles and children, some leading donkeys and goats; {MU} leads at the front with his staff.", { mood: "trek" });
p("journey", "leave", "night", "Lead the people out of Egypt.", { from: "🏘️", to: "🌊", icon: "img:icon-musa", steps: 8 });
s("c", "dawn", "When Pharaoh found out, he was furious. He gathered a huge army and chased after them. At sunrise, he caught up.",
  "Sunrise over the desert: {PH} in a golden chariot leads {ARMY} in a long line raising a great cloud of dust.", { mood: "dread", cue: "thunder" });
s("d", "sea", "In front of the people was the sea. Behind them was Pharaoh's army. The people cried: we are caught!",
  "On a wide seashore at sunrise, {FOLK} huddle at the water's edge looking back in fear at a dust cloud and distant chariots on the horizon; waves roll in front of them.", { mood: "dread" });
s("e", "sea", "But Musa said: no! My Lord is with me. He will guide me.",
  "{MU} stands tall and calm on the seashore facing the waves, staff in hand, robe blowing in the wind, while frightened {FOLK} gather behind him.", { mood: "awe" });
q("q", "sea", "What did Musa say when everyone was afraid?", ["My Lord is with me", "💛"], ["We are lost", "😱"], "No. Musa said: my Lord is with me. He will guide me.", { img: "e" });
p("puzzle", "puz", "sea", "Put the picture back together. Tap two pieces to swap them.", { pic: "m16-e", n: 3 });

chapter("m17", "🌊", "The Sea Opens", "26:63-66", ["20:77-78", "10:90-92"], null);
s("a", "sea", "Allah told Musa: strike the sea with your staff.",
  "{MU} raises his wooden staff high in both hands over the edge of the sea, waves at his feet, wind in his robe, dawn light behind him.", { mood: "awe" });
p("part", "part", "sea", "Strike the sea! Press the staff and hold, and watch.", { ms: 3600, icon: "STAFF" });
s("b", "sea", "And the sea split in two! Each side stood up like a huge mountain, with a dry path in between.",
  "The sea stands split into two towering walls of blue-green water with a wide dry sandy path between them; tiny figures of people begin to walk in; fish can be seen inside the water walls; dawn sky.", { mood: "awe", cue: "roar" });
s("c", "sea", "It is told that there were twelve paths, one for each of the twelve families, with windows in the water so that they could see each other. And Allah sent the wind to dry the ground.",
  "Families walk along a dry sandy path between two high walls of clear blue water; through arched openings in the water wall they wave to other families walking on a neighbouring path; fish swim in the walls.", { src: TAF, mood: "triumph" });
p("wipe", "dry", "sea", "Help the wind dry the path. Rub away the water.", { cover: "water" }, { src: TAF, img: "b" });
p("count", "paths", "sea", "Count the twelve paths. Tap each one.", { total: 12, icon: "🌊", got: "👣" }, { src: TAF });
p("journey", "cross", "sea", "Walk the people across, between the walls of water.", { from: "🏖️", to: "🌅", icon: "img:icon-musa", steps: 8 }, { img: "b" });
s("d", "sea", "Musa and all his people crossed safely to the other side.",
  "{FOLK} climb out onto the far shore, hugging each other with relief and joy, the split sea behind them; {MU} and {HA} help the last ones up.", { mood: "triumph" });
s("e", "sea", "Pharaoh and his army rushed in after them. Then the sea came crashing back together, and the army was gone.",
  "Seen from far away on the shore: the two great walls of water crash together in a huge burst of foam and spray; no people visible, only the wild sea under a bright sky.", { mood: "dread", cue: "roar" });
s("f0", "sea", "As the water closed over him, Pharaoh cried: I believe in the God that the Children of Israel believe in! But it was too late.", "An empty stormy sea: a towering dark wave curls over churning water under grey clouds, and a tall blue-and-gold striped royal headdress floats alone on the foam. Nobody at all in the picture: no people, no crowd, no shore.", { mood: "dread" });
s("f", "sea", "All his life he had been proud and cruel. Allah saved only his body, as a sign for the people who came after.",
  "An empty sandy shore at the edge of a calm sea in the morning: a single tall blue-and-gold striped Nile-valley king's headdress (not a European crown) lies alone on the wet sand, small waves lapping around it. Nobody at all in the picture.", { mood: "longing" });
s("g", "dawn", "The people were free! That day is called Ashura. Prophet Muhammad, peace be upon him, told the Muslims to fast on that day.",
  "On a sunny seashore, {FOLK} celebrate with raised hands, children dancing and playing in the sand, the calm sea sparkling behind them.", { src: HAD, mood: "triumph" });
q("q", "dawn", "Who saved Musa and his people?", ["Allah", "✨"], ["A big boat", "⛵"], "No, there was no boat. Allah opened the sea for them.", { img: "g" });
ord("ord", "sea", "Tell the story of the sea. Tap in order.", [
  ["😨", "Caught at the sea", "First, they were caught between the sea and the army."],
  ["STAFF", "Musa strikes the sea", "Then Musa struck the sea with his staff."],
  ["👣", "A dry path", "Then a dry path opened, and everyone crossed."],
  ["🌊", "The sea closes", "And then the sea closed again."]
], "Not that one yet. What came before it?");
