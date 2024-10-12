// Import the functions you need from the SDKs you need
import { getAuth } from "firebase/auth";
import firebase from "firebase/compat/app";
// import 'firebase/compat/auth';
import "firebase/compat/firestore";
import "firebase/compat/storage";
const firebaseConfig = {
  apiKey: "AIzaSyBiiMMFE_kYXlbpv4tKhRz3bCjSJk-9mY0",
  authDomain: "cashtrack-26bd5.firebaseapp.com",
  projectId: "cashtrack-26bd5",
  storageBucket: "cashtrack-26bd5.appspot.com",
  messagingSenderId: "847004724065",
  appId: "1:847004724065:web:01b07f83568998d6c4f320",
  measurementId: "G-PPC8Y543XE",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const storage = firebase.storage();
export const db = firebase.firestore();
export const timestamp = firebase.firestore.FieldValue.serverTimestamp();
export const auth = getAuth();
export default firebase;
