import { useEffect, useState } from "react"
import { Link } from "react-router"
import { getAllCategories } from "../services/category.service"

export const Category = () => {
    const [categories, setCategories] = useState([])
    useEffect(() => {
        getAllCategories()
            .then(data => setCategories(data))
            .catch(error => console.error(error))
    }, [])
    return (
        <div>
            <h1>Categorias</h1>
            <ul>
                {categories.map(category => (
                    <li key={category.id}>
                        <Link to={`/categories/${category.sku}`}>
                            {category.categoryName}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}