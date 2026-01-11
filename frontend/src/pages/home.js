import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken, clearToken, getRoles } from '../services/jwtService';

const roleGroups = {
  CUSTOMER: [
    { label: 'Browse Products', path: '/products' },
    { label: 'My Orders', path: '/orders' },
    { label: 'Promotions & Offers', path: '/promotions' },
  ],
  RDC: [
    { label: 'Inventory Management', path: '/inventory' },
    { label: 'Stock Transfers', path: '/stock-transfers' },
    { label: 'Order Fulfillment', path: '/order-fulfillment' },
  ],
  LOGISTICS: [
    { label: 'Delivery Scheduling', path: '/delivery-scheduling' },
    { label: 'Track Deliveries', path: '/deliveries' },
  ],
  FINANCE: [
    { label: 'Billing & Invoices', path: '/billing' },
    { label: 'Payments', path: '/payments' },
  ],
  MANAGER: [
    { label: 'Dashboard', path: '/reports/dashboard' },
    { label: 'Reports', path: '/reports' },
  ],
  ADMIN: [
    { label: 'User Management', path: '/admin/users' },
    { label: 'System Settings', path: '/admin/settings' },
  ],
};

const Home = () => {
  const navigate = useNavigate();
  const token = getToken();

  useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true });
    }
  }, [token, navigate]);

  const normalizedRoles = useMemo(() => {
    const roles = getRoles() || [];
    return roles.map((r) => r.toUpperCase());
  }, []);

  const isAdmin = normalizedRoles.includes('ADMIN');

  const visibleButtons = useMemo(() => {
    if (isAdmin) {
      return Object.values(roleGroups).flat();
    }
    const buttons = [];
    normalizedRoles.forEach((role) => {
      if (roleGroups[role]) {
        buttons.push(...roleGroups[role]);
      }
    });
    return buttons;
  }, [isAdmin, normalizedRoles]);

  const handleLogout = () => {
    clearToken();
    navigate('/login', { replace: true });
  };

  const handleNavigate = (path) => navigate(path);

  if (!token) return null;

  return (
    <div
      className="container py-4"
      style={{ minHeight: '100vh', overflowY: 'auto' }}
    >
      <div className="mb-4 text-center">
        <h3 className="mb-1">IslandLink Sales & Distribution Management</h3>
        <p className="text-muted mb-0">Choose an action below</p>
      </div>

      <div className="row g-3 justify-content-center">
        {visibleButtons.map((btn) => (
          <div key={btn.label} className="col-12 d-flex justify-content-center">
            <button
              className="btn btn-outline-primary w-100 text-center"
              style={{ minHeight: 64, maxWidth: 420 }}
              onClick={() => handleNavigate(btn.path)}
            >
              {btn.label}
            </button>
          </div>
        ))}

        {!visibleButtons.length && (
          <div className="col-12 d-flex justify-content-center">
            <div className="alert alert-warning mb-0 text-center" style={{ maxWidth: 420 }}>
              No permissions assigned. Please contact an administrator.
            </div>
          </div>
        )}

        <div className="col-12 d-flex justify-content-center mt-5">
          <button
            className="btn btn-outline-danger w-100 text-center"
            style={{ minHeight: 64, maxWidth: 420 }}
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;