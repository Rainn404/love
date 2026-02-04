#!/usr/bin/env python3
"""
Convert HEIC images to JPG format
"""

import os
from pathlib import Path

# Register HEIC opener
try:
    from PIL import Image
    from pillow_heif import register_heif_opener
    register_heif_opener()
    print("Using PIL/Pillow with HEIF support for conversion...")
except ImportError as e:
    print(f"Error importing: {e}")
    exit(1)

img_dir = r"c:\xampp\htdocs\valentine\img"
heic_files = sorted(Path(img_dir).glob("*.HEIC"))

print(f"Found {len(heic_files)} HEIC files\n")

success_count = 0
for heic_file in heic_files:
    jpg_file = heic_file.with_stem(heic_file.stem).with_suffix('.jpg')
    
    if jpg_file.exists():
        print(f"~ Already exists: {jpg_file.name}")
        success_count += 1
        continue
    
    try:
        with Image.open(heic_file) as img:
            # Convert RGBA to RGB if needed
            if img.mode in ('RGBA', 'LA', 'P'):
                rgb_img = Image.new('RGB', img.size, (255, 255, 255))
                if img.mode == 'RGBA':
                    rgb_img.paste(img, mask=img.split()[-1])
                else:
                    rgb_img.paste(img)
                rgb_img.save(jpg_file, 'JPEG', quality=90, optimize=True)
            else:
                img.save(jpg_file, 'JPEG', quality=90, optimize=True)
        
        print(f"✓ Converted: {heic_file.name} -> {jpg_file.name}")
        success_count += 1
    except Exception as e:
        print(f"✗ Error converting {heic_file.name}: {e}")

print(f"\n✓ Conversion complete! {success_count}/{len(heic_files)} successful")
