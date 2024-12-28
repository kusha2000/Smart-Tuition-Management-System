from flask import Flask, request, jsonify
import os
import cv2
import pickle
import numpy as np
from sklearn.neighbors import KNeighborsClassifier

app = Flask(__name__)

UPLOAD_FOLDER = './uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


with open('Face_Recognize_Model/data/names.pkl', 'rb') as w:
    LABELS = pickle.load(w)
with open('Face_Recognize_Model/data/faces_data.pkl', 'rb') as f:
    FACES = pickle.load(f)

print('Shape of Faces matrix --> ', FACES.shape)

knn = KNeighborsClassifier(n_neighbors=5)
knn.fit(FACES, LABELS)

facedetect = cv2.CascadeClassifier('Face_Recognize_Model/data/haarcascade_frontalface_default.xml')

if facedetect.empty():
    raise RuntimeError("Haar cascade file not loaded properly!")

def predict_from_image(image_path):
    try:
        print(f"Reading image from {image_path}")
        image = cv2.imread(image_path)
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        print("Detecting faces...")
        faces = facedetect.detectMultiScale(gray, 1.3, 5)
        print(f"Detected faces: {len(faces)}")

        if len(faces) == 0:
            return "No faces detected"

        for (x, y, w, h) in faces:
            crop_img = image[y:y+h, x:x+w]
            resized_img = cv2.resize(crop_img, (50, 50)).flatten().reshape(1, -1)
            output = knn.predict(resized_img)
            print(f"Prediction: {output[0]}")
            return str(output[0]) 
    except Exception as e:
        print(f"Error during prediction: {e}")
        return None

@app.route('/check_faces', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)

    predicted_name = predict_from_image(filepath)
    if predicted_name == "No faces detected":
        return jsonify({'message': f'File {file.filename} uploaded successfully!',
                        'error': 'No faces detected in the image.'}), 600
    elif predicted_name:
        return jsonify(predicted_name), 200
    else:
        return jsonify({'message': f'File {file.filename} uploaded successfully!',
                        'error': 'Prediction failed due to an unknown error.'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
