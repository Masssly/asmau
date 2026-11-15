/* Chapters 7 to 11: the whisper, sorry, life on earth, two brothers, the children of Adam. */
"use strict";
const { chapter, s, p, q, ord, srt, line, BOTH, NAR, portrait } = require("./lib");
// Adam's round portrait walks in the journey once it is drawn; until then an icon stands in
const ADAM_PIC = portrait("adam", "ADAM");
const ADAM = require("fs").existsSync(require("path").join(__dirname, "..", "..", "..", "games", "adam", "assets", "img", "icon-adam.webp")) ? ADAM_PIC : "🧑";

chapter("d7", "🍃", "The Whisper", "7:20-22", ["20:115", "20:120-121"], null);
s("a", "garden", "But Iblis came creeping with a whisper. He said: Allah only told you not to eat from this tree so that you would not become angels, or live for ever.",
  "In {GARDEN} near the great tree, a faint wisp of {IBL} curls like smoke behind a bush and whispers toward {ADAM} and {HAWWA}, who stand listening, unsure.", { mood: "tense" });
s("b", "garden", "And he swore: I am only giving you good advice! But it was a lie.",
  "Close up: the branches of the great tree, a curl of dark smoke wrapping around one branch, its leaves rustling, shadows growing longer. No people at all in the picture: only the tree, its leaves and the smoke.", { mood: "tense" });
q("q", "garden", "Was Iblis telling the truth?", ["No, it was a lie", "🙅"], ["Yes, he was a friend", "🤝"], "Iblis lied. He was their enemy, not their friend.", { img: "b" });
s("c", "garden", "Adam forgot what Allah had told him, and they both ate from the tree.",
  "Beneath the great tree a few green leaves drift down onto the grass and one low branch bends toward the ground. No fruit is shown, no apple, and no people at all: only the tree and the falling leaves.");
s("d", "garden", "At once they felt ashamed, and they began to cover themselves with leaves from the Garden.",
  "Close up: large green leaves of the Garden gathered and held together by two deep dark brown hands; nothing else of the people is shown.");
s("e", "grey", "Their Lord called to them: did I not tell you not to go near that tree? Did I not tell you that Iblis is your enemy?",
  "The great tree stands alone in fading evening light; the Garden around it is quiet and still, a cool breeze bending the grass. No people at all in the picture: only the tree and the empty, quiet Garden.", { mood: "sad" });
srt("listen", "grey", "Good things and bad whispers. Which do we do, and which do we say no to?", ["Do it", "✅"], ["Say no", "🚫"], [
  ["🕌", "Pray on time", 0], ["🤥", "Tell a little lie", 1], ["🤲", "Say sorry", 0],
  ["😠", "Hit your brother", 1], ["💛", "Help at home", 0], ["🍪", "Take a sweet without asking", 1]
], "That one is a bad whisper. Say no to it, and do the good things.", { img: "e" });

chapter("d8", "🤲", "Sorry", "7:23", ["2:37", "20:122"], null);
s("a", "dusk", "Adam and Hawwa were very, very sorry. They did not blame anyone else. They prayed: our Lord, we have wronged ourselves. If You do not forgive us and have mercy on us, we will be lost.",
  "{ADAM} and {HAWWA} kneel side by side on the grass at dusk, heads bowed and hands raised in prayer, the great tree dark behind them.", { mood: "longing" });
ord("dua", "dusk", "Say Adam and Hawwa's prayer. Tap the parts in order.", [
  ["🤲", "Our Lord", "Our Lord,"], ["💔", "we have wronged ourselves", "we have wronged ourselves."],
  ["🙏", "if You do not forgive us", "If You do not forgive us"], ["💛", "and have mercy on us", "and have mercy on us,"],
  ["😢", "we will be lost", "we will be lost."]
], "Listen again, and say the prayer in order.", { img: "a" });
s("b", "dawn", "And Allah forgave them. Allah is the Ever-Relenting, the Most Merciful.",
  "{ADAM} and {HAWWA} look up with relief and joy as warm golden morning light breaks over them.", { mood: "triumph" });
p("hold", "sorry", "dawn", "Say sorry to Allah from the heart. Press and hold the hands until they shine.", { ms: 3000, icon: "🤲", hint: "Press and hold", done: "Allah is the Most Merciful" }, { img: "b" });
q("q", "dawn", "What did Adam and Hawwa do after their mistake?", ["Said sorry to Allah", "🤲"], ["Blamed someone else", "👉"], "They blamed no one. They said sorry to Allah, and He forgave them.", { img: "b" });

chapter("d9", "🌾", "Life on Earth", "7:24-25", ["2:36-38"], null);
s("a", "desert", "Then Allah said: go down to the earth. There you will live, for a time. And when My guidance comes, whoever follows it will have nothing to fear.",
  "{ADAM}, now in simple brown woven clothes, stands alone on a rocky hill on the wide dry earth, looking up at the big sky.", { mood: "trek" });
s("b", "desert", "It is told that Adam and Hawwa came down to the earth far apart, and later found each other again, near Mecca.",
  "In a wide desert valley among bare hills, {ADAM} and {HAWWA}, both in simple brown woven clothes, catch sight of each other from far away and hurry toward each other, overjoyed.", { src: BOTH, mood: "joy" });
p("journey", "find", "desert", "Help Adam find Hawwa again.", { from: "⛰️", to: "💛", icon: ADAM, steps: 7 }, { img: "b" });
s("c", "field", "It is told that the angel Jibril taught Adam how to plant seeds and grow food, and how to pray.",
  "In a green valley, {ADAM} in simple brown woven clothes presses seeds into dark earth with his hands, while beside him a soft glow of light shows where an angel stands, made only of light.", { src: NAR, mood: "pastoral" });
p("count", "plant", "field", "Plant the seeds. Tap each spot.", { total: 7, icon: "🟫", got: "🌱" }, { img: "c" });
s("d", "field", "Adam and Hawwa worked hard, and Allah blessed their fields. Every day they remembered Allah and thanked Him.",
  "A golden wheat field at evening; {ADAM} and {HAWWA} in brown woven clothes carry bundles of wheat toward a simple stone house, smiling.", { mood: "pastoral" });
p("pick", "harvest", "field", "Gather only the ripe golden wheat.", { items: [{ icon: "🌾", n: 6, ok: true, name: "ripe wheat" }, { icon: "🌱", n: 3, ok: false, name: "a young shoot" }], mark: "✨" }, { img: "d" });

chapter("d10", "🐑", "Two Brothers", "5:27-31", ["5:32"], null);
s("a", "field", "Adam and Hawwa had many children. One day, two of their sons each brought a gift to offer to Allah.",
  "{HAB} carries his best young lamb in his arms and {QAB} carries a small basket of grain, both walking up a green hill in the morning.");
s("b", "field", "Allah accepted the gift of one brother, because he was mindful of Allah. But the other brother's gift was not accepted, and he became jealous and angry.",
  "On the hilltop a soft light falls on {HAB} and his lamb, while {QAB} stands nearby with clenched fists and a jealous frown.", { mood: "tense" });
s("c", "dusk", "The angry brother said: I will kill you! But the good brother said: even if you raise your hand to hurt me, I will never raise mine to hurt you. I fear Allah.",
  "At dusk, {HAB} stands calmly with his open, empty hands lowered at his sides, while {QAB} faces him angrily a short distance away.", { mood: "tense" });
q("q", "dusk", "What did the good brother say?", ["I will never hurt you", "🤝"], ["I will hit you back", "👊"], "The good brother said: I will never raise my hand to hurt you.", { img: "c" });
s("d", "grey", "But the angry brother would not calm down. He hurt his brother so badly that his brother died.",
  "A lonely hill under a grey sky: an empty shepherd's staff lies in the grass, and a small lamb stands quietly beside it. No people.", { mood: "sad" });
s("e", "grey", "Then Allah sent a raven, which scratched in the ground. The brother cried: what have I done? And he was full of sorrow.",
  "A black raven scratches at the earth on the grey hill, while {QAB} kneels nearby with his head in his hands, full of sorrow.", { mood: "sad" });
s("f", "dawn", "Allah teaches us: whoever saves one life, it is as if they had saved all people.",
  "Sunrise over green fields: two caring deep dark brown hands gently lift a small fallen bird from the grass, the sky opening golden.", { mood: "triumph" });
srt("kind", "dawn", "Be like the good brother. Which is kind, and which is unkind?", ["Kind", "💛"], ["Unkind", "💢"], [
  ["🤝", "Sharing your toys", 0], ["😠", "Pushing someone", 1], ["🩹", "Helping someone who is hurt", 0],
  ["😒", "Staying jealous and angry", 1], ["🧸", "Making up after a fight", 0], ["👊", "Hitting back", 1]
], "Let's be like the good brother: kind, even when others are not.", { img: "f" });

chapter("d11", "🌍", "Children of Adam", "7:26", ["7:27"], null);
s("a", "field", "Allah gave Adam and Hawwa another son, called Shith. He was good and wise, and he learned everything his father taught him.",
  "{ADAM}, older now with grey in his beard, sits under a tree teaching {SHITH}, who listens closely; {HAWWA} smiles nearby.", { src: NAR });
s("b", "dusk", "Adam taught all his children to remember Allah, to pray, and to be kind to one another.",
  "A big family of children and grown-ups sits in a circle on the grass at evening, listening to {ADAM}, who points gently up at the first stars.", { mood: "longing" });
s("c", "dawn", "And Allah says: children of Adam, the best clothes of all are being mindful of Allah.",
  "Sunrise over a quiet valley with a small village; families walk out to their fields in simple modest clothes, warm light over everything.");
s("d", "dawn", "We are all children of Adam: one big family, in every colour. So we greet each other with peace, and we help each other.",
  "A big crowd of smiling children and families on a green hill at sunrise, greeting each other with raised hands, hugging and shaking hands.", { mood: "joy" });
ord("story", "dawn", "Tell the whole story of Adam. Tap in order.", [
  ["🟤", "Made from earth", "First, Allah made Adam from earth."],
  ["🦁", "The names", "Allah taught him the names of everything."],
  ["🔥", "Iblis would not bow", "Iblis was too proud to bow."],
  ["🌳", "The Garden and the tree", "In the Garden, they ate from the tree."],
  ["🤲", "Sorry", "They said sorry, and Allah forgave them."],
  ["🌾", "Life on earth", "Then they lived and worked on the earth."]
], "Listen again, and tell it in order.", { img: "d" });

line("end-a", "This is the story of Adam, peace be upon him, the first of all people. He made a mistake, and he said sorry, and Allah forgave him. When we make a mistake, we can turn to Allah too.");
