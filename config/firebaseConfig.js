// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: "loopr-c2cf6.firebaseapp.com",
    projectId: "loopr-c2cf6",
    storageBucket: "loopr-c2cf6.firebasestorage.app",
    messagingSenderId: "322172349171",
    appId: "1:322172349171:web:941fb27d1e75ffbae1a586"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);