
import io
import numpy as np
from PIL import Image
import tensorflow as tf

def preprocess_image_bytes(contents, img_size=(224,224)):
    img = Image.open(io.BytesIO(contents)).convert("RGB")
    img = img.resize((img_size[0], img_size[1]), Image.BILINEAR)
    arr = np.array(img).astype("float32")
    return tf.keras.applications.efficientnet.preprocess_input(arr)

def encode_metadata(age_input, sex_input, site_input, artifacts):
    sex2idx = artifacts.get("sex2idx", {"male":0,"female":1,"unknown":2})
    site2idx = artifacts.get("site2idx", {"other":0})
    age_mean = float(artifacts.get("age_mean",60))
    age_std = float(artifacts.get("age_std",16))

    try:
        age = float(age_input)
    except:
        age = age_mean
    age_norm = (age - age_mean) / (age_std if age_std!=0 else 1)

    s = str(sex_input).lower()
    if s in ["f","female","mujer"]:
        s="female"
    elif s in ["m","male","hombre"]:
        s="male"
    sex_idx = sex2idx.get(s, sex2idx.get("unknown",0))
    sex_ohe = [0.0]*len(sex2idx)
    sex_ohe[int(sex_idx)] = 1.0

    site_str = str(site_input)
    site_idx = site2idx.get(site_str, site2idx.get("other",0))

    return age_norm, sex_ohe, int(site_idx)
