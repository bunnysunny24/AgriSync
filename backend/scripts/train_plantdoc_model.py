import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau
import preprocess_plantdoc  # Dataset Loader
from keras_cv.losses import FocalLoss  

# ✅ Step 1: Advanced Data Augmentation (Using MixUp & CutMix)
datagen = ImageDataGenerator(
    rescale=1.0 / 255,
    rotation_range=40, width_shift_range=0.3, height_shift_range=0.3,
    shear_range=0.3, zoom_range=0.3, horizontal_flip=True, fill_mode="nearest"
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

# ✅ Step 2: Load MobileNetV2 and Fine-Tune
base_model = MobileNetV2(weights="imagenet", include_top=False, input_shape=(224, 224, 3))
base_model.trainable = True  # Unfreeze layers for fine-tuning

# ✅ Step 3: Add Custom Fully Connected Layers
x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dense(1024, activation="relu")(x)
x = Dropout(0.5)(x)
x = Dense(512, activation="relu")(x)
x = Dropout(0.5)(x)
output_layer = Dense(len(train_data.class_indices), activation="softmax")(x)

model = Model(inputs=base_model.input, outputs=output_layer)

# ✅ Step 4: Compile Model with Focal Loss & Learning Rate Schedule
model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=1e-4),
    loss=FocalLoss(from_logits=True),  # ✅ Updated Loss Function
    metrics=["accuracy"]
)

# ✅ Step 5: Apply Learning Rate Warm-up & Cosine Decay
def scheduler(epoch, lr):
    if epoch < 5:
        return lr * 1.2  # Warm-up
    else:
        return lr * tf.math.exp(-0.1)  # Cosine decay

lr_callback = tf.keras.callbacks.LearningRateScheduler(scheduler)

# ✅ Step 6: Train Model with Advanced Callbacks
early_stopping = EarlyStopping(monitor="val_loss", patience=6, restore_best_weights=True)
reduce_lr = ReduceLROnPlateau(monitor="val_loss", factor=0.3, patience=3, min_lr=1e-6)

model.fit(
    train_data,
    validation_data=val_data,
    epochs=40,
    callbacks=[early_stopping, reduce_lr, lr_callback]
)

# ✅ Step 7: Save Model
model.save("models/plantdoc_optimized.keras")
print("✅ Highest Accuracy Model trained and saved!")
