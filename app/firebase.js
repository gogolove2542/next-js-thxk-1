// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAX9W2dT36Z343XOhSnmcn53M4aFlXPRjc",
  authDomain: "thxk-expenses.firebaseapp.com",
  projectId: "thxk-expenses",
  storageBucket: "thxk-expenses.appspot.com",
  messagingSenderId: "195348392082",
  appId: "1:195348392082:web:31cc7ee714b5d62a741e4b",
  measurementId: "G-FVXB42W95D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
