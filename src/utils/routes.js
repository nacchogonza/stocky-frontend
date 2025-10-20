const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const CIUDADES_ENDPOINT = `${API_BASE_URL}/api/v1/location/ciudad`;
export const REPORTES_CLIENTES_POR_CIUDAD_ENDPOINT = `${API_BASE_URL}/api/v1/reports/clientes_por_ciudad/`;

export const USER_ENDPOINT = `${API_BASE_URL}/api/v1/users/me`;
export const LOGIN_ENDPOINT = `${API_BASE_URL}/api/v1/auth/token`;

export const PRODUCTOS_ENDPOINT = `${API_BASE_URL}/api/v1/producto`;
export const CLIENTES_ENDPOINT = `${API_BASE_URL}/api/v1/cliente`;
export const PROVEEDORES_ENDPOINT = `${API_BASE_URL}/api/v1/proveedor`;
export const SUCURSALES_ENDPOINT = `${API_BASE_URL}/api/v1/sucursal`;
export const DEPOSITOS_ENDPOINT = `${API_BASE_URL}/api/v1/deposito`;