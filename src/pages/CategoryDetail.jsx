import { useEffect, useState } from "react";
import { useParams, Link } from "react-router"
import { getProductsBySku } from "../services/category.service"
import { ProductCard, ProductCardSkeleton } from "../components/ProductCard"

export const CategoryDetail = () => {
    const { sku } = useParams();
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        getProductsBySku(sku)
            .then(data => setProducts(data))
            .catch(error => console.error(error))
            .finally(() => setIsLoading(false));
    }, [sku])

    return (
        <main className="min-h-[calc(100vh-4rem)] bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                {/* Breadcrumb */}
                <nav className="mb-6 flex items-center gap-2 text-sm text-gray-400" aria-label="Breadcrumb">
                    <Link to="/categories" className="hover:text-gray-700 transition-colors duration-150">
                        Categorías
                    </Link>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                    <span className="text-gray-700 font-medium uppercase tracking-wide">{sku}</span>
                </nav>

                {/* Page header */}
                <div className="mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight capitalize">
                        {sku}
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        {isLoading
                            ? "Cargando productos..."
                            : products.length > 0
                                ? `${products.length} productos en esta categoría`
                                : "No hay productos en esta categoría"}
                    </p>
                </div>

                {/* Loading state — skeleton grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <ProductCardSkeleton key={i} />
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    /* Estado vacío */
                    <div className="flex flex-col items-center justify-center text-center py-20">
                        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100 text-gray-400 mb-6">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                        </div>
                        <p className="text-gray-700 font-semibold">Sin productos disponibles</p>
                        <p className="mt-1 text-sm text-gray-400">Esta categoría no tiene productos en este momento.</p>
                        <Link
                            to="/categories"
                            className="mt-6 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#0066FF] hover:bg-[#0054D1] transition-colors duration-150 shadow-sm"
                        >
                            ← Volver a categorías
                        </Link>
                    </div>
                ) : (
                    /* Product grid usando el componente reutilizable */
                    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 list-none p-0 m-0">
                        {products.map(product => (
                            <li key={product.id}>
                                <ProductCard product={product} />
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </main>
    );
}