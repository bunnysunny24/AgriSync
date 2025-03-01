import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator

# Define dataset paths
TRAIN_DIR = "PlantDoc-Dataset/train"
TEST_DIR = "PlantDoc-Dataset/test"

# Image preprocessing & augmentation
datagen = ImageDataGenerator(
    rescale=1.0/255,  # Normalize pixel values
    validation_split=0.2,  # 80% training, 20% validation split
)

# Load training images
train_data = datagen.flow_from_directory(
    TRAIN_DIR,
    target_size=(128, 128),
    batch_size=32,
    class_mode="categorical",
    subset="training"
)

# Load validation images
val_data = datagen.flow_from_directory(
    TRAIN_DIR,
    target_size=(128, 128),
    batch_size=32,
    class_mode="categorical",
    subset="validation"
)

print(f"✅ Data loaded! Classes: {train_data.class_indices}")
