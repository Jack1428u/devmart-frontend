import { Link } from "react-router"
import Branding from "../assets/branding_offer.png"

export default function Home() {
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

                        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                            <Link
                                to="/products"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-[#0066FF] hover:bg-[#0054D1] transition-colors duration-150 shadow-sm"
                            >
                                Ver productos
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                </svg>
                            </Link>
                            <Link
                                to="/categories"
                                className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-semibold text-gray-700 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors duration-150"
                            >
                                Explorar categorías
                            </Link>
                        </div>

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