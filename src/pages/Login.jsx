import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
// import { useNavigate } from 'react-router-dom'; // Descomenta si usas React Router

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState(null);

    // Extraemos las funciones de nuestro contexto global
    const { login, isLoading, isAuthenticated } = useAuth();
    // const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg(null);

        if (!email || !password) {
            setErrorMsg("Por favor, llena todos los campos.");
            return;
        }

        // Llamamos al método login del AuthContext
        const result = await login(email, password);

        if (result.success) {
            console.log("Sesión iniciada correctamente");
            // navigate('/'); // Redirigir al Home tras iniciar sesión
        } else {
            setErrorMsg(result.error);
        }
    };

    // Si ya está logueado, podemos mostrar un mensaje alternativo o redirigirlo
    if (isAuthenticated) {
        return (
            <main className="min-h-[calc(100vh-4rem)] bg-white flex items-center justify-center px-4">
                <div className="text-center max-w-sm mx-auto py-20">
                    <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-[#E6F0FF] text-[#0066FF] mx-auto mb-6">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">¡Ya has iniciado sesión!</h2>
                    <p className="mt-2 text-sm text-gray-500">Bienvenido de vuelta.</p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-[calc(100vh-4rem)] bg-white flex items-center justify-center px-4">
            <div className="w-full max-w-md">

                {/* Header */}
                <div className="text-center mb-8">
                    {/* Logo mark */}
                    <span className="inline-flex items-center gap-1 text-2xl font-bold tracking-tight mb-6">
                        <span className="text-[#0066FF]">Dev</span>
                        <span className="text-gray-900">Mart</span>
                    </span>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                        Bienvenido de vuelta
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Inicia sesión en tu cuenta para continuar
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">

                    {/* Error alert */}
                    {errorMsg && (
                        <div
                            role="alert"
                            className="flex items-start gap-2.5 mb-6 px-4 py-3 rounded-xl text-sm font-medium text-red-700 bg-red-50 border border-red-200"
                        >
                            <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                            </svg>
                            {errorMsg}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Email field */}
                        <div>
                            <label
                                htmlFor="login-email"
                                className="block text-sm font-medium text-gray-700 mb-1.5"
                            >
                                Correo Electrónico
                            </label>
                            <input
                                id="login-email"
                                type="email"
                                autoComplete="email"
                                placeholder="correo@ejemplo.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 text-sm text-gray-900 rounded-xl border border-gray-200 bg-white outline-none placeholder:text-gray-400 focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/20 transition-all duration-150"
                            />
                        </div>

                        {/* Password field */}
                        <div>
                            <label
                                htmlFor="login-password"
                                className="block text-sm font-medium text-gray-700 mb-1.5"
                            >
                                Contraseña
                            </label>
                            <input
                                id="login-password"
                                type="password"
                                autoComplete="current-password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 text-sm text-gray-900 rounded-xl border border-gray-200 bg-white outline-none placeholder:text-gray-400 focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/20 transition-all duration-150"
                            />
                        </div>

                        {/* Submit */}
                        <button
                            id="login-submit"
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 mt-2 rounded-xl text-sm font-semibold text-white bg-[#0066FF] hover:bg-[#0054D1] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-150 shadow-sm"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Verificando...
                                </>
                            ) : (
                                'Iniciar Sesión'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}