import { useEffect, useState } from "react"
import { allProducts } from "../services/product.service.js"
import { Link } from "react-router";

// Skeleton card para el estado de carga
function ProductCardSkeleton() {
    return (
        <div className="rounded-2xl border border-gray-100 overflow-hidden">
            <div className="skeleton h-48 w-full" />
            <div className="p-4 space-y-3">
                <div className="skeleton h-4 w-3/4 rounded" />
                <div className="skeleton h-4 w-1/3 rounded" />
                <div className="skeleton h-9 w-full rounded-lg" />
            </div>
        </div>
    );
}

export function Products() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const data = await allProducts();
                setProducts(data);
            } catch (error) {
                console.error("Error al cargar productos:", error);
            }
        }
        loadProducts();
    }, []);

    return (
        <main className="min-h-[calc(100vh-4rem)] bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                {/* Page header */}
                <div className="mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                        Nuestros Productos
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        {products.length > 0
                            ? `${products.length} productos disponibles`
                            : "Cargando catálogo..."}
                    </p>
                </div>

                {/* Loading state — skeleton grid */}
                {products.length === 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <ProductCardSkeleton key={i} />
                        ))}
                    </div>
                ) : (
                    /* Product grid */
                    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 list-none p-0 m-0">
                        {products.map((product) => (
                            <li key={product.id}>
                                <Link
                                    to={`/products/${product.sku}`}
                                    className="group flex flex-col rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden h-full"
                                >
                                    {/* Product image */}
                                    <figure className="relative h-48 bg-gray-50 overflow-hidden flex items-center justify-center p-4">
                                        {product.url ? (
                                            <img
                                                src={product.url}
                                                alt={product.productName}
                                                className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            /* Placeholder when no image */
                                            <div className="flex flex-col items-center gap-2 text-gray-300" aria-hidden="true">
                                                <svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                                </svg>
                                                <span className="text-xs">Sin imagen</span>
                                            </div>
                                        )}
                                    </figure>

                                    {/* Product info */}
                                    <div className="flex flex-col flex-1 p-4">
                                        <p className="text-xs text-gray-400 font-mono mb-1 uppercase tracking-wider">
                                            SKU: {product.sku}
                                        </p>
                                        <h2 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 flex-1">
                                            {product.productName}
                                        </h2>
                                        <div className="mt-3 flex items-center justify-between">
                                            <span className="text-base font-bold text-[#0066FF]">
                                                ${parseFloat(product.price).toFixed(2)}
                                            </span>
                                            <span className="inline-flex items-center gap-1 text-xs text-white bg-[#0066FF] group-hover:bg-[#0054D1] px-3 py-1 rounded-lg font-medium transition-colors duration-150">
                                                Ver detalle
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                                </svg>
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </main>
    );
}
