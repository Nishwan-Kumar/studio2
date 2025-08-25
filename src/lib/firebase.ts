
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCi7EE7sxiLIn1M_eT2O1zO1JJHFoDWg1M",
    authDomain: "echo-chamber-7qv5k.firebaseapp.com",
    projectId: "echo-chamber-7qv5k",
    storageBucket: "echo-chamber-7qv5k.firebasestorage.app",
    messagingSenderId: "1067208455232",
    appId: "1:1067208455232:web:6993649b778fe1bb681ba5",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
