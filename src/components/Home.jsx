import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";
import { USER_ENDPOINT } from "../utils/routes";
import { fetchAuthenticated } from "../utils/fetchAuthenticated";

const Home = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* useEffect que obtiene información del usuario a partir del token de Local Storage al montar el componente */
  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await fetchAuthenticated(USER_ENDPOINT);

        if (response.status === 401 || response.status === 403) {
          navigate("/login");
          return;
        }

        if (!response.ok) {
          const errorBody = await response.json();
          throw new Error(errorBody.detail || "Fallo al cargar informacion de usuario");
        }

        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(`No se pudo obtener la información de usuario: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  return (
    <div className="content-container">
      {!loading ? (
        <div className="content-home-box">
          <h1>Bienvenido a Stocky</h1>
          {!error && user?.full_name && user?.email ? (
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
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default Home;
