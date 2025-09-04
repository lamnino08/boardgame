// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCGzEVgjwPn8MBMXa15TPJc3ffknkVXbL4",
  authDomain: "ineffable-21a82.firebaseapp.com",
  projectId: "ineffable-21a82",
  storageBucket: "ineffable-21a82.firebasestorage.app",
  messagingSenderId: "588817079724",
  appId: "1:588817079724:web:1c4f9ac7dfca80d6982e09",
  measurementId: "G-W6LFWLDDWQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };