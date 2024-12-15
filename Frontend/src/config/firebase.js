
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyCh_tvbcHNDt9P0mayim0FwFU9UF8nCARM",
  authDomain: "smart-tuition-794cf.firebaseapp.com",
  projectId: "smart-tuition-794cf",
  storageBucket: "smart-tuition-794cf.firebasestorage.app",
  messagingSenderId: "721357334677",
  appId: "1:721357334677:web:c0a4364901a5072a18939c"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);