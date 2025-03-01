import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau
import preprocess_plantdoc  # Load dataset

# Load Pre-trained MobileNetV2
# Change input shape to 224x224
base_model = MobileNetV2(weights="imagenet", include_top=False, input_shape=(224, 224, 3))
base_model.trainable = False  # Freeze pre-trained layers

# Add Custom Layers (Fixed: `output_layer` is defined correctly)
x = base_model.output
x = GlobalAveragePooling2D()(x)  # Helps retain important features
x = Dense(512, activation="relu")(x)
x = Dropout(0.5)(x)  # Increase dropout to prevent overfitting
x = Dense(256, activation="relu")(x)
x = Dropout(0.5)(x)  # Additional dropout layer
output_layer = Dense(len(preprocess_plantdoc.train_data.class_indices), activation="softmax")(x)

# ✅ Fix: Use `output_layer`
model = Model(inputs=base_model.input, outputs=output_layer)

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
