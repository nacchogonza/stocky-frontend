import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../App.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const CIUDADES_ENDPOINT = `${API_BASE_URL}/api/v1/location/ciudad`;
const REPORTES_BASE_ENDPOINT = `${API_BASE_URL}/api/v1/reports/clientes_por_ciudad/`;

/**
 * Realiza una petición fetch autenticada con un Bearer Token.
 * NOTA: Esta función DEBERÍA estar en un archivo de utilidad externo, pero la mantenemos aquí por ahora.
 * * @param {string} fullEndpoint - La URL completa a la que hacer la petición.
 * @param {object} options - Opciones adicionales para la solicitud fetch (ej: method, body).
 * @returns {Promise<Response>} La respuesta de la solicitud fetch.
 */
const fetchAuthenticated = async (fullEndpoint, options = {}) => {
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

const ClientesPorCiudad = () => {
  const navigate = useNavigate();

  const [cities, setCities] = useState([]);
  const [selectedCityId, setSelectedCityId] = useState("");
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);

  const fetchReport = async (cityId) => {
    if (!cityId) return;

    setReportLoading(true);
    setReportData(null);

    try {
      const endpoint = `${REPORTES_BASE_ENDPOINT}${cityId}`;
      const response = await fetchAuthenticated(endpoint);

      if (response.status === 401 || response.status === 403) {
        navigate("/login");
        return;
      }

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.detail || "Fallo al cargar el reporte");
      }

      const data = await response.json();
      setReportData(data);
    } catch (err) {
      console.error("Error al cargar reporte:", err);
      setError(`Error: ${err.message}`);
    } finally {
      setReportLoading(false);
    }
  };

  useEffect(() => {
    const loadCities = async () => {
      try {
        const response = await fetchAuthenticated(CIUDADES_ENDPOINT);

        if (response.status === 401 || response.status === 403) {
          navigate("/login");
          return;
        }

        if (!response.ok) {
          const errorBody = await response.json();
          throw new Error(errorBody.detail || "Fallo al cargar ciudades");
        }

        const data = await response.json();
        setCities(data);
      } catch (err) {
        setError(`No se pudieron cargar las ciudades: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadCities();
  }, [navigate]);

  const handleCityChange = (event) => {
    const id = event.target.value;
    setSelectedCityId(id);
    fetchReport(id);
  };

  return (
    <div className="login-container">
      {" "}
      <div className="login-box" style={{ maxWidth: "600px", width: "90%" }}>
        <div>
          <h1 style={{ margin: 0 }}>Reporte Clientes por Ciudad</h1>
        </div>

        <p className="simple-text">
          Seleccioná la ciudad de la que queres obtener los clientes:
        </p>

        {loading ? (
          <p className="simple-text">Cargando ciudades...</p>
        ) : error && cities.length === 0 ? (
          <p style={{ color: "#e74c3c" }}>{error}</p>
        ) : (
          // Dropdown de Ciudades
          <div className="input-group" style={{ marginBottom: "30px" }}>
            <select
              value={selectedCityId}
              onChange={handleCityChange}
              className="custom-select"
              disabled={cities.length === 0}
            >
              <option value={""}>---</option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.nombre} ({city.provincia.nombre})
                </option>
              ))}
            </select>
          </div>
        )}

        <hr style={{ borderColor: "#444" }} />

        <h2
          className="simple-text"
          style={{ fontSize: "20px", marginTop: "30px" }}
        >
          Reporte: {cities.find((c) => c.id == selectedCityId)?.nombre || "-"}
        </h2>

        {reportLoading && <p>Cargando datos del reporte...</p>}

        {error && !reportLoading && <p style={{ color: "#e74c3c" }}>{error}</p>}

        {reportData && (
          <div className="report-details">
            <div className="summary-card">
              <h3>Resumen del Reporte</h3>
              <p>
                <strong>Ciudad:</strong> {reportData.nombre_ciudad},{" "}
                {reportData.nombre_provincia} ({reportData.nombre_pais})
              </p>
              <p>
                <strong>Total de Clientes:</strong>{" "}
                <span className="highlight-number">
                  {reportData.cantidad_clientes}
                </span>
              </p>
              <p className="small-date">
                Fecha del Reporte: {reportData.fecha_reporte}
              </p>
            </div>

            <h3 className="table-title simple-text">
              Listado de Clientes ({reportData.cantidad_clientes})
            </h3>

            {reportData.clientes.length > 0 ? (
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID Cliente</th>
                      <th>Nombre Completo</th>
                      <th>Teléfono</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.clientes.map((cliente) => (
                      <tr key={cliente.id_cliente}>
                        <td>{cliente.id_cliente}</td>
                        <td>{cliente.nombre}</td>
                        <td>{cliente.telefono}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="simple-text">
                No se encontraron clientes para esta ciudad.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientesPorCiudad;
