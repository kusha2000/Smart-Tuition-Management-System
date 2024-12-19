// ====================================
// Amplify and Cognito Default Template
// ====================================

import React from "react";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import {
  useTheme,
  View,
  Authenticator,
  useAuthenticator,
  Button,
  ThemeProvider,
  Theme,
} from "@aws-amplify/ui-react";
import awsExports from "./aws-exports";
import { Route, Routes } from "react-router-dom"; 
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

Amplify.configure(awsExports);

const components = {
  Header() {
    const { tokens } = useTheme();

    return <View textAlign="center" padding="relative.xxxl"></View>;
  },

  SignIn: {
    Header() {
      const { tokens } = useTheme();

      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <span
            style={{ color: "#4ad0cc", fontWeight: "800", fontSize: "35px" }}
          >
            Welcome to Smart Tuition System
          </span>
        </div>
      );
    },
    Footer() {
      const { toForgotPassword } = useAuthenticator();

      return (
        <View textAlign="center">
          <Button
            fontWeight="normal"
            onClick={toForgotPassword}
            size="small"
            variation="link"
          >
            Reset Password
          </Button>
        </View>
      );
    },
  },

  SignUp: {
    Header() {
      const { tokens } = useTheme();

      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <span
            style={{ color: "#4ad0cc", fontWeight: "800", fontSize: "35px" }}
          >
            Sign Up
          </span>
        </div>
      );
    },
    Footer() {
      const { toSignIn } = useAuthenticator();

      return (
        <View textAlign="center">
          Already have a account?
          <Button
            fontWeight="normal"
            onClick={toSignIn}
            size="small"
            variation="link"
            color={"#52b1ae"}
          >
            Sign In
          </Button>
        </View>
      );
    },
  },
};


export default function App() {
  const { tokens } = useTheme();
  const theme = {
    name: "Auth Example Theme",
    tokens: {
      components: {
        authenticator: {
          router: {
            boxShadow: `0 0 16px ${tokens.colors.overlay["10"]}`,
            borderWidth: "0",
          },
          form: {
            padding: `${tokens.space.medium} ${tokens.space.xl} ${tokens.space.medium}`,
          },
        },
        button: {
          primary: {
            backgroundColor: "#4ad0cc",
          },
          link: {
            color: tokens.colors.purple["80"],
          },
          _hover: {
            backgroundColor: "#52b1ae", 
            cursor: "pointer",
          },
        },
      },
    },
  };
  return (
    <ThemeProvider theme={theme}>
  <Authenticator components={components}>
    {({ signOut, user }) => {
      console.log(user.signInDetails.loginId); 
      if(user.signInDetails.loginId=="admin@gmail.com"){
        console.log("This is Admin");
        return (
          <>  
            <Header signOutFun={signOut} />
            <Routes>
              <Route path="/" element={<AdminQuizzesPage />} />
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
            </Routes>
          </>
        );
      }else{
        console.log("This is User");
        return (
          <>  
            <Header signOutFun={signOut} />
            <Routes>
              <Route path="/" element={<UserQuestionsPage />} />
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
      
    }}
  </Authenticator>
</ThemeProvider>
  );
}


// ====================================
// Our UI
// ====================================

// import SignUp from "./components/SignUp";
// import Login from "./components/Login";
// import { Route, Navigate, Routes } from "react-router-dom"; // Use Navigate instead of Redirect
// import Header from "./components/Header";
// import AdminAddCategoryPage from "./pages/admin/categories/AdminAddCategoryPage";
// import AdminCategoriesPage from "./pages/admin/categories/AdminCategoriesPage";
// import AdminUpdateCategoryPage from "./pages/admin/categories/AdminUpdateCategoryPage";
// import AdminProfilePage from "./pages/admin/AdminProfilePage";
// import AdminQuizzesPage from "./pages/admin/quizzes/AdminQuizzesPage";
// import AdminAddQuiz from "./pages/admin/quizzes/AdminAddQuiz";
// import AdminUpdateQuiz from "./pages/admin/quizzes/AdminUpdateQuiz";
// import AdminQuestionsPage from "./pages/admin/questions/AdminQuestionsPage";
// import AdminAddQuestionsPage from "./pages/admin/questions/AdminAddQuestionsPage";
// import AdminUpdateQuestionPage from "./pages/admin/questions/AdminUpdateQuestionPage";
// import UserProfilePage from "./pages/users/UserProfilePage";
// import UserQuizzesPage from "./pages/users/UserQuizzesPage";
// import UserQuizManualPage from "./pages/users/UserQuizManualPage";
// import UserQuestionsPage from "./pages/users/UserQuestionsPage";
// import UserQuizResultPage from "./pages/users/UserQuizResultPage";
// import AdminQuizResultPage from "./pages/admin/AdminQuizResultPage";

// function App() {
//   return (
//     <>
//       <Header />
//       <Routes>
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<SignUp />} />
//         {/* Redirect to "/signup" if no matching route */}
//         <Route path="/" element={<Navigate to="/login" />} /> 
//         <Route path="/adminProfile" element={<AdminProfilePage />} />
//         <Route path="/adminCategories" element={<AdminCategoriesPage />} />
//         <Route path="/adminAddCategory" element={<AdminAddCategoryPage />} />
//         <Route path="/adminUpdateCategory/:catId" element={<AdminUpdateCategoryPage />} />
//         <Route path="/adminQuizzes" element={<AdminQuizzesPage />} />
//         <Route path="/adminAddQuiz" element={<AdminAddQuiz />} />
//         <Route path="/adminUpdateQuiz/:quizId" element={<AdminUpdateQuiz />} />
//         <Route path="/adminQuestions" element={<AdminQuestionsPage />} />
//         <Route path="/adminAddQuestion" element={<AdminAddQuestionsPage />} />
//         <Route path="/adminallResult" element={<AdminQuizResultPage />} />
//         <Route path="/adminUpdateQuestion/:firebaseId" element={<AdminUpdateQuestionPage />} />
//         {/* <Route path="/update" element={<AdminUpdateQuestionPage />} /> */}
//         <Route path="/profile" element={<UserProfilePage />} />
//         <Route path="/quizzes" element={<UserQuizzesPage />} />
//         <Route path="/quiz/*" element={<UserQuizzesPage />} />
//         <Route path="/quizManual/" element={<UserQuizManualPage />} />
//         <Route path="/questions/" element={<UserQuestionsPage />} />
//         <Route path="/quizResults/" element={<UserQuizResultPage />} />
//       </Routes>
//     </>
//   );
// }



// export default App;
