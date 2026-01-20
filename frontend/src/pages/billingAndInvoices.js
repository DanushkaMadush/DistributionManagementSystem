import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Billing() {
  const navigate = useNavigate();

  // Demo orders with items
  const sampleOrders = useMemo(
    () => [
      {
        id: 1001,
        customer: 'ABC Stores',
        date: '2026-01-18',
        status: 'Completed',
        items: [
          { productName: 'Highland Yoghurt', quantity: 50, unitPrice: 120, total: 6000 },
          { productName: 'Anchor Milk', quantity: 30, unitPrice: 180, total: 5400 },
        ],
        subtotal: 11400,
        tax: 1140,
        total: 12540,
      },
      {
        id: 1002,
        customer: 'Sunrise Mart',
        date: '2026-01-19',
        status: 'Completed',
        items: [
          { productName: 'Rice (5kg)', quantity: 20, unitPrice: 450, total: 9000 },
          { productName: 'Dhal (1kg)', quantity: 15, unitPrice: 280, total: 4200 },
          { productName: 'Oil (1L)', quantity: 10, unitPrice: 520, total: 5200 },
        ],
        subtotal: 18400,
        tax: 1840,
        total: 20240,
      },
      {
        id: 1003,
        customer: 'City Grocers',
        date: '2026-01-20',
        status: 'Completed',
        items: [
          { productName: 'Bread Loaf', quantity: 100, unitPrice: 85, total: 8500 },
          { productName: 'Butter (200g)', quantity: 25, unitPrice: 320, total: 8000 },
        ],
        subtotal: 16500,
        tax: 1650,
        total: 18150,
      },
      {
        id: 1004,
        customer: 'Green Foods',
        date: '2026-01-20',
        status: 'Completed',
        items: [
          { productName: 'Fresh Tomatoes', quantity: 40, unitPrice: 150, total: 6000 },
          { productName: 'Onions', quantity: 30, unitPrice: 120, total: 3600 },
          { productName: 'Potatoes', quantity: 50, unitPrice: 100, total: 5000 },
        ],
        subtotal: 14600,
        tax: 1460,
        total: 16060,
      },
    ],
    []
  );

  const [orderId, setOrderId] = useState('');
  const [invoice, setInvoice] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = () => {
    setError('');
    if (!orderId.trim()) {
      setError('Please enter an Order ID');
      return;
    }

    const found = sampleOrders.find(o => String(o.id) === String(orderId));
    if (found) {
      setInvoice(found);
    } else {
      setError(`Order #${orderId} not found`);
      setInvoice(null);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    alert('PDF download functionality - In a real app, this would generate and download a PDF file.');
  };

  const handleReset = () => {
    setOrderId('');
    setInvoice(null);
    setError('');
  };

  return (
    <div className="container py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
        <h3 className="mb-3 mb-md-0">
          <i className="bi bi-receipt me-2"></i>
          Billing & Invoices
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

      {/* Search Section */}
      <div className="card border-dark mb-4">
        <div className="card-header">Search Invoice</div>
        <div className="card-body">
          <div className="row g-3 align-items-end">
            <div className="col-12 col-md-6">
              <label className="form-label">Order ID</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter order ID (e.g., 1001, 1002, 1003, 1004)"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                disabled={!!invoice}
              />
            </div>
            <div className="col-12 col-md-6 d-flex gap-2">
              <button
                className="btn btn-primary flex-grow-1"
                onClick={handleSearch}
                disabled={!!invoice}
              >
                <i className="bi bi-search me-2"></i>
                Search
              </button>
              <button
                className="btn btn-outline-secondary"
                onClick={handleReset}
              >
                <i className="bi bi-arrow-counterclockwise"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Display */}
      {invoice && (
        <div className="card border-dark">
          <div className="card-body p-4" id="invoice">
            {/* Header */}
            <div className="text-center mb-4">
              <h2 className="mb-1">IslandLink Sales & Distribution</h2>
              <p className="text-muted mb-0">
                <i className="bi bi-geo-alt me-1"></i>
                Colombo, Sri Lanka | Ph: +94 11 123 4567 | Email: info@islandlink.lk
              </p>
            </div>

            <hr />

            {/* Invoice Details */}
            <div className="row mb-4">
              <div className="col-md-6">
                <h6 className="fw-bold mb-2">Invoice Details</h6>
                <p className="mb-1">
                  <strong>Invoice #:</strong> INV-{invoice.id}
                </p>
                <p className="mb-0">
                  <strong>Date:</strong> {new Date(invoice.date).toLocaleDateString()}
                </p>
              </div>
              <div className="col-md-6 text-md-end">
                <h6 className="fw-bold mb-2">Bill To</h6>
                <p className="mb-1">
                  <strong>{invoice.customer}</strong>
                </p>
                <p className="mb-0">
                  <strong>Status:</strong>{' '}
                  <span className="badge bg-success">{invoice.status}</span>
                </p>
              </div>
            </div>

            <hr />

            {/* Items Table */}
            <div className="table-responsive mb-4">
              <table className="table table-bordered">
                <thead className="table-light">
                  <tr>
                    <th>Product</th>
                    <th className="text-end" style={{ width: '80px' }}>Qty</th>
                    <th className="text-end" style={{ width: '100px' }}>Unit Price</th>
                    <th className="text-end" style={{ width: '100px' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.productName}</td>
                      <td className="text-end">{item.quantity}</td>
                      <td className="text-end">LKR {item.unitPrice.toFixed(2)}</td>
                      <td className="text-end">LKR {item.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="row mb-4">
              <div className="col-md-6 offset-md-6">
                <div className="card border-light">
                  <div className="card-body">
                    <div className="d-flex justify-content-between mb-2">
                      <span>Subtotal:</span>
                      <strong>LKR {invoice.subtotal.toFixed(2)}</strong>
                    </div>
                    <div className="d-flex justify-content-between mb-3">
                      <span>Tax (10%):</span>
                      <strong>LKR {invoice.tax.toFixed(2)}</strong>
                    </div>
                    <div className="border-top pt-2 d-flex justify-content-between">
                      <span className="fw-bold">Total Amount:</span>
                      <strong className="text-primary fs-5">LKR {invoice.total.toFixed(2)}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center border-top pt-3">
              <p className="text-muted small mb-0">
                Thank you for your business! Payment terms: Net 30 days
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="card-footer bg-light d-flex flex-column flex-md-row gap-2 justify-content-md-end">
            <button
              className="btn btn-outline-primary"
              onClick={handlePrint}
            >
              <i className="bi bi-printer me-2"></i>
              Print
            </button>
            <button
              className="btn btn-outline-success"
              onClick={handleDownloadPDF}
            >
              <i className="bi bi-file-pdf me-2"></i>
              Download PDF
            </button>
            <button
              className="btn btn-outline-secondary"
              onClick={handleReset}
            >
              <i className="bi bi-x-circle me-2"></i>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!invoice && !error && (
        <div className="alert alert-info text-center">
          <i className="bi bi-info-circle me-2"></i>
          Enter an Order ID to view and generate an invoice. Try: 1001, 1002, 1003, or 1004
        </div>
      )}

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          .btn, .card-footer, .alert, .input-group, .form-label {
            display: none !important;
          }
          .container {
            max-width: 100%;
            margin: 0;
          }
          .card {
            border: none !important;
            box-shadow: none !important;
          }
          #invoice {
            padding: 20px !important;
          }
        }
      `}</style>
    </div>
  );
}