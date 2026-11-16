#!/usr/bin/env node
/*
  Start a new story game with the story kit (scripts/kit/README.md):
    node scripts/kit/new.js <story> <game-slug> "<Title>" <id letter> <look> [tone]
  e.g.  node scripts/kit/new.js hajar hajar "Hajar" h arabia
  <story> is its folder in scripts/; <id letter> starts every line id (h1-a); <look> is one of the picture looks in
  scripts/art/vertex.py (africa, africa-open, arabia, world, sumatra, or a new one added there); [tone] the emoji skin
  tone (1F3FF dark, the default; 1F3FE medium-dark; 1F3FD medium).
  It writes the kit files, a first chapter to copy from, and the game's page from the Rahmah game's page with the
  words to change marked TODO. Then: research and an outline first (scripts/<story>/RESEARCH.md, OUTLINE.md).
*/
"use strict";
const fs = require("fs"), path = require("path");
const ROOT = path.join(__dirname, "..", "..");
const [story, slug, title, letter, look, tone] = process.argv.slice(2);
if (!look || !/^[a-z]$/.test(letter)) { console.error(fs.readFileSync(__filename, "utf8").split("*/")[0]); process.exit(2); }
const S = path.join(ROOT, "scripts", story), A = path.join(ROOT, "scripts", story + "-art"), G = path.join(ROOT, "games", slug);
for (const d of [S, G]) if (fs.existsSync(d)) { console.error(d + " already exists"); process.exit(1); }
const w = (f, t) => { fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, t); console.log("wrote " + path.relative(ROOT, f)); };

w(path.join(S, "kit.json"), JSON.stringify({ game: slug, art: story + "-art", prefix: letter, name: "The " + title + " story", tone: tone || "1F3FF", look }, null, 1) + "\n");
w(path.join(S, "author", "lib.js"), "/* This story's writing aid: the shared story kit (scripts/kit/author.js), with its people and sources in cast.js. */\nmodule.exports = require(\"../../kit/author\")(" + JSON.stringify(story) + ");\n");
w(path.join(S, "author", "build.js"), "#!/usr/bin/env node\n/* Writes this story's game files from its chapter files: the shared story kit does the work (scripts/kit/build.js). */\nprocess.argv[2] = " + JSON.stringify(story) + ";\nrequire(\"../../kit/build.js\");\n");
w(path.join(S, "author", "cast.js"), `/* The people, places and source lines of this story, for the story kit (scripts/kit/author.js). */
"use strict";

// Source lines shown on a page ({ src: TAF } in a chapter file). Name every one truthfully; never invent a source.
const TAF = "From Ibn Kathir's commentary";

// People and places in the pictures: [name for the alt text, how the picture tool is told to draw them].
// Described by clothes, age and skin, never by name, so the tool draws our people and not its own idea of the story.
// Every woman's and girl's hair covered. The Prophet Muhammad (peace be upon him) is never one of them.
const WHO = {
  HERO: ["TODO name", "TODO: age, skin, face, hair, clothes, always the same words"]
};

// The people who get a reference picture: drawn once, approved by a person, then shown with every scene they are in.
const REFS = ["HERO"];

module.exports = { WHO, REFS, SOURCES: { TAF } };
`);
w(path.join(S, "author", "c1.js"), `/* Chapter 1. A chapter: chapter(id, icon, title, "Surah:verses" or null, [more verses], null, cite for history).
   s(suffix, scene, words, picture description with {WHO} keys, { src, mood, presence }) is a narrated page with its own
   picture; q / srt / ord / mat / chg / p are the activities (see scripts/kit/author.js). */
"use strict";
const { chapter, s, q, TAF } = require("./lib");

chapter("${letter}1", "⭐", "TODO chapter title", "TODO 1:1-2", []);
s("a", "village", "TODO the first page's words.", "TODO what the picture shows, with {HERO}.", { src: TAF });
q("q", "village", "TODO a question?", ["TODO right answer", "✅"], ["TODO wrong answer", "❌"], "TODO what is said after a wrong answer.", { img: "a" });
`);
w(path.join(S, "author", "em.js"), `/* What a narrated scene shows when its picture is missing: two or three icons, by line. */
"use strict";
module.exports = {
  "${letter}1-a": "⭐ 📖"
};
`);
w(path.join(A, "build.py"), "#!/usr/bin/env python3\n\"\"\"Pictures for this story: the shared story kit does the work. Usage: build.py prompts | build.py import <folder>\n(the same as: python3 scripts/kit/art.py " + story + " prompts|import <folder>).\"\"\"\nimport os, subprocess, sys\nsys.exit(subprocess.call([sys.executable, os.path.join(os.path.dirname(os.path.abspath(__file__)), \"..\", \"kit\", \"art.py\"), " + JSON.stringify(story) + "] + sys.argv[1:]))\n");
w(path.join(G, "game.json"), JSON.stringify({ slug, title, icon: "⭐", minAge: 5, maxAge: 9, tagline: "TODO one line for the home page.", basedOn: null,
  depictionNotes: "TODO who is drawn and how. Pictures are AI-generated.", cover: "cover.webp", coverAlt: "TODO what the cover shows." }, null, 2) + "\n");
w(path.join(G, "game.js"), `/*
  What makes this the ${title} game, for the shared story player (shared/story-engine.js).
*/
window.STORY_GAME = {
  slug: ${JSON.stringify(slug)},
  notesSource: "TODO where the notes for parents get their facts.",
  titleArt: [],
  titleMood: "pastoral",
  endMood: "triumph",
  endIcon: "⭐",
  sceneMood: { village: "pastoral", field: "pastoral", city: "joy", palace: "regal", sea: "wonder", desert: "trek", dawn: "triumph", dusk: "longing", night: "longing" },
  sceneAmb: { village: "birds", field: "birds", city: "crowd", palace: "birds", sea: "wind", desert: "wind" }
};
`);
let page = fs.readFileSync(path.join(ROOT, "games", "rahmah", "index.html"), "utf8")
  .replace(/Rahmah El Yunusiyyah/g, title)
  .replace(/<p class="sub">[\s\S]*?<\/p>/, '<p class="sub">TODO how many chapters, about what. Play a little every day.</p>')
  .replace(/(<summary>For parents<\/summary>\s*<ul>)[\s\S]*?(<\/ul>)/, "$1\n        <li>TODO what this story is based on, and what is left to the notes for parents.</li>\n      $2")
  .replace(/<div class="virtues">[\s\S]*?<\/div>/, '<div class="virtues"><span>TODO</span><span>TODO</span><span>TODO</span></div>')
  .replace(/tell her story/, "tell this story");
w(path.join(G, "index.html"), page);
console.log("\nNext: research and an outline (scripts/" + story + "/RESEARCH.md, OUTLINE.md) for the owner's approval; then write the\n" +
  "chapters and run  node scripts/kit/make.js " + story + " story refs  ... (scripts/kit/README.md). Add " + slug + " to manifest.json when it is ready.");
