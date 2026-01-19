import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import productService from '../services/productService';
import { hasAnyRole } from '../services/jwtService';

export default function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Check if user has admin/manager/rdc/finance role
  const canManageProducts = hasAnyRole(['Admin', 'RDC', 'Manager', 'FINANCE']);

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
  const savedCart = localStorage.getItem('cart');
  let cart = savedCart ? JSON.parse(savedCart) : [];

  const existingItemIndex = cart.findIndex(item => item.ProductId === product.ProductId);

  if (existingItemIndex !== -1) {
    cart[existingItemIndex].quantity += 1;
  } else {
    cart.push({
      ...product,
      quantity: 1
    });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  
  alert(`${product.ProductName} added to cart!`);
};

  const handleCheckAvailability = (product) => {
    console.log('Check availability:', product);
    alert(`Checking availability for ${product.ProductName}...`);
  };

  const handleEditProduct = (product) => {
    console.log('Edit product:', product);
    navigate(`/products/edit/${product.ProductId}`);
  };

  const handleAddProduct = () => {
    navigate('/products/add');
  };

  const handleViewCart = () => {
    navigate('/cart');
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Browse Products</h3>
        <div className="d-flex gap-2">
          {canManageProducts && (
            <button className="btn btn-success" onClick={handleAddProduct} style={{ marginRight: '10px' }}>
              <i className="bi bi-plus-circle me-2"></i>
              Add Product
            </button>
          )}
          <button className="btn btn-info" onClick={handleViewCart}>
            <i className="bi bi-cart-plus me-2"></i>
            View Cart
          </button>
        </div>
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
                        {canManageProducts && (
                          <button
                            className="btn btn-outline-warning"
                            onClick={() => handleEditProduct(product)}
                          >
                            <i className="bi bi-pencil-square me-2"></i>
                            Edit Product
                          </button>
                        )}
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