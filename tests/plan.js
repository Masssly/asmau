// Which tests a release needs, from the files it changes since the live site (origin/main).
// The owner's rule (25 November 2026): a quick check for small changes, the full run for the engine and at least once a day.
//
//   node tests/run.js quick     the tests this change needs (a few minutes)
//   node tests/run.js           everything (about 18 minutes)
//
// A file the rules below do not know makes the run a full one: when in doubt, test everything.
"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");

// changes to these touch every game at once: always the full run
const ENGINE = [
  /^shared\/(story-engine|narration|music|media|lang|people|sound-buttons|pwa|config)\.js$/, /^shared\/(story|style)\.css$/,
  /^scripts\/build-offline\.js$/, /^fonts\//, /^tests\/(lib|run|plan)\.js$/, /^tests\/package(-lock)?\.json$/
];
// written by the build or the release from other files: they follow what changed, and add nothing to test
const MADE = [/^sw\.js$/, /^version\.json$/, /^packs\//, /^games\/index\.json$/, /^games\/[^/]+\/parents\/(notes|pages)\.json$/,
  /^lang\/STATUS\.md$/, /^games\/[^/]+\/offline\.json$/];
// words for people, scripts and pictures that the site does not run
const QUIET = [/^(?!games\/[^/]+\/parents\/).*\.md$/, /^scripts\//, /^brand\//, /^\.github\//, /^\.gitignore$/, /^LICENSE/];
// the rest: [pattern, test groups]
const RULES = [
  [/^(index|privacy|reset)\.html$|^manifest\.json$|^app\.webmanifest$|^icons\//, ["landing", "lang", "gate", "voice", "sound"]],
  [/^lang\//, ["lang", "landing"]],
  [/^shared\/gate\.js$/, ["gate"]],
  [/^shared\/sync\.js$|^sync\//, ["sync", "record", "migrate", "move", "worker"]],
  [/^shared\/(recorder|mp3)\.js$|^tools\//, ["record", "voice", "sync"]],
  [/^games\/count-the-crescents\/|^games\/tap-and-say\//, ["counting"]],
  [/^games\/[^/]+\/parents\//, ["notes"]],                       // a parents' note: shown on its page, kept with it
  [/^tests\/([a-z]+)\.test\.(js|mjs)$/, (m) => [m[1]]]
];
const ALWAYS = ["landing", "keep"];   // the front door, and a family's things kept through an update

function changedFiles() {
  const sh = (c) => require("child_process").execSync(c, { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
  // a fresh copy may lack the live branch to compare with: fetch it once (it then follows every push)
  try { sh("git rev-parse --verify -q origin/main"); }
  catch (e) { sh("git config remote.origin.fetch +refs/heads/main:refs/remotes/origin/main"); sh("git fetch -q origin main"); }
  return [...new Set((sh("git diff --name-only origin/main") + "\n" + sh("git ls-files --others --exclude-standard")).split("\n").filter(Boolean))];
}

function storyGame(slug) {
  try { return fs.existsSync(path.join(ROOT, "games", slug, "story.js")); } catch (e) { return false; }
}

// files → { full, why, groups, play }: play is the story games the playthrough plays
function plan(files) {
  const groups = new Set(ALWAYS), play = new Set();
  for (const f of files) {
    if (ENGINE.some((r) => r.test(f))) return { full: true, why: f + " touches every game" };
    if (MADE.some((r) => r.test(f)) || QUIET.some((r) => r.test(f))) continue;
    const rule = RULES.find(([r]) => r.test(f));
    if (rule) { (typeof rule[1] === "function" ? rule[1](rule[0].exec(f)) : rule[1]).forEach((g) => groups.add(g)); continue; }
    const g = /^games\/([^/]+)\//.exec(f);
    if (g) {
      if (storyGame(g[1])) { play.add(g[1]); groups.add("notes"); if (/scene-fx\.json$/.test(f)) groups.add("live"); }
      else groups.add("lang");                                    // a coming-soon card: its words on the landing page
      continue;
    }
    return { full: true, why: f + " is not in the test plan" };
  }
  if (play.size) groups.add("playthrough");
  return { full: false, groups: [...groups], play: [...play] };
}

// the full run is due once a day: the date of the last full run that passed, kept on this machine only
const STAMP = path.join(__dirname, ".last-full");
function fullDueToday() { try { return fs.readFileSync(STAMP, "utf8").trim() !== new Date().toISOString().slice(0, 10); } catch (e) { return true; } }
function markFull() { try { fs.writeFileSync(STAMP, new Date().toISOString().slice(0, 10) + "\n"); } catch (e) { /* no record: the next quick check runs everything */ } }

module.exports = { plan, changedFiles, fullDueToday, markFull };
