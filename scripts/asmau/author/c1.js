/* The story of Nana Asma'u. Every fact is from scripts/asmau/RESEARCH.md; cite = where the chapter's facts come from. */
"use strict";
const { chapter, s, p, q, ord, mat, srt, chg, HAD, CW, portrait } = require("./lib");
const GIRL = portrait("girl", "GIRL"), TEACHER = portrait("jaji", "JAJI");

const C_CW = "Boyd and Mack, The Collected Works of Nana Asma'u (1997): the introduction and the outline chronology";

chapter("a1", "👶🏿", "Two Babies in Degel", C_CW, [], [
  "Nana Asma'u was born in about 1793 in Degel, a village north-west of Sokoto in what is now northern Nigeria, a twin; her brother was Hassan. Her birth year is worked out from her age when she died, so it is 'about'. Source: Boyd and Mack, The Collected Works of Nana Asma'u (1997), drawing on the Sokoto historian Waziri Junaidu.",
  "Twins were customarily named Hassan and Hussain, after the Prophet's ﷺ grandsons, so she would have been Hussaina. Her father, the Shehu Usman dan Fodio, a scholar and teacher, chose instead to name her after Asma bint Abi Bakr. Same source; also Wikipedia."
]);
s("a", "dusk", "Long ago, in a village called Degel, in West Africa, two babies were born on the same day. They were twins: a boy and a girl.",
  "Evening in {DEGEL}. Inside a simple round room, two newborn babies with deep dark brown skin, wrapped in white and cream cloths, lie side by side on a woven mat. Kneeling beside them are only two smiling women in long dresses with large headscarves that fully cover their hair, ears and neck, one in plum and one in orange. A soft oil lamp glows.", { mood: "nile", amb: "night" });
s("b", "dusk", "Their father was a kind and wise teacher, called the Shehu. He named the boy Hassan.",
  "{SHEHU} sits on a mat in a warm lamplit room holding a newborn baby boy in white cloth, smiling. Beside him sit only two women, both in long dresses with large headscarves that fully cover their hair, one in plum and one in orange, smiling at the baby.", { mood: "wonder" });
s("c", "dusk", "Twins were usually called Hassan and Hussaina. But the Shehu gave his daughter a different name: Asma'u.",
  "{SHEHU} gently holds up a newborn baby girl wrapped in cream cloth, smiling with love, in a warm lamplit room; a second baby lies on the mat beside him.", { mood: "wonder" });
q("q", "dusk", "What did the Shehu name his baby girl?", ["Asma'u", "👧🏿"], ["Hussaina", "🍼"], "Not Hussaina. He chose a special name for her: Asma'u.", { img: "c" });
p("memory", "mem", "dusk", "Twins come in pairs! Find the pairs.", { icons: ["👶🏿", "🌙", "⭐", "🏠", "🐐", "🌴"] });

chapter("a2", "🎀", "The Girl with Two Belts", "Sahih al-Bukhari 2979 and 3907", [], [
  "Asma bint Abi Bakr was a Companion of the Prophet ﷺ and the daughter of Abu Bakr. When the Prophet ﷺ and Abu Bakr left Makkah for Madinah, she prepared their food and water. Having nothing else to tie them with, she cut her waistband in two, tying the water-skin with one piece and the food with the other; so she was called 'the one with the two belts' (Dhat an-Nitaqayn). Sahih al-Bukhari 2979 and 3907.",
  "Asma bint Abi Bakr is shown only from behind and by her hands. The Prophet ﷺ and Abu Bakr are mentioned, not shown."
]);
s("a", "night", "Why Asma'u? She was named after a brave young woman who lived long before, in the time of the Prophet, peace be upon him: Asma, the daughter of Abu Bakr.",
  "Night in an old desert town of flat-roofed houses under a starry sky. A young woman in a long dark-blue dress and headscarf, seen only from behind, carries a bundle of food and a leather water-skin along a quiet lane.", { mood: "longing" });
s("b", "night", "When the Prophet and her father set off on a long journey, Asma packed their food and water. But there was nothing to tie the bags with!",
  "Seen from above, close up: one person's two hands, in dark-blue sleeves, reaching in from the bottom edge to a wooden table at night, beside a leather water-skin, a cloth bundle of dates and bread, and a long cloth belt. Only those two hands; no other hands, no head, no face. An oil lamp glows.", { src: HAD });
chg("tear", "night", "What did she do? Tap the belt.", [["🎗️", ""], ["✂️", "She tore her belt in two!"]], { img: "b", src: HAD });
s("c", "night", "She tore her own belt in two. One piece tied the water. The other piece tied the food. So people called her: the one with the two belts.",
  "Close view of a young woman's hands, her face not shown, tying a leather water-skin with one strip of cloth and a food bundle with another strip of the same cloth, lamplight.", { src: HAD, mood: "triumph" });
mat("match", "night", "Match each piece of the belt to what it tied.", [
  ["🎗️", "The first piece", "💧", "tied the water"],
  ["🎗️", "The second piece", "🍞", "tied the food"]
]);
s("d", "dusk", "Asma was brave, clever, and always ready to help. That is the name the Shehu gave his little girl.", "Dusk in {DEGEL}: {GIRL} stands tall and smiling in the doorway of a round mud-brick house, a water jar on her hip, ready to help, while {SHEHU} watches her proudly from a mat nearby.", { mood: "wonder" });

chapter("a3", "📖", "Learning at Home", C_CW, [], [
  "Her mother died when she was small (the source gives 1795 and marks the date as uncertain). She was brought up by her father's wives Aisha and Hauwa; Hauwa was the mother of her brother Muhammad Bello. Source: Boyd and Mack, Collected Works, outline chronology.",
  "She learned the Qur'an by heart while young (Collected Works, introduction). Learning to write on a wooden board, washed clean and used again, is how children there learned and still learn; the sources do not describe her own lessons, so the game says 'like children there still do'."
]);
s("a", "field", "When Asma'u was very small, her mother died. But she was not alone. Aisha and Hauwa, who lived in the Shehu's house, loved her and brought her up.",
  "Morning in a family compound in {DEGEL}. {AISHA} kneels and hugs {GIRL} warmly; another woman in an orange headscarf smiles beside them. Chickens, a clay pot, a baobab tree.", { mood: "longing" });
s("b", "field", "In the Shehu's house, everybody learned. Girls learned, and boys learned. Like children there still do, Asma'u wrote her lessons on a wooden board.",
  "In the shade of a tree in a family compound, {GIRL} and {HASSAN} sit side by side on a mat, each holding a smooth wooden writing board with an ink pot beside them, while {SHEHU} teaches them with a warm smile. The boards show only simple strokes, no readable writing.", { mood: "pastoral" });
p("trail", "trace", "field", "Help Asma'u write her lesson. Tap each dot to follow the line.", { n: 7, icon: "✒️", walker: "✏️" }, { img: "b" });
p("wipe", "wash", "field", "Lesson learned! Wash the board clean for tomorrow. Rub, rub, rub!", { cover: "sand" }, { img: "b" });
s("c", "field", "Day by day, verse by verse, Asma'u learned the whole Qur'an by heart while she was still young.",
  "{GIRL} sits alone on a mat under a tree at golden evening light, eyes closed, gently reciting with a hand on her heart, a wooden writing board resting in her lap.", { mood: "awe" });
p("count", "verses", "field", "Learn a little every day. Tap each star to learn one more.", { total: 10, icon: "⭐", got: "🌟" });
q("q", "field", "Who learned in the Shehu's house?", ["Girls and boys", "👧🏿👦🏿"], ["Only the boys", "👦🏿"], "No. In the Shehu's house, girls and boys learned together.", { img: "b" });

chapter("a4", "🚶🏿", "The Journey", C_CW, [], [
  "On 21 February 1804 the Shehu and his community left Degel for Gudu: the hijra, or emigration, that began the jihad, years of war against the rulers of Gobir (1804 to 1808). Asma'u was about eleven. Source: Collected Works, outline chronology. She later wrote about these years in poems, among them 'The Journey'.",
  "The game says only that the family had to leave their home and walk to a new place. It says only that 'it was no longer safe' for them; the conflict with the rulers of Gobir, the war and its losses are left for parents (next chapter's note)."
]);
s("a", "desert", "When Asma'u was about eleven years old, it was no longer safe for the Shehu's people in their village. So her family and all their friends had to leave, and travel to a new place.",
  "Dawn on a dusty savanna road. A long line of {FOLK} walk away from {DEGEL}, carrying bundles on their heads and leading donkeys; {GIRL} walks holding the hand of {AISHA}.", { mood: "trek" });
srt("pack", "desert", "What should they carry on a long walk? Something useful, or something too heavy?", ["Take it", "🎒"], ["Too heavy", "🪨"], [
  ["💧", "A pot of water", 0], ["🛏️", "A big wooden bed", 1], ["📖", "Their books", 0], ["🌾", "A bag of grain", 0], ["🚪", "The front door", 1]
], "Think again. Could you carry that a long way?");
p("journey", "walk", "desert", "Walk with Asma'u to the new place.", { from: "🏡", to: "⛺", icon: GIRL, steps: 8 });
s("b", "camp", "The walk was long and hard. But Asma'u looked, and listened, and remembered. Many years later she wrote poems about those journeys.",
  "Evening at a simple camp of grass shelters in the savanna. {GIRL} sits by a small fire, writing on a wooden board on her knees, while families rest around her.", { mood: "longing" });

chapter("a5", "🤲🏿", "Hard Years", C_CW, [], [
  "The years after 1804 were years of war (the Sokoto jihad, 1804 to 1808), with battles and heavy losses on both sides; Muhammad Bello wrote that about two thousand of the Shehu's people were killed at Tsuntsuwa in 1804. Source: Collected Works, outline chronology and notes.",
  "The game says only that 'there was fighting' and shows the women's work at home. According to the same source, women of the community organised food for the army, brought up orphans, gave out goods to the poor and taught. Captives and enslavement, part of this history, are not told to children.",
  "Talk with older children about how war hurts families, and about the women who cared for others in it."
]);
s("a", "grey", "Those were hard years. There was fighting, and many people were hurt or lost their homes.",
  "A grey, cloudy sky over a camp of grass shelters; {FOLK} sit close together, sad and tired, some with bandaged arms; a woman comforts a crying child.", { mood: "dread" });
s("b", "camp", "The women of the community did not give up. They cooked food for everyone, cared for children who had lost their parents, and shared with people who had nothing.",
  "A busy camp kitchen under a big tree: {WOMEN} stir large cooking pots over fires and hand out bowls of food to children and old people; {GIRL} carries a bowl carefully.", { mood: "pastoral" });
p("count", "bowls", "camp", "Help share the food. Tap each bowl to give it to someone hungry.", { total: 8, icon: "🥣", got: "😊" }, { img: "b" });
s("c", "camp", "Asma'u helped too. She learned that caring for others is part of being a good Muslim.", "In a camp under a big tree, close up: {GIRL} kneels and gently hands a bowl of food to a frail old woman sitting on a mat, both smiling; a small child sits beside the old woman.", { mood: "triumph" });
q("q", "camp", "What did the women do in the hard years?", ["Cared for others and shared", "🤲🏿"], ["Hid and did nothing", "🙈"], "No. They cooked, cared for children, and shared what they had.", { img: "b" });

chapter("a6", "🏘️", "A New Town", C_CW, [], [
  "In 1807 Asma'u married Usman Gidado, a close friend of her brother Muhammad Bello; Gidado later became vizier (chief minister). In 1809 she went to live in Sokoto, the new town built by Bello. Her first son, Abdulkadir, was born about 1810. Source: Collected Works, outline chronology.",
  "She ran a household of several hundred people, seeing that they had food, clothing and shelter (Collected Works, introduction)."
]);
s("a", "egypt", "When the fighting was over, a new town was built, called Sokoto. Asma'u married a good man called Gidado, and they made their home there.",
  "Bright day in {SOKOTO}. {ASMA} and {GIDADO} stand together at the doorway of a large mud-brick family house, smiling warmly at neighbours who greet them.", { mood: "triumph", amb: "crowd" });
p("build", "home", "egypt", "Help build the new home, brick by brick.", { n: 12, icon: "🧱", cols: 4 });
s("b", "egypt", "Their home was full of people: family, students, guests, and people who needed help. Hundreds of them! Asma'u made sure everyone had food, clothes, and a place to sleep.",
  "A lively courtyard of a big mud-brick house in {SOKOTO}: {ASMA} hands folded cloth to a mother with children, while others share a meal on mats and students read in the shade.", { mood: "pastoral", amb: "crowd" });
srt("care", "egypt", "Everyone needs something. Is it food, or is it clothes?", ["Food", "🍲"], ["Clothes", "👕"], [
  ["🍚", "A bowl of rice", 0], ["🧣", "A warm scarf", 1], ["🍞", "Fresh bread", 0], ["👗", "A new dress", 1], ["🥛", "A cup of milk", 0]
], "Think again. Do you eat it, or wear it?", { img: "b" });

chapter("a7", "📜", "Saving the Books", C_CW, [], [
  "On 20 April 1817 the Shehu died; that November her twin Hassan died too. Asma'u and Gidado then collected all the Shehu's papers and had them copied. Source: Collected Works, outline chronology.",
  "She wrote elegies, poems of mourning, for many of the people she lost (Collected Works)."
]);
s("a", "dusk", "When Asma'u was grown up, her father the Shehu died. A few months later, her twin brother Hassan died too. Asma'u was very sad.",
  "Evening in a quiet room in {SOKOTO}. {ASMA} sits alone by a window with her hands raised in prayer, a calm sad face, an oil lamp beside her.", { mood: "longing" });
s("b", "dusk", "But she knew what to do. Her father had written many books. With Gidado, she gathered every page, so that nothing he wrote would be lost.",
  "A room full of shelves and wooden chests in {SOKOTO}. {ASMA} and {GIDADO} gather loose handwritten pages and bundle them carefully with cloth ties; the pages show only lines, no readable writing.", { mood: "awe" });
p("pick", "pages", "dusk", "Find every page of the Shehu's books. Tap them all.", { items: [{ icon: "📜", n: 8, ok: true, name: "a page" }, { icon: "🏺", n: 2, ok: false, name: "a pot" }, { icon: "🧺", n: 2, ok: false, name: "a basket" }], mark: "✨" }, { img: "b" });
s("c", "dusk", "Then the pages were copied, again and again, so that people everywhere could read them.",
  "Several scribes, men and women, sit on mats copying pages with reed pens; {ASMA} walks among them checking the work. Only lines and strokes on the pages, no readable writing.", { mood: "triumph" });
ord("ord", "dusk", "How did they save the books? Tap in order.", [
  ["📜", "Gather the pages", "First, they gathered every page."],
  ["✒️", "Copy them", "Then they copied them."],
  ["🤲🏿", "Share them", "And then people everywhere could read them."]
], "Not that one yet. What comes first?");

chapter("a8", "✒️", "Words in Four Languages", C_CW, [], [
  "Her first written work, The Way of the Pious, dates from 1820. She knew four languages, Arabic, Fulfulde, Hausa and Tamasheq, and wrote in the first three, using Arabic letters for all of them (ajami), so that people who did not read Arabic could learn. More than sixty of her works survive. Sources: Collected Works; Wikipedia.",
  "In 1829 she wrote a poem that names every sura of the Qur'an, made to be easy to remember (Collected Works, chronology and introduction; Yaqeen Institute). The game's activity uses the first four suras in their order in the Qur'an."
]);
s("a", "palace", "Asma'u loved words. She could speak four languages! And she wrote poems: more than sixty of them.",
  "A calm study room in {SOKOTO} with a window onto palm trees. {ASMA} sits at a low desk writing with a reed pen; stacks of handwritten pages, books and an ink pot around her. Only lines on the pages, no readable writing.", { mood: "wonder" });
s("b", "palace", "Not everyone could read Arabic. So Asma'u wrote her poems in the languages people spoke at home, using Arabic letters, so that everyone could learn.",
  "{ASMA} reads a poem aloud from a page to a circle of {WOMEN} sitting on mats in a courtyard; they listen and repeat after her, smiling.", { mood: "pastoral" });
q("q1", "palace", "Why did Asma'u write in the languages people spoke at home?", ["So everyone could learn", "🤲🏿"], ["To keep it a secret", "🤫"], "No. She wanted everyone to be able to learn, not only people who read Arabic.", { img: "b" });
s("c", "palace", "She even wrote a poem with the name of every sura of the Qur'an in it, so that people could remember them.", "In a quiet shady courtyard inside a house in {SOKOTO}, {ASMA} sits on a mat reciting a poem from memory with a warm smile and one hand raised, while girls and women sit before her repeating after her, some holding wooden writing boards. Every girl and woman wears a headscarf that fully covers her hair; no braids or hair showing. Only lines on the boards, no readable writing.", { mood: "wonder" });
ord("suras", "palace", "Asma'u's poem helped people remember the suras. Can you put the first four in order?", [
  ["1️⃣", "Al-Fatiha", "Al-Fatiha, The Opening."],
  ["2️⃣", "Al-Baqarah", "Al-Baqarah, The Cow."],
  ["3️⃣", "Al Imran", "Al Imran, The Family of Imran."],
  ["4️⃣", "An-Nisa", "An-Nisa, The Women."]
], "Not that one yet. Which sura comes first in the Qur'an?");

chapter("a9", "👒", "The Teacher of Teachers", C_CW + "; Wikipedia", [], [
  "Asma'u trained women leaders called jaji, who came to her to learn and then taught women in their homes and villages, mostly through poems that were easy to remember. Their groups were called the 'Yan Taru, 'those who come together', the sisterhood. Each jaji wore a tall hat, the malfa, as a sign of her office. Sources: Collected Works; Wikipedia.",
  "The sources differ on when this began: Wikipedia says from about 1830, another summary says 1840. The game gives no year. The same sources say the network also began as a way to bring women captured in the wars into the community; the game does not tell children this.",
  "The 'Yan Taru still meet today."
]);
s("a", "egypt", "Asma'u had a big idea. Many women lived far away in villages, and could not come to Sokoto to learn. So she trained teachers!",
  "{ASMA} sits on a mat in a shaded courtyard in {SOKOTO}, teaching a group of women teachers who listen closely, each wearing a tall woven straw hat tied with red cloth over her headscarf.", { mood: "awe" });
s("b", "egypt", "The teachers were called jaji. Each one wore a tall, special hat, so that everyone knew: here comes a teacher!",
  "Close view of {JAJI} smiling proudly as {ASMA} ties the red cloth of her tall woven straw hat; other women clap.", { mood: "triumph" });
p("count", "hats", "egypt", "Give every teacher her hat. Tap each one.", { total: 6, icon: "🧕🏿", got: "👒" }, { img: "b" });
s("c", "desert", "The teachers walked back to their villages, and taught the women there, with poems that were easy to remember.",
  "Morning on a savanna path. Three women teachers, each dressed exactly like {JAJI}, walk toward a distant village of round thatched huts, carrying bundles of pages.", { mood: "trek" });
p("trail", "villages", "desert", "Walk with the teacher from village to village. Tap each house.", { n: 6, icon: "🛖", walker: TEACHER }, { img: "c" });
s("d", "field", "Then the women in the villages taught their own children, and their friends. Learning spread like light, from one lamp to the next.",
  "A village courtyard at dusk: {JAJI} sits with {WOMEN} and their children on mats, all clapping a rhythm and reciting together; small oil lamps glow.", { mood: "triumph" });
p("catch", "lamps", "night", "Light the lamps, one from the next! Tap each lamp.", { target: 8, icon: "🪔", into: "✨" });
q("q", "field", "What did Asma'u's teachers do?", ["Taught women in the villages", "🛖"], ["Kept the lessons to themselves", "🔒"], "No. They took the lessons home, and taught everyone they could.", { img: "d" });

chapter("a10", "🏠", "Mother of the Town", C_CW, [], [
  "From about the 1830s Asma'u was known as 'Uwar Gari', mother of the town (Collected Works). She advised the rulers who followed her brother Bello, and wrote poems of guidance for them (Wikipedia; Collected Works).",
  "She wrote elegies for those she lost, among them her brother Bello, her husband Gidado and her close friend Aisha (Collected Works)."
]);
s("a", "egypt", "People called Asma'u 'Uwar Gari': the mother of the town. Women came to her for help, and even the leaders asked for her advice.",
  "{ASMA} sits in a busy courtyard in {SOKOTO} listening kindly to a worried young mother holding a baby, while other women and a man in a turban wait to speak with her.", { mood: "pastoral", amb: "crowd" });
srt("good", "egypt", "Asma'u taught people to be good. Is it a kind thing to do, or not kind?", ["Kind", "💛"], ["Not kind", "💢"], [
  ["🤝🏿", "Helping a neighbour", 0], ["😤", "Shouting at a friend", 1], ["🍲", "Sharing your food", 0], ["📖", "Teaching what you know", 0], ["🙈", "Laughing at someone", 1]
], "Think again. Would that make someone happy?", { img: "a" });
s("b", "egypt", "She had good friends, and she loved them dearly. When people she loved died, she wrote poems so that they would be remembered.",
  "{ASMA} and another woman in a plum headscarf sit together on a mat under a tree, laughing and sharing a bowl of dates.", { mood: "longing" });

chapter("a11", "🌟", "Remembered Today", C_CW + "; Wikipedia", [], [
  "Nana Asma'u died in 1864 (some sources give 1865), aged about seventy. Schools, women's organisations and meeting halls in northern Nigeria are named after her. Source: Wikipedia; Collected Works.",
  "This website is named after her."
]);
s("a", "dawn", "Asma'u lived to be about seventy years old. All her life, she learned, and she taught.",
  "Golden morning in {SOKOTO}. {OLD} sits on a mat surrounded by girls and women of all ages reading and reciting, smiling peacefully.", { mood: "awe" });
s("b", "dawn", "Today, more than a hundred and fifty years later, the women's groups she started still meet. And schools are named after her: Nana Asma'u.",
  "A modern classroom in northern Nigeria: smiling girls with deep dark brown skin in headscarves and school uniforms raise their hands, books open on their desks; sunlight through the windows.", { mood: "triumph" });
ord("ord", "dawn", "Tell the story of Asma'u. Tap in order.", [
  ["👶🏿", "Born a twin", "First, she was born, a twin, in Degel."],
  ["🚶🏿‍♀️", "The long journey", "Then her family made a long journey."],
  ["📜", "Saving the books", "Then she saved her father's books."],
  ["👒", "Training teachers", "And then she trained teachers for the villages."]
], "Not that one yet. What came before it?");
s("c", "dawn", "Her lesson for us is simple: learn all you can, and then teach it to someone else.", "Evening in a courtyard in {SOKOTO}: a girl of about ten with deep dark brown skin in a slate-blue headscarf that covers her hair teaches two smaller children, pointing to lines on a wooden writing board, while {OLD} watches from a doorway with a peaceful smile. Only lines on the board, no readable writing.", { mood: "triumph" });
p("memory", "mem", "dawn", "One last game. Find the pairs from Asma'u's story.", { icons: ["👶🏿", "🎀", "📖", "🚶🏿‍♀️", "📜", "👒"] });
require("./lib").line("end-a", "This is the story of Nana Asma'u. She learned, she taught, and she made sure that everyone could learn. What will you learn, and teach, today?");
