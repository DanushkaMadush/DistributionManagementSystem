import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Reports() {
  const navigate = useNavigate();

  const reportTypes = useMemo(
    () => [
      { id: 'sales', name: 'Sales Report', description: 'Detailed sales data by branch and product' },
      { id: 'inventory', name: 'Inventory Report', description: 'Current stock levels across branches' },
      { id: 'orders', name: 'Orders Report', description: 'Order summary and fulfillment status' },
      { id: 'payments', name: 'Payments Report', description: 'Payment collection and outstanding invoices' },
      { id: 'delivery', name: 'Delivery Report', description: 'Delivery performance and timelines' },
      { id: 'customer', name: 'Customer Report', description: 'Customer activity and purchase history' },
    ],
    []
  );

  // Demo report data
  const sampleReportData = useMemo(
    () => ({
      sales: [
        { branch: 'Colombo', product: 'Dairy Products', quantity: 520, amount: 95000, date: '2026-01-15' },
        { branch: 'Colombo', product: 'Grains', quantity: 340, amount: 82000, date: '2026-01-15' },
        { branch: 'Galle', product: 'Vegetables', quantity: 280, amount: 45000, date: '2026-01-15' },
        { branch: 'Kandy', product: 'Beverages', quantity: 190, amount: 38000, date: '2026-01-15' },
        { branch: 'Jaffna', product: 'Snacks', quantity: 150, amount: 28000, date: '2026-01-16' },
        { branch: 'Trincomalee', product: 'Dairy Products', quantity: 210, amount: 42000, date: '2026-01-16' },
      ],
      inventory: [
        { branch: 'Jaffna', product: 'Highland Yoghurt', stock: 150, minLevel: 100, status: 'Good' },
        { branch: 'Trincomalee', product: 'Anchor Milk', stock: 200, minLevel: 150, status: 'Good' },
        { branch: 'Galle', product: 'Rice (5kg)', stock: 85, minLevel: 100, status: 'Low' },
        { branch: 'Colombo', product: 'Oil (1L)', stock: 320, minLevel: 200, status: 'Good' },
        { branch: 'Kandy', product: 'Bread Loaf', stock: 110, minLevel: 80, status: 'Good' },
        { branch: 'Colombo', product: 'Butter (200g)', stock: 45, minLevel: 60, status: 'Critical' },
      ],
      orders: [
        { orderId: 1001, customer: 'ABC Stores', status: 'Delivered', total: 12540, date: '2026-01-18' },
        { orderId: 1002, customer: 'Sunrise Mart', status: 'Pending', total: 20240, date: '2026-01-19' },
        { orderId: 1003, customer: 'City Grocers', status: 'Delivered', total: 18150, date: '2026-01-20' },
        { orderId: 1004, customer: 'Green Foods', status: 'In Transit', total: 16060, date: '2026-01-20' },
        { orderId: 1005, customer: 'Island Fresh', status: 'Delivered', total: 14320, date: '2026-01-21' },
      ],
      payments: [
        { invoiceId: 'INV-1001', customer: 'ABC Stores', amount: 12540, status: 'Paid', dueDate: '2026-02-17' },
        { invoiceId: 'INV-1002', customer: 'Sunrise Mart', amount: 20240, status: 'Pending', dueDate: '2026-02-19' },
        { invoiceId: 'INV-1003', customer: 'City Grocers', amount: 18150, status: 'Overdue', dueDate: '2026-02-10' },
        { invoiceId: 'INV-1004', customer: 'Green Foods', amount: 16060, status: 'Paid', dueDate: '2026-02-20' },
      ],
      delivery: [
        { shipmentId: 'SHIP-001', destination: 'Colombo', status: 'Delivered', date: '2026-01-20', driver: 'John Perera' },
        { shipmentId: 'SHIP-002', destination: 'Galle', status: 'In Transit', date: '2026-01-21', driver: 'Amal Silva' },
        { shipmentId: 'SHIP-003', destination: 'Kandy', status: 'Pending', date: '2026-01-21', driver: 'Nimali Fernando' },
        { shipmentId: 'SHIP-004', destination: 'Jaffna', status: 'Delivered', date: '2026-01-19', driver: 'John Perera' },
      ],
      customer: [
        { customerId: 'CUST-001', name: 'ABC Stores', totalOrders: 12, totalSpent: 125400, lastOrder: '2026-01-20' },
        { customerId: 'CUST-002', name: 'Sunrise Mart', totalOrders: 8, totalSpent: 98500, lastOrder: '2026-01-19' },
        { customerId: 'CUST-003', name: 'City Grocers', totalOrders: 15, totalSpent: 156200, lastOrder: '2026-01-18' },
        { customerId: 'CUST-004', name: 'Green Foods', totalOrders: 6, totalSpent: 78900, lastOrder: '2026-01-20' },
      ],
    }),
    []
  );

  const today = useMemo(() => new Date().toISOString().split('T')[0], []);
  const thirtyDaysAgo = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split('T')[0];
  }, []);

  const [dateFrom, setDateFrom] = useState(thirtyDaysAgo);
  const [dateTo, setDateTo] = useState(today);
  const [selectedReport, setSelectedReport] = useState('');
  const [generatedReport, setGeneratedReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateReport = () => {
    setError('');
    if (!dateFrom || !dateTo) {
      setError('Please select both date range');
      return;
    }
    if (!selectedReport) {
      setError('Please select a report type');
      return;
    }
    if (new Date(dateFrom) > new Date(dateTo)) {
      setError('Date From cannot be after Date To');
      return;
    }

    setLoading(true);
    try {
      setTimeout(() => {
        const reportData = sampleReportData[selectedReport] || [];
        setGeneratedReport({
          type: reportTypes.find(r => r.id === selectedReport),
          dateFrom,
          dateTo,
          data: reportData,
          generatedAt: new Date().toLocaleString(),
        });
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError('Failed to generate report');
      setLoading(false);
    }
  };

  const handleExportExcel = () => {
    alert(`Excel export for ${generatedReport.type.name} - In a real app, this would download an .xlsx file`);
  };

  const handleExportCSV = () => {
    alert(`CSV export for ${generatedReport.type.name} - In a real app, this would download a .csv file`);
  };

  const handleExportPDF = () => {
    alert(`PDF export for ${generatedReport.type.name} - In a real app, this would download a .pdf file`);
  };

  const handleReset = () => {
    setDateFrom(thirtyDaysAgo);
    setDateTo(today);
    setSelectedReport('');
    setGeneratedReport(null);
    setError('');
  };

  const renderReportTable = () => {
    if (!generatedReport || !generatedReport.data.length) return null;

    const reportType = generatedReport.type.id;
    const data = generatedReport.data;

    if (reportType === 'sales') {
      return (
        <table className="table table-sm table-hover">
          <thead className="table-light">
            <tr>
              <th>Branch</th>
              <th>Product</th>
              <th className="text-end">Quantity</th>
              <th className="text-end">Amount (LKR)</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx}>
                <td>{row.branch}</td>
                <td>{row.product}</td>
                <td className="text-end">{row.quantity}</td>
                <td className="text-end">{row.amount.toLocaleString()}</td>
                <td>{row.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (reportType === 'inventory') {
      return (
        <table className="table table-sm table-hover">
          <thead className="table-light">
            <tr>
              <th>Branch</th>
              <th>Product</th>
              <th className="text-end">Current Stock</th>
              <th className="text-end">Min Level</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx}>
                <td>{row.branch}</td>
                <td>{row.product}</td>
                <td className="text-end">{row.stock}</td>
                <td className="text-end">{row.minLevel}</td>
                <td>
                  <span className={`badge bg-${row.status === 'Good' ? 'success' : row.status === 'Low' ? 'warning' : 'danger'}`}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (reportType === 'orders') {
      return (
        <table className="table table-sm table-hover">
          <thead className="table-light">
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Status</th>
              <th className="text-end">Total (LKR)</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx}>
                <td className="fw-bold">#{row.orderId}</td>
                <td>{row.customer}</td>
                <td>
                  <span className={`badge bg-${row.status === 'Delivered' ? 'success' : row.status === 'Pending' ? 'warning' : 'info'}`}>
                    {row.status}
                  </span>
                </td>
                <td className="text-end">{row.total.toLocaleString()}</td>
                <td>{row.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (reportType === 'payments') {
      return (
        <table className="table table-sm table-hover">
          <thead className="table-light">
            <tr>
              <th>Invoice ID</th>
              <th>Customer</th>
              <th className="text-end">Amount (LKR)</th>
              <th>Status</th>
              <th>Due Date</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx}>
                <td className="fw-bold">{row.invoiceId}</td>
                <td>{row.customer}</td>
                <td className="text-end">{row.amount.toLocaleString()}</td>
                <td>
                  <span className={`badge bg-${row.status === 'Paid' ? 'success' : row.status === 'Pending' ? 'warning' : 'danger'}`}>
                    {row.status}
                  </span>
                </td>
                <td>{row.dueDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (reportType === 'delivery') {
      return (
        <table className="table table-sm table-hover">
          <thead className="table-light">
            <tr>
              <th>Shipment ID</th>
              <th>Destination</th>
              <th>Status</th>
              <th>Driver</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx}>
                <td className="fw-bold">{row.shipmentId}</td>
                <td>{row.destination}</td>
                <td>
                  <span className={`badge bg-${row.status === 'Delivered' ? 'success' : row.status === 'In Transit' ? 'info' : 'warning'}`}>
                    {row.status}
                  </span>
                </td>
                <td>{row.driver}</td>
                <td>{row.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (reportType === 'customer') {
      return (
        <table className="table table-sm table-hover">
          <thead className="table-light">
            <tr>
              <th>Customer ID</th>
              <th>Name</th>
              <th className="text-end">Total Orders</th>
              <th className="text-end">Total Spent (LKR)</th>
              <th>Last Order</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx}>
                <td className="fw-bold">{row.customerId}</td>
                <td>{row.name}</td>
                <td className="text-end">{row.totalOrders}</td>
                <td className="text-end">{row.totalSpent.toLocaleString()}</td>
                <td>{row.lastOrder}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
        <h3 className="mb-3 mb-md-0">
          <i className="bi bi-file-earmark-text me-2"></i>
          Reports
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

      {/* Report Generator */}
      <div className="card border-dark mb-4">
        <div className="card-header">Generate Report</div>
        <div className="card-body">
          <div className="row g-3 mb-3">
            <div className="col-12 col-md-3">
              <label className="form-label">Date From</label>
              <input
                type="date"
                className="form-control"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="col-12 col-md-3">
              <label className="form-label">Date To</label>
              <input
                type="date"
                className="form-control"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">Select Report</label>
              <select
                className="form-select"
                value={selectedReport}
                onChange={(e) => setSelectedReport(e.target.value)}
                disabled={loading}
              >
                <option value="">-- Choose a report --</option>
                {reportTypes.map((report) => (
                  <option key={report.id} value={report.id}>
                    {report.name}
                  </option>
                ))}
              </select>
              {selectedReport && (
                <small className="text-muted d-block mt-1">
                  {reportTypes.find(r => r.id === selectedReport)?.description}
                </small>
              )}
            </div>
          </div>

          <div className="d-grid gap-2 d-md-flex">
            <button
              className="btn btn-primary"
              onClick={handleGenerateReport}
              disabled={loading || !selectedReport}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Generating...
                </>
              ) : (
                <>
                  <i className="bi bi-arrow-repeat me-2"></i>
                  Generate Report
                </>
              )}
            </button>
            <button
              className="btn btn-outline-secondary"
              onClick={handleReset}
              disabled={loading}
            >
              <i className="bi bi-arrow-counterclockwise me-2"></i>
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Generated Report */}
      {generatedReport && (
        <div className="card border-dark">
          <div className="card-header d-flex justify-content-between align-items-center">
            <div>
              <h6 className="mb-1">{generatedReport.type.name}</h6>
              <small className="text-muted">
                {new Date(generatedReport.dateFrom).toLocaleDateString()} to {new Date(generatedReport.dateTo).toLocaleDateString()}
              </small>
            </div>
            <small className="text-muted">Generated: {generatedReport.generatedAt}</small>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              {renderReportTable()}
            </div>
          </div>
          <div className="card-footer bg-light d-flex flex-column flex-md-row gap-2 justify-content-md-end">
            <button className="btn btn-outline-success" onClick={handleExportExcel}>
              <i className="bi bi-file-earmark-excel me-2"></i>
              Export as Excel
            </button>
            <button className="btn btn-outline-info" onClick={handleExportCSV}>
              <i className="bi bi-file-earmark-text me-2"></i>
              Export as CSV
            </button>
            <button className="btn btn-outline-danger" onClick={handleExportPDF}>
              <i className="bi bi-file-earmark-pdf me-2"></i>
              Export as PDF
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!generatedReport && !loading && (
        <div className="alert alert-info text-center">
          <i className="bi bi-info-circle me-2"></i>
          Select date range and report type, then click Generate Report to view data.
        </div>
      )}
    </div>
  );
}