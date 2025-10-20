// src/App.jsx

import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import ProtectedRoute from "./auth/ProtectedRoute";
import Home from "./components/Home";
import ClientesPorCiudad from "./components/reportes/ClientesPorCiudad";
import ReporteStock from "./components/reportes/ReporteStock";
import ReporteRemitos from "./components/reportes/ReporteRemitos.jsx"; // IMPORTADO
import ProductosPorProveedor from "./components/reportes/ProductosPorProveedor";
import AppLayout from "./components/layout/AppLayout";
import ListarProductos from "./components/productos/ListarProductos";
import ListarClientes from "./components/clientes/ListarClientes";
import ListarProveedores from "./components/proveedores/ListarProveedores";
import ListarDepositos from "./components/depositos/ListarDepositos";
import ListarSucursales from "./components/sucursales/ListarSucursales";


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

        <Route
          path="/productos"
          element={
            <AppLayout>
              <ListarProductos />
            </AppLayout>
          }
        />

        <Route
          path="/clientes"
          element={
            <AppLayout>
              <ListarClientes />
            </AppLayout>
          }
        />

        <Route
          path="/proveedores"
          element={
            <AppLayout>
              <ListarProveedores />
            </AppLayout>
          }
        />

        <Route
          path="/depositos"
          element={
            <AppLayout>
              <ListarDepositos />
            </AppLayout>
          }
        />

        <Route
          path="/sucursales"
          element={
            <AppLayout>
              <ListarSucursales />
            </AppLayout>
          }
        />
            
          <Route
            path="/stock-por-producto"
            element={
              <AppLayout>
                <ReporteStock />
              </AppLayout>
            }
          />
          
        
        
        <Route
          path="/ventas" 
          element={
            <AppLayout>
              <ReporteRemitos /> 
            </AppLayout>
          }
        />
        
        <Route
          path="/Productos-por-Proveedor"
          element={
            <AppLayout>
              <ProductosPorProveedor />
            </AppLayout>
          }
        />
      </Route>

      <Route
        path="*"
        element={
          <AppLayout>
            <h1>404 - Página no encontrada</h1>
          </AppLayout>
        }
      />
    </Routes>
  );
}

export default App;