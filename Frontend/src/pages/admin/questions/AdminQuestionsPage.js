import React, { useState, useEffect } from "react";
import "./AdminQuestionsPage.css";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../components/Sidebar";
import Question from "../../../components/Question";
import Loader from "../../../components/Loader";
import { db } from "../../../config/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { Button, Container, Navbar,Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const AdminQuestionsPage = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]); 
  const [loading, setLoading] = useState(false); 
  const quizId = new URLSearchParams(window.location.search).get("quizId");
  const quizTitle = new URLSearchParams(window.location.search).get("quizTitle");

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "questions"));
        const questionsList = querySnapshot.docs.map((doc) => ({
          id: doc.id, 
          ...doc.data(),
        }));
        setQuestions(questionsList);
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const addNewQuestionHandler = () => {
    navigate(`/adminAddQuestion/?quizId=${quizId}`);
  };

  const handleDeleteQuestion = (deletedQuestionId) => {
    setQuestions((prevQuestions) => prevQuestions.filter((q) => q.id !== deletedQuestionId));
  };

  const handleUpdateQuestion = (updateQuestionId) => {
  
    navigate(`/adminUpdateQuestion/${updateQuestionId}`);
  };

  const { signOut } = useAuthenticator();
  const handleSignOut = () => {
    signOut();     
    navigate("/");     
  }; 


  return (
    <>
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          {/* Brand Title */}
          <Navbar.Brand className="navbar-brand">
            Smart Tuition Management System
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav>
              {/* Home Button */}
              <LinkContainer to="/">
              <button onClick={handleSignOut} className="logoutbutton">Sign Out</button>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
    <div className="adminQuestionsPage__container">
      <div className="adminQuestionsPage__sidebar">
        <Sidebar />
      </div>
      <div className="adminQuestionsPage__content">
        <h2>{`Questions: ${quizTitle}`}</h2>
        <Button
          className="adminQuestionsPage__content--button"
          onClick={addNewQuestionHandler}
        >
          Add Question
        </Button>

        {loading ? (
          <Loader />
        ) : (
          questions.map((q, index) => (
            <Question
              key={q.id} 
              number={index + 1}
              question={q}
              isAdmin={true}
              onDelete={handleDeleteQuestion}
              onUpdate={handleUpdateQuestion} 
            />
          ))
        )}
      </div>
    </div>
    </>
    
  );
};

export default AdminQuestionsPage;
