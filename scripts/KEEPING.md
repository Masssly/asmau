# Keeping a family's things across updates

Owner, 17 November 2026: updates must never make a parent enter their family code again, on the website or in the
store apps. This is what a family has on a device, what may never remove it, and what still can.

## What a device holds

| What | Where | If it is lost |
|---|---|---|
| Family code (`asmau-sync-code`) and sync state (`asmau-sync-state`) | localStorage | recordings on other devices and online are unreachable from this one until the code is entered again |
| A parent's recordings | IndexedDB `asmau-voice` | gone, unless sync was on (then they come back with the code) |
| The child's place in each story (`asmau-<slug>`) | localStorage | the story starts from the beginning |
| Voice, language, sound levels (`asmau-voice`, `asmau-lang`, `asmau-sound`) | localStorage | back to the defaults |
| Downloaded games | Cache Storage `asmau-files`, `asmau-meta` | downloaded again (costs data) |

## Rules for every release

- Never rename or remove any of the keys or databases above without code that moves the old value to the new place in
  the same release.
- Nothing in the site clears localStorage or IndexedDB: not an update, not `reset.html` (it clears only the saved copy
  of the site), not the service worker (it deletes only its own old `asmau-` caches).
- An update reload (`shared/pwa.js`) waits while a page is busy (`window.AsmauBusy`, the recorder while recording), and
  a story comes back on the same page with one tap ("Asmau was updated").
- `tests/keep.test.js` plays a story with a family code set, releases an update in the middle, and checks that the code,
  the voice and the place are all still there and the child is back on the same page.

## What can still remove them (the browser, not Asmau)

- **Safari tabs on iPhone and iPad** delete a site's storage after 7 days without a visit. The app added to the home
  screen is exempt, so For parents recommends adding Asmau to the home screen.
- **Safari and the home-screen app keep separate storage** on iPhone: a code entered in one is not in the other.
  Deleting the home-screen icon deletes its storage.
- **Chrome on Android** may clear a site when the phone runs out of space, unless the site is kept. Asmau asks to be
  kept (`AsmauKeep` in shared/pwa.js) when a family code is set, a recording is made, a game is downloaded, and every
  time the home-screen app opens.
- **A parent clearing the browser's data.**

So the family code is shown in full in the recorder (Show, Copy) on any device where sync is on, and parents are asked
to save it when it is made: it is the one way back.

## The store apps

- **Android (a Trusted Web Activity of the site).** It runs the website in Chrome at the same address, so it shares
  the website's storage: updates of the app or the site keep everything. Never change the app's package name or the
  site's address.
- **iPhone (the site in a WKWebView, for example with Capacitor).** Storage lives in the app and is kept across app
  updates; it is deleted only when the app is deleted. Never change the bundle id or the address the web view loads
  (with Capacitor: `server.url`, or `iosScheme` and `hostname`): a new address is a new, empty storage. The app does not
  share storage with Safari, so a family enters their code once in the app (or a "move from Safari" link carries it).

## The move to our own domain (asmau.org, 18 November 2026)

A new address is a new, empty storage on every device. asmau.org is served by Cloudflare Pages from this repository
(every push to main); the old address, masssly.github.io/asmau (GitHub Pages), hands each family over:

1. Every page at the old address (shared/pwa.js) reads the family's small things (every `asmau-` key in localStorage:
   code, sync state, voice, language, places) and opens the same page at asmau.org through `move.html`, with them in the
   part of the link after `#`, which browsers never send to any server. move.html saves each one that asmau.org does not
   have yet (never overwriting a newer one), cleans the link and goes on. `tests/move.test.js` checks it.
2. Recordings are not carried (too big for a link): synced ones come back with the code. There were no families yet at
   the move, so no one had unsynced recordings at the old address.
3. The sync Worker accepts both addresses (`ORIGINS` in sync/worker.js) until the old one is switched off.
4. Never set a custom domain on the GitHub Pages site: GitHub would then redirect the old address itself and the
   handover in step 1 could not run.
