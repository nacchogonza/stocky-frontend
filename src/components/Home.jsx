// src/Dashboard.jsx (o el componente donde implementes el logout)

import React from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Bienvenido a Stocky</h1>
        <p className="simple-text">Has iniciado sesión con éxito.</p>

        <button onClick={handleLogout} className="btn-logout">
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
