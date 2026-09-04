import { useState, useRef, useEffect } from 'react';
import { Search, Check, Loader2, PackageCheck } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useStorefrontContext } from '@/lib/StorefrontContext';

interface LiveOrder {
  id: string;
  orderId: string;
  customerName: string;
  customerPhone?: string;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  notes?: string;
}

const statusConfig: Record<string, { color: string; label: string; step: number }> = {
  new: { color: '#C49A5B', label: 'Inquiry Received', step: 1 },
  pending: { color: '#C49A5B', label: 'Order Processing', step: 1 },
  confirmed: { color: '#5B7FB8', label: 'Order Confirmed', step: 2 },
  shipped: { color: '#8B5BB8', label: 'Dispatched / In Transit', step: 3 },
  delivered: { color: '#5B8A5B', label: 'Delivered', step: 4 },
  cancelled: { color: '#B85C5C', label: 'Cancelled', step: 0 },
};

export default function OrderTracking() {
  const { storefront, storeName } = useStorefrontContext();
  const [query, setQuery] = useState('');
  const [order, setOrder] = useState<LiveOrder | null>(null);
  const [loading, setLoading] = useState(false);
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

  const handleTrack = async () => {
    const clean = query.trim();
    if (!clean) {
      setError('Please enter your Order ID or phone number');
      return;
    }

    setLoading(true);
    setError('');
    setOrder(null);

    try {
      let dbQuery = supabase.from('boutique_orders').select('*');
      if (storefront?.id) {
        dbQuery = dbQuery.eq('tenant_id', storefront.id);
      }

      // Check by order ID (UUID or short code) or phone number
      dbQuery = dbQuery.or(`id.eq.${clean},customer_phone.ilike.%${clean}%`);

      const { data, error: dbErr } = await dbQuery.order('created_at', { ascending: false }).limit(1).maybeSingle();

      if (dbErr) throw dbErr;

      if (!data) {
        setError('No order found matching this reference. Please verify or contact us on WhatsApp.');
        return;
      }

      const statusKey = (data.status || 'pending').toLowerCase();

      setOrder({
        id: data.id,
        orderId: `#ORD-${data.id.substring(0, 8).toUpperCase()}`,
        customerName: data.customer_name || 'Valued Customer',
        customerPhone: data.customer_phone,
        totalAmount: Number(data.total_amount || 0),
        status: statusKey in statusConfig ? statusKey as any : 'pending',
        createdAt: new Date(data.created_at).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        notes: data.notes,
      });
    } catch (err: any) {
      console.error('Error tracking order:', err);
      setError('Unable to fetch order status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { key: 'pending', label: 'Order Placed' },
    { key: 'confirmed', label: 'Weave Confirmed' },
    { key: 'shipped', label: 'Shipped & Dispatched' },
    { key: 'delivered', label: 'Delivered' },
  ];

  return (
    <section
      ref={sectionRef}
      id="track-order"
      className="w-full py-24 px-5 md:px-16"
      style={{ backgroundColor: 'var(--color-bg-alt)' }}
    >
      <div className="max-w-xl mx-auto text-center">
        {/* Header */}
        <h2
          className={`font-display font-semibold text-3xl sm:text-4xl mb-3 transition-all duration-600 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ color: 'var(--color-text)' }}
        >
          Track Your <em className="italic font-normal" style={{ color: 'var(--color-accent)' }}>Order</em>
        </h2>
        <p
          className={`font-body text-sm mb-10 transition-all duration-600 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ color: 'var(--color-muted)', transitionDelay: '0.1s' }}
        >
          Check the real-time fulfillment status of your saree order from {storeName}
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
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
              placeholder="Enter Order ID or WhatsApp Phone Number"
              className="w-full h-14 pl-5 pr-32 rounded-full text-sm font-body border outline-none shadow-sm focus:border-amber-600 transition-all"
              style={{
                borderColor: error ? '#ef4444' : 'var(--color-border)',
                backgroundColor: 'var(--color-bg)',
                color: 'var(--color-text)',
              }}
            />
            <button
              onClick={handleTrack}
              disabled={loading}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 h-11 px-6 rounded-full font-body font-bold text-xs tracking-wider uppercase text-white flex items-center gap-1.5 shadow-md transition-transform hover:scale-105"
              style={{ backgroundColor: 'var(--color-accent)' }}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>Track</span>
            </button>
          </div>

          {error && (
            <p className="text-left mt-2.5 px-4 text-xs font-medium text-rose-500">
              {error}
            </p>
          )}
        </div>

        {/* Order Status Display */}
        {order && (
          <div
            className="text-left rounded-3xl p-6 md:p-8 shadow-md border animate-in fade-in slide-in-from-bottom-4 duration-500"
            style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)' }}
          >
            <div className="flex items-center justify-between mb-6 pb-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <div>
                <div className="flex items-center gap-2">
                  <PackageCheck className="w-5 h-5 text-amber-600" />
                  <h3 className="font-display font-bold text-base md:text-lg" style={{ color: 'var(--color-text)' }}>
                    {order.orderId}
                  </h3>
                </div>
                <p className="font-body text-xs text-slate-400 mt-0.5">
                  Ordered by {order.customerName} on {order.createdAt}
                </p>
              </div>

              <span
                className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                style={{
                  backgroundColor: `${statusConfig[order.status]?.color || '#C49A5B'}20`,
                  color: statusConfig[order.status]?.color || '#C49A5B',
                }}
              >
                {statusConfig[order.status]?.label || order.status}
              </span>
            </div>

            {/* Step Timeline */}
            <div className="relative pl-4 space-y-6 my-4">
              {steps.map((step, idx) => {
                const currentStepNumber = statusConfig[order.status]?.step || 1;
                const isComplete = idx + 1 <= currentStepNumber;
                const isCurrent = idx + 1 === currentStepNumber;
                const isLast = idx === steps.length - 1;

                return (
                  <div key={step.key} className="relative flex items-start gap-4">
                    {!isLast && (
                      <div
                        className="absolute left-[9px] top-5 w-0.5 h-10 transition-colors"
                        style={{
                          backgroundColor: isComplete && !isCurrent ? '#10b981' : 'var(--color-border)',
                        }}
                      />
                    )}

                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 z-10 text-white transition-all ${
                        isComplete ? 'bg-emerald-600 shadow-sm' : 'border-2 border-slate-300 bg-transparent'
                      }`}
                    >
                      {isComplete && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>

                    <div>
                      <p className={`font-body text-xs font-bold ${isCurrent ? 'text-amber-700' : isComplete ? 'text-slate-900' : 'text-slate-400'}`}>
                        {step.label}
                      </p>
                      {isCurrent && (
                        <span className="text-[10px] text-amber-600 font-medium">Current Status</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t flex justify-between items-center" style={{ borderColor: 'var(--color-border)' }}>
              <span className="font-body text-xs text-slate-500">
                Order Value
              </span>
              <span className="font-body font-bold text-base" style={{ color: 'var(--color-accent)' }}>
                ₹{order.totalAmount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
