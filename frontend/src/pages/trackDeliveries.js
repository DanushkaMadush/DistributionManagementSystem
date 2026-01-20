import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Deliveries() {
  const navigate = useNavigate();

  const orders = useMemo(
    () => [
      { id: 1001, name: 'Order #1001', lat: 6.9271, lon: 79.8612, status: 'In Transit', lastUpdate: '2026-01-20 10:15' },
      { id: 1002, name: 'Order #1002', lat: 7.2906, lon: 80.6337, status: 'Out for Delivery', lastUpdate: '2026-01-20 11:00' },
      { id: 1003, name: 'Order #1003', lat: 9.6615, lon: 80.0255, status: 'Pending Dispatch', lastUpdate: '2026-01-19 16:40' },
      { id: 1004, name: 'Order #1004', lat: 5.9549, lon: 80.5540, status: 'Delivered', lastUpdate: '2026-01-18 14:05' },
      { id: 1005, name: 'Order #1005', lat: 8.3114, lon: 80.4037, status: 'In Transit', lastUpdate: '2026-01-20 09:25' },
    ],
    []
  );

  const [selectedId, setSelectedId] = useState(orders[0]?.id || '');
  const [trackedOrder, setTrackedOrder] = useState(orders[0] || null);
  const [viewType, setViewType] = useState('map');

  const handleTrack = () => {
    const found = orders.find((o) => String(o.id) === String(selectedId));
    setTrackedOrder(found || null);
  };

  const getOsmEmbedUrl = (lat, lon) => {
    const d = 0.05;
    const bbox = `${lon - d},${lat - d},${lon + d},${lat + d}`;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`;
  };

  return (
    <div className="container py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
        <h3 className="mb-3 mb-md-0">
          <i className="bi bi-truck me-2"></i>
          Track Deliveries
        </h3>
        <button className="btn btn-outline-secondary" onClick={() => navigate('/home')}>
          <i className="bi bi-house me-2"></i>
          Back to Home
        </button>
      </div>

      {/* Controls */}
      <div className="card border-dark mb-3">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label className="form-label">Select Order</label>
              <select
                className="form-select"
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
              >
                {orders.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-12 col-md-6 d-flex align-items-end">
              <div className="d-flex w-100 gap-2">
                <button className="btn btn-primary flex-grow-1" onClick={handleTrack}>
                  <i className="bi bi-geo-alt me-2"></i>
                  Track
                </button>
                <div className="btn-group" role="group" aria-label="View toggle">
                  <button
                    type="button"
                    className={`btn btn-outline-secondary ${viewType === 'map' ? 'active' : ''}`}
                    onClick={() => setViewType('map')}
                  >
                    Map
                  </button>
                  <button
                    type="button"
                    className={`btn btn-outline-secondary ${viewType === 'image' ? 'active' : ''}`}
                    onClick={() => setViewType('image')}
                  >
                    Image
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Order info */}
          {trackedOrder ? (
            <div className="row g-3 mt-3">
              <div className="col-12 col-md-6">
                <div className="card border-dark h-100">
                  <div className="card-header">Order Info</div>
                  <div className="card-body">
                    <p className="mb-1">
                      <strong>Order ID:</strong> {trackedOrder.id}
                    </p>
                    <p className="mb-1">
                      <strong>Status:</strong>{' '}
                      <span className="badge bg-info text-dark">{trackedOrder.status}</span>
                    </p>
                    <p className="mb-0">
                      <strong>Last Update:</strong> {trackedOrder.lastUpdate}
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="card border-dark h-100">
                  <div className="card-header">Location Preview</div>
                  <div className="card-body">
                    {viewType === 'map' ? (
                      <div className="ratio ratio-4x3">
                        <iframe
                          title="map"
                          src={getOsmEmbedUrl(trackedOrder.lat, trackedOrder.lon)}
                          style={{ border: 0 }}
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                      </div>
                    ) : (
                      <img
                        src={`https://via.placeholder.com/800x600.png?text=Route+Preview+for+Order+%23${trackedOrder.id}`}
                        alt="Route preview"
                        className="img-fluid rounded border"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="alert alert-info mt-3 mb-0">
              Select an order and click Track to preview its location.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}