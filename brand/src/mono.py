"""Android 13+ themed icon: one colour, shape from transparency. The wood stays, the ink (letters, crescent,
the hole in the handle) is cut out.  python3 brand/src/mono.py brand/kit"""
import sys, os
from PIL import Image
kit = sys.argv[1]
fg = Image.open(os.path.join(kit, "android", "adaptive", "foreground-432.png")).convert("RGBA")
out = Image.new("RGBA", fg.size, (0, 0, 0, 0))
px, po = fg.load(), out.load()
for y in range(fg.size[1]):
    for x in range(fg.size[0]):
        r, g, b, a = px[x, y]
        lum = 0.299 * r + 0.587 * g + 0.114 * b
        keep = max(0.0, min(1.0, (lum - 70) / 50.0))      # ink is dark (about 40), wood is light (150 and up)
        po[x, y] = (255, 255, 255, int(a * keep))
out.save(os.path.join(kit, "android", "adaptive", "monochrome-432.png"))
print("monochrome written")
