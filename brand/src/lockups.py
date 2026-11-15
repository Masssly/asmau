"""Writes the wordmark and preview pieces for each mark direction into ../preview/ (SVG)."""
import os, re, sys; sys.path.insert(0, ".")
from textpath import outline
F = "../../fonts/"; OUT = "../preview"; os.makedirs(OUT, exist_ok=True)
w, h, base, WORD = outline(F + "baloo2-latin.woff2", 800, 100, "Asmau")
tw, th, tbase, TAG = outline(F + "mada-latin.woff2", 600, 100, "Islamic games for curious kids")
open(OUT + "/wordmark.json", "w").write(repr((w, h, base, tw, th, tbase)))

def inner(mark):            # the body of a 512 mark, ids made unique so several can share a page
    s = open("mark-%s.svg" % mark).read()
    body = re.search(r'viewBox="0 0 512 512">(.*)</svg>', s, re.S).group(1)
    return body.replace('id="', 'id="%s-' % mark).replace('url(#', 'url(#%s-' % mark)

for m in ("allo", "monogram", "crescent"):
    body = inner(m)
    # horizontal lockup on navy: mark (rounded) + wordmark + tagline
    lock = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 360"><rect width="1200" height="360" fill="#0c1530"/>'
            '<clipPath id="r"><rect x="60" y="60" width="240" height="240" rx="54"/></clipPath>'
            '<g clip-path="url(#r)"><g transform="translate(60 60) scale(.46875)">%s</g></g>'
            '<path transform="translate(340 40) scale(1.9)" d="%s" fill="#fdf6e8"/>'
            '<path transform="translate(346 284) scale(.4)" d="%s" fill="#f0b84b"/></svg>') % (body, WORD, TAG)
    open("%s/lockup-%s.svg" % (OUT, m), "w").write(lock)
    # store feature graphic 1024x500
    fg = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 500"><defs><linearGradient id="fbg" x1="0" y1="0" x2="1" y2="1">'
          '<stop offset="0" stop-color="#1c2d5e"/><stop offset="1" stop-color="#0c1530"/></linearGradient></defs>'
          '<rect width="1024" height="500" fill="url(#fbg)"/>'
          '<clipPath id="r2"><rect x="90" y="130" width="240" height="240" rx="54"/></clipPath>'
          '<g clip-path="url(#r2)"><g transform="translate(90 130) scale(.46875)">%s</g></g>'
          '<path transform="translate(380 112) scale(1.85)" d="%s" fill="#fdf6e8"/>'
          '<path transform="translate(386 350) scale(.38)" d="%s" fill="#f0b84b"/></svg>') % (body, WORD, TAG)
    open("%s/feature-%s.svg" % (OUT, m), "w").write(fg)
print("ok", round(w), round(tw))

# light-background lockup and the plain wordmark, for the chosen mark
CHOSEN = "allo"
body = inner(CHOSEN)
light = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 360">'
         '<clipPath id="r"><rect x="60" y="60" width="240" height="240" rx="54"/></clipPath>'
         '<g clip-path="url(#r)"><g transform="translate(60 60) scale(.46875)">%s</g></g>'
         '<path transform="translate(340 40) scale(1.9)" d="%s" fill="#0c1530"/>'
         '<path transform="translate(346 284) scale(.4)" d="%s" fill="#a86f12"/></svg>') % (body, WORD, TAG)
open("%s/lockup-%s-light.svg" % (OUT, CHOSEN), "w").write(light)
open("%s/wordmark-cream.svg" % OUT, "w").write('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %.0f %.0f"><path d="%s" fill="#fdf6e8"/></svg>' % (w, h, WORD))
open("%s/wordmark-navy.svg" % OUT, "w").write('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %.0f %.0f"><path d="%s" fill="#0c1530"/></svg>' % (w, h, WORD))
