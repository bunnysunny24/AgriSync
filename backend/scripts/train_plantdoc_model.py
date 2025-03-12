import tensorflow as tf
from tensorflow.keras.applications import EfficientNetB4
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout, BatchNormalization
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau


datagen = ImageDataGenerator(
    rescale=1.0 / 255,
    rotation_range=60, width_shift_range=0.5, height_shift_range=0.5,
    shear_range=0.5, zoom_range=0.5, horizontal_flip=True, fill_mode="nearest"
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


base_model = EfficientNetB4(weights="imagenet", include_top=False, input_shape=(224, 224, 3))
base_model.trainable = True  

x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dense(1024, activation="relu")(x)
x = BatchNormalization()(x)
x = Dropout(0.5)(x)  
x = Dense(512, activation="relu")(x)
x = BatchNormalization()(x)
x = Dropout(0.5)(x)
output_layer = Dense(len(train_data.class_indices), activation="softmax")(x)

model = Model(inputs=base_model.input, outputs=output_layer)

model.compile(
    optimizer=tf.keras.optimizers.AdamW(learning_rate=3e-4),  
    loss=tf.keras.losses.CategoricalCrossentropy(label_smoothing=0.1), 
    metrics=["accuracy"]
)

def one_cycle_lr(epoch, lr):
    """One Cycle Learning Rate Policy for Better Training"""
    base_lr = 1e-5
    max_lr = 1e-3
    cycle = 20
    return base_lr + (max_lr - base_lr) * max(0, (1 - epoch / cycle))

lr_callback = tf.keras.callbacks.LearningRateScheduler(one_cycle_lr)

early_stopping = EarlyStopping(monitor="val_loss", patience=15, restore_best_weights=True)
reduce_lr = ReduceLROnPlateau(monitor="val_loss", factor=0.5, patience=6, min_lr=5e-6)

model.fit(
    train_data,
    validation_data=val_data,
    epochs=70, 
    callbacks=[early_stopping, reduce_lr, lr_callback]
)


model.save("models/plantdoc_best.keras")
print("✅ Highest Accuracy Model (Optimized) trained and saved!")