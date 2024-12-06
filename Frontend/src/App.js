//====================================
//Amplify and Cognito Default Template
//====================================

// import SignUp from "./components/SignUp";
// import Login from "./components/Login";
// import { Route, Switch, Redirect } from "react-router-dom";
// import {Amplify} from 'aws-amplify';
// import { Authenticator,withAuthenticator } from "@aws-amplify/ui-react";
// import '@aws-amplify/ui-react/styles.css';
// import awsExports from './aws-exports';
// Amplify.configure(awsExports);


// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <Authenticator>
//           {({signOut,user})=>(
//             <main>
//               <div className="App">
//                 <header className="App-header">
//                   <button onClick={signOut}>Sign Out</button>
//                   <h2>My App Content</h2>
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


//====================================
//Our UI
//====================================


import SignUp from "./components/SignUp";
import Login from "./components/Login";
import { Route, Switch, Redirect } from "react-router-dom";


function App() {
  return (
    <>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/signup" component={SignUp} />
        <Redirect from="/" to="/signup" />
      </Switch>
    </>
  );
}

export default App;
