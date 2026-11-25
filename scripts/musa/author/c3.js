/* Chapters 18 to 25: the desert, the mountain, the calf, the cow, the holy land, al-Khidr, the end. */
"use strict";
const { chapter, s, p, q, ord, mat, srt, chg, line, TAF, HAD } = require("./lib");

chapter("m18", "💧", "Food from the Sky, Water from the Rock", "2:57-60", [], null);
s("a", "desert", "Now the people travelled through the hot, dry desert. And Allah sent clouds to give them shade.",
  "{FOLK} walk through a hot sandy desert while a wide soft white cloud floats low above them casting cool shade over the whole group; {MU} walks in front.", { mood: "trek" });
s("b", "camp", "Allah sent down food for them too: a special food called manna, and little birds called quails. Eat from the good things We have given you!",
  "Early morning at {CAMP}: happy children and parents gather small pale flakes from the ground into baskets while plump little brown quail birds land all around the tents.", { mood: "triumph" });
p("catch", "manna", "camp", "Gather the manna in your basket. Tap each piece.", { target: 8, icon: "✨", into: "🧺" });
p("catch", "quail", "camp", "Here come the quails! Tap each little bird.", { target: 6, icon: "🐦", into: "⛺" });
s("c", "desert", "Then the people were thirsty, and there was no water anywhere. Musa prayed for water. Allah said: strike the rock with your staff.",
  "{MU} stands before a big square grey rock in the dry desert with his staff raised to strike it, thirsty {FOLK} watching behind him with empty water skins.", { mood: "longing" });
p("count", "springs", "desert", "Strike the rock! Tap it twelve times, and count the springs.", { total: 12, icon: "ROCK", got: "💧" });
s("d", "desert", "Twelve springs came gushing out of the rock, one for each of the twelve families. And everybody knew their own place to drink.",
  "Twelve streams of clear water burst from a big square rock and run in channels across the sand; families kneel to drink and fill jars, children splash; {MU} smiles.", { src: TAF, mood: "triumph", cue: "gush" });
q("q", "desert", "How many springs came out of the rock?", ["Twelve", "💧"], ["Two", "✌️"], "No. Twelve springs, one for each of the twelve families.", { img: "d" });
p("memory", "mem", "camp", "Find the pairs: the gifts Allah sent in the desert.", { icons: ["☁️", "🐦", "💧", "ROCK", "✨", "⛺"] });

chapter("m19", "⛰️", "The Mountain and the Tablets", "7:142-145", [], null);
s("a", "camp", "Allah called Musa to the mountain for thirty nights, and then ten more. Musa said to his brother Harun: take my place with my people, and do what is right.",
  "At the edge of {CAMP}, {MU} rests a hand on the shoulder of {HA} in farewell and points up toward a great rocky mountain rising behind the tents.", { mood: "trek" });
q("q1", "camp", "Thirty nights, and ten more. How many nights is that?", ["Forty", "🌙"], ["Thirteen", "⭐"], "Count again. Thirty and ten make forty.", { img: "a" });
p("journey", "climb", "mountain", "Climb the mountain with Musa.", { from: "⛺", to: "⛰️", icon: "img:icon-musa", steps: 8 });
s("b", "mountain", "On the mountain, Allah spoke to Musa. Musa said: my Lord, let me see You. Allah said: you will not see Me. But look at that mountain. If it stays in its place, then you will see Me.",
  "{MU} stands alone high on a rocky mountain ledge above the clouds, looking across a valley toward another great mountain peak, the sky glowing.", { mood: "awe" });
s("c", "mountain", "Then Allah showed His glory to the mountain, and the mountain crumbled into dust! Musa fell down in a faint.",
  "A great distant mountain peak crumbles and collapses into rolling clouds of dust and tumbling rocks under a blindingly bright sky; no people in the picture.", { mood: "awe", cue: "thunder" });
q("q2", "mountain", "What happened to the mountain?", ["It crumbled into dust", "💨"], ["It grew taller", "⛰️"], "No. The mountain could not stay in its place. It crumbled into dust.", { img: "c" });
s("d", "mountain", "When he woke up, Musa said: glory be to You! I turn back to You, and I am the first to believe.",
  "{MU} kneels on a rocky ledge with his forehead bowed low to the ground in humility, his staff beside him, soft light and settling dust in the air.", { mood: "awe" });
s("e", "mountain", "Allah said: Musa, I have chosen you, with My messages and My words. So hold on to what I give you, and be thankful. And Allah gave him the Tablets, with guidance for his people.",
  "{MU} holds two large stone tablets close to his chest with both arms, his staff tucked under one arm, standing on a mountain top at sunrise with a look of calm joy; the tablets' surfaces are plain and blank.", { mood: "triumph" });
p("puzzle", "puz", "mountain", "Put the picture back together. Tap two pieces to swap them.", { pic: "m19-e", n: 3 });
srt("sort", "mountain", "Musa was told: be thankful. Is it thankful, or not thankful?", ["Thankful", "💛"], ["Not thankful", "🙄"], [
  ["🤲", "Saying: thank You, Allah", 0], ["😤", "Saying: I want more, more, more", 1], ["🍞", "Sharing your food", 0], ["🗑️", "Throwing good food away", 1]
], "Think again. Would a thankful person do that?");

chapter("m20", "🐄", "The Golden Calf", "20:83-97", ["7:148-151"], null);
s("a", "camp", "While Musa was away on the mountain, a man called the Samiri played a wicked trick. The people threw their gold jewellery into the fire, and out of it he made the shape of a calf.",
  "Night at {CAMP}: {SAM} stands by a blazing fire pit as people toss gold bracelets and necklaces into the flames; a small shiny golden calf statue stands on a rock beside him.", { mood: "dread", amb: "fire" });
s("b", "camp", "The golden calf made a sound like a cow. It is told that this was only the wind blowing through it. The Samiri said: this is your god! And many of the people believed him.",
  "{SAM} points proudly at a shiny golden calf statue on a rock; a crowd gathers around it staring, some kneeling, in the light of torches among the tents.", { src: TAF, mood: "dread" });
s("c", "camp", "But the calf could not talk to them. It could not guide them. It could not help them, or hurt them, at all.",
  "A close view of a small shiny golden calf statue standing stiff and lifeless on a rock, torchlight glinting on it, its eyes blank.", { mood: "longing" });
q("q", "camp", "Could the golden calf hear them, or help them?", ["No. It was only gold", "🚫"], ["Yes, it could", "🐄"], "No. It could not speak, or guide, or help. It was only a thing made of gold.", { img: "c" });
srt("sort", "camp", "Who is it true about? Only Allah, or the golden calf?", ["Only Allah", "✨"], ["The golden calf", "🐄"], [
  ["🌍", "Made the earth and the sky", 0], ["🔨", "Was made by a man's hands", 1], ["👂", "Hears every prayer", 0], ["🤐", "Cannot say a single word", 1], ["🍎", "Gives us our food and water", 0]
], "Think again. A statue cannot do anything.");
s("d", "camp", "Harun told them: my people, this is only a test for you! Your Lord is the Lord of Mercy. Follow me! But they said: we will not stop until Musa comes back.",
  "{HA} stands between an angry crowd and a golden calf statue with both hands raised, pleading with them; some people turn their backs on him.", { mood: "dread" });
s("e", "camp", "Musa came back, angry and very sad. He put down the Tablets, and took hold of his brother. Harun said: son of my mother, the people would not listen to me! Then Musa prayed: my Lord, forgive me and my brother.",
  "{MU} strides into the camp with a stern, grieved face, two stone tablets set down on the ground behind him; {HA} holds out his open hands, explaining; the golden calf statue stands in the background.", { mood: "longing" });
s("f", "sea", "Musa sent the Samiri away. And the calf was ground into dust, and scattered into the sea.",
  "{MU} stands on a rocky shore and scatters handfuls of fine gold dust into the wind over the sea, the dust glittering as it blows away.", { mood: "triumph" });
p("wipe", "grind", "camp", "Grind the calf into dust and blow it away. Rub, rub, rub!", { cover: "gold" }, { img: "f" });
s("g", "camp", "The people were sorry for what they had done. And Musa told them: your God is only Allah. There is no god but Him.",
  "By morning light at {CAMP}, {FOLK} sit humbly on the ground listening as {MU} speaks to them with one finger raised, {HA} beside him.", { mood: "awe" });
ord("ord", "camp", "What happened first? Tap them in order.", [
  ["🔥", "Gold into the fire", "First, the gold went into the fire."],
  ["🐄", "The calf", "Then the Samiri made the calf."],
  ["😠", "Musa comes back", "Then Musa came back, angry and sad."],
  ["🌊", "Dust in the sea", "And then the calf was dust in the sea."]
], "Not that one yet. What came before it?");

chapter("m21", "🐮", "The Yellow Cow", "2:67-71", ["2:72-73"], null);
s("a", "camp", "One day Musa told his people: Allah commands you to sacrifice a cow. They said: are you joking with us?",
  "At {CAMP} by day, {MU} speaks to a group of men who look at each other with raised eyebrows and doubtful smiles; a few cows graze in the background.", { mood: "pastoral" });
s("b", "field", "Instead of doing as they were told, they asked: what kind of cow? Musa said: not too old, and not too young, but in between. Now do as you are told!",
  "A herd of very different cows in a dry pasture: a tiny young calf, a thin old grey cow, and several strong middle-sized cows; men stand scratching their heads.", { mood: "pastoral" });
s("c", "field", "But they asked again: what colour? Musa said: a bright yellow cow, lovely to look at.",
  "One beautiful golden-yellow cow with a glossy coat stands in sunlight in a pasture among brown, black and white cows. Only cows, no people.", { mood: "pastoral" });
s("d", "field", "And they asked again: which one exactly? Musa said: a perfect cow, with no marks on it at all, one that has never pulled a plough or watered the fields.", "One real, living farm cow with soft short fur in a warm butter-yellow colour, a healthy, gentle animal with no spots or marks at all, stands calm and free in a green meadow by a river, grazing (an ordinary animal, not a statue, not shiny, not metal); nearby an unused wooden plough lies in the grass and a still water wheel stands by the field. Only the cow, no people.", { mood: "pastoral" });
s("d1", "field", "It is told that the cow belonged to a young man who was very kind to his father. He would not even wake his sleeping father to make a good sale. And Musa said: see how high kindness to parents can lift a person!",
  "Inside a simple mud-brick house at noon, a young man in a plain tunic sits quietly beside his old father, who sleeps peacefully on a mat; at the open door he gently waves away a merchant holding a purse, and a golden-yellow cow waits outside.", { src: "From a Shia narration (Imam al-Rida)", mood: "pastoral" });
p("pick", "cow", "field", "Find the right cow: bright yellow, with no marks at all. Tap it.", { items: [{ icon: "🐄", n: 1, ok: true, cls: "cow-yellow", name: "the yellow cow" }, { icon: "🐄", n: 3, ok: false, name: "a spotted cow" }, { icon: "🐂", n: 2, ok: false, name: "a brown ox" }, { icon: "🐃", n: 2, ok: false, name: "a dark buffalo" }], mark: "✨" });
s("e", "field", "At last they found it, and did as they were told. But they very nearly did not! And Allah used it to bring out a truth that some of them had been hiding.",
  "A group of men lead one golden-yellow cow by a rope across a pasture toward the camp, looking relieved and tired.", { mood: "pastoral" });
q("q", "field", "What should they have done at the start?", ["Done as they were told, straight away", "👍"], ["Asked more and more questions", "❓"], "No. All those questions only made it harder. They should have obeyed straight away.", { img: "e" });
ord("ord", "field", "They asked three questions. Tap them in order.", [
  ["🐄", "What kind of cow?", "First they asked: what kind of cow?"],
  ["🎨", "What colour?", "Then they asked: what colour?"],
  ["🔍", "Which one exactly?", "And then they asked: which one exactly?"]
], "Not that one yet. Kind, then colour, then which one.");

chapter("m22", "🚪", "The Holy Land", "5:20-26", [], null);
s("a", "desert", "Musa said: my people, remember the gifts Allah has given you. Go into the holy land that Allah has promised to you, and do not turn back.",
  "{MU} stands on a rocky rise pointing with his staff toward a green fertile valley with a walled town in the distance; {FOLK} stand behind him in the dry desert.", { mood: "trek" });
s("b", "desert", "But they said: Musa, there are strong, frightening people in that land. We will not go in until they have left!",
  "A group of men in earth-coloured clothes shake their heads and back away with their hands up, looking fearfully toward a distant ancient walled town of rough stone and mud-brick on a dry hill, with a huge wooden gate (not a European castle, no towers with flags, no domes).", { mood: "dread" });
s("c", "desert", "Two men who trusted Allah said: go in through the gate! If you go in, you will win. Put your trust in Allah.",
  "Two brave men in simple robes step out in front of a nervous crowd, one pointing toward the huge wooden gate of a distant ancient walled town of rough stone and mud-brick on a dry hill (not a palace, no domes), and one holding a hand to his heart.", { mood: "triumph" });
q("q", "desert", "What did the two brave men say?", ["Trust Allah, and go in", "🚪"], ["Run away and hide", "🏃"], "No. The two men said: go in through the gate, and put your trust in Allah.", { img: "c" });
s("d", "desert", "But the people said: you and your Lord go and fight. We are staying right here.",
  "A crowd of men sit stubbornly on the ground beside their tents with arms folded, while {MU} and {HA} stand looking at them sadly.", { mood: "longing" });
s("e", "desert", "Musa said: my Lord, I can only answer for myself and my brother. And Allah said: then that land is closed to them for forty years. They will wander in the desert.",
  "Seen from high above: a long line of tiny people and animals winds in a great circle across an endless desert of dunes at dusk.", { mood: "longing" });
p("trail", "wander", "desert", "Round and round they wandered. Tap each footprint.", { n: 8, icon: "👣", walker: "🚶", round: true });
srt("sort", "desert", "Is it brave trust, or a fearful excuse?", ["Brave trust", "🦁"], ["Fearful excuse", "🙈"], [
  ["🚪", "Go in through the gate!", 0], ["🪑", "We are staying right here", 1], ["💛", "Put your trust in Allah", 0], ["👉", "You go. We will wait", 1]
], "Think again. Is that trusting Allah?");

chapter("m23", "🐟", "The Fish That Swam Away", "18:60-70", [], null);
s("a", "camp", "One day, someone asked Musa: who knows the most, of all the people? Musa said: I do. So Allah told him: there is a servant of Mine, at the place where the two seas meet, who knows things that you do not know.",
  "{MU} stands on a low rock speaking to a seated crowd at {CAMP}; one man in the crowd raises a hand to ask a question.", { src: HAD, mood: "pastoral" });
s("b", "desert", "Musa said to his young helper, Yusha: I will not stop until I reach the place where the two seas meet, even if it takes me years! They took a fish with them in a basket.",
  "{MU} and {YU} set out walking along a rocky coast path at morning; the young man carries a woven basket with a fish's tail sticking out of it.", { mood: "trek" });
p("journey", "go", "desert", "Travel with Musa and Yusha to where the two seas meet.", { from: "⛺", to: "🌊", icon: "img:icon-musa", steps: 8 });
s("c", "sea", "Musa and Yusha stopped to rest by a rock. And there, the fish slipped out of the basket, into the sea, and swam away! It is told that the water stood over its path like a little tunnel.",
  "By a big rock on the seashore, {MU} and {YU} lie asleep in the shade while a silver fish leaps from a tipped woven basket into the sea, leaving a clear tunnel-like trail in the water.", { src: HAD, cue: "splash" });
p("trail", "fish", "sea", "Follow the fish along its path through the water. Tap each splash.", { n: 7, icon: "💦", walker: "🐟" });
s("d", "desert", "Musa and Yusha walked on and on. Musa said: bring us our lunch. This journey has made us tired. Then Yusha remembered: the fish! By the rock, it went off into the sea, in such a strange way. Shaytan made me forget to tell you.",
  "On a dusty path, {YU} looks into an empty woven basket with a shocked face and one hand on his head, while {MU} sits down tired on a stone.", { mood: "trek" });
s("e", "desert", "Musa said: that is the very place we were looking for! So they turned around, and followed their own footsteps all the way back.",
  "{MU} points excitedly back along a sandy coast path marked with two lines of footprints; {YU} turns to follow, the sea beside them.", { mood: "triumph" });
p("trail", "back", "desert", "Follow the footsteps back to the rock. Tap each one.", { n: 7, icon: "👣", walker: "img:icon-musa" });
s("f", "sea", "And there they found a servant of Allah, to whom Allah had given mercy and special knowledge. It is told that his name was al-Khidr.",
  "By a big rock on the seashore sits {KH}, calm and smiling gently; {MU} greets him respectfully with a hand on his chest, {YU} standing behind.", { src: HAD, mood: "awe" });
s("f1", "sea", "Al-Khidr means the green one. It is told that wherever he sat down, the bare ground turned green.",
  "{KH} sits on a patch of bare pale sand by the seashore, and fresh green grass and small white flowers spring up all around where he sits; {MU} and {YU} watch in wonder.", { src: "Told in al-Bukhari and in Shia narrations", mood: "wonder" });
s("g0", "sea", "Musa asked: may I follow you, so that you can teach me? He said: you will not be able to be patient with me.", "Outdoors on a sandy seashore, with blue waves, sky and rocks all around filling the whole background: {MU} stands with a hand on his heart, asking humbly; {KH} sits on the rock and gently shakes his head with a kind, knowing smile, one hand raised; {YU} watches from behind, curious.", { mood: "pastoral" });
s("g", "sea", "Musa said: if Allah wills, you will find me patient. He said: then do not ask me about anything, until I tell you about it myself.",
  "{MU} and {KH} walk side by side along a beach talking, the old man holding up one finger as he sets a condition; waves roll in.", { mood: "pastoral" });
q("q", "sea", "What did Musa promise al-Khidr?", ["To be patient, and not to ask", "🤐"], ["To ask lots of questions", "❓"], "No. Musa promised to be patient, and not to ask about anything.", { img: "g" });

chapter("m24", "⛵", "Three Strange Things", "18:71-82", [], null);
s("a", "sea", "Musa and al-Khidr got into a boat. It is told that the sailors knew al-Khidr, and took them for free. And then al-Khidr made a hole in the boat!",
  "On a small wooden sailing boat at sea, {KH} kneels and pries up a plank from the deck with a tool; {MU} stares in alarm; two sailors work the sail at the far end, not noticing.", { src: HAD, mood: "dread" });
s("b", "sea", "Musa cried: do you want the people in it to sink? Al-Khidr said: did I not tell you that you could not be patient with me? Musa said: forgive me. I forgot.",
  "On the deck of a small wooden boat, {MU} holds out both hands in protest and {KH} calmly raises one finger to remind him of his promise.", { mood: "pastoral" });
s("c", "sea", "A little bird landed on the edge of the boat, and dipped its beak in the sea. Al-Khidr said: my knowledge and your knowledge, next to the knowledge of Allah, are like the sip this bird took from the sea.",
  "A tiny sparrow perches on the wooden edge of a boat and dips its beak into the vast sparkling sea; {KH} points to it, smiling, as {MU} watches.", { src: HAD, mood: "awe" });
q("q1", "sea", "How much is all that we know, next to what Allah knows?", ["Like one little sip from the sea", "🐦"], ["Like the whole sea", "🌊"], "No. It is only like the sip of a little bird, from the whole sea.", { img: "c" });
s("d", "city", "Then came something much harder for Musa to understand. It was about a boy, and it is a story for when you are older. Musa spoke up again. Then he said: if I ask you about anything after this, send me away.",
  "{MU} and {KH} walk away together down a seaside path toward a town; {MU} looks troubled, one hand raised mid-question; the old man walks on calmly.", { mood: "longing" });
s("e", "city", "They came to a town and asked for food, but nobody would give them any. In that town was a wall that was about to fall down. And al-Khidr fixed it! Musa said: you could have asked them to pay you for that.",
  "In a small town street, {KH} pushes a leaning mud-brick wall upright with both hands and sets bricks back into it; {MU} stands with his arms spread in puzzlement; townspeople turn away in doorways.", { mood: "pastoral" });
p("build", "wall", "city", "Help mend the wall. Tap to put every brick back.", { n: 12, icon: "🧱", cols: 4 });
s("f", "city", "Al-Khidr said: this is where you and I must part. But first, I will tell you what it all meant.",
  "{KH} and {MU} sit facing each other under a tree outside a town at sunset, the old man speaking gently with open hands, Musa listening closely.", { mood: "awe" });
s("g", "sea", "The boat belonged to poor people who worked on the sea. A king was coming who took every good boat by force. So I made it look damaged, and he would leave it alone.",
  "A small patched wooden fishing boat with poor fishermen aboard sails safely on, while a great royal ship with purple sails and armed men passes by, ignoring it.", { mood: "triumph" });
s("h", "city", "And the wall belonged to two orphan boys. Hidden under it was a treasure, kept for them. Their father had been a good man. Allah wanted them to grow up, and find it for themselves. I did none of this by my own choice.",
  "Two young orphan brothers in simple tunics play beside a strong mended mud-brick wall; in a cutaway view beneath the wall, a clay jar of gold coins glows softly underground.", { mood: "triumph" });
p("wipe", "treasure", "city", "The treasure is safe under the wall. Brush away the sand to see it.", { cover: "sand", under: "💰" });
mat("match", "city", "Match each strange thing to its secret.", [
  ["⛵", "A hole in the boat", "👑", "kept it safe from a greedy king"],
  ["🧱", "A mended wall", "💰", "kept a treasure safe for two orphans"]
]);
s("i", "sea", "Musa learned that Allah knows what we do not know. Sometimes a thing looks bad, and there is good hidden inside it.",
  "{MU} stands alone on a seashore at sunset looking out thoughtfully over the calm water, staff in hand, a small bird flying over the waves.", { mood: "awe" });
s("i2", "sea", "Our Prophet, peace be upon him, said: we wish Musa had been patient, so that Allah would have told us more about the two of them.", "A peaceful seashore at sunset: two lines of footprints in the wet sand lead along the water's edge toward the horizon, a small wooden boat far out on the calm golden sea, a few birds in the sky. No people.", { src: HAD, mood: "awe" });
q("q2", "sea", "What did Musa learn?", ["Allah knows what we do not know", "✨"], ["That he knew everything", "🤓"], "No. Musa learned that Allah knows what we do not know.", { img: "i" });

chapter("m25", "📜", "Allah Was with Him", "28:43", ["20:46", "26:62"], null);
s("a", "river", "What a story! A baby on the river. A boy in the palace. A shepherd by the well. And then a prophet, who stood before a king with only a staff in his hand.",
  "A wide, peaceful view of the Nile valley at golden hour, seen from high up: the wide river with reeds where a small wooden cradle-shaped chest rests among the reeds, a sandstone palace with painted columns on the far bank, sheep grazing around a stone well on a hillside, and far off on a rise a lone small figure in an indigo robe and cream turban holding a tall staff, looking toward the palace.", { mood: "nile" });
s("b", "sea", "And every step of the way, Allah was with Musa, hearing and seeing everything.", "{MU} walks alone along a winding desert path under a vast star-filled night sky, staff in hand, calm and unafraid; a gentle warm light falls on the path ahead of him.", { mood: "awe" });
s("c", "mountain", "Allah gave Musa the Book, to be a light, and a guide, and a mercy for the people.", "In a desert camp of woven tents in the morning, {MU} stands before {FOLK} holding up two large stone tablets for them to see, teaching them kindly; children sit at the front listening. The tablets' surfaces are plain and blank.", { mood: "triumph" });
ord("ord", "dawn", "Tell the whole story of Musa. Tap in order.", [
  ["🧺", "The baby on the river", "First, a baby on the river."],
  ["🐑", "The shepherd at the well", "Then a shepherd at the well."],
  ["🔥", "The fire on the mountain", "Then the fire on the mountain."],
  ["🌊", "The sea opens", "Then the sea opened."],
  ["📜", "The Tablets", "And then the Tablets, on the mountain."]
], "Not that one yet. What came before it?");
mat("match", "dawn", "Who is who? Match each person to their part.", [
  ["👸", "Asiya", "💛", "the queen who loved baby Musa"],
  ["🧕", "Musa's sister", "👣", "followed the chest along the river"],
  ["🤝", "Harun", "🗣️", "the brother who helped him speak"],
  ["👑", "Pharaoh", "🌊", "the proud king, lost in the sea"]
]);
p("memory", "mem", "dawn", "One last game. Find all the pairs from the story of Musa.", { icons: ["🧺", "🐑", "🔥", "STAFF", "🐸", "🌊", "💧", "📜"] });
p("puzzle", "puz", "sea", "Put the sea back together. Tap two pieces to swap them.", { pic: "m17-b", n: 3 });
line("end-a", "This is the story of Musa, peace be upon him. When the sea was in front of him, and the army was behind him, he said: my Lord is with me. He will guide me.");
