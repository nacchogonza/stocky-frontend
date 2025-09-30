import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm'; 
import ProtectedRoute from './auth/ProtectedRoute';
import Home from './components/Home';


function App() {
  return (
    <Routes>

      <Route path="/login" element={<LoginForm />} /> 
      
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Home />} />
      </Route>

      <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
    </Routes>
  );
}

export default App;