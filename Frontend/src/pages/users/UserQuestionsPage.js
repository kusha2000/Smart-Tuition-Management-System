import React, { useEffect, useState } from "react";
import "./UserQuestionsPage.css";
import { Button, Container, Navbar,Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import swal from "sweetalert";
import Loader from "../../components/Loader";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";
import { useNavigate } from "react-router-dom";
import { useAuthenticator } from "@aws-amplify/ui-react";
import "../../components/Header.css";


const Question = ({ number, question, onSelectAnswer, userAnswer }) => {
  const options = [
    question.option1,
    question.option2,
    question.option3,
    question.option4,
  ];

  return (
    <div className="question">

      {question.content === null ? (
        question.image ? (
          <img
            src={question.image}
            alt={`Question ${number}`}
            width="800"
            height="800"
            className="question__image"
          />
        ) : (
          <div>No image available</div>
        )
      ) : (
        <div className="question__content">{number + ". " + question.content}</div>
      )}

      <div className="options">
        {options.map((option, index) => (
          <div key={index} className="option">
            <input
              type="radio"
              id={`option-${question.id}-${index}`}
              name={`question-${question.id}`}
              value={option}
              checked={userAnswer === option}
              onChange={() => onSelectAnswer(question.id, option)}
            />
            <label htmlFor={`option-${question.id}-${index}`}>{option}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

const UserQuestionsPage = () => {
  const quizId = "1";
  const quizTitle = "Sample Quiz";

  const [questions, setQuestions] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [loading, setLoading] = useState(true);

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
        setTimeRemaining(questionsList.length * 2 * 60); 
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    if (timeRemaining <= 0) {
      submitQuizHandler(true);
    } else {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeRemaining]);

  const submitQuizHandler = (isTimesUp = false) => {
    if (isTimesUp) {
      // swal("Quiz Submitted!", `You have completed the quiz: ${quizTitle}.`, "success");
    } else {
      swal({
        title: "Are you sure?",
        text: "Once submitted, you will not be able to modify your answers!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willSubmit) => {
        if (willSubmit) {
          swal("Quiz Submitted!", `You have completed the quiz: ${quizTitle}.`, "success");
        }
      });
    }
  };

  const handleAnswerSelection = (questionId, selectedAnswer) => {
    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: selectedAnswer,
    }));
  };
  const { signOut } = useAuthenticator();
  const navigate = useNavigate(); 
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
    <div className="userQuestionsPage__container">
      
      <div className="userQuestionsPage__content">
      {/* <Button onClick={handleSignOut}>Sign Out</Button> */}
        <h2>{`Questions: ${quizTitle}`}</h2>
        <div className="userQuestionsPage__content--options">
          <Button
            className="userQuestionsPage__content--button"
            onClick={() => submitQuizHandler(false)}
            disabled={Object.keys(userAnswers).length !== questions.length}
          >
            Submit Quiz
          </Button>
          <div className="userQuestionsPage__content--timer">
            <h4 style={{ marginTop: "18px" }}>
              {String(Math.floor(timeRemaining / 60)).padStart(2, "0")}:
              {String(timeRemaining % 60).padStart(2, "0")} Timer
            </h4>
          </div>
        </div>
        {loading ? (
          <Loader />
        ) : questions.length > 0 ? (
          questions.map((q, index) => (
            <Question
              key={q.id}
              number={index + 1}
              question={q}
              userAnswer={userAnswers[q.id]}
              onSelectAnswer={handleAnswerSelection}
            />
          ))
        ) : (
          <p>No questions found.</p>
        )}
        
        {Object.keys(userAnswers).length === questions.length && (
          <div className="userQuestionsPage__summary">
            <h3>Your Answers</h3>
            <ul>
              {questions.map((q, index) => (
                <li key={q.id}>
                  <strong>{`Q${index + 1}: ${q.content || "Image-based question"}`}</strong>
                  <p>{`Your answer: ${userAnswers[q.id]}`}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
    </>
    
  );
};

export default UserQuestionsPage;
