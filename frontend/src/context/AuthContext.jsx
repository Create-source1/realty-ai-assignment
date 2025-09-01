import React, { createContext, useContext, useEffect, useState } from "react";
import API from "../api/axiosConfig";

const AuthCtx = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const login = async (email, password) => {
    const { data } = await API.post("/auth/login", { email, password });
    localStorage.setItem("token", data.token);
    setToken(data.token);
    return data;
  };

  const signup = async (username, email, password) => {
    const { data } = await API.post("/auth/signup", {
      username,
      email,
      password,
    });
    return data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
  };

  useEffect(() => {
    // token changes persisted automatically via localStorage in login/logout
  }, [token]);

  return (
    <AuthCtx.Provider value={{ token, login, signup, logout }}>
      {children}
    </AuthCtx.Provider>
  );
};

export const useAuth = () => useContext(AuthCtx);
