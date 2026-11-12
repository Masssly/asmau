#!/usr/bin/env node
/*
  Cut a release: give the current state of the site a version number and notes.

    node scripts/release.js "Yusuf: a picture for every scene" "Sync keeps recordings on all devices"

  Versions are YEAR.MONTH.NUMBER, like 2026.11.1: the first release of a month
  is .1, the next .2, and a new month starts again at .1. Notes are written for
  parents, in plain words (they are shown under "What's new").
  Run it after your changes, before committing; it also refreshes sw.js.
*/
"use strict";
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const build = require("./build-offline.js");

const FILE = path.join(__dirname, "..", "version.json");
const notes = process.argv.slice(2).map((s) => s.trim()).filter(Boolean);
if (!notes.length) { console.error('Give at least one note, in quotes: node scripts/release.js "What changed"'); process.exit(1); }

let history = [];
try { history = JSON.parse(fs.readFileSync(FILE, "utf8")).history || []; } catch (e) { /* first release */ }
const now = new Date();
const prefix = now.getUTCFullYear() + "." + String(now.getUTCMonth() + 1).padStart(2, "0");
const last = history[0] && history[0].version.startsWith(prefix + ".") ? parseInt(history[0].version.split(".")[2], 10) : 0;
const version = prefix + "." + (last + 1);
history.unshift({ version, date: now.toISOString().slice(0, 10), notes });
// buildId is written after sw.js is refreshed, so it matches what ships
fs.writeFileSync(FILE, JSON.stringify({ version, date: history[0].date, buildId: "", notes, history }, null, 2) + "\n");
execFileSync("node", [path.join(__dirname, "build-offline.js")], { stdio: "inherit" });
const id = build.compute().build;
fs.writeFileSync(FILE, JSON.stringify({ version, date: history[0].date, buildId: id, notes, history }, null, 2) + "\n");
console.log("Released " + version + " (build " + id + "). Now commit.");
