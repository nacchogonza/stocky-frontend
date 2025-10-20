import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../App.css";
import Loader from "../Loader";

import { fetchAuthenticated } from "../../utils/fetchAuthenticated";
import { SUCURSALES_ENDPOINT } from "../../utils/routes";

const ListarSucursales = () => {
  const navigate = useNavigate();

  const [sucursales, setSucursales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSucursales = async () => {
      try {
        const response = await fetchAuthenticated(SUCURSALES_ENDPOINT);

        if (response.status === 401 || response.status === 403) {
          navigate("/login");
          return;
        }

        if (!response.ok) {
          const errorBody = await response.json();
          throw new Error(errorBody.detail || "Fallo al cargar sucursales");
        }

        const data = await response.json();
        setSucursales(data);
      } catch (err) {
        setError(`No se pudieron cargar las sucursales: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadSucursales();
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
              <h1 style={{ margin: 0 }}>Listado de Sucursales</h1>
            </div>

            <hr style={{ borderColor: "#444" }} />

            {loading && <p>Cargando Sucursales...</p>}

            {error && !loading && <p style={{ color: "#e74c3c" }}>{error}</p>}

            {sucursales && (
              <div className="report-details">
                <div className="summary-card">
                  <h3>Listado de Sucursales</h3>
                  <p>
                    <strong>Total de Sucursales:</strong>{" "}
                    <span className="highlight-number">{sucursales.length}</span>
                  </p>
                </div>

                {sucursales.length > 0 ? (
                  <div className="table-responsive">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>ID Sucursal</th>
                          <th>Nombre</th>
                          <th>Telefono</th>
                          <th>Direcciom</th>
                          <th>Ciudad</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sucursales.map((sucursal) => (
                          <tr key={sucursal.id}>
                            <td>{sucursal.id}</td>
                            <td>{sucursal.nombre}</td>
                            <td>{sucursal.telefono}</td>
                            <td>{sucursal.direccion}</td>
                            <td>{sucursal.ciudad?.nombre}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="simple-text">
                    No se encontraron sucursales cargados.
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

export default ListarSucursales;
