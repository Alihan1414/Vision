import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase configuration (provided by user)
const firebaseConfig = {
  apiKey: "AIzaSyCH7bTzvqJqSzJiV0Ou6JudPovkrrWrwdw",
  authDomain: "vision-b1ad5.firebaseapp.com",
  databaseURL: "https://vision-b1ad5-default-rtdb.firebaseio.com",
  projectId: "vision-b1ad5",
  storageBucket: "vision-b1ad5.firebasestorage.app",
  messagingSenderId: "121963731187",
  appId: "1:121963731187:web:b79298734352c2d452bf86",
  measurementId: "G-32J8MVDDQT"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
// Firestore instance (used by sync actions)
const db = getFirestore(app);

export { app, db, firebaseConfig };
