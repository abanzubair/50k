import { useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import { IndianRupee, ShoppingCart, Package, Users } from 'lucide-react';
import { orderStore, productStore, activityStore } from '@/lib/store';
import type { OrderStatus } from '@/types';

const statusColors: Record<OrderStatus, string> = {
  pending: '#C49A5B',
  confirmed: '#5B7FB8',
  shipped: '#8B5BB8',
  delivered: '#5B8A5B',
  cancelled: '#B85C5C',
};

const statusLabels: Record<OrderStatus, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export default function AdminDashboard() {
  const orders = orderStore.getAll();
  const products = productStore.getAll();
  const activities = activityStore.getAll();

  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const totalOrders = orders.length;
    const totalProducts = products.length;
    const totalCustomers = new Set(orders.map((o) => o.customer.email)).size;
    return { totalRevenue, totalOrders, totalProducts, totalCustomers };
  }, [orders, products]);

  const revenueData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month, i) => ({
      month,
      revenue: [185000, 210000, 195000, 230000, 245000, 180000][i],
    }));
  }, []);

  const orderStatusData = useMemo(() => {
    const counts: Record<string, number> = {};
    orders.forEach((o) => {
      counts[o.status] = (counts[o.status] || 0) + 1;
    });
    return Object.entries(counts).map(([status, value]) => ({
      name: statusLabels[status as OrderStatus],
      value,
      color: statusColors[status as OrderStatus],
    }));
  }, [orders]);

  const recentOrders = useMemo(() => {
    return [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);
  }, [orders]);

  const statCards = [
    { label: 'Total Revenue', value: `₹${(stats.totalRevenue / 100000).toFixed(2)}L`, change: '+12.5%', icon: IndianRupee, positive: true },
    { label: 'Total Orders', value: stats.totalOrders.toString(), change: '+8.2%', icon: ShoppingCart, positive: true },
    { label: 'Total Products', value: stats.totalProducts.toString(), change: '+3 new', icon: Package, positive: true },
    { label: 'Total Customers', value: stats.totalCustomers.toString(), change: '+24', icon: Users, positive: true },
  ];

  const formatPrice = (price: number) => `₹${price.toLocaleString('en-IN')}`;

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl p-6"
            style={{
              backgroundColor: 'var(--color-bg)',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'rgba(168,127,107,0.1)' }}
              >
                <stat.icon className="w-5 h-5" style={{ color: 'var(--color-accent)' }} />
              </div>
              <span
                className="font-body font-medium text-[11px] px-2 py-0.5 rounded-pill"
                style={{
                  backgroundColor: stat.positive ? 'rgba(91,138,91,0.1)' : 'rgba(184,92,92,0.1)',
                  color: stat.positive ? 'var(--color-success)' : 'var(--color-danger)',
                }}
              >
                {stat.change}
              </span>
            </div>
            <p className="font-body font-bold text-2xl" style={{ color: 'var(--color-text)' }}>
              {stat.value}
            </p>
            <p className="font-body text-[13px] mt-1" style={{ color: 'var(--color-muted)' }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue Chart */}
        <div
          className="lg:col-span-2 rounded-xl p-6"
          style={{
            backgroundColor: 'var(--color-bg)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <h3 className="font-body font-semibold text-base mb-4" style={{ color: 'var(--color-text)' }}>
            Revenue Overview
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--color-muted)' }} axisLine={{ stroke: 'var(--color-border)' }} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--color-muted)' }} axisLine={{ stroke: 'var(--color-border)' }} tickFormatter={(v) => `₹${v / 1000}k`} />
              <Tooltip
                formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']}
                contentStyle={{
                  backgroundColor: 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  fontSize: '13px',
                }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="var(--color-accent)"
                strokeWidth={2}
                dot={{ fill: 'var(--color-accent)', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Order Status Doughnut */}
        <div
          className="rounded-xl p-6"
          style={{
            backgroundColor: 'var(--color-bg)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <h3 className="font-body font-semibold text-base mb-4" style={{ color: 'var(--color-text)' }}>
            Order Status
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={orderStatusData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {orderStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  fontSize: '13px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="text-center mt-2">
            <p className="font-body font-bold text-xl" style={{ color: 'var(--color-text)' }}>
              {orders.length}
            </p>
            <p className="font-body text-xs" style={{ color: 'var(--color-muted)' }}>
              Total Orders
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-3">
            {orderStatusData.map((item) => (
              <div key={item.name} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="font-body text-[11px]" style={{ color: 'var(--color-muted)' }}>
                  {item.name} ({item.value})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Orders Table */}
        <div
          className="lg:col-span-2 rounded-xl overflow-hidden"
          style={{
            backgroundColor: 'var(--color-bg)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div className="p-6 flex items-center justify-between" style={{ borderBottom: '1px solid var(--color-border)' }}>
            <h3 className="font-body font-semibold text-base" style={{ color: 'var(--color-text)' }}>
              Recent Orders
            </h3>
            <span className="font-body text-xs cursor-pointer hover:underline" style={{ color: 'var(--color-accent)' }}>
              View All
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <th className="text-left px-6 py-3 font-body font-medium text-xs" style={{ color: 'var(--color-muted)' }}>Order ID</th>
                  <th className="text-left px-6 py-3 font-body font-medium text-xs" style={{ color: 'var(--color-muted)' }}>Customer</th>
                  <th className="text-left px-6 py-3 font-body font-medium text-xs" style={{ color: 'var(--color-muted)' }}>Date</th>
                  <th className="text-left px-6 py-3 font-body font-medium text-xs" style={{ color: 'var(--color-muted)' }}>Amount</th>
                  <th className="text-left px-6 py-3 font-body font-medium text-xs" style={{ color: 'var(--color-muted)' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-black/[0.02] transition-colors" style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td className="px-6 py-3 font-body text-sm font-medium" style={{ color: 'var(--color-accent)' }}>
                      {order.orderId}
                    </td>
                    <td className="px-6 py-3 font-body text-sm">{order.customer.name}</td>
                    <td className="px-6 py-3 font-body text-sm" style={{ color: 'var(--color-muted)' }}>
                      {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-3 font-body text-sm font-medium">{formatPrice(order.total)}</td>
                    <td className="px-6 py-3">
                      <span
                        className="font-body text-[11px] font-medium px-2.5 py-1 rounded-pill"
                        style={{
                          backgroundColor: `${statusColors[order.status]}20`,
                          color: statusColors[order.status],
                        }}
                      >
                        {statusLabels[order.status]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div
          className="rounded-xl p-6"
          style={{
            backgroundColor: 'var(--color-bg)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <h3 className="font-body font-semibold text-base mb-4" style={{ color: 'var(--color-text)' }}>
            Recent Activity
          </h3>
          <div className="space-y-0">
            {activities.slice(0, 6).map((activity, index) => (
              <div
                key={activity.id}
                className="py-3 flex items-start gap-3"
                style={{
                  borderBottom: index < activities.length - 1 ? '1px solid var(--color-border)' : 'none',
                }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{
                    backgroundColor: activity.type === 'order' ? 'rgba(168,127,107,0.1)' : 'rgba(91,138,91,0.1)',
                  }}
                >
                  {activity.type === 'order' ? (
                    <ShoppingCart className="w-3.5 h-3.5" style={{ color: 'var(--color-accent)' }} />
                  ) : (
                    <Package className="w-3.5 h-3.5" style={{ color: 'var(--color-success)' }} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm leading-snug" style={{ color: 'var(--color-text)' }}>
                    {activity.text}
                  </p>
                  <p className="font-body text-[11px] mt-0.5" style={{ color: 'var(--color-muted)' }}>
                    {new Date(activity.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
