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

function ReporteRemitos() {
    const [reporteData, setReporteData] = useState(null); 
    const [isLoading, setIsLoading] = useState(false); 
    const [error, setError] = useState(null); 
    
    const [fechaDesde, setFechaDesde] = useState(getLastWeekDate()); 
    const [fechaHasta, setFechaHasta] = useState(getTodayDate()); 
    
    const navigate = useNavigate(); 
    
    const fetchReporte = useCallback(async (desde, hasta) => {
        setIsLoading(true);
        setError(null);
        setReporteData(null); 
        
        try {
            if (!desde || !hasta) {
                setError("Debe seleccionar una fecha de inicio y una fecha de fin.");
                return;
            }
            
            let url = REPORTE_VENTAS_ENDPOINT; 
            url += `?fecha_inicio=${desde}&fecha_fin=${hasta}`;
            
            const data = await fetchAuthenticated(url, { method: "GET" });

            // --------------------------------------------------------
            // CORRECCIÓN CLAVE: Manejo de Respuesta Vacia ({})
            // 1. Prioriza data.detalles_ventas o data directa.
            let ventas = data.detalles_ventas || data; 
            
            // 2. Si el resultado es un objeto vacío ({}). lo tratamos como un array vacío ([]).
            if (typeof ventas === 'object' && ventas !== null && Object.keys(ventas).length === 0) {
                 ventas = [];
            }
            
            if (ventas && Array.isArray(ventas)) {
                setReporteData(ventas); 
            } else {
                 console.error("Respuesta de API inesperada:", data);
                 throw new Error(`Formato de datos incorrecto de la API. No se encontró 'detalles_ventas' o el formato es incorrecto. Respuesta completa: ${JSON.stringify(data)}`);
            }
            // --------------------------------------------------------

        } catch (err) {
            console.error("Error al cargar reporte:", err);
            
            let errorMessage = "Error desconocido al cargar el reporte.";
            if (err.statusCode === 401) {
                 navigate('/login');
                 errorMessage = "Sesión expirada o no autorizada. Redirigiendo a login.";
            } else {
                 // Usamos un mensaje de error más legible si está disponible.
                 errorMessage = "Error al cargar el reporte: " + (err.message || "Verifique la conexión.");
            }
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [navigate]);

    const handleBuscar = (e) => {
        e.preventDefault(); 
        fetchReporte(fechaDesde, fechaHasta); 
    };
    
    if (isLoading) {
      return <Loader mensaje="Buscando Reporte de Ventas..." />;
    }

    if (reporteData === null) {
        return (
            <div className="report-card">
                <h2>Reporte de Ventas por Período</h2>
                
                <form onSubmit={handleBuscar} className="filtro-form">
                    <label>
                        Desde (Fecha de inicio):
                        <input 
                            type="date" 
                            value={fechaDesde} 
                            onChange={(e) => setFechaDesde(e.target.value)} 
                            required
                        />
                    </label>
                    <label>
                        Hasta (Fecha de fin):
                        <input 
                            type="date" 
                            value={fechaHasta} 
                            onChange={(e) => setFechaHasta(e.target.value)} 
                            required
                        />
                    </label>
                    <button type="submit" className="btn-primary" disabled={isLoading || !fechaDesde || !fechaHasta}>
                        Buscar Reporte
                    </button>
                </form>
                
                {error && (
                    <div className="error-message">
                        <p>🔴 Error al cargar el reporte: {error}</p>
                    </div>
                )}
                {!error && (
                    <p style={{ marginTop: '20px', color: '#6c757d' }}>
                        Por favor, seleccione un rango de fechas y haga clic en "Buscar Reporte".
                    </p>
                )}
            </div>
        );
    }

    return (
      <div className="report-card"> 
        <h2>Reporte de Ventas por Período</h2>

        <form onSubmit={handleBuscar} className="filtro-form" style={{marginBottom: '20px'}}>
            <label>
                Desde:
                <input 
                    type="date" 
                    value={fechaDesde} 
                    onChange={(e) => setFechaDesde(e.target.value)} 
                    required
                />
            </label>
            <label>
                Hasta:
                <input 
                    type="date" 
                    value={fechaHasta} 
                    onChange={(e) => setFechaHasta(e.target.value)} 
                    required
                />
            </label>
            <button type="submit" className="btn-primary" disabled={isLoading || !fechaDesde || !fechaHasta}>
                Buscar Reporte
            </button>
        </form>

        <p>Total de Items en el Reporte: {reporteData.length}</p>

        {reporteData.length === 0 ? (
            <p>No se encontraron datos de ventas para el período seleccionado.</p>
        ) : (
            <table className="data-table table-striped"> 
                <thead>
                  <tr>
                    <th>ID Remito</th>
                    <th>Fecha</th>
                    <th>Cliente</th>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Total Item</th>
                    <th>Sucursal</th>
                  </tr>
                </thead>
                <tbody>
                  {reporteData.map((item, index) => ( 
                    <tr key={item.id_remito || index}> 
                      <td>{item.id_remito}</td> 
                      <td>{item.fecha}</td>
                      <td>{item.nombre_cliente}</td> 
                      <td>{item.nombre_producto}</td>
                      <td>{item.cantidad_vendida}</td>
                      <td className="monto-columna">$ {item.total_venta_item ? item.total_venta_item.toFixed(2) : '0.00'}</td>
                      <td>{item.nombre_sucursal}</td>
                    </tr>
                  ))}
                </tbody>
            </table>
        )}
      </div>
    );
}

export default ReporteRemitos;
