import os
from PIL import Image

# Only allow actual image formats TensorFlow supports
ALLOWED_FORMATS = ["JPEG", "PNG", "BMP", "GIF"]

def deeply_validate_image(file_path):
    try:
        with Image.open(file_path) as img:
            img.verify()  # Basic format check
            img.close()
        with Image.open(file_path) as img:
            img.load()    # Try actually loading pixels (some fail here)
            if img.format not in ALLOWED_FORMATS:
                return False
        return True
    except Exception as e:
        return False

def clean_directory(folder_path):
    print(f"\n🔍 Scanning {folder_path}")
    removed = 0
    for root, _, files in os.walk(folder_path):
        for file in files:
            file_path = os.path.join(root, file)
            if not deeply_validate_image(file_path):
                print(f"❌ Removing: {file_path}")
                os.remove(file_path)
                removed += 1
    if removed == 0:
        print("✅ No invalid images found.")
    else:
        print(f"✅ Removed {removed} invalid images.")

if __name__ == "__main__":
    BASE_DIR = r"D:\Bunny\AgriSync\backend\Soil"
    for folder in ["train", "test"]:
        clean_directory(os.path.join(BASE_DIR, folder))
