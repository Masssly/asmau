/* Chapters 7 to 11: two thousand islands, the kind Sultan of Sumatra, China, home again, Mali and the book. */
"use strict";
const { chapter, s, p, q, ord, line, RIH } = require("./lib");

chapter("i7", "🏝️", "Two Thousand Islands", null, [], null, "The Rihla, tr. Gibb and Beckingham, vol. IV, pp. 821-822");
s("a", "sea", "Later he sailed to the Maldives, tiny islands in the ocean. He said they were one of the wonders of the world: about two thousand islands!",
  "From the air: rings of tiny green islands with white beaches in a bright turquoise ocean, coconut palms on each, a small sailing ship coming through a gap in the ring of coral.", { src: RIH, mood: "wonder" });
s("b", "sea", "The people there were all Muslims, good and kind.",
  "On a white beach under coconut palms, Maldivian men and women with brown skin in simple clothes welcome {IB} as he steps off a small boat; every woman's hair covered by a headscarf.", { src: RIH, mood: "joy" });
s("c", "field", "Coconut palms grew everywhere. People ate fish and coconuts, and made milk, oil and sweets from the coconut.",
  "Under tall coconut palms, Maldivian people open coconuts, pour coconut milk into bowls and lay out fish to dry on palm-leaf mats; every woman's hair covered.", { src: RIH });
p("catch", "coconuts", "field", "Catch the falling coconuts!", { target: 8, icon: "🥥", into: "🧺" }, { img: "c" });
s("d", "sea", "The islands were so close together that from one, you could see the tops of the palm trees on the next.",
  "Seen from one island's beach at sunset, the green tops of palm trees on the next small island across the calm water. No people.", { src: RIH, mood: "longing" });
q("q", "field", "What grew everywhere on the islands?", ["Coconut palms", "🌴"], ["Apple trees", "🍎"], "Coconut palms grew everywhere on the islands.", { img: "c" });

chapter("i8", "🥭", "The Kind Sultan of Sumatra", null, [], null, "The Rihla, tr. Gibb and Beckingham, vol. IV, pp. 875-877");
s("a", "sea", "Then he sailed east to the island of Sumatra, in what is now Indonesia.",
  "A big wooden Indian Ocean trading ship of the 14th century with matting sails (not a European ship) arrives at a green tropical island with tall forested hills and a harbour village of wooden houses on stilts by the sea.", { src: RIH, mood: "wonder" });
s("b", "sea", "People came out to the ship in little boats, with coconuts, bananas, mangoes and fish as gifts.",
  "Sumatran people with brown skin paddle small wooden boats up to the side of a big ship, holding up coconuts, bunches of bananas, mangoes and fish; {IB} smiles down from the ship. Every woman's hair covered.", { src: RIH, mood: "joy" });
p("memory", "gifts", "sea", "Find the pairs! The gifts in the little boats.", { icons: ["🥥", "🍌", "🥭", "🐟", "⛵", "🌴"] }, { img: "b" });
s("c", "palace", "The Sultan, al-Malik al-Zahir, loved learning. Scholars came to read the Qur'an with him, and to talk.",
  "In a wooden palace hall with carved pillars, a kind Sumatran Sultan in a simple robe and cap sits on a mat among scholars in turbans reading from books; {IB} sits with them.", { src: RIH });
s("d", "city", "And he was humble: he walked to the Friday prayer on foot, like everyone else.",
  "The Sumatran Sultan in a simple robe walks on foot along a street of wooden houses towards a wooden mosque with a tiered roof, with ordinary townspeople walking beside him.", { src: RIH, mood: "joy" });
q("q", "city", "How did the Sultan go to Friday prayer?", ["He walked, like everyone", "🚶"], ["On a golden throne", "👑"], "He was humble, and walked to the Friday prayer on foot.", { img: "d" });

chapter("i9", "🏮", "China", null, [], null, "The Rihla, tr. Gibb and Beckingham, vol. IV, pp. 889-892");
s("a", "sea", "Ibn Battuta's ship sailed on and on, far away, to China.",
  "A great Chinese harbour long ago, full of large wooden ships with ribbed sails; {IB} stands at the rail of a ship arriving, looking at the busy port in wonder.", { src: RIH, mood: "wonder" });
s("b", "city", "In China, people paid with money made of paper, as big as your hand!",
  "In a Chinese market long ago, a Chinese merchant hands a small sheet of paper money to {IB}, who holds it up in surprise; stalls of silk and fruit behind them.", { src: RIH, mood: "joy" });
p("count", "notes", "city", "Pay with paper money! Tap each note.", { total: 5, icon: "📜", got: "✅" }, { img: "b" });
s("c", "city", "Ibn Battuta saw beautiful china dishes being made, like the dish the boy broke in Damascus!",
  "In a Chinese pottery workshop, Chinese men paint blue patterns on white porcelain dishes and vases while {IB} watches, delighted. No girls; any woman wears a headscarf that covers all her hair.", { src: RIH });
s("d", "night", "He said: China is the safest and best country for the traveller.",
  "A quiet Chinese town at night with lanterns glowing along a canal and a stone bridge; {IB} walks calmly along the path alone, peaceful and safe.", { src: RIH, mood: "longing" });
q("q", "city", "What was money made of, in China?", ["Paper", "📜"], ["Chocolate", "🍫"], "In China, people paid with paper money.", { img: "b" });

chapter("i10", "🏡", "Home Again", null, [], null, "The Rihla, tr. Gibb and Beckingham, vol. IV, pp. 920-925");
s("a", "sea", "After twenty-four years away, Ibn Battuta set out for home, to Morocco.",
  "{IB} stands at the front of a sailing ship heading west across a calm sea at sunrise, his hand on the rail, looking towards home.", { src: RIH, mood: "longing" });
s("b", "dusk", "On the way, he heard sad news. His mother had died, of a terrible illness. He said: may Allah have mercy on her.",
  "At dusk, {IB} sits on a low wall at the edge of a Moroccan town with his head bowed and his hands raised in prayer, quiet and sad.", { src: RIH, mood: "sad" });
p("hold", "dua", "dusk", "Make a dua for his mother. Press and hold.", { ms: 2500, icon: "🤲", hint: "Press and hold", done: "May Allah have mercy on her" }, { img: "b" });
s("c", "city", "Then he reached Fez, the great city of Morocco, and went to greet the Sultan.",
  "The old city of Fez: a gate decorated with blue and green tiles, a crowded street of Moroccan people in robes and hooded cloaks, and {IB} walking in through the gate; every woman's hair covered.", { src: RIH });
ord("way", "city", "The long way home. Put the places in order.", [
  ["🏮", "China", "First, he left China."],
  ["🐘", "India", "He sailed back past India."],
  ["🕋", "Makkah", "He made Hajj once more in Makkah."],
  ["🏡", "Morocco", "And at last he came home to Morocco."]
], "Listen again, and put the places in order.", { img: "c" });

chapter("i11", "📖", "Mali, and the Book", null, [], null, "The Rihla, tr. Gibb and Beckingham, vol. IV, pp. 964-966; Ibn Juzayy's introduction, vol. I");
s("a", "desert", "But soon he set out again, across the great Sahara desert with a camel caravan, to the land of Mali in West Africa.",
  "A long camel caravan crosses golden sand dunes of the Sahara under a wide blue sky, {IB} riding a camel with a cloth wrapped around his face against the sun.", { src: RIH, mood: "trek" });
p("journey", "sahara", "desert", "Lead the caravan across the Sahara to Mali.", { from: "🏜️", to: "🕌", icon: "🐪", steps: 7 }, { img: "a" });
s("b", "city", "Ibn Battuta wrote that the people of Mali hated injustice, and that travellers there were safe: nobody had to fear robbers.",
  "A busy town in old Mali with buildings of earth and wooden beams, West African people of Mali with deep dark brown skin in flowing robes trading in the street, travellers with camels resting safely; every woman's hair covered.", { src: RIH });
s("c", "city", "On Fridays everyone wore clean white clothes to the mosque. It was so full that people sent their prayer mats early, to keep a place.",
  "A great mosque of Mali built of earth with wooden beams sticking out of its walls, West African men in clean white robes arriving for Friday prayer carrying woven prayer mats; {IB} among them.", { src: RIH, mood: "awe" });
s("d", "city", "And the children worked very hard to learn the Qur'an by heart.",
  "West African boys in white tunics sit on mats in a courtyard of earth walls, holding wooden boards with writing on them and reciting together with their teacher; the boards show only marks too small to read.", { src: RIH });
s("e", "palace", "Back home in Fez, the Sultan asked a writer, Ibn Juzayy, to write down all his travels. That book is still read today.",
  "In a room of a Moroccan palace with tiled walls, {IB} speaks and gestures while a young scribe in a turban writes on long sheets of paper with a reed pen; lamps and books around them.", { src: RIH, mood: "triumph" });
ord("story", "palace", "Tell his whole journey. Tap in order.", [
  ["🧳", "Tangier", "First, he left his home in Tangier."],
  ["🕋", "Makkah", "He made Hajj in Makkah."],
  ["⚖️", "India", "He was a judge in India."],
  ["🏝️", "The islands", "He sailed to the islands of the Maldives."],
  ["🏮", "China", "He reached China."],
  ["🕌", "Mali", "And he crossed the Sahara to Mali."]
], "Listen again, and tell it in order.", { img: "e" });

line("end-a", "This is the story of Ibn Battuta, who travelled for nearly thirty years, from Morocco to China and Mali, and wrote it all down, so that we can travel with him today.");
