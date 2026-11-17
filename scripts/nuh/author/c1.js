/* Chapters 1 to 6: forgetting Allah, Nuh is sent, night and day, Allah's world, everyone is welcome, the Ark. */
"use strict";
const { chapter, s, p, q, mat, srt, TAF, BUK } = require("./lib");

chapter("n1", "🗿", "Forgetting Allah", "71:23", [], null);
s("a", "village", "Long after Adam, his children had spread far over the earth. Among them lived some very good men, who remembered Allah and helped everyone.",
  "In {VILLAGE}, {GOODMEN} sit in the shade of a palm tree, talking kindly with the villagers who come to them; warm afternoon light.", { src: BUK });
s("b", "village", "When those good men died, the people missed them. It is told that someone said: let us make statues of them, so that we remember them.",
  "In the middle of {VILLAGE}, villagers with deep dark brown skin carve a plain stone statue of a standing figure; a few more rough statues stand behind them. Every woman and every girl wears a headscarf that covers all her hair.", { src: BUK });
s("c", "dusk", "Years and years went by. The people who made the statues died too, and their children forgot why the statues were there.",
  "{STATUES} stand alone in an empty dusty square between round mud houses with thatched roofs at evening, long shadows across the dust, weeds growing at their feet. The statues have no faces at all, only smooth blank stone where a face would be. No people.", { src: BUK, mood: "longing" });
s("d", "dusk", "Then people began to bow down to the statues and pray to them, and they forgot Allah. They called them Wadd, Suwa, Yaghuth, Ya'uq and Nasr.",
  "Seen from behind, a crowd of villagers bow down before {STATUES} at dusk, offerings of fruit at the statues' feet; the statues have no faces at all, only smooth blank stone; the faces of the people are not seen.", { mood: "tense" });
srt("made", "village", "Who made it? Allah, or people?", ["Allah made it", "✨"], ["People made it", "🔨"], [
  ["☀️", "The sun", 0], ["🗿", "A statue", 1], ["🌳", "A tree", 0], ["🏠", "A house", 1], ["🌧️", "The rain", 0], ["🪑", "A chair", 1]
], "Think again. Could people make that, or only Allah?", { img: "a" });
q("q", "dusk", "Can a statue hear us, or help us?", ["No, only Allah can", "✨"], ["Yes, it can", "🗿"], "A statue cannot hear anyone or help anyone. Only Allah hears us and helps us.", { img: "d" });

chapter("n2", "🌟", "Nuh Is Sent", "71:1-4", ["11:25-26", "29:14"], null);
s("a", "dawn", "So Allah chose a good man from among them to be His prophet: Nuh, peace be upon him.",
  "{NUH} stands on a low hill above {VILLAGE} at sunrise, looking out over the houses with a kind, serious face, golden light around him.", { mood: "awe" });
s("b", "village", "Nuh said: my people, I am here to warn you clearly. Worship Allah alone, and be mindful of Him. He will forgive you.",
  "{NUH} speaks to {PEOPLE} gathered in the village square, one hand raised gently, the other on his heart.");
q("q", "village", "What did Nuh tell his people?", ["Worship Allah alone", "✨"], ["Worship the statues", "🗿"], "Nuh said: worship Allah alone. He will forgive you.", { img: "b" });
s("c", "field", "And Nuh kept calling them, for a very, very long time: nine hundred and fifty years!",
  "{NUH} walks along a path between fields and palm trees toward a far village, staff in hand, the sun high; the path stretches a long way ahead.");
p("count", "years", "field", "Each star is a hundred years. Tap all nine! Nine hundred years, and fifty more.", { total: 9, icon: "⭐", got: "🌟" }, { img: "c" });

chapter("n3", "🌙", "Night and Day", "71:5-9", [], null);
s("a", "field", "Nuh called his people in the daytime.",
  "In bright daylight, {NUH} talks with a farmer working in a field, pointing kindly up at the sky.");
s("b", "night", "And he called them at night.",
  "At night under the stars, {NUH} stands at the door of a round house with a small oil lamp, speaking softly to a family inside. Every woman's hair is covered.");
s("c", "village", "He spoke to them out loud, in front of everyone. And he spoke to them quietly, one by one.",
  "{NUH} sits on a low wall talking quietly with one young man in the shade, while a busy market goes on behind them.");
srt("when", "night", "Is it day, or is it night? Sort them.", ["Day", "☀️"], ["Night", "🌙"], [
  ["☀️", "The sun is shining", 0], ["🌙", "The moon is out", 1], ["🐓", "The rooster crows", 0],
  ["🦉", "The owl hoots", 1], ["⭐", "The stars twinkle", 1], ["🌻", "The flowers open", 0]
], "Think again. Is that in the day, or at night?", { img: "b" });
s("d", "village", "But the more he called, the further they ran away. They put their fingers in their ears, and pulled their clothes over their heads, so that they would not hear.",
  "A group of villagers turn away from {NUH}, some with their fingers in their ears, some pulling their cloaks over their heads; Nuh holds out his hands to them patiently.");
q("q", "village", "What did the people do when Nuh called them?", ["Put their fingers in their ears", "🙉"], ["Listened carefully", "👂"], "They would not listen. They put their fingers in their ears.", { img: "d" });

chapter("n4", "🌧️", "Look at Allah's World", "71:10-20", [], null);
s("a", "field", "Nuh said: ask your Lord to forgive you. He is always forgiving. He will send you plenty of rain from the sky.",
  "Soft rain falls on green fields and palm trees from grey-white clouds, the sun breaking through at one side. No people.");
p("count", "rain", "field", "Help the rain fall on the fields. Tap each cloud.", { total: 6, icon: "☁️", got: "🌧️" }, { img: "a" });
s("b", "field", "Nuh told them: Allah will give you wealth and sons, and gardens and rivers.",
  "A happy family with deep dark brown skin walks beside a river through a green garden of fruit trees; the mother's and daughter's hair is covered by headscarves.", { mood: "joy" });
s("c", "night", "Look how Allah made the seven heavens, one above the other. He put the moon in them as a light, and the sun as a lamp.",
  "A wide sky at twilight: the moon glows on one side and the last of the sun on the other, with the first stars between, over a quiet valley. No people.", { mood: "wonder" });
s("d", "dawn", "He made you grow from the earth like a plant. And He spread the earth out wide for you, with paths to walk on.",
  "Morning over a wide land: paths wind between green hills, fields and rivers into the distance; young plants sprout in the foreground. No people.");
mat("gifts", "dawn", "What does each gift give us? Match them.", [
  ["🌧️", "Rain", "🌱", "Plants that grow"],
  ["☀️", "The sun", "🔥", "Light and warmth"],
  ["🌙", "The moon", "🌃", "Light at night"],
  ["🏞️", "Rivers", "💧", "Water to drink"]
], { img: "d" });

chapter("n5", "🤗", "Everyone Is Welcome", "11:27-31", [], null);
s("a", "village", "The proud chiefs of the people sneered: you are only a man like us! And the only people who follow you are the lowest of us.",
  "{CHIEFS} stand with their arms folded and noses in the air in the village square, looking down on {NUH}, who stands calmly with a few poor followers in patched clothes.", { mood: "tense" });
s("b", "village", "They wanted Nuh to send his followers away. But Nuh said: I will never drive away the believers. Who would help me against Allah if I did?",
  "{NUH} stands in front of {BELIEVERS}, his arms spread wide to keep them close, while {CHIEFS} point and frown; every person has very dark brown skin; the women's and girls' skin is just as dark as the men's.");
s("c", "village", "And Nuh said: I do not ask you for any reward. My reward comes only from Allah.",
  "{NUH} sits on a mat in the shade with his hands open and empty, speaking kindly; a bowl of plain dates and a cup of water beside him.");
srt("welcome", "village", "Welcome everyone, like Nuh. Is it welcoming, or not?", ["Welcoming", "🤗"], ["Not welcoming", "🚫"], [
  ["🤝", "Playing with the new child", 0], ["🙅", "Saying: you can't play with us", 1], ["🍞", "Sharing your food", 0],
  ["😒", "Laughing at someone's clothes", 1], ["👋", "Saying salam to everyone", 0], ["🤫", "Whispering about someone", 1]
], "Think again. Would that make someone feel welcome?", { img: "b" });
q("q", "village", "What did Nuh say about the believers?", ["I will never send them away", "🤗"], ["Go away", "🚫"], "Nuh would never send the believers away.", { img: "b" });

chapter("n6", "🪵", "Build the Ark", "11:36-37", ["23:27", "54:13"], null);
s("a", "dusk", "Then Allah told Nuh: no more of your people will believe, apart from those who already have. So do not be sad about what they do.",
  "{NUH} sits alone on a hill at evening, looking down at {VILLAGE}, his hand on his heart, calm but sad.", { mood: "longing" });
s("b", "dawn", "And Allah said: build the Ark, under Our eyes, and as We teach you.",
  "{NUH} stands at sunrise beside a great pile of long wooden planks and tree trunks on open ground, looking up at the sky, ready to begin.", { mood: "awe" });
s("c", "field", "It is told that Allah taught Nuh, step by step, how to build it.",
  "{NUH} and two grown men with deep dark brown skin measure and saw long planks of wood in a sunny clearing, wood shavings on the ground. No women or children.", { src: TAF });
p("build", "planks", "field", "Help build the Ark. Tap to fit every plank.", { n: 8, icon: "🪵", cols: 4 }, { img: "c" });
s("d", "field", "The Ark was made of wooden planks, held together with nails.",
  "Close up: strong hands with deep dark brown skin hammer a big iron nail into a thick wooden plank of {ARK}, wood shavings flying.");
p("count", "nails", "field", "Hammer the nails! Tap each one.", { total: 8, icon: "🔩", got: "🔨" }, { img: "d" });
