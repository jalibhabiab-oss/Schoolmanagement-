import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAMf5pWS0PvSNlCfaYFRpANsoNXbaFUAvM",
    authDomain: "edupk-cdeeb.firebaseapp.com",
    projectId: "edupk-cdeeb",
    storageBucket: "edupk-cdeeb.firebasestorage.app",
    messagingSenderId: "806305240776",
    appId: "1:806305240776:web:67d64e20beaddbdde2b7fd"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
