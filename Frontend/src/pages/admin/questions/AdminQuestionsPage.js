import React, { useState, useEffect } from "react";
import "./AdminQuestionsPage.css";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import Sidebar from "../../../components/Sidebar";
import Question from "../../../components/Question";
import Loader from "../../../components/Loader";
import { db } from "../../../config/firebase"; 
import { collection, getDocs } from "firebase/firestore";

const AdminQuestionsPage = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]); // Local state to store questions
  const [loading, setLoading] = useState(false); // Loading state for simulating data fetch
  const quizId = new URLSearchParams(window.location.search).get("quizId");
  const quizTitle = new URLSearchParams(window.location.search).get("quizTitle");

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "questions"));
        const questionsList = querySnapshot.docs.map((doc) => ({
          id: doc.id, // Ensure the document ID is included
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
    // Filter out the deleted question from local state
    setQuestions((prevQuestions) => prevQuestions.filter((q) => q.id !== deletedQuestionId));
  };

  return (
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
              key={q.id} // Use the unique ID for the key
              number={index + 1}
              question={q}
              isAdmin={true}
              onDelete={handleDeleteQuestion} // Pass delete handler as a prop
            />
          ))
        )}
      </div>
    </div>
  );
};

export default AdminQuestionsPage;
