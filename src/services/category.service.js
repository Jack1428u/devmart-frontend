import axios from "axios"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
})

export const getAllCategories = async () => {
    try {
        const response = await api.get('/categories');
        return response.data;
    } catch (error) {
        console.error('Error al obtener categorías:', error);
        throw error;
    }
}

export const getProductsBySku = async (sku) => {
    try {
        const response = await api.get(`/categories/${sku}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener productos por sku:', error);
        throw error;
    }
}