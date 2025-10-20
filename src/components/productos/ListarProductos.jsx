import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../App.css";
import Loader from "../Loader";

import { fetchAuthenticated } from "../../utils/fetchAuthenticated";
import { PRODUCTOS_ENDPOINT } from "../../utils/routes";

const ListarProductos = () => {
  const navigate = useNavigate();

  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProductos = async () => {
      try {
        const response = await fetchAuthenticated(PRODUCTOS_ENDPOINT);

        if (response.status === 401 || response.status === 403) {
          navigate("/login");
          return;
        }

        if (!response.ok) {
          const errorBody = await response.json();
          throw new Error(errorBody.detail || "Fallo al cargar productos");
        }

        const data = await response.json();
        setProductos(data);
      } catch (err) {
        setError(`No se pudieron cargar los productos: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadProductos();
  }, [navigate]);

  return (
    <>
      {loading ? (
        <div className="loader-container">
          <Loader />
        </div>
      ) : (
        <div className="content-container">
          <div className="content-report-box">
            <div>
              <h1 style={{ margin: 0 }}>Listado de Productos</h1>
            </div>

            <hr style={{ borderColor: "#444" }} />

            {loading && <p>Cargando Productos...</p>}

            {error && !loading && <p style={{ color: "#e74c3c" }}>{error}</p>}

            {productos && (
              <div className="report-details">
                <div className="summary-card">
                  <h3>Listado de Productos</h3>
                  <p>
                    <strong>Total de Productos:</strong>{" "}
                    <span className="highlight-number">{productos.length}</span>
                  </p>
                </div>

                {productos.length > 0 ? (
                  <div className="table-responsive">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>ID Producto</th>
                          <th>Nombre Producto</th>
                          <th>Categoría</th>
                          <th>P. Venta</th>
                          <th>Proveedor</th>
                        </tr>
                      </thead>
                      <tbody>
                        {productos.map((producto) => (
                          <tr key={producto.id}>
                            <td>{producto.id}</td>
                            <td>{producto.nombre}</td>
                            <td>{producto.categoria}</td>
                            <td>{producto.precioVenta}</td>
                            <td>{producto.proveedor?.nombre}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="simple-text">
                    No se encontraron productos cargados.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ListarProductos;
