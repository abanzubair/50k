import { useState, useEffect, useMemo } from 'react';
import { Search, MessageCircle, Loader2, ShoppingBag, ChevronDown}  from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAdminTenant } from '@/lib/AdminTenantContext';

const statusOptions = ['new', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

const statusBadges: Record<string, { bg: string; text: string; label: string }> = {
  new: { bg: 'bg-amber-500/10 border-amber-500/20', text: 'text-amber-400', label: 'New Inquiry' },
  pending: { bg: 'bg-amber-500/10 border-amber-500/20', text: 'text-amber-400', label: 'Pending' },
  confirmed: { bg: 'bg-blue-500/10 border-blue-500/20', text: 'text-blue-400', label: 'Confirmed' },
  shipped: { bg: 'bg-purple-500/10 border-purple-500/20', text: 'text-purple-400', label: 'Shipped' },
  delivered: { bg: 'bg-emerald-500/10 border-emerald-500/20', text: 'text-emerald-400', label: 'Delivered' },
  cancelled: { bg: 'bg-rose-500/10 border-rose-500/20', text: 'text-rose-400', label: 'Cancelled' },
};

export default function AdminOrders() {
  const { tenant } = useAdminTenant();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadOrders() {
      if (!tenant?.id) return;
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('boutique_orders')
          .select('*')
          .eq('tenant_id', tenant.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setOrders(data || []);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, [tenant?.id]);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const { error } = await supabase
        .from('boutique_orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      alert('Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch =
        !search ||
        (o.customer_name && o.customer_name.toLowerCase().includes(search.toLowerCase())) ||
        (o.customer_phone && o.customer_phone.includes(search)) ||
        (o.notes && o.notes.toLowerCase().includes(search.toLowerCase()));

      const matchesStatus = filterStatus === 'all' || o.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [orders, search, filterStatus]);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
        <span className="text-xs font-mono">Loading customer orders...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-2xl text-white">Customer Inquiries & Orders</h1>
        <p className="text-xs text-slate-400 mt-1">
          Review WhatsApp inquiries and update delivery status for {tenant?.store_name}
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name, phone, or notes..."
            className="w-full h-10 pl-10 pr-4 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white outline-none focus:border-amber-500"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="h-10 px-4 rounded-xl text-xs bg-slate-900 border border-slate-800 text-slate-200 outline-none focus:border-amber-500 capitalize"
        >
          <option value="all">All Statuses</option>
          {statusOptions.map((s) => (
            <option key={s} value={s}>
              {statusBadges[s]?.label || s}
            </option>
          ))}
        </select>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="py-16 text-center bg-slate-900 border border-slate-800 rounded-3xl p-8">
          <ShoppingBag className="w-10 h-10 mx-auto text-slate-600 mb-3" />
          <h3 className="font-bold text-sm text-white">No Orders Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {orders.length === 0
              ? 'No customer orders or inquiries logged yet. Customers who inquire on your store will appear here!'
              : 'No orders match your filter criteria.'}
          </p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px] bg-slate-950/40">
                  <th className="py-3.5 px-4">Order Ref / Date</th>
                  <th className="py-3.5 px-4">Customer Details</th>
                  <th className="py-3.5 px-4">Order Notes / Saree Details</th>
                  <th className="py-3.5 px-4">Value</th>
                  <th className="py-3.5 px-4">Fulfillment Status</th>
                  <th className="py-3.5 px-4 text-right">Direct Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredOrders.map((o) => {
                  const dateStr = new Date(o.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  const cleanPhone = o.customer_phone ? o.customer_phone.replace(/[^0-9]/g, '') : '';
                  const waUrl = cleanPhone ? `https://wa.me/${cleanPhone}` : null;
                  const badge = statusBadges[o.status] || statusBadges.pending;

                  return (
                    <tr key={o.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-white">
                          #ORD-{o.id.substring(0, 8).toUpperCase()}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{dateStr}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{o.customer_name || 'Valued Customer'}</div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                          {o.customer_phone || 'No phone provided'}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="text-slate-300 line-clamp-2">{o.notes || 'Direct Saree Inquiry'}</p>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-amber-400 text-sm">
                        ₹{Number(o.total_amount || 0).toLocaleString('en-IN')}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="relative inline-block">
                          <select
                            value={o.status || 'pending'}
                            disabled={updatingId === o.id}
                            onChange={(e) => handleStatusUpdate(o.id, e.target.value)}
                            className={`appearance-none px-3 py-1.5 pr-6 rounded-lg text-[11px] font-bold uppercase tracking-wider border cursor-pointer outline-none bg-slate-950 ${badge.bg} ${badge.text}`}
                          >
                            {statusOptions.map((opt) => (
                              <option key={opt} value={opt} className="bg-slate-900 text-white">
                                {statusBadges[opt]?.label || opt}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="w-3 h-3 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {waUrl ? (
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-500/30 font-bold text-[11px] transition-colors"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>Reply WhatsApp</span>
                          </a>
                        ) : (
                          <span className="text-slate-600 text-[11px]">No Phone</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
