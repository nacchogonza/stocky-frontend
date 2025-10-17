export function getAuthToken() {
    return localStorage.getItem("authToken"); 
}

export async function fetchAuthenticated(url, options = {}) {
    const token = getAuthToken();

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
        ...options,
        headers,
    });

    if (response.status === 401 || response.status === 403) {
        console.error("Autenticación fallida o expirada.");
        const error = new Error("No autorizado. Sesión expirada.");
        error.statusCode = response.status;
        throw error;
    }

    if (!response.ok) {
        let errorMessage = `HTTP Error: ${response.status} ${response.statusText}`;
        
        try {
            const errorBody = await response.json(); 
            errorMessage = errorBody.detail || JSON.stringify(errorBody); 
        } catch (_) { 
        }

        throw new Error(errorMessage);
    }
    
    const data = await response.json(); 
    
    return data;
}