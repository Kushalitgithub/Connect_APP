#!/usr/bin/env python3
"""
Script to create app icon derivatives from the logo.
"""
import os
from PIL import Image

def create_icons():
    # Source logo
    logo_path = "/home/kushal/Documents/Connect/shared/assets/branding/logo_connect.png"

    # Create directories for different platforms
    ios_dir = "/home/kushal/Documents/Connect/shared/assets/branding/ios"
    android_dir = "/home/kushal/Documents/Connect/shared/assets/branding/android"

    os.makedirs(ios_dir, exist_ok=True)
    os.makedirs(android_dir, exist_ok=True)

    # Open the source image
    with Image.open(logo_path) as img:
        # iOS icon sizes (App Store, Settings, Spotlight, etc.)
        ios_sizes = [20, 29, 40, 58, 60, 76, 80, 87, 120, 152, 167, 180, 1024]
        for size in ios_sizes:
            # Create a square image
            icon = img.resize((size, size), Image.Resampling.LANCZOS)
            icon.save(os.path.join(ios_dir, f"icon_{size}.png"))

        # Android icon sizes (mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi)
        # Base size for mdpi is 48px
        android_sizes = {
            "mdpi": 48,
            "hdpi": 72,
            "xhdpi": 96,
            "xxhdpi": 144,
            "xxxhdpi": 192
        }
        for density, size in android_sizes.items():
            density_dir = os.path.join(android_dir, f"mipmap-{density}")
            os.makedirs(density_dir, exist_ok=True)
            icon = img.resize((size, size), Image.Resampling.LANCZOS)
            icon.save(os.path.join(density_dir, "ic_launcher.png"))

            # Also create round icon versions
            round_dir = os.path.join(android_dir, f"mipmap-{density}_round")
            os.makedirs(round_dir, exist_ok=True)
            # For round icons, we could mask to a circle, but for simplicity we'll just use the same
            icon.save(os.path.join(round_dir, "ic_launcher_round.png"))

if __name__ == "__main__":
    create_icons()
    print("Icon derivatives created successfully!")