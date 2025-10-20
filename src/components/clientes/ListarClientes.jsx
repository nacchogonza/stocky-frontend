import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../App.css";
import Loader from "../Loader";

import { fetchAuthenticated } from "../../utils/fetchAuthenticated";
import { CLIENTES_ENDPOINT } from "../../utils/routes";

const ListarClientes = () => {
  const navigate = useNavigate();

  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadClientes = async () => {
      try {
        const response = await fetchAuthenticated(CLIENTES_ENDPOINT);

        if (response.status === 401 || response.status === 403) {
          navigate("/login");
          return;
        }

        if (!response.ok) {
          const errorBody = await response.json();
          throw new Error(errorBody.detail || "Fallo al cargar clientes");
        }

        const data = await response.json();
        setClientes(data);
      } catch (err) {
        setError(`No se pudieron cargar los clientes: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadClientes();
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
              <h1 style={{ margin: 0 }}>Listado de Clientes</h1>
            </div>

            <hr style={{ borderColor: "#444" }} />

            {loading && <p>Cargando Clientes...</p>}

            {error && !loading && <p style={{ color: "#e74c3c" }}>{error}</p>}

            {clientes && (
              <div className="report-details">
                <div className="summary-card">
                  <h3>Listado de Clientes</h3>
                  <p>
                    <strong>Total de Clientes:</strong>{" "}
                    <span className="highlight-number">{clientes.length}</span>
                  </p>
                </div>

                {clientes.length > 0 ? (
                  <div className="table-responsive">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>ID Cliente</th>
                          <th>Nombre Cliente</th>
                          <th>Teléfono</th>
                          <th>Email</th>
                          <th>Ciudad</th>
                        </tr>
                      </thead>
                      <tbody>
                        {clientes.map((cliente) => (
                          <tr key={cliente.id}>
                            <td>{cliente.id}</td>
                            <td>{cliente.nombre}</td>
                            <td>{cliente.telefono}</td>
                            <td>{cliente.email}</td>
                            <td>{cliente.ciudad?.nombre}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="simple-text">
                    No se encontraron clientes cargados.
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

export default ListarClientes;
