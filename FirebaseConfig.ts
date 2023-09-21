import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDuWEOcQgtARQ2UBYhjnYxhJGh6O9ypUkI",
    authDomain: "fastingapp-7d76d.firebaseapp.com",
    projectId: "fastingapp-7d76d",
    storageBucket: "fastingapp-7d76d.appspot.com",
    messagingSenderId: "567760406719",
    appId: "1:567760406719:web:f655502f98dbca2ffb9e0a"
};

// Initialize Firebase
const FIREBASE_APP = initializeApp(firebaseConfig);
const FIREBASE_AUTH = getAuth(FIREBASE_APP);
const FIREBASE_DB = getFirestore(FIREBASE_APP);

export { FIREBASE_APP, FIREBASE_AUTH, FIREBASE_DB };