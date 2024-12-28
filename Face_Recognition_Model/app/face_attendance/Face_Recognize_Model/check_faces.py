from sklearn.neighbors import KNeighborsClassifier
import cv2
import pickle
import numpy as np

# Load the pre-trained KNN model and data
with open('data/names.pkl', 'rb') as w:
    LABELS = pickle.load(w)
with open('data/faces_data.pkl', 'rb') as f:
    FACES = pickle.load(f)

print('Shape of Faces matrix --> ', FACES.shape)

knn = KNeighborsClassifier(n_neighbors=5)
knn.fit(FACES, LABELS)

# Load the Haar cascade for face detection
facedetect = cv2.CascadeClassifier('data/haarcascade_frontalface_default.xml')

# Function to predict the name from an image
def predict_from_image(image_path):
    # Read the image
    image = cv2.imread(image_path)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # Detect faces in the image
    faces = facedetect.detectMultiScale(gray, 1.3, 5)
    for (x, y, w, h) in faces:
        crop_img = image[y:y+h, x:x+w, :]
        resized_img = cv2.resize(crop_img, (50, 50)).flatten().reshape(1, -1)
        output = knn.predict(resized_img)
        
        # Draw a rectangle around the detected face and display the name
        cv2.rectangle(image, (x, y), (x+w, y+h), (0, 0, 255), 2)
        cv2.putText(image, str(output[0]), (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
        
        print(f"Predicted Name: {output[0]}")
    
    # Display the image with annotations
    cv2.imshow("Prediction", image)
    cv2.waitKey(0)
    cv2.destroyAllWindows()

# Example usage
image_path = '../uploads/CAP2839018645133693684.jpg'  # Replace with the path to your image
predict_from_image(image_path)
