/* Chapters 1 to 6: leaving home, the old man of Alexandria, the broken dish, Makkah, the brothers, a judge in Delhi. */
"use strict";
const { chapter, s, p, q, ord, srt, RIH } = require("./lib");

chapter("i1", "🧳", "Leaving Home", null, [], null, "The Rihla, tr. Gibb, vol. I, pp. 7-8");
s("a", "city", "Long ago, in the year 1325, in the city of Tangier in Morocco, there lived a young man called Ibn Battuta.",
  "Tangier long ago, seen from a hill at sunrise: white houses with flat roofs and a mosque tower climbing a hill above a blue bay, boats in the harbour. No people in front.", { mood: "wonder" });
s("b", "dawn", "He wanted to go on Hajj to Makkah, and to visit the Prophet's mosque in Madina. It was very, very far away.",
  "{IBY} stands on a hill above Tangier at dawn, looking east into the far distance, the sea shining behind him, wind in his cloak.", { src: RIH });
s("c", "city", "He set out alone, with no friend and no caravan. His father and mother were very sad to see him go, and so was he.",
  "At the wooden door of a white house in Tangier, {IBY} says goodbye to his old parents, Moroccans with warm brown skin: his father in a white robe and turban holds his hand, his mother in a long dress and a headscarf that covers all her hair wipes a tear.", { src: RIH, mood: "sad" });
srt("pack", "city", "What does a traveller need? Pack his bag.", ["Pack it", "🎒"], ["Leave it", "🏠"], [
  ["💧", "A water skin", 0], ["🛏️", "A big bed", 1], ["🍞", "Bread and dates", 0],
  ["🧥", "A warm cloak", 0], ["🪑", "A heavy table", 1], ["📦", "A box of toys", 1]
], "Think again. Could he carry that all the way to Makkah?", { img: "c" });
s("d", "desert", "He said that he left his home as birds leave their nests.",
  "{IBY} walks along a dusty road beside the sea, away from the town, while small birds fly up from a nest in a tree beside the road.", { src: RIH, mood: "longing" });
q("q", "desert", "Why did Ibn Battuta leave home?", ["To go on Hajj to Makkah", "🕋"], ["To find treasure", "💰"], "He set out to go on Hajj, to Makkah.", { img: "d" });

chapter("i2", "🧓", "The Old Man of Alexandria", null, [], null, "The Rihla, tr. Gibb, vol. I, pp. 18, 22-23");
s("a", "sea", "After many months he reached Alexandria, a great city by the sea in Egypt. He went to see its famous lighthouse.",
  "Alexandria long ago: a great old stone lighthouse tower on the shore of a blue sea, a busy harbour with sailing ships, and {IBY} looking up at it in wonder.", { src: RIH, mood: "wonder" });
s("b", "city", "There he met a kind old teacher, Burhan al-Din. The old man smiled and said: I see that you love to travel!",
  "In a simple room with a small window, a kind old Egyptian teacher with a white beard and a walking stick sits on a mat, smiling at {IBY}, who sits before him listening.", { src: RIH });
s("c", "city", "Then he said: you will visit my brothers, in India, in Sind and in China. Give them my greetings.",
  "The old Egyptian teacher with the white beard raises his hand and points towards the far east through the window, while {IBY} looks out in surprise.", { src: RIH, mood: "awe" });
s("d", "sea", "Ibn Battuta was amazed. He had never thought of going so far! But many years later, he met all three, and gave them the greetings.",
  "{IBY} stands at the side of a sailing ship on a wide sea at sunset, looking towards the horizon with a hopeful smile.", { src: RIH, mood: "wonder" });
p("memory", "lands", "sea", "Find the pairs! Things he would see on his travels.", { icons: ["🐪", "⛵", "🕌", "🌴", "🐘", "🏮"] }, { img: "d" });
q("q", "city", "What did the old man ask him to do?", ["Greet his brothers far away", "👋"], ["Go straight back home", "🏠"], "He asked him to greet his brothers in India, Sind and China.", { img: "c" });

chapter("i3", "🍽️", "The Broken Dish", null, [], null, "The Rihla, tr. Gibb, vol. I, p. 147");
s("a", "city", "In the city of Damascus, in Syria, people loved to do good. They gave money for travellers, and to make the streets better.",
  "A street of old Damascus: stone houses with wooden balconies, a paved path on each side of the road, Syrian people walking, a fountain; every woman's hair covered by a headscarf.", { src: RIH });
s("b", "city", "One day Ibn Battuta saw a young servant boy drop a beautiful china dish in the street. Crash! It broke into pieces.",
  "In a stone lane of Damascus, a Syrian boy of about ten stares in shock at a blue-and-white porcelain dish broken into pieces at his feet, while {IBY} watches nearby.", { src: RIH, mood: "tense" });
s("c", "city", "The people said: pick up the pieces, and take them to the keeper of the dish fund!",
  "Kind Syrian men gather round the boy in the lane, one pointing helpfully down the street, as the boy gathers the broken blue-and-white pieces into his hands.", { src: RIH });
s("d", "city", "The keeper gave the boy money for a new dish. So nobody scolded him, and he was not sad any more.",
  "In a small office with shelves of dishes, an old Syrian man with a grey beard gives coins to the smiling boy, who holds the broken pieces; {IBY} smiles in the doorway.", { src: RIH, mood: "joy" });
p("puzzle", "mend", "city", "Mend the picture! Put the pieces together.", { pic: "i3-d", n: 2 });
s("e", "city", "Ibn Battuta said: this is one of the best good deeds. It mends hearts.",
  "{IBY} sits at a low table in a courtyard with a fountain in Damascus, writing in a small notebook with a reed pen and smiling to himself.", { src: RIH });
srt("hearts", "city", "Does it mend a heart, or break it? Sort them.", ["Mends a heart", "💛"], ["Breaks a heart", "💔"], [
  ["🤝", "Helping someone who dropped something", 0], ["😆", "Laughing at a mistake", 1], ["🍪", "Sharing your snack", 0],
  ["😠", "Shouting at someone", 1], ["🤗", "Saying: it's all right", 0], ["🗣️", "Telling everyone about it", 1]
], "Think again. Would that make someone feel better, or worse?", { img: "e" });

chapter("i4", "🕋", "Makkah", "22:27", [], null);
s("a", "desert", "At last, after a long journey across the desert with a great caravan of camels, Ibn Battuta reached Makkah.",
  "A long caravan of camels and pilgrims crosses a wide desert towards rocky hills at golden hour; {IBY} rides a camel near the front, looking ahead with joy.", { src: RIH, mood: "trek" });
s("b", "city", "He saw the Ka'bah, the House of Allah, with people from every land walking around it.",
  "The Ka'bah draped in black cloth in the middle of the great mosque of Makkah long ago, pilgrims in simple white clothes walking around it, people of many lands; every woman's hair covered. In front, exactly one young man, {IBY}, now in two plain white pilgrim cloths instead of his cloak, watches in awe; he appears only once.", { mood: "awe" });
s("c", "city", "Allah says in the Qur'an: proclaim the Pilgrimage to all people. They will come to you on foot and on every kind of swift mount, from every deep mountain pass.",
  "Pilgrims in white from many lands arrive at Makkah along a mountain road, some walking, some on camels and horses, the town of Makkah in the valley below. Every woman's hair is covered.", { mood: "awe" });
ord("hajj", "city", "Some steps of the Hajj. Put them in order.", [
  ["⚪", "Put on simple white clothes", "First, the pilgrims put on simple white clothes."],
  ["🕋", "Walk around the Ka'bah", "They walk around the Ka'bah."],
  ["⛰️", "Pray at Arafat", "They stand on the plain of Arafat and pray."],
  ["🐑", "Celebrate Eid", "Then they celebrate Eid."]
], "Listen again, and put the steps in order.", { img: "c" });
s("d", "dawn", "After his Hajj, Ibn Battuta did not go home. He wanted to see more of the world.",
  "At dawn {IBY} stands on a hill outside Makkah with his bag on his shoulder, looking out over many roads leading away in different directions.", { src: RIH, mood: "wonder" });
q("q", "city", "What do pilgrims wear on Hajj?", ["Simple white clothes", "⚪"], ["Party costumes", "🎭"], "Pilgrims wear simple white clothes, all the same, rich and poor.", { img: "b" });

chapter("i5", "🤝", "Brothers Who Welcome Strangers", null, [], null, "The Rihla, tr. Gibb, vol. II, pp. 417-419");
s("a", "village", "In the land that is now Turkey, Ibn Battuta met groups of young men called the Akhis. Akhi means my brother.",
  "A town of Anatolia long ago with wooden houses and a small mosque on green hills; a group of cheerful young Turkish men in tunics, felt caps and boots greet {IB} warmly in the street.", { src: RIH, mood: "joy" });
s("b", "village", "They worked all day. In the evening they put their money together to buy food, for any traveller who came to their town.",
  "In the evening, young Turkish men put coins together into a cloth bag and carry baskets of bread, fruit and food into a warm lamplit guesthouse.", { src: RIH });
s("c", "village", "Ibn Battuta said: nowhere in the world are there people like them in caring for strangers.",
  "Inside a lamplit guesthouse with rugs on the floor, {IB} sits with travellers eating from big bowls while the young Turkish men serve them food, smiling.", { src: RIH, mood: "joy" });
p("count", "bowls", "village", "Serve the travellers! Tap each bowl.", { total: 6, icon: "🍲", got: "😊" }, { img: "c" });
q("q", "village", "What did the brothers do for travellers?", ["Gave them food and a place to stay", "🍲"], ["Sent them away", "🚫"], "They gave every traveller food and a place to stay.", { img: "b" });

chapter("i6", "⚖️", "A Judge in Delhi", null, [], null, "The Rihla, tr. Gibb, vol. III, pp. 746-747");
s("a", "palace", "Ibn Battuta travelled on, over high mountains, to India. In the great city of Delhi lived a powerful Sultan.",
  "The great city of Delhi long ago: high stone walls and domes, a crowded gate with Indian people in colourful clothes, elephants and horses; every woman and girl wears a scarf that covers all of her hair, with no hair showing at the front.", { src: RIH, mood: "awe" });
s("b", "palace", "The Sultan made Ibn Battuta a judge, a qadi. He said: this is the highest of all jobs.",
  "On the terrace of a grand palace, a stern Indian Sultan with a dark beard and a jewelled turban sits on a royal couch and speaks to {IB}, who bows his head respectfully; courtiers stand by.", { src: RIH });
s("c", "palace", "But Ibn Battuta did not know the language there! So the Sultan gave him two helpers.",
  "{IB} sits at a low judge's table with two kind Indian scholars in white turbans on either side of him, one explaining something from a book.", { src: RIH });
srt("fair", "palace", "A good judge is fair. Is it fair, or not?", ["Fair", "⚖️"], ["Not fair", "🙅"], [
  ["👂", "Listening to both sides", 0], ["🎁", "Taking a present to help one side", 1], ["🤲", "The same rules for rich and poor", 0],
  ["😤", "Deciding before listening", 1], ["✅", "Telling the truth", 0], ["👯", "Helping only your friends", 1]
], "Think again. Would that be fair to everyone?", { img: "c" });
