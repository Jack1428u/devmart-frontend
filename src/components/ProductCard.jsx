import { Link } from "react-router";

/**
 * ProductCard — Tarjeta reutilizable de producto.
 *
 * Props:
 *  - product: { id, sku, productName, price, url? }
 *  - linkTo: ruta del Link (default: `/products/${product.sku}`)
 */
export function ProductCard({ product, linkTo }) {
    const href = linkTo ?? `/products/${product.sku}`;

    return (
        <Link
            to={href}
            className="group flex flex-col rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden h-full"
        >
            {/* Imagen del producto */}
            <figure className="relative h-48 bg-gray-50 overflow-hidden flex items-center justify-center p-4">
                {product.url ? (
                    <img
                        src={product.url}
                        alt={product.productName}
                        className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    /* Placeholder cuando no hay imagen */
                    <div className="flex flex-col items-center gap-2 text-gray-300" aria-hidden="true">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                        </svg>
                        <span className="text-xs">Sin imagen</span>
                    </div>
                )}
            </figure>

            {/* Info del producto */}
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
    );
}

/**
 * ProductCardSkeleton — Placeholder animado para el estado de carga.
 */
export function ProductCardSkeleton() {
    return (
        <div className="rounded-2xl border border-gray-100 overflow-hidden">
            <div className="skeleton h-48 w-full" />
            <div className="p-4 space-y-3">
                <div className="skeleton h-3 w-24 rounded" />
                <div className="skeleton h-4 w-3/4 rounded" />
                <div className="skeleton h-4 w-1/3 rounded" />
                <div className="skeleton h-9 w-full rounded-lg" />
            </div>
        </div>
    );
}
