import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import productService from '../services/productService';

export default function Inventory() {
  const navigate = useNavigate();

  const branches = useMemo(
    () => [
      { id: 1, name: 'Jaffna' },
      { id: 2, name: 'Trincomalee' },
      { id: 3, name: 'Galle' },
      { id: 4, name: 'Colombo' },
      { id: 5, name: 'Kandy' },
    ],
    []
  );

  const [branchId, setBranchId] = useState('');
  const [date, setDate] = useState('');
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const today = useMemo(() => new Date().toISOString().split('T')[0], []);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setMsg({ type: '', text: '' });
      try {
        const data = await productService.getAllProducts();
        setProducts(data.products || []);
      } catch (err) {
        setMsg({ type: 'danger', text: err.message || 'Failed to load products' });
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });

    if (!branchId) return setMsg({ type: 'danger', text: 'Please select a branch.' });
    if (!date) return setMsg({ type: 'danger', text: 'Please select a date.' });
    if (!productId) return setMsg({ type: 'danger', text: 'Please select a product.' });
    if (!quantity || parseFloat(quantity) <= 0) return setMsg({ type: 'danger', text: 'Please enter a valid quantity.' });

    setSaving(true);
    try {
      const branchName = branches.find(b => String(b.id) === String(branchId))?.name || branchId;
      const product = products.find(p => String(p.ProductId) === String(productId));
      setMsg({
        type: 'success',
        text: `Saved: ${branchName} | ${date} | ${product?.ProductName || productId} | Qty: ${quantity}`,
      });
    } catch {
      setMsg({ type: 'danger', text: 'Failed to save inventory.' });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setBranchId('');
    setDate('');
    setProductId('');
    setQuantity('');
    setMsg({ type: '', text: '' });
  };

  return (
    <div className="container py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
        <h3 className="mb-3 mb-md-0">
          <i className="bi bi-box-seam me-2"></i>
          Inventory Management
        </h3>
        <button className="btn btn-outline-secondary" onClick={() => navigate('/home')}>
          <i className="bi bi-house me-2"></i>
          Back to Home
        </button>
      </div>

      {msg.text && (
        <div className={`alert alert-${msg.type} alert-dismissible fade show`} role="alert">
          {msg.text}
          <button type="button" className="btn-close" onClick={() => setMsg({ type: '', text: '' })}></button>
        </div>
      )}

      <div className="card border-dark">
        <div className="card-header">Select Details</div>
        <div className="card-body">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="mt-2 mb-0">Loading products...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-12 col-md-4">
                  <label className="form-label">Branch</label>
                  <select
                    className="form-select"
                    value={branchId}
                    onChange={(e) => setBranchId(e.target.value)}
                    disabled={saving}
                  >
                    <option value="">Select branch</option>
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.id} - {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-12 col-md-4">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    className="form-control"
                    min={today}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    disabled={saving}
                  />
                </div>

                <div className="col-12 col-md-4">
                  <label className="form-label">Product</label>
                  <select
                    className="form-select"
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    disabled={saving}
                  >
                    <option value="">Select product</option>
                    {products.map((p) => (
                      <option key={p.ProductId} value={p.ProductId}>
                        {p.ProductName} {p.unitOfMeasure ? `(${p.unitOfMeasure})` : ''} — LKR {Number(p.unitPrice || 0).toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-12 col-md-4">
                  <label className="form-label">Quantity</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Enter quantity"
                    step="0.01"
                    min="0"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    disabled={saving}
                  />
                </div>
              </div>

              <div className="d-grid gap-2 d-md-flex mt-3">
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check2-circle me-2"></i>
                      Save
                    </>
                  )}
                </button>
                <button type="button" className="btn btn-outline-secondary" onClick={handleReset} disabled={saving}>
                  <i className="bi bi-arrow-counterclockwise me-2"></i>
                  Reset
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}