import re
P = "/tmp/claude-0/-home-user/313c5257-c4cd-59a3-9c06-bd2ddf472981/scratchpad/asmau-brand.html"
def body(path, pre):
    s = open(path).read()
    vb = re.search(r'viewBox="([^"]+)"', s).group(1)
    inner = re.search(r'viewBox="[^"]+">(.*)</svg>', s, re.S).group(1)
    inner = inner.replace('id="', 'id="%s-' % pre).replace('url(#', 'url(#%s-' % pre)
    return vb, inner
def svg(path, pre, cls="", w=None):
    vb, inner = body(path, pre)
    return '<svg class="%s" viewBox="%s" role="img" aria-hidden="true"%s>%s</svg>' % (cls, vb, (' width="%d"' % w) if w else "", inner)

M = [("allo", "A · The writing board", "The wooden board children write their first letters on in Qur'an schools across West Africa, with أ ب ت (a, b, t) in ink and a small crescent.",
      "The only one that says Islamic learning and West Africa at once, and ties to Nana Asma'u the teacher. Nothing in the stores looks like it.",
      "Someone who has never seen one may read the shape as a chopping board. The letters soften that, but not to nothing."),
     ("monogram", "B · The letter A", "A rounded gold A in the games' own lettering, with a small star.",
      "Clean, sharp at every size, easy to own, and it matches the name on the page.",
      "Says nothing about Islam or stories on its own; a letter in a square is a common app pattern."),
     ("crescent", "C · The cradle moon", "A crescent lying on its back like a cradle, holding a star. Today's icon, made more our own.",
      "Instantly reads as Islamic and gentle; the closest to what is live now.",
      "Hundreds of Islamic apps use a crescent and star; in a store list it blends in.")]
n = 0
cards = []
for key, title, what, plus, minus in M:
    n += 1
    f = "mark-%s.svg" % key
    tiny = lambda sz: '<span class="ic" style="--s:%dpx">%s</span>' % (sz, svg(f, "%s%d" % (key, sz)))
    cards.append('''<article class="opt" id="opt-%s">
  <header><h2>%s</h2><p>%s</p></header>
  <div class="hero-icon">%s</div>
  <div class="row">
    <figure class="home"><div class="wall">%s<span class="lbl">Asmau</span></div><figcaption>Home screen</figcaption></figure>
    <figure class="tab"><div class="chrome"><span class="fav">%s</span><span>Asmau · Islamic story games</span></div><figcaption>Browser tab, 16 px</figcaption></figure>
  </div>
  <figure class="wide">%s<figcaption>Site header</figcaption></figure>
  <figure class="wide">%s<figcaption>Store banner (Google Play feature graphic, 1024 × 500)</figcaption></figure>
  <dl><dt>For</dt><dd>%s</dd><dt>Against</dt><dd>%s</dd></dl>
</article>''' % (key, title, what, svg(f, key + "big"), tiny(64), tiny(16),
                 svg("../preview/lockup-%s.svg" % key, key + "lk"), svg("../preview/feature-%s.svg" % key, key + "fg"), plus, minus))

html = '''<title>Asmau Brand Marks</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Mada:wght@400;700&display=swap">
<style>
/* Layout: three marks side by side (stacked on phones), each shown where it will actually live. */
:root { --bg: #eef1f7; --panel: #ffffff; --ink: #141c33; --soft: #4d5875; --line: #d5dbe8; --gold: #b07a1c; --navy: #0c1530;
  --display: 'Baloo 2', ui-rounded, system-ui, sans-serif; --body: 'Mada', system-ui, sans-serif; }
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { --bg: #0a1024; --panel: #121a35; --ink: #eef1fa; --soft: #a9b3d1; --line: #26305a; --gold: #f0b84b; color-scheme: dark } }
:root[data-theme="dark"] { --bg: #0a1024; --panel: #121a35; --ink: #eef1fa; --soft: #a9b3d1; --line: #26305a; --gold: #f0b84b; color-scheme: dark }
body { background: var(--bg); color: var(--ink); font: 16px/1.55 var(--body); padding-block: 28px 48px;
  padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); }
.wrap { max-width: 1280px; margin: 0 auto; display: grid; gap: 28px; }
h1 { font: 800 clamp(30px, 4vw, 44px)/1.1 var(--display); margin: 0; text-wrap: balance; }
h2 { font: 700 22px/1.2 var(--display); margin: 0 0 4px; }
.lede { max-width: 68ch; color: var(--soft); margin: 6px 0 0; }
.rec { background: var(--panel); border: 1px solid var(--line); border-radius: 18px; padding: 18px 20px; max-width: 80ch; }
.rec b { color: var(--gold); }
.opts { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 22px; }
.opt { background: var(--panel); border: 1px solid var(--line); border-radius: 22px; padding: 20px; display: grid; gap: 14px; min-width: 0; align-content: start; }
.opt header p { margin: 0; color: var(--soft); font-size: 15px; }
.hero-icon svg { width: min(200px, 60%); display: block; border-radius: 22.4%; box-shadow: 0 10px 28px rgba(12,21,48,.28); }
.row { display: flex; gap: 14px; flex-wrap: wrap; align-items: flex-end; }
figure { margin: 0; display: grid; gap: 6px; min-width: 0; }
figcaption { font-size: 12.5px; color: var(--soft); letter-spacing: .02em; }
.wall { background: linear-gradient(160deg, #3a6b6a, #20304f); border-radius: 16px; padding: 14px 22px 10px; display: grid; justify-items: center; gap: 4px; }
.lbl { color: #fff; font-size: 12px; }
.ic svg { width: var(--s); height: var(--s); display: block; border-radius: calc(var(--s) * .224); }
.chrome { display: flex; align-items: center; gap: 8px; background: #dfe3ec; color: #222; border-radius: 10px 10px 0 0; padding: 8px 14px; font: 13px system-ui, sans-serif; }
.fav svg { border-radius: 3px; }
.wide svg { width: 100%; height: auto; display: block; border-radius: 12px; }
dl { margin: 0; display: grid; grid-template-columns: auto 1fr; gap: 6px 12px; font-size: 15px; }
dt { font-weight: 700; color: var(--gold); }
dd { margin: 0; }
section.kit { background: var(--panel); border: 1px solid var(--line); border-radius: 22px; padding: 20px 22px; }
.kit ul { margin: 8px 0 0; padding-left: 20px; columns: 2 300px; column-gap: 32px; }
.kit li { break-inside: avoid; margin-bottom: 6px; }
.kit h3 { font: 700 17px var(--display); margin: 16px 0 0; }
</style>
<div class="wrap">
  <div><h1>Pick Asmau's mark</h1>
  <p class="lede">Three directions, each shown where it will live: the phone's home screen, a browser tab, the site header and the store banner. They share the games' colours (night blue, gold, cream) and lettering (Baloo 2 and Mada), drawn as vector shapes so they stay sharp at every size.</p></div>
  <div class="rec"><b>My pick: A, the writing board.</b> B is the safest and sharpest; C is the most familiar. But in a store full of crescents, A is the one a parent remembers, and it is the only one that carries Asma'u's own story: a West African teacher of girls and women. If the chopping-board risk worries you, B is my second choice, and it can carry the board as an illustration on the site instead.</div>
  <div class="opts">''' + "\n".join(cards) + '''</div>
  <section class="kit"><h2>What gets made once you pick</h2>
  <h3>asmau.org</h3>
  <ul><li>Logo files: mark, wordmark and the two together, for dark and light backgrounds and one-colour use (SVG and PNG)</li>
  <li>Favicon set (SVG, 32 and 16 px, Apple touch icon) and the PWA icons, including the maskable one</li>
  <li>Link preview image (1200 × 630) for WhatsApp, Facebook and the like</li>
  <li>The landing page header with the new lockup</li>
  <li>A short brand guide: colours, lettering, picture style, the voice, how the name is written</li>
  <li>Email signature and profile picture for hello@asmau.org</li></ul>
  <h3>The apps (later)</h3>
  <ul><li>App Store icon, 1024 × 1024, no transparency, square corners (Apple rounds them)</li>
  <li>Android adaptive icon: separate foreground and background layers, plus a one-colour layer for themed icons</li>
  <li>Google Play icon (512 × 512) and feature graphic (1024 × 500)</li>
  <li>Huawei AppGallery icon and banner</li>
  <li>Splash screens for phones and tablets</li>
  <li>Store screenshots with short captions, phone and tablet sizes</li>
  <li>Store text: name, short and full description, keywords, in English first</li></ul>
  </section>
</div>'''
open(P, "w").write(html)
print(len(html))
