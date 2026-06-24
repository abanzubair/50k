import { useState, useRef, useEffect } from 'react';
import { Search, Check } from 'lucide-react';
import { orderStore } from '@/lib/store';
import type { Order, OrderStatus } from '@/types';

const statusConfig: Record<OrderStatus, { color: string; label: string }> = {
  pending: { color: '#C49A5B', label: 'Pending' },
  confirmed: { color: '#5B7FB8', label: 'Confirmed' },
  shipped: { color: '#8B5BB8', label: 'Shipped' },
  delivered: { color: '#5B8A5B', label: 'Delivered' },
  cancelled: { color: '#B85C5C', label: 'Cancelled' },
};

export default function OrderTracking() {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleTrack = () => {
    setError('');
    setOrder(null);
    if (!orderId.trim()) {
      setError('Please enter an order ID');
      return;
    }
    const found = orderStore.getByOrderId(orderId.trim());
    if (found) {
      setOrder(found);
    } else {
      setError('Order not found. Please check the order ID and try again.');
    }
  };

  return (
    <section
      ref={sectionRef}
      id="track-order"
      className="w-full py-24 md:py-32 px-5 md:px-16"
      style={{ backgroundColor: 'var(--color-bg-alt)' }}
    >
      <div className="max-w-xl mx-auto text-center">
        {/* Header */}
        <h2
          className={`font-display font-semibold text-h1 mb-4 transition-all duration-600 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{ color: 'var(--color-text)' }}
        >
          Track Your <em style={{ color: 'var(--color-accent)' }}>Order</em>
        </h2>
        <p
          className={`font-body font-light text-base mb-10 transition-all duration-600 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{ color: 'var(--color-muted)', transitionDelay: '0.1s' }}
        >
          Enter your order ID to check the status of your saree delivery
        </p>

        {/* Search Form */}
        <div
          className={`relative mb-8 transition-all duration-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '0.2s' }}
        >
          <div className="relative flex items-center">
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
              placeholder="Enter your order ID (e.g., TAV-2025-001)"
              className="w-full h-[52px] pl-5 pr-[140px] rounded-pill text-[15px] font-body outline-none transition-all duration-200 focus:shadow-glow"
              style={{
                border: `1px solid ${error ? 'var(--color-danger)' : 'var(--color-border)'}`,
                backgroundColor: 'var(--color-bg)',
                color: 'var(--color-text)',
              }}
            />
            <button
              onClick={handleTrack}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 h-[44px] px-6 rounded-pill font-medium text-sm flex items-center gap-2 transition-all duration-200 hover:scale-105"
              style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-bg)' }}
            >
              <Search className="w-4 h-4" />
              Track
            </button>
          </div>
          {error && (
            <p className="text-left mt-2 text-sm font-body" style={{ color: 'var(--color-danger)' }}>
              {error}
            </p>
          )}
        </div>

        {/* Demo hint */}
        <p className="text-xs font-body mb-8" style={{ color: 'var(--color-muted)' }}>
          Try: <span className="font-medium cursor-pointer hover:underline" onClick={() => { setOrderId('TAV-2025-001'); setError(''); }}>TAV-2025-001</span> (Confirmed),{' '}
          <span className="font-medium cursor-pointer hover:underline" onClick={() => { setOrderId('TAV-2025-002'); setError(''); }}>TAV-2025-002</span> (Shipped),{' '}
          <span className="font-medium cursor-pointer hover:underline" onClick={() => { setOrderId('TAV-2025-003'); setError(''); }}>TAV-2025-003</span> (Delivered)
        </p>

        {/* Order Status */}
        {order && (
          <div
            className="text-left rounded-xl p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500"
            style={{ backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-body font-semibold text-lg" style={{ color: 'var(--color-text)' }}>
                  {order.orderId}
                </h3>
                <p className="font-body text-sm" style={{ color: 'var(--color-muted)' }}>
                  Placed on {order.createdAt}
                </p>
              </div>
              <span
                className="px-3 py-1 rounded-pill text-xs font-medium"
                style={{
                  backgroundColor: `${statusConfig[order.status].color}20`,
                  color: statusConfig[order.status].color,
                }}
              >
                {statusConfig[order.status].label}
              </span>
            </div>

            {/* Timeline */}
            <div className="relative pl-4">
              {order.timeline.map((event, index) => {
                const isCurrent = event.status === order.status;
                const isCompleted = event.completed;
                const isLast = index === order.timeline.length - 1;

                return (
                  <div key={event.status} className="relative flex gap-4 pb-6 last:pb-0">
                    {/* Line */}
                    {!isLast && (
                      <div
                        className="absolute left-[7px] top-4 w-0.5 h-full"
                        style={{
                          backgroundColor: isCompleted ? 'var(--color-success)' : 'var(--color-border)',
                          backgroundImage: !isCompleted ? 'repeating-linear-gradient(to bottom, var(--color-border) 0, var(--color-border) 4px, transparent 4px, transparent 8px)' : 'none',
                        }}
                      />
                    )}

                    {/* Dot */}
                    <div className="relative z-10 flex-shrink-0">
                      <div
                        className="w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300"
                        style={{
                          backgroundColor: isCompleted ? 'var(--color-success)' : 'transparent',
                          border: `2px solid ${isCompleted ? 'var(--color-success)' : isCurrent ? 'var(--color-accent)' : 'var(--color-border)'}`,
                        }}
                      >
                        {isCompleted && <Check className="w-2.5 h-2.5 text-white" />}
                      </div>
                      {isCurrent && (
                        <div
                          className="absolute inset-0 rounded-full animate-pulse-ring"
                          style={{ border: '2px solid var(--color-accent)' }}
                        />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 -mt-0.5">
                      <p
                        className="font-body font-medium text-sm"
                        style={{ color: isCompleted || isCurrent ? 'var(--color-text)' : 'var(--color-muted)' }}
                      >
                        {event.label}
                      </p>
                      {event.date && (
                        <p className="font-body text-xs mt-0.5" style={{ color: 'var(--color-muted)' }}>
                          {event.date}
                        </p>
                      )}
                      {isCurrent && !event.date && (
                        <p className="font-body text-xs mt-0.5" style={{ color: 'var(--color-accent)' }}>
                          In progress
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="mt-6 pt-4" style={{ borderTop: '1px solid var(--color-border)' }}>
              <div className="flex justify-between items-center">
                <span className="font-body text-sm" style={{ color: 'var(--color-muted)' }}>
                  Total Amount
                </span>
                <span className="font-body font-bold text-lg" style={{ color: 'var(--color-accent)' }}>
                  ₹{order.total.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
