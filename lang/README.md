# Translating Asmau

Asmau's games are written in English. Every other language lives in this folder: one folder per language, named by its
code (`de` German, `id` Indonesian, `ms` Malay, `fr` French, ...). Nothing else in the site needs to change to add or
correct a translation. **[STATUS.md](STATUS.md)** shows every language, game by game.

```
lang/
  README.md        this page
  STATUS.md        every language, game by game (written by the build; do not edit)
  de/
    site.json      the words on every page: buttons, labels, the home page
    yusuf.json     one file per game
    musa.json
    ...
```

The pictures, the activities and the page numbers are the same in every language: only the words change.

## What a game's file looks like

```json
{
 "status": "draft",
 "_note": "Deutsch. To be checked by a native speaker.",
 "lines": {
  "c1-a": {
   "en": "One night, young Yusuf had a wonderful dream.",
   "t": "Eines Nachts hatte der junge Yusuf einen wunderbaren Traum."
  }
 },
 "strings": {
  "The Dream": "Der Traum"
 }
}
```

- **`lines`**: everything the story says, one entry per line. `en` is the English it was translated from; **`t` is the
  translation**. Write only in `t`. Leave `en` as it is: if the English story changes later, the checker compares the two and
  lists the lines that need a new look.
- **`strings`**: titles, labels, answers and the game's card on the home page, by their English text. Write the translation
  on the right.
- **`status`**: `"draft"` while it is being written. Families never see a draft; to see it yourself, add `?lang=de` (your
  code) to the address, for example `https://asmau.org/?lang=de`. Only the owner changes it to `"checked"`, once a native
  speaker has read it; then every family who chooses the language sees it.
- **`voices`** (optional): `["w", "m"]` once the computer voices (Aunty Salma, Uncle Sani) have read every line in the
  language. Without it, the words are on screen and nothing reads them aloud, unless a parent records them.
- A line or label left empty (`""`) shows in English.

`site.json` is the same idea for the buttons and labels on every page: `"English": "translation"`. Keys starting with
`re:` are patterns (`"re:^Chapter (\\d+)$": "Kapitel $1"`): keep the part before the colon exactly as it is.

## How we write

- For children of about 3 to 10: short sentences, everyday words, warm and gentle. Speak to the child as a friend
  would (German: *du*); speak to parents politely (German: *Sie*).
- **Allah** stays Allah. The prophets keep the names Muslims use in your language (Musa, Yusuf, Ibrahim), with the usual
  honorific where the English has "peace be upon him".
- The **Qur'an's words**: where a line quotes a verse, use the translation of the Qur'an that families in your language
  know, not a new wording.
- Arabic words and prayers (*al-hamdu lillah*, *bismillah*, *as-salamu alaykum*) stay as they are.
- "It is told that ..." marks something from the commentaries, not the Qur'an: keep that marker in your language.
- Keep the meaning, not the English word order. If something cannot be said simply in your language, say it simply in
  another way.
- The parents' notes and the For parents texts stay in English for now.

## Adding a language

```
node scripts/lang-new.js fr "Français"
```

creates `lang/fr/` with every file, the English filled in and every translation empty, and tells the site the language's
name. Translate, then run `node scripts/build-offline.js` and look at it with `?lang=fr`. Right-to-left languages
(Arabic, Urdu, Persian) need some work on the pages first; ask before starting one.

## Translating with another AI

Give it one game's file and this page, and ask: *"Translate every empty `t` and every empty value in `strings` into
<language>, following the rules in README.md. Change nothing else. Return the whole file as JSON."* Then have a native
speaker read the result before it is marked `"checked"`.

## Checking your work

```
node scripts/lang-strings.js yusuf de     # what is missing, and lines whose English changed
node scripts/validate.js                  # the whole site's checks
```

## Sending a translation (pull requests)

Edit the files on GitHub, or in your own copy, and open a pull request. The automatic check on the pull request reads every
translation file. Changing a draft is safe to merge: families do not see drafts. Changing `"status"` to `"checked"` is the
step that puts a language in front of families, so the owner does that. After merging, the next release (Claude, or
`node scripts/release.js`) rebuilds the site; until then, devices that saved a game for offline keep the old words.
