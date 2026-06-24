import { Mail, Phone, Instagram, Facebook } from 'lucide-react';
import { useStorefrontContext } from '@/lib/StorefrontContext';

const quickLinks = [
  { label: 'Home', href: '#top' },
  { label: 'Sarees', href: '#sarees' },
  { label: 'Track Order', href: '#track-order' },
  { label: 'About', href: '#about' },
];

const customerCare = [
  { label: 'Shipping Policy', href: '#' },
  { label: 'Return Policy', href: '#' },
  { label: 'FAQ', href: '#' },
  { label: 'Contact Us', href: '#' },
];

export default function Footer() {
  const { storeName } = useStorefrontContext();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer style={{ backgroundColor: 'var(--color-bg-deep)', color: 'var(--color-text-light)' }}>
      <div className="max-w-7xl mx-auto px-5 md:px-16 pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand Column */}
          <div>
            <h3 className="font-body font-semibold text-sm tracking-[0.12em] uppercase mb-3">
              {storeName}
            </h3>
            <p className="font-body text-sm leading-relaxed mb-3" style={{ color: 'var(--color-muted)' }}>
              Handcrafted Elegance Since 2015
            </p>
            <p className="font-body text-xs leading-relaxed" style={{ color: 'rgba(249,244,240,0.5)' }}>
              Bringing India's finest handwoven sarees from master artisans to discerning customers worldwide.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-body font-semibold text-xs tracking-[0.1em] uppercase mb-4" style={{ color: 'var(--color-muted)' }}>
              QUICK LINKS
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => handleClick(e, link.href)}
                    className="font-body text-sm transition-colors duration-200 hover:opacity-80"
                    style={{ color: 'rgba(249,244,240,0.7)' }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="font-body font-semibold text-xs tracking-[0.1em] uppercase mb-4" style={{ color: 'var(--color-muted)' }}>
              CUSTOMER CARE
            </h4>
            <ul className="space-y-2.5">
              {customerCare.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      alert('Coming soon!');
                    }}
                    className="font-body text-sm transition-colors duration-200 hover:opacity-80"
                    style={{ color: 'rgba(249,244,240,0.7)' }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-body font-semibold text-xs tracking-[0.1em] uppercase mb-4" style={{ color: 'var(--color-muted)' }}>
              CONNECT
            </h4>
            <div className="space-y-3">
              <a
                href="mailto:hello@demo.com"
                className="flex items-center gap-2.5 font-body text-sm transition-colors duration-200 hover:opacity-80"
                style={{ color: 'rgba(249,244,240,0.7)' }}
              >
                <Mail className="w-4 h-4 flex-shrink-0" />
                hello@demo.com
              </a>
              <a
                href="tel:+919876543210"
                className="flex items-center gap-2.5 font-body text-sm transition-colors duration-200 hover:opacity-80"
                style={{ color: 'rgba(249,244,240,0.7)' }}
              >
                <Phone className="w-4 h-4 flex-shrink-0" />
                +91 98765 43210
              </a>
              <div className="flex items-center gap-3 pt-2">
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); alert('Coming soon!'); }}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-200 hover:opacity-80"
                  style={{ backgroundColor: 'rgba(249,244,240,0.1)' }}
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); alert('Coming soon!'); }}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-200 hover:opacity-80"
                  style={{ backgroundColor: 'rgba(249,244,240,0.1)' }}
                >
                  <Facebook className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4"
          style={{ borderTop: '1px solid rgba(249,244,240,0.1)' }}
        >
          <p className="font-body text-xs" style={{ color: 'rgba(249,244,240,0.4)' }}>
            © {new Date().getFullYear()} {storeName}. All rights reserved.
          </p>
          <p className="font-body text-xs" style={{ color: 'rgba(249,244,240,0.4)' }}>
            Made with love in India
          </p>
        </div>
      </div>
    </footer>
  );
}
