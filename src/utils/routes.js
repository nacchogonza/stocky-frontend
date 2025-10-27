export const API_BASE_URL = 'http://localhost:8000'; 

/* Endpoints Auth */
export const USER_ENDPOINT = `${API_BASE_URL}/api/v1/users/me`;
export const LOGIN_ENDPOINT = `${API_BASE_URL}/api/v1/auth/token`;

/* Endpoints Entidades */
export const CIUDADES_ENDPOINT = `${API_BASE_URL}/api/v1/location/ciudad`;
export const PRODUCTOS_ENDPOINT = `${API_BASE_URL}/api/v1/producto`;
export const CLIENTES_ENDPOINT = `${API_BASE_URL}/api/v1/cliente`;
export const PROVEEDORES_ENDPOINT = `${API_BASE_URL}/api/v1/proveedor`;
export const SUCURSALES_ENDPOINT = `${API_BASE_URL}/api/v1/sucursal`;
export const DEPOSITOS_ENDPOINT = `${API_BASE_URL}/api/v1/deposito`;

/* Endpoints Reportes */
export const REPORTES_CLIENTES_POR_CIUDAD_ENDPOINT = `${API_BASE_URL}/api/v1/reports/clientes_por_ciudad/`;
export const REPORTE_STOCK_DETALLE = `${API_BASE_URL}/api/v1/reports/stock_por_producto/`;
export const REPORTE_VENTAS_ENDPOINT = `${API_BASE_URL}/api/v1/reports/ventas`;
export const REPORTES_PRODUCTOS_POR_PROVEEDORES_ENDPOINT = `${API_BASE_URL}/api/v1/reports/productos_por_proveedor/`;
