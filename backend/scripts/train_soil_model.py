import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import os

# Paths
DATA_DIR = r"D:\Bunny\AgriSync\backend\Soil"
TRAIN_DIR = os.path.join(DATA_DIR, "train")
TEST_DIR = os.path.join(DATA_DIR, "test")
IMG_SIZE = (180, 180)
BATCH_SIZE = 32
MODEL_PATH = r"D:\Bunny\AgriSync\backend\models\soil_classifier.keras"

# ✅ Safe loader function
def safe_load_dataset(directory):
    try:
        dataset = tf.keras.preprocessing.image_dataset_from_directory(
            directory,
            image_size=IMG_SIZE,
            batch_size=BATCH_SIZE,
            label_mode='categorical'
        )
        dataset = dataset.cache().prefetch(buffer_size=tf.data.AUTOTUNE)
        print(f"✅ Loaded dataset from: {directory}")
        return dataset
    except Exception as e:
        print(f"❌ Error loading dataset from {directory}: {e}")
        return None

# ✅ Load training & test data
print("🔍 Loading training data...")
train_ds = safe_load_dataset(TRAIN_DIR)

print("🔍 Loading test data...")
val_ds = safe_load_dataset(TEST_DIR)

# ✅ Detect class names
class_names = sorted(os.listdir(TRAIN_DIR))
print(f"✅ Detected classes: {class_names}")

# ✅ Build model
model = keras.Sequential([
    layers.Input(shape=(180, 180, 3)),
    layers.Rescaling(1./255),
    layers.Conv2D(32, 3, activation='relu'),
    layers.MaxPooling2D(),
    layers.Conv2D(64, 3, activation='relu'),
    layers.MaxPooling2D(),
    layers.Conv2D(128, 3, activation='relu'),
    layers.MaxPooling2D(),
    layers.Flatten(),
    layers.Dense(128, activation='relu'),
    layers.Dense(len(class_names), activation='softmax')
])

model.compile(
    optimizer='adam',
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

# ✅ Train model
print("🚀 Training model...")
history = model.fit(train_ds, validation_data=val_ds, epochs=10)

# ✅ Save model
model.save(MODEL_PATH)
print(f"✅ Model saved successfully at {MODEL_PATH}")
