import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout
import os

# Define paths
DATASET_PATH = "data/crop_images"

# Data Augmentation
datagen = ImageDataGenerator(rescale=1.0/255, validation_split=0.2)

# Load dataset
train_data = datagen.flow_from_directory(
    DATASET_PATH, target_size=(128, 128), batch_size=32, class_mode="categorical", subset="training"
)
val_data = datagen.flow_from_directory(
    DATASET_PATH, target_size=(128, 128), batch_size=32, class_mode="categorical", subset="validation"
)

# Build CNN Model
model = Sequential([
    Conv2D(32, (3, 3), activation="relu", input_shape=(128, 128, 3)),
    MaxPooling2D(2, 2),
    Conv2D(64, (3, 3), activation="relu"),
    MaxPooling2D(2, 2),
    Flatten(),
    Dense(128, activation="relu"),
    Dropout(0.5),
    Dense(train_data.num_classes, activation="softmax")
])

# Compile Model
model.compile(optimizer="adam", loss="categorical_crossentropy", metrics=["accuracy"])

# Train Model
model.fit(train_data, validation_data=val_data, epochs=10)

# Save Model
model.save("models/crop_model.h5")
print("✅ Model trained and saved as 'models/crop_model.h5'")
