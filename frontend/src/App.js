import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { setupInterceptors } from './services/interceptors';
import Login from './pages/login';
import Home from './pages/home';
import Products from './pages/browseProducts';
import Orders from './pages/myOrders';
import Promotions from './pages/promotionsAndOffers';
import Inventory from './pages/inventoryManagement';
import StockTransfers from './pages/stockTransfers';
import OrderFulfillment from './pages/orderFullfillment';
import DeliveryScheduling from './pages/deliveryScheduling';
import Deliveries from './pages/trackDeliveries';
import Billing from './pages/billingAndInvoices';
import Payments from './pages/payments';
import Dashboard from './pages/dashboard';
import Reports from './pages/reports';
import AdminUsers from './pages/userManagement';
import AdminSettings from './pages/systemSettings';
import AddProduct from './pages/addProduct';

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
        <Route path="/products/add" element={<AddProduct />} />
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