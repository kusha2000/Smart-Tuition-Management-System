import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import swal from "sweetalert";
import FormContainer from "../../../components/FormContainer";
import Sidebar from "../../../components/Sidebar";
import "./AdminAddQuestionsPage.css";
import { useNavigate } from "react-router-dom";

const AdminAddQuestionsPage = () => {
  const [contentType, setContentType] = useState("text"); // Toggle between text or image input
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [option1, setOption1] = useState("");
  const [option2, setOption2] = useState("");
  const [option3, setOption3] = useState("");
  const [option4, setOption4] = useState("");
  const [answer, setAnswer] = useState(null);
  const [questions, setQuestions] = useState([]);

  const navigate = useNavigate();

  const onSelectAnswerHandler = (e) => {
    setAnswer(e.target.value);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (answer !== null && answer !== "n/a") {
      const newQuestion = {
        content: contentType === "text" ? content : null,
        image: contentType === "image" ? image : null,
        option1,
        option2,
        option3,
        option4,
        answer,
      };

      setQuestions((prevQuestions) => [...prevQuestions, newQuestion]);

      swal("Question Added!", "Your question was successfully added.", "success");

      // Clear form
      setContent("");
      setImage(null);
      setOption1("");
      setOption2("");
      setOption3("");
      setOption4("");
      setAnswer(null);

      navigate("/adminQuestions");
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
                  accept="image/*"
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
