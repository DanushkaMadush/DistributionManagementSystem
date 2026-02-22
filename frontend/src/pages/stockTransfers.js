import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import productService from '../services/productService';

export default function StockTransfers() {
  const navigate = useNavigate();

  const branches = useMemo(
    () => [
      { id: 10, name: 'Jaffna' },
      { id: 2, name: 'Trincomalee' },
      { id: 3, name: 'Galle' },
      { id: 4, name: 'Colombo' },
      { id: 5, name: 'Kandy' },
    ],
    []
  );

  const demoInventory = useMemo(
    () => ({
      10: 150,
      2: 200,
      3: 85,
      4: 320,
      5: 110,
    }),
    []
  );

  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await productService.getAllProducts();
        setProducts(data.products || []);
      } catch (err) {
        setError(err.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const handleSearch = () => {
    setError('');
    if (!selectedProductId) {
      setError('Please select a product');
      return;
    }

    setSearching(true);
    try {
      const product = products.find(p => String(p.ProductId) === String(selectedProductId));
      if (product) {
        setSelectedProduct({
          ...product,
          inventory: demoInventory,
        });
      } else {
        setError('Product not found');
        setSelectedProduct(null);
      }
    } catch (err) {
      setError('Failed to fetch inventory data');
    } finally {
      setSearching(false);
    }
  };

  const handleReset = () => {
    setSelectedProductId('');
    setSelectedProduct(null);
    setError('');
  };

  return (
    <div className="container py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
        <h3 className="mb-3 mb-md-0">
          <i className="bi bi-arrow-left-right me-2"></i>
          Stock Transfers
        </h3>
        <button className="btn btn-outline-secondary" onClick={() => navigate('/home')}>
          <i className="bi bi-house me-2"></i>
          Back to Home
        </button>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}

      <div className="card border-dark mb-4">
        <div className="card-header">Search Product Inventory</div>
        <div className="card-body">
          {loading ? (
            <div className="text-center py-3">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="mt-2 mb-0">Loading products...</p>
            </div>
          ) : (
            <div className="row g-3 align-items-end">
              <div className="col-12 col-md-6">
                <label className="form-label">Select Product</label>
                <select
                  className="form-select"
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  disabled={searching}
                >
                  <option value="">-- Choose a product --</option>
                  {products.map((p) => (
                    <option key={p.ProductId} value={p.ProductId}>
                      {p.ProductName} ({p.unitOfMeasure}) - LKR {Number(p.unitPrice || 0).toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-12 col-md-6 d-flex gap-2">
                <button
                  className="btn btn-primary flex-grow-1"
                  onClick={handleSearch}
                  disabled={searching || !selectedProductId}
                >
                  {searching ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Searching...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-search me-2"></i>
                      Search
                    </>
                  )}
                </button>
                <button
                  className="btn btn-outline-secondary"
                  onClick={handleReset}
                  disabled={searching}
                >
                  <i className="bi bi-arrow-counterclockwise"></i>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedProduct && (
        <div className="card border-dark">
          <div className="card-header">
            <h5 className="mb-0">{selectedProduct.ProductName} - Branch Inventory</h5>
            <small className="text-muted">Unit: {selectedProduct.unitOfMeasure}</small>
          </div>
          <div className="card-body">
            <div className="row g-3">
              {branches.map((branch) => {
                const quantity = selectedProduct.inventory[branch.id] || 0;
                const level =
                  quantity > 150 ? 'success' : quantity > 75 ? 'warning' : quantity > 0 ? 'danger' : 'secondary';

                return (
                  <div key={branch.id} className="col-12 col-sm-6 col-lg-4">
                    <div className={`card border-${level === 'secondary' ? 'dark' : level}`}>
                      <div className="card-body">
                        <h6 className="card-title mb-2">{branch.name}</h6>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <strong>Quantity:</strong>
                          <span className={`badge bg-${level}`}>{quantity}</span>
                        </div>
                        <div className="progress" style={{ height: '25px' }}>
                          <div
                            className={`progress-bar bg-${level}`}
                            role="progressbar"
                            style={{ width: `${Math.min((quantity / 300) * 100, 100)}%` }}
                            aria-valuenow={quantity}
                            aria-valuemin="0"
                            aria-valuemax="300"
                          >
                            {Math.round((quantity / 300) * 100)}%
                          </div>
                        </div>
                        <small className="text-muted d-block mt-2">
                          {quantity === 0 ? 'Out of stock' : quantity < 75 ? 'Low stock' : 'Adequate stock'}
                        </small>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {!selectedProduct && !loading && (
        <div className="alert alert-info text-center">
          <i className="bi bi-info-circle me-2"></i>
          Select a product and click Search to view branch-wise inventory.
        </div>
      )}
    </div>
  );
}