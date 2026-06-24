import { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Heart, Eye, X, Loader2 } from 'lucide-react';
import { productStore } from '@/lib/store';
import { useStorefrontContext } from '@/lib/StorefrontContext';
import type { Product } from '@/types';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const LOCAL_FILTER_CATEGORIES = ['All', 'Banarasi Silk', 'Kanjeevaram', 'Linen', 'Cotton', 'Designer', 'Festive'];

export default function Sarees() {
  const { remoteProducts, loading: storefrontLoading, storefront } = useStorefrontContext();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');
  const [visibleCount, setVisibleCount] = useState(8);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
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

  // Map remote products (from Weave365 API) into the local Product shape
  const mappedRemoteProducts: Product[] = useMemo(() => {
    if (!remoteProducts || remoteProducts.length === 0) return [];
    return remoteProducts.map((rp) => ({
      id: String(rp.id),
      name: rp.title,
      description: rp.description,
      price: rp.price,
      image: rp.image,
      category: rp.fabric || 'Uncategorized',
      material: rp.fabric || '',
      stock: 10,
      status: 'active' as const,
      sku: `WV-${rp.id}`,
      createdAt: new Date().toISOString().split('T')[0],
    }));
  }, [remoteProducts]);

  // Decide which product source to use
  const hasRemoteProducts = mappedRemoteProducts.length > 0;
  const allProducts = hasRemoteProducts ? mappedRemoteProducts : productStore.getAll();

  // Derive filter categories dynamically from remote products, or use local defaults
  const filterCategories = useMemo(() => {
    if (hasRemoteProducts) {
      const cats = [...new Set(mappedRemoteProducts.map((p) => p.category))];
      return ['All', ...cats];
    }
    return LOCAL_FILTER_CATEGORIES;
  }, [hasRemoteProducts, mappedRemoteProducts]);

  const products = activeFilter === 'All'
    ? allProducts
    : allProducts.filter((p) => p.category === activeFilter);
  const visibleProducts = products.slice(0, visibleCount);

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
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

  return (
    <section
      ref={sectionRef}
      id="sarees"
      className="w-full py-24 md:py-32 px-5 md:px-16"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      {/* Section Header */}
      <div className={`text-center mb-12 transition-all duration-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <h2 className="font-display font-semibold text-h1" style={{ color: 'var(--color-text)' }}>
          Our <em style={{ color: 'var(--color-accent)' }}>Collection</em>
        </h2>
        <p className="font-body font-light text-base mt-4" style={{ color: 'var(--color-muted)' }}>
          {hasRemoteProducts
            ? `Browse ${storefront?.store_name || 'our'} handpicked sarees`
            : 'Browse our handpicked sarees across traditional and contemporary styles'}
        </p>
      </div>

      {/* Loading State */}
      {storefrontLoading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-accent)' }} />
          <p className="font-body text-sm" style={{ color: 'var(--color-muted)' }}>
            Curating collection...
          </p>
        </div>
      )}

      {!storefrontLoading && (
        <>
          {/* Filter Bar */}
          <div className={`flex flex-wrap justify-center gap-3 mb-12 transition-all duration-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '0.15s' }}>
            {filterCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveFilter(cat);
                  setVisibleCount(8);
                }}
                className="font-body text-[13px] px-5 py-2 rounded-pill transition-all duration-200"
                style={{
                  backgroundColor: activeFilter === cat ? 'var(--color-accent)' : 'transparent',
                  color: activeFilter === cat ? 'var(--color-bg)' : 'var(--color-text)',
                  border: `1px solid ${activeFilter === cat ? 'var(--color-accent)' : 'var(--color-border)'}`,
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {visibleProducts.map((product, index) => (
              <div
                key={product.id}
                className={`group cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${0.2 + index * 0.06}s` }}
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <div
                  className="relative overflow-hidden rounded-lg mb-3"
                  style={{ aspectRatio: '3/4' }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                  />
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProduct(product);
                      }}
                      className="flex items-center gap-2 px-4 py-2 rounded-pill text-sm font-medium transition-transform duration-200 hover:scale-105"
                      style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}
                    >
                      <Eye className="w-4 h-4" />
                      Quick View
                    </button>
                    <button
                      onClick={(e) => toggleWishlist(product.id, e)}
                      className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                      style={{
                        backgroundColor: wishlist.has(product.id) ? 'var(--color-danger)' : 'var(--color-bg)',
                        color: wishlist.has(product.id) ? '#fff' : 'var(--color-text)',
                      }}
                    >
                      <Heart className={`w-4 h-4 ${wishlist.has(product.id) ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                  {/* Stock badge */}
                  {product.stock <= 5 && (
                    <div className="absolute top-2 left-2 px-2 py-1 rounded-sm text-[10px] font-medium bg-red-500 text-white">
                      Only {product.stock} left
                    </div>
                  )}
                </div>
                <h3 className="font-body font-medium text-[15px] truncate" style={{ color: 'var(--color-text)' }}>
                  {product.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-body font-semibold text-base" style={{ color: 'var(--color-accent)' }}>
                    {formatPrice(product.price)}
                  </span>
                  {product.compareAtPrice && (
                    <span className="font-body text-sm line-through" style={{ color: 'var(--color-muted)' }}>
                      {formatPrice(product.compareAtPrice)}
                    </span>
                  )}
                </div>
                <span className="font-body text-xs mt-1 block" style={{ color: 'var(--color-muted)' }}>
                  {product.category}
                </span>
              </div>
            ))}
          </div>

          {/* Load More */}
          {visibleCount < products.length && (
            <div className="text-center mt-12">
              <button
                onClick={() => setVisibleCount((prev) => prev + 4)}
                className="font-body font-medium text-sm px-8 py-3 rounded-pill border transition-all duration-300 hover:scale-105"
                style={{
                  borderColor: 'var(--color-accent)',
                  color: 'var(--color-accent)',
                  backgroundColor: 'transparent',
                }}
              >
                Load More
              </button>
            </div>
          )}
        </>
      )}

      {/* Quick View Modal */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden" style={{ backgroundColor: 'var(--color-bg)' }}>
          {selectedProduct && (
            <div className="grid md:grid-cols-2 gap-0">
              <div className="aspect-[3/4] md:aspect-auto">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 md:p-8 flex flex-col justify-center">
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                  style={{ backgroundColor: 'var(--color-bg-alt)' }}
                >
                  <X className="w-4 h-4" />
                </button>
                <span className="font-body text-xs tracking-wider uppercase mb-2" style={{ color: 'var(--color-accent)' }}>
                  {selectedProduct.category}
                </span>
                <h3 className="font-display font-semibold text-2xl mb-2" style={{ color: 'var(--color-text)' }}>
                  {selectedProduct.name}
                </h3>
                <p className="font-body text-sm mb-4 leading-relaxed" style={{ color: 'var(--color-muted)' }}>
                  {selectedProduct.description}
                </p>
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-body font-bold text-xl" style={{ color: 'var(--color-accent)' }}>
                    {formatPrice(selectedProduct.price)}
                  </span>
                  {selectedProduct.compareAtPrice && (
                    <span className="font-body text-sm line-through" style={{ color: 'var(--color-muted)' }}>
                      {formatPrice(selectedProduct.compareAtPrice)}
                    </span>
                  )}
                </div>
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span style={{ color: 'var(--color-muted)' }}>Material</span>
                    <span className="font-medium">{selectedProduct.material}</span>
                  </div>
                  {!hasRemoteProducts && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span style={{ color: 'var(--color-muted)' }}>Stock</span>
                        <span className="font-medium">{selectedProduct.stock} available</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span style={{ color: 'var(--color-muted)' }}>SKU</span>
                        <span className="font-medium">{selectedProduct.sku}</span>
                      </div>
                    </>
                  )}
                </div>
                <button
                  className="w-full py-3 rounded-pill font-medium text-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
                  style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-bg)' }}
                  onClick={() => alert('Inquiry sent! We will contact you soon.')}
                >
                  Inquire Now
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
