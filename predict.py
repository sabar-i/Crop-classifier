from PIL import Image
from io import BytesIO
import numpy as np
import tensorflow as tf
from keras.models import load_model



input_size=(256,256)


def read_imagefile(img):
    image = np.array(Image.open(BytesIO(img)))
    return image

def preprocess(image: Image.Image):
    resize = tf.image.resize(image, input_size)
    image = resize.numpy()
    image = np.expand_dims(image/255,0)
    return image
    
def loadmodel():
    modelpath="augmentede-15.keras"
    model=load_model(modelpath)
    return model

model=loadmodel()
def predict(image:np.ndarray):
    result = model.predict(image)[0]
    return result
