import { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { ArrowLeft, MessageCircle, Heart, Loader2 } from 'lucide-react';
import { productStore } from '@/lib/store';
import { useStorefrontContext } from '@/lib/StorefrontContext';
import { STOREFRONT_CONFIG } from '@/lib/config';
import type { Product } from '@/types';
import CustomerNav from '@/components/CustomerNav';
import Footer from '@/sections/Footer';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// Extend local product interface to handle remote storefront details
interface ExtendedProduct extends Product {
  origin?: string;
  weaveTime?: string;
  zariType?: string;
  weave?: string;
  work?: string;
  images?: string[];
}

function getProductColor(name: string, description: string): string {
  const lowerName = name.toLowerCase();
  const lowerDesc = description.toLowerCase();
  
  if (lowerName.includes('crimson') || lowerDesc.includes('crimson red')) return 'Crimson Red';
  if (lowerName.includes('royal blue') || lowerDesc.includes('royal blue')) return 'Royal Blue';
  if (lowerName.includes('natural beige') || lowerDesc.includes('natural beige')) return 'Natural Beige';
  if (lowerName.includes('forest floral') || lowerName.includes('green') || lowerDesc.includes('forest green')) return 'Forest Green';
  if (lowerName.includes('blush') || lowerDesc.includes('blush pink')) return 'Blush Pink';
  if (lowerName.includes('golden peacock') || lowerDesc.includes('golden yellow')) return 'Golden Yellow';
  if (lowerName.includes('white blue') || lowerDesc.includes('white and blue') || lowerDesc.includes('chikankari')) return 'White & Blue';
  if (lowerName.includes('plum') || lowerDesc.includes('plum purple')) return 'Plum Purple';
  if (lowerName.includes('tribal') || lowerDesc.includes('burnt orange')) return 'Burnt Orange';
  if (lowerName.includes('mint') || lowerDesc.includes('mint green')) return 'Mint Green';
  if (lowerName.includes('peacock green')) return 'Peacock Green';
  if (lowerName.includes('coral') || lowerDesc.includes('coral pink')) return 'Coral Pink';
  if (lowerName.includes('ivory') || lowerDesc.includes('ivory white')) return 'Ivory White';
  if (lowerName.includes('ruby') || lowerDesc.includes('ruby red')) return 'Ruby Red';

  const basicColors = ['red', 'blue', 'green', 'yellow', 'pink', 'purple', 'orange', 'black', 'white', 'beige', 'gold', 'silver', 'grey'];
  for (const color of basicColors) {
    if (lowerName.includes(color)) return color.charAt(0).toUpperCase() + color.slice(1);
  }
  for (const color of basicColors) {
    if (lowerDesc.includes(color)) return color.charAt(0).toUpperCase() + color.slice(1);
  }

  return 'Multicolor';
}

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { remoteProducts, storefront, loading } = useStorefrontContext();
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [submittingInquiry, setSubmittingInquiry] = useState(false);

  useEffect(() => {
    // Scroll to top on load
    window.scrollTo(0, 0);
  }, [id]);

  // Map remote products to Product shape with extended fields
  const mappedRemoteProducts = useMemo(() => {
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
      origin: rp.origin,
      weaveTime: rp.weaveTime,
      zariType: rp.zariType,
      weave: rp.weave,
      work: rp.work,
      images: rp.images,
    }));
  }, [remoteProducts]);

  const allProducts = mappedRemoteProducts.length > 0 ? mappedRemoteProducts : productStore.getAll();
  
  const product = useMemo(() => {
    return allProducts.find((p) => p.id === id) as ExtendedProduct | undefined;
  }, [allProducts, id]);

  const [activeImage, setActiveImage] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      setActiveImage(product.image);
    }
  }, [product]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return allProducts
      .filter((p) => p.id !== product.id && (p.category === product.category || p.material === product.material))
      .slice(0, 4);
  }, [allProducts, product]);

  const fallbackRelatedProducts = useMemo(() => {
    if (relatedProducts.length > 0) return relatedProducts;
    return allProducts.filter((p) => p.id !== id).slice(0, 4);
  }, [allProducts, id, relatedProducts]);

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
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

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !customerName.trim()) return;

    setSubmittingInquiry(true);

    // Submit inquiry to Weave365 server API
    if (storefront) {
      try {
        const inquiryUrl = `${STOREFRONT_CONFIG.MAIN_WEBSITE_URL.replace(/\/+$/, '')}/api/storefront`;
        await fetch(inquiryUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            reseller_id: storefront.reseller_id,
            customer_name: customerName,
            items: [{
              product_title: product.name,
              variant_code: product.material || product.category,
              price: product.price,
              qty: 1
            }],
            customer_total: product.price,
          })
        });
      } catch (err) {
        console.error('Error logging inquiry in database:', err);
      }
    }

    // Prefill WhatsApp text
    const summaryText = `Hi ${storefront?.store_name || 'Boutique'}, I would like to inquire about this saree:\n\n*Product Details:*\nName: ${product.name}\nSKU: ${product.sku}\nPrice: ${formatPrice(product.price)}\n\n*My Details:*\nName: ${customerName}`;

    // Open WhatsApp
    const resellerWhatsApp = storefront?.whatsapp || '919919101369';
    window.open(`https://wa.me/${resellerWhatsApp}?text=${encodeURIComponent(summaryText)}`, '_blank');

    setSubmittingInquiry(false);
    setIsInquiryOpen(false);
    setCustomerName('');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-bg)] gap-4">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-accent)' }} />
        <p className="font-body text-sm" style={{ color: 'var(--color-muted)' }}>Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-bg)' }}>
        <CustomerNav />
        <main className="flex-grow flex flex-col items-center justify-center gap-6 py-28 px-5">
          <h2 className="font-display font-semibold text-2xl" style={{ color: 'var(--color-text)' }}>Spotlight Weave Not Found</h2>
          <p className="font-body text-sm" style={{ color: 'var(--color-muted)' }}>The product you are looking for does not exist or has been removed.</p>
          <Link
            to="/"
            className="flex items-center gap-2 font-body font-medium text-sm px-6 py-2.5 rounded-pill"
            style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-bg)' }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-bg)' }}>
      <CustomerNav />

      {/* Main product wrapper */}
      <main className="flex-grow pt-28 pb-20 px-5 md:px-16 max-w-7xl mx-auto w-full">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-body text-xs tracking-wider uppercase mb-8 hover:opacity-75 transition-opacity"
          style={{ color: 'var(--color-muted)' }}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Signature Weaves
        </Link>

        {/* Product Spotlight Grid */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-start mb-20">
          
          {/* Left Column: Product Image (3:4 aspect ratio) and Thumbnails */}
          <div className="flex flex-col gap-4 w-full">
            <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden shadow-sm" style={{ border: '1px solid var(--color-border)' }}>
              <img
                src={activeImage || product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-102"
              />
              {wishlist.has(product.id) && (
                <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-full p-2.5 shadow-sm">
                  <Heart className="w-4 h-4 fill-red-500 stroke-red-500" />
                </div>
              )}
            </div>

            {/* Thumbnails list */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto py-1 scrollbar-thin">
                {product.images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(imgUrl)}
                    className={`relative w-20 aspect-[3/4] rounded-md overflow-hidden flex-shrink-0 border transition-all duration-200 ${
                      activeImage === imgUrl ? 'ring-2 ring-accent scale-[0.98]' : 'hover:opacity-80'
                    }`}
                    style={{
                      borderColor: activeImage === imgUrl ? 'var(--color-accent)' : 'var(--color-border)',
                      // @ts-ignore
                      '--tw-ring-color': 'var(--color-accent)',
                    }}
                  >
                    <img src={imgUrl} alt={`${product.name} view ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Saree Details & Specs */}
          <div className="flex flex-col">
            <span className="font-body text-xs tracking-[0.15em] uppercase mb-2 font-semibold" style={{ color: 'var(--color-accent)' }}>
              {product.category}
            </span>
            <h1 className="font-display font-semibold text-3xl md:text-4xl mb-4 leading-tight" style={{ color: 'var(--color-text)' }}>
              {product.name}
            </h1>

            <div className="flex items-baseline gap-4 mb-6">
              <span className="font-body font-bold text-2xl md:text-3xl" style={{ color: 'var(--color-accent)' }}>
                {formatPrice(product.price)}
              </span>
              {product.compareAtPrice && (
                <span className="font-body text-base line-through" style={{ color: 'var(--color-muted)' }}>
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
            </div>

            {/* Action Buttons Row */}
            <div className="flex gap-3 mb-10">
              <button
                onClick={() => setIsInquiryOpen(true)}
                className="flex-[3] flex items-center justify-center gap-2 py-3.5 rounded-pill font-medium text-xs md:text-sm transition-all duration-300 hover:scale-[1.01] hover:shadow-lg"
                style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-bg)' }}
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span className="whitespace-nowrap">Request Acquisition</span>
              </button>

              <button
                onClick={() => toggleWishlist(product.id)}
                className="flex-[2] flex items-center justify-center gap-2 py-3.5 rounded-pill font-body text-[10px] md:text-xs tracking-wider uppercase border transition-all duration-200 hover:bg-black/[0.02]"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
              >
                <Heart className={`w-4 h-4 ${wishlist.has(product.id) ? 'fill-red-500 stroke-red-500' : ''}`} />
                <span className="whitespace-nowrap">
                  {wishlist.has(product.id) ? 'Saved' : 'Wishlist'}
                </span>
              </button>
            </div>

            {/* Description Narrative */}
            <div className="mb-10 pb-8" style={{ borderBottom: '1px solid var(--color-border)' }}>
              <h3 className="font-body font-semibold text-xs tracking-wider uppercase mb-3" style={{ color: 'var(--color-muted)' }}>
                The Weaving Narrative
              </h3>
              <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                {product.description}
              </p>
            </div>

            {/* Specifications Table */}
            <div>
              <h3 className="font-body font-semibold text-xs tracking-wider uppercase mb-4" style={{ color: 'var(--color-muted)' }}>
                Product Specifications
              </h3>
              <div className="overflow-hidden rounded-lg border" style={{ borderColor: 'var(--color-border)' }}>
                <table className="w-full text-sm font-body">
                  <tbody>
                    <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td className="px-4 py-3 font-medium bg-black/[0.01] w-1/3" style={{ color: 'var(--color-muted)' }}>Material</td>
                      <td className="px-4 py-3" style={{ color: 'var(--color-text)' }}>{product.material || product.category}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td className="px-4 py-3 font-medium bg-black/[0.01]" style={{ color: 'var(--color-muted)' }}>Color</td>
                      <td className="px-4 py-3" style={{ color: 'var(--color-text)' }}>{getProductColor(product.name, product.description)}</td>
                    </tr>
                    {product.origin && (
                      <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <td className="px-4 py-3 font-medium bg-black/[0.01]" style={{ color: 'var(--color-muted)' }}>Origin</td>
                        <td className="px-4 py-3" style={{ color: 'var(--color-text)' }}>{product.origin}</td>
                      </tr>
                    )}
                    {product.weaveTime && (
                      <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <td className="px-4 py-3 font-medium bg-black/[0.01]" style={{ color: 'var(--color-muted)' }}>Weave Time</td>
                        <td className="px-4 py-3" style={{ color: 'var(--color-text)' }}>{product.weaveTime}</td>
                      </tr>
                    )}
                    {product.zariType && (
                      <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <td className="px-4 py-3 font-medium bg-black/[0.01]" style={{ color: 'var(--color-muted)' }}>Zari Spec</td>
                        <td className="px-4 py-3" style={{ color: 'var(--color-text)' }}>{product.zariType}</td>
                      </tr>
                    )}
                    {product.weave && (
                      <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <td className="px-4 py-3 font-medium bg-black/[0.01]" style={{ color: 'var(--color-muted)' }}>Weave Type</td>
                        <td className="px-4 py-3" style={{ color: 'var(--color-text)' }}>{product.weave}</td>
                      </tr>
                    )}
                    {product.work && (
                      <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <td className="px-4 py-3 font-medium bg-black/[0.01]" style={{ color: 'var(--color-muted)' }}>Work</td>
                        <td className="px-4 py-3" style={{ color: 'var(--color-text)' }}>{product.work}</td>
                      </tr>
                    )}
                    <tr>
                      <td className="px-4 py-3 font-medium bg-black/[0.01]" style={{ color: 'var(--color-muted)' }}>Saree Length</td>
                      <td className="px-4 py-3" style={{ color: 'var(--color-text)' }}>6.3m (including 85cm Blouse fabric)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>

        {/* Related Weaves Section */}
        <section className="pt-12" style={{ borderTop: '1px solid var(--color-border)' }}>
          <h2 className="font-display font-semibold text-2xl mb-2" style={{ color: 'var(--color-text)' }}>Artisan Recommendations</h2>
          <p className="font-body text-sm mb-8" style={{ color: 'var(--color-muted)' }}>Other limited runs you might cherish in your collection</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {fallbackRelatedProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => navigate(`/product/${p.id}`)}
                className="group cursor-pointer flex flex-col"
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-lg mb-3 shadow-sm" style={{ border: '1px solid var(--color-border)' }}>
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover transition-transform duration-350 ease-out group-hover:scale-104"
                  />
                </div>
                <h3 className="font-body font-medium text-[14px] truncate" style={{ color: 'var(--color-text)' }}>
                  {p.name}
                </h3>
                <span className="font-body font-semibold text-sm mt-1" style={{ color: 'var(--color-accent)' }}>
                  {formatPrice(p.price)}
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />

      {/* Inquiry Dialog Modal */}
      <Dialog open={isInquiryOpen} onOpenChange={setIsInquiryOpen}>
        <DialogContent className="max-w-md p-6" style={{ backgroundColor: 'var(--color-bg)' }}>
          <DialogHeader>
            <DialogTitle className="font-display font-semibold text-xl" style={{ color: 'var(--color-text)' }}>
              Order Enquiry
            </DialogTitle>
          </DialogHeader>
          <p className="font-body text-xs leading-relaxed mb-4 mt-2" style={{ color: 'var(--color-muted)' }}>
            Provide your name below to prepare a WhatsApp message. This request will be submitted directly to coordinate the customized acquisition process.
          </p>
          <form onSubmit={handleInquirySubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block font-body text-xs font-semibold mb-1 uppercase tracking-wider" style={{ color: 'var(--color-muted)' }}>
                Your Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Full Name"
                className="w-full h-10 px-3 rounded-lg text-sm font-body outline-none"
                style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}
              />
            </div>
            <button
              type="submit"
              disabled={submittingInquiry}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-pill font-medium text-sm transition-all duration-200 hover:scale-[1.02]"
              style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-bg)' }}
            >
              {submittingInquiry ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <MessageCircle className="w-4 h-4 fill-current" />
              )}
              Send via WhatsApp
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
