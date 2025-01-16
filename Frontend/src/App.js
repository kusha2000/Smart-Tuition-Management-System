// ====================================
// Amplify and Cognito Default Template
// ====================================

// import React from "react";
// import { Amplify } from "aws-amplify";
// import "@aws-amplify/ui-react/styles.css";
// import { Route, Routes } from "react-router-dom";
// import awsExports from "./aws-exports";

// import AuthHandler from "./components/Authenticating";
// import AdminQuestionsPage from "./pages/admin/questions/AdminQuestionsPage";
// import AdminAddQuestionsPage from "./pages/admin/questions/AdminAddQuestionsPage";
// import UserQuestionsPage from "./pages/users/UserQuestionsPage";
// import { Authenticator, ThemeProvider } from "@aws-amplify/ui-react";

// Amplify.configure(awsExports);

// export default function App() {
//   return (
//     <Authenticator.Provider>
//       <ThemeProvider>
//         <Routes>
//           <Route path="/" element={<AuthHandler />} />
//           <Route path="/questions" element={<UserQuestionsPage />} />
//           <Route path="/adminQuestions" element={<AdminQuestionsPage />} />
//           <Route path="/adminAddQuestion" element={<AdminAddQuestionsPage />} />
//         </Routes>
//       </ThemeProvider>
//     </Authenticator.Provider>
//   );
// }

// ====================================
// Our UI
// ====================================

import SignUp from "./components/SignUp";
import Login from "./components/Login";
import { Route, Navigate, Routes } from "react-router-dom"; // Use Navigate instead of Redirect
import Header from "./components/Header";
import AdminAddCategoryPage from "./pages/admin/categories/AdminAddCategoryPage";
import AdminCategoriesPage from "./pages/admin/categories/AdminCategoriesPage";
import AdminUpdateCategoryPage from "./pages/admin/categories/AdminUpdateCategoryPage";
import AdminProfilePage from "./pages/admin/AdminProfilePage";
import AdminQuizzesPage from "./pages/admin/quizzes/AdminQuizzesPage";
import AdminAddQuiz from "./pages/admin/quizzes/AdminAddQuiz";
import AdminUpdateQuiz from "./pages/admin/quizzes/AdminUpdateQuiz";
import AdminQuestionsPage from "./pages/admin/questions/AdminQuestionsPage";
import AdminAddQuestionsPage from "./pages/admin/questions/AdminAddQuestionsPage";
import AdminUpdateQuestionPage from "./pages/admin/questions/AdminUpdateQuestionPage";
import UserProfilePage from "./pages/users/UserProfilePage";
import UserQuizzesPage from "./pages/users/UserQuizzesPage";
import UserQuizManualPage from "./pages/users/UserQuizManualPage";
import UserQuestionsPage from "./pages/users/UserQuestionsPage";
import UserQuizResultPage from "./pages/users/UserQuizResultPage";
import AdminQuizResultPage from "./pages/admin/AdminQuizResultPage";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        {/* Redirect to "/signup" if no matching route */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/adminProfile" element={<AdminProfilePage />} />
        <Route path="/adminCategories" element={<AdminCategoriesPage />} />
        <Route path="/adminAddCategory" element={<AdminAddCategoryPage />} />
        <Route path="/adminUpdateCategory/:catId" element={<AdminUpdateCategoryPage />} />
        <Route path="/adminQuizzes" element={<AdminQuizzesPage />} />
        <Route path="/adminAddQuiz" element={<AdminAddQuiz />} />
        <Route path="/adminUpdateQuiz/:quizId" element={<AdminUpdateQuiz />} />
        <Route path="/adminQuestions" element={<AdminQuestionsPage />} />
        <Route path="/adminAddQuestion" element={<AdminAddQuestionsPage />} />
        <Route path="/adminallResult" element={<AdminQuizResultPage />} />
        <Route path="/adminUpdateQuestion/:firebaseId" element={<AdminUpdateQuestionPage />} />
        {/* <Route path="/update" element={<AdminUpdateQuestionPage />} /> */}
        <Route path="/profile" element={<UserProfilePage />} />
        <Route path="/quizzes" element={<UserQuizzesPage />} />
        <Route path="/quiz/*" element={<UserQuizzesPage />} />
        <Route path="/quizManual/" element={<UserQuizManualPage />} />
        <Route path="/questions/" element={<UserQuestionsPage />} />
        <Route path="/quizResults/" element={<UserQuizResultPage />} />
      </Routes>
    </>
  );
}

export default App;
