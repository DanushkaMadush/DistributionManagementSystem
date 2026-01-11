import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { setupInterceptors } from './services/interceptors';
import Login from './pages/login';
// import Dashboard from './pages/Dashboard';

function App() {
  useEffect(() => {
    setupInterceptors();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
