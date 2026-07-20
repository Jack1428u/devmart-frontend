import { refreshTokenService } from './auth.service';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// =====================================================
// KEY del carrito de invitado en localStorage
// Formato: [{ productId, quantity, productName, price, url, sku }]
// =====================================================
const GUEST_CART_KEY = 'guest_cart';

/**
 * Obtiene el token del localStorage y retorna los headers necesarios
 * para rutas protegidas por el middleware userExtractor del backend.
 */
const getAuthHeaders = () => {
    const token = localStorage.getItem('auth_token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    };
};

/**
 * Wrapper sobre fetch que maneja automáticamente tokens expirados (401).
 * Si el servidor devuelve 401, intenta renovar el token y reintenta la petición.
 * Si el refresh también falla, limpia la sesión y lanza el error.
 * @param {string} url - URL de la petición.
 * @param {RequestInit} options - Opciones del fetch (method, headers, body, etc.).
 * @returns {Promise<Response>} La respuesta del servidor.
 */
const fetchWithRefresh = async (url, options) => {
    let response = await fetch(url, options);

    // Si el servidor devuelve 401, intentamos renovar el token y reintentar
    if (response.status === 401) {
        const currentToken = localStorage.getItem('auth_token');
        if (!currentToken) throw new Error('Token missing');

        try {
            const newToken = await refreshTokenService(currentToken);
            // Guardamos el nuevo token en localStorage
            localStorage.setItem('auth_token', newToken);

            // Reintentamos la petición original con el nuevo token
            const retryOptions = {
                ...options,
                headers: {
                    ...options.headers,
                    'Authorization': `Bearer ${newToken}`,
                },
            };
            response = await fetch(url, retryOptions);
        } catch {
            // Si el refresh falla, limpiamos la sesión
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
        }
    }

    return response;
};

// =====================================================
// HELPERS — Carrito de invitado (guest cart)
// =====================================================

/**
 * Lee el carrito guest del localStorage.
 * Retorna un array vacío si no existe o está corrupto.
 * @returns {Array<{productId: string, quantity: number, productName: string, price: string, url: string|null, sku: string|null}>}
 */
export const getGuestCart = () => {
    try {
        return JSON.parse(localStorage.getItem(GUEST_CART_KEY)) || [];
    } catch {
        return [];
    }
};

/**
 * Persiste el carrito guest en localStorage.
 * @param {Array} items - Array de items del carrito guest.
 */
export const saveGuestCart = (items) => {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
};

/**
 * Elimina el carrito guest del localStorage.
 * Se llama tras una fusión exitosa para evitar re-fusiones en futuros logins.
 */
export const clearGuestCart = () => {
    localStorage.removeItem(GUEST_CART_KEY);
};

// =====================================================
// SERVICIOS — Carrito autenticado (API)
// =====================================================

/**
 * Agrega un item al carrito del usuario autenticado.
 * El backend infiere el customerId desde el token via userExtractor.
 * @param {number|string} productId - ID del producto a agregar.
 * @param {number} quantity - Cantidad a agregar.
 * @returns {Promise<object>} El detalle del carrito creado/actualizado.
 */
export const addToCart = async (productId, quantity) => {
    try {
        const response = await fetchWithRefresh(`${API_URL}/cart/items`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ productId, quantity }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || data.message || 'Error al agregar el producto al carrito');
        }

        return data;
    } catch (error) {
        console.error('Error in addToCart:', error);
        throw error;
    }
};

/**
 * Obtiene el carrito activo del usuario autenticado.
 * @returns {Promise<object>} El carrito con sus CartDetails y productos.
 */
export const getCart = async () => {
    try {
        const response = await fetchWithRefresh(`${API_URL}/cart/items`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || data.message || 'Error al obtener el carrito');
        }

        return data;
    } catch (error) {
        console.error('Error in getCart:', error);
        throw error;
    }
};

/**
 * Elimina un item específico del carrito por su CartDetail ID.
 * @param {number|string} cartDetailId - ID del CartDetail a eliminar.
 * @returns {Promise<object>} Confirmación de eliminación.
 */
export const removeFromCart = async (cartDetailId) => {
    try {
        const response = await fetchWithRefresh(`${API_URL}/cart/items/${cartDetailId}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || data.message || 'Error al eliminar el producto del carrito');
        }

        return data;
    } catch (error) {
        console.error('Error in removeFromCart:', error);
        throw error;
    }
};

/**
 * Fusiona el carrito guest (localStorage) con el carrito persistente del usuario autenticado.
 * El backend valida existencia de productos y stock disponible.
 * Solo se envían productId y quantity; el backend no acepta datos de producto del cliente.
 * @param {Array<{productId: string, quantity: number}>} items - Items del carrito guest.
 * @returns {Promise<object>} El carrito DB actualizado tras la fusión.
 */
export const mergeCartService = async (items) => {
    try {
        // Solo enviamos productId y quantity; el resto (nombre, precio) lo resuelve el backend
        const payload = items.map(({ productId, quantity }) => ({ productId, quantity }));

        const response = await fetchWithRefresh(`${API_URL}/cart/merge`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ items: payload }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || data.message || 'Error al fusionar el carrito');
        }

        return data;
    } catch (error) {
        console.error('Error in mergeCartService:', error);
        throw error;
    }
};
