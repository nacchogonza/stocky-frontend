/**
 * Realiza una petición fetch autenticada con un Bearer Token.
 * NOTA: Esta función DEBERÍA estar en un archivo de utilidad externo, pero la mantenemos aquí por ahora.
 * * @param {string} fullEndpoint - La URL completa a la que hacer la petición.
 * @param {object} options - Opciones adicionales para la solicitud fetch (ej: method, body).
 * @returns {Promise<Response>} La respuesta de la solicitud fetch.
 */
export const fetchAuthenticated = async (fullEndpoint, options = {}) => {
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