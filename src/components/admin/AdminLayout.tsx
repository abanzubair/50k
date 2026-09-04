import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  User,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ChevronDown,
  
  ArrowRight,
  Store,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { AdminTenantProvider, useAdminTenant } from '@/lib/AdminTenantContext';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: Package, label: 'Saree Catalog', path: '/admin/products' },
  { icon: ShoppingCart, label: 'Customer Orders', path: '/admin/orders' },
  { icon: User, label: 'Boutique Settings', path: '/admin/profile' },
];

function AdminShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { tenant, tenantsList, loading: tenantLoading, switchTenant, claimTenant } = useAdminTenant();

  const [claimSlug, setClaimSlug] = useState('');
  const [claiming, setClaiming] = useState(false);
  const [claimError, setClaimError] = useState<string | null>(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('50k_admin_active_tenant_slug');
    }
    navigate('/admin/login');
  };

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimSlug.trim()) return;
    setClaiming(true);
    setClaimError(null);

    const res = await claimTenant(claimSlug.trim());
    if (!res.success) {
      setClaimError(res.error || 'Failed to connect boutique');
    }
    setClaiming(false);
  };

  if (tenantLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-xs font-mono">
        Verifying boutique workspace...
      </div>
    );
  }

  // If no boutique connected
  if (!tenant) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white mx-auto mb-4 shadow-xl shadow-amber-950/50">
            <Store className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Connect Your Boutique</h2>
          <p className="text-xs text-slate-400 mt-1 mb-6">
            Enter your boutique identifier registered on Weave365 (e.g. <code>50k</code> or <code>storefront</code>)
          </p>

          {claimError && (
            <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs text-left">
              {claimError}
            </div>
          )}

          <form onSubmit={handleClaim} className="space-y-4">
            <input
              type="text"
              required
              value={claimSlug}
              onChange={(e) => setClaimSlug(e.target.value)}
              placeholder="e.g. 50k"
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm text-center font-mono focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              disabled={claiming}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <span>{claiming ? 'Connecting...' : 'Access Boutique Admin'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-800">
            <button
              onClick={handleLogout}
              className="text-xs text-rose-400 hover:text-rose-300 font-medium"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentPage = navItems.find((item) => item.path === location.pathname)?.label || 'Dashboard';

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Boutique Brand & Switcher */}
          <div className="p-5 border-b border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center font-bold text-white shadow-md text-sm">
                  {tenant.store_name?.[0] || '5'}
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="font-bold text-white text-sm truncate">{tenant.store_name}</h1>
                  <p className="text-[11px] text-amber-400 font-mono truncate">/{tenant.slug}</p>
                </div>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Switch Boutique Dropdown */}
            {tenantsList.length > 1 && (
              <div className="relative mt-2">
                <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                  Active Boutique:
                </label>
                <div className="relative">
                  <select
                    value={tenant.slug}
                    onChange={(e) => switchTenant(e.target.value)}
                    className="w-full appearance-none bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-200 rounded-lg px-3 py-2 pr-7 focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    {tenantsList.map((t) => (
                      <option key={t.id || t.slug} value={t.slug}>
                        {t.store_name} (/{t.slug})
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                    <ChevronDown className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wider transition-colors ${
                    isActive
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            to={tenant.slug === '50k' ? '/' : `/${tenant.slug}`}
            target="_blank"
            className="flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              <span>View Live Boutique</span>
            </span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-4 md:px-8 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-body text-xs text-slate-400">
              Admin / <span className="font-bold text-white">{currentPage}</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">
              Boutique: <strong className="text-amber-400">{tenant.store_name}</strong>
            </span>
          </div>
        </header>

        {/* Content View */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto bg-slate-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    async function checkAuth() {
      if (location.pathname === '/admin/login') {
        setAuthLoading(false);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/admin/login');
      } else {
        setUser(session.user);
      }
      setAuthLoading(false);
    }

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session && location.pathname !== '/admin/login') {
        navigate('/admin/login');
      } else if (session) {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [location.pathname, navigate]);

  if (location.pathname === '/admin/login') {
    return <Outlet />;
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-xs font-mono">
        Verifying boutique session...
      </div>
    );
  }

  return (
    <AdminTenantProvider user={user}>
      <AdminShell />
    </AdminTenantProvider>
  );
}
