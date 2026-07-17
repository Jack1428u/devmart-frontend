const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const loginService = async (email, password) => {
    try {
        const response = await fetch(`${API_URL}/auth/signin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        // Si el status no es OK (ej. 400, 401, 403, 500), se lanza el error
        if (!response.ok) {
            throw new Error(data.error || typeof data === 'string' ? data : 'Error en el inicio de sesión');
        }

        return data; // Retorna { email, name, id, token }
    } catch (error) {
        console.error("Error in loginService:", error);
        throw error;
    }
};

export const registerService = async (name, email, password) => {
    try {
        const response = await fetch(`${API_URL}/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Error en el registro');
        }

        return data;
    } catch (error) {
        console.error("Error in registerService:", error);
        throw error;
    }
};

export const logoutService = async () => {
    try {
        // Llama al endpoint de logout del backend (opcional)
        await fetch(`${API_URL}/auth/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });
    } catch (error) {
        console.error("Error notificando logout al servidor:", error);
    }
};

/**
 * Solicita un nuevo token al backend enviando el token vencido.
 * El backend lo verifica ignorando la expiración y emite uno nuevo.
 * @param {string} expiredToken - El token JWT vencido guardado en localStorage.
 * @returns {Promise<string>} El nuevo token JWT.
 */
export const refreshTokenService = async (expiredToken) => {
    try {
        const response = await fetch(`${API_URL}/auth/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${expiredToken}`,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Error al renovar el token');
        }

        return data.token; // Retorna el nuevo token
    } catch (error) {
        console.error("Error in refreshTokenService:", error);
        throw error;
    }
};