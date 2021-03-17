import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/firestore"; // If using Firebase database

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDFt1bCkVPZMFOa-9OvG4Y1ZCYcFm-Ax_8",
    authDomain: "henrynz.firebaseapp.com",
    projectId: "henrynz",
    storageBucket: "henrynz.appspot.com",
    messagingSenderId: "345704982575",
    appId: "1:345704982575:web:8e47f1d042d6f455cdfeda",
    measurementId: "G-KD2QZXL8EQ",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

export { firebase };
