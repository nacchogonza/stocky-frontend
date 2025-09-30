import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

// Este componente protege rutas
const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  
  // Si está autenticado, permite el acceso a la ruta hija (<Outlet />)
  // Si NO está autenticado, redirige al componente /login
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;