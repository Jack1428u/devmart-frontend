import { useEffect, useState } from "react";
import { useParams } from "react-router"
import { getProductsBySku } from "../services/category.service"

export const CategoryDetail = () => {
    const { sku } = useParams();
    const [products, setProducts] = useState([])
    useEffect(() => {
        getProductsBySku(sku).then(data => setProducts(data)).catch(error => console.error(error))
    }, [sku])
    return (
        <div>
            <h1>Category Detail</h1>
            {products.map(product => (
                <div key={product.id}>
                    <h2>{product.productName}</h2>
                    <p>{product.sku}</p>
                    <p>${product.price}</p>
                </div>
            ))}
        </div>
    )
}