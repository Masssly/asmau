/* Chapters 1 to 5: from Abyssinia, a baby is born, a month in Madina, the road home, "O blessed one". */
"use strict";
const { chapter, s, p, q, ord, SAD, ZUH } = require("./lib");

chapter("u1", "⛵", "From Across the Sea", null, [], null, "Ibn Shihab in Sahih Muslim (1771); Ibn Sa'd, al-Tabaqat");
s("a", "sea", "Long ago, across the Red Sea from Arabia, there was a green land of high mountains called Abyssinia. Today we call it Ethiopia and Eritrea.",
  "Green highlands of Abyssinia long ago: high mountains, deep valleys, terraced fields and round houses with cone-shaped thatched roofs, morning mist. No people.", { mood: "wonder" });
s("b", "sea", "A girl called Barakah came from there, across the sea, to the town of Makkah. Barakah means blessing.",
  "{UAY} stands at the side of a small wooden sailing boat on the blue Red Sea, holding the rail and looking ahead at the far shore of Arabia, the wind in her headscarf.", { src: ZUH });
p("journey", "sail", "sea", "Help Barakah's boat cross the sea to Arabia.", { from: "⛰️", to: "🏜️", icon: "⛵", steps: 6 }, { img: "b" });
s("c", "city", "In Makkah she lived in the house of a young man called Abdullah. She was not free: she had to work for his family.",
  "{UAY} carries a clay water jar on her shoulder along a narrow lane of {MAKKAH} in the early morning, other people far behind her.", { src: ZUH });
s("d", "city", "Abdullah married a kind young woman called Amina. But soon Abdullah went away on a journey, and he died, far from home.",
  "Inside a simple room with a small window, {AMINA} sits on a cushion looking sad, and {UAY} kneels beside her with a comforting hand on her shoulder; soft light.", { src: SAD, mood: "sad" });
q("q", "city", "Where did Barakah come from?", ["From Abyssinia, across the sea", "⛵"], ["From the next street", "🏘️"], "Barakah came from Abyssinia, across the sea.", { img: "c" });

chapter("u2", "🍼", "A Baby Is Born", null, [], null, "Ibn Shihab in Sahih Muslim (1771); Ibn Sa'd, al-Tabaqat");
s("a", "night", "Then Amina had a baby boy. He was called Muhammad, peace and blessings be upon him.",
  "At night in a simple room lit by a small oil lamp, {AMINA}, her headscarf covering her forehead and every strand of her hair, rests on cushions smiling, and {UAY} kneels beside a wooden cradle covered with a soft white cloth canopy, smiling with joy; the inside of the cradle is not seen. {HERE}.", { mood: "wonder", presence: true });
s("b", "dawn", "Barakah loved the baby. She helped his mother look after him, by day and by night.",
  "In the early morning light, {UAY} gently rocks a wooden cradle with a white cloth canopy over it, singing softly; the inside of the cradle is not seen. {HERE}.", { src: ZUH, presence: true });
p("hold", "rock", "dawn", "Rock the cradle gently. Press and hold, until he is fast asleep.", { ms: 2500, icon: "🌙", hint: "Press and hold", done: "Fast asleep" }, { img: "b" });
s("c", "city", "The baby's father, Abdullah, had left five camels, some sheep, and Barakah, who looked after the baby.",
  "In a dusty yard of a mud-brick house in {MAKKAH}, a single row of exactly five camels (one, two, three, four, five), all fully in view, rest side by side and a few sheep graze, while {UAY} carries a bundle of hay towards them.", { src: SAD });
p("count", "camels", "city", "Count the five camels. Tap each one.", { total: 5, icon: "🐪", got: "✨" }, { img: "c" });
q("q", "dawn", "Who helped Amina look after baby Muhammad?", ["Barakah", "🤲"], ["Nobody at all", "🚫"], "Barakah helped his mother look after him, by day and by night.", { img: "b" });

chapter("u3", "🕊️", "A Month in Madina", null, [], null, "Ibn Sa'd, al-Tabaqat (vol. 1)");
s("a", "desert", "When Muhammad was six, his mother took him to visit her family in the town of Yathrib, which later was called Madina. Barakah went with them, on two camels.",
  "In the morning, {CAMELS} walk along a rocky desert road; {AMINA} rides the first camel and {UAY} walks beside the second, holding its rope. {HERE}.", { src: SAD, presence: true });
s("b", "field", "They stayed a whole month with his mother's family, among the date palms.",
  "In a courtyard of a mud-brick house among date palms, {UAY} and {AMINA} sit on a mat with two kind relatives, a grey-bearded man and an older woman; every woman's headscarf covers her forehead and every strand of her hair; sharing a plate of dates and cups of milk.", { src: SAD });
s("c", "field", "Many years later, the Prophet remembered that month. He said that he learned to swim in a pond there, and flew pigeons with the boys.",
  "A small round pond among date palms, its water rippling, white and grey pigeons flying up into the blue sky above it. No people at all.", { src: SAD, mood: "joy", presence: true });
p("count", "pigeons", "field", "Count the pigeons! Tap each one.", { total: 7, icon: "🕊️", got: "✨" }, { img: "c" });
p("memory", "pairs", "field", "Find the pairs! Things they saw in Madina.", { icons: ["🌴", "🐪", "🕊️", "💧", "🏠", "🌙"] }, { img: "b" });

chapter("u4", "🐪", "The Road Home", "93:6", [], null);
s("a", "dusk", "On the way home, at a place called al-Abwa, his mother Amina fell ill.",
  "At sunset beside a lone acacia tree at a desert stopping place, a small tent stands with {CAMELS} kneeling beside it; {UAY} carries a bowl of water into the tent, looking worried.", { src: SAD, mood: "sad" });
s("b", "dusk", "And there, Amina died. Barakah stayed close to the little boy, and they were sad together.",
  "At dusk under the lone acacia tree, {UAY} sits with her head bowed and her hand on her heart beside a small low grave of stones; the camels rest behind her. {HERE}.", { src: SAD, mood: "sad", presence: true });
s("c", "night", "Then Barakah brought him home to Makkah, on the two camels.",
  "At night under a sky full of stars, {UAY} leads {CAMELS} along a desert road, looking ahead bravely, a small lamp hanging from the first saddle. {HERE}.", { src: SAD, mood: "longing", presence: true });
p("journey", "home", "night", "Help Barakah bring him home to Makkah.", { from: "🌳", to: "🏠", icon: "🐪", steps: 7 }, { img: "c" });
s("d", "dawn", "Allah says to the Prophet in the Qur'an: Did He not find you an orphan and shelter you?",
  "At sunrise, {UAY} leads {CAMELS} down into the valley of {MAKKAH}, the first light on the hills and the houses. {HERE}.", { mood: "triumph", presence: true });
q("q", "dawn", "Who brought the little boy home to Makkah?", ["Barakah, on the camels", "🐪"], ["He walked home alone", "🚶"], "Barakah brought him home, on the two camels.", { img: "d" });

chapter("u5", "🌟", "O Blessed One", null, [], null, "Ibn Sa'd, al-Tabaqat (vol. 1)");
s("a", "city", "In Makkah, his grandfather Abd al-Muttalib looked after him. He was a great old man of Makkah.",
  "{GRAND} sits on a rug in the shade of a stone wall in {MAKKAH}, smiling warmly at an empty cushion beside him. {HERE}.", { src: SAD, presence: true });
s("b", "city", "He said to Barakah: O blessed one! Look after this son of mine, and never forget him.",
  "{GRAND} speaks kindly to {UAY}, one hand raised; she listens, her hand on her heart, nodding.", { src: SAD });
q("q", "city", "What did the grandfather call Barakah?", ["O blessed one", "🌟"], ["O lazy one", "😴"], "He called her: O blessed one. That is what Barakah means.", { img: "b" });
s("c", "dusk", "But when the boy was eight, his grandfather died too. Barakah saw the boy crying as he walked behind his grandfather's funeral.",
  "At dusk {UAY} stands in a doorway in {MAKKAH} with tears in her eyes, watching a quiet line of men walk away down the lane in the distance.", { src: SAD, mood: "sad" });
s("d", "city", "Then his uncle Abu Talib took him into his home, and loved him like his own son.",
  "Only two people in the whole picture, nobody else and no one at the edges: in front, {UNCLE} stands at the open door of his house in {MAKKAH}, smiling, with his arms open wide in welcome; beside him {UAY} watches, smiling with relief. {HERE}.", { src: SAD, mood: "joy", presence: true });
ord("care", "city", "Who looked after him, one after the other? Put them in order.", [
  ["🤱", "His mother Amina", "First, his mother Amina, with Barakah."],
  ["👴", "His grandfather", "Then his grandfather, Abd al-Muttalib."],
  ["🧔", "His uncle Abu Talib", "Then his uncle, Abu Talib."]
], "Listen again, and put them in order.", { img: "d" });
