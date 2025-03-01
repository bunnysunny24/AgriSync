import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout
import preprocess_plantdoc  # Import the preprocessed dataset

# Build CNN Model
model = Sequential([
    Conv2D(32, (3, 3), activation="relu", input_shape=(128, 128, 3)),
    MaxPooling2D(2, 2),
    Conv2D(64, (3, 3), activation="relu"),
    MaxPooling2D(2, 2),
    Flatten(),
    Dense(128, activation="relu"),
    Dropout(0.5),
    Dense(len(preprocess_plantdoc.train_data.class_indices), activation="softmax")  # Output layer for diseases
])

# Compile Model
model.compile(optimizer="adam", loss="categorical_crossentropy", metrics=["accuracy"])

# Train Model
model.fit(preprocess_plantdoc.train_data, validation_data=preprocess_plantdoc.val_data, epochs=10)

# Save Model
model.save("models/plantdoc_model.h5")
print("✅ Model trained and saved!")
