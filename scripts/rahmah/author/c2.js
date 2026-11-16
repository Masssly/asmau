/* Chapters 7 to 11: the earthquake, on her own feet, a new flag, to Cairo, her school today. */
"use strict";
const { chapter, s, p, q, ord, srt, line, HIS } = require("./lib");
const CITE = "Histories of her life (Audrey Kahin, Jeffrey Hadler and others; see the notes)";

chapter("r7", "🏚️", "The Earthquake", null, [], null, CITE);
s("a", "city", "In 1926, a big earthquake shook Padang Panjang, and the school building fell down.",
  "The morning after an earthquake in {TOWN}: a wooden school building leaning and partly fallen, planks on the ground, the mountains calm behind under a clear sky. No people.", { src: HIS, mood: "sad" });
s("b", "field", "But the lessons did not stop. For years, the girls learned in simple shelters.",
  "Under a simple shelter of bamboo poles and a palm-leaf roof beside rice fields, {GIRLS} sit on mats learning while {RY} teaches from a small board.", { src: HIS, mood: "joy" });
s("c", "sea", "Rahmah travelled to many towns and islands, to collect money for a new school.",
  "{RY} stands at the rail of a small steamship crossing a calm sea between green islands, a cloth bag and a notebook in her hands, looking ahead hopefully.", { src: HIS });
p("journey", "travel", "sea", "Help Rahmah travel to collect money for the school.", { from: "🏚️", to: "🏫", icon: "⛵", steps: 6 }, { img: "c" });
s("d", "city", "In 1928, the new school opened!",
  "A fine new two-storey school building with a curved Minangkabau roof in {TOWN}, a crowd of {GIRLS} cheering in front of it, {RY} smiling at the door.", { src: HIS, mood: "triumph" });
p("build", "bricks", "city", "Build the new school. Tap to place every brick.", { n: 8, icon: "🧱", cols: 4 }, { img: "d" });

chapter("r8", "🌱", "On Her Own Feet", null, [], null, CITE);
s("a", "palace", "In those days the land was ruled by the Dutch, and their government paid money to some schools. But Rahmah would not take it: she wanted her school to be free to teach in its own way.",
  "In a colonial office with a ceiling fan, a Dutch official in a white suit holds out a bag of money across a desk, and {RY} politely raises her hand to say no, calm and firm.", { src: HIS });
s("b", "city", "The school grew and grew. Soon about five hundred girls were learning there.",
  "A big school yard in {TOWN} full of {GIRLS} in neat rows for morning assembly, {RY} speaking from the steps of the school.", { src: HIS, mood: "joy" });
s("c", "city", "She also opened a college to train women to be teachers.",
  "In a classroom, young Minangkabau women in headscarves stand at the front practising teaching a class of smaller girls, while {RY} watches proudly at the back.", { src: HIS });
srt("teacher", "city", "What does a good teacher do? Sort them.", ["A good teacher", "🍎"], ["Not a good teacher", "🙅"], [
  ["👂", "Listens to every child", 0], ["😆", "Laughs at mistakes", 1], ["🔁", "Explains again, kindly", 0],
  ["📢", "Shouts all the time", 1], ["🤲", "Is patient", 0], ["👉", "Helps only some children", 1]
], "Think again. Would a good teacher do that?", { img: "c" });

chapter("r9", "🚩", "A New Flag", null, [], null, CITE);
s("a", "city", "For many years, Indonesia was ruled by others. Then, in 1945, Indonesia became free.",
  "People of {TOWN} gather in the street listening to a radio set on a table outside a shop, faces full of joy and surprise; every woman's hair covered.", { src: HIS, mood: "triumph" });
s("b", "city", "When Rahmah heard the news, she raised the red and white flag of Indonesia in the school yard.",
  "In the school yard, {RO} pulls the rope to raise a red-and-white flag up a tall flagpole, while {GIRLS} watch and cheer under a blue sky.", { src: HIS, mood: "triumph" });
p("hold", "flag", "city", "Raise the flag! Press and hold.", { ms: 2500, icon: "🚩", hint: "Press and hold", done: "The flag is flying!" }, { img: "b" });
q("q", "city", "What colours are on Indonesia's flag?", ["Red and white", "🚩"], ["Blue and yellow", "💙"], "Indonesia's flag is red and white.", { img: "b" });

chapter("r10", "🎓", "To Cairo", null, [], null, CITE);
s("a", "city", "Years later, the head of al-Azhar, a great old university in Egypt, came all the way to visit her school.",
  "In the school yard, {RO} welcomes a dignified old Egyptian scholar in a red-and-white turban and a long dark robe, while {GIRLS} stand in neat rows to greet him.", { src: HIS, mood: "awe" });
s("b", "desert", "Then Rahmah went on Hajj to Makkah.",
  "{RO} in plain white clothes stands among pilgrims looking at the Ka'bah in Makkah, her hands raised in prayer; every woman's hair covered.", { src: HIS, mood: "awe" });
p("journey", "cairo", "desert", "Help Rahmah travel to Makkah, and then to Cairo.", { from: "⛰️", to: "🕌", icon: "🧳", steps: 7 }, { img: "b" });
s("c", "palace", "In Cairo, the teachers of al-Azhar gave her the title Syaikhah: a great scholar. No woman had ever been given it before.",
  "In a grand hall of al-Azhar in Cairo with stone arches, old Egyptian scholars in turbans stand and applaud as {RO} receives a rolled certificate with a red ribbon, smiling humbly.", { src: HIS, mood: "triumph" });
s("d", "city", "After that, girls from her school could go to study at al-Azhar too.",
  "Two young Indonesian women in headscarves, carrying suitcases, smile and wave goodbye to {RO} at the gate of the school, ready to travel to study in Egypt.", { src: HIS, mood: "joy" });
q("q", "palace", "What title did al-Azhar give Rahmah?", ["Syaikhah: a great scholar", "🎓"], ["Queen", "👑"], "Al-Azhar called her Syaikhah, a great scholar. No woman had been given it before.", { img: "c" });

chapter("r11", "🌟", "Her School Today", null, [], null, CITE);
s("a", "city", "Rahmah never stopped working. In 1967, a university for women, which she had worked for, was opened.",
  "{RO} cuts a ribbon at the door of a new university building in West Sumatra, young women students in headscarves clapping around her.", { src: HIS, mood: "triumph" });
s("b", "dusk", "Rahmah died in 1969, in Padang Panjang, where she was born. May Allah have mercy on her.",
  "Padang Panjang at dusk, the school building quiet under the mountains, a soft light in one window. No people.", { src: HIS, mood: "sad" });
s("c", "city", "Her school is still open today, full of girls learning.",
  "A bright modern school campus in Padang Panjang today with buildings that have curved Minangkabau roofs, Indonesian girls in white headscarves and school uniforms walking to class with books, laughing.", { src: HIS, mood: "joy" });
s("d", "palace", "And in 2025, Indonesia named her a National Hero.",
  "In a grand white palace hall in Jakarta today, an Indonesian woman in a headscarf receives a framed award on behalf of the school, people applauding; a portrait of Rahmah in a white headscarf on an easel beside her.", { src: HIS, mood: "triumph" });
ord("story", "city", "Tell Rahmah's story. Tap in order.", [
  ["⛰️", "Born in the mountains", "First, Rahmah was born in the mountains of Sumatra."],
  ["📖", "She learned to read", "She learned to read and write."],
  ["🏫", "A school for girls", "She opened a school for girls."],
  ["🏚️", "The earthquake", "An earthquake knocked it down, and she built it again."],
  ["🚩", "The new flag", "She raised Indonesia's flag at the school."],
  ["🎓", "Al-Azhar", "And al-Azhar called her Syaikhah."]
], "Listen again, and tell it in order.", { img: "c" });

line("end-a", "This is the story of Rahmah El Yunusiyyah, who opened a school for girls when many people said girls did not need one, and never gave up. Her school is still open today.");
