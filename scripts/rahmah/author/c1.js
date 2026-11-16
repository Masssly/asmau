/* Chapters 1 to 6: a girl in the mountains, learning to read, no more school, back to school, a school for girls, not everyone agreed. */
"use strict";
const { chapter, s, p, q, srt, HIS } = require("./lib");
const CITE = "Histories of her life (Audrey Kahin, Jeffrey Hadler and others; see the notes)";

chapter("r1", "🏔️", "A Girl in the Mountains", null, [], null, CITE);
s("a", "field", "Long ago, in the year 1900, a baby girl was born in Padang Panjang, a town in the green mountains of West Sumatra, in what is now Indonesia. Her name was Rahmah.",
  "A wide view of {TOWN} in the early morning, mist on the green mountains, a rainbow of rice terraces, no people in front.", { src: HIS, mood: "wonder" });
s("b", "village", "Her family loved learning. Her father was a judge, and her grandfather was a scholar who studied the stars.",
  "Inside a wooden Minangkabau house, {RG}, here only about five years old, sits on a woven mat beside her kind father, a Minangkabau judge with a short grey beard in a white shirt and black peci cap, who shows her a big book; a shelf of books and a brass star-globe behind them.", { src: HIS });
s("c", "village", "Her people, the Minangkabau, build beautiful houses with roofs that curve up like the horns of a buffalo.",
  "A beautiful traditional Minangkabau house with a long carved wooden front and a sweeping roof rising to several sharp points like buffalo horns, rice barns beside it, a water buffalo grazing in front, mountains behind. {RG} waves from the steps.", { mood: "joy" });
p("memory", "home", "village", "Find the pairs! Things of her home in the mountains.", { icons: ["⛰️", "🌾", "🏠", "🐃", "🕌", "🌧️"] }, { img: "c" });
q("q", "field", "Where was Rahmah born?", ["In the mountains of Sumatra", "⛰️"], ["In a big desert", "🏜️"], "She was born in Padang Panjang, in the green mountains of West Sumatra.", { img: "a" });

chapter("r2", "📖", "Learning to Read", null, [], null, CITE);
s("a", "dusk", "When Rahmah was six years old, her father died. She missed him very much.",
  "At dusk, {RG} sits quietly on the wooden steps of her house holding her father's book to her chest, looking sad, the mountains purple behind her.", { src: HIS, mood: "sad" });
s("b", "village", "But her father's students came to teach her. She learned to read and write, in Arabic letters and in Latin letters too.",
  "{RG} sits at a low wooden desk writing carefully on a slate, while a kind young Minangkabau teacher in a white shirt and black peci cap points at the slate and smiles; books on the floor around them. The writing is only marks too small to read.", { src: HIS, mood: "joy" });
p("count", "books", "village", "Count the books she read! Tap each one.", { total: 6, icon: "📖", got: "✨" }, { img: "b" });
s("c", "village", "She also learned how to help mothers when their babies are born.",
  "In a simple clinic room with a wooden cradle and white cloths, a kind Minangkabau midwife in a white headscarf shows {RG}, a little older now, how to fold a soft baby blanket.", { src: HIS });
q("q", "village", "Who taught Rahmah after her father died?", ["Her father's students", "📖"], ["Nobody at all", "🚫"], "Her father's students came and taught her to read and write.", { img: "b" });

chapter("r3", "🌙", "No More School", null, [], null, CITE);
s("a", "village", "When Rahmah was still very young, her family arranged for her to marry, and she had to leave school.",
  "{RG}, now about fifteen, stands at the gate of a small school building looking back at it sadly, holding her books, while other girls go in.", { src: HIS, mood: "longing" });
s("b", "night", "But Rahmah did not stop learning. She joined study circles, where women sat together in the evening to learn about Islam.",
  "At night in a lamplit room of a wooden house, {RY} and a circle of Minangkabau women in white headscarves sit on mats around an old woman teacher reading from a book.", { src: HIS, mood: "wonder" });
p("hold", "learn", "night", "Keep learning, like Rahmah. Press and hold.", { ms: 2500, icon: "📚", hint: "Press and hold", done: "Never stop learning" }, { img: "b" });
s("c", "dawn", "A few years later, she went back to school.",
  "At sunrise {RY} walks happily along a path between rice fields towards a school building, her books held close, the mountains glowing behind.", { src: HIS, mood: "triumph" });
q("q", "night", "What did Rahmah do when she had to leave school?", ["She kept learning", "📚"], ["She stopped learning", "😴"], "She kept learning, in study circles, until she could go back to school.", { img: "b" });

chapter("r4", "🏫", "Back to School", null, [], null, CITE);
s("a", "village", "Her big brother, Zainuddin, had started a school called Diniyah. Rahmah went back there to study.",
  "In front of a simple two-storey wooden school building in {TOWN}, a cheerful Minangkabau man of about thirty in a white shirt and black peci cap welcomes {RY} with a smile.", { src: HIS });
s("b", "village", "After class, she gathered the girls together, to study more.",
  "In a classroom after lessons, {RY} sits on a mat with seven {GIRLS} in a circle around her, books open, all smiling and talking.", { src: HIS, mood: "joy" });
p("count", "girls", "village", "Count the girls in her study circle. Tap each one.", { total: 7, icon: "🧕", got: "✨" }, { img: "b" });
s("c", "field", "She saw that girls needed a school of their own, where they could learn everything, and feel at home.",
  "{RY} stands on a hill above {TOWN} at golden hour, looking at the town thoughtfully, one hand on her heart, as if planning something.", { src: HIS, mood: "awe" });
q("q", "field", "What did Rahmah want for girls?", ["A school of their own", "🏫"], ["No school at all", "🚫"], "She wanted girls to have a school of their own.", { img: "c" });

chapter("r5", "🕌", "A School for Girls", null, [], null, CITE);
s("a", "city", "On the first of November, 1923, Rahmah opened a school just for girls. She called it Diniyah Putri.",
  "A joyful morning in {TOWN}: {RY} stands in front of a mosque with a tiered roof, welcoming {GIRLS} who arrive carrying books and slates.", { src: HIS, mood: "triumph" });
s("b", "city", "At first there was no school building. Lessons were in a mosque, and Rahmah was the main teacher.",
  "Inside a wooden mosque with carved pillars, {RY} stands teaching in front of a wooden board while {GIRLS} sit on mats in rows, listening.", { src: HIS });
s("c", "city", "The first students were seventy-one women and girls. Many of them were young mothers.",
  "Outside the mosque, a crowd of Minangkabau young women in long dresses and headscarves that cover all their hair, some holding babies on their hips, line up happily to join the school; {RY} writes their names in a book.", { src: HIS, mood: "joy" });
srt("lessons", "city", "What did they learn at Diniyah Putri? Sort them.", ["They learned it", "✅"], ["Not on the list", "❌"], [
  ["📖", "The Qur'an and Islam", 0], ["🎮", "Video games", 1], ["🔤", "Arabic", 0],
  ["🧵", "Sewing and crafts", 0], ["🎩", "Magic tricks", 1], ["🛹", "Skateboarding", 1]
], "Think again. Was that taught in 1923?", { img: "b" });
q("q", "city", "Where were the very first lessons?", ["In a mosque", "🕌"], ["In a palace", "🏰"], "The first lessons were in a mosque.", { img: "b" });

chapter("r6", "💪", "Not Everyone Agreed", null, [], null, CITE);
s("a", "city", "Not everyone liked the new school. Some people said that girls did not need to go to school.",
  "In a street of {TOWN}, two grumpy Minangkabau men in black peci caps frown and shake their heads at a group of {GIRLS} walking past with their books.", { src: HIS, mood: "tense" });
s("b", "city", "Rahmah talked kindly with the scholars of her town, and showed them that Islam honours learning, for girls as well as boys.",
  "In a wooden meeting room, {RY} sits respectfully on a mat speaking calmly with three old Minangkabau scholars with white beards and caps, who listen and begin to nod.", { src: HIS });
s("c", "dusk", "Then, in 1924, her brother Zainuddin died. Many thought the school would close. But Rahmah kept going.",
  "At dusk {RY} stands alone at the door of the school, sad but determined, a lamp in her hand, the mountains dark behind her.", { src: HIS, mood: "longing" });
srt("going", "dusk", "When something is hard: keep going, or give up?", ["Keep going", "💪"], ["Give up", "🏳️"], [
  ["🔁", "Try again tomorrow", 0], ["😤", "Throw it away", 1], ["🙋", "Ask for help", 0],
  ["🐢", "Go slowly but steadily", 0], ["🛑", "Stop at the first mistake", 1], ["😩", "Say: I can't do it", 1]
], "Think again. Is that keeping going, or giving up?", { img: "c" });
q("q", "dusk", "What did Rahmah do when things were hard?", ["She kept going", "💪"], ["She gave up", "🏳️"], "She kept going, and the school did not close.", { img: "c" });
