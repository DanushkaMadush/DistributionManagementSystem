import React, { useEffect, useState } from 'react';
import orderService from '../services/orderService';
import { getEmployeeId } from '../services/jwtService';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      const createdBy = getEmployeeId();
      if (!createdBy) {
        setError('User not authenticated.');
        setLoading(false);
        return;
      }
      try {
        const data = await orderService.getOrdersByCreatedBy(createdBy);
        setOrders(data.orders || []);
      } catch (err) {
        setError(err.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const openOrder = (order) => {
    setSelected(order);
    setInfo('');
    setError('');
  };

  const closeModal = () => {
    setSelected(null);
  };

  const handleCancelOrder = async () => {
    if (!selected) return;
    setActionLoading(true);
    setError('');
    setInfo('');
    try {
      await orderService.updateOrder(selected.OrderId, {
        orderStatus: 'Cancelled',
      });
      setOrders((prev) =>
        prev.map((o) =>
          o.OrderId === selected.OrderId ? { ...o, OrderStatus: 'Cancelled' } : o
        )
      );
      setSelected((prev) => prev && { ...prev, OrderStatus: 'Cancelled' });
      setInfo('Order cancelled.');
    } catch (err) {
      setError(err.message || 'Failed to cancel order');
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmOrder = async () => {
    if (!selected) return;
    setActionLoading(true);
    setError('');
    setInfo('');
    try {
      await orderService.updateOrder(selected.OrderId, {
        orderStatus: 'Confirmed',
        isConfirmed: true,
      });
      setOrders((prev) =>
        prev.map((o) =>
          o.OrderId === selected.OrderId
            ? { ...o, OrderStatus: 'Confirmed', isConfirmed: true }
            : o
        )
      );
      setSelected((prev) => prev && { ...prev, OrderStatus: 'Confirmed', isConfirmed: true });
      setInfo('Order updated.');
    } catch (err) {
      setError(err.message || 'Failed to update order');
    } finally {
      setActionLoading(false);
    }
  };

  const renderStatusBadge = (status) => {
    const map = {
      Confirmed: 'success',
      Pending: 'warning',
      Cancelled: 'danger',
    };
    return (
      <span className={`badge bg-${map[status] || 'secondary'}`}>
        {status || 'N/A'}
      </span>
    );
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>My Orders</h3>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}
      {info && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {info}
          <button type="button" className="btn-close" onClick={() => setInfo('')}></button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
          <p className="mt-2">Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="alert alert-info">No orders found.</div>
      ) : (
        <div className="list-group">
          {orders.map((o) => (
            <button
              key={o.OrderId}
              className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
              onClick={() => openOrder(o)}
            >
              <div>
                <div className="fw-bold">Order #{o.OrderId}</div>
                <small className="text-muted">
                  Status: {renderStatusBadge(o.OrderStatus)}{' '}
                  {o.isConfirmed !== undefined && (
                    <span className="ms-2 badge bg-light text-dark">
                      Confirmed: {String(o.isConfirmed)}
                    </span>
                  )}
                </small>
              </div>
              <i className="bi bi-chevron-right"></i>
            </button>
          ))}
        </div>
      )}

      {/* Modal */}
      {selected && (
        <div className="modal fade show" style={{ display: 'block', zIndex: 1055 }} tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div className="modal-content border-dark">
              <div className="modal-header">
                <h5 className="modal-title">Order #{selected.OrderId}</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <div>Status: {renderStatusBadge(selected.OrderStatus)}</div>
                  {selected.isConfirmed !== undefined && (
                    <div className="mt-1">
                      <span className="badge bg-light text-dark">
                        Confirmed: {String(selected.isConfirmed)}
                      </span>
                    </div>
                  )}
                  <div className="mt-2">
                    <small className="text-muted">
                      Retailer: {selected.RetailerId || '-'} | RDC: {selected.RegionalDistributionCenterId || '-'}
                    </small>
                  </div>
                  <div>
                    <small className="text-muted">
                      ETA: {selected.EstimatedDeliveryDate
                        ? new Date(selected.EstimatedDeliveryDate).toLocaleDateString()
                        : '-'}
                    </small>
                  </div>
                </div>

                <h6 className="mb-2">Items</h6>
                {selected.items && selected.items.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th className="text-end">Qty</th>
                          <th className="text-end">Unit Price</th>
                          <th className="text-end">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selected.items.map((it) => (
                          <tr key={it.OrderItemId}>
                            <td>{it.ProductId}</td>
                            <td className="text-end">{it.Quantity}</td>
                            <td className="text-end">LKR {Number(it.UnitPrice || it.unitPrice || 0).toFixed(2)}</td>
                            <td className="text-end">LKR {Number(it.Total || it.total || (it.UnitPrice || it.unitPrice || 0) * it.Quantity).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-muted">No items found.</p>
                )}
              </div>
              <div className="modal-footer d-flex flex-column flex-md-row justify-content-between">
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={handleCancelOrder}
                    disabled={actionLoading}
                  >
                    {actionLoading ? 'Working...' : 'Cancel Order'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-warning"
                    onClick={handleConfirmOrder}
                    disabled={actionLoading}
                  >
                    {actionLoading ? 'Working...' : 'Update/Confirm'}
                  </button>
                </div>
                <button type="button" className="btn btn-secondary" onClick={closeModal} disabled={actionLoading}>
                  Close
                </button>
              </div>
            </div>
          </div>
          {/* Backdrop (non-blocking) */}
          <div
            className="modal-backdrop fade show"
            style={{ zIndex: 1040, pointerEvents: 'none' }}
          ></div>
        </div>
      )}
    </div>
  );
}