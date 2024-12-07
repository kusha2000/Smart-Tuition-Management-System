<<<<<<< Updated upstream
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

=======
// ====================================
// Our UI
// ====================================
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
=======

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
>>>>>>> Stashed changes
