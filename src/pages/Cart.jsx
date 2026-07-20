import { Link } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export function Cart() {
    const { isAuthenticated } = useAuth();
    const { cartDetails, totalItems, subtotal, isCartLoading, cartError, removeCartItem } = useCart();

    // --- Estado: cargando carrito ---
    if (isCartLoading) {
        return (
            <main className="min-h-[calc(100vh-4rem)] bg-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-8">Mi Carrito</h1>
                    <div className="space-y-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="flex gap-4 p-4 rounded-2xl border border-gray-100">
                                <div className="skeleton w-20 h-20 rounded-xl flex-shrink-0" />
                                <div className="flex-1 space-y-2 pt-1">
                                    <div className="skeleton h-4 w-2/3 rounded" />
                                    <div className="skeleton h-3 w-1/3 rounded" />
                                    <div className="skeleton h-3 w-1/4 rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        );
    }

    // --- Estado: error al cargar ---
    if (cartError) {
        return (
            <main className="min-h-[calc(100vh-4rem)] bg-white flex items-center justify-center px-4">
                <section className="text-center max-w-sm mx-auto py-20">
                    <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-red-50 text-red-500 mx-auto mb-6">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                        </svg>
                    </div>
                    <h1 className="text-xl font-bold text-gray-900">Mi Carrito</h1>
                    <p className="mt-2 text-sm text-red-600">
                        Ocurrió un error al cargar tu carrito: {cartError}
                    </p>
                </section>
            </main>
        );
    }

    // --- Estado: carrito vacío ---
    if (cartDetails.length === 0) {
        return (
            <main className="min-h-[calc(100vh-4rem)] bg-white flex items-center justify-center px-4">
                <section className="text-center max-w-sm mx-auto py-20">
                    <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100 text-gray-400 mx-auto mb-6">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Tu carrito está vacío</h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Agrega productos y aparecerán aquí.
                    </p>
                    <Link
                        to="/products"
                        className="mt-6 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-[#0066FF] hover:bg-[#0054D1] transition-colors duration-150 shadow-sm"
                    >
                        Ir a la tienda
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                        </svg>
                    </Link>
                    {/* Banner de invitado en carrito vacío */}
                    {!isAuthenticated && (
                        <div className="mt-6 px-4 py-3 rounded-xl bg-[#E6F0FF] border border-[#B8D4FF] text-sm text-left">
                            <p className="text-[#0041A3] font-medium mb-2">
                                ¿Ya tienes una cuenta?
                            </p>
                            <Link
                                to="/login"
                                className="inline-flex items-center gap-1.5 text-[#0066FF] font-semibold hover:underline"
                            >
                                Inicia sesión
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                </svg>
                            </Link>
                            <span className="text-gray-500"> para ver tu carrito guardado.</span>
                        </div>
                    )}
                </section>
            </main>
        );
    }

    // --- Estado: carrito con items ---
    const handleRemove = async (cartDetailId) => {
        try {
            await removeCartItem(cartDetailId);
        } catch (error) {
            alert(`No se pudo eliminar el producto: ${error.message}`);
        }
    };

    return (
        <main className="min-h-[calc(100vh-4rem)] bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-4">
                    Mi Carrito
                </h1>

                {/* ── Banner de invitado ── */}
                {!isAuthenticated && (
                    <div className="mb-6 flex items-center justify-between gap-4 px-4 py-3 rounded-xl bg-[#E6F0FF] border border-[#B8D4FF] text-sm">
                        <p className="text-[#0041A3] font-medium">
                            Inicia sesión para guardar tu carrito y no perder tus productos.
                        </p>
                        <Link
                            to="/login"
                            className="flex-shrink-0 px-4 py-1.5 rounded-lg text-sm font-semibold text-white bg-[#0066FF] hover:bg-[#0054D1] transition-colors duration-150"
                        >
                            Iniciar sesión
                        </Link>
                    </div>
                )}

                <div className="flex flex-col lg:flex-row gap-8 items-start">

                    {/* ── Cart items list ── */}
                    <section className="flex-1 min-w-0">
                        <ul className="space-y-4 list-none p-0 m-0">
                            {cartDetails.map((item) => (
                                <li
                                    key={item.id}
                                    className="flex gap-4 p-4 rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors duration-150"
                                >
                                    {/* Product image */}
                                    {item.product?.url && (
                                        <figure className="flex-shrink-0 w-20 h-20 bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center p-1.5 border border-gray-100">
                                            <img
                                                src={item.product.url}
                                                alt={item.product.productName}
                                                className="w-full h-full object-contain"
                                            />
                                        </figure>
                                    )}

                                    {/* Product info */}
                                    <div className="flex-1 min-w-0">
                                        <h2 className="text-sm font-semibold text-gray-900 truncate">
                                            {item.product?.productName ?? 'Producto sin nombre'}
                                        </h2>
                                        <p className="text-xs text-gray-400 font-mono mt-0.5 uppercase">
                                            SKU: {item.product?.sku ?? '—'}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Precio unitario:{' '}
                                            <span className="font-medium text-gray-700">
                                                ${parseFloat(item.product?.price ?? 0).toFixed(2)}
                                            </span>
                                        </p>

                                        {/* Quantity & subtotal row */}
                                        <div className="flex items-center justify-between mt-3">
                                            <div className="inline-flex items-center gap-2 bg-gray-50 rounded-lg px-2.5 py-1 border border-gray-100">
                                                <span className="text-xs text-gray-500">Cant.:</span>
                                                <span className="text-sm font-semibold text-gray-900">{item.quantity}</span>
                                            </div>
                                            <span className="text-sm font-bold text-[#0066FF]">
                                                ${(parseFloat(item.product?.price ?? 0) * item.quantity).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Remove button */}
                                    <button
                                        onClick={() => handleRemove(item.id)}
                                        aria-label={`Eliminar ${item.product?.productName} del carrito`}
                                        className="flex-shrink-0 self-start p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-150"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                        </svg>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* ── Order summary panel ── */}
                    <aside className="w-full lg:w-80 flex-shrink-0 lg:sticky lg:top-24">
                        <div className="rounded-2xl border border-gray-100 p-6">
                            <h2 className="text-base font-semibold text-gray-900 mb-5">
                                Resumen del pedido
                            </h2>

                            <dl className="space-y-3 text-sm">
                                <div className="flex justify-between text-gray-600">
                                    <dt>Productos ({totalItems} {totalItems === 1 ? 'unidad' : 'unidades'})</dt>
                                    <dd className="font-medium text-gray-900">${subtotal.toFixed(2)}</dd>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <dt>Envío</dt>
                                    <dd className="font-medium text-green-600">Gratis</dd>
                                </div>
                            </dl>

                            <div className="mt-5 pt-5 border-t border-gray-100 flex justify-between items-center">
                                <span className="text-sm font-semibold text-gray-900">Total</span>
                                <span className="text-xl font-extrabold text-gray-900">
                                    ${subtotal.toFixed(2)}
                                </span>
                            </div>

                            <button className="mt-5 w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-[#0066FF] hover:bg-[#0054D1] transition-colors duration-150 shadow-sm">
                                Proceder al Pago
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                </svg>
                            </button>

                            <Link
                                to="/products"
                                className="mt-3 flex items-center justify-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors duration-150 py-2"
                            >
                                ← Seguir comprando
                            </Link>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}
