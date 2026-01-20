import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Payments() {
  const navigate = useNavigate();

  const sampleInvoices = useMemo(
    () => [
      {
        id: 1001,
        invoiceNumber: 'INV-1001',
        customer: 'ABC Stores',
        amount: 12540,
        status: 'Pending',
        dueDate: '2026-02-17',
      },
      {
        id: 1002,
        invoiceNumber: 'INV-1002',
        customer: 'Sunrise Mart',
        amount: 20240,
        status: 'Pending',
        dueDate: '2026-02-19',
      },
      {
        id: 1003,
        invoiceNumber: 'INV-1003',
        customer: 'City Grocers',
        amount: 18150,
        status: 'Pending',
        dueDate: '2026-02-20',
      },
      {
        id: 1004,
        invoiceNumber: 'INV-1004',
        customer: 'Green Foods',
        amount: 16060,
        status: 'Paid',
        dueDate: '2026-02-20',
      },
    ],
    []
  );

  const paymentMethods = [
    { id: 'cheque', label: 'Cheque', icon: 'bi-credit-card' },
    { id: 'cod', label: 'Cash on Delivery', icon: 'bi-cash-coin' },
    { id: 'online', label: 'Online Payment', icon: 'bi-credit-card-2-front' },
  ];

  const [invoiceId, setInvoiceId] = useState('');
  const [invoice, setInvoice] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState('');
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSearch = () => {
    setError('');
    setSuccess('');
    setInvoice(null);
    setSelectedMethod('');

    if (!invoiceId.trim()) {
      setError('Please enter an Invoice ID or Order ID');
      return;
    }

    setLoading(true);
    try {
      const found = sampleInvoices.find(
        inv => String(inv.id) === String(invoiceId) || inv.invoiceNumber === invoiceId
      );
      if (found) {
        setInvoice(found);
      } else {
        setError(`Invoice/Order #${invoiceId} not found`);
      }
    } catch (err) {
      setError('Failed to search invoice');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentMethodChange = (methodId) => {
    setSelectedMethod(methodId);
    setError('');
  };

  const handlePayment = async () => {
    setError('');
    setSuccess('');

    if (!selectedMethod) {
      setError('Please select a payment method');
      return;
    }

    if (invoice.status === 'Paid') {
      setError('This invoice has already been paid');
      return;
    }

    setProcessing(true);
    try {
      if (selectedMethod === 'online') {
        setTimeout(() => {
          setSuccess('Redirecting to online payment portal...');
          setTimeout(() => {
            alert('Online Payment Portal - In a real app, this would redirect to a payment gateway.');
            setProcessing(false);
          }, 1500);
        }, 500);
      } else {
        setTimeout(() => {
          setSuccess(`Payment of LKR ${invoice.amount.toFixed(2)} via ${paymentMethods.find(m => m.id === selectedMethod).label} has been recorded successfully!`);
          setInvoice({ ...invoice, status: 'Paid' });
          setProcessing(false);
        }, 1500);
      }
    } catch (err) {
      setError('Payment processing failed');
      setProcessing(false);
    }
  };

  const handleReset = () => {
    setInvoiceId('');
    setInvoice(null);
    setSelectedMethod('');
    setError('');
    setSuccess('');
  };

  return (
    <div className="container py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
        <h3 className="mb-3 mb-md-0">
          <i className="bi bi-wallet2 me-2"></i>
          Payments
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

      {success && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <i className="bi bi-check-circle-fill me-2"></i>
          {success}
          <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
        </div>
      )}

      <div className="card border-dark mb-4">
        <div className="card-header">Search Invoice</div>
        <div className="card-body">
          <div className="row g-3 align-items-end">
            <div className="col-12 col-md-8">
              <label className="form-label">Invoice ID or Order ID</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Invoice ID (e.g., 1001) or Invoice Number (e.g., INV-1001)"
                value={invoiceId}
                onChange={(e) => setInvoiceId(e.target.value)}
                disabled={loading || processing}
              />
              <small className="text-muted">Try: 1001, 1002, 1003, or 1004</small>
            </div>
            <div className="col-12 col-md-4 d-flex gap-2">
              <button
                className="btn btn-primary flex-grow-1"
                onClick={handleSearch}
                disabled={loading || processing}
              >
                {loading ? (
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
                disabled={processing}
              >
                <i className="bi bi-arrow-counterclockwise"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {invoice && (
        <div className="row g-3">
          {/* Invoice Summary */}
          <div className="col-12 col-lg-5">
            <div className="card border-dark h-100">
              <div className="card-header">Invoice Details</div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label text-muted">Invoice Number</label>
                  <p className="fw-bold mb-0">{invoice.invoiceNumber}</p>
                </div>
                <div className="mb-3">
                  <label className="form-label text-muted">Customer</label>
                  <p className="fw-bold mb-0">{invoice.customer}</p>
                </div>
                <div className="mb-3">
                  <label className="form-label text-muted">Due Date</label>
                  <p className="mb-0">
                    {new Date(invoice.dueDate).toLocaleDateString()}
                  </p>
                </div>
                <hr />
                <div className="mb-3">
                  <label className="form-label text-muted">Status</label>
                  <p className="mb-0">
                    <span
                      className={`badge ${
                        invoice.status === 'Paid' ? 'bg-success' : 'bg-warning text-dark'
                      }`}
                    >
                      {invoice.status}
                    </span>
                  </p>
                </div>
                <div className="p-3 bg-light rounded">
                  <small className="text-muted d-block mb-1">Total Amount Due</small>
                  <h4 className="text-primary mb-0">LKR {invoice.amount.toFixed(2)}</h4>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-7">
            <div className="card border-dark h-100">
              <div className="card-header">Select Payment Method</div>
              <div className="card-body">
                <div className="row g-3 mb-4">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="col-12 col-md-6">
                      <div
                        className={`card border cursor-pointer h-100 ${
                          selectedMethod === method.id ? 'border-primary bg-light' : 'border-light'
                        }`}
                        onClick={() => handlePaymentMethodChange(method.id)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="card-body text-center">
                          <i className={`bi ${method.icon} fs-3 text-primary mb-2 d-block`}></i>
                          <h6 className="card-title mb-0">{method.label}</h6>
                          {selectedMethod === method.id && (
                            <small className="text-success d-block mt-2">
                              <i className="bi bi-check-circle-fill me-1"></i>
                              Selected
                            </small>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedMethod && (
                  <div className="alert alert-info">
                    <i className="bi bi-info-circle me-2"></i>
                    {selectedMethod === 'cheque' && 'Please make cheque payable to IslandLink Sales & Distribution'}
                    {selectedMethod === 'cod' && 'Payment will be collected upon delivery'}
                    {selectedMethod === 'online' && 'You will be redirected to our secure online payment portal'}
                  </div>
                )}

                <button
                  className="btn btn-success btn-lg w-100"
                  onClick={handlePayment}
                  disabled={!selectedMethod || processing || invoice.status === 'Paid'}
                >
                  {processing ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Processing...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-circle me-2"></i>
                      Proceed to Payment
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {!invoice && !error && (
        <div className="alert alert-info text-center">
          <i className="bi bi-info-circle me-2"></i>
          Enter an Invoice ID or Order ID to proceed with payment. Available IDs: 1001, 1002, 1003, 1004
        </div>
      )}
    </div>
  );
}