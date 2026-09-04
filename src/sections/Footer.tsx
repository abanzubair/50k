import { MessageCircle, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router';
import { useStorefrontContext } from '@/lib/StorefrontContext';

const quickLinks = [
  { label: 'Home', href: '#top' },
  { label: 'Sarees', href: '#sarees' },
  { label: 'Track Order', href: '#track-order' },
  { label: 'About', href: '#about' },
];

export default function Footer() {
  const { storeName, storefront } = useStorefrontContext();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const whatsapp = storefront?.whatsapp || '919919101369';
  const cleanPhone = whatsapp.replace(/[^0-9]/g, '');

  return (
    <footer style={{ backgroundColor: 'var(--color-bg-deep)', color: 'var(--color-text-light)' }}>
      <div className="max-w-7xl mx-auto px-5 md:px-16 pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand Column */}
          <div>
            <h3 className="font-body font-bold text-sm tracking-[0.15em] uppercase mb-3 text-white">
              {storeName}
            </h3>
            <p className="font-body text-xs leading-relaxed mb-4" style={{ color: 'var(--color-muted)' }}>
              {storefront?.tagline || 'Curated Authentic Indian Sarees & Handcrafted Banarasi Weaves.'}
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-500 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Certified Authentic Weaves</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-body font-bold text-xs tracking-[0.12em] uppercase mb-4 text-slate-400">
              EXPLORE
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => handleClick(e, link.href)}
                    className="font-body text-xs transition-colors hover:text-white"
                    style={{ color: 'rgba(249,244,240,0.6)' }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <Link
                  to="/admin"
                  className="font-body text-xs text-amber-400 hover:text-amber-300 transition-colors"
                >
                  Admin Management
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="font-body font-bold text-xs tracking-[0.12em] uppercase mb-4 text-slate-400">
              CUSTOMER CARE
            </h4>
            <ul className="space-y-2.5 text-xs" style={{ color: 'rgba(249,244,240,0.6)' }}>
              <li>Direct WhatsApp Concierge Support</li>
              <li>Secure Insured Shipping Across India</li>
              <li>Pre-Dispatch Video Quality Inspection</li>
              <li>Authenticity Certificate with Every Saree</li>
            </ul>
          </div>

          {/* Connect Column */}
          <div>
            <h4 className="font-body font-bold text-xs tracking-[0.12em] uppercase mb-4 text-slate-400">
              DIRECT CONCIERGE
            </h4>
            <p className="font-body text-xs mb-4" style={{ color: 'rgba(249,244,240,0.6)' }}>
              Need assistance selecting weaves, checking drape details, or custom packaging?
            </p>
            {whatsapp && (
              <a
                href={`https://wa.me/${cleanPhone}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-slate-950 shadow-md transition-transform hover:scale-105"
                style={{ backgroundColor: 'var(--color-accent)' }}
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Chat on WhatsApp</span>
              </a>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="mt-14 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs"
          style={{ borderTop: '1px solid rgba(249,244,240,0.1)', color: 'rgba(249,244,240,0.4)' }}
        >
          <p>© {new Date().getFullYear()} {storeName}. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Powered by <a href="https://www.weave365.com" target="_blank" rel="noreferrer" className="text-amber-400 hover:underline">Weave365 B2B</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
