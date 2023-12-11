import { initializeApp } from "/opt/build/repo/client/node_modules/firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyChUX83xYQt_LUumxsZNqo2qTWsWHNk3ko",
    authDomain: "website-auth-4c004.firebaseapp.com",
    projectId: "website-auth-4c004",
    storageBucket: "website-auth-4c004.appspot.com",
    messagingSenderId: "874993726241",
    appId: "1:874993726241:web:56ebd74816e1ab2f7cc460",
    measurementId: "G-730WQGREJ6"
  };
  

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;