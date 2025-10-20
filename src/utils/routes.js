export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'; 

export const USER_ENDPOINT = `${API_BASE_URL}/api/v1/users/me`;
export const LOGIN_ENDPOINT = `${API_BASE_URL}/api/v1/auth/token`;

export const CIUDADES_ENDPOINT = `${API_BASE_URL}/api/v1/location/ciudad`;
export const REPORTES_CLIENTES_POR_CIUDAD_ENDPOINT = `${API_BASE_URL}/api/v1/reports/clientes_por_ciudad/`;


export const REPORTE_VENTAS_ENDPOINT = `${API_BASE_URL}/api/v1/reports/ventas`;
export const PROVEEDORES_ENDPOINT = `${API_BASE_URL}/api/v1/proveedor/`;
export const REPORTES_PRODUCTOS_POR_PROVEEDORES_ENDPOINT = `${API_BASE_URL}/api/v1/reports/productos_por_proveedor/`;
