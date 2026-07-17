import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { getProductBySku } from '../services/product.service';
import { useCart } from '../context/CartContext';

export function ProductDetail() {
    // React Router inyecta automáticamente el parámetro aquí
    const { sku } = useParams();
    const [product, setProduct] = useState(null);

    // --- Estado local para el flujo del botón "Agregar al carrito" ---
    const [quantity, setQuantity] = useState(1);
    const [addStatus, setAddStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
    const [addError, setAddError] = useState(null);

    // Obtenemos la función del CartContext
    const { addCartItem } = useCart();

    useEffect(() => {
        const loadProduct = async () => {
            try {
                const data = await getProductBySku(sku);
                setProduct(data);
            } catch (error) {
                console.error('Error al obtener el producto:', error);
            }
        };

        if (sku) {
            loadProduct();
        }
    }, [sku]); // sku como dependencia por si cambia la URL

    const handleAddToCart = async () => {
        if (addStatus === 'loading') return; // Evitar clicks dobles

        setAddStatus('loading');
        setAddError(null);

        try {
            await addCartItem(product.id, quantity);
            setAddStatus('success');

            // Resetear el feedback de éxito luego de 2.5 segundos
            setTimeout(() => setAddStatus('idle'), 2500);
        } catch (error) {
            setAddError(error.message);
            setAddStatus('error');

            // Resetear el feedback de error luego de 3 segundos
            setTimeout(() => {
                setAddStatus('idle');
                setAddError(null);
            }, 3000);
        }
    };

    // --- Loading state ---
    if (!product) {
        return (
            <main className="min-h-[calc(100vh-4rem)] bg-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex flex-col md:flex-row gap-10">
                        {/* Image skeleton */}
                        <div className="flex-1">
                            <div className="skeleton rounded-2xl h-80 w-full" />
                        </div>
                        {/* Info skeleton */}
                        <div className="flex-1 space-y-4 pt-2">
                            <div className="skeleton h-4 w-24 rounded" />
                            <div className="skeleton h-8 w-3/4 rounded" />
                            <div className="skeleton h-6 w-1/3 rounded" />
                            <div className="skeleton h-4 w-1/4 rounded" />
                            <div className="skeleton h-12 w-full rounded-xl mt-6" />
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-[calc(100vh-4rem)] bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                <article className="flex flex-col md:flex-row gap-10 lg:gap-16">

                    {/* ── Image column ── */}
                    {product.url && (
                        <figure className="flex-1 flex items-center justify-center bg-gray-50 rounded-2xl border border-gray-100 p-8 min-h-72">
                            <img
                                src={product.url}
                                alt={product.productName}
                                className="max-h-72 w-full object-contain"
                            />
                        </figure>
                    )}

                    {/* ── Info column ── */}
                    <section className="flex-1 flex flex-col gap-5">

                        {/* SKU badge */}
                        <span className="inline-block self-start text-xs font-mono font-medium text-gray-400 bg-gray-100 rounded-md px-2.5 py-1 uppercase tracking-wider">
                            SKU: {product.sku}
                        </span>

                        {/* Product name */}
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-snug tracking-tight">
                            {product.productName}
                        </h1>

                        {/* Price */}
                        <p className="text-3xl font-extrabold text-[#0066FF]">
                            ${parseFloat(product.price).toFixed(2)}
                        </p>

                        {/* Stock indicator */}
                        <div className="flex items-center gap-2">
                            {product.stock > 0 ? (
                                <>
                                    <span className="inline-block w-2 h-2 rounded-full bg-green-500" aria-hidden="true" />
                                    <span className="text-sm text-gray-600">
                                        <span className="font-semibold text-gray-900">{product.stock}</span> unidades en stock
                                    </span>
                                </>
                            ) : (
                                <>
                                    <span className="inline-block w-2 h-2 rounded-full bg-red-400" aria-hidden="true" />
                                    <span className="text-sm font-medium text-red-600">Sin stock</span>
                                </>
                            )}
                        </div>

                        <hr className="border-gray-100" />

                        {/* Quantity selector */}
                        {product.stock > 0 && (
                            <div className="flex flex-col gap-2">
                                <label htmlFor="quantity-input" className="text-sm font-medium text-gray-700">
                                    Cantidad
                                </label>
                                <div className="inline-flex items-center border border-gray-200 rounded-xl overflow-hidden w-fit">
                                    {/* Decrement button — llama al mismo setQuantity del estado existente */}
                                    <button
                                        type="button"
                                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                        disabled={quantity <= 1 || addStatus === 'loading'}
                                        className="px-4 py-2.5 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-100 text-lg leading-none font-medium select-none"
                                        aria-label="Disminuir cantidad"
                                    >
                                        −
                                    </button>
                                    <input
                                        id="quantity-input"
                                        type="number"
                                        min="1"
                                        max={product.stock}
                                        value={quantity}
                                        onChange={(e) => setQuantity(Number(e.target.value))}
                                        disabled={addStatus === 'loading'}
                                        className="w-14 text-center text-sm font-semibold text-gray-900 border-x border-gray-200 py-2.5 bg-white outline-none focus:bg-[#E6F0FF] transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    />
                                    {/* Increment button */}
                                    <button
                                        type="button"
                                        onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                                        disabled={quantity >= product.stock || addStatus === 'loading'}
                                        className="px-4 py-2.5 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-100 text-lg leading-none font-medium select-none"
                                        aria-label="Aumentar cantidad"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Add to cart button */}
                        <button
                            onClick={handleAddToCart}
                            disabled={addStatus === 'loading' || product.stock === 0}
                            className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-semibold text-white bg-[#0066FF] hover:bg-[#0054D1] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-150 shadow-sm"
                        >
                            {addStatus === 'loading' ? (
                                <>
                                    {/* Spinner */}
                                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Agregando...
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                    </svg>
                                    {product.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
                                </>
                            )}
                        </button>

                        {/* Feedback — success */}
                        {addStatus === 'success' && (
                            <div
                                role="status"
                                className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-[#0041A3] bg-[#E6F0FF] border border-[#B8D4FF]"
                            >
                                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                </svg>
                                Agregado con éxito al carrito.
                            </div>
                        )}

                        {/* Feedback — error */}
                        {addStatus === 'error' && (
                            <div
                                role="alert"
                                className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-red-700 bg-red-50 border border-red-200"
                            >
                                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                                </svg>
                                Error: {addError}
                            </div>
                        )}

                        {/* Out of stock notice */}
                        {product.stock === 0 && (
                            <p className="text-sm text-red-600 font-medium">
                                Este producto está agotado.
                            </p>
                        )}
                    </section>
                </article>
            </div>
        </main>
    );
}
