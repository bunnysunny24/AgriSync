from tensorflow.keras.preprocessing.image import ImageDataGenerator

# Add Data Augmentation
train_datagen = ImageDataGenerator(
    rescale=1.0/255,
    rotation_range=30,  # Randomly rotate images
    width_shift_range=0.2,  # Shift images horizontally
    height_shift_range=0.2,  # Shift images vertically
    shear_range=0.2,  # Shear transformation
    zoom_range=0.2,  # Random zoom
    horizontal_flip=True,  # Flip images horizontally
    fill_mode="nearest"
)

val_datagen = ImageDataGenerator(rescale=1.0/255)  # Only rescale validation images

# Load Train & Validation Data
train_data = train_datagen.flow_from_directory(
    "PlantDoc-Dataset/train", target_size=(224, 224), batch_size=32, class_mode="categorical"
)
val_data = val_datagen.flow_from_directory(
    "PlantDoc-Dataset/test", target_size=(224, 224), batch_size=32, class_mode="categorical"
)
