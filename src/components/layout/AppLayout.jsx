// src/components/AppLayout.jsx
import React from 'react';
import Header from './Header'; // Componente que crearemos a continuación
import '../../App.css'; // Estilos específicos del layout

const AppLayout = ({ children }) => {
    return (
        <div className="app-container">
            {/* 1. Header Fijo (Navegación y Logout) */}
            <Header />

            {/* 2. Área Principal de Contenido (Scrollable) */}
            <main className="app-body">
                {children} 
            </main>
        </div>
    );
};

export default AppLayout;