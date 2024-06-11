import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, update, remove, child } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyDBwsYm9TUIwp5jOPv-QOIORV8QIdVEEgM",
  authDomain: "buses-74314.firebaseapp.com",
  databaseURL: "https://buses-74314-default-rtdb.firebaseio.com",
  projectId: "buses-74314",
  storageBucket: "buses-74314.appspot.com",
  messagingSenderId: "805082094385",
  appId: "1:805082094385:web:0802d5e105b7feddce6e10",
  measurementId: "G-G2L6M9JLRM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, set, get, update, remove, child };
