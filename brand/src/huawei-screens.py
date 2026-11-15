"""Huawei AppGallery screenshots: the first five Google Play phone ones, resized.  python3 brand/src/huawei-screens.py"""
import glob, os
from PIL import Image
kit = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "kit", "screens")
for d, size in {"huawei-720x1280": (720, 1280), "huawei-450x800": (450, 800)}.items():
    os.makedirs(os.path.join(kit, d), exist_ok=True)
    for f in sorted(glob.glob(os.path.join(kit, "play-phone", "*.jpg")))[:5]:
        Image.open(f).convert("RGB").resize(size, Image.LANCZOS).save(os.path.join(kit, d, os.path.basename(f)), quality=90)
print("huawei screenshots written")
