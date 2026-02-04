#!/usr/bin/env python3
"""
Compress background image
"""

from PIL import Image
import os

img_path = 'img/backgroud.jpg'

if os.path.exists(img_path):
    original_size = os.path.getsize(img_path) / 1024  # KB
    
    img = Image.open(img_path)
    
    # Resize to max 2000px width untuk background
    if img.width > 2000:
        ratio = 2000 / img.width
        new_height = int(img.height * ratio)
        img = img.resize((2000, new_height), Image.Resampling.LANCZOS)
    
    # Convert RGBA to RGB if needed
    if img.mode in ('RGBA', 'LA', 'P'):
        rgb_img = Image.new('RGB', img.size, (255, 255, 255))
        rgb_img.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
        img = rgb_img
    
    # Save dengan compression quality 70 (background bisa lebih rendah)
    img.save(img_path, 'JPEG', quality=70, optimize=True)
    
    new_size = os.path.getsize(img_path) / 1024  # KB
    reduction = ((original_size - new_size) / original_size) * 100 if original_size > 0 else 0
    
    print(f"✓ Background compressed: {original_size:.0f}KB → {new_size:.0f}KB ({reduction:.0f}% smaller)")
else:
    print("✗ Background file not found")
