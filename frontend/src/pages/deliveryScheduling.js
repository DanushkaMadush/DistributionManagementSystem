import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function DeliveryScheduling() {
  const navigate = useNavigate();

  const drivers = useMemo(
    () => [
      { id: 'DRV-001', name: 'Channa Perera' },
      { id: 'DRV-002', name: 'Amal Silva' },
      { id: 'DRV-003', name: 'Nimal Fernando' },
    ],
    []
  );

  const orders = useMemo(
    () => [
      { id: 1011, customer: 'ABC Stores', status: 'Pending' },
      { id: 1012, customer: 'Sunrise Mart', status: 'Ready' },
      { id: 1013, customer: 'City Grocers', status: 'Pending' },
      { id: 1014, customer: 'Green Foods', status: 'Ready' },
      { id: 1015, customer: 'Daily Needs', status: 'Pending' },
      { id: 1016, customer: 'Island Fresh', status: 'Ready' },
    ],
    []
  );

  const [destination, setDestination] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [driverId, setDriverId] = useState('');
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const today = useMemo(() => new Date().toISOString().split('T')[0], []);

  const handleToggleOrder = (orderId) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    );
  };

  const handleToggleAll = () => {
    if (selectAll) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map((o) => o.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });

    if (!destination.trim()) {
      setMsg({ type: 'danger', text: 'Destination is required.' });
      return;
    }
    if (!scheduledDate) {
      setMsg({ type: 'danger', text: 'Scheduled date is required.' });
      return;
    }
    if (!driverId) {
      setMsg({ type: 'danger', text: 'Please select a driver.' });
      return;
    }
    if (selectedOrders.length === 0) {
      setMsg({ type: 'danger', text: 'Select at least one order to schedule.' });
      return;
    }

    setLoading(true);
    try {
      setTimeout(() => {
        setMsg({
          type: 'success',
          text: `Scheduled ${selectedOrders.length} order(s) to ${destination} on ${scheduledDate} with driver ${driverId}.`,
        });
        setLoading(false);
      }, 800);
    } catch (err) {
      setMsg({ type: 'danger', text: 'Failed to schedule delivery.' });
      setLoading(false);
    }
  };

  const handleReset = () => {
    setDestination('');
    setScheduledDate('');
    setDriverId('');
    setSelectedOrders([]);
    setSelectAll(false);
    setMsg({ type: '', text: '' });
  };

  return (
    <div className="container py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
        <h3 className="mb-3 mb-md-0">
          <i className="bi bi-calendar-check me-2"></i>
          Delivery Scheduling
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

      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          {/* Left: Form */}
          <div className="col-12 col-lg-5">
            <div className="card border-dark h-100">
              <div className="card-header">Schedule Details</div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label">Destination</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter destination address"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Scheduled Date</label>
                  <input
                    type="date"
                    className="form-control"
                    min={today}
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Driver</label>
                  <select
                    className="form-select"
                    value={driverId}
                    onChange={(e) => setDriverId(e.target.value)}
                    disabled={loading}
                  >
                    <option value="">Select a driver</option>
                    {drivers.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.id})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="card-footer bg-light d-grid gap-2 d-md-flex">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Scheduling...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check2-circle me-2"></i>
                      Schedule Delivery
                    </>
                  )}
                </button>
                <button type="button" className="btn btn-outline-secondary" onClick={handleReset} disabled={loading}>
                  <i className="bi bi-arrow-counterclockwise me-2"></i>
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Right: Orders Table */}
          <div className="col-12 col-lg-7">
            <div className="card border-dark h-100">
              <div className="card-header d-flex justify-content-between align-items-center">
                <span>Select Orders</span>
                <div className="form-check m-0">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="selectAll"
                    checked={selectAll}
                    onChange={handleToggleAll}
                    disabled={loading}
                  />
                  <label className="form-check-label" htmlFor="selectAll">
                    Select All
                  </label>
                </div>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-sm align-middle">
                    <thead>
                      <tr>
                        <th style={{ width: 50 }}></th>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((o) => {
                        const checked = selectedOrders.includes(o.id);
                        return (
                          <tr key={o.id}>
                            <td>
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={checked}
                                onChange={() => handleToggleOrder(o.id)}
                                disabled={loading}
                              />
                            </td>
                            <td className="fw-semibold">#{o.id}</td>
                            <td>{o.customer}</td>
                            <td>
                              <span
                                className={`badge ${
                                  o.status === 'Ready'
                                    ? 'bg-success'
                                    : o.status === 'Pending'
                                    ? 'bg-warning text-dark'
                                    : 'bg-secondary'
                                }`}
                              >
                                {o.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                      {orders.length === 0 && (
                        <tr>
                          <td colSpan="4" className="text-center text-muted">
                            No orders to display.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="card-footer bg-light">
                <small className="text-muted">
                  Selected Orders: {selectedOrders.length}
                </small>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}