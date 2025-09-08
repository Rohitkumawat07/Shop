import React, { useState, useEffect } from 'react';
import api from '../services/api';
import '../styles/ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    minPrice: '',
    maxPrice: '',
    search: ''
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [filters]);

  // Fetch categories from backend
  const fetchCategories = async () => {
    try {
      const response = await api.get('/products/categories/all');
      setCategories(response.data.categories);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  // Fetch products based on filters
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (filters.category !== 'all') params.append('category', filters.category);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.search) params.append('search', filters.search);

      const response = await api.get(`/products?${params}`);
      setProducts(response.data.products);
    } catch (err) {
      setError('Error fetching products');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };


  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  
  const addToCart = async (productId) => {
    try {
      await api.post('/cart/add', { productId, quantity: 1 });
      setSuccess('Product added to cart!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Error adding to cart');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="products-container">
      <div className="container">
        {/* Filters Section */}
        <div className="filters-section">
          <div className="filters-grid">
            <div className="filter-group">
              <label className="form-label">Search Products</label>
              <input
                type="text"
                name="search"
                placeholder="Search products..."
                value={filters.search}
                onChange={handleFilterChange}
              />
            </div>

            <div className="filter-group">
              <label className="form-label">Category</label>
              <select name="category" value={filters.category} onChange={handleFilterChange}>
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="form-label">Min Price</label>
              <input
                type="number"
                name="minPrice"
                placeholder="Min price"
                value={filters.minPrice}
                onChange={handleFilterChange}
              />
            </div>

            <div className="filter-group">
              <label className="form-label">Max Price</label>
              <input
                type="number"
                name="maxPrice"
                placeholder="Max price"
                value={filters.maxPrice}
                onChange={handleFilterChange}
              />
            </div>
          </div>
        </div>

        {/* Feedback Messages */}
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        {/* Products Grid */}
        {loading ? (
          <div className="loading">Loading products...</div>
        ) : (
          <div className="products-grid">
            {products.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
                <h3>No products found</h3>
                <p>Try adjusting your filters</p>
              </div>
            ) : (
              products.map(product => (
                <div key={product._id} className="product-card">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="product-image"
                  />
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-description">{product.description}</p>
                    <div className="product-footer">
                      <span className="product-price">${product.price}</span>
                      <span className="product-category">{product.category}</span>
                    </div>
                    <button 
                      className="add-to-cart-btn"
                      onClick={() => addToCart(product._id)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
