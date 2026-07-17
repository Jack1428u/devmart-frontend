import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginService, logoutService, registerService, refreshTokenService } from '../services/auth.service';

// Creamos el contexto
const AuthContext = createContext();

/**
 * Decodifica el payload de un JWT sin librerías externas.
 * Retorna null si el token es inválido o no existe.
 */
const decodeToken = (token) => {
    try {
        const base64Payload = token.split('.')[1];
        return JSON.parse(atob(base64Payload));
    } catch {
        return null;
    }
};

/**
 * Verifica si un token JWT está vencido.
 * Retorna true si está vencido o si el token es inválido.
 */
const isTokenExpired = (token) => {
    const decoded = decodeToken(token);
    if (!decoded?.exp) return true;
    // exp es en segundos, Date.now() en milisegundos
    return decoded.exp * 1000 < Date.now();
};

export const AuthProvider = ({ children }) => {
    // Inicializamos el estado leyendo directamente del localStorage (Lazy initialization)
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [token, setToken] = useState(() => {
        return localStorage.getItem('auth_token') || null;
    });

    const [isLoading, setIsLoading] = useState(false);

    /**
     * Renueva el token vencido llamando al endpoint /auth/refresh.
     * Actualiza el estado de React y el localStorage con el nuevo token.
     * Si falla (token adulterado o customer eliminado), hace logout limpio.
     */
    const refreshToken = useCallback(async () => {
        const currentToken = localStorage.getItem('auth_token');
        if (!currentToken) return;
        try {
            const newToken = await refreshTokenService(currentToken);
            // Actualizamos el token en estado y localStorage
            setToken(newToken);
            localStorage.setItem('auth_token', newToken);
        } catch (error) {
            console.error("No se pudo renovar el token, cerrando sesión:", error);
            // Si el refresh falla (firma inválida, usuario eliminado), forzamos logout
            setUser(null);
            setToken(null);
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
        }
    }, []);

    /**
     * Efecto de inicialización: al montar la app, si hay un token guardado
     * pero está vencido, lo renueva automáticamente en segundo plano.
     * El usuario no percibe la interrupción.
     */
    useEffect(() => {
        const savedToken = localStorage.getItem('auth_token');
        if (savedToken && isTokenExpired(savedToken)) {
            refreshToken();
        }
    }, [refreshToken]);

    const login = async (email, password) => {
        setIsLoading(true);
        try {
            const data = await loginService(email, password);
            
            // 1. Guardar en el estado de React
            setToken(data.token);
            const userData = { id: data.id, name: data.name, email: data.email };
            setUser(userData);

            // 2. Persistir en localStorage para que sobreviva recargas de página
            localStorage.setItem('auth_token', data.token);
            localStorage.setItem('user', JSON.stringify(userData));

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        } finally {
            setIsLoading(false);
        }
    };
    const register = async (name, email, password) => {
        setIsLoading(true);
        try {
            const data = await registerService(name, email, password);
            
            // 1. Guardar en el estado de React
            setToken(data.token);
            const userData = { id: data.id, name: data.name, email: data.email };
            setUser(userData);

            // 2. Persistir en localStorage para que sobreviva recargas de página
            localStorage.setItem('auth_token', data.token);
            localStorage.setItem('user', JSON.stringify(userData));

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        } finally {
            setIsLoading(false);
        }
    }

    const logout = async () => {
        setIsLoading(true);
        try {
            await logoutService();
        } finally {
            // Limpiamos el estado de React
            setUser(null);
            setToken(null);
            
            // Limpiamos el localStorage
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, isLoading, login, logout, register, refreshToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe usarse dentro de un AuthProvider");
    }
    return context;
};
