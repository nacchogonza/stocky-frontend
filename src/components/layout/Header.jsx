// src/components/Header.jsx
import React from 'react';
import { useAuth } from '../../auth/AuthContext'; 
import { useNavigate } from 'react-router-dom'; 

const Header = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="app-header">
            <a className="logo" href='/'>
                <h1>Stocky</h1>
            </a>
            
            {/* <nav className="nav-links">
                <a href="/">Home</a>
                <a href="/clientes-por-ciudad">Reporte</a>
            </nav> */}

            <button 
                onClick={handleLogout}
                className="btn-red-small" // Clase más pequeña para el Header
            >
                Cerrar Sesión
            </button>
        </header>
    );
};

export default Header;