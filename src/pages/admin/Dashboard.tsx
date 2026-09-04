import { useState, useEffect, useMemo } from 'react';
import { IndianRupee, ShoppingCart, Package, MessageCircle, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { Link } from 'react-router';
import { supabase } from '@/lib/supabase';
import { useAdminTenant } from '@/lib/AdminTenantContext';

export default function AdminDashboard() {
  const { tenant } = useAdminTenant();
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      if (!tenant?.id) return;
      setLoading(true);
      try {
        const [prodRes, orderRes] = await Promise.all([
          supabase.from('boutique_products').select('*').eq('tenant_id', tenant.id),
          supabase.from('boutique_orders').select('*').eq('tenant_id', tenant.id).order('created_at', { ascending: false }),
        ]);

        if (prodRes.data) setProducts(prodRes.data);
        if (orderRes.data) setOrders(orderRes.data);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [tenant?.id]);

  const stats = useMemo(() => {
    const totalCatalog = products.length;
    const publishedCount = products.filter((p) => p.is_published !== false).length;
    const totalOrders = orders.length;
    const totalPipelineValue = orders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
    const newInquiriesCount = orders.filter((o) => o.status === 'new' || o.status === 'pending').length;

    return {
      totalCatalog,
      publishedCount,
      totalOrders,
      totalPipelineValue,
      newInquiriesCount,
    };
  }, [products, orders]);

  const recentOrders = orders.slice(0, 5);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
        <span className="text-xs font-mono">Loading metrics for {tenant?.store_name}...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800 rounded-3xl p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">
              Boutique Overview
            </span>
            <h1 className="font-display font-bold text-2xl md:text-3xl text-white mt-1">
              Welcome back, {tenant?.store_name}
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Manage your published Banarasi sarees, track customer WhatsApp inquiries, and customize your retail storefront settings.
            </p>
          </div>

          <Link
            to={tenant?.slug === '50k' ? '/' : `/${tenant?.slug}`}
            target="_blank"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg self-start sm:self-auto transition-all"
          >
            <span>Live Store</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Catalog Sarees</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-white">{stats.totalCatalog}</span>
            <span className="text-xs text-slate-400 ml-2 font-mono">({stats.publishedCount} Active)</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Inquiries</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-white">{stats.totalOrders}</span>
            <span className="text-xs text-emerald-400 ml-2 font-mono">{stats.newInquiriesCount} New</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Inquiry Value</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-white">
              ₹{stats.totalPipelineValue.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Boutique Handle</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-sm font-bold text-amber-400 font-mono">/{tenant?.slug}</span>
            <p className="text-[11px] text-slate-500 mt-0.5 truncate">{tenant?.whatsapp || 'No WhatsApp set'}</p>
          </div>
        </div>
      </div>

      {/* Recent Customer Inquiries Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-bold text-white">Recent Customer Inquiries</h2>
            <p className="text-xs text-slate-400 mt-0.5">Leads submitted through your boutique storefront</p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
          >
            View All ({orders.length}) →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs">
            No customer inquiries logged yet. Share your store link on WhatsApp to start generating sales!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Reference / Notes</th>
                  <th className="pb-3">Value</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {recentOrders.map((ord) => {
                  const cleanPhone = ord.customer_phone ? ord.customer_phone.replace(/[^0-9]/g, '') : '';
                  const waUrl = cleanPhone ? `https://wa.me/${cleanPhone}` : null;

                  return (
                    <tr key={ord.id} className="hover:bg-slate-800/30">
                      <td className="py-3 font-semibold text-white">
                        <div>{ord.customer_name || 'Guest Lead'}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{ord.customer_phone || 'No phone'}</div>
                      </td>
                      <td className="py-3 text-slate-400 max-w-xs truncate">
                        {ord.notes || `Order #ORD-${ord.id.substring(0, 6)}`}
                      </td>
                      <td className="py-3 font-bold text-amber-400">
                        ₹{Number(ord.total_amount || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          {ord.status || 'new'}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        {waUrl ? (
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-500/30 font-bold text-[11px] transition-colors"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </a>
                        ) : (
                          <span className="text-slate-600 text-[11px]">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
