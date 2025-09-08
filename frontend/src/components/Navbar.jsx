import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const Navbar = () => {
  const { user, logout } = useAuth()
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    fetchCartCount()
  }, [])

  const fetchCartCount = async () => {
    try {
      const response = await api.get('/cart')
      const count = response.data.cart.items.reduce((total, item) => total + item.quantity, 0)
      setCartCount(count)
    } catch (error) {
      console.error('Error fetching cart count:', error)
    }
  }

  return (
    <nav className="navbar">
      <div className="container">
        <div className="nav-content">
          <NavLink to="/products" className="nav-brand">
            ShopEasy
          </NavLink>
          <div className="nav-links">
            <NavLink 
              to="/products" 
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            >
              Products
            </NavLink>

            <NavLink 
              to="/cart" 
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            >
              Cart
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </NavLink>

            <span className="nav-link">Welcome {user?.name}</span>

            <button onClick={logout} className="btn btn-secondary">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
