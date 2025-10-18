const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export const CIUDADES_ENDPOINT = `${API_BASE_URL}/api/v1/location/ciudad`;
export const REPORTES_CLIENTES_POR_CIUDAD_ENDPOINT = `${API_BASE_URL}/api/v1/reports/clientes_por_ciudad/`;

export const PRODUCTOS_ENDPOINT = `${API_BASE_URL}/api/v1/producto/`;
export const REPORTE_STOCK_DETALLE = `${API_BASE_URL}/api/v1/reports/reportes/producto/`;

export const USER_ENDPOINT = `${API_BASE_URL}/api/v1/users/me`;
export const LOGIN_ENDPOINT = `${API_BASE_URL}/api/v1/auth/token`;