import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { getCart, addToCart, removeFromCart } from '../services/cart.service';

// Creamos el contexto
const CartContext = createContext();

export const CartProvider = ({ children }) => {
    // Lista de CartDetail objects: [{ id, cartId, productId, quantity, product: { productName, price, stock, ... } }]
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
     * Devuelve la cantidad de un producto que ya está en el carrito.
     * @param {number|string} productId
     * @returns {number} Cantidad en carrito (0 si no está).
     */
    const getQuantityInCart = useCallback((productId) => {
        const item = cartDetails.find((d) => d.productId === productId);
        return item?.quantity ?? 0;
    }, [cartDetails]);

    /**
     * Calcula el stock disponible real de un producto:
     *   stock disponible = stockOriginal - cantidadYaEnCarrito
     * Nunca es negativo.
     * @param {number|string} productId
     * @param {number} stockOriginal - Stock total que reportó el backend al cargar el producto.
     * @returns {number}
     */
    const getAvailableStock = useCallback((productId, stockOriginal) => {
        const inCart = getQuantityInCart(productId);
        return Math.max(0, stockOriginal - inCart);
    }, [getQuantityInCart]);

    /**
     * Wrapper de addToCart con validación de stock del lado del cliente.
     * Antes de llamar al backend comprueba que la cantidad total que quedaría
     * en el carrito no supere el stock original del producto.
     *
     * Si se pasa `stockOriginal`, se aplica la restricción client-side.
     * Si no se pasa, la validación queda delegada solo al backend.
     *
     * @param {number|string} productId
     * @param {number} quantity - Cantidad a agregar.
     * @param {number|null} stockOriginal - Stock total del producto (opcional pero recomendado).
     */
    const addCartItem = async (productId, quantity = 1, stockOriginal = null) => {
        // Validación client-side cuando tenemos el stock disponible
        if (stockOriginal !== null) {
            const alreadyInCart = getQuantityInCart(productId);
            const totalAfterAdd = alreadyInCart + quantity;

            if (totalAfterAdd > stockOriginal) {
                const remaining = Math.max(0, stockOriginal - alreadyInCart);
                if (remaining === 0) {
                    throw new Error(
                        'Stock agotado'
                    );
                }
                throw new Error(
                    `Solo puedes agregar ${remaining} unidad${remaining !== 1 ? 'es' : ''} más (stock disponible: ${stockOriginal}).`
                );
            }
        }

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
     * Usa la cantidad real del carrito (no cantidades locales) para el cálculo.
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
        getQuantityInCart,
        getAvailableStock,
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
