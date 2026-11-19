#!/usr/bin/env python3
"""
Bring the owner's edits from the Parents' notes page (https://claude.ai/artifact/8A5eHNzNpT5frdiDfRRUwZ) into the
note files, before a release (CLAUDE.md, Parents' notes).

  1. Read the edited notes into a folder: ArtifactData query, collection "notes", where edited == true, with out_dir.
  2. python3 scripts/notes-apply.py <that folder>        writes games/<slug>/parents/<ch>/<page>.md for each one
  3. After the release is pushed, set edited: false on those documents (ArtifactData batch update, pinned to their
     version), so the page shows them as released.

A note saved as a draft gets the "# draft" first line back; an empty note becomes an empty file (no note on the page).
Prints the pages it changed, so the release note can name them.
"""
import json, os, sys, glob
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DRAFT = "# draft (delete this line to show the note in the game)\n\n"


def main(folder):
    changed = []
    for f in sorted(glob.glob(os.path.join(folder, "**", "*.json"), recursive=True)):
        doc = json.load(open(f, encoding="utf-8"))
        d = doc.get("data", doc)
        g, p = d.get("g"), d.get("p")
        if not g or not p or not d.get("edited"):
            continue
        path = os.path.join(ROOT, "games", g, "parents", p.split(".")[0], p + ".md")
        if not os.path.exists(path):
            print("skipped %s %s: no such page" % (g, p)); continue
        text = (d.get("text") or "").replace("\r", "").strip()
        body = (DRAFT + text + "\n") if (d.get("draft") and text) else (text + "\n" if text else "")
        if open(path, encoding="utf-8").read() != body:
            open(path, "w", encoding="utf-8").write(body)
            changed.append("%s %s%s" % (g, p, " (draft)" if d.get("draft") else ""))
    print("\n".join(changed) if changed else "no changes")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        raise SystemExit(__doc__)
    main(sys.argv[1])
