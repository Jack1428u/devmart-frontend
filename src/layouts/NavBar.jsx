import { useState } from "react"
import { Link, NavLink } from "react-router"
import { useAuth } from "../context/AuthContext"
import { useCart } from "../context/CartContext"

export default function NavBar() {
    const { user, isAuthenticated, logout } = useAuth();
    const { cart } = useCart();
    const [mobileOpen, setMobileOpen] = useState(false);

    const itemCount = cart?.totalItems || 0;

    const navLinkClass = ({ isActive }) =>
        `text-sm font-medium transition-colors duration-150 ${
            isActive
                ? "text-[#0066FF]"
                : "text-gray-500 hover:text-gray-900"
        }`;

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <Link
                        to="/"
                        className="flex items-center gap-1 text-xl font-bold tracking-tight select-none"
                    >
                        <span className="text-[#0066FF]">Dev</span>
                        <span className="text-gray-900">Mart</span>
                    </Link>

                    {/* Nav links — desktop */}
                    <nav className="hidden md:flex items-center gap-8">
                        <NavLink to="/products" className={navLinkClass}>
                            Productos
                        </NavLink>
                        <NavLink to="/categories" className={navLinkClass}>
                            Categorías
                        </NavLink>
                    </nav>

                    {/* Actions — desktop */}
                    <div className="hidden md:flex items-center gap-4">
                        {/* Carrito */}
                        <Link
                            to="/cart"
                            className="relative flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors duration-150"
                            aria-label={`Carrito, ${itemCount} items`}
                        >
                            {/* Cart icon */}
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={1.75}
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                            </svg>
                            <span>Carrito</span>
                            {itemCount > 0 && (
                                <span className="absolute -top-2 -right-3 flex h-4 w-4 items-center justify-center rounded-full bg-[#0066FF] text-[10px] font-bold text-white leading-none">
                                    {itemCount > 99 ? "99+" : itemCount}
                                </span>
                            )}
                        </Link>

                        {/* Auth */}
                        {isAuthenticated ? (
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-600">
                                    Hola,{" "}
                                    <span className="font-semibold text-gray-900">{user?.name}</span>
                                </span>
                                <button
                                    onClick={logout}
                                    className="text-sm font-medium text-gray-500 hover:text-gray-900 border border-gray-200 rounded-lg px-3 py-1.5 transition-colors duration-150 hover:border-gray-300"
                                >
                                    Salir
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="inline-flex items-center justify-center text-sm font-semibold text-white bg-[#0066FF] hover:bg-[#0054D1] rounded-lg px-4 py-2 transition-colors duration-150"
                            >
                                Iniciar Sesión
                            </Link>
                        )}
                    </div>

                    {/* Mobile — hamburger + cart */}
                    <div className="flex md:hidden items-center gap-3">
                        <Link
                            to="/cart"
                            className="relative p-1 text-gray-500 hover:text-gray-900 transition-colors"
                            aria-label="Carrito"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                            </svg>
                            {itemCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#0066FF] text-[10px] font-bold text-white leading-none">
                                    {itemCount}
                                </span>
                            )}
                        </Link>
                        <button
                            onClick={() => setMobileOpen((prev) => !prev)}
                            className="p-1 text-gray-500 hover:text-gray-900 transition-colors"
                            aria-label="Abrir menú"
                        >
                            {mobileOpen ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile dropdown menu */}
            {mobileOpen && (
                <div className="md:hidden border-t border-gray-100 bg-white px-4 pb-4 pt-3 space-y-3">
                    <NavLink
                        to="/products"
                        className={({ isActive }) =>
                            `block text-sm font-medium py-2 ${isActive ? "text-[#0066FF]" : "text-gray-700 hover:text-gray-900"}`
                        }
                        onClick={() => setMobileOpen(false)}
                    >
                        Productos
                    </NavLink>
                    <NavLink
                        to="/categories"
                        className={({ isActive }) =>
                            `block text-sm font-medium py-2 ${isActive ? "text-[#0066FF]" : "text-gray-700 hover:text-gray-900"}`
                        }
                        onClick={() => setMobileOpen(false)}
                    >
                        Categorías
                    </NavLink>
                    <div className="pt-2 border-t border-gray-100">
                        {isAuthenticated ? (
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">
                                    Hola, <span className="font-semibold text-gray-900">{user?.name}</span>
                                </span>
                                <button
                                    onClick={() => { logout(); setMobileOpen(false); }}
                                    className="text-sm font-medium text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5"
                                >
                                    Salir
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                onClick={() => setMobileOpen(false)}
                                className="flex items-center justify-center w-full text-sm font-semibold text-white bg-[#0066FF] hover:bg-[#0054D1] rounded-lg px-4 py-2.5 transition-colors"
                            >
                                Iniciar Sesión
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}