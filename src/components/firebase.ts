import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore/lite';

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
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
