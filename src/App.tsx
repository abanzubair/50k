import AdminRedirect from './pages/admin/AdminRedirect';
import { Routes, Route } from 'react-router';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      
      {/* Dynamic Subpath Multi-Tenant Support */}
      <Route path="/:slug" element={<Home />} />
      <Route path="/:slug/product/:id" element={<ProductDetails />} />

      {/* Admin Panel */}
      <Route path="/admin/*" element={<AdminRedirect />} />
    </Routes>
  );
}
