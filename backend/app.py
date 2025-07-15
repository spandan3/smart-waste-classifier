from flask import Flask, request, jsonify
from flask_cors import CORS
from fastai.vision.all import load_learner, PILImage
import io
import pathlib
import os

pathlib.WindowsPath = pathlib.PosixPath
# Config
MODEL_PATH = os.path.abspath("model/export.pkl")

# Init Flask
app = Flask(__name__)
CORS(app)

# Load Fastai model
learn = load_learner(MODEL_PATH)

@app.route("/classify", methods=["POST"])
def classify_image():
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files['file']
    img_bytes = file.read()
    img = PILImage.create(io.BytesIO(img_bytes))

    pred_class, pred_idx, probs = learn.predict(img)
    confidence = float(probs[pred_idx]) * 100

    #print({
    #"class": str(pred_class),
    #"confidence": round(float(probs[pred_idx]) * 100, 2)
    #})

    return jsonify({"class": str(pred_class), "confidence": round(confidence, 2)})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
