import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import productService from '../services/productService';

export default function EditProduct() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [formData, setFormData] = useState({
    productName: '',
    unitPrice: '',
    unitOfMeasure: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  const fetchProductDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await productService.getProductById(productId);
      setFormData({
        productName: data.product.ProductName,
        unitPrice: data.product.unitPrice,
        unitOfMeasure: data.product.unitOfMeasure
      });
    } catch (err) {
      setError(err.message || 'Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    // Validation
    if (!formData.productName.trim()) {
      setError('Product name is required');
      setSubmitting(false);
      return;
    }

    if (!formData.unitPrice || parseFloat(formData.unitPrice) <= 0) {
      setError('Unit price must be greater than 0');
      setSubmitting(false);
      return;
    }

    if (!formData.unitOfMeasure.trim()) {
      setError('Unit of measure is required');
      setSubmitting(false);
      return;
    }

    try {
      await productService.updateProduct(productId, formData);
      setSuccess(`Product "${formData.productName}" updated successfully!`);

      // Redirect after 1.5 seconds
      setTimeout(() => {
        navigate('/products');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to update product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/products');
  };

  if (loading) {
    return (
      <div className="container py-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading product details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card border-dark">
            <div className="card-header bg-warning text-dark">
              <h5 className="mb-0">Edit Product</h5>
            </div>
            <div className="card-body">
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

              <form onSubmit={handleSubmit}>
                {/* Product Name */}
                <div className="mb-3">
                  <label htmlFor="productName" className="form-label">
                    Product Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="productName"
                    name="productName"
                    placeholder="Enter product name"
                    value={formData.productName}
                    onChange={handleChange}
                    disabled={submitting}
                  />
                </div>

                {/* Unit Price */}
                <div className="mb-3">
                  <label htmlFor="unitPrice" className="form-label">
                    Unit Price (LKR) <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="unitPrice"
                    name="unitPrice"
                    placeholder="Enter unit price"
                    step="0.01"
                    min="0"
                    value={formData.unitPrice}
                    onChange={handleChange}
                    disabled={submitting}
                  />
                </div>

                {/* Unit of Measure */}
                <div className="mb-3">
                  <label htmlFor="unitOfMeasure" className="form-label">
                    Unit of Measure <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select"
                    id="unitOfMeasure"
                    name="unitOfMeasure"
                    value={formData.unitOfMeasure}
                    onChange={handleChange}
                    disabled={submitting}
                  >
                    <option value="">Select unit of measure</option>
                    <option value="kg">Kilogram (kg)</option>
                    <option value="g">Gram (g)</option>
                    <option value="l">Liter (L)</option>
                    <option value="ml">Milliliter (ml)</option>
                    <option value="pcs">Pieces (pcs)</option>
                    <option value="box">Box</option>
                    <option value="pack">Pack</option>
                    <option value="bottle">Bottle</option>
                  </select>
                </div>

                {/* Buttons */}
                <div className="d-grid gap-2 d-md-flex">
                  <button
                    type="submit"
                    className="btn btn-warning"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Updating...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-pencil-square me-2"></i>
                        Update Product
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleCancel}
                    disabled={submitting}
                  >
                    <i className="bi bi-x-circle me-2"></i>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}