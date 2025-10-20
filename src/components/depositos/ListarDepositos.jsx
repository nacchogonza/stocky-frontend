import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../App.css";
import Loader from "../Loader";

import { fetchAuthenticated } from "../../utils/fetchAuthenticated";
import { DEPOSITOS_ENDPOINT } from "../../utils/routes";

const ListarDepositos = () => {
  const navigate = useNavigate();

  const [depositos, setDepositos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDepositos = async () => {
      try {
        const response = await fetchAuthenticated(DEPOSITOS_ENDPOINT);

        if (response.status === 401 || response.status === 403) {
          navigate("/login");
          return;
        }

        if (!response.ok) {
          const errorBody = await response.json();
          throw new Error(errorBody.detail || "Fallo al cargar depositos");
        }

        const data = await response.json();
        setDepositos(data);
      } catch (err) {
        setError(`No se pudieron cargar los depositos: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadDepositos();
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
              <h1 style={{ margin: 0 }}>Listado de Depósitos</h1>
            </div>

            <hr style={{ borderColor: "#444" }} />

            {loading && <p>Cargando Depósitos...</p>}

            {error && !loading && <p style={{ color: "#e74c3c" }}>{error}</p>}

            {depositos && (
              <div className="report-details">
                <div className="summary-card">
                  <h3>Listado de Depósitos</h3>
                  <p>
                    <strong>Total de Depósitos:</strong>{" "}
                    <span className="highlight-number">{depositos.length}</span>
                  </p>
                </div>

                {depositos.length > 0 ? (
                  <div className="table-responsive">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>ID Depósito</th>
                          <th>Nombre</th>
                          <th>Telefono</th>
                          <th>Direcciom</th>
                          <th>Ciudad</th>
                        </tr>
                      </thead>
                      <tbody>
                        {depositos.map((deposito) => (
                          <tr key={deposito.id}>
                            <td>{deposito.id}</td>
                            <td>{deposito.nombre}</td>
                            <td>{deposito.telefono}</td>
                            <td>{deposito.direccion}</td>
                            <td>{deposito.ciudad?.nombre}</td>
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

export default ListarDepositos;
