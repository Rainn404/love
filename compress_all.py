#!/usr/bin/env python3
"""
Compress all JPG images in the img folder while maintaining quality
"""

from PIL import Image
import os
from pathlib import Path

def compress_image(image_path, quality=75, max_width=1200):
    """
    Compress a single image
    
    Args:
        image_path: Path to the image file
        quality: JPEG quality (1-100)
        max_width: Maximum width for resizing (optional)
    """
    try:
        img = Image.open(image_path)
        
        # Get original size
        original_size = os.path.getsize(image_path) / 1024  # KB
        
        # Resize if too large (maintain aspect ratio)
        if img.width > max_width:
            ratio = max_width / img.width
            new_height = int(img.height * ratio)
            img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
        
        # Convert RGBA to RGB if needed
        if img.mode in ('RGBA', 'LA', 'P'):
            rgb_img = Image.new('RGB', img.size, (255, 255, 255))
            rgb_img.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
            img = rgb_img
        
        # Save with compression
        img.save(image_path, 'JPEG', quality=quality, optimize=True)
        
        # Get new size
        new_size = os.path.getsize(image_path) / 1024  # KB
        reduction = ((original_size - new_size) / original_size) * 100
        
        print(f"✓ {Path(image_path).name} | {original_size:.0f}KB → {new_size:.0f}KB ({reduction:.0f}% smaller)")
        
        return new_size
    except Exception as e:
        print(f"✗ Error processing {image_path}: {e}")
        return None

# Main execution
if __name__ == '__main__':
    img_dir = Path('img')
    jpg_files = list(img_dir.glob('*.jpg'))
    jpg_files.extend(img_dir.glob('*.JPG'))
    
    if not jpg_files:
        print("No JPG files found in img/ directory")
        exit(1)
    
    print(f"Found {len(jpg_files)} JPG files to compress...\n")
    
    total_original = 0
    total_compressed = 0
    
    for jpg_file in sorted(jpg_files):
        original_size = os.path.getsize(jpg_file) / 1024
        total_original += original_size
        
        compressed_size = compress_image(jpg_file, quality=75, max_width=1200)
        if compressed_size:
            total_compressed += compressed_size
    
    total_reduction = total_original - total_compressed
    reduction_percent = (total_reduction / total_original) * 100 if total_original > 0 else 0
    
    print(f"\n{'='*60}")
    print(f"Total: {total_original:.0f}KB → {total_compressed:.0f}KB")
    print(f"Saved: {total_reduction:.0f}KB ({reduction_percent:.0f}% smaller)")
    print(f"{'='*60}")
