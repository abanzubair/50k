import { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Heart, Eye, X, MessageCircle, Loader2, Sparkles } from 'lucide-react';
import { useStorefrontContext } from '@/lib/StorefrontContext';
import { supabase } from '@/lib/supabase';
import type { StorefrontProduct } from '@/types/storefront';
import { Dialog, DialogContent } from '@/components/ui/dialog';

export default function Sarees() {
  const { remoteProducts, loading: storefrontLoading, storefront, storeName } = useStorefrontContext();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');
  const [visibleCount, setVisibleCount] = useState(8);
  const [selectedProduct, setSelectedProduct] = useState<StorefrontProduct | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const sectionRef = useRef<HTMLElement>(null);

  // Quick inquiry state
  const [inquiryName, setInquiryName] = useState(() => localStorage.getItem('weave365_buyer_name') || '');
  const [inquiryPhone, setInquiryPhone] = useState(() => localStorage.getItem('weave365_buyer_phone') || '');
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [submittingInquiry, setSubmittingInquiry] = useState(false);

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

  // Derive categories dynamically from boutique sarees
  const filterCategories = useMemo(() => {
    if (!remoteProducts || remoteProducts.length === 0) return ['All'];
    const cats = [...new Set(remoteProducts.map((p) => p.fabric || p.category || 'Saree'))];
    return ['All', ...cats];
  }, [remoteProducts]);

  const filteredProducts = useMemo(() => {
    if (!remoteProducts) return [];
    if (activeFilter === 'All') return remoteProducts;
    return remoteProducts.filter(
      (p) => (p.fabric || p.category || 'Saree') === activeFilter
    );
  }, [remoteProducts, activeFilter]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  const toggleWishlist = (id: string | number, e: React.MouseEvent) => {
    e.stopPropagation();
    const strId = String(id);
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(strId)) next.delete(strId);
      else next.add(strId);
      return next;
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleQuickInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanBuyerPhone = inquiryPhone.replace(/[^0-9+]/g, '').trim();

    if (!cleanBuyerPhone || cleanBuyerPhone.length < 8) {
      setPhoneError('Please enter a valid WhatsApp number (min 8 digits)');
      return;
    }

    if (!selectedProduct || !inquiryName.trim()) return;

    localStorage.setItem('weave365_buyer_name', inquiryName.trim());
    localStorage.setItem('weave365_buyer_phone', cleanBuyerPhone);

    setSubmittingInquiry(true);
    try {
      // 1. Insert lead into boutique_orders on Secondary DB
      if (storefront?.id) {
        try {
          await supabase.from('boutique_inquiries').insert({
            tenant_id: storefront.id,
            customer_name: inquiryName.trim(),
            customer_phone: cleanBuyerPhone,
            subject: 'Quick Inquiry',
            message: `Quick Inquiry for SKU: ${selectedProduct.sku} (${selectedProduct.title}) | Buyer WhatsApp: ${cleanBuyerPhone}`,
            product_title: selectedProduct.title,
            sku: selectedProduct.sku,
            status: 'New Inquiry',
          });
        } catch (_) {}


      }

      // 2. Open WhatsApp
      const whatsapp = storefront?.whatsapp || '919919101369';
      const cleanStorePhone = whatsapp.replace(/[^0-9]/g, '');
      const msg = `Hi ${storeName}, I would like to order/inquire about this saree:\n\n*${selectedProduct.title}*\nSKU: ${selectedProduct.sku}\nPrice: ${formatPrice(selectedProduct.price)}\n\n*Buyer Contact Details:*\nName: ${inquiryName.trim()}\nWhatsApp: ${cleanBuyerPhone}`;
      window.open(`https://wa.me/${cleanStorePhone}?text=${encodeURIComponent(msg)}`, '_blank');
      
      setSelectedProduct(null);
    } catch (err) {
      console.error('Error submitting inquiry:', err);
    } finally {
      setSubmittingInquiry(false);
    }
  };

  return (
    <section ref={sectionRef} id="sarees" className="w-full py-20 px-5 md:px-16" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <p className="font-body font-bold text-xs tracking-[0.2em] uppercase mb-2" style={{ color: 'var(--color-accent)' }}>
          Curated Pure Silk Collection
        </p>
        <h2 className="font-display font-semibold text-3xl sm:text-4xl" style={{ color: 'var(--color-text)' }}>
          Handwoven <em className="font-normal italic" style={{ color: 'var(--color-accent)' }}>Artistry</em>
        </h2>
        <p className="font-body text-sm mt-3 leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
          Each saree is an authentic Banarasi creation woven with pure silk yarns, intricate zari borders, and timeless craftsmanship.
        </p>
      </div>

      {/* Filter Tabs */}
      {filterCategories.length > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {filterCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveFilter(cat);
                setVisibleCount(8);
              }}
              className={`font-body text-xs font-semibold tracking-wider px-5 py-2.5 rounded-full transition-all duration-200 ${
                activeFilter === cat
                  ? 'shadow-md scale-105'
                  : 'hover:opacity-80'
              }`}
              style={{
                backgroundColor: activeFilter === cat ? 'var(--color-accent)' : 'var(--color-bg-alt)',
                color: activeFilter === cat ? 'var(--color-bg)' : 'var(--color-text)',
                border: '1px solid var(--color-border)',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Loading State */}
      {storefrontLoading && (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-accent)' }} />
          <p className="font-body text-xs font-medium text-slate-500">Loading exquisite weaves...</p>
        </div>
      )}

      {/* Empty State */}
      {!storefrontLoading && remoteProducts.length === 0 && (
        <div className="py-20 text-center max-w-md mx-auto rounded-3xl p-8 border" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-alt)' }}>
          <Sparkles className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--color-accent)' }} />
          <h3 className="font-display font-bold text-xl" style={{ color: 'var(--color-text)' }}>
            Catalog Updating
          </h3>
          <p className="font-body text-xs text-slate-500 mt-2 mb-6 leading-relaxed">
            New authentic Banarasi sarees are currently being cataloged for {storeName}. Check back shortly or contact us directly on WhatsApp.
          </p>
          {storefront?.whatsapp && (
            <a
              href={`https://wa.me/${storefront.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold tracking-wider uppercase text-white shadow-lg"
              style={{ backgroundColor: 'var(--color-accent)' }}
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              Chat on WhatsApp
            </a>
          )}
        </div>
      )}

      {/* Product Grid */}
      {!storefrontLoading && visibleProducts.length > 0 && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {visibleProducts.map((product, index) => {
              const strId = String(product.id);
              const isWishlisted = wishlist.has(strId);

              return (
                <div
                  key={product.id}
                  className={`group cursor-pointer transition-all duration-500 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                  }`}
                  style={{ transitionDelay: `${0.1 + index * 0.05}s` }}
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <div
                    className="relative overflow-hidden rounded-2xl mb-3 shadow-sm border"
                    style={{ aspectRatio: '3/4', borderColor: 'var(--color-border)' }}
                  >
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 px-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProduct(product);
                        }}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-transform hover:scale-105 shadow-md"
                        style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Quick View
                      </button>
                      <button
                        onClick={(e) => toggleWishlist(product.id, e)}
                        className="w-9 h-9 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-md"
                        style={{
                          backgroundColor: isWishlisted ? '#ef4444' : 'var(--color-bg)',
                          color: isWishlisted ? '#fff' : 'var(--color-text)',
                        }}
                      >
                        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    {/* Badge */}
                    <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-black/60 text-white backdrop-blur-sm">
                      {product.fabric || 'Pure Silk'}
                    </div>
                  </div>

                  <h3 className="font-body font-semibold text-sm truncate" style={{ color: 'var(--color-text)' }}>
                    {product.title}
                  </h3>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-body font-bold text-sm md:text-base" style={{ color: 'var(--color-accent)' }}>
                      {formatPrice(product.price)}
                    </span>
                    <span className="font-mono text-[11px] text-slate-400">
                      {product.sku}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Load More */}
          {visibleCount < filteredProducts.length && (
            <div className="text-center mt-12">
              <button
                onClick={() => setVisibleCount((prev) => prev + 8)}
                className="font-body font-semibold text-xs tracking-wider uppercase px-8 py-3.5 rounded-full border transition-all hover:scale-105 shadow-sm"
                style={{
                  borderColor: 'var(--color-accent)',
                  color: 'var(--color-accent)',
                  backgroundColor: 'transparent',
                }}
              >
                Load More Sarees ({filteredProducts.length - visibleCount} Remaining)
              </button>
            </div>
          )}
        </>
      )}

      {/* Quick View Dialog */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-3xl" style={{ backgroundColor: 'var(--color-bg)' }}>
          {selectedProduct && (
            <div className="grid md:grid-cols-2 gap-0">
              <div className="aspect-[3/4] md:aspect-auto">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 md:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-body text-[11px] tracking-wider uppercase font-bold" style={{ color: 'var(--color-accent)' }}>
                      {selectedProduct.fabric || 'Pure Silk'} • {selectedProduct.weave || 'Banarasi'}
                    </span>
                    <button
                      onClick={() => setSelectedProduct(null)}
                      className="w-7 h-7 rounded-full flex items-center justify-center bg-black/5 hover:bg-black/10 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="font-display font-bold text-xl md:text-2xl mb-2 leading-snug" style={{ color: 'var(--color-text)' }}>
                    {selectedProduct.title}
                  </h3>
                  <p className="font-body text-xs leading-relaxed mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                    {selectedProduct.description}
                  </p>

                  <div className="flex items-center gap-3 mb-6">
                    <span className="font-body font-bold text-2xl" style={{ color: 'var(--color-accent)' }}>
                      {formatPrice(selectedProduct.price)}
                    </span>
                    <span className="font-mono text-xs text-slate-400">
                      SKU: {selectedProduct.sku}
                    </span>
                  </div>

                  <div className="space-y-2 py-3 border-y text-xs mb-6" style={{ borderColor: 'var(--color-border)' }}>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Fabric</span>
                      <span className="font-semibold">{selectedProduct.fabric || 'Silk'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Weave Type</span>
                      <span className="font-semibold">{selectedProduct.weave || 'Powerloom'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Origin</span>
                      <span className="font-semibold">Varanasi, India</span>
                    </div>
                  </div>
                </div>

                {/* Quick Inquiry Form */}
                <form onSubmit={handleQuickInquiry} className="space-y-3">
                  <input
                    type="text"
                    required
                    value={inquiryName}
                    onChange={(e) => setInquiryName(e.target.value)}
                    placeholder="Your Full Name *"
                    className="w-full px-4 py-2.5 rounded-xl text-xs font-body border outline-none focus:border-amber-600"
                    style={{ backgroundColor: 'var(--color-bg-alt)', borderColor: 'var(--color-border)' }}
                  />
                  <div>
                    <input
                      type="tel"
                      required
                      value={inquiryPhone}
                      onChange={(e) => {
                        setInquiryPhone(e.target.value);
                        if (phoneError) setPhoneError(null);
                      }}
                      placeholder="Your WhatsApp Number (+91...) *"
                      className="w-full px-4 py-2.5 rounded-xl text-xs font-body border outline-none focus:border-amber-600 font-mono"
                      style={{ backgroundColor: 'var(--color-bg-alt)', borderColor: phoneError ? '#ef4444' : 'var(--color-border)' }}
                    />
                    {phoneError && (
                      <p className="text-[11px] text-red-500 mt-1">{phoneError}</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={submittingInquiry}
                    className="w-full py-3 rounded-full font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.02]"
                    style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-bg)' }}
                  >
                    {submittingInquiry ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <MessageCircle className="w-4 h-4 fill-current" />
                    )}
                    <span>Inquire / Order on WhatsApp</span>
                  </button>
                </form>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
