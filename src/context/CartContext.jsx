import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { getCart, addToCart, removeFromCart } from '../services/cart.service';

// Creamos el contexto
const CartContext = createContext();

export const CartProvider = ({ children }) => {
    // Lista de CartDetail objects: [{ id, cartId, productId, quantity, product: { productName, price, ... } }]
    const [cartDetails, setCartDetails] = useState([]);
    const [isCartLoading, setIsCartLoading] = useState(false);
    const [cartError, setCartError] = useState(null);

    const { isAuthenticated } = useAuth();

    /**
     * Carga el carrito desde el backend y puebla el estado.
     * Se memoriza con useCallback para poder usarse como dependencia de useEffect sin loops.
     */
    const fetchCart = useCallback(async () => {
        setIsCartLoading(true);
        setCartError(null);
        try {
            const data = await getCart();
            // Se espera que el backend devuelva { cartDetails: [...] } o directamente el array.
            // Ajusta según la forma real de la respuesta de tu backend.
            setCartDetails(data.cartDetails ?? data ?? []);
        } catch (error) {
            console.error('Error al cargar el carrito:', error);
            setCartError(error.message);
            setCartDetails([]);
        } finally {
            setIsCartLoading(false);
        }
    }, []);

    /**
     * Efecto reactivo al estado de autenticación:
     * - Si el usuario se autentica → carga el carrito.
     * - Si el usuario cierra sesión → limpia el carrito.
     */
    useEffect(() => {
        if (isAuthenticated) {
            fetchCart();
        } else {
            setCartDetails([]);
            setCartError(null);
        }
    }, [isAuthenticated, fetchCart]);

    /**
     * Wrapper de addToCart: llama al servicio y re-sincroniza el estado completo
     * del carrito con el backend para mantener consistencia.
     * @param {number|string} productId
     * @param {number} quantity
     */
    const addCartItem = async (productId, quantity = 1) => {
        try {
            await addToCart(productId, quantity);
            // Re-fetch para asegurar consistencia con el estado del servidor
            await fetchCart();
        } catch (error) {
            console.error('Error en addCartItem:', error);
            throw error; // Re-lanzamos para que el componente pueda mostrar el error
        }
    };

    /**
     * Wrapper de removeFromCart: llama al servicio y actualiza el estado
     * localmente (optimista) para una UX más rápida, luego re-sincroniza.
     * @param {number|string} cartDetailId
     */
    const removeCartItem = async (cartDetailId) => {
        // Guardamos el estado anterior por si el request falla (rollback)
        const previousDetails = cartDetails;

        // Actualización optimista: eliminamos el item del estado inmediatamente
        setCartDetails((prev) => prev.filter((item) => item.id !== cartDetailId));

        try {
            await removeFromCart(cartDetailId);
        } catch (error) {
            console.error('Error en removeCartItem:', error);
            // Rollback al estado anterior si el servidor devuelve un error
            setCartDetails(previousDetails);
            throw error;
        }
    };

    // --- Valores derivados (calculados) ---

    /**
     * Total de unidades en el carrito (suma de todas las cantidades).
     * Útil para mostrar el badge/contador en el ícono del carrito.
     */
    const totalItems = cartDetails.reduce((sum, item) => sum + item.quantity, 0);

    /**
     * Subtotal monetario del carrito.
     * Requiere que cada CartDetail tenga su relación `product` con `price` cargada.
     */
    const subtotal = cartDetails.reduce((sum, item) => {
        const price = parseFloat(item.product?.price ?? 0);
        return sum + price * item.quantity;
    }, 0);

    const value = {
        cartDetails,
        totalItems,
        subtotal,
        isCartLoading,
        cartError,
        addCartItem,
        removeCartItem,
        fetchCart,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart debe usarse dentro de un CartProvider');
    }
    return context;
};
