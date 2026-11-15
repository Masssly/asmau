"""Turn a line of text into SVG path data with the games' own fonts (Baloo 2, Mada), so logos need no font.
   python3 textpath.py FONT.woff2 WEIGHT SIZE "text"  ->  prints: width height d"""
import sys, uharfbuzz as hb
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
import io


def outline(font_path, weight, size, text):
    tt = TTFont(font_path)
    if "fvar" in tt:
        tt = instantiateVariableFont(tt, {"wght": weight})
    buf = io.BytesIO(); tt.flavor = None; tt.save(buf); data = buf.getvalue()
    face = hb.Face(data); font = hb.Font(face)
    b = hb.Buffer(); b.add_str(text); b.guess_segment_properties()
    hb.shape(font, b, {"kern": True, "liga": True})
    upem = tt["head"].unitsPerEm; s = size / upem
    gs = tt.getGlyphSet(); order = tt.getGlyphOrder()
    pen = SVGPathPen(gs); x = 0
    asc = tt["hhea"].ascent
    for info, pos in zip(b.glyph_infos, b.glyph_positions):
        name = order[info.codepoint]
        gs[name].draw(TransformPen(pen, (s, 0, 0, -s, (x + pos.x_offset) * s, (asc - pos.y_offset) * s)))
        x += pos.x_advance
    return x * s, (asc - tt["hhea"].descent) * s, asc * s, pen.getCommands()


if __name__ == "__main__":
    w, h, base, d = outline(sys.argv[1], float(sys.argv[2]), float(sys.argv[3]), sys.argv[4])
    print("%.1f %.1f %.1f %s" % (w, h, base, d))
