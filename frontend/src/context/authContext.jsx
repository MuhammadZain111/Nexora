import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../lib/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
 
  const [user, setUser] = useState(null);
 
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check whether user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axiosInstance.get("/api/auth/check");

        setUser(res.data);
      } catch (error) {
        setUser(null);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);



 const logout = async () => {
    try {
      await axiosInstance.post("/api/auth/logout");
    } finally {
      setUser(null);
    }
  };




  const value = {
    user,
    setUser,
    isCheckingAuth,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
