import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  Dispatch,
} from "react";
import firebase from "firebase/app";

interface AuthContextProps {
  currentUser: firebase.User | null;
  logout: () => void;
  loading: boolean;
  setLoading: Dispatch<boolean>;
}

const AuthContext = createContext({} as AuthContextProps);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState<firebase.User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const logout = () => {
    return firebase.auth().signOut();
  };

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    setLoading(false);
  }, [currentUser]);

  const value = {
    currentUser,
    logout,
    loading,
    setLoading,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
