import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const USER_ENDPOINT = `${API_BASE_URL}/api/v1/users/me`;

const fetchUser = async (fullEndpoint, options = {}) => {
  // 1. Obtener el token de localStorage
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("No se encontró un token de autenticación. Inicie sesión.");
  }

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };

  const response = await fetch(fullEndpoint, {
    ...options,
    headers: headers,
  });

  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem("authToken");
    console.error("Token inválido o expirado. Sesión cerrada.");
  }

  return response;
};

const Home = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await fetchUser(USER_ENDPOINT);

        if (response.status === 401 || response.status === 403) {
          navigate("/login");
          return;
        }

        if (!response.ok) {
          const errorBody = await response.json();
          throw new Error(errorBody.detail || "Fallo al cargar ciudades");
        }

        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(`No se pudieron cargar las ciudades: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  return (
    <div className="login-container">
        {!loading ? (


      <div className="content-box">
        <h1>Bienvenido a Stocky</h1>
        {user?.full_name && user?.email ? (
          <>
            <p className="simple-text">- Usuario: {user?.full_name}</p>
            <p className="simple-text">- Email: {user?.email}</p>
          </>
        ) : null}
        <div className="buttons-container">
          <button
            onClick={() => {
              navigate("/clientes-por-ciudad");
            }}
            className="btn-red"
          >
            Clientes por Ciudad
          </button>

          <button
            onClick={() => {
              navigate("/ventas");
            }}
            className="btn-red"
          >
            Ventas
          </button>

          <button
            onClick={() => {
              navigate("/productos-por-proveedor");
            }}
            className="btn-red"
          >
            Productos por Proveedor
          </button>

          <button
            onClick={() => {
              navigate("/stock-por-producto");
            }}
            className="btn-red"
          >
            Stock por Producto
          </button>
        </div>
      </div>
        ) : (<Loader />)}
    </div>
  );
};

export default Home;
