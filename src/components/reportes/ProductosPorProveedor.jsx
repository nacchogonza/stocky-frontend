import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../App.css";
import Loader from "../Loader";

import { fetchAuthenticated } from "../../utils/fetchAuthenticated";
import {
    PROVEEDORES_ENDPOINT,
    REPORTES_PRODUCTOS_POR_PROVEEDORES_ENDPOINT,
} from "../../utils/routes";

const ProductosPorProveedor = () => {
    const navigate = useNavigate();

    const [Suppliers, setSuppliers] = useState([]);  /* Suppliers = Proveedores*/
    const [selectedSupplierId, setSelectedSupplierId] = useState("");
    const [loading, setLoading] = useState(true);
    const [reportData, setReportData] = useState(null);
    const [error, setError] = useState(null);
    const [reportLoading, setReportLoading] = useState(false);


  /* Funcion que hace el fetch del reporte validando que el usuario esté autenticado */
    const fetchReport = async (SupplierId) => {
        if (!SupplierId) return;

        setReportLoading(true);
        setReportData(null);

        try {
        const endpoint = `${REPORTES_PRODUCTOS_POR_PROVEEDORES_ENDPOINT}${SupplierId}`;
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
        const loadSuppliers = async () => {
        try {
            const response = await fetchAuthenticated(PROVEEDORES_ENDPOINT);
    
            if (response.status === 401 || response.status === 403) {
            navigate("/login");
            return;
            }
    
            if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(errorBody.detail || "Fallo al cargar Proveedores");
            }
    
            const data = await response.json();
            setSuppliers(data);
        } catch (err) {
            setError(`No se pudieron cargar los Proveedores: ${err.message}`);
        } finally {
            setLoading(false);
        }
        };
    
        loadSuppliers();
    }, [navigate]);
    /* Funcion para manejar el cambio de ciudad a partir del uso del Dropdown de ciudades */
    const handleSupplierChange = (event) => {
        const id = event.target.value;
        setSelectedSupplierId(id);
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
            <div>
            <h1 style={{ margin: 0 }}>Reporte Productos por Proveedor</h1>
            </div>

            <p className="simple-text">
            Seleccioná El Proveedor del que queres obtener los Productos:
            </p>

            {loading ? (
                <p className="simple-text">Cargando Proveedores...</p>
            ) : error && Suppliers.length === 0 ? (
                <p style={{ color: "#e74c3c" }}>{error}</p>
            ) : (
            <div className="input-group" style={{ marginBottom: "30px" }}>
                <select
                    value={selectedSupplierId}
                    onChange={handleSupplierChange}
                    className="custom-select"
                    disabled={Suppliers.length === 0}
                >
                <option value={""}>---</option>
                {Suppliers.map((supplier) => (
                    <option key={supplier.id} value={supplier.id}>
                    {supplier.nombre} ({supplier.ciudad.nombre})
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
            Reporte:{" "}
            {Suppliers.find((S) => S.id == selectedSupplierId)?.nombre || "-"}
            </h2>

            {reportLoading && <p>Cargando datos del reporte...</p>}

            {error && !reportLoading && (
            <p style={{ color: "#e74c3c" }}>{error}</p>
            )}

            {reportData && (
            <div className="report-details">
                <div className="summary-card">
                <h3>Resumen del Reporte</h3>
                <p>
                    <strong>Proveedor:</strong> {reportData.nombre_proveedor},{" "}
                    
                </p>
                </div>

                <h3 className="table-title simple-text">
                Listado de Productos ({reportData.cantidad_productos})
                </h3>

                {reportData.productos.length > 0 ? (
                <div className="table-responsive">
                    <table className="data-table">
                    <thead>
                        <tr>
                        <th>ID Producto</th>
                        <th>Nombre</th>
                        <th>Descripcion</th>
                        <th>Precio Compra</th>
                        <th>Precio Venta</th>
                        <th>Proveedor</th>
                        <th>Ciudad</th>
                        <th>Provincia</th>
                        <th>País</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reportData.productos.map((producto) => (
                        <tr key={producto.id_producto}>
                            <td>{producto.id_producto}</td>
                            <td>{producto.nombre_producto}</td>
                            <td>{producto.descripcion}</td>
                            <td>{producto.precio_compra}</td>
                            <td>{producto.precio_venta}</td>
                            <td>{producto.nombre_proveedor}</td>
                            <td>{producto.ciudad}</td>
                            <td>{producto.provincia}</td>
                            <td>{producto.pais}</td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
                ) : (
                <p className="simple-text">
                    No se encontraron Productos para este Proveedor.
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

export default ProductosPorProveedor;