# Asmau brand

Chosen by the owner on 15 November 2026: **mark A, the writing board.**

## The name and the line under it
- **Asmau**, one word, capital A, no apostrophe (the person is Nana Asma'u; the games are Asmau).
- Tagline: **Islamic games for curious kids.** One tagline only; it is also the page title and the store subtitle.
- Say "free", "read aloud", "works offline", "no ads" only while each is true (see privacy.html).

## The mark
The wooden writing board (in Hausa *allo*) that children in West African Qur'an schools write their first
letters on, with أ ب ت (alif, ba, ta) in ink and a small crescent. It stands for learning, for Islam and for
West Africa, and for Nana Asma'u, who taught women and girls.

- Always on its night-blue tile (the app icon) unless the background is already night blue.
- Keep a clear space of at least a quarter of the tile's width around the tile.
- Do not recolour the wood, turn it, stretch it, add a shadow inside it, or put words on the board other than
  أ ب ت.
- Smallest size: 16 px (the favicon); below 32 px the letters blur, which is fine.

## Colours (the same as shared/style.css)
| Name | Hex | Use |
|---|---|---|
| Night | `#0c1530` | backgrounds, the icon tile (gradient from `#1c2d5e` at the top) |
| Card | `#15244a` | panels on night |
| Gold | `#f0b84b` | buttons, the tagline on dark |
| Gold deep | `#c98f2b` | pressed states; `#a86f12` for gold text on light backgrounds |
| Cream | `#fdf6e8` | the wordmark and text on dark |
| Teal | `#5fb3a0` | second accent, sparingly |
| Wood | `#e9b265` → `#b9772f` | the board only |
| Ink | `#3b2410` | the letters on the board only |

## Lettering
- **Baloo 2** ExtraBold (800) for the name and headings; **Mada** for text and for Arabic. Both are free (SIL Open
  Font License) and live in fonts/.
- The wordmark files are outlines, so they need no font installed.

## Pictures and sound
- Pictures: the polished 3D family-film look, everyone dark-skinned Black African, modest clothing, every woman's
  and girl's hair covered (CLAUDE.md, "Pictures").
- Voice: Aoede, a kind West African woman (CLAUDE.md, "Voice").

## How we write
Plain, warm and short, the way a good auntie or teacher talks to a child. British spelling (colour, favourite).
Arabic words with full vowel marks; Qur'an references on every story chapter.

## Files
`brand/kit/` holds everything made from the mark (regenerate, never edit by hand):

| Folder | Files | For |
|---|---|---|
| site | favicon.svg, favicon-16/32/48.png, icon-180/192/512.png, icon-maskable-512.png | the website and the installed app (copied into icons/) |
| share | og-1200x630.png (also icons/og.png), avatar-800.png | link previews; profile picture for email and social accounts |
| lockup | lockup-dark/light.svg/.png, wordmark-cream/navy.svg | headers, letters, slides |
| apple | app-store-1024.png | App Store icon: square corners, no transparency (Apple rounds it) |
| android | play-512.png, feature-1024x500.png, adaptive/foreground, background, monochrome-432.png | Google Play icon and banner; the Android launcher icon (108 dp layers, art inside the 66 dp safe circle; monochrome for themed icons) |
| huawei | appgallery-216.png | AppGallery icon |
| apple | splash-2732.png | launch screen for a native wrapper: cropped from the centre to each screen, so everything sits in the middle 1200 px |
| android | splash-icon-1152.png | Android 12+ launch icon (288 dp, art inside the 192 dp circle); the app sets the background to `#0c1530` |
| screens | apple-iphone-6.9 (1320 × 2868), apple-ipad-13 (2064 × 2752), play-phone (1080 × 1920), play-tablet (1440 × 2560), huawei-720x1280, huawei-450x800 | store screenshots: real game screens under a one-line caption, JPEG |

The seven screenshots, in order: the landing page; a story page read aloud (Yusuf 1.1); a game inside the story
(Yusuf 1.2); recording your own voice; Tap & Say with Arabic; Nana Asma'u (1.2); a picture page (Adam 2.4).
Huawei takes three to five, so it gets the first five.

Store sizes change: check each store's current rules before submitting.

## Making the files again
```
python3 brand/src/marks2.py          # the board and letter marks (outlines from fonts/)
python3 brand/src/lockups.py         # wordmark, lockups, store banners (brand/preview)
node brand/src/kit.js allo           # every icon and banner into brand/kit
python3 brand/src/mono.py brand/kit  # the one-colour Android icon
node brand/src/splash.js             # the launch screens
python3 -m http.server 8799 &        # then, with the site served from the repo:
node brand/src/screens.js            # the store screenshots (real screens, so remake them when the games change)
python3 brand/src/huawei-screens.py  # Huawei's sizes from the Play phone ones
```
Then copy the site files into icons/ (see the table) and run `node scripts/build-offline.js`.
Needs Python with fonttools, brotli and uharfbuzz (`pip install fonttools brotli uharfbuzz`) and Playwright.
