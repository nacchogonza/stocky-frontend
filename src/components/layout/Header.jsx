import React from "react";
import { useAuth } from "../../auth/AuthContext";
import { useNavigate, NavLink } from "react-router-dom";
import logoStocky from "../../assets/logo_gemini_3.png";

const Header = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="app-header">
      <a className="logo-anchor" href="/">
        <img
          src={logoStocky}
          className="logo-image"
        />
      </a>

      <nav className="nav-links">
        <a href="/">Home</a>
        <a href="/clientes-por-ciudad">Reporte</a>
        <NavLink to="/ventas">Ventas</NavLink>
      </nav>

      <button onClick={handleLogout} className="btn-red-small">
        Cerrar Sesión
      </button>
    </header>
  );
};

export default Header;
