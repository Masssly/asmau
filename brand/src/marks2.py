import sys; sys.path.insert(0, ".")
from textpath import outline
F = "../../fonts/"
BG = '''<defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c2d5e"/><stop offset="1" stop-color="#0c1530"/></linearGradient>
<linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f8cd73"/><stop offset="1" stop-color="#e0a23a"/></linearGradient>
<linearGradient id="wood" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e9b265"/><stop offset="1" stop-color="#b9772f"/></linearGradient></defs>
<rect width="512" height="512" fill="url(#bg)"/>'''
def svg(body): return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">' + BG + body + '</svg>\n'
def text(font, wght, size, s, cx, cy, fill):
    w, h, base, d = outline(F + font, wght, size, s)
    return '<path transform="translate(%.1f %.1f)" d="%s" fill="%s"/>' % (cx - w / 2, cy - h / 2, d, fill)

# board v2: wood, grain, a cord through the handle, the first letters written in ink
board = '''<path d="M226 96 Q226 76 246 76 H266 Q286 76 286 96 V138 Q286 150 300 152 L342 158 Q366 162 366 188 V404 Q366 436 334 436 H178 Q146 436 146 404 V188 Q146 162 170 158 L212 152 Q226 150 226 138 Z" fill="url(#wood)"/>
<g stroke="#a5672a" stroke-width="3" fill="none" opacity=".35"><path d="M170 200 Q220 190 250 205 T342 200"/><path d="M162 300 Q230 288 270 306 T350 298"/><path d="M166 410 Q220 398 260 412 T346 404"/></g>
<circle cx="256" cy="104" r="11" fill="#0c1530"/>'''
allo = board + '<path d="M266 196 A24 24 0 1 0 266 240 A19 19 0 1 1 266 196 Z" fill="#3b2410"/>' + text("mada-arabic.woff2", 700, 74, "أ ب ت", 256, 310, "#3b2410")
open("mark-allo.svg", "w").write(svg(allo))

# monogram: a big rounded A, with a crescent and star resting in it
A = text("baloo2-latin.woff2", 800, 430, "A", 256, 286, "url(#gold)")
mono = A + '<path d="M402 96 l9 22 22 9 -22 9 -9 22 -9 -22 -22 -9 22 -9 z" fill="#fdf6e8"/>'
open("mark-monogram.svg", "w").write(svg(mono))
