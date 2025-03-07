import tensorflow as tf
from tensorflow.keras.applications import EfficientNetB3
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout, BatchNormalization
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau

# ✅ Step 1: **Advanced Data Augmentation**
datagen = ImageDataGenerator(
    rescale=1.0 / 255,
    rotation_range=60,  # More aggressive rotation
    width_shift_range=0.5,
    height_shift_range=0.5,
    shear_range=0.5,
    zoom_range=0.5,
    horizontal_flip=True,
    fill_mode="nearest"
)

train_data = datagen.flow_from_directory(
    directory="PlantDoc-Dataset/train",
    target_size=(224, 224),
    batch_size=32,
    class_mode="categorical"
)

val_data = ImageDataGenerator(rescale=1.0 / 255).flow_from_directory(
    directory="PlantDoc-Dataset/test",
    target_size=(224, 224),
    batch_size=32,
    class_mode="categorical"
)

# ✅ Step 2: **Load EfficientNetB3 for Better Feature Extraction**
base_model = EfficientNetB3(weights="imagenet", include_top=False, input_shape=(224, 224, 3))
base_model.trainable = True  # Unfreeze all layers for full fine-tuning

# ✅ Step 3: **Add Custom Fully Connected Layers**
x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dense(1024, activation="relu")(x)
x = BatchNormalization()(x)
x = Dropout(0.5)(x)  # Higher dropout to prevent overfitting
x = Dense(512, activation="relu")(x)
x = BatchNormalization()(x)
x = Dropout(0.5)(x)
output_layer = Dense(len(train_data.class_indices), activation="softmax")(x)

model = Model(inputs=base_model.input, outputs=output_layer)

# ✅ Step 4: **Compile Model with Cyclical Learning Rate**
model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=1e-4),
    loss="categorical_crossentropy",
    metrics=["accuracy"]
)

# ✅ Step 5: **Use Cyclical Learning Rate for Better Convergence**
def cyclical_lr(epoch):
    """Cyclical Learning Rate (CLR) for better convergence"""
    base_lr = 1e-5
    max_lr = 1e-3
    cycle = 10
    return base_lr + (max_lr - base_lr) * max(0, (1 - epoch / cycle))

lr_callback = tf.keras.callbacks.LearningRateScheduler(cyclical_lr)

# ✅ Step 6: **Train Model with Higher Patience**
early_stopping = EarlyStopping(monitor="val_loss", patience=12, restore_best_weights=True)
reduce_lr = ReduceLROnPlateau(monitor="val_loss", factor=0.5, patience=6, min_lr=5e-6)

# ✅ Step 7: **Train for 50 Full Epochs**
model.fit(
    train_data,
    validation_data=val_data,
    epochs=50,  # Increased epochs
    callbacks=[early_stopping, reduce_lr, lr_callback]
)

# ✅ Step 8: **Save Final Model**
model.save("models/plantdoc_optimized_v2.keras")
print("✅ Highest Accuracy Model (Final Version) trained and saved!")
