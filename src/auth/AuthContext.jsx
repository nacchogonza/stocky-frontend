import React, { createContext, useContext, useState } from "react";
import * as jwtDecodeModule from 'jwt-decode';

const jwtDecode = jwtDecodeModule.default || jwtDecodeModule.jwtDecode || jwtDecodeModule; 

const AuthContext = createContext(null);

const checkAuth = () => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    return false;
  }

  try {
    const decodedToken = jwtDecode(token);

    const expirationTime = decodedToken.exp * 1000;

    const isExpired = expirationTime < Date.now();

    if (isExpired) {
      console.log("Token expirado. Eliminando de LocalStorage.");
      localStorage.removeItem("authToken");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error al decodificar el token:", error);
    localStorage.removeItem("authToken");
    return false;
  }
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(checkAuth());

  const login = (token) => {
    localStorage.setItem("authToken", token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar la autenticación fácilmente
export const useAuth = () => useContext(AuthContext);
