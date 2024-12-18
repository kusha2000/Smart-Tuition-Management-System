import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import swal from "sweetalert";
import FormContainer from "../../../components/FormContainer";
import Sidebar from "../../../components/Sidebar";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../../config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore"; 
import "./AdminUpdateQuestionPage.css";

const AdminUpdateQuestionPage = () => {
  const navigate = useNavigate();
  const { firebaseId } = useParams();

  const [contentType, setContentType] = useState("text");
  const [content, setContentValue1] = useState(""); 
  const [image, setImage] = useState(null);
  const [option1, setOption1] = useState("");
  const [option2, setOption2] = useState("");
  const [option3, setOption3] = useState("");
  const [option4, setOption4] = useState("");
  const [answer, setAnswer] = useState("n/a");
  const urlParams = new URLSearchParams(window.location.search);
  const quizId = urlParams.get("quizId");

  // Simulate fetching the question based on quesId
  // const mockQuestions = [
  //   { quesId: "1", content: "What is React?", option1: "Library", option2: "Framework", option3: "Language", option4: "Database", answer: "option1" },
  //   { quesId: "2", content: "What is useState?", option1: "A hook", option2: "A component", option3: "A function", option4: "An event", answer: "option1" },
  // ];

  
  useEffect(() => {
   
    if (!firebaseId) {
      console.error("firebaseId is not provided!");
      swal("Error", "Invalid question ID", "error");
      return;
    }

    const fetchData = async () => {
      try {
        const docRef = doc(db, "questions", firebaseId); 
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const targetObject = docSnap.data(); 

          
          setContentValue1(targetObject.content || ""); 
          setImage(targetObject.image || "");
          setOption1(targetObject.option1 || "");
          setOption2(targetObject.option2 || "");
          setOption3(targetObject.option3 || "");
          setOption4(targetObject.option4 || "");
          setAnswer(targetObject.answer || "n/a");
        } else {
          swal("Error", "Document not found!", "error");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
        swal("Error", "Failed to fetch data", "error");
      }
    };
    fetchData();
  }, [firebaseId]);


 

  const onSelectAnswerHandler = (e) => {
    setAnswer(e.target.value);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const overwriteData = async (e) => {
    e.preventDefault(); 

    
    if (!firebaseId) {
      swal("Error", "Invalid question ID", "error");
      return;
    }

    
    const docRef = doc(db, "questions", firebaseId);

    
    try {
      await updateDoc(docRef, {
        content: contentType === "text" ? content : null,
          image: contentType === "image" ? image?.name : null,
        image,
        option1, 
        option2, 
        option3, 
        option4,
        answer, 
      });
      
      swal("Success!", "Data updated successfully!", "success");
      navigate("/adminQuestions");
    } catch (error) {
      swal("Error", `Failed to update data: ${error.message}`, "error");
    }
  };


  return (
    <div className="adminUpdateQuestionPage__container">
      <div className="adminUpdateQuestionPage__sidebar">
        <Sidebar />
      </div>
      <div className="adminUpdateQuestionPage__content">
        <FormContainer>
          <h2>Update Question</h2>
          <Form onSubmit={overwriteData}>
            

            {contentType === "text" ? (
                          <Form.Group className="my-3" controlId="content">
                          <Form.Label>Question</Form.Label>
                          <Form.Control
                            style={{ textAlign: "top" }}
                            as="textarea"
                            rows="3"
                            type="text"
                            placeholder="Enter Question Content"
                            value={content}
                            onChange={(e) => setContentValue1(e.target.value)}
                          />
                        </Form.Group>
                        ) : (
                          <Form.Group className="my-3" controlId="image">
                            <Form.Label>Upload Question Image</Form.Label>
                            <Form.Control
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                            />
                          </Form.Group>
                        )}
            

            <Form.Group className="my-3" controlId="option1">
              <Form.Label>Option 1</Form.Label>
              <Form.Control
                style={{ textAlign: "top" }}
                as="textarea"
                rows="2"
                type="text"
                placeholder="Enter Option 1"
                value={option1}
                onChange={(e) => setOption1(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="my-3" controlId="option2">
              <Form.Label>Option 2</Form.Label>
              <Form.Control
                style={{ textAlign: "top" }}
                as="textarea"
                rows="2"
                type="text"
                placeholder="Enter Option 2"
                value={option2}
                onChange={(e) => setOption2(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="my-3" controlId="option3">
              <Form.Label>Option 3</Form.Label>
              <Form.Control
                style={{ textAlign: "top" }}
                as="textarea"
                rows="2"
                type="text"
                placeholder="Enter Option 3"
                value={option3}
                onChange={(e) => setOption3(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="my-3" controlId="option4">
              <Form.Label>Option 4</Form.Label>
              <Form.Control
                style={{ textAlign: "top" }}
                as="textarea"
                rows="2"
                type="text"
                placeholder="Enter Option 4"
                value={option4}
                onChange={(e) => setOption4(e.target.value)}
              />
            </Form.Group>

            <div className="my-3">
              <label htmlFor="answer-select">Choose Correct Option:</label>
              <Form.Select
                aria-label="Choose Correct Option"
                id="answer-select"
                onChange={onSelectAnswerHandler}
                value={answer}
              >
                <option value="n/a">Choose Option</option>
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
                <option value="option4">Option 4</option>
              </Form.Select>
            </div>

            <Button
              className="my-5 adminUpdateQuestionPage__content--button"
              type="submit"
              variant="primary"
            >
              Update
            </Button>
          </Form>
        </FormContainer>
      </div>
    </div>
  );
};

export default AdminUpdateQuestionPage;