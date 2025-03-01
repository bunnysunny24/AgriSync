import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau
import preprocess_plantdoc  # Load dataset

# Load Pre-trained MobileNetV2
base_model = MobileNetV2(weights="imagenet", include_top=False, input_shape=(128, 128, 3))
base_model.trainable = False  # Freeze pre-trained layers

# Add Custom Layers (Fix: Use base_model.output)
x = GlobalAveragePooling2D()(base_model.output)
x = Dense(128, activation="relu")(x)
x = Dropout(0.3)(x)  # Helps reduce overfitting
outputs = Dense(len(preprocess_plantdoc.train_data.class_indices), activation="softmax")(x)

# Fix: Ensure outputs are KerasTensors
model = Model(inputs=base_model.input, outputs=outputs)

# Compile Model
model.compile(optimizer="adam", loss="categorical_crossentropy", metrics=["accuracy"])

# Define Callbacks
early_stopping = EarlyStopping(monitor="val_loss", patience=5, restore_best_weights=True)
reduce_lr = ReduceLROnPlateau(monitor="val_loss", factor=0.2, patience=3, min_lr=1e-5)

# Train Model
model.fit(
    preprocess_plantdoc.train_data,
    validation_data=preprocess_plantdoc.val_data,
    epochs=15,
    callbacks=[early_stopping, reduce_lr]
)

# Save Model
model.save("models/plantdoc_mobilenet.keras")
print("✅ Model trained using MobileNetV2 and saved!")
