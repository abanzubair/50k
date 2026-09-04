import { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { ArrowLeft, MessageCircle, Heart, Loader2, Share2, Check } from 'lucide-react';
import { useStorefrontContext } from '@/lib/StorefrontContext';
import { supabase } from '@/lib/supabase';
import type { StorefrontProduct } from '@/types/storefront';
import CustomerNav from '@/components/CustomerNav';
import Footer from '@/sections/Footer';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { remoteProducts, storefront, storeName, loading: storefrontLoading } = useStorefrontContext();
  const [product, setProduct] = useState<StorefrontProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>('');
  const [wishlisted, setWishlisted] = useState(false);
  const [copied, setCopied] = useState(false);

  // Inquiry modal state
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [submittingInquiry, setSubmittingInquiry] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    async function loadProduct() {
      if (!id) return;
      setLoading(true);

      // 1. Check if product already in remoteProducts context
      const found = remoteProducts.find((p) => String(p.id) === String(id) || String(p.original_product_id) === String(id));
      if (found) {
        setProduct(found);
        setActiveImage(found.images?.[0] || found.image);
        setLoading(false);
        return;
      }

      // 2. Fetch directly from database
      try {
        const { data, error } = await supabase
          .from('boutique_products')
          .select('*')
          .or(`id.eq.${id},original_product_id.eq.${id}`)
          .maybeSingle();

        if (data && !error) {
          const price = Number(data.retail_price || data.base_price || 0);
          const imagesList = Array.isArray(data.images) && data.images.length > 0 ? data.images : [];
          const primaryImage = imagesList[0] || '/images/hero-saree.jpg';

          const prodObj: StorefrontProduct = {
            id: data.id,
            tenant_id: data.tenant_id,
            original_product_id: data.original_product_id,
            sku: data.sku || `WV-${data.id}`,
            title: data.title,
            description: data.description || 'Exquisite handcrafted Banarasi masterpiece woven with delicate zari work and luxurious texture.',
            price,
            base_price: Number(data.base_price || 0),
            retail_price: price,
            image: primaryImage,
            images: imagesList.length > 0 ? imagesList : [primaryImage],
            category: data.category || 'Saree',
            fabric: data.fabric || 'Soft Silk',
            weave: data.weave || 'Powerloom',
            work: data.work || 'Intricate Zari Work',
            is_published: data.is_published,
          };

          setProduct(prodObj);
          setActiveImage(primaryImage);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id, remoteProducts]);

  const relatedProducts = useMemo(() => {
    if (!product || !remoteProducts) return [];
    return remoteProducts
      .filter((p) => String(p.id) !== String(product.id))
      .slice(0, 4);
  }, [product, remoteProducts]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.title || 'Banarasi Saree',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !customerName.trim()) return;

    setSubmittingInquiry(true);
    try {
      // 1. Insert order/inquiry into boutique_orders on Secondary DB
      if (storefront?.id) {
        try {
          await supabase.from('boutique_inquiries').insert({
            tenant_id: storefront.id,
            customer_name: customerName.trim(),
            customer_phone: customerPhone.trim() || null,
            subject: 'Saree Inquiry',
            message: `WhatsApp Inquiry for SKU: ${product.sku} (${product.title})`,
            product_title: product.title,
            sku: product.sku,
            status: 'New Inquiry',
          });
        } catch (_) {}

        await supabase.from('boutique_orders').insert({
          tenant_id: storefront.id,
          customer_name: customerName.trim(),
          customer_phone: customerPhone.trim() || null,
          total_amount: product.price,
          status: 'Inquiry on WhatsApp',
          notes: `WhatsApp Inquiry for SKU: ${product.sku} (${product.title})`,
          items: [{ title: product.title, sku: product.sku, price: product.price }],
        });
      }

      // 2. Open WhatsApp with prefilled message
      const whatsapp = storefront?.whatsapp || '919919101369';
      const cleanPhone = whatsapp.replace(/[^0-9]/g, '');
      const summaryText = `Hi ${storeName}, I would like to order/inquire about this saree:\n\n*Product Details:*\nTitle: ${product.title}\nSKU: ${product.sku}\nPrice: ${formatPrice(product.price)}\nFabric: ${product.fabric || 'Pure Silk'}\nLink: ${window.location.href}\n\n*Customer Details:*\nName: ${customerName.trim()}\n${customerPhone.trim() ? `Phone: ${customerPhone.trim()}` : ''}`;

      window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(summaryText)}`, '_blank');

      setIsInquiryOpen(false);
      setCustomerName('');
      setCustomerPhone('');
    } catch (err) {
      console.error('Error logging inquiry:', err);
    } finally {
      setSubmittingInquiry(false);
    }
  };

  if (loading || storefrontLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-bg)] gap-4">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-accent)' }} />
        <p className="font-body text-xs font-semibold text-slate-500">Unfolding saree details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-bg)] gap-4 px-4 text-center">
        <h2 className="font-display font-bold text-2xl" style={{ color: 'var(--color-text)' }}>
          Saree Not Found
        </h2>
        <p className="font-body text-xs text-slate-500">
          The requested saree may no longer be available in this boutique.
        </p>
        <Link
          to="/"
          className="mt-4 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white"
          style={{ backgroundColor: 'var(--color-accent)' }}
        >
          Return to Boutique Catalog
        </Link>
      </div>
    );
  }

  const imagesList = product.images && product.images.length > 0 ? product.images : [product.image];

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-bg)' }}>
      <CustomerNav />

      <main className="flex-1 max-w-6xl mx-auto px-5 md:px-8 pt-28 pb-16 w-full">
        {/* Breadcrumb / Back */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 font-body text-xs font-semibold tracking-wider text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Collection
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-full border border-slate-200 hover:bg-slate-100 transition-colors text-slate-600"
              title="Share"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setWishlisted(!wishlisted)}
              className="p-2 rounded-full border border-slate-200 hover:bg-slate-100 transition-colors"
              title="Save to Wishlist"
            >
              <Heart className={`w-4 h-4 ${wishlisted ? 'fill-rose-500 text-rose-500' : 'text-slate-600'}`} />
            </button>
          </div>
        </div>

        {/* Product Hero */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-14 mb-16">
          {/* Gallery - 7 cols on desktop */}
          <div className="md:col-span-6 lg:col-span-7 flex flex-col gap-4">
            {/* Main Active Image */}
            <div
              className="relative w-full rounded-2xl overflow-hidden shadow-md border"
              style={{ aspectRatio: '3/4', borderColor: 'var(--color-border)' }}
            >
              <img
                src={activeImage || product.image}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-black/60 text-white backdrop-blur-sm">
                {product.fabric || 'Pure Silk'}
              </div>
            </div>

            {/* Thumbnail Strip */}
            {imagesList.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                {imagesList.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`relative flex-shrink-0 w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImage === img ? 'border-amber-600 scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details - 5 cols on desktop */}
          <div className="md:col-span-6 lg:col-span-5 flex flex-col justify-between">
            <div>
              <span className="font-body text-xs font-bold tracking-[0.18em] uppercase" style={{ color: 'var(--color-accent)' }}>
                {storeName} • {product.fabric || 'Handcrafted Silk'}
              </span>

              <h1 className="font-display font-semibold text-2xl sm:text-3xl lg:text-4xl mt-2 mb-3 leading-snug" style={{ color: 'var(--color-text)' }}>
                {product.title}
              </h1>

              <div className="flex items-baseline gap-3 mb-6 pb-6 border-b" style={{ borderColor: 'var(--color-border)' }}>
                <span className="font-body font-bold text-3xl" style={{ color: 'var(--color-accent)' }}>
                  {formatPrice(product.price)}
                </span>
                <span className="font-mono text-xs text-slate-400">
                  SKU: {product.sku}
                </span>
              </div>

              {/* Narrative */}
              <div className="mb-8">
                <h3 className="font-body font-bold text-xs uppercase tracking-wider text-slate-400 mb-2">
                  The Weaving Narrative
                </h3>
                <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                  {product.description}
                </p>
              </div>

              {/* Specifications Table */}
              <div className="rounded-xl overflow-hidden border text-xs mb-8" style={{ borderColor: 'var(--color-border)' }}>
                <table className="w-full font-body">
                  <tbody>
                    <tr className="border-b" style={{ borderColor: 'var(--color-border)' }}>
                      <td className="px-4 py-3 text-slate-500 font-medium bg-black/[0.02] w-1/3">Fabric</td>
                      <td className="px-4 py-3 font-semibold">{product.fabric || 'Pure Silk'}</td>
                    </tr>
                    <tr className="border-b" style={{ borderColor: 'var(--color-border)' }}>
                      <td className="px-4 py-3 text-slate-500 font-medium bg-black/[0.02]">Weave Type</td>
                      <td className="px-4 py-3 font-semibold">{product.weave || 'Powerloom / Traditional'}</td>
                    </tr>
                    <tr className="border-b" style={{ borderColor: 'var(--color-border)' }}>
                      <td className="px-4 py-3 text-slate-500 font-medium bg-black/[0.02]">Work</td>
                      <td className="px-4 py-3 font-semibold">{product.work || 'Intricate Zari Border & Pallu'}</td>
                    </tr>
                    <tr className="border-b" style={{ borderColor: 'var(--color-border)' }}>
                      <td className="px-4 py-3 text-slate-500 font-medium bg-black/[0.02]">Origin</td>
                      <td className="px-4 py-3 font-semibold">Varanasi, Uttar Pradesh</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-slate-500 font-medium bg-black/[0.02]">Length</td>
                      <td className="px-4 py-3 font-semibold">6.3 Meters (Includes 80cm matching blouse piece)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Inquire CTA Button */}
            <div className="pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <button
                onClick={() => setIsInquiryOpen(true)}
                className="w-full py-4 rounded-full font-body font-bold text-xs tracking-[0.12em] uppercase flex items-center justify-center gap-2.5 shadow-xl transition-all hover:scale-[1.02]"
                style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-bg)' }}
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Order on WhatsApp • {formatPrice(product.price)}</span>
              </button>
              <p className="text-[11px] text-center text-slate-400 mt-2">
                Direct coordination with boutique concierge • 100% Verified Weave
              </p>
            </div>
          </div>
        </div>

        {/* Related Sarees */}
        {relatedProducts.length > 0 && (
          <section className="pt-12 border-t" style={{ borderColor: 'var(--color-border)' }}>
            <h2 className="font-display font-semibold text-2xl mb-1" style={{ color: 'var(--color-text)' }}>
              More Curated Weaves
            </h2>
            <p className="font-body text-xs text-slate-500 mb-8">Other limited edition sarees from {storeName}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => navigate(`/product/${p.id}`)}
                  className="group cursor-pointer flex flex-col"
                >
                  <div
                    className="relative aspect-[3/4] overflow-hidden rounded-xl mb-3 shadow-sm border"
                    style={{ borderColor: 'var(--color-border)' }}
                  >
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="font-body font-semibold text-xs truncate" style={{ color: 'var(--color-text)' }}>
                    {p.title}
                  </h3>
                  <span className="font-body font-bold text-sm mt-1" style={{ color: 'var(--color-accent)' }}>
                    {formatPrice(p.price)}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />

      {/* Inquiry Dialog Modal */}
      <Dialog open={isInquiryOpen} onOpenChange={setIsInquiryOpen}>
        <DialogContent className="max-w-md p-6 rounded-3xl" style={{ backgroundColor: 'var(--color-bg)' }}>
          <DialogHeader>
            <DialogTitle className="font-display font-bold text-xl" style={{ color: 'var(--color-text)' }}>
              Order Saree via WhatsApp
            </DialogTitle>
          </DialogHeader>
          <p className="font-body text-xs text-slate-500 mt-1 mb-4 leading-relaxed">
            Provide your contact details below. A prefilled message will open in WhatsApp directly with {storeName} to confirm your order and delivery.
          </p>

          <form onSubmit={handleInquirySubmit} className="space-y-4">
            <div>
              <label className="block font-body text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Your Full Name *
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Radhika Sharma"
                className="w-full h-11 px-4 rounded-xl text-xs font-body border outline-none focus:border-amber-600"
                style={{ backgroundColor: 'var(--color-bg-alt)', borderColor: 'var(--color-border)' }}
              />
            </div>

            <div>
              <label className="block font-body text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                WhatsApp Phone Number (Optional)
              </label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="e.g. +91 98765 43210"
                className="w-full h-11 px-4 rounded-xl text-xs font-body border outline-none focus:border-amber-600"
                style={{ backgroundColor: 'var(--color-bg-alt)', borderColor: 'var(--color-border)' }}
              />
            </div>

            <button
              type="submit"
              disabled={submittingInquiry}
              className="w-full py-3.5 rounded-full font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg text-white transition-transform hover:scale-[1.02]"
              style={{ backgroundColor: 'var(--color-accent)' }}
            >
              {submittingInquiry ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <MessageCircle className="w-4 h-4 fill-current" />
              )}
              <span>Continue to WhatsApp</span>
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
