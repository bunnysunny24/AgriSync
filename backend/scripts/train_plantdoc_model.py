import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau
import preprocess_plantdoc  # Load dataset

# ✅ Step 1: Data Augmentation (Fix: Filter Healthy Images Correctly)
HEALTHY_CLASSES = {"Apple leaf", "Tomato leaf", "Bell_pepper leaf", "Peach leaf", "Soyabean leaf", "Strawberry leaf", "Grape leaf"}

datagen = ImageDataGenerator(
    rescale=1.0 / 255,
    rotation_range=30, width_shift_range=0.2, height_shift_range=0.2,
    shear_range=0.2, zoom_range=0.2, horizontal_flip=True, fill_mode="nearest"
)

# ✅ Load the full dataset
full_train_data = preprocess_plantdoc.train_data

# ✅ Create a new directory iterator that **only loads healthy plant images**
healthy_train_data = datagen.flow_from_directory(
    directory="PlantDoc-Dataset/train",  # Path to dataset
    target_size=(224, 224),
    batch_size=32,
    class_mode="categorical",
    subset=None  # Don't use validation split
)

# ✅ Filter only healthy images
healthy_indices = [i for i, class_name in enumerate(full_train_data.class_indices) if class_name in HEALTHY_CLASSES]
healthy_train_data.classes = [c for c in full_train_data.classes if c in healthy_indices]

# ✅ Step 2: Load Pre-trained MobileNetV2 (Fix input shape 224x224)
base_model = MobileNetV2(weights="imagenet", include_top=False, input_shape=(224, 224, 3))
base_model.trainable = False  # Freeze pre-trained layers

# ✅ Step 3: Add Custom Layers with More Dropout
x = base_model.output
x = GlobalAveragePooling2D()(x)  # Retain important features
x = Dense(512, activation="relu")(x)
x = Dropout(0.6)(x)  # Increased dropout
x = Dense(256, activation="relu")(x)
x = Dropout(0.6)(x)  # Additional dropout layer
output_layer = Dense(len(preprocess_plantdoc.train_data.class_indices), activation="softmax")(x)

model = Model(inputs=base_model.input, outputs=output_layer)

# ✅ Step 4: Compile Model
model.compile(optimizer="adam", loss="categorical_crossentropy", metrics=["accuracy"])

# ✅ Step 5: Use ReduceLROnPlateau to Adjust Learning Rate
early_stopping = EarlyStopping(monitor="val_loss", patience=5, restore_best_weights=True)
reduce_lr = ReduceLROnPlateau(monitor="val_loss", factor=0.2, patience=3, min_lr=1e-5)

# ✅ Step 6: Train Model
model.fit(
    preprocess_plantdoc.train_data,
    validation_data=preprocess_plantdoc.val_data,
    epochs=25,  # Train longer for better accuracy
    callbacks=[early_stopping, reduce_lr]
)

# ✅ Step 7: Save Model
model.save("models/plantdoc_mobilenet.keras")
print("✅ Improved Model trained and saved!")
