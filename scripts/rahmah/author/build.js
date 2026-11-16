#!/usr/bin/env node
/* Writes this story's game files from its chapter files: the shared story kit does the work (scripts/kit/build.js). */
process.argv[2] = "rahmah";
require("../../kit/build.js");
