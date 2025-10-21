import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom"; 
import "../../App.css";


import Loader from "../Loader";
import { fetchAuthenticated } from "../../utils/fetchAuthenticated";
import { REPORTE_VENTAS_ENDPOINT } from "../../utils/routes";



const getTodayDate = () => new Date().toISOString().split('T')[0];

const getLastWeekDate = () => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().split('T')[0];
};


const formatCurrency = (amount) => {
    if (typeof amount !== 'number') return '$ 0.00';
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 2,
    }).format(amount);
};


const ReporteRemitos = () => { 
    const navigate = useNavigate();

    const [reporteData, setReporteData] = useState(null);
    
    const [error, setError] = useState(null);
    const [reportLoading, setReportLoading] = useState(false); 

    
    const [fechaDesde, setFechaDesde] = useState(getLastWeekDate());
    const [fechaHasta, setFechaHasta] = useState(getTodayDate());

    const fetchReporte = useCallback(async (desde, hasta) => {
        setReportLoading(true);
        setError(null);
        setReporteData(null);

        try {
            if (!desde || !hasta) {
                setError("Debe seleccionar una fecha de inicio y una fecha de fin.");
                return;
            }
            
            
            if (new Date(desde) > new Date(hasta)) {
                 setError("La fecha 'Desde' no puede ser posterior a la fecha 'Hasta'.");
                 return;
            }

            let url = REPORTE_VENTAS_ENDPOINT;
            url += `?fecha_inicio=${desde}&fecha_fin=${hasta}`;

            
            const response = await fetchAuthenticated(url, { method: "GET" });

            if (response.status === 401 || response.status === 403) {
                navigate("/login");
                return;
            }

            if (!response.ok) {
                 const errorBody = await response.json();
                 throw new Error(errorBody.detail || "Fallo al cargar el reporte");
            }
             
            const data = await response.json();

            
            const detalles = data.detalles || data.detalles_ventas || [];

            const normalizedData = {
                fecha_reporte: getTodayDate(),
                
                total_ventas: data.total_ventas || detalles.reduce((sum, item) => sum + (item.total_venta_item || item.monto_total || 0), 0),
                cantidad_items: detalles.length,
                detalles: detalles, 
            };
            
            setReporteData(normalizedData);

        } catch (err) {
            console.error("Error al cargar reporte:", err);
            setError(`Error: ${err.message}`);
        } finally {
            setReportLoading(false);
        }
    }, [navigate]);

    
    const handleBuscar = (e) => {
        e.preventDefault();
        fetchReporte(fechaDesde, fechaHasta);
    };

    
    if (reportLoading) {
      return (
        <div className="loader-container">
             <Loader />
        </div>
      );
    }

    return (
      
      <div className="content-container">
        {/* CLASE LEGADA: content-report-box */}
        <div className="content-report-box">
          <div>
            <h1 style={{ margin: 0 }}>Reporte de Ventas por Período</h1>
          </div>

          <p className="simple-text">
            Seleccioná el rango de fechas para obtener el reporte de ventas:
          </p>
          
          {/* Inputs de fecha y botón de búsqueda */}
          <div className="input-group" style={{ marginBottom: "30px" }}>
            <form onSubmit={handleBuscar} className="report-form">
                <label>
                    <span className="simple-text" style={{ marginRight: '10px' }}>Desde:</span>
                    <input
                        type="date"
                        value={fechaDesde}
                        onChange={(e) => setFechaDesde(e.target.value)}
                        required
                        
                        className="custom-select" 
                        style={{ marginRight: '20px' }}
                    />
                </label>
                <label>
                    <span className="simple-text" style={{ marginRight: '10px' }}>Hasta:</span>
                    <input
                        type="date"
                        value={fechaHasta}
                        onChange={(e) => setFechaHasta(e.target.value)}
                        required
                        
                        className="custom-select"
                        style={{ marginRight: '20px' }}
                    />
                </label>
                <button
                  type="submit"
                  className="custom-button" 
                  disabled={reportLoading} 
                >
                  Generar Reporte
                </button>
            </form>
          </div>

          {/* HR con estilo LEGADO */}
          <hr style={{ borderColor: "#444" }} />

          <h2
            className="simple-text"
            style={{ fontSize: "20px", marginTop: "30px" }}
          >
            Reporte Generado para el Período: {fechaDesde} al {fechaHasta}
          </h2>

          {reportLoading && <p className="simple-text">Cargando datos del reporte...</p>}

          {/* Manejo de errores con estilo LEGADO */}
          {error && !reportLoading && (
            <p style={{ color: "#e74c3c" }}>{error}</p>
          )}

          {/* Reporte de Datos */}
          {reporteData && (
            <div className="report-details">
              {/* Tarjeta de Resumen con CLASE LEGADA: summary-card */}
              <div className="summary-card">
                <h3>Resumen de Ventas</h3>
                <p>
                  <strong>Período:</strong> {fechaDesde} a {fechaHasta}
                </p>
                <p>
                  <strong>Total de Ítems:</strong>{" "}
                  <span className="highlight-number">
                    {reporteData.detalles.length}
                  </span>
                </p>
                <p>
                  <strong>Monto Total de Ventas:</strong>{" "}
                  <span className="highlight-number">
                    {formatCurrency(reporteData.total_ventas)}
                  </span>
                </p>
                <p className="small-date">
                  Fecha de Generación: {reporteData.fecha_reporte}
                </p>
              </div>

              <h3 className="table-title simple-text">
                Detalle de Ventas ({reporteData.detalles.length})
              </h3>

              {reporteData.detalles.length > 0 ? (
                
                <div className="table-responsive">
                  {/* Tabla con CLASE LEGADA: data-table */}
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>ID Venta/Remito</th>
                        <th>Fecha</th>
                        <th>Cliente</th>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Total Item</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reporteData.detalles.map((item, index) => (
                        <tr key={index}>
                          <td>{item.id_remito || item.id_venta}</td>
                          <td>{item.fecha}</td>
                          <td>{item.nombre_cliente}</td>
                          <td>{item.nombre_producto}</td>
                          <td>{item.cantidad_vendida || item.cantidad}</td>
                          <td>{formatCurrency(item.total_venta_item || item.monto_total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="simple-text">
                  No se encontraron detalles de ventas para este período.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    );
};

export default ReporteRemitos;


