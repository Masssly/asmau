#!/usr/bin/env python3
"""Pictures for this story: the shared story kit does the work. Usage: build.py prompts | build.py import <folder>
(the same as: python3 scripts/kit/art.py ibn-battuta prompts|import <folder>)."""
import os, subprocess, sys
sys.exit(subprocess.call([sys.executable, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "kit", "art.py"), "ibn-battuta"] + sys.argv[1:]))
