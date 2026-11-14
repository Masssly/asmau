/* Chapters 1 to 8: the cruel king, the river, the palace, the mistake, Madyan. */
"use strict";
const { chapter, s, p, q, ord, mat, srt, chg, TAF } = require("./lib");

chapter("m1", "👑", "A Proud King", "28:3-6", [], [
  "Verses 28:3–6. Pharaoh raised himself high in the land and split its people into groups. He oppressed one group: the verse says he slaughtered their sons and let their women live. The game says only that their baby boys were to be taken away.",
  "Verses 28:5–6 give Allah's plan: to favour the oppressed, make them leaders and heirs, and show Pharaoh, Haman and their armies the very thing they feared."
]);
s("a", "egypt", "Long, long ago, in the land of Egypt, there lived a king called Pharaoh. He was very proud. He thought he was greater than everyone.",
  "Bright day. {PH} stands high on a balcony of {PAL}, chin raised, arms folded, looking down over an ancient river city of mud-brick houses and date palms.");
s("b", "grey", "Pharaoh was cruel to one group of people, the Children of Israel. He made their lives very hard. And he gave a terrible order: their baby boys were to be taken away.",
  "A narrow street of small mud-brick homes at dusk. Worried mothers and fathers in simple clothes hold their little children close in the doorways, while two palace guards with spears walk past in the distance.", { mood: "longing" });
s("c", "dawn", "But Allah had a plan. Allah wanted to help the people who were being hurt, and one day to make them the leaders.",
  "Sunrise over the same poor street: warm golden light breaks through clouds onto the rooftops, a family looks up with hope, doves fly over the houses.", { mood: "nile" });
q("q", "dawn", "Who had a plan to help the people who were being hurt?", ["Allah", "✨"], ["Pharaoh", "👑"], "Not Pharaoh. He was the one hurting them. Allah had a plan to help.", { img: "c" });
p("memory", "mem", "egypt", "Find the pairs: things you can see in the land of Egypt.", { icons: ["👑", "🌴", "🐪", "🏺", "☀️", "🐊"] });

chapter("m2", "🧺", "The Baby on the River", "28:7", ["20:38-39"], [
  "Verse 28:7 and verses 20:38–39. Musa's mother is inspired to nurse him and, when she fears for him, to put him into the chest and the chest into the river, with the promise that he will be returned to her and made a messenger. 20:39 adds that Allah cast His love over Musa and that he was reared under Allah's watchful eye.",
  "The chest is in the verse (20:39). Ibn Kathir's tafsir (abridged English) adds details the verses do not give: that her house was on the bank of the Nile and that she made a box into a cradle for him. The game's 'getting the chest ready' activity is built on that."
]);
s("a", "river", "In that hard time, a mother had a baby boy. His name was Musa. She loved him very much, and she was afraid the soldiers would find him.",
  "Inside a small mud-brick home by {NILE}, {MUM} holds {BABY} close and looks anxiously toward the doorway; soft morning light, a clay pot and a woven mat.", { mood: "longing" });
s("b", "river", "Allah put a message in her heart: feed your baby. And when you are afraid for him, put him into the river. Do not be afraid, and do not be sad. We will bring him back to you, and make him one of the messengers.",
  "{MUM} sits by a window nursing a bundle wrapped in white, her face calm and trusting, a soft warm glow of light falling on her from above; {NILE} sparkles outside.");
p("build", "build", "river", "She got a little chest ready, like a cradle. Tap to fit every piece.", { n: 8, icon: "PLANK", cols: 4 }, { src: TAF });
s("c", "river", "With a brave heart, she laid baby Musa in the chest, and set it on the water of the great river.",
  "At the edge of {NILE} at dawn, {MUM} kneels in the reeds and gently lowers {CHEST} holding {BABY} onto the calm water.", { cue: "splash" });
p("journey", "push", "river", "Gently, gently, help the chest float out onto the river.", { from: "🏠", to: "🌊", icon: "CHEST", steps: 6 });
s("d", "river", "The river carried him along, gently, gently. And Allah was watching over baby Musa the whole way.",
  "{CHEST} with {BABY} sleeping inside floats down the middle of {NILE}; golden light, lotus flowers, an ibis and dragonflies, nobody else in sight.", { mood: "nile" });
p("trail", "ripples", "river", "Tap each ripple to help the river carry him along.", { n: 7, icon: "🌊", walker: "CHEST" });
q("q", "river", "What did Allah tell Musa's mother?", ["Do not be afraid", "💛"], ["Hide and cry", "😢"], "No. Allah told her: do not be afraid, and do not be sad.", { img: "b" });

chapter("m3", "💛", "The Queen's Heart", "28:8-9", ["20:39"], [
  "Verses 28:8–9. Pharaoh's household picked the child up, not knowing he would become their opponent. Pharaoh's wife said he would be a joy to the eye for her and for Pharaoh, and said: do not kill him; he may be useful to us, or we may adopt him. The game says 'do not harm him'.",
  "The verses do not name her. Ibn Kathir's tafsir (abridged English) names her Asiyah bint Muzahim, says the servant women brought the chest to her unopened, and that Allah filled her heart with love when she saw the child. It also reports Pharaoh's reply, 'For you he may be, but not for me', which the game leaves out.",
  "On 20:39, 'I cast My love over you', the same tafsir comments that no one saw Musa without loving him. The hearts activity is built on that."
]);
s("a", "palace", "The river carried the chest right up to the palace of Pharaoh! The people of his house saw it in the water.",
  "At stone steps where {PAL} meets {NILE}, three servant women in plain linen dresses and headscarves point in surprise at a small closed wooden chest floating among the reeds.");
p("pull", "pull", "river", "Pull the chest out of the water. Pull, pull, pull!", { icon: "CHEST", label: "Pull!" });
s("b", "palace", "They carried it, still closed, to the queen. Her name was Asiya.",
  "In a bright palace room with painted columns, two servant women set a small closed wooden chest down in front of {ASIYA}, who leans forward with curiosity.", { src: TAF });
chg("open", "palace", "What is inside? Tap the chest to open it.", [["CHEST", ""], ["👶", "A beautiful baby boy!"]], { img: "b" });
s("c", "palace", "Inside was a beautiful baby boy. And Allah filled her heart with love for him.",
  "{ASIYA} lifts {BABY} out of an open wooden chest and holds him up with a delighted, loving smile; soft golden light through tall windows.", { mood: "nile" });
p("count", "hearts", "palace", "Everyone who saw baby Musa loved him. Tap every heart to make it glow.", { total: 8, icon: "🤍", got: "💛" }, { src: TAF, img: "c" });
s("d", "palace", "Asiya said to Pharaoh: this baby will be a joy for me and for you. Do not harm him! He may help us one day, or we may take him as our son.",
  "In {HALL}, {ASIYA} holds {BABY} protectively and speaks earnestly to {PH}, who sits on his throne frowning with one hand raised.");
s("e", "palace", "So baby Musa was safe, in the palace of the very king who was looking for baby boys. Pharaoh did not know what Allah had planned.",
  "=d");
q("q", "palace", "Who asked Pharaoh not to harm the baby?", ["Asiya, the queen", "👸"], ["A soldier", "🛡️"], "No. It was Asiya, the queen. Allah had filled her heart with love.", { img: "c" });

chapter("m4", "🤱", "A Sister's Clever Plan", "28:10-13", ["20:40"], [
  "Verses 28:10–13 and 20:40. The heart of Musa's mother became empty; she would have given him away had Allah not strengthened her heart. She told his sister to follow him, and the sister watched from a distance unnoticed. Allah had made him refuse every wet nurse, and the sister offered a household that would bring him up. He was returned to his mother so that she would be comforted and would know that Allah's promise is true.",
  "From Ibn Kathir's tafsir (abridged English), not the verses: that 'empty' means she could think of nothing but Musa (reported from Ibn Abbas, Mujahid, Ikrimah, Sa'id bin Jubayr and others); that the sister was the older child; that the queen paid the mother; and that only about a day and a night passed between the distress and the relief, 'and Allah knows best'.",
  "The same tafsir reports from Ibn Abbas that the palace people doubted the sister and seized her until she explained herself. The game leaves that out."
]);
s("a", "river", "At home, Musa's mother could think of nothing but her baby. Her heart felt empty. But Allah made her heart strong, so that she would keep on trusting Him.",
  "Evening inside the small riverside home: {MUM} sits beside an empty woven cradle, one hand on her heart, eyes closed in quiet prayer; a single oil lamp glows.", { mood: "longing" });
s("b", "river", "She said to Musa's big sister: follow him. So his sister watched from far away, and nobody noticed her.",
  "{SIS} walks along the reedy bank of {NILE}, peeking through tall reeds at a small wooden chest floating far off on the water; she pretends to carry a water jar.");
p("trail", "follow", "river", "Follow the chest quietly along the bank. Tap each footprint.", { n: 7, icon: "👣", walker: "🧕" });
s("c", "palace", "In the palace, baby Musa was hungry. He cried and cried. Nurse after nurse came to feed him, but he would not drink from any of them.",
  "In a palace room, {ASIYA} rocks a crying {BABY} while a line of nurses in plain headscarves wait and shrug helplessly.", { cue: "cry" });
p("count", "nurses", "palace", "Try every nurse. Tap each one. Baby Musa says no, no, no!", { total: 5, icon: "🧕", got: "🙅" }, { img: "c" });
s("d", "palace", "Then his sister stepped forward and said: shall I show you a family who will feed him, and take good care of him?",
  "{SIS} steps bravely forward in a palace courtyard and speaks up to {ASIYA}, who holds {BABY}; palace servants turn to look at the girl.");
s("e", "river", "And who was it? Musa's own mother! He drank at once. Allah gave him back to her, so that her heart would be glad, and so that she would know: the promise of Allah is always true.",
  "{MUM} sits cradling {BABY} in her arms again, tears of joy on her smiling face, while {SIS} hugs her shoulder; warm golden light, the riverside home.", { mood: "triumph" });
s("f", "river", "The queen even paid her to feed her own baby! It is told that only about a day and a night had gone by.", "=e", { src: TAF, mood: "triumph" });
q("q", "river", "Who fed baby Musa in the end?", ["His own mother", "🤱"], ["A palace nurse", "🧕"], "No. He would not drink from any nurse. Allah gave him back to his own mother.", { img: "e" });
ord("ord", "river", "What happened first? Tap them in order.", [
  ["🌊", "Into the river", "First, his mother put him on the river."],
  ["👸", "Found at the palace", "Then the queen found him and loved him."],
  ["🍼", "He will not drink", "Then he would not drink from any nurse."],
  ["🤱", "Back with his mother", "And then he was back in his mother's arms."]
], "Not that one yet. Think: what happened before it?");

chapter("m5", "🏛️", "Growing Up in the Palace", "28:14", ["20:27-28"], [
  "Verse 28:14. When Musa reached full maturity Allah gave him wisdom and knowledge: 'this is how We reward those who do good'.",
  "The hot coal is not in the Qur'an. Ibn Kathir's tafsir (abridged English), explaining the prayer 'untie the knot in my tongue' (20:27), says Musa had a lisp from an incident in which he was offered a date and a hot coal and put the coal on his tongue. The tafsir gives it in one sentence and refers elsewhere for the full story; the game adds nothing to it. The same tafsir says that as a child Musa stayed in Pharaoh's own room.",
  "The sorting activity (safe to eat, or too hot to touch) is a safety game of ours hung on that report."
]);
s("a", "palace", "Musa grew up in the palace, like a prince. It is told that he even slept in the king's own room.",
  "A happy toddler boy in a small white tunic with a blue sash runs laughing across the polished floor of {HALL} toward {ASIYA}, who kneels with open arms.", { src: TAF, mood: "nile" });
s("b", "palace", "It is told that once, when he was little, Musa was given a sweet date and a hot, glowing coal. He put the coal to his tongue! After that, speaking was hard for him.",
  "On a low table in a palace room sit two bowls, one holding brown dates and one holding a red glowing coal; a toddler boy in a white tunic with a blue sash reaches a hand toward them while {ASIYA} watches closely.", { src: TAF });
srt("sort", "palace", "Help the little ones choose. Is it safe to eat, or too hot to touch?", ["Safe to eat", "😋"], ["Too hot! Do not touch", "🔥"], [
  ["🌴", "A sweet date", 0], ["♨️", "A glowing coal", 1], ["🍞", "Warm bread", 0], ["🕯️", "A candle flame", 1], ["🥛", "A cup of milk", 0]
], "Think again. Would it burn you?");
s("c", "palace", "When Musa was fully grown and strong, Allah gave him wisdom and knowledge. That is how Allah rewards the people who do good.",
  "{MY} stands on a palace terrace at golden hour looking thoughtfully over the river city, a scroll in his hand.");
p("puzzle", "puz", "palace", "Put the picture of Musa back together. Tap two pieces to swap them.", { pic: "m5-c", n: 2 });
q("q", "palace", "What did Allah give Musa when he was grown?", ["Wisdom and knowledge", "💡"], ["A golden crown", "👑"], "Not a crown. Allah gave him wisdom and knowledge.", { img: "c" });

chapter("m6", "🏃", "A Big Mistake", "28:15-21", [], [
  "Verses 28:15–21. Musa entered the city unnoticed and found two men fighting, one of his own people and one an enemy. His kinsman called for help; Musa struck the other with his fist and killed him. The game says the man 'fell down and did not get up again'. Musa said 'this is Satan's work', asked forgiveness and was forgiven, and promised never to support wrongdoers.",
  "Left out: verses 28:18–19, where the same kinsman calls for help again the next day, Musa calls him a troublemaker, and the man lets slip what happened the day before.",
  "In verse 28:20 the man who came running says the authorities are talking about killing Musa. The game says they are 'coming to punish' him."
]);
s("a", "city", "One day Musa walked into the city when the streets were quiet. He found two men fighting. One was from his own people. The other was from Pharaoh's people.",
  "A quiet sunlit city street of mud-brick walls. {MY} walks around a corner and sees two men in the distance grabbing each other's clothes and arguing, one in plain brown, one in a soldier's tunic.");
s("b", "city", "The man from his people shouted: help me! Musa hit the other man with his fist, just once. But the man fell down, and did not get up again.",
  "{MY} stands in a city street looking down in shock at his own closed hand, his face full of worry; a man in plain brown clothes backs away behind him.", { mood: "dread" });
s("c", "city", "Musa was so sorry. He said: this is the work of Shaytan. My Lord, I have done wrong. Please forgive me. And Allah forgave him. Allah is the Most Forgiving, the Most Kind.",
  "{MY} kneels alone in a quiet corner of a courtyard with his palms raised in prayer and his eyes closed, a soft warm light falling on him.", { mood: "longing" });
p("hold", "sorry", "city", "Say sorry from the heart, like Musa. Press and hold the hands until they shine.", { ms: 3000, icon: "🤲", hint: "Press and hold", done: "Allah is the Most Forgiving" }, { img: "c" });
q("q", "city", "What did Musa do when he had done something wrong?", ["He asked Allah to forgive him", "🤲"], ["He pretended nothing happened", "🙈"], "No. Musa said sorry straight away, and asked Allah to forgive him.", { img: "c" });
s("d", "city", "Soon the whole city knew what had happened. Then a man came running from the far side of the city. He said: Musa! The chiefs are coming to punish you. Leave now! I am giving you good advice.",
  "A man in a plain tunic runs up breathless to {MY} in a narrow city street and points urgently toward the city gate.", { mood: "dread" });
s("e", "desert", "So Musa left the city, afraid, looking over his shoulder. He prayed: my Lord, save me from the people who do wrong.",
  "{MY} hurries out through a great mud-brick city gate into open desert at dusk, glancing back over his shoulder.", { mood: "dread" });
p("journey", "flee", "desert", "Help Musa slip away from the city.", { from: "🏙️", to: "🏜️", icon: "🚶", steps: 7 });

chapter("m7", "🐑", "The Well of Madyan", "28:22-24", ["28:26"], [
  "Verses 28:22–24. Musa turned towards Madyan hoping his Lord would guide him. At its water he found men watering flocks and two women holding theirs back; they could not water until the shepherds left, and their father was very old. He watered for them, withdrew to the shade and prayed: 'My Lord, I am in dire need of whatever good You send me.'",
  "The heavy rock is not in the verses. Ibn Kathir's tafsir (abridged English), on 'the strong, the trustworthy' in 28:26, reports from Umar, Ibn Abbas, Shurayh, Abu Malik, Qatadah, Ibn Ishaq and others that the daughter said Musa had lifted a rock that only ten men could lift. The same tafsir says he sat beneath a tree (Ibn Abbas, Ibn Mas'ud, As-Suddi).",
  "The tafsir also mentions, with 'and Allah knows best', a report that an angel on a horse showed Musa the way. The game does not use it."
]);
s("a", "desert", "Musa set off towards a land called Madyan. It was a long, long way. He said: I hope my Lord will guide me to the right way.",
  "{MY} walks alone across a wide desert of dunes and rocks under a hot sun, small against the huge landscape, his tunic dusty.", { mood: "trek" });
p("trail", "walk", "desert", "Walk with Musa across the desert. Tap each footprint.", { n: 8, icon: "👣", walker: "🚶" });
s("b", "well", "At last he came to the water of Madyan. A crowd of shepherds were watering their sheep. And standing back, away from the crowd, were two young women, holding their sheep back.",
  "A desert well ringed with stones under acacia trees: a noisy crowd of shepherd men with many sheep at the well, and off to one side {DAU} wait patiently, holding back a small flock.");
s("c", "well", "Musa asked: what is the matter? They said: we cannot water our sheep until the shepherds have gone. And our father is a very old man.",
  "{MY}, dusty and tired, speaks kindly at a respectful distance with {DAU} beside their small flock of sheep; acacia trees and a stone well behind.");
s("d", "well", "It is told that a great heavy rock covered the well, a rock that it took ten men to lift. Musa lifted it all by himself!",
  "{MY} strains with all his strength to lift a huge round flat stone off the mouth of a desert well, sheep crowding around his legs.", { src: TAF });
p("pull", "rock", "well", "Lift the heavy rock off the well. Pull, pull, pull!", { icon: "ROCK", label: "Lift!" }, { src: TAF });
p("count", "sheep", "well", "Now give every sheep a drink. Tap each one.", { total: 8, icon: "🐑", got: "💧" });
s("e", "well", "When every sheep had drunk, Musa went to rest in the shade. He was tired and hungry, and far from home. He prayed: my Lord, I am in need of whatever good You send me.",
  "{MY} sits resting in the shade of an acacia tree beside the well, his palms raised in prayer, sheep drinking at a stone trough nearby.", { mood: "longing" });
q("q", "well", "Musa had nothing left. Who did he ask for help?", ["Allah", "🤲"], ["The shepherds", "🧔"], "No. Musa asked Allah: my Lord, I am in need of whatever good You send me.", { img: "e" });
p("memory", "mem", "well", "Find the pairs from the well of Madyan.", { icons: ["🐑", "ROCK", "💧", "🌳", "🐐", "☀️"] });

chapter("m8", "🏡", "A New Home", "28:25-28", [], [
  "Verses 28:25–28. One of the two women came walking shyly with her father's invitation. Musa told his story and the old man said: do not be afraid, you are safe now. A daughter said: hire him, the best to hire is the strong and trustworthy. The father offered marriage to one of his daughters for eight years of work, ten if Musa chose, and Musa agreed. The verses do not name the father.",
  "From Ibn Kathir's tafsir (abridged English), not the verses: Musa asked her to walk behind him and throw a pebble to show the way (reported from Umar, Ibn Abbas and others, as her explanation of 'trustworthy'); and Musa completed the longer term, ten years, which the tafsir quotes from al-Bukhari on the authority of Ibn Abbas."
]);
s("a", "well", "The two sisters went home and told their father what had happened. Soon one of them came back, walking shyly. She said: my father is asking for you. He wants to thank you for watering our sheep.",
  "A modest young woman in a purple headscarf stands shyly at a distance, eyes lowered, speaking to {MY} who rises from the shade of an acacia tree by the well.");
s("b", "desert", "On the way, Musa walked in front. It is told that he asked her to walk behind him, and to throw a little pebble to show him which way to turn.",
  "{MY} walks ahead on a stony desert path while, well behind him, a modest young woman in a purple headscarf tosses a small pebble to one side of the path.", { src: TAF, mood: "pastoral" });
p("trail", "pebble", "desert", "Show Musa the way. Tap where each pebble lands.", { n: 6, icon: "ROCK", walker: "🚶" }, { src: TAF });
s("c", "field", "Musa told the old man his whole story. The old man said: do not be afraid. You are safe now.",
  "Inside a simple shepherd's home with woven rugs, {ELD} sits and listens warmly, one hand raised in reassurance, as {MY} sits before him telling his story over a shared bowl of food.");
s("d", "field", "One daughter said: father, hire him! The best person to hire is one who is strong, and can be trusted.", "=c");
q("q", "field", "What makes the best helper?", ["Strong, and can be trusted", "💪"], ["Loud and bossy", "📢"], "No. She said the best helper is strong, and can be trusted.", { img: "c" });
s("e", "field", "The old man said: I would like you to marry one of my daughters, and to work for me for eight years. Ten, if you choose. And Musa agreed.",
  "A joyful small wedding gathering outside a shepherd's home: {ELD} clasps the hand of {MY}, a bride in a purple headscarf stands smiling shyly beside her sister, sheep and acacia trees around.", { mood: "triumph" });
p("count", "years", "field", "It is told that Musa stayed the full ten years. Tap each sun to count them.", { total: 10, icon: "☀️" }, { src: "From a hadith in al-Bukhari" });
p("catch", "flock", "field", "Musa was a shepherd now. Gather the sheep as they wander.", { target: 7, icon: "🐑", into: "🏡" });
p("puzzle", "puz", "field", "Put the picture back together. Tap two pieces to swap them.", { pic: "m8-e", n: 3 });
