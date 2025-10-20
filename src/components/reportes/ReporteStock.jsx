import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../App.css";
import Loader from "../Loader";

import { fetchAuthenticated } from "../../utils/fetchAuthenticated";
import {REPORTE_STOCK_DETALLE, PRODUCTOS_ENDPOINT} from "../../utils/routes";

const ReporteStock = () => {
  const navigate = useNavigate();

  const [productos, setProductos] = useState([]);
  const [selectedProductoId, setSelectedProductoId] = useState("");
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);

  // Carga los productos para el dropdown
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

  // Fetch del reporte de stock por producto
  const fetchReport = async (productoId) => {
    if (!productoId) return;

    setReportLoading(true);
    setReportData(null);

    try {
      const response = await fetchAuthenticated(`${REPORTE_STOCK_DETALLE}${productoId}`);
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

  const handleProductoChange = (e) => {
    const id = e.target.value;
    setSelectedProductoId(id);
    fetchReport(id);
  };

  return (
    <>
      {loading || reportLoading ? (
        <div className="loader-container">
          <Loader />
        </div>
      ) : (
        <div className="content-container">
          <div className="content-report-box">
            <h1 style={{ margin: 0 }}>Reporte de Stock</h1>

            <p className="simple-text">Seleccioná el producto:</p>

            {error && productos.length === 0 && (
              <p style={{ color: "#e74c3c" }}>{error}</p>
            )}

            <div className="input-group" style={{ marginBottom: "30px" }}>
              <select
                value={selectedProductoId}
                onChange={handleProductoChange}
                className="custom-select"
                disabled={productos.length === 0}
              >
                <option value="">---</option>
                {productos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre} {p.sku && `(${p.sku})`}
                  </option>
                ))}
              </select>
            </div>

            <hr style={{ borderColor: "#444" }} />

            {reportData && (
              <>
                <div className="summary-card">
                  <h3>Resumen del Reporte</h3>
                  <p>
                    <strong>Producto:</strong> {reportData.nombre_producto}{" "}
                    {reportData.sku_producto && `(${reportData.sku_producto})`}
                  </p>
                  <p>
                    <strong>ID Producto:</strong> {reportData.id_producto}
                  </p>
                  <p>
                    <strong>Total Unidades en Stock:</strong> {reportData.total_unidades_en_stock}
                  </p>
                  <p className="small-date">
                    Fecha del Reporte: {reportData.fecha_generacion}
                  </p>
                </div>

                <h3 className="table-title simple-text">
                  Detalle de Stock
                </h3>

                {reportData.detalles_por_ubicacion.length > 0 ? (
                  <div className="table-responsive">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Sucursal</th>
                          <th>Depósito</th>
                          <th>Cantidad en Sucursal</th>
                          <th>Cantidad en Depósito</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.detalles_por_ubicacion.map((item, idx) => (
                          <tr key={idx}>
                            <td>{item.nombre_sucursal}</td>
                            <td>{item.nombre_deposito || "-"}</td>
                            <td>{item.cantidad_en_sucursal}</td>
                            <td>{item.cantidad_en_deposito}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="simple-text">No hay stock registrado para este producto.</p>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ReporteStock;
