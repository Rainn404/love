#!/usr/bin/env python3
import os
import sys
from pathlib import Path

# Try to import required modules
try:
    from PIL import Image
    import pillow_heif
    pillow_heif.register_heif_opener()
except ImportError as e:
    print(f"Missing module: {e}")
    sys.exit(1)

img_dir = Path("img")
heic_files = list(img_dir.glob("*.HEIC")) + list(img_dir.glob("*.heic"))

success_count = 0
for heic_path in heic_files:
    try:
        jpg_path = heic_path.with_suffix(".jpg")
        
        # Open and convert
        with Image.open(heic_path) as img:
            rgb_img = img.convert('RGB')
            rgb_img.save(jpg_path, 'JPEG', quality=95)
        
        print(f"✓ {heic_path.name} -> {jpg_path.name}")
        success_count += 1
    except Exception as e:
        print(f"✗ {heic_path.name}: {e}")

print(f"\nConverted: {success_count}/{len(heic_files)} files")
