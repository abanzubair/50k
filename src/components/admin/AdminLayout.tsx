import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  FolderOpen,
  User,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Search,
  Bell,
} from 'lucide-react';
import { auth } from '@/lib/store';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: Package, label: 'Products', path: '/admin/products' },
  { icon: ShoppingCart, label: 'Orders', path: '/admin/orders' },
  { icon: FolderOpen, label: 'Categories', path: '/admin/categories' },
  { icon: User, label: 'Profile', path: '/admin/profile' },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.isAuthenticated() && location.pathname !== '/admin/login') {
      navigate('/admin/login');
    }
  }, [location.pathname, navigate]);

  const handleLogout = () => {
    auth.logout();
    navigate('/admin/login');
  };

  const currentPage = navItems.find((item) => item.path === location.pathname)?.label || 'Dashboard';

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-[260px] flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{ backgroundColor: 'var(--color-bg-deep)' }}
      >
        {/* Brand */}
        <div className="h-16 flex items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <span className="font-body font-semibold text-[13px] tracking-[0.12em]" style={{ color: 'var(--color-text-light)' }}>
              TAVISHI
            </span>
            <span
              className="font-body text-[10px] px-2 py-0.5 rounded-pill font-medium"
              style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-bg)' }}
            >
              Admin
            </span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden" style={{ color: 'var(--color-text-light)' }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Admin Info */}
        <div className="px-6 py-4 flex items-center gap-3" style={{ borderBottom: '1px solid rgba(249,244,240,0.1)' }}>
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center font-body font-semibold text-sm"
            style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-bg)' }}
          >
            PS
          </div>
          <div>
            <p className="font-body font-medium text-sm" style={{ color: 'var(--color-text-light)' }}>
              Priya Sharma
            </p>
            <p className="font-body text-xs" style={{ color: 'var(--color-muted)' }}>
              Administrator
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-6 py-3.5 font-body text-sm transition-all duration-200"
                style={{
                  color: isActive ? 'var(--color-text-light)' : 'rgba(249,244,240,0.6)',
                  backgroundColor: isActive ? 'rgba(168,127,107,0.15)' : 'transparent',
                  borderLeft: isActive ? '3px solid var(--color-accent)' : '3px solid transparent',
                }}
              >
                <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 space-y-2" style={{ borderTop: '1px solid rgba(249,244,240,0.1)' }}>
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2.5 rounded font-body text-sm transition-colors duration-200 hover:bg-white/5"
            style={{ color: 'rgba(249,244,240,0.6)' }}
          >
            <ExternalLink className="w-4 h-4" />
            View Storefront
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded font-body text-sm transition-colors duration-200 hover:bg-white/5"
            style={{ color: 'rgba(249,244,240,0.6)', border: '1px solid rgba(249,244,240,0.15)' }}
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Top Bar */}
        <header
          className="h-[60px] flex items-center justify-between px-4 md:px-8 sticky top-0 z-30"
          style={{
            backgroundColor: 'var(--color-bg)',
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded"
              style={{ color: 'var(--color-text)' }}
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-body text-sm" style={{ color: 'var(--color-muted)' }}>
              Admin / <span style={{ color: 'var(--color-text)' }}>{currentPage}</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-pill" style={{ border: '1px solid var(--color-border)' }}>
              <Search className="w-4 h-4" style={{ color: 'var(--color-muted)' }} />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent text-sm font-body outline-none w-40"
                style={{ color: 'var(--color-text)' }}
              />
            </div>
            <button className="relative w-9 h-9 flex items-center justify-center rounded-full transition-colors duration-200 hover:bg-black/5">
              <Bell className="w-[18px] h-[18px]" style={{ color: 'var(--color-muted)' }} />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
            </button>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center font-body font-semibold text-xs"
              style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-bg)' }}
            >
              PS
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
