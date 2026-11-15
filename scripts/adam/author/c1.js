/* Chapters 1 to 6: someone new, made from earth, first words, the names, the proud one, the Garden. */
"use strict";
const { chapter, s, p, q, mat, srt, TAF, HAD, BOTH } = require("./lib");

chapter("d1", "✨", "Someone New", "2:30-33", [], [
  "'Successor' (khalifa) is told as 'someone new, to look after the earth'.",
  "The angels' question is a question, not a refusal: when they could not name the things Allah showed them they said, 'We have knowledge only of what You have taught us' (2:32). The game tells that part in chapter 4."
]);
s("a", "heaven", "Before there were any people, there were the angels. They were made of light, and they praised Allah all the time.",
  "{ANG} glide together through a vast bright sky high above soft clouds, beams of golden light all around them. There are no people at all: this is before the first person was made.", { mood: "awe" });
s("b", "heaven", "One day, Allah told the angels: I am going to place someone new on the earth, to look after it.",
  "Seen from high above the clouds, the round earth glows green and blue far below at dawn, while {ANG} gather at the edge of the clouds and look down at it in wonder. There are no people at all: only the angels, made of light.");
s("c", "heaven", "The angels asked: will You place someone there who may do harm, when we praise You all the time? Allah said: I know what you do not know.",
  "{ANG} bow their glowing heads humbly in a circle of soft light, while a great warm golden light shines down on them from above, high in the sky among the clouds. There are no people at all: only the angels, made of light.");
q("q", "heaven", "What did Allah say to the angels?", ["I know what you do not know", "✨"], ["You are right", "👍"], "Allah knows everything. He said: I know what you do not know.", { img: "c" });
p("memory", "mem", "heaven", "Find the pairs: things Allah made.", { icons: ["☀️", "🌙", "⭐", "☁️", "🌊", "⛰️"] });

chapter("d2", "🟤", "Made from Earth", "15:28-29", ["38:71-72", "3:59"], [
  "Earth of every kind: al-Tirmidhi and Abu Dawud report that Adam was made from a handful taken from all of the earth, so his children came like the earth, of many colours, some gentle and some rough. The Shia narrations give the same from Imam Ali: Adam was made 'from the soil of all the surface of the earth'.",
  "The pictures in Asmau show everyone dark-skinned; the lesson about colours is told in words and shown with the earth itself."
]);
s("a", "desert", "Allah gathered earth from all over the world: dark earth and light earth, red earth and brown, soft earth and hard.",
  "Close up: heaps of earth in many colours, black, dark brown, red, ochre, sandy and pale, lying side by side on a wide plain under a glowing sky. No people.", { src: BOTH });
p("build", "gather", "desert", "Help gather the earth. Tap to fill every piece.", { n: 8, icon: "🟤", cols: 4 }, { img: "a" });
s("b", "desert", "From that earth Allah made clay, and shaped Adam from it.",
  "Soft wet clay in rich earth colours glistens in warm light beside a quiet stream in a wide valley, smooth and shining. No people.");
s("c", "dawn", "Then Allah breathed life into him. Adam opened his eyes, and he was alive!",
  "{ADAM} stands on a hilltop at sunrise, eyes just opened, looking around at the world in wonder, golden light all around him.", { mood: "awe" });
s("d", "dawn", "That is why the children of Adam are so many colours, just like the earth he was made from. And every one of them is precious to Allah.",
  "Close up: two cupped hands, deep dark brown, hold a small heap of earth of many colours, black, red, brown, ochre and sand, glowing in the morning sun.", { src: BOTH });
q("q", "dawn", "What was Adam made from?", ["Earth and clay", "🟤"], ["Fire", "🔥"], "Not fire. Adam was made from earth and clay.", { img: "c" });

chapter("d3", "🤲", "First Words", null, [], [
  "The sneeze: in the commentary on 2:37, Ibn Abbas has Adam remind Allah, 'when I sneezed You said, May Allah grant you His mercy'. The Shia narrations give the same: Adam said 'al-hamdu lillah' and was answered 'yarhamuk Allah'.",
  "The greeting: al-Bukhari and Muslim report that Allah told Adam to greet a group of angels and to listen to their answer, which would be the greeting of his children. The Shia narrations give the same greeting.",
  "Neither is in the Qur'an."
], "Ibn Abbas in Ibn Kathir's commentary on 2:37; al-Bukhari and Muslim; Majlisi, Hayat al-Qulub");
s("a", "dawn", "It is told that the very first thing Adam did was sneeze! And he said: al-hamdu lillah. All praise belongs to Allah.",
  "{ADAM} on a sunny hilltop, eyes squeezed shut in a big happy sneeze, a little sparkle in the air, flowers around his feet.", { src: BOTH });
s("b", "dawn", "And Allah answered him: may Allah have mercy on you.",
  "{ADAM} smiles gently with his hand on his heart, looking up at a warm golden light shining down from the sky.", { src: BOTH });
q("q", "dawn", "What do we say when we sneeze?", ["Al-hamdu lillah", "🤲"], ["Nothing at all", "🤐"], "We say al-hamdu lillah, just like Adam.", { img: "a" });
s("c", "heaven", "Then Allah told Adam: go and greet those angels, and listen to how they answer. That will be the greeting of your children.",
  "{ADAM} walks across a bright meadow toward a group of {ANG}, raising his right hand in greeting.", { src: HAD });
s("d", "heaven", "Adam said: as-salamu alaykum, peace be upon you. The angels answered: wa alaykum as-salam wa rahmatullah. And peace be upon you, and the mercy of Allah.",
  "{ADAM} and {ANG} face each other on the meadow; the angels' light brightens warmly and Adam smiles.", { src: HAD });
mat("say", "dawn", "What do we say? Match each one.", [
  ["🤧", "When we sneeze", "🤲", "Al-hamdu lillah"],
  ["👋", "When we meet someone", "🕊️", "As-salamu alaykum"],
  ["💬", "When someone greets us", "💛", "Wa alaykum as-salam"]
], { img: "d" });

chapter("d4", "🦁", "The Names", "2:31-33", [], [
  "The commentary reports from Ibn Abbas that 'the names' are the names people use for everything, of every kind; al-Bukhari's hadith of intercession has people say to Adam, 'Allah ... taught you the names of everything'.",
  "Al-Tabatabai's al-Mizan reads the named things as 'sublime creations, hidden from the heavens and the earth'. The game keeps to the plain meaning both share: Allah taught Adam what the angels did not know."
]);
s("a", "heaven", "Allah taught Adam the names of everything: the sun and the moon, the sea and the mountains, every animal and every bird.",
  "{ADAM} sits in a sunny meadow, surrounded by a lion, a camel, a horse, a deer and birds, with a tall tree and distant mountains, looking at them with a thoughtful smile; the sun and a pale moon are both in the sky.");
mat("homes", "heaven", "Adam knew every animal. Match each one to its home.", [
  ["🐪", "Camel", "🏜️", "Desert"],
  ["🐟", "Fish", "🌊", "Sea"],
  ["🐦", "Bird", "🪺", "Nest"],
  ["🐝", "Bee", "🌸", "Flower"]
], { img: "a" });
s("b", "heaven", "Then Allah showed these things to the angels and said: tell Me their names. The angels said: glory be to You! We only know what You have taught us.",
  "{ANG} bow humbly before a row of animals and things glowing softly in a meadow: a lion, a camel, a bird, a tree and a small mountain. There are no people in this picture at all: only the angels, made of light, and the animals.");
s("c", "heaven", "Then Allah said: Adam, tell them their names. And Adam told them, every single one!",
  "{ADAM} points kindly to each animal in turn while {ANG} listen in wonder; a lion, a camel, a horse and birds stand in a line in the meadow.", { mood: "triumph" });
p("memory", "mem", "heaven", "Find the pairs, and say their names.", { icons: ["🦁", "🐪", "🐘", "🐦", "🌳", "⛰️"] });
q("q", "heaven", "Who taught Adam the names?", ["Allah", "✨"], ["The angels", "☁️"], "The angels did not know them. Allah taught Adam.", { img: "c" });

chapter("d5", "🔥", "The Proud One", "2:34", ["7:11-18", "15:30-42", "38:73-85", "18:50"], [
  "Iblis 'was one of the jinn' (18:50), made from fire (7:12). The commentary calls the bow Allah honouring Adam; al-Tabatabai's al-Mizan says the angels bowed to Adam 'as he was the symbol of humanity'. It is a bow of respect at Allah's command, not worship.",
  "Iblis's vow to come at people 'from their front and their back, from their right and their left' is 7:17; 'you will have no power over My servants' is 15:42.",
  "Asking Allah for protection (a'udhu billahi min ash-shaytan ir-rajim) is not in these verses; the game adds it as what children can do."
]);
s("a", "heaven", "Then Allah told the angels: bow down before Adam. And all the angels bowed.",
  "Wide view: rows of {ANG} bow low together in a vast bright hall of clouds and light before {ADAM}, who stands humbly with his hands at his chest. Adam is the only person in the picture; there are no other people, no women and no children.", { mood: "awe" });
s("b", "heaven", "All except one: Iblis. He was one of the jinn, made from fire. He stood up stiff and proud, and he would not bow.",
  "Among rows of bowing {ANG}, {IBL} stands upright with his arms folded, turning his head away. There are no people in this picture: only the angels of light and the dark flame figure.", { mood: "dread" });
s("c", "grey", "Allah asked: what stopped you from bowing? Iblis said: I am better than him. You made me from fire, and him from clay.",
  "Close up: {IBL} with his head held high, flames flickering proudly, alone against a dim grey sky.");
srt("proud", "grey", "Which is humble, and which is proud? Sort them.", ["Humble", "🙇"], ["Proud", "😤"], [
  ["🙇", "Doing what Allah asks", 0], ["🤝", "Saying sorry", 0], ["😤", "Saying: I am better than you", 1],
  ["🙅", "Refusing to listen", 1], ["🤲", "Thanking Allah", 0], ["👎", "Laughing at others", 1]
], "Being proud is what Iblis did. Being humble is what Allah loves.", { img: "c" });
s("d", "grey", "So Allah sent Iblis away. And Iblis said: I will whisper to Adam's children, from in front and behind, from their right and their left!",
  "High above the clouds, {IBL} drifts away into dark smoke at the edge of the sky; the bright clouds behind him stay calm. No people, no houses, no land: only sky, clouds and the drifting smoke.");
s("e", "night", "But Allah said: you will have no power over My true servants.",
  "A quiet green hill at night under a sky full of stars; a soft golden light shines down on the hilltop, while a wisp of dark smoke drifts far away. No people and no buildings at all: only the hill, the stars, the light and the smoke.", { mood: "wonder" });
p("hold", "refuge", "night", "When we feel a bad whisper, we ask Allah to keep us safe: a'udhu billahi min ash-shaytan ir-rajim. Press and hold the shield.", { ms: 2500, icon: "🛡️", hint: "Press and hold", done: "Allah keeps us safe" }, { img: "e" });

chapter("d6", "🌳", "The Garden", "2:35", ["7:19", "20:117-119", "4:1"], [
  "How Hawwa was made is told in two ways. The commentary reports, from Ibn Ishaq and 'the People of the Book', that she was made from Adam's rib while he slept. Narrations of the Imams of Ahl al-Bayt say she was made from the clay left over from Adam (Imam al-Baqir), and al-Tabatabai's al-Mizan prefers that. The Qur'an says Allah made his mate 'from it', the single soul (4:1). The game says only that Allah made Hawwa for Adam.",
  "The tree is not named in the Qur'an. The commentary quotes al-Tabari: 'We do not know which tree that was.' Shia narrations call it wheat or a vine (Imam al-Rida: 'both traditions are true'). The game names no fruit.",
  "The Garden: the commentary says most scholars place it in the heavens; al-Tabatabai says it was 'in the heaven, although it was not the Garden of eternal abode'."
]);
s("a", "garden", "Allah made a wife for Adam, so that he would not be alone. Her name was Hawwa.",
  "In {GARDEN}, {ADAM} and {HAWWA} meet for the first time under a flowering tree, smiling shyly, a respectful step apart.", { mood: "wonder" });
s("b", "garden", "Allah said: live in the Garden, both of you, and eat whatever you like. In this Garden you will never be hungry or thirsty, and the sun will never be too hot.",
  "{ADAM} and {HAWWA} walk together beside a clear stream in {GARDEN}, among trees heavy with fruit, with birds and deer nearby.");
p("catch", "fruit", "garden", "Gather the fruit of the Garden.", { target: 8, icon: "🍎", into: "🧺" }, { img: "b" });
s("c", "garden", "But Allah said: do not go near this one tree. And remember, Iblis is your enemy.",
  "In the middle of {GARDEN} stands one single great tree, apart from all the others, with a soft shadow beneath it; {ADAM} and {HAWWA} look at it from a distance.");
p("seek", "tree", "garden", "Slide your finger around to look, and find the one tree they must not go near.", { icon: "🌳", r: 20 }, { img: "c" });
q("q", "garden", "What did Allah tell them about the tree?", ["Do not go near it", "🚫"], ["Eat all of it", "😋"], "Allah said: do not go near this tree.", { img: "c" });
