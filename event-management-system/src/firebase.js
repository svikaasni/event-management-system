import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAx3nicyoqIvepjVtSqKa8n9S4aY5TJO4A",
    authDomain: "galaxy-events-demo-v1.firebaseapp.com",
    projectId: "galaxy-events-demo-v1",
    storageBucket: "galaxy-events-demo-v1.firebasestorage.app",
    messagingSenderId: "508626813250",
    appId: "1:508626813250:web:bf565c2b31ead47f7b48db"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
