/* Chapters 6 to 11: free and a family, the long walk, water for the hurt, ten palm trees, Fatimah's wedding, the news of heaven. */
"use strict";
const { chapter, s, p, q, ord, mat, srt, line, SAD, MUS, ZUH } = require("./lib");

chapter("u6", "🏠", "Free, and a Family", null, [], null, "Ibn Sa'd, al-Tabaqat (vol. 8); Ibn Shihab in Sahih Muslim (1771); al-Bukhari (3737)");
s("a", "city", "The boy grew up to be the most honest man in Makkah. When he married Khadijah, he set Barakah free.",
  "{UAY} stands in a sunny doorway in {MAKKAH}, looking out at the street with a joyful, surprised face, holding a small cloth bundle to her chest. {HERE}.", { src: SAD, mood: "triumph", presence: true });
s("b", "city", "She married a good man called Ubayd, and they had a son called Ayman. So people called her Umm Ayman: the mother of Ayman.",
  "{UA} holds a baby boy wrapped in a cloth and smiles down at him, while {UBAYD} stands beside her, laughing happily, in a courtyard in {MAKKAH}.", { src: SAD, mood: "joy" });
s("c", "city", "The Prophet loved her very much. He used to call her: O mother!",
  "{UA} sits on a bench in a shady courtyard, smiling warmly at the empty place beside her, where a cup of milk waits on a small stool. {HERE}.", { src: SAD, presence: true });
s("d", "field", "It is told that he said: whoever would like to marry a woman of Paradise, let him marry Umm Ayman.",
  "{UA} walks through a garden of date palms in golden evening light, smiling peacefully, birds flying overhead.", { src: SAD, mood: "wonder" });
s("e", "city", "And Zayd, a man the Prophet loved very much, married her. They had a son too, called Usamah.",
  "{ZAYD} and {UA} walk together down a lane in {MAKKAH}, holding the hands of {USAMA} between them, all three smiling.", { src: ZUH, mood: "joy" });
mat("names", "city", "What does each name mean? Match them.", [
  ["🌟", "Barakah", "🎁", "Blessing"],
  ["👩🏿", "Umm Ayman", "👶🏿", "The mother of Ayman"],
  ["👦🏿", "Usamah", "👨‍👩‍👦", "Son of Zayd and Umm Ayman"]
], { img: "e" });

chapter("u7", "💧", "The Long Walk", null, [], null, "Ibn Sa'd, al-Tabaqat (vols. 1 and 8)");
s("a", "night", "Many people in Makkah were cruel to the Muslims. So Allah let the Muslims move to Madina, far to the north.",
  "At night in a narrow lane of {MAKKAH}, {MUSLIMS} quietly load bundles onto camels, looking over their shoulders, a lamp glowing in a doorway.", { mood: "tense" });
s("b", "desert", "Umm Ayman set out too, on the long, hot road to Madina.",
  "{UA} walks along a long rocky desert road under a hot sun, a walking stick in one hand and a small waterskin on her shoulder, the bare hills stretching ahead.", { src: SAD });
s("c", "desert", "She was fasting, and she grew very thirsty. And she had no water.",
  "{UA} sits on a rock in the heat of the afternoon, eyes closed, patient, an empty waterskin in her lap, the desert shimmering around her.", { src: SAD, mood: "longing" });
p("hold", "patient", "desert", "Be patient, like Umm Ayman. Press and hold.", { ms: 3000, icon: "🤲", hint: "Press and hold", done: "Patient, like Umm Ayman" }, { img: "c" });
s("d", "desert", "It is told that a bucket of cool water came down from the sky. She drank, and after that she was never thirsty again, even when she fasted on a hot day.",
  "{UA} looks up in wonder as a simple wooden bucket full of clear water hangs down on a white rope from bright clouds above the desert, soft light around it.", { src: SAD, mood: "wonder" });
p("catch", "drops", "desert", "Catch the cool drops of water!", { target: 8, icon: "💧", into: "🪣" }, { img: "d" });
s("e", "field", "At last she reached Madina, with its green date palms and its kind people.",
  "{UA} arrives at the edge of {MADINA}, tired but smiling, as two women of the town come out to welcome her with open arms.", { mood: "joy" });

chapter("u8", "🫶", "Water for the Hurt", null, [], null, "Ibn Sa'd, al-Tabaqat (vol. 8)");
s("a", "field", "Umm Ayman was brave and kind. When the Muslims had to defend Madina, at the mountain of Uhud, she went too.",
  "{UA} walks with a big waterskin on her shoulder towards a long reddish mountain in the distance, under a clear sky; nobody else near her.", { src: SAD });
s("b", "desert", "She carried water to the thirsty, and she cared for the people who were hurt.",
  "In the shade of big rocks, {UA} kneels and gives a cup of water to a tired seated man with a cloth bandage on his arm; other tired men rest nearby. Nothing frightening.", { src: SAD });
p("count", "cups", "desert", "Give everyone water. Tap each cup.", { total: 6, icon: "💧", got: "😊" }, { img: "b" });
s("c", "field", "She went with the Muslims to Khaybar too, to help.",
  "Under date palms beside a camp of simple tents, {UA} and two other women roll clean cloth bandages and fill water jars.", { src: SAD });
q("q", "field", "What did Umm Ayman bring to the people who were hurt?", ["Water", "💧"], ["Toys", "🧸"], "She brought them water, and she cared for them.", { img: "c" });

chapter("u9", "🌴", "Ten Palm Trees", null, [], null, "Anas in Sahih Muslim (1771, 2453) and al-Bukhari (2630); Ibn Sa'd, al-Tabaqat (vol. 8)");
s("a", "field", "In Madina, the Prophet gave Umm Ayman some date palms of her own.",
  "{UA} stands proudly among young date palms heavy with golden dates, one hand on a trunk, smiling. {HERE}.", { src: MUS, presence: true });
s("b", "field", "Later the palms had to go back to the family who had lent them. A boy called Anas came to ask for them.",
  "{ANAS} stands politely at the edge of the palm garden, while {UA} faces him with her hands on her hips.", { src: MUS });
s("c", "field", "But Umm Ayman said: No! He gave them to me! The Prophet offered her other trees instead. She still said no!",
  "{UA} folds her arms and shakes her head firmly, trying not to smile, under the palm trees; {ANAS} looks on, surprised. {HERE}.", { src: MUS, presence: true });
s("d", "field", "So he kept offering her more, until she had about ten times as many! Then she was happy.",
  "{UA} laughs with joy among a big grove of many tall date palms, her arms open wide, golden light through the leaves. {HERE}.", { src: MUS, mood: "joy", presence: true });
p("count", "palms", "field", "Count her new palm trees! Tap all ten.", { total: 10, icon: "🌴", got: "✨" }, { img: "d" });
s("e", "city", "Once she asked him for a camel to ride. He smiled and said: I will give you the baby of a camel! She said: but a baby camel cannot carry me!",
  "{UA} laughs with her hand on her cheek in front of a big, strong, grown-up camel in a yard in {MADINA}. {HERE}.", { src: SAD, mood: "joy", presence: true });
q("q", "city", "He said he would give her the baby of a camel. What did he mean?", ["A big grown-up camel", "🐪"], ["A tiny baby camel", "🍼"], "He was joking! Every camel, even a big one, is the baby of a mother camel.", { img: "e" });

chapter("u10", "💐", "Fatimah's Wedding", null, [], null, "Ibn Sa'd, al-Tabaqat (vol. 8)");
s("a", "city", "When the Prophet's daughter Fatimah married Ali, Umm Ayman helped to get everything ready.",
  "In a simple room, {UA} gently straightens the white headscarf of {FATIMA}, who smiles shyly; morning light through a small window.", { src: SAD, mood: "joy" });
s("b", "city", "She packed a bed made of palm leaves, a soft leather pillow stuffed with palm fibre, and a waterskin. And she spread soft sand on the floor.",
  "Close up in a small room: a simple bed woven of palm leaves, a leather pillow, a waterskin hanging on a peg and a clay jug, on a floor of smooth soft sand, in warm lamplight. No people.", { src: SAD });
srt("pack", "city", "What was in Fatimah's simple new home? Sort them.", ["In her home", "🏠"], ["Not there", "🚫"], [
  ["🌴", "A bed of palm leaves", 0], ["👑", "A golden crown", 1], ["💧", "A waterskin", 0],
  ["🛋️", "A big silk sofa", 1], ["🏖️", "Soft sand on the floor", 0], ["💎", "A box of jewels", 1]
], "Think again. Her home was very simple.", { img: "b" });
s("c", "dusk", "Their home was small and simple, but it was full of love.",
  "A small mud-brick house with a roof of palm branches in {MADINA} at evening, warm lamplight glowing from its open doorway, a date palm beside it. No people.", { mood: "longing" });
p("build", "bricks", "dusk", "Help build their little home. Tap to place every brick.", { n: 6, icon: "🧱", cols: 3 }, { img: "c" });

chapter("u11", "✨", "The News of Heaven", "3:144", [], null);
s("a", "city", "The Prophet often went to visit Umm Ayman, to see how she was.",
  "{UA} stands smiling at her doorway in {MADINA} in the afternoon, holding a cup of drink ready, looking along the lane. {HERE}.", { src: MUS, presence: true });
s("b", "city", "Once she gave him a drink, and he did not take it. So she told him off, just like a mother!",
  "{UA} holds out a cup with one hand and wags a finger with the other, frowning kindly, like a mother scolding, in her courtyard. {HERE}.", { src: MUS, mood: "joy", presence: true });
s("c", "dusk", "Then one day, the Prophet died. Everyone in Madina was very, very sad.",
  "{MADINA} at dusk: quiet empty lanes between the houses, still palm trees, a single lamp in a window. No people.", { mood: "sad" });
s("d", "city", "Abu Bakr said to Umar: let us go and visit Umm Ayman, as the Prophet used to visit her.",
  "{ABUBAKR} and {UMAR} walk together down a quiet lane of {MADINA} towards a simple wooden door, in soft afternoon light.", { src: MUS });
s("e", "city", "When they came, she wept. She said: I know he is with Allah, and that is better for him. I am crying because the news from heaven has stopped coming.",
  "Inside a simple room, {UA} sits weeping gently with her hands open in her lap, while {ABUBAKR} and {UMAR} sit with her on the floor mat, listening.", { src: MUS, mood: "sad" });
s("f", "city", "And Abu Bakr and Umar cried with her.",
  "{UA}, {ABUBAKR} and {UMAR} sit together with their heads bowed and tears on their faces, in the soft light of a small window.", { src: MUS, mood: "longing" });
q("q", "city", "Why did Umm Ayman cry?", ["The revelation had stopped", "✨"], ["She was hungry", "🍞"], "She cried because the revelation, the news from heaven, had stopped coming.", { img: "e" });
ord("story", "city", "Tell Umm Ayman's whole story. Tap in order.", [
  ["⛵", "From Abyssinia", "First, Barakah came from Abyssinia, across the sea."],
  ["🍼", "She cared for the baby", "She looked after the baby, with his mother."],
  ["🐪", "She brought him home", "She brought the little boy home to Makkah on two camels."],
  ["🕊️", "Free, with a family", "He set her free, and she had a family."],
  ["💧", "Water for the hurt", "She carried water to the hurt."],
  ["🌴", "Ten palm trees", "And he gave her ten times the palm trees."]
], "Listen again, and tell it in order.", { img: "f" });

line("end-a", "This is the story of Umm Ayman, Barakah, the blessing. She looked after the Prophet from the day he was born, and he called her: O mother.");
