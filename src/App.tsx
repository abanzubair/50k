import { Routes, Route } from 'react-router';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import AdminLayout from './components/admin/AdminLayout';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminOrders from './pages/admin/Orders';
import AdminProfile from './pages/admin/Profile';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      
      {/* Dynamic Subpath Multi-Tenant Support */}
      <Route path="/:slug" element={<Home />} />
      <Route path="/:slug/product/:id" element={<ProductDetails />} />

      {/* Admin Panel */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="profile" element={<AdminProfile />} />
        <Route path="settings" element={<AdminProfile />} />
      </Route>
      <Route path="/admin/login" element={<AdminLogin />} />
    </Routes>
  );
}
