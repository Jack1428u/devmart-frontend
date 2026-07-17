import axios from "axios"

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:3001",
    headers: {
        'Content-Type': 'application/json',
    }
})

export const allProducts = async () =>
    await api.get('/products').then(res => res.data);


export const getProductBySku = async (sku) =>
    await api.get(`/products/${sku}`).then(res => res.data)

export const getProductByCategory = async (category) =>
    await api.get(`/products/category/${category}`).then(res => res.data)