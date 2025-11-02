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
          throw new Error(
            errorBody.detail || "Fallo al cargar informacion de usuario"
          );
        }

        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(
          `No se pudo obtener la información de usuario: ${err.message}`
        );
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  return (
    <>
      {!loading ? (
        <div className="content-container">
          <div className="content-home-box">
            <h1 className="home-title">Bienvenido a Stocky</h1>
            {!error && user?.full_name && user?.email ? (
              <>
                <p className="home-text">
                  - <b>Usuario:</b> {user?.full_name}
                </p>
                <p className="home-text">
                  - <b>Email:</b> {user?.email}
                </p>
              </>
            ) : null}
            <div className="home-options-container">
              <h3>Reportes</h3>
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
              <h3>Productos</h3>
              <div className="buttons-container">
                <button
                  onClick={() => {
                    navigate("/agregar-producto");
                  }}
                  className="btn-red"
                >
                  Agregar Producto
                </button>

                <button
                  onClick={() => {
                    navigate("/productos");
                  }}
                  className="btn-red"
                >
                  Ver Productos
                </button>
              </div>

              <h3>Clientes</h3>
              <div className="buttons-container">
                <button
                  onClick={() => {
                    navigate("/agregar-cliente");
                  }}
                  className="btn-red"
                >
                  Agregar Cliente
                </button>

                <button
                  onClick={() => {
                    navigate("/clientes");
                  }}
                  className="btn-red"
                >
                  Ver Clientes
                </button>
              </div>

              <h3>Proveedores</h3>
              <div className="buttons-container">
                <button
                  onClick={() => {
                    navigate("#");
                  }}
                  className="btn-red"
                >
                  Agregar Proveedor
                </button>

                <button
                  onClick={() => {
                    navigate("/proveedores");
                  }}
                  className="btn-red"
                >
                  Ver Proveedores
                </button>
              </div>

              <h3>Sucursales</h3>
              <div className="buttons-container">
                <button
                  onClick={() => {
                    navigate("#");
                  }}
                  className="btn-red"
                >
                  Agregar Sucursal
                </button>

                <button
                  onClick={() => {
                    navigate("/sucursales");
                  }}
                  className="btn-red"
                >
                  Ver Sucursales
                </button>
              </div>

              <h3>Depósitos</h3>
              <div className="buttons-container">
                <button
                  onClick={() => {
                    navigate("#");
                  }}
                  className="btn-red"
                >
                  Agregar Depósito
                </button>

                <button
                  onClick={() => {
                    navigate("/depositos");
                  }}
                  className="btn-red"
                >
                  Ver Depósitos
                </button>
              </div>

              <h3>Remitos de Venta</h3>
              <div className="buttons-container">
                <button
                  onClick={() => {
                    navigate("#");
                  }}
                  className="btn-red"
                >
                  Agregar Remito de Venta
                </button>

                <button
                  onClick={() => {
                    navigate("#");
                  }}
                  className="btn-red"
                >
                  Ver Remitos de Venta
                </button>
              </div>

              <h3>Remitos de Compra</h3>
              <div className="buttons-container">
                <button
                  onClick={() => {
                    navigate("#");
                  }}
                  className="btn-red"
                >
                  Agregar Remito de Compra
                </button>

                <button
                  onClick={() => {
                    navigate("#");
                  }}
                  className="btn-red"
                >
                  Ver Remitos de Compra
                </button>
              </div>

              <h3>Remitos de Transferencia</h3>
              <div className="buttons-container">
                <button
                  onClick={() => {
                    navigate("#");
                  }}
                  className="btn-red"
                >
                  Agregar Remito de Transferencia
                </button>

                <button
                  onClick={() => {
                    navigate("#");
                  }}
                  className="btn-red"
                >
                  Ver Remitos de Transferencia
                </button>
              </div>

              <h3>Remitos de Devolución</h3>
              <div className="buttons-container">
                <button
                  onClick={() => {
                    navigate("#");
                  }}
                  className="btn-red"
                >
                  Agregar Remito de Devolución
                </button>

                <button
                  onClick={() => {
                    navigate("#");
                  }}
                  className="btn-red"
                >
                  Ver Remitos de Devolución
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="loader-container">
          <Loader />
        </div>
      )}
    </>
  );
};

export default Home;
