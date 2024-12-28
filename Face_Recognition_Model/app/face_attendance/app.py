from flask import Flask, request, jsonify
import os
import cv2
import pickle
import numpy as np
from sklearn.neighbors import KNeighborsClassifier

app = Flask(__name__)

UPLOAD_FOLDER = './uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def load_face_recognition_model():
    global knn, LABELS, FACES
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


load_face_recognition_model()

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

@app.route('/register_face', methods=['POST'])
def register_face():
    try:
        name = request.form['name']
        images = request.files.getlist('images')

        if not images:
            return jsonify({'error': 'No images provided'}), 400

        faces_data = []
        user_folder = os.path.join(UPLOAD_FOLDER, 'faces', name)
        os.makedirs(user_folder, exist_ok=True)

        for idx, file in enumerate(images):
            image = cv2.imdecode(np.frombuffer(file.read(), np.uint8), cv2.IMREAD_COLOR)

            if image is None:
                continue

            raw_image_path = os.path.join(user_folder, f"{name}_{idx + 1}.jpg")
            cv2.imwrite(raw_image_path, image)

            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            faces = facedetect.detectMultiScale(gray, 1.3, 5)

            if len(faces) > 0:
                for (x, y, w, h) in faces:
                    crop_img = image[y:y + h, x:x + w]
                    resized_img = cv2.resize(crop_img, (50, 50))
                    faces_data.append(resized_img)
                    break 
            else:
                faces_data.append(cv2.resize(image, (50, 50)))

        if len(faces_data) < 100:
            return jsonify({'error': f'Only {len(faces_data)} valid faces or images processed. At least 100 are required.'}), 400

        faces_data = np.asarray(faces_data[:100])
        faces_data = faces_data.reshape(100, -1)

        if 'names.pkl' not in os.listdir('Face_Recognize_Model/data/'):
            names = [name] * 100
            with open('Face_Recognize_Model/data/names.pkl', 'wb') as f:
                pickle.dump(names, f)
        else:
            with open('Face_Recognize_Model/data/names.pkl', 'rb') as f:
                existing_names = pickle.load(f)
            existing_names.extend([name] * 100)
            with open('Face_Recognize_Model/data/names.pkl', 'wb') as f:
                pickle.dump(existing_names, f)

        if 'faces_data.pkl' not in os.listdir('Face_Recognize_Model/data/'):
            with open('Face_Recognize_Model/data/faces_data.pkl', 'wb') as f:
                pickle.dump(faces_data, f)
        else:
            with open('Face_Recognize_Model/data/faces_data.pkl', 'rb') as f:
                existing_faces = pickle.load(f)
            combined_faces = np.vstack([existing_faces, faces_data])
            with open('Face_Recognize_Model/data/faces_data.pkl', 'wb') as f:
                pickle.dump(combined_faces, f)

        load_face_recognition_model()

        return jsonify({'message': 'Face data successfully registered', 'saved_images': len(images)}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)