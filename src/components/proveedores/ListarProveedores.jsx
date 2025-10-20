import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../App.css";
import Loader from "../Loader";

import { fetchAuthenticated } from "../../utils/fetchAuthenticated";
import { PROVEEDORES_ENDPOINT } from "../../utils/routes";

const ListarProveedores = () => {
  const navigate = useNavigate();

  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProveedores = async () => {
      try {
        const response = await fetchAuthenticated(PROVEEDORES_ENDPOINT);

        if (response.status === 401 || response.status === 403) {
          navigate("/login");
          return;
        }

        if (!response.ok) {
          const errorBody = await response.json();
          throw new Error(errorBody.detail || "Fallo al cargar proveedores");
        }

        const data = await response.json();
        setProveedores(data);
      } catch (err) {
        setError(`No se pudieron cargar los proveedores: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadProveedores();
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
              <h1 style={{ margin: 0 }}>Listado de Proveedores</h1>
            </div>

            <hr style={{ borderColor: "#444" }} />

            {loading && <p>Cargando Proveedores...</p>}

            {error && !loading && <p style={{ color: "#e74c3c" }}>{error}</p>}

            {proveedores && (
              <div className="report-details">
                <div className="summary-card">
                  <h3>Listado de Proveedores</h3>
                  <p>
                    <strong>Total de Proveedores:</strong>{" "}
                    <span className="highlight-number">{proveedores.length}</span>
                  </p>
                </div>

                {proveedores.length > 0 ? (
                  <div className="table-responsive">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>ID Proveedor</th>
                          <th>Nombre</th>
                          <th>Telefono</th>
                          <th>Direcciom</th>
                          <th>Ciudad</th>
                        </tr>
                      </thead>
                      <tbody>
                        {proveedores.map((proveedor) => (
                          <tr key={proveedor.id}>
                            <td>{proveedor.id}</td>
                            <td>{proveedor.nombre}</td>
                            <td>{proveedor.telefono}</td>
                            <td>{proveedor.direccion}</td>
                            <td>{proveedor.ciudad?.nombre}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="simple-text">
                    No se encontraron proveedores cargados.
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

export default ListarProveedores;
