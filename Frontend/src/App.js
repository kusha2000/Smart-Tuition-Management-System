
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
        <Route path="/" element={<Navigate to="/signup" />} />
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
        <Route path="/adminUpdateQuestion/:quesId" element={<AdminUpdateQuestionPage />} />
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

// ====================================
// Amplify and Cognito Default Template
// ====================================

// import SignUp from "./components/SignUp";
// import Login from "./components/Login";
// import { Route, Switch, Redirect } from "react-router-dom";
// import { Amplify } from "aws-amplify";
// import { Authenticator, withAuthenticator } from "@aws-amplify/ui-react";
// import "@aws-amplify/ui-react/styles.css";
// import awsExports from "./aws-exports";
// import React, { useEffect, useState } from "react";
// Amplify.configure(awsExports);

// function App() {

//   // ==========================
//   // AWS API Gateway and Lambda 
//   // ==========================

//   const myAPI = "https://s98mlsegdk.execute-api.eu-north-1.amazonaws.com/dev";
//   const path = "/users";

//   const getCustomer = (e) => {
//     let customerId = e.input;
//     const url = `${myAPI}${path}/${customerId}`;
//     //const url='https://s98mlsegdk.execute-api.eu-north-1.amazonaws.com/dev/users/1'

//     fetch(url)
//       .then((response) => response.json())
//       .then((data) => {
//         console.log(data);
//         setCustomers([...customers, data]);
//       })
//       .catch((error) => console.error(error));
//   };

//   const [input, setInput] = useState("");
//   const [customers, setCustomers] = useState([]);

//   return (
//     <div className="App">
//       <header className="App-header">
//         <Authenticator>
//           {({ signOut, user }) => (
//             <main>
//               <div className="App">
//                 <header className="App-header">
//                   <button onClick={signOut}>Sign Out</button>
//                   <h2>My App Content</h2>
//                   <div className="App">
//                     <h1>Super Simple React App</h1>
//                     <div>
//                       <input
//                         placeholder="customer id"
//                         type="text"
//                         value={input}
//                         onChange={(e) => setInput(e.target.value)}
//                       />
//                     </div>
//                     <br />
//                     <button onClick={() => getCustomer({ input })}>
//                       Get Customer From Backend
//                     </button>

//                     <h2
//                       style={{
//                         visibility: customers.length > 0 ? "visible" : "hidden",
//                       }}
//                     >
//                       Response
//                     </h2>
//                     {customers.map((thisCustomer, index) => {
//                       return (
//                         <div key={thisCustomer.customerId}>
//                           <span>
//                             <b>CustomerId:</b> {thisCustomer.userId} -{" "}
//                             <b>CustomerName</b>: {thisCustomer.userName}
//                           </span>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </header>
//               </div>
//             </main>
//           )}
//         </Authenticator>
//       </header>
//     </div>
//   );
// }

// export default withAuthenticator(App);