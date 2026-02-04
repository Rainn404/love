#!/usr/bin/env python3
import sys
import os
from PIL import Image

try:
    import pillow_heif
    pillow_heif.register_heic_opener()
except:
    pass

img_dir = "img"
heic_file = os.path.join(img_dir, "IMG_4630.HEIC")
jpg_file = os.path.join(img_dir, "IMG_4630.jpg")

if os.path.exists(heic_file):
    try:
        img = Image.open(heic_file)
        img = img.convert('RGB')
        img.save(jpg_file, 'JPEG', quality=95)
        print(f"Converted: {heic_file} -> {jpg_file}")
    except Exception as e:
        print(f"Error: {e}")
else:
    print(f"File not found: {heic_file}")
