import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBBOnraBc2eQGUrAP3bmj5Yss9U0VT9tP4",
    authDomain: "amigo-secreto-f30ae.firebaseapp.com",
    projectId: "amigo-secreto-f30ae",
    storageBucket: "amigo-secreto-f30ae.firebasestorage.app",
    messagingSenderId: "538184414336",
    appId: "1:538184414336:web:37c3da3176dec5597d2265"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
