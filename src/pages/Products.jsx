import { useEffect, useState } from "react"
import { allProducts } from "../services/product.service.js"
import { ProductCard, ProductCardSkeleton } from "../components/ProductCard"

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
                                <ProductCard product={product} />
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </main>
    );
}
