import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { setupInterceptors } from './services/interceptors';
import Login from './pages/login';
import Home from './pages/home';
import Products from './pages/products';
import Orders from './pages/orders';
import Promotions from './pages/promotions';
import Inventory from './pages/inventory';
import StockTransfers from './pages/stockTransfers';
import OrderFulfillment from './pages/orderFulfillment';
import DeliveryScheduling from './pages/deliveryScheduling';
import Deliveries from './pages/deliveries';
import Billing from './pages/billing';
import Payments from './pages/payments';
import Dashboard from './pages/dashboard';
import Reports from './pages/reports';
import AdminUsers from './pages/adminUsers';
import AdminSettings from './pages/adminSettings';

function App() {
  useEffect(() => {
    setupInterceptors();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/promotions" element={<Promotions />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/stock-transfers" element={<StockTransfers />} />
        <Route path="/order-fulfillment" element={<OrderFulfillment />} />
        <Route path="/delivery-scheduling" element={<DeliveryScheduling />} />
        <Route path="/deliveries" element={<Deliveries />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/reports/dashboard" element={<Dashboard />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
        <Route path="/" element={<Navigate to="/home" replace />} />
      </Routes>
    </Router>
  );
}

export default App;