// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD71c_JlnRdBvT6sV-11tNa083fwhw0HNU",
  authDomain: "journalxp-4ea0f.firebaseapp.com",
  projectId: "journalxp-4ea0f",
  storageBucket: "journalxp-4ea0f.firebasestorage.app",
  messagingSenderId: "448060142150",
  appId: "1:448060142150:web:cde9d0fb9c129b09295047",
  measurementId: "G-5X4S5ZEWBV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);