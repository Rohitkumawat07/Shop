import React, { useState, useEffect } from 'react'
import api from '../services/api'


const Cart = () => {
  const [cart, setCart] = useState({ items: [], total: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      const response = await api.get('/cart')
      setCart(response.data.cart)
    } catch (error) {
      setError('Error fetching cart')
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (productId, quantity) => {
    try {
      const response = await api.put('/cart/update', { productId, quantity })
      setCart(response.data.cart)
    } catch (error) {
      setError('Error updating cart')
      setTimeout(() => setError(''), 3000)
    }
  }

  const removeItem = async (productId) => {
    try {
      const response = await api.delete(`/cart/remove/${productId}`)
      setCart(response.data.cart)
    } catch (error) {
      setError('Error removing item')
      setTimeout(() => setError(''), 3000)
    }
  }

  if (loading) return <div className="loading">Loading cart...</div>

  return (
    <div className="cart-container">
      <div className="container">
        <div className="cart-header">
          <h1 className="cart-title">Shopping Cart</h1>
        </div>

        {error && <div className="error">{error}</div>}

        {cart.items.length === 0 ? (
          <div className="empty-cart">
            <h3>Your cart is empty</h3>
            <p>Add some products to get started!</p>
            <a href="/products" className="btn btn-primary">Continue Shopping</a>
          </div>
        ) : (
          <div className="cart-items">
            {cart.items.map(item => (
              <div key={item.product._id} className="cart-item">
                <img 
                  src={item.product.image} 
                  alt={item.product.name}
                  className="cart-item-image"
                />
                <div className="cart-item-info">
                  <h3 className="cart-item-name">{item.product.name}</h3>
                  <p className="cart-item-price">${item.product.price}</p>
                </div>
                <div className="cart-item-controls">
                  <div className="quantity-controls">
                    <button 
                      className="quantity-btn"
                      onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span className="quantity-display">{item.quantity}</span>
                    <button 
                      className="quantity-btn"
                      onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <button 
                    className="remove-btn"
                    onClick={() => removeItem(item.product._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            
            <div className="cart-summary">
              <div className="cart-total">
                Total: ${cart.total.toFixed(2)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart