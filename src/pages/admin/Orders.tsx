import { useState, useMemo } from 'react';
import { Search, Download, Eye, ChevronDown, Printer } from 'lucide-react';
import { orderStore, activityStore } from '@/lib/store';
import type { Order, OrderStatus } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const statusConfig: Record<OrderStatus, { color: string; bg: string; label: string }> = {
  pending: { color: '#C49A5B', bg: 'rgba(196,154,91,0.1)', label: 'Pending' },
  confirmed: { color: '#5B7FB8', bg: 'rgba(91,127,184,0.1)', label: 'Confirmed' },
  shipped: { color: '#8B5BB8', bg: 'rgba(139,91,184,0.1)', label: 'Shipped' },
  delivered: { color: '#5B8A5B', bg: 'rgba(91,138,91,0.1)', label: 'Delivered' },
  cancelled: { color: '#B85C5C', bg: 'rgba(184,92,92,0.1)', label: 'Cancelled' },
};

const allStatuses: OrderStatus[] = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>(orderStore.getAll());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredOrders = useMemo(() => {
    let result = [...orders];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (o) =>
          o.orderId.toLowerCase().includes(q) ||
          o.customer.name.toLowerCase().includes(q) ||
          o.customer.email.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== 'all') {
      result = result.filter((o) => o.status === statusFilter);
    }
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [orders, search, statusFilter]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    const updated = orderStore.updateStatus(orderId, newStatus);
    if (updated) {
      setOrders([...orderStore.getAll()]);
      activityStore.add(`Order ${updated.orderId} status changed to ${statusConfig[newStatus].label}`, 'order');
      setStatusDropdownOpen(null);
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(updated);
      }
    }
  };

  const formatPrice = (price: number) => `₹${price.toLocaleString('en-IN')}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="font-display font-semibold text-h2" style={{ color: 'var(--color-text)' }}>
          Orders
        </h1>
        <button
          onClick={() => alert('Export functionality coming soon!')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-body text-sm transition-colors hover:bg-black/5 self-start"
          style={{ border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--color-muted)' }} />
          <input
            type="text"
            placeholder="Search by order ID or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-4 rounded-pill text-sm font-body outline-none"
            style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)' }}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {(['all', ...allStatuses] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className="px-3 py-1.5 rounded-pill font-body text-xs font-medium transition-all duration-200"
              style={{
                backgroundColor: statusFilter === status ? 'var(--color-accent)' : 'transparent',
                color: statusFilter === status ? 'var(--color-bg)' : 'var(--color-text)',
                border: `1px solid ${statusFilter === status ? 'var(--color-accent)' : 'var(--color-border)'}`,
              }}
            >
              {status === 'all' ? 'All' : statusConfig[status].label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'rgba(0,0,0,0.02)' }}>
                <th className="text-left px-4 py-3 font-body font-medium text-xs" style={{ color: 'var(--color-muted)' }}>Order ID</th>
                <th className="text-left px-4 py-3 font-body font-medium text-xs" style={{ color: 'var(--color-muted)' }}>Customer</th>
                <th className="text-left px-4 py-3 font-body font-medium text-xs" style={{ color: 'var(--color-muted)' }}>Date</th>
                <th className="text-left px-4 py-3 font-body font-medium text-xs" style={{ color: 'var(--color-muted)' }}>Items</th>
                <th className="text-left px-4 py-3 font-body font-medium text-xs" style={{ color: 'var(--color-muted)' }}>Total</th>
                <th className="text-left px-4 py-3 font-body font-medium text-xs" style={{ color: 'var(--color-muted)' }}>Status</th>
                <th className="text-left px-4 py-3 font-body font-medium text-xs w-20" style={{ color: 'var(--color-muted)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.map((order) => (
                <tr key={order.id} className="hover:bg-black/[0.02] transition-colors" style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="font-body text-sm font-medium hover:underline"
                      style={{ color: 'var(--color-accent)' }}
                    >
                      {order.orderId}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-body text-sm">{order.customer.name}</p>
                    <p className="font-body text-[11px]" style={{ color: 'var(--color-muted)' }}>{order.customer.email}</p>
                  </td>
                  <td className="px-4 py-3 font-body text-sm" style={{ color: 'var(--color-muted)' }}>
                    {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3 font-body text-sm">{order.items.length}</td>
                  <td className="px-4 py-3 font-body text-sm font-medium">{formatPrice(order.total)}</td>
                  <td className="px-4 py-3 relative">
                    <button
                      onClick={() => setStatusDropdownOpen(statusDropdownOpen === order.id ? null : order.id)}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-pill font-body text-[11px] font-medium transition-colors"
                      style={{
                        backgroundColor: statusConfig[order.status].bg,
                        color: statusConfig[order.status].color,
                      }}
                    >
                      {statusConfig[order.status].label}
                      <ChevronDown className="w-3 h-3" />
                    </button>
                    {statusDropdownOpen === order.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setStatusDropdownOpen(null)} />
                        <div
                          className="absolute z-20 mt-1 rounded-lg py-1 min-w-[120px] shadow-lg"
                          style={{ backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
                        >
                          {allStatuses.map((status) => (
                            <button
                              key={status}
                              onClick={() => handleStatusChange(order.id, status)}
                              className="w-full text-left px-3 py-1.5 font-body text-xs transition-colors hover:bg-black/5"
                              style={{ color: status === order.status ? statusConfig[status].color : 'var(--color-text)' }}
                            >
                              {statusConfig[status].label}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="w-8 h-8 rounded flex items-center justify-center transition-colors hover:bg-black/5"
                    >
                      <Eye className="w-4 h-4" style={{ color: 'var(--color-muted)' }} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4"
          style={{ borderTop: '1px solid var(--color-border)' }}
        >
          <p className="font-body text-sm" style={{ color: 'var(--color-muted)' }}>
            Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length} orders
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg font-body text-sm disabled:opacity-40 transition-colors hover:bg-black/5"
              style={{ border: '1px solid var(--color-border)' }}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className="w-8 h-8 rounded-lg font-body text-sm transition-colors"
                style={{
                  backgroundColor: currentPage === page ? 'var(--color-accent)' : 'transparent',
                  color: currentPage === page ? 'var(--color-bg)' : 'var(--color-text)',
                }}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg font-body text-sm disabled:opacity-40 transition-colors hover:bg-black/5"
              style={{ border: '1px solid var(--color-border)' }}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto" style={{ backgroundColor: 'var(--color-bg)' }}>
          {selectedOrder && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle className="font-display font-semibold text-xl">{selectedOrder.orderId}</DialogTitle>
                  <span
                    className="px-3 py-1 rounded-pill font-body text-[11px] font-medium"
                    style={{
                      backgroundColor: statusConfig[selectedOrder.status].bg,
                      color: statusConfig[selectedOrder.status].color,
                    }}
                  >
                    {statusConfig[selectedOrder.status].label}
                  </span>
                </div>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Customer Info */}
                <div>
                  <h4 className="font-body font-semibold text-sm mb-2" style={{ color: 'var(--color-text)' }}>Customer</h4>
                  <div className="space-y-1">
                    <p className="font-body text-sm">{selectedOrder.customer.name}</p>
                    <p className="font-body text-sm" style={{ color: 'var(--color-muted)' }}>{selectedOrder.customer.email}</p>
                    <p className="font-body text-sm" style={{ color: 'var(--color-muted)' }}>{selectedOrder.customer.phone}</p>
                    <p className="font-body text-sm" style={{ color: 'var(--color-muted)' }}>{selectedOrder.customer.address}</p>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <h4 className="font-body font-semibold text-sm mb-2" style={{ color: 'var(--color-text)' }}>Order Items</h4>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 py-2" style={{ borderBottom: idx < selectedOrder.items.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
                        <img src={item.productImage} alt={item.productName} className="w-10 h-10 object-cover rounded" />
                        <div className="flex-1">
                          <p className="font-body text-sm font-medium">{item.productName}</p>
                          <p className="font-body text-[11px]" style={{ color: 'var(--color-muted)' }}>Qty: {item.quantity}</p>
                        </div>
                        <p className="font-body text-sm font-medium">{formatPrice(item.price)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                <div className="rounded-lg p-4" style={{ backgroundColor: 'rgba(0,0,0,0.02)' }}>
                  <div className="space-y-1.5">
                    <div className="flex justify-between font-body text-sm">
                      <span style={{ color: 'var(--color-muted)' }}>Subtotal</span>
                      <span>{formatPrice(selectedOrder.subtotal)}</span>
                    </div>
                    <div className="flex justify-between font-body text-sm">
                      <span style={{ color: 'var(--color-muted)' }}>Shipping</span>
                      <span>{selectedOrder.shipping === 0 ? 'Free' : formatPrice(selectedOrder.shipping)}</span>
                    </div>
                    <div className="flex justify-between font-body text-sm">
                      <span style={{ color: 'var(--color-muted)' }}>Tax</span>
                      <span>{formatPrice(selectedOrder.tax)}</span>
                    </div>
                    <div className="flex justify-between font-body font-semibold text-base pt-2" style={{ borderTop: '1px solid var(--color-border)' }}>
                      <span>Total</span>
                      <span style={{ color: 'var(--color-accent)' }}>{formatPrice(selectedOrder.total)}</span>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <h4 className="font-body font-semibold text-sm mb-3" style={{ color: 'var(--color-text)' }}>Status Timeline</h4>
                  <div className="space-y-2">
                    {selectedOrder.timeline.map((event) => (
                      <div key={event.status} className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{
                            backgroundColor: event.completed ? statusConfig[event.status].color : 'transparent',
                            border: `2px solid ${event.completed ? statusConfig[event.status].color : 'var(--color-border)'}`,
                          }}
                        />
                        <span className="font-body text-sm flex-1">{event.label}</span>
                        {event.date && (
                          <span className="font-body text-xs" style={{ color: 'var(--color-muted)' }}>{event.date}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    onClick={() => alert('Print functionality coming soon!')}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-body text-sm transition-colors hover:bg-black/5"
                    style={{ border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
                  >
                    <Printer className="w-4 h-4" />
                    Print Invoice
                  </button>
                  <div className="relative">
                    <button
                      onClick={() => setStatusDropdownOpen(statusDropdownOpen === 'detail' ? null : 'detail')}
                      className="flex items-center gap-2 px-4 py-2 rounded-pill font-body text-sm font-medium"
                      style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-bg)' }}
                    >
                      Update Status
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    {statusDropdownOpen === 'detail' && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setStatusDropdownOpen(null)} />
                        <div
                          className="absolute z-20 mt-1 rounded-lg py-1 min-w-[140px] shadow-lg"
                          style={{ backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
                        >
                          {allStatuses.map((status) => (
                            <button
                              key={status}
                              onClick={() => {
                                handleStatusChange(selectedOrder.id, status);
                                setStatusDropdownOpen(null);
                              }}
                              className="w-full text-left px-3 py-1.5 font-body text-xs transition-colors hover:bg-black/5"
                              style={{ color: 'var(--color-text)' }}
                            >
                              {statusConfig[status].label}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
