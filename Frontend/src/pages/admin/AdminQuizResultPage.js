import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import "../users/UserQuizResultPage.css";
import { Table } from "react-bootstrap";
import Message from "../../components/Message";

const AdminQuizResultPage = () => {
  // Static data for quiz results, as no backend logic is used
  const [quizResults] = useState([
    {
      quiz: {
        quizId: 1,
        title: "Math Quiz 1",
        category: {
          title: "Mathematics",
        },
        numOfQuestions: 10,
      },
      totalObtainedMarks: 45,
      attemptDatetime: "2024-12-01 10:30:00",
    },
    {
      quiz: {
        quizId: 2,
        title: "Science Quiz 1",
        category: {
          title: "Science",
        },
        numOfQuestions: 8,
      },
      totalObtainedMarks: 35,
      attemptDatetime: "2024-12-02 14:00:00",
    },
  ]);

  return (
    <div className="userQuizResultPage__container">
      <div className="userQuizResultPage__sidebar">
        <Sidebar />
      </div>

      <div className="userQuizResultPage__content">
        {quizResults && quizResults.length !== 0 ? (
          <Table bordered className="userQuizResultPage__content--table">
            <thead>
              <tr>
                <th>Quiz Id</th>
                <th>Quiz Name</th>
                <th>Category Name</th>
                <th>Obtained Marks</th>
                <th>Total Marks</th>
                <th>Date</th>
              </tr>
            </thead>
            {quizResults.map((r, index) => (
              <tbody key={index}>
                <tr>
                  <td>{r.quiz.quizId}</td>
                  <td>{r.quiz.title}</td>
                  <td>{r.quiz.category.title}</td>
                  <td>{r.totalObtainedMarks}</td>
                  <td>{r.quiz.numOfQuestions * 5}</td>
                  <td>{r.attemptDatetime}</td>
                </tr>
              </tbody>
            ))}
          </Table>
        ) : (
          <Message>No results to display.</Message>
        )}
      </div>
    </div>
  );
};

export default AdminQuizResultPage;