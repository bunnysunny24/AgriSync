import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import os
import json

# Paths
DATA_DIR = r"D:\Bunny\AgriSync\backend\Soil"
TRAIN_DIR = os.path.join(DATA_DIR, "train")
TEST_DIR = os.path.join(DATA_DIR, "test")
IMG_SIZE = (180, 180)
BATCH_SIZE = 32
EPOCHS = 30
MODEL_PATH = r"D:\Bunny\AgriSync\backend\models\soil_classifier.keras"
LABELS_PATH = r"D:\Bunny\AgriSync\backend\models\class_names.json"

# ✅ Get consistent class names (sorted by directory name)
class_names = sorted(os.listdir(TRAIN_DIR))
print("📊 Class Distribution:")
for class_name in class_names:
    folder = os.path.join(TRAIN_DIR, class_name)
    count = len(os.listdir(folder))
    print(f" - {class_name}: {count} images")

# ✅ Save class names for inference time
with open(LABELS_PATH, 'w') as f:
    json.dump(class_names, f)
print(f"✅ Class names saved to: {LABELS_PATH}")

# ✅ Load dataset
def safe_load_dataset(directory):
    try:
        dataset = tf.keras.preprocessing.image_dataset_from_directory(
            directory,
            image_size=IMG_SIZE,
            batch_size=BATCH_SIZE,
            label_mode='categorical',  # important for softmax output
            shuffle=True,
            seed=42
        )
        dataset = dataset.cache().prefetch(buffer_size=tf.data.AUTOTUNE)
        print(f"✅ Loaded dataset from: {directory}")
        return dataset
    except Exception as e:
        print(f"❌ Error loading dataset from {directory}: {e}")
        return None

print("🔍 Loading training data...")
train_ds = safe_load_dataset(TRAIN_DIR)

print("🔍 Loading test data...")
val_ds = safe_load_dataset(TEST_DIR)

# ✅ Data Augmentation
data_augmentation = keras.Sequential([
    layers.RandomFlip("horizontal_and_vertical"),
    layers.RandomRotation(0.2),
    layers.RandomZoom(0.1),
])

# ✅ Enhanced CNN Model
model = keras.Sequential([
    layers.Input(shape=(180, 180, 3)),
    data_augmentation,
    layers.Rescaling(1./255),

    layers.Conv2D(32, 3, padding='same', activation='relu'),
    layers.MaxPooling2D(),

    layers.Conv2D(64, 3, padding='same', activation='relu'),
    layers.MaxPooling2D(),

    layers.Conv2D(128, 3, padding='same', activation='relu'),
    layers.MaxPooling2D(),

    layers.Conv2D(256, 3, padding='same', activation='relu'),
    layers.MaxPooling2D(),

    layers.Flatten(),
    layers.Dense(256, activation='relu'),
    layers.Dropout(0.5),
    layers.Dense(len(class_names), activation='softmax')  # output layer for classification
])

model.compile(
    optimizer='adam',
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

# ✅ Train the model
print("🚀 Training model...")
history = model.fit(train_ds, validation_data=val_ds, epochs=EPOCHS)

# ✅ Save the trained model
model.save(MODEL_PATH)
print(f"✅ Model saved successfully at: {MODEL_PATH}")
