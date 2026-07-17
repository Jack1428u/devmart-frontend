import { useEffect, useState } from "react"
import { Link } from "react-router"
import { getAllCategories } from "../services/category.service"

// Skeleton para tarjetas de categoría
function CategoryCardSkeleton() {
    return (
        <div className="rounded-2xl border border-gray-100 overflow-hidden">
            <div className="skeleton h-32 w-full" />
            <div className="p-4 space-y-2">
                <div className="skeleton h-4 w-2/3 rounded" />
                <div className="skeleton h-3 w-1/3 rounded" />
            </div>
        </div>
    );
}

export const Category = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        getAllCategories()
            .then(data => setCategories(data))
            .catch(error => console.error(error))
    }, [])

    return (
        <main className="min-h-[calc(100vh-4rem)] bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                {/* Page header */}
                <div className="mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                        Categorías
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        {categories.length > 0
                            ? `${categories.length} categorías disponibles`
                            : "Cargando categorías..."}
                    </p>
                </div>

                {/* Loading state — skeletons */}
                {categories.length === 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <CategoryCardSkeleton key={i} />
                        ))}
                    </div>
                ) : (
                    /* Category grid */
                    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 list-none p-0 m-0">
                        {categories.map(category => (
                            <li key={category.id}>
                                <Link
                                    to={`/categories/${category.sku}`}
                                    className="group flex flex-col rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden h-full"
                                >
                                    {/* Ícono / imagen de categoría */}
                                    <figure className="relative h-32 bg-[#E6F0FF] overflow-hidden flex items-center justify-center">
                                        <svg
                                            className="w-12 h-12 text-[#0066FF] group-hover:scale-110 transition-transform duration-300"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth={1.25}
                                            viewBox="0 0 24 24"
                                            aria-hidden="true"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
                                        </svg>
                                    </figure>

                                    {/* Info de categoría */}
                                    <div className="flex flex-col flex-1 p-4">
                                        <p className="text-xs text-gray-400 font-mono mb-1 uppercase tracking-wider">
                                            SKU: {category.sku}
                                        </p>
                                        <h2 className="text-sm font-semibold text-gray-900 leading-snug flex-1">
                                            {category.categoryName}
                                        </h2>
                                        <div className="mt-3">
                                            <span className="inline-flex items-center gap-1 text-xs text-white bg-[#0066FF] group-hover:bg-[#0054D1] px-3 py-1 rounded-lg font-medium transition-colors duration-150">
                                                Ver productos
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