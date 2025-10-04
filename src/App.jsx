import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import ProtectedRoute from "./auth/ProtectedRoute";
import Home from "./components/Home";
import ClientesPorCiudad from "./components/reportes/ClientesPorCiudad";
import AppLayout from "./components/layout/AppLayout";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />

      <Route element={<ProtectedRoute />}>
        <Route
          path="/"
          element={
            <AppLayout>
              <Home />
            </AppLayout>
          }
        />
        <Route
          path="/clientes-por-ciudad"
          element={
            <AppLayout>
              <ClientesPorCiudad />
            </AppLayout>
          }
        />
      </Route>

      <Route path="*" element={<AppLayout><h1>404 - Página no encontrada</h1></AppLayout>} />
    </Routes>
  );
}

export default App;
