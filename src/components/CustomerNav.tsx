import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Menu, X } from 'lucide-react';
import { useStorefrontContext } from '@/lib/StorefrontContext';

const navLinks = [
  { label: 'HOME', href: '#top' },
  { label: 'SAREES', href: '#sarees' },
  { label: 'TRACK ORDER', href: '#track-order' },
  { label: 'ABOUT', href: '#about' },
];

export default function CustomerNav() {
  const { storefront, storeName } = useStorefrontContext();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('top');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);

      const sections = ['top', 'sarees', 'track-order', 'about'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom > 120) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 h-20 flex items-center justify-between px-5 md:px-16 z-[100] transition-all duration-400"
        style={{
          backgroundColor: 'rgba(249, 244, 240, 0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: scrolled ? '1px solid var(--color-border)' : '1px solid transparent',
        }}
      >
        {/* Brand */}
        <a
          href="#top"
          onClick={(e) => handleNavClick(e, '#top')}
          className="font-body font-semibold text-[13px] tracking-[0.12em]"
          style={{ color: 'var(--color-text)' }}
        >
          {storefront?.logo_url ? (
            <img src={storefront.logo_url} alt={storeName} className="h-8 w-auto" />
          ) : (
            storeName
          )}
        </a>

        {/* Center Nav Links - Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="relative font-body text-[11px] tracking-[0.1em] transition-colors duration-200 py-2"
              style={{
                color: activeSection === link.href.slice(1) ? 'var(--color-accent)' : 'var(--color-text)',
              }}
            >
              {link.label}
              <span
                className="absolute bottom-0 left-0 h-0.5 transition-transform duration-300 origin-left"
                style={{
                  width: '100%',
                  backgroundColor: 'var(--color-accent)',
                  transform: activeSection === link.href.slice(1) ? 'scaleX(1)' : 'scaleX(0)',
                }}
              />
            </a>
          ))}
        </div>

        {/* Right Cluster */}
        <div className="flex items-center gap-4">
          <Link
            to="/admin"
            className="hidden md:block font-body text-[11px] transition-colors duration-200 hover:opacity-70"
            style={{ color: 'var(--color-muted)' }}
          >
            Admin Login
          </Link>
          <a
            href="#sarees"
            onClick={(e) => handleNavClick(e, '#sarees')}
            className="hidden md:block font-body font-medium text-[11px] tracking-[0.08em] px-6 py-2.5 rounded-pill transition-all duration-200 hover:scale-105 hover:shadow-md"
            style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-bg)' }}
          >
            Shop Now
          </a>
          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" style={{ color: 'var(--color-text)' }} />
            ) : (
              <Menu className="w-5 h-5" style={{ color: 'var(--color-text)' }} />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-[280px] z-[110] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          backgroundColor: 'var(--color-bg)',
          boxShadow: mobileOpen ? '-4px 0 24px rgba(0,0,0,0.1)' : 'none',
        }}
      >
        <div className="flex justify-end p-5">
          <button onClick={() => setMobileOpen(false)} className="w-10 h-10 flex items-center justify-center">
            <X className="w-5 h-5" style={{ color: 'var(--color-text)' }} />
          </button>
        </div>
        <div className="flex flex-col">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="font-body text-sm tracking-[0.1em] px-8 py-5 transition-colors duration-200"
              style={{
                color: activeSection === link.href.slice(1) ? 'var(--color-accent)' : 'var(--color-text)',
                borderBottom: '1px solid var(--color-border)',
              }}
            >
              {link.label}
            </a>
          ))}
          <div className="px-8 py-5" style={{ borderBottom: '1px solid var(--color-border)' }}>
            <Link
              to="/admin"
              onClick={() => setMobileOpen(false)}
              className="font-body text-sm tracking-[0.1em]"
              style={{ color: 'var(--color-muted)' }}
            >
              Admin Login
            </Link>
          </div>
          <div className="px-8 py-6">
            <a
              href="#sarees"
              onClick={(e) => handleNavClick(e, '#sarees')}
              className="inline-block font-body font-medium text-sm px-8 py-3 rounded-pill"
              style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-bg)' }}
            >
              Shop Now
            </a>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[105] bg-black/20"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}
