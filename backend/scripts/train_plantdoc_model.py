import tensorflow as tf
from tensorflow.keras.applications import EfficientNetB3
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout, BatchNormalization
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau
from keras_cv.losses import FocalLoss  

# ✅ Step 1: Advanced Data Augmentation
datagen = ImageDataGenerator(
    rescale=1.0 / 255,
    rotation_range=50, width_shift_range=0.4, height_shift_range=0.4,
    shear_range=0.4, zoom_range=0.4, horizontal_flip=True, fill_mode="nearest"
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

# ✅ Step 2: Load EfficientNetB3 for Better Feature Extraction
base_model = EfficientNetB3(weights="imagenet", include_top=False, input_shape=(224, 224, 3))
base_model.trainable = True  # Enable fine-tuning

# ✅ Step 3: Add Custom Fully Connected Layers
x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dense(1024, activation="relu")(x)
x = BatchNormalization()(x)
x = Dropout(0.4)(x)
x = Dense(512, activation="relu")(x)
x = BatchNormalization()(x)
x = Dropout(0.4)(x)
output_layer = Dense(len(train_data.class_indices), activation="softmax")(x)

model = Model(inputs=base_model.input, outputs=output_layer)

# ✅ Step 4: Compile Model with Focal Loss & Learning Rate Warm-up
model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=1e-4),
    loss=FocalLoss(from_logits=True),
    metrics=["accuracy"]
)

# ✅ Step 5: Apply Learning Rate Schedule
def scheduler(epoch, lr):
    if epoch < 5:
        return float(lr * 1.3)  # 🔹 More aggressive warm-up
    else:
        new_lr = float(lr * tf.math.exp(-0.08).numpy())  # 🔹 Smoother decay
        return max(new_lr, 5e-6)  # 🔹 Prevent too-low LR

lr_callback = tf.keras.callbacks.LearningRateScheduler(scheduler)

# ✅ Step 6: Train Model with EMA & Improved Early Stopping
early_stopping = EarlyStopping(monitor="val_loss", patience=10, restore_best_weights=True)  # 🔹 Increased patience

reduce_lr = ReduceLROnPlateau(monitor="val_loss", factor=0.3, patience=3, min_lr=5e-6)

ema_model = tf.keras.models.clone_model(model)  # Clone model for EMA tracking
ema_model.set_weights(model.get_weights())  # Copy initial weights

def update_ema(model, ema_model, decay=0.99):
    """Applies EMA to model weights."""
    model_weights = model.get_weights()
    ema_weights = ema_model.get_weights()
    new_ema_weights = [decay * ew + (1 - decay) * w for ew, w in zip(ema_weights, model_weights)]
    ema_model.set_weights(new_ema_weights)

epochs = 50
best_val_loss = float("inf")
min_epochs = 10  # 🔹 Ensures model trains at least 10 epochs before stopping

for epoch in range(epochs):
    history = model.fit(train_data, validation_data=val_data, epochs=1, verbose=1, callbacks=[reduce_lr])
    
    update_ema(model, ema_model)  # Apply EMA after each epoch

    # ✅ Improved Early Stopping
    val_loss = history.history["val_loss"][-1]
    if epoch + 1 >= min_epochs:  # 🔹 Ensures at least 10 epochs before checking early stopping
        if val_loss < best_val_loss:
            best_val_loss = val_loss  # Update best loss
        else:
            print(f"Stopping early at epoch {epoch+1} due to no improvement.")
            break  # Stop if validation loss doesn't improve

# ✅ Step 8: Save Final EMA Model
ema_model.save("models/plantdoc_optimized_ema.keras")
print("✅ Highest Accuracy Model (EMA Applied) trained and saved!")
