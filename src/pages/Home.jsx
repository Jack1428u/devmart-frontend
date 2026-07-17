import { useEffect, useRef, useState } from "react"
import { Link } from "react-router"
import Branding from "../assets/branding_offer.png"
import { allProducts } from "../services/product.service.js"
import { getAllCategories } from "../services/category.service"
import { ProductCard, ProductCardSkeleton } from "../components/ProductCard"

// ─── Carrusel deslizable reutilizable ────────────────────────────────────────
function HorizontalScroll({ children }) {
    const ref = useRef(null);

    const scroll = (dir) => {
        if (!ref.current) return;
        ref.current.scrollBy({ left: dir * 280, behavior: "smooth" });
    };

    return (
        <div className="relative group/carousel">
            {/* Botón izquierda */}
            <button
                onClick={() => scroll(-1)}
                aria-label="Desplazar a la izquierda"
                className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 items-center justify-center w-8 h-8 rounded-full border border-gray-200 bg-white shadow-sm text-gray-500 hover:text-gray-900 hover:border-gray-300 transition-all duration-150 opacity-0 group-hover/carousel:opacity-100"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
            </button>

            {/* Contenedor con scroll horizontal */}
            <div
                ref={ref}
                className="flex gap-4 overflow-x-auto pb-3 scroll-smooth snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
                {children}
            </div>

            {/* Botón derecha */}
            <button
                onClick={() => scroll(1)}
                aria-label="Desplazar a la derecha"
                className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 items-center justify-center w-8 h-8 rounded-full border border-gray-200 bg-white shadow-sm text-gray-500 hover:text-gray-900 hover:border-gray-300 transition-all duration-150 opacity-0 group-hover/carousel:opacity-100"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
            </button>
        </div>
    );
}

// ─── Tarjeta de categoría compacta para el carrusel ──────────────────────────
function CategoryChip({ category }) {
    return (
        <Link
            to={`/categories/${category.sku}`}
            className="group flex-shrink-0 snap-start flex flex-col items-center justify-center gap-2 w-32 h-28 rounded-2xl border border-gray-100 hover:border-[#0066FF] hover:shadow-sm transition-all duration-200 text-center px-2"
        >
            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#E6F0FF] text-[#0066FF] group-hover:bg-[#0066FF] group-hover:text-white transition-colors duration-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
                </svg>
            </span>
            <span className="text-xs font-medium text-gray-700 group-hover:text-gray-900 leading-tight line-clamp-2">
                {category.categoryName}
            </span>
        </Link>
    );
}

// ─── Skeleton para chips de categoría ────────────────────────────────────────
function CategoryChipSkeleton() {
    return (
        <div className="flex-shrink-0 w-32 h-28 rounded-2xl border border-gray-100 overflow-hidden flex flex-col items-center justify-center gap-2 px-3">
            <div className="skeleton w-10 h-10 rounded-xl" />
            <div className="skeleton h-3 w-16 rounded" />
        </div>
    );
}

// ─── Tarjeta de producto compacta para el carrusel ───────────────────────────
function ProductSlide({ product }) {
    return (
        <div className="flex-shrink-0 snap-start w-52">
            <ProductCard product={product} />
        </div>
    );
}

// ─── Skeleton para slides de producto ────────────────────────────────────────
function ProductSlideSkeleton() {
    return (
        <div className="flex-shrink-0 w-52">
            <ProductCardSkeleton />
        </div>
    );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function Home() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        allProducts()
            .then(data => setProducts(data.slice(0, 10)))
            .catch(err => console.error("Error al cargar productos:", err));

        getAllCategories()
            .then(data => setCategories(data))
            .catch(err => console.error("Error al cargar categorías:", err));
    }, []);

    return (
        <main className="min-h-[calc(100vh-4rem)] bg-white">

            {/* ── Hero Section ── */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                <div className="flex flex-col-reverse md:flex-row items-center gap-12 md:gap-16">

                    {/* Text column */}
                    <div className="flex-1 text-center md:text-left">
                        {/* Eyebrow label */}
                        <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[#0066FF] mb-4">
                            Tu tienda tech
                        </span>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight">
                            ¿Compra lo que{" "}
                            <span className="text-[#0066FF]">quieras</span>{" "}
                            en un solo lugar!
                        </h1>

                        <p className="mt-5 text-base sm:text-lg text-gray-500 leading-relaxed max-w-xl mx-auto md:mx-0">
                            Encuentra los mejores productos de tecnología, periféricos y accesorios.
                            Entrega rápida, precios justos y soporte real.
                        </p>

                        {/* Trust badges */}
                        <div className="mt-10 flex flex-wrap gap-6 justify-center md:justify-start text-xs text-gray-400 font-medium">
                            <span className="flex items-center gap-1.5">
                                <svg className="w-4 h-4 text-[#0066FF]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                                Envíos seguros
                            </span>
                            <span className="flex items-center gap-1.5">
                                <svg className="w-4 h-4 text-[#0066FF]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                                Pago 100% seguro
                            </span>
                            <span className="flex items-center gap-1.5">
                                <svg className="w-4 h-4 text-[#0066FF]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                                Soporte 24/7
                            </span>
                        </div>
                    </div>

                    {/* Image column */}
                    <div className="flex-1 flex justify-center md:justify-end">
                        <div className="relative w-full max-w-md">
                            {/* Subtle accent ring behind image */}
                            <div
                                className="absolute inset-0 rounded-3xl bg-[#E6F0FF]"
                                style={{ transform: "rotate(3deg) scale(1.03)" }}
                                aria-hidden="true"
                            />
                            <img
                                src={Branding}
                                alt="Oferta destacada de DevMart"
                                className="relative z-10 w-full rounded-3xl shadow-md object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Categorías carousel ── */}
            <section className="border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                    {/* Section header */}
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-lg font-bold text-gray-900 tracking-tight">
                            Buscar por categoría
                        </h2>
                        <Link
                            to="/categories"
                            className="flex items-center gap-1 text-sm font-medium text-[#0066FF] hover:text-[#0054D1] transition-colors duration-150"
                        >
                            Ver todas
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                            </svg>
                        </Link>
                    </div>

                    <HorizontalScroll>
                        {categories.length === 0
                            ? Array.from({ length: 8 }).map((_, i) => (
                                <CategoryChipSkeleton key={i} />
                            ))
                            : categories.map(category => (
                                <CategoryChip key={category.id} category={category} />
                            ))
                        }
                    </HorizontalScroll>
                </div>
            </section>

            {/* ── Productos recientes carousel ── */}
            <section className="border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                    {/* Section header */}
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-lg font-bold text-gray-900 tracking-tight">
                            Productos
                        </h2>
                        <Link
                            to="/products"
                            className="flex items-center gap-1 text-sm font-medium text-[#0066FF] hover:text-[#0054D1] transition-colors duration-150"
                        >
                            Ver más
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                            </svg>
                        </Link>
                    </div>

                    <HorizontalScroll>
                        {products.length === 0
                            ? Array.from({ length: 6 }).map((_, i) => (
                                <ProductSlideSkeleton key={i} />
                            ))
                            : products.map(product => (
                                <ProductSlide key={product.id} product={product} />
                            ))
                        }
                    </HorizontalScroll>
                </div>
            </section>

            {/* ── Feature strip ── */}
            <section className="border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <ul className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {[
                            {
                                icon: (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                                    </svg>
                                ),
                                title: "Envío express",
                                desc: "Recibe tu pedido en 24–48 h hábiles.",
                            },
                            {
                                icon: (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                                    </svg>
                                ),
                                title: "Compra segura",
                                desc: "Tus datos y pagos siempre protegidos.",
                            },
                            {
                                icon: (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.712 4.33a9.027 9.027 0 0 1 1.652 1.306c.51.51.944 1.064 1.306 1.652M16.712 4.33l-3.448 4.138m3.448-4.138a9.014 9.014 0 0 0-9.424 0M19.67 7.288l-4.138 3.448m4.138-3.448a9.014 9.014 0 0 1 0 9.424m-4.138-5.976a3.736 3.736 0 0 0-.88-1.388 3.737 3.737 0 0 0-1.388-.88m2.268 2.268a3.765 3.765 0 0 1 0 2.528m-2.268-4.796a3.765 3.765 0 0 0-2.528 0m4.796 4.796c-.181.506-.475.982-.88 1.388a3.736 3.736 0 0 1-1.388.88m2.268-2.268 4.138 3.448m0 0a9.027 9.027 0 0 1-1.306 1.652c-.51.51-1.064.944-1.652 1.306m0 0-3.448-4.138m3.448 4.138a9.014 9.014 0 0 1-9.424 0m5.976-4.138a3.765 3.765 0 0 1-2.528 0m0 0a3.736 3.736 0 0 1-1.388-.88 3.737 3.737 0 0 1-.88-1.388m2.268 2.268L7.288 19.67m0 0a9.024 9.024 0 0 1-1.652-1.306 9.027 9.027 0 0 1-1.306-1.652m0 0 4.138-3.448M4.33 16.712a9.014 9.014 0 0 1 0-9.424m4.138 5.976a3.765 3.765 0 0 1 0-2.528m0 0c.181-.506.475-.982.88-1.388a3.736 3.736 0 0 1 1.388-.88m-2.268 2.268L4.33 7.288m6.406 1.18L7.288 4.33m0 0a9.024 9.024 0 0 1 1.652-1.306A9.025 9.025 0 0 1 10.59 1.72" />
                                    </svg>
                                ),
                                title: "Soporte real",
                                desc: "Asistencia de personas, no bots.",
                            },
                        ].map((feature) => (
                            <li key={feature.title} className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors duration-150">
                                <span className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-[#E6F0FF] text-[#0066FF]">
                                    {feature.icon}
                                </span>
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">{feature.title}</p>
                                    <p className="text-sm text-gray-500 mt-0.5">{feature.desc}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
        </main>
    );
}