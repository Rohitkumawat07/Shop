import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Login from './components/Login'
import Signup from './components/Signup'
import ProductList from './components/ProductList'
import Cart from './components/Cart'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <Router>
      <div className="App">
        {user && <Navbar />}
        <Routes>
          <Route path="/login" element={
            user ? <Navigate to="/products" /> : <Login />
          } />
          <Route path="/signup" element={
            user ? <Navigate to="/products" /> : <Signup />
          } />
          <Route path="/products" element={
            <ProtectedRoute>
              <ProductList />
            </ProtectedRoute>
          } />
          <Route path="/cart" element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          } />
          <Route path="/" element={
            user ? <Navigate to="/products" /> : <Navigate to="/login" />
          } />
        </Routes>
      </div>
    </Router>
  )
}

export default App