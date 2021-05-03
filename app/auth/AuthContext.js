import React, { createContext, useContext, useEffect, useState } from "react";
import * as firebase from "firebase";

import signInWithFacebookAsync from "./signInWithFacebookAsync";
import signInWithGoogleAsync from "./signInWithGoogleAsync";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();

  const logout = async () => {
    return firebase.auth().signOut();
  };

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signInWithGoogleAsync: signInWithGoogleAsync.StandAlone,
    signInWithFacebookAsync,
    logout,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
