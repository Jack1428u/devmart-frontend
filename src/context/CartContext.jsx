import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from './AuthContext';
import {
    getCart,
    addToCart,
    removeFromCart,
    getGuestCart,
    saveGuestCart,
    clearGuestCart,
    mergeCartService,
} from '../services/cart.service';

// Creamos el contexto
const CartContext = createContext();

export const CartProvider = ({ children }) => {
    // Lista de CartDetail objects.
    // Autenticado: [{ id, cartId, productId, quantity, product: { productName, price, stock, ... } }]
    // Guest:       [{ id: productId, productId, quantity, product: { productName, price, url, sku } }]
    const [cartDetails, setCartDetails] = useState([]);
    const [isCartLoading, setIsCartLoading] = useState(false);
    const [cartError, setCartError] = useState(null);

    const { isAuthenticated } = useAuth();

    // Ref para detectar el cambio de guest → autenticado y disparar la fusión solo una vez
    const prevAuthRef = useRef(isAuthenticated);

    // ===================================================
    // MODO AUTENTICADO — carga desde la API
    // ===================================================

    /**
     * Carga el carrito desde el backend y puebla el estado.
     * Se memoriza con useCallback para poder usarse como dependencia de useEffect sin loops.
     */
    const fetchCart = useCallback(async () => {
        setIsCartLoading(true);
        setCartError(null);
        try {
            const data = await getCart();
            setCartDetails(data.cartDetails ?? data ?? []);
        } catch (error) {
            console.error('Error al cargar el carrito:', error);
            setCartError(error.message);
            setCartDetails([]);
        } finally {
            setIsCartLoading(false);
        }
    }, []);

    // ===================================================
    // MODO GUEST — carga desde localStorage
    // ===================================================

    /**
     * Carga el carrito guest del localStorage y lo adapta al formato de cartDetails.
     * El campo `id` usa el productId para que removeCartItem pueda filtrar por él.
     */
    const loadGuestCart = useCallback(() => {
        const guestItems = getGuestCart();
        // Adaptamos el formato del guest cart al formato que usan Cart.jsx y los demás componentes
        const adapted = guestItems.map((item) => ({
            id: item.productId,        // usado por removeCartItem para filtrar
            productId: item.productId,
            quantity: item.quantity,
            product: {
                productName: item.productName,
                price: item.price,
                url: item.url ?? null,
                sku: item.sku ?? null,
                stock: item.stock ?? null,
            },
        }));
        setCartDetails(adapted);
    }, []);

    // ===================================================
    // EFECTO PRINCIPAL — reacciona a cambios de autenticación
    // ===================================================

    useEffect(() => {
        const wasAuthenticated = prevAuthRef.current;
        prevAuthRef.current = isAuthenticated;

        if (isAuthenticated) {
            // Caso 1: Usuario acaba de autenticarse (transición guest → auth)
            // → Fusionar guest cart y luego cargar el carrito actualizado
            if (!wasAuthenticated) {
                const guestItems = getGuestCart();
                if (guestItems.length > 0) {
                    // Fusión: enviar items guest al backend y limpiar localStorage
                    mergeCartService(guestItems)
                        .catch((err) => console.error('Error en fusión de carrito:', err))
                        .finally(() => {
                            // Limpiamos el guest cart SIEMPRE (incluso si falla la fusión parcial)
                            // para evitar re-fusionar en un futuro login
                            clearGuestCart();
                            fetchCart();
                        });
                } else {
                    // Sin items guest → cargar el carrito DB normalmente
                    fetchCart();
                }
            } else {
                // Caso 2: Ya estaba autenticado (ej. recarga de página) → cargar carrito DB
                fetchCart();
            }
        } else {
            // Caso 3: No autenticado → cargar el carrito guest de localStorage
            loadGuestCart();
            setCartError(null);
        }
    }, [isAuthenticated, fetchCart, loadGuestCart]);

    // ===================================================
    // OPERACIONES COMPARTIDAS (mismo API en ambos modos)
    // ===================================================

    /**
     * Devuelve la cantidad de un producto que ya está en el carrito (guest o DB).
     * @param {string} productId
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
     * @param {string} productId
     * @param {number} stockOriginal - Stock total que reportó el backend al cargar el producto.
     * @returns {number}
     */
    const getAvailableStock = useCallback((productId, stockOriginal) => {
        const inCart = getQuantityInCart(productId);
        return Math.max(0, stockOriginal - inCart);
    }, [getQuantityInCart]);

    /**
     * Agrega un item al carrito.
     * - Si autenticado: llama al backend y hace re-fetch.
     * - Si guest: actualiza el array en localStorage y el estado local.
     *
     * @param {string} productId
     * @param {number} quantity - Cantidad a agregar.
     * @param {number|null} stockOriginal - Stock total del producto (para validación client-side).
     * @param {object|null} productSnapshot - Datos del producto para guardar en el guest cart.
     *   Formato: { productName, price, url, sku, stock }
     */
    const addCartItem = async (productId, quantity = 1, stockOriginal = null, productSnapshot = null) => {
        // Validación client-side de stock cuando tenemos el dato disponible
        if (stockOriginal !== null) {
            const alreadyInCart = getQuantityInCart(productId);
            const totalAfterAdd = alreadyInCart + quantity;

            if (totalAfterAdd > stockOriginal) {
                const remaining = Math.max(0, stockOriginal - alreadyInCart);
                if (remaining === 0) {
                    throw new Error('Stock agotado');
                }
                throw new Error(
                    `Solo puedes agregar ${remaining} unidad${remaining !== 1 ? 'es' : ''} más (stock disponible: ${stockOriginal}).`
                );
            }
        }

        if (isAuthenticated) {
            // MODO AUTENTICADO: delegar al backend
            try {
                await addToCart(productId, quantity);
                await fetchCart(); // Re-fetch para asegurar consistencia con el servidor
            } catch (error) {
                console.error('Error en addCartItem:', error);
                throw error;
            }
        } else {
            // MODO GUEST: actualizar el carrito en localStorage
            const currentGuest = getGuestCart();
            const existingIndex = currentGuest.findIndex((i) => i.productId === productId);

            if (existingIndex >= 0) {
                // El producto ya está en el guest cart → incrementar cantidad
                currentGuest[existingIndex].quantity += quantity;
            } else {
                // Producto nuevo → añadir con snapshot del producto
                currentGuest.push({
                    productId,
                    quantity,
                    productName: productSnapshot?.productName ?? 'Producto',
                    price: productSnapshot?.price ?? '0',
                    url: productSnapshot?.url ?? null,
                    sku: productSnapshot?.sku ?? null,
                    stock: productSnapshot?.stock ?? null,
                });
            }

            saveGuestCart(currentGuest);
            loadGuestCart(); // Actualiza el estado de React con el nuevo localStorage
        }
    };

    /**
     * Elimina un item del carrito.
     * - Si autenticado: llama al backend (por cartDetailId de la DB).
     * - Si guest: filtra el array en localStorage (por productId, que actúa como id).
     *
     * @param {string} cartDetailId - En auth es el ID del CartDetail de la DB.
     *                                En guest es el productId (que usamos como id del item).
     */
    const removeCartItem = async (cartDetailId) => {
        if (isAuthenticated) {
            // MODO AUTENTICADO: actualización optimista + rollback si falla
            const previousDetails = cartDetails;
            setCartDetails((prev) => prev.filter((item) => item.id !== cartDetailId));
            try {
                await removeFromCart(cartDetailId);
            } catch (error) {
                console.error('Error en removeCartItem:', error);
                setCartDetails(previousDetails);
                throw error;
            }
        } else {
            // MODO GUEST: eliminar del localStorage por productId
            const currentGuest = getGuestCart();
            const updated = currentGuest.filter((item) => item.productId !== cartDetailId);
            saveGuestCart(updated);
            loadGuestCart();
        }
    };

    // ===================================================
    // VALORES DERIVADOS
    // ===================================================

    /**
     * Total de unidades en el carrito (suma de todas las cantidades).
     * Útil para mostrar el badge/contador en el ícono del carrito.
     */
    const totalItems = cartDetails.reduce((sum, item) => sum + item.quantity, 0);

    /**
     * Subtotal monetario del carrito.
     * Requiere que cada item tenga su relación `product` con `price` cargada.
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

