import Home from './pages/Home'
import { Products } from './pages/Products'
import { ProductDetail } from './pages/ProductDetail'
import { Category } from './pages/Category'
import { CategoryDetail } from './pages/CategoryDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import { Cart } from './pages/Cart'
import NavBar from './layouts/NavBar'
import { AuthProvider } from './context/AuthContext'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router'
import { CartProvider } from './context/CartContext'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <NavBar />
          <Routes>
            {/* Etiquetas limpias de cierre automático */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path='/products/:sku' element={<ProductDetail />} />
            <Route path="*" element={<Navigate to="/" replace />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/categories' element={<Category />} />
            <Route path='/categories/:sku' element={<CategoryDetail />} />
          </Routes>
        </BrowserRouter>

      </CartProvider>

    </AuthProvider>
  )
}

export default App;
