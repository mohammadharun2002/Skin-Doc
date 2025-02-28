import os
from flask_cors import CORS  # Import CORS
import cv2
import numpy as np
from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
from tensorflow.keras.applications import VGG19

app = Flask(__name__)
CORS(app)
model = load_model("skin_disease_model.h5", compile=False)
categories = [
    "Acne",
    "Eczema",
    "Hair Loss, Alopecia",
    "Nail Fungus",
    "Scabies",
]
vgg_model = VGG19(weights="imagenet", include_top=False, input_shape=(180, 180, 3))
for layer in vgg_model.layers:
    layer.trainable = False

def preprocess_image(image):
    img = cv2.imdecode(np.frombuffer(image.read(), np.uint8), cv2.IMREAD_COLOR)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = cv2.resize(img, (180, 180)) / 255.0
    img = np.expand_dims(img, axis=0)
    img_features = vgg_model.predict(img)
    img_features = img_features.reshape(1, -1)
    return img_features

@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    file = request.files["file"]
    img_features = preprocess_image(file)
    prediction = model.predict(img_features)[0]
    predicted_class = np.argmax(prediction)
    confidence = round(np.max(prediction) * 100, 2)
    return jsonify({"disease": categories[predicted_class], "confidence": confidence})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
