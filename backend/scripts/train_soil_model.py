import tensorflow as tf
from tensorflow.keras.applications import EfficientNetB4
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout, BatchNormalization
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau, LearningRateScheduler
import os, json

# Paths
DATA_DIR = r"D:\Bunny\AgriSync\backend\Soil"
TRAIN_DIR = os.path.join(DATA_DIR, "train")
TEST_DIR = os.path.join(DATA_DIR, "test")
MODEL_PATH = r"D:\Bunny\AgriSync\backend\models\soil_classifier_best.keras"
LABELS_PATH = r"D:\Bunny\AgriSync\backend\models\class_names.json"
IMG_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 70

# ✅ Get consistent class names and save them
class_names = sorted(os.listdir(TRAIN_DIR))
with open(LABELS_PATH, 'w') as f:
    json.dump(class_names, f)
print("✅ Class names saved:", class_names)

# ✅ Data augmentation
train_datagen = ImageDataGenerator(
    rescale=1.0 / 255,
    rotation_range=60,
    width_shift_range=0.5,
    height_shift_range=0.5,
    shear_range=0.5,
    zoom_range=0.5,
    horizontal_flip=True,
    fill_mode="nearest"
)

val_datagen = ImageDataGenerator(rescale=1.0 / 255)

train_data = train_datagen.flow_from_directory(
    directory=TRAIN_DIR,
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode="categorical"
)

val_data = val_datagen.flow_from_directory(
    directory=TEST_DIR,
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode="categorical"
)

# ✅ Build model using EfficientNetB4
base_model = EfficientNetB4(weights="imagenet", include_top=False, input_shape=(224, 224, 3))
base_model.trainable = True  # Fine-tune entire model

x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dense(1024, activation="relu")(x)
x = BatchNormalization()(x)
x = Dropout(0.5)(x)
x = Dense(512, activation="relu")(x)
x = BatchNormalization()(x)
x = Dropout(0.5)(x)
output_layer = Dense(len(class_names), activation="softmax")(x)

model = Model(inputs=base_model.input, outputs=output_layer)

# ✅ Compile
model.compile(
    optimizer=tf.keras.optimizers.AdamW(learning_rate=3e-4),
    loss=tf.keras.losses.CategoricalCrossentropy(label_smoothing=0.1),
    metrics=["accuracy"]
)

# ✅ Callbacks
def one_cycle_lr(epoch, lr):
    base_lr = 1e-5
    max_lr = 1e-3
    cycle = 20
    return base_lr + (max_lr - base_lr) * max(0, (1 - epoch / cycle))

early_stopping = EarlyStopping(monitor="val_loss", patience=15, restore_best_weights=True)
reduce_lr = ReduceLROnPlateau(monitor="val_loss", factor=0.5, patience=6, min_lr=5e-6)
lr_callback = LearningRateScheduler(one_cycle_lr)

# ✅ Train
print("🚀 Training EfficientNetB4 model on Soil dataset...")
model.fit(
    train_data,
    validation_data=val_data,
    epochs=EPOCHS,
    callbacks=[early_stopping, reduce_lr, lr_callback]
)

# ✅ Save model
model.save(MODEL_PATH)
print(f"✅ EfficientNetB4 Soil Classifier saved at: {MODEL_PATH}")
