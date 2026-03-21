"""
Yupoo Album Image Scraper
Scrapes all images from a password-protected Yupoo album.
"""

import os
import sys
import requests
import json
import re
import time


def scrape_yupoo_album(album_url, password=None, output_dir="downloaded_images"):
    """
    Scrape all images from a Yupoo album.

    Args:
        album_url: Full Yupoo album URL (e.g. https://user.x.yupoo.com/albums/12345?uid=1)
        password: Album password (if protected)
        output_dir: Directory to save downloaded images
    """
    # Parse the URL to extract owner and album ID
    match = re.match(r'https?://(\w+)\.x\.yupoo\.com/albums/(\d+)', album_url)
    if not match:
        print(f"Error: Invalid Yupoo album URL: {album_url}")
        sys.exit(1)

    owner = match.group(1)
    album_id = match.group(2)
    base_url = f"https://{owner}.x.yupoo.com"

    print(f"Owner: {owner}")
    print(f"Album ID: {album_id}")

    session = requests.Session()
    session.headers.update({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'Referer': f'{base_url}/',
    })

    # Authenticate if password provided
    if password:
        print(f"Authenticating with password...")
        auth_resp = session.get(f"{base_url}/api/web/users/{owner}?password={password}")
        auth_data = auth_resp.json()
        if not auth_data.get("data", {}).get("passwordValid"):
            print("Error: Invalid password!")
            sys.exit(1)
        print("Authentication successful!")

    # Fetch album photos
    print(f"\nFetching album photos...")
    params = "uid=1"
    if password:
        params += f"&password={password}"

    album_resp = session.get(f"{base_url}/api/web/albums/{album_id}/show?{params}")
    if album_resp.status_code != 200:
        print(f"Error: Failed to fetch album (status {album_resp.status_code})")
        sys.exit(1)

    album_data = album_resp.json()
    photos = album_data.get("data", {}).get("list", [])
    total = len(photos)

    if total == 0:
        print("No photos found in this album.")
        return

    print(f"Found {total} photos in album")

    # Create output directory
    os.makedirs(output_dir, exist_ok=True)

    # Download each photo
    image_origin = "https://photo.yupoo.com"
    downloaded = 0
    failed = 0

    for i, photo in enumerate(photos, 1):
        url = f"{image_origin}{photo['path']}"
        filename = photo.get("name", f"photo_{i}.jpg")
        filepath = os.path.join(output_dir, filename)

        width = photo.get("attribute", {}).get("width", "?")
        height = photo.get("attribute", {}).get("height", "?")

        print(f"[{i}/{total}] Downloading {filename} ({width}x{height})...", end=" ")

        try:
            img_resp = session.get(url, timeout=30)
            if img_resp.status_code == 200:
                with open(filepath, "wb") as f:
                    f.write(img_resp.content)
                size_kb = len(img_resp.content) / 1024
                print(f"OK ({size_kb:.1f} KB)")
                downloaded += 1
            else:
                print(f"FAILED (status {img_resp.status_code})")
                failed += 1
        except Exception as e:
            print(f"FAILED ({e})")
            failed += 1

        # Small delay to be polite
        time.sleep(0.2)

    print(f"\nDone! Downloaded: {downloaded}, Failed: {failed}")
    print(f"Images saved to: {os.path.abspath(output_dir)}")


if __name__ == "__main__":
    album_url = "https://tianlong980120.x.yupoo.com/albums/215835189?uid=1"
    password = "000003"

    scrape_yupoo_album(album_url, password=password)
