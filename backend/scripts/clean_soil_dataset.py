import os
from PIL import Image

BASE_PATH = r"D:\Bunny\AgriSync\backend\Soil"
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".bmp", ".gif"}

def is_valid_image(file_path):
    try:
        with Image.open(file_path) as img:
            img.convert("RGB")  # Try converting to RGB
        return True
    except Exception as e:
        return False

def clean_folder(folder_path):
    for root, _, files in os.walk(folder_path):
        for file in files:
            ext = os.path.splitext(file)[1].lower()
            full_path = os.path.join(root, file)

            # Check if extension is valid
            if ext not in ALLOWED_EXTENSIONS:
                print(f"❌ Removing unsupported file: {file}")
                os.remove(full_path)
                continue

            # Check if file is a readable image
            if not is_valid_image(full_path):
                print(f"⚠️ Removing corrupted or fake image: {file}")
                os.remove(full_path)

if __name__ == "__main__":
    print("🧹 Cleaning training data...")
    clean_folder(os.path.join(BASE_PATH, "train"))

    print("🧹 Cleaning testing data...")
    clean_folder(os.path.join(BASE_PATH, "test"))

    print("✅ Dataset fully cleaned and validated!")
