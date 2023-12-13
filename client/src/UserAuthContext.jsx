import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "/opt/build/repo/client/node_modules/firebase/auth";
import { auth } from "./firebase";
import axios from "axios";
import {data} from "autoprefixer";


export const UserContext = createContext({});


export function UserAuthContextProvider({ children }) {
  const [user, setUser] = useState({});
  const [ready,setReady] = useState(false);

  function logIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }
  function signUp(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }
  function logOut() {
    return signOut(auth);
  }
  function googleSignIn() {
    const googleAuthProvider = new GoogleAuthProvider();
    return signInWithPopup(auth, googleAuthProvider);
  }

  function setUpRecaptha(number) {
    const recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {},
      auth
    );
    recaptchaVerifier.render();
    return signInWithPhoneNumber(auth, number, recaptchaVerifier);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentuser) => {
      console.log("Auth", currentuser);
      setUser(() => currentuser); // Functional update to avoid dependency warning
    });
  
    if (!user) {
      axios.get('/profile').then(({ data }) => {
        setUser(() => data); // Functional update
        setReady(true);
      });
    }
  
    return () => {
      unsubscribe();
    };
  }, [user]); // Add user to the dependency array
  
  
        
  return (
    <UserContext.Provider
      value={{
        user,
        logIn,
        signUp,
        logOut,
        googleSignIn,
        setUpRecaptha,
        setUser,
        ready
      }}
    >
      {children}
    </UserContext.Provider>
  );
  
}

export function useUserAuth() {
  return useContext(UserContext);
}