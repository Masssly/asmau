/* Chapters 7 to 11: they laughed, two by two, bismillah, the big waves, the humble mountain. */
"use strict";
const { chapter, s, p, q, ord, line, TAF, BOTH } = require("./lib");

chapter("n7", "😏", "They Laughed", "11:38-39", [], null);
s("a", "field", "Every time the proud chiefs walked past, they laughed at Nuh and his big ship.",
  "{CHIEFS} point and laugh at the half-built {ARK} standing on wooden props in a field, while {NUH} keeps working on it calmly.", { mood: "tense" });
s("b", "field", "Nuh said: you laugh at us now. But one day, you will see who was right.",
  "{NUH} looks down calmly from a ladder against the side of {ARK}, a hammer in his hand, speaking to the laughing men below.");
q("q", "field", "What did Nuh do when people laughed at him?", ["Kept on building", "🔨"], ["Gave up", "😞"], "Nuh did not give up. He kept on building, patiently.", { img: "b" });
s("c", "dusk", "So Nuh kept on building, patiently, day after day, until the Ark was ready.",
  "At sunset the great {ARK} stands finished in a wide field, its long wooden roof glowing in the orange light; {NUH} rests his hand on its side, smiling quietly.", { mood: "triumph" });
p("hold", "patient", "dusk", "Be patient, like Nuh. Press and hold the hammer until the Ark is ready.", { ms: 3000, icon: "🔨", hint: "Press and hold", done: "Patient, like Nuh" }, { img: "c" });

chapter("n8", "🐘", "Two by Two", "11:40", ["23:27", "54:11-12"], null);
s("a", "storm", "Then Allah's command came. Water burst up out of the ground, even, it is told, where fires had burned.",
  "Water bursts up out of the dry ground in many places in a field beside the finished {ARK}, springs fountaining up between stones and an old cooking hearth, under a darkening sky. No people.", { src: TAF, mood: "tense" });
s("b", "storm", "And the gates of the sky opened, and the rain poured down.",
  "Heavy rain pours from dark rolling clouds over {VILLAGE}; puddles grow into streams between the round houses. No people anywhere: every doorway and porch is empty.", { mood: "tense" });
s("c", "field", "Allah said: take into the Ark a pair of every kind of animal.",
  "Animals walk two by two up a long wooden ramp into {ARK} in the rain: a pair of elephants, a pair of camels, a pair of giraffes, a pair of sheep, a pair of lions, birds flying in above them. No people at all, and nothing modern.", { mood: "joy" });
p("memory", "pairs", "field", "Find the pairs! Two of every kind.", { icons: ["🐘", "🐪", "🦒", "🐑", "🦁", "🐦"] });
p("journey", "board", "field", "Lead the animals into the Ark.", { from: "🌾", to: "🚢", icon: "🐘", steps: 6 }, { img: "c" });
s("d", "field", "And Nuh took his family, and the believers. Only a few believed with him. It is told there were about eighty of them.",
  "{BELIEVERS} climb the ramp into {ARK} carrying bundles and holding children's hands, while {NUH} helps an old woman up the last step. Every woman's hair is covered.", { src: BOTH });

chapter("n9", "🤲", "Bismillah", "11:41", ["23:28-29"], null);
s("a", "storm", "Nuh said: get on board. In the name of Allah it sails, and in the name of Allah it comes to rest. My Lord is Forgiving and Merciful.",
  "{NUH} stands in the open doorway of {ARK} in the rain, one hand raised, the other welcoming the last of {BELIEVERS} inside; lamplight glows warmly from within.");
s("b", "storm", "We can say these words too, when we set off on a journey: bismillahi majraha wa mursaha.",
  "Inside {ARK}, a mother and her young daughter sit together on a wooden bench by a small oil lamp, hands raised in prayer, rain streaming past a window. Both have deep dark brown skin and their hair covered by headscarves. The scene fills the whole picture, with no border or frame.");
q("q", "storm", "What can we say when we set off on a journey?", ["Bismillah", "🤲"], ["Nothing at all", "🤐"], "We can say bismillah, in the name of Allah, just like Nuh.", { img: "b" });
s("c", "storm", "Allah taught Nuh to say, once they were on board: praise be to Allah, who saved us. And: my Lord, let me land in a blessed place.",
  "{NUH} sits among {BELIEVERS} inside {ARK} by lamplight, all with hands raised in prayer, animals resting quietly in the shadows behind them.", { mood: "wonder" });
ord("dua", "storm", "Say the prayer with Nuh. Tap the parts in order.", [
  ["🤲", "Praise be to Allah", "Praise be to Allah,"],
  ["🛟", "who saved us", "who saved us from the wrongdoing people."],
  ["🙏", "My Lord, let me land", "My Lord, let me land"],
  ["✨", "in a blessed place", "in a blessed place. You are the best one to bring us to land."]
], "Listen again, and say the prayer in order.", { img: "c" });

chapter("n10", "🌊", "The Big Waves", "11:42-47", [], null);
s("a", "storm", "The Ark sailed on, over waves as high as mountains.",
  "Wide view: the great {ARK} rides on enormous dark waves under a stormy sky, lightning far away, its lamps glowing safely in its windows. No people are seen outside.", { mood: "dread" });
p("hold", "steady", "storm", "Hold on tight! Press and hold the Ark to keep it steady.", { ms: 2500, icon: "🚢", hint: "Press and hold", done: "Safe in the Ark" }, { img: "a" });
s("b", "storm", "Nuh saw his son, who had stayed behind. He called out: my son, come on board with us! Do not stay with those who do not believe.",
  "{NUH} leans out from the side of {ARK} in the rain, calling with his arm stretched out toward a distant rocky hill where {SON} stands, small and far away.", { mood: "tense" });
s("c", "storm", "But his son said: I will climb a mountain. It will keep me safe from the water.",
  "On a rocky hillside in the rain, {SON} turns his back on the sea and starts to climb, arms folded, face proud; the Ark is far away behind him on the water.");
s("d", "grey", "Nuh said: today nothing can keep anyone safe from Allah's command, except the ones He has mercy on. And the waves came between them.",
  "Huge grey waves roll across the sea between the far-off {ARK} and a mountain hidden in rain and mist. No people are seen.", { mood: "sad" });
q("q", "grey", "Who keeps us safe, more than any mountain?", ["Allah", "✨"], ["A high mountain", "⛰️"], "No mountain could keep anyone safe that day. Only Allah keeps us safe.", { img: "d" });
s("e", "grey", "Nuh was very sad. He said: my Lord, my son is part of my family! And Allah told him: he was not one of your family, because what he did was not right.",
  "Inside {ARK} by a small window, {NUH} sits with his head bowed and his hands raised in prayer, grey light on his face, rain on the glass.", { mood: "sad" });
s("f", "grey", "Nuh said: my Lord, keep me from asking for what I do not understand. Forgive me, and have mercy on me.",
  "{NUH} kneels in prayer inside {ARK}, forehead to the wooden floor, a small lamp beside him; the storm outside the window is growing calmer.", { mood: "longing" });

chapter("n11", "⛰️", "The Humble Mountain", "11:44", ["11:48", "17:3", "71:28"], null);
s("a", "dawn", "Then it was said: earth, swallow up your water! Sky, hold back your rain! And the water went down.",
  "The storm clouds part and golden sunlight pours down on a calm sea; the water is going down around green hilltops, and {ARK} floats peacefully. No people are seen.", { mood: "triumph" });
p("wipe", "dry", "dawn", "Help the water go down. Rub it away.", { cover: "water" }, { img: "a" });
s("b", "mountain", "And the Ark came to rest on a mountain called al-Judi.",
  "{ARK} rests on the green top of a mountain in soft morning light, the last of the water shining far below, a clear sky above.", { mood: "wonder" });
s("c", "mountain", "It is told that all the mountains stretched up tall and proud that day, but al-Judi stayed humble, so the Ark came to rest on it.",
  "A ring of tall rocky peaks stands high and sharp around one lower, gentle green mountain where {ARK} rests in the sunshine. No people.", { src: BOTH });
q("q", "mountain", "Why did the Ark rest on al-Judi, it is told?", ["It was humble", "🙇"], ["It was the tallest", "🗻"], "It is told that al-Judi was humble, and Allah loves the humble.", { img: "c" });
s("d", "mountain", "Allah said: Nuh, go down in peace, with blessings on you and on those with you.",
  "{NUH} and {BELIEVERS} walk down a green mountainside in the morning, animals spreading out over the fresh grass around them, a clear blue sky above.", { mood: "joy" });
s("e", "dawn", "Nuh was a truly thankful servant of Allah.",
  "{NUH} kneels on the fresh grass at sunrise with his hands raised in thanks, the Ark on the mountain far behind him.", { mood: "triumph" });
s("f", "dawn", "And Nuh prayed: my Lord, forgive me, and my parents, and everyone who comes into my house believing, and all the believing men and women.",
  "{NUH} stands at the door of a small new house of stone and wood in a green valley, welcoming {BELIEVERS} inside, hands open; morning light.");
ord("forgive", "dawn", "Say Nuh's prayer. Tap the parts in order.", [
  ["🤲", "My Lord, forgive me", "My Lord, forgive me,"],
  ["👪", "and my parents", "and my parents,"],
  ["🏠", "and everyone in my house", "and everyone who comes into my house believing,"],
  ["🌍", "and all the believers", "and all the believing men and women."]
], "Listen again, and say the prayer in order.", { img: "f" });
ord("story", "dawn", "Tell the whole story of Nuh. Tap in order.", [
  ["🗿", "People forgot Allah", "First, the people forgot Allah and prayed to statues."],
  ["🌟", "Nuh called them", "Nuh called them, night and day, for many years."],
  ["🪵", "He built the Ark", "Allah told him to build the Ark."],
  ["🐘", "Two by two", "The animals came in, two by two, with the believers."],
  ["🌊", "The big waves", "The Ark sailed over waves like mountains."],
  ["⛰️", "Al-Judi", "And the Ark came to rest on the humble mountain."]
], "Listen again, and tell it in order.", { img: "e" });

line("end-a", "This is the story of Nuh, peace be upon him. He called his people for a very long time, and he never gave up. Allah saved him and the believers in the Ark. And Nuh was a truly thankful servant.");
