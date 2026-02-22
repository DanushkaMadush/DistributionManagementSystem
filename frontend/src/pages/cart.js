import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import orderService from '../services/orderService';
import { getEmployeeId } from '../services/jwtService';

export default function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  };

  const saveCart = (items) => {
    localStorage.setItem('cart', JSON.stringify(items));
    setCartItems(items);
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return;

    const updatedCart = cartItems.map(item =>
      item.ProductId === productId
        ? { ...item, quantity: parseInt(newQuantity) }
        : item
    );
    saveCart(updatedCart);
  };

  const handleRemoveItem = (productId) => {
    const updatedCart = cartItems.filter(item => item.ProductId !== productId);
    saveCart(updatedCart);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.unitPrice * item.quantity);
    }, 0);
  };

  const handleCreateOrder = async () => {
    if (cartItems.length === 0) {
      setError('Cart is empty. Please add products first.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const orderData = {
        retailerId: 1, // Replace with actual retailer ID from user context
        regionalDistributionCenterId: 1, // Replace with actual RDC ID
        estimatedDeliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        items: cartItems.map(item => ({
          productId: item.ProductId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.unitPrice * item.quantity
        }))
      };

      const response = await orderService.createOrder(orderData);
      setSuccess(`Order #${response.orderId} created successfully!`);
      
      // Clear cart after successful order
      localStorage.removeItem('cart');
      setCartItems([]);

      // Redirect to orders page after 2 seconds
      setTimeout(() => {
        navigate('/orders');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  const handleContinueShopping = () => {
    navigate('/products');
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Shopping Cart</h3>
        <button className="btn btn-outline-primary" onClick={handleContinueShopping}>
          <i className="bi bi-arrow-left me-2"></i>
          Continue Shopping
        </button>
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

      {success && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <i className="bi bi-check-circle-fill me-2"></i>
          {success}
          <button
            type="button"
            className="btn-close"
            onClick={() => setSuccess('')}
          ></button>
        </div>
      )}

      {cartItems.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-cart-x" style={{ fontSize: '4rem', color: '#6c757d' }}></i>
          <h4 className="mt-3">Your cart is empty</h4>
          <p className="text-muted">Add some products to get started</p>
          <button className="btn btn-primary mt-3" onClick={handleContinueShopping}>
            Browse Products
          </button>
        </div>
      ) : (
        <>
          <div className="row">
            <div className="col-12 col-lg-8">
              {/* Cart Items */}
              {cartItems.map((item) => (
                <div key={item.ProductId} className="card border-dark mb-3">
                  <div className="card-body">
                    <div className="row align-items-center">
                      <div className="col-12 col-md-5">
                        <h5 className="card-title mb-1">{item.ProductName}</h5>
                        <p className="text-muted mb-2">
                          <small>{item.unitOfMeasure}</small>
                        </p>
                      </div>
                      <div className="col-12 col-md-3">
                        <label className="form-label small">Quantity</label>
                        <input
                          type="number"
                          className="form-control"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.ProductId, e.target.value)}
                          disabled={loading}
                        />
                      </div>
                      <div className="col-12 col-md-2">
                        <label className="form-label small">Price</label>
                        <p className="mb-0">
                          <strong>LKR {(item.unitPrice * item.quantity).toFixed(2)}</strong>
                        </p>
                        <small className="text-muted">
                          @ LKR {item.unitPrice.toFixed(2)}
                        </small>
                      </div>
                      <div className="col-12 col-md-2 text-end mt-2 mt-md-0">
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleRemoveItem(item.ProductId)}
                          disabled={loading}
                        >
                          <i className="bi bi-trash me-1"></i>
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="col-12 col-lg-4">
              <div className="card border-dark sticky-top" style={{ top: '20px' }}>
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0">Order Summary</h5>
                </div>
                <div className="card-body">
                  <div className="d-flex justify-content-between mb-2">
                    <span>Items ({cartItems.length}):</span>
                    <span>{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Subtotal:</span>
                    <span>LKR {calculateTotal().toFixed(2)}</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between mb-3">
                    <strong>Total:</strong>
                    <strong className="text-primary">LKR {calculateTotal().toFixed(2)}</strong>
                  </div>
                  <div className="d-grid">
                    <button
                      className="btn btn-success btn-lg"
                      onClick={handleCreateOrder}
                      disabled={loading || cartItems.length === 0}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Processing...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-circle me-2"></i>
                          Create Order
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="mt-4">
        <button className="btn btn-secondary" onClick={() => navigate('/home')}>
          <i className="bi bi-house me-2"></i>
          Back to Home
        </button>
      </div>
    </div>
  );
}