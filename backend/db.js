// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAlyMqALSLyAhVVHV_9E9-I47oSF4Zysqc",
  authDomain: "blockchain-loan-system.firebaseapp.com",
  projectId: "blockchain-loan-system",
  storageBucket: "blockchain-loan-system.firebasestorage.app",
  messagingSenderId: "196733874017",
  appId: "1:196733874017:web:16ae4fe5f1818a2eba1f20",
  measurementId: "G-5ND3MSEZYZ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
