import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
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
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);

      const sections = ['top', 'sarees', 'track-order', 'about'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 140 && rect.bottom > 140) {
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

    // If not on homepage, navigate to home first
    if (location.pathname !== '/' && !location.pathname.startsWith('/50k') && !location.pathname.startsWith('/storefront')) {
      const base = storefront?.slug ? `/${storefront.slug}` : '/';
      navigate(`${base}${href}`);
      return;
    }

    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 h-20 flex items-center justify-between px-5 md:px-16 z-[100] transition-all duration-300"
        style={{
          backgroundColor: scrolled ? 'rgba(249, 244, 240, 0.95)' : 'rgba(249, 244, 240, 0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: scrolled ? '1px solid var(--color-border)' : '1px solid transparent',
        }}
      >
        {/* Brand */}
        <a
          href="#top"
          onClick={(e) => handleNavClick(e, '#top')}
          className="font-display font-bold text-lg md:text-xl tracking-tight transition-opacity hover:opacity-80"
          style={{ color: 'var(--color-text)' }}
        >
          {storefront?.logo_url ? (
            <img src={storefront.logo_url} alt={storeName} className="h-9 w-auto object-contain" />
          ) : (
            <span>{storeName}</span>
          )}
        </a>

        {/* Center Nav Links - Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="relative font-body text-[12px] font-medium tracking-[0.12em] transition-colors duration-200 py-2"
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
            className="hidden md:block font-body text-xs font-semibold tracking-wider text-slate-500 hover:text-slate-900 transition-colors"
          >
            Admin
          </Link>
          <a
            href="#sarees"
            onClick={(e) => handleNavClick(e, '#sarees')}
            className="hidden md:block font-body font-semibold text-xs tracking-wider px-6 py-2.5 rounded-full transition-all duration-200 hover:scale-105 shadow-sm"
            style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-bg)' }}
          >
            View Sarees
          </a>
          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg"
          >
            {mobileOpen ? (
              <X className="w-6 h-6" style={{ color: 'var(--color-text)' }} />
            ) : (
              <Menu className="w-6 h-6" style={{ color: 'var(--color-text)' }} />
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
          boxShadow: mobileOpen ? '-4px 0 24px rgba(0,0,0,0.15)' : 'none',
        }}
      >
        <div className="flex justify-end p-5">
          <button onClick={() => setMobileOpen(false)} className="w-10 h-10 flex items-center justify-center">
            <X className="w-6 h-6" style={{ color: 'var(--color-text)' }} />
          </button>
        </div>
        <div className="flex flex-col">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="font-body text-sm font-semibold tracking-wider px-8 py-4 transition-colors"
              style={{
                color: activeSection === link.href.slice(1) ? 'var(--color-accent)' : 'var(--color-text)',
                borderBottom: '1px solid var(--color-border)',
              }}
            >
              {link.label}
            </a>
          ))}
          <div className="px-8 py-4" style={{ borderBottom: '1px solid var(--color-border)' }}>
            <Link
              to="/admin"
              onClick={() => setMobileOpen(false)}
              className="font-body text-sm font-semibold tracking-wider text-slate-500"
            >
              Admin Dashboard
            </Link>
          </div>
          <div className="px-8 py-6">
            <a
              href="#sarees"
              onClick={(e) => handleNavClick(e, '#sarees')}
              className="block text-center font-body font-semibold text-sm px-6 py-3 rounded-full shadow-md"
              style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-bg)' }}
            >
              Explore Collection
            </a>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[105] bg-black/40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}
