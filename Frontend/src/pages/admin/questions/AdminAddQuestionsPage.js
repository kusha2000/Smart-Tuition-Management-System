import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import swal from "sweetalert";
import FormContainer from "../../../components/FormContainer";
import Sidebar from "../../../components/Sidebar";
import "./AdminAddQuestionsPage.css";
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../../config/firebase"; 

const AdminAddQuestionsPage = () => {
  const [contentType, setContentType] = useState("text"); // Toggle between text or image input
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [option1, setOption1] = useState("");
  const [option2, setOption2] = useState("");
  const [option3, setOption3] = useState("");
  const [option4, setOption4] = useState("");
  const [answer, setAnswer] = useState(null);

  const navigate = useNavigate();

  const onSelectAnswerHandler = (e) => {
    setAnswer(e.target.value);
  };

  // Handle image file change and upload to Cloudinary
  const handleImageChange = async (e) => {
    const file = e.target.files[0]; // Get the image file

    if (!file) return;  // If no file is selected, exit the function

    const data = new FormData();
    data.append("file", file);  // Use the selected file
    data.append("upload_preset", "smart-tuition");
    data.append("cloud_name", "dlbvyir2f");

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dlbvyir2f/image/upload", {
        method: "POST",
        body: data,
      });

      if (!res.ok) {
        throw new Error('Image upload failed');
      }

      const uploadedImageURL = await res.json();
      setImageUrl(uploadedImageURL.url); // Correctly update the image URL state

      console.log(uploadedImageURL.url);  // Log the URL of the uploaded image

    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
  
    if (answer !== null && answer !== "n/a") {
      try {
        // Prepare question data
        const newQuestion = {
          content: contentType === "text" ? content : null,
          image: contentType === "image" && imageUrl ? imageUrl : null, // Only set image URL if image is uploaded
          option1,
          option2,
          option3,
          option4,
          answer,
          timestamp: new Date(),
        };
  
        // Check if imageUrl is properly set and do not add 'image' if it is undefined
        if (contentType === "image" && !imageUrl) {
          throw new Error('Image upload failed. Please try again.');
        }
  
        // Add the new question to Firebase
        await addDoc(collection(db, "questions"), newQuestion);
  
        swal("Question Added!", "Your question was successfully added.", "success");
  
        // Clear form fields
        setContent("");
        setImage(null);
        setOption1("");
        setOption2("");
        setOption3("");
        setOption4("");
        setAnswer(null);
  
        navigate("/adminQuestions");
      } catch (error) {
        console.error("Error adding question: ", error);
        swal("Error", "Failed to add question. Please try again.", "error");
      }
    } else {
      swal("Invalid Answer", "Please select a valid correct answer.", "error");
    }
  };
  

  return (
    <div className="adminAddQuestionPage__container">
      <div className="adminAddQuestionPage__sidebar">
        <Sidebar />
      </div>
      <div className="adminAddQuestionPage__content">
        <FormContainer>
          <h2>Add Question</h2>
          <Form onSubmit={submitHandler}>
            <div className="contentTypeToggle my-3">
              <Form.Check
                inline
                type="radio"
                label="Type Question"
                name="contentType"
                value="text"
                checked={contentType === "text"}
                onChange={(e) => setContentType(e.target.value)}
              />
              <Form.Check
                inline
                type="radio"
                label="Upload Image"
                name="contentType"
                value="image"
                checked={contentType === "image"}
                onChange={(e) => setContentType(e.target.value)}
              />
            </div>

            {contentType === "text" ? (
              <Form.Group className="my-3" controlId="content">
                <Form.Label>Question</Form.Label>
                <Form.Control
                  as="textarea"
                  rows="3"
                  type="text"
                  placeholder="Enter Question Content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </Form.Group>
            ) : (
              <Form.Group className="my-3" controlId="image">
                <Form.Label>Upload Question Image</Form.Label>
                <Form.Control
                  type="file"
                  onChange={handleImageChange}
                />
              </Form.Group>
            )}

            <Form.Group className="my-3" controlId="option1">
              <Form.Label>Option 1</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Option 1"
                value={option1}
                onChange={(e) => setOption1(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="my-3" controlId="option2">
              <Form.Label>Option 2</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Option 2"
                value={option2}
                onChange={(e) => setOption2(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="my-3" controlId="option3">
              <Form.Label>Option 3</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Option 3"
                value={option3}
                onChange={(e) => setOption3(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="my-3" controlId="option4">
              <Form.Label>Option 4</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Option 4"
                value={option4}
                onChange={(e) => setOption4(e.target.value)}
              />
            </Form.Group>

            <div className="my-3">
              <Form.Label>Choose Correct Option:</Form.Label>
              <Form.Select
                aria-label="Choose Correct Option"
                id="answer-select"
                onChange={onSelectAnswerHandler}
              >
                <option value="n/a">Choose Option</option>
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
                <option value="option4">Option 4</option>
              </Form.Select>
            </div>

            <Button
              className="my-5 adminAddQuestionPage__content--button"
              type="submit"
              variant="primary"
            >
              Add
            </Button>
          </Form>
        </FormContainer>
      </div>
    </div>
  );
};

export default AdminAddQuestionsPage;
