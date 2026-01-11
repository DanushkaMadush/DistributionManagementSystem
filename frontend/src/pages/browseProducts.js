import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import productService from '../services/productService';

export default function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchTerm, products]);

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await productService.getAllProducts();
      setProducts(data.products || []);
      setFilteredProducts(data.products || []);
    } catch (err) {
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    if (!searchTerm.trim()) {
      setFilteredProducts(products);
      return;
    }
    const filtered = products.filter((product) =>
      product.ProductName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const handleAddToCart = (product) => {
    console.log('Add to cart:', product);
    alert(`${product.ProductName} added to cart!`);
  };

  const handleCheckAvailability = (product) => {
    console.log('Check availability:', product);
    alert(`Checking availability for ${product.ProductName}...`);
  };

  const handleAddProduct = () => {
    navigate('/products/add');
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Browse Products</h3>
        <button className="btn btn-success" onClick={handleAddProduct}>
          <i className="bi bi-plus-circle me-2"></i>
          Add Product
        </button>
        <button className="btn btn-info" onClick={handleAddProduct}>
          <i class="bi bi-cart-plus"></i>
          View Cart
        </button>
      </div>

      <div className="row mb-4">
        <div className="col-12 col-md-6">
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError('')}
          ></button>
        </div>
      )}

      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {!loading && (
        <>
          {filteredProducts.length === 0 ? (
            <div className="alert alert-info text-center">
              <i className="bi bi-info-circle me-2"></i>
              No products found.
            </div>
          ) : (
            <div className="row g-3">
              {filteredProducts.map((product) => (
                <div key={product.ProductId} className="col-12 col-md-6 col-lg-4">
                  <div className="card border border-dark mb-3 h-100">
                    <div className="card-header">Product Details</div>
                    <div className="card-body text-dark">
                      <h5 className="card-title">{product.ProductName}</h5>
                      <p className="card-text mb-1">
                        <strong>Price:</strong> LKR {product.unitPrice?.toFixed(2)}
                      </p>
                      <p className="card-text mb-3">
                        <strong>Unit:</strong> {product.unitOfMeasure}
                      </p>
                      <div className="d-grid gap-2">
                        <button
                          className="btn btn-primary"
                          onClick={() => handleAddToCart(product)}
                        >
                          <i className="bi bi-cart-plus me-2"></i>
                          Add to Cart
                        </button>
                        <button
                          className="btn btn-outline-secondary"
                          onClick={() => handleCheckAvailability(product)}
                        >
                          <i className="bi bi-box-seam me-2"></i>
                          Check Availability
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <div className="mt-4">
        <button className="btn btn-secondary" onClick={() => navigate('/home')}>
          <i className="bi bi-arrow-left me-2"></i>
          Back to Home
        </button>
      </div>
    </div>
  );
}