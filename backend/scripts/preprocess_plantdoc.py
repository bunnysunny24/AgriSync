from tensorflow.keras.preprocessing.image import ImageDataGenerator


train_datagen = ImageDataGenerator(
    rescale=1.0/255,
    rotation_range=30,  
    width_shift_range=0.2,  
    height_shift_range=0.2,  
    shear_range=0.2,  
    zoom_range=0.2, 
    horizontal_flip=True,  
    fill_mode="nearest"
)

val_datagen = ImageDataGenerator(rescale=1.0/255)  # Only rescale validation images


train_data = train_datagen.flow_from_directory(
    "PlantDoc-Dataset/train", target_size=(224, 224), batch_size=32, class_mode="categorical"
)
val_data = val_datagen.flow_from_directory(
    "PlantDoc-Dataset/test", target_size=(224, 224), batch_size=32, class_mode="categorical"
)
