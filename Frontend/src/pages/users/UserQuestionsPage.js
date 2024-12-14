import React, { useEffect, useState } from "react";
import "./UserQuestionsPage.css";
import { Button } from "react-bootstrap";
import swal from "sweetalert";
import Loader from "../../components/Loader";

// Question Component with options
const Question = ({ number, question, onSelectAnswer }) => {
  return (
    <div className="question">
      <h3>{`Q${number}`}</h3>
      {question.type === "text" ? (
        <p>{question.content}</p>
      ) : (
        <img
          src={question.content}
          alt={`Question ${number}`}
          style={{ width: "400px", height: "auto", marginTop: "10px" }}
        />
      )}

      <div className="options">
        {question.options.map((option, index) => (
          <div key={index} className="option">
            <input
              type="radio"
              id={`option-${question.questionId}-${index}`}
              name={`question-${question.questionId}`}
              value={option}
              onChange={() => onSelectAnswer(question.questionId, option)}
            />
            <label htmlFor={`option-${question.questionId}-${index}`}>{option}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

const UserQuestionsPage = () => {
  Number.prototype.zeroPad = function () {
    return ("0" + this).slice(-2);
  };

  const quizId = "1";
  const quizTitle = "Sample Quiz";

  // Dummy questions data with options
  const [questions, setQuestions] = useState([
    { 
      questionId: 1, 
      type: "text", 
      content: "What is React?", 
      options: ["A JavaScript Library", "A CSS Framework", "A Database", "A Server"] 
    },
    { 
      questionId: 2, 
      type: "text", 
      content: "What is JSX?", 
      options: ["JavaScript XML", "Java Syntax Extension", "JavaScript Extension", "None of the Above"] 
    },
    { 
      questionId: 3, 
      type: "image", 
      content: "https://via.placeholder.com/400", 
      options: ["Option 1", "Option 2", "Option 3", "Option 4"] 
    },
    { 
      questionId: 4, 
      type: "text", 
      content: "What is state in React?", 
      options: ["An object that stores data", "A CSS property", "A server-side data", "None of the above"] 
    },
    { 
      questionId: 5, 
      type: "image", 
      content: "https://via.placeholder.com/400", 
      options: ["Option A", "Option B", "Option C", "Option D"] 
    },
  ]);

  const [timeRemaining, setTimeRemaining] = useState(questions.length * 2 * 60);
  const [userAnswers, setUserAnswers] = useState({});

  let intervalId = null;

  useEffect(() => {
    intervalId = setInterval(() => {
      if (timeRemaining <= 0) {
        submitQuizHandler(true);
      } else {
        setTimeRemaining((prev) => prev - 1);
      }
    }, 1000);

    return () => {
      clearInterval(intervalId);
      intervalId = null;
    };
  }, [timeRemaining]);

  const submitQuizHandler = (isTimesUp = false) => {
    if (isTimesUp) {
      swal(
        "Quiz Submitted!",
        `You have completed the quiz: ${quizTitle}.`,
        "success"
      );
    } else {
      swal({
        title: "Are you sure?",
        text: "Once submitted, you will not be able to modify your answers!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willSubmit) => {
        if (willSubmit) {
          swal(
            "Quiz Submitted!",
            `You have completed the quiz: ${quizTitle}.`,
            "success"
          );
        }
      });
    }
    clearInterval(intervalId);
    intervalId = null;
  };

  const handleAnswerSelection = (questionId, selectedAnswer) => {
    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: selectedAnswer,
    }));
  };

  return (
    <div className="userQuestionsPage__container">
      <div className="userQuestionsPage__content">
        <h2>{`Questions : ${quizTitle}`}</h2>
        <div className="userQuestionsPage__content--options">
          <Button
            className="userQuestionsPage__content--button"
            onClick={() => submitQuizHandler()}
          >
            Submit Quiz
          </Button>
          <div className="userQuestionsPage__content--spinner">
            <h4 style={{ marginTop: "18px" }}>{`${parseInt(
              timeRemaining / 60
            ).zeroPad()} : ${(timeRemaining % 60).zeroPad()}`}</h4>
            Timer
          </div>
        </div>
        {questions.length > 0 ? (
          questions.map((q, index) => (
            <Question
              key={q.questionId}
              number={index + 1}
              question={q}
              onSelectAnswer={handleAnswerSelection}
            />
          ))
        ) : (
          <Loader />
        )}
      </div>
    </div>
  );
};

export default UserQuestionsPage;
