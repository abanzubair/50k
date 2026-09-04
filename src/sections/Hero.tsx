import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useStorefrontContext } from '@/lib/StorefrontContext';

export default function Hero() {
  const { storefront, storeName } = useStorefrontContext();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const scrollToSarees = () => {
    document.getElementById('sarees')?.scrollIntoView({ behavior: 'smooth' });
  };

  const hero = storefront?.config?.hero;
  const isVideo = hero?.type === 'video';
  const mediaUrl = hero?.url || storefront?.hero_banner_url || '/images/hero-saree.jpg';
  const tagline = hero?.subtitle || storefront?.tagline || 'Discover our curated collection of authentic Indian sarees — each piece a story woven in pure silk and artisanal heritage.';
  const badgeText = hero?.badge || `${storeName.toUpperCase()} EXCLUSIVE COUTURE`;
  const headline = hero?.headline;
  const primaryCtaText = hero?.primary_cta_text || 'Explore Collection';
  const primaryCtaLink = hero?.primary_cta_link;
  const secondaryCtaText = hero?.secondary_cta_text;
  const secondaryCtaLink = hero?.secondary_cta_link;

  const handleCtaClick = (link?: string) => {
    if (!link || link === '#sarees') {
      scrollToSarees();
      return;
    }
    if (link.startsWith('#')) {
      document.querySelector(link)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = link;
    }
  };

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative min-h-screen w-full flex flex-col lg:flex-row items-center justify-center lg:justify-start overflow-hidden pt-24 pb-12 lg:pt-20 lg:pb-0"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      {/* Hero Media - Right Side */}
      <div className="relative w-full h-[400px] sm:h-[500px] lg:absolute lg:right-0 lg:top-20 lg:h-[calc(100%-5rem)] lg:w-1/2 mt-8 lg:mt-0 order-2 lg:order-none px-4 lg:px-0">
        <div className="w-full h-full rounded-2xl lg:rounded-none overflow-hidden shadow-2xl lg:shadow-none">
          {isVideo ? (
            <video
              key={mediaUrl}
              src={mediaUrl}
              poster={hero?.poster_url}
              autoPlay
              loop
              muted
              playsInline
              className={`h-full w-full object-cover transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
              }`}
            />
          ) : (
            <img
              key={mediaUrl}
              src={mediaUrl}
              alt={storeName}
              className={`h-full w-full object-cover transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
              }`}
            />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-left px-5 md:px-16 lg:pl-24 max-w-2xl w-full lg:w-1/2 order-1 lg:order-none">
        {/* Overline */}
        <p
          className={`font-body font-bold text-[12px] tracking-[0.2em] uppercase mb-4 transition-all duration-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
          style={{ color: 'var(--color-accent)', transitionDelay: '0.2s' }}
        >
          {badgeText}
        </p>

        {/* Title */}
        <h1 className="font-display font-semibold text-4xl sm:text-5xl lg:text-6xl mb-6 leading-tight" style={{ color: 'var(--color-text)' }}>
          {headline ? (
            <span
              className={`inline-block transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              {headline}
            </span>
          ) : (
            <>
              <span
                className={`inline-block transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: '0.4s' }}
              >
                Drape Yourself in{' '}
              </span>
              <br className="hidden sm:block" />
              <em
                className={`font-display font-normal italic inline-block transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ color: 'var(--color-accent)', transitionDelay: '0.6s' }}
              >
                Timeless
              </em>{' '}
              <span
                className={`inline-block transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: '0.8s' }}
              >
                Elegance
              </span>
            </>
          )}
        </h1>

        {/* Subtitle */}
        <p
          className={`font-body font-light text-base sm:text-lg max-w-xl mb-10 leading-relaxed transition-all duration-600 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
          style={{ color: 'var(--color-text-secondary)', transitionDelay: '1.0s' }}
        >
          {tagline}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={() => handleCtaClick(primaryCtaLink)}
            className={`font-body font-semibold text-[13px] tracking-[0.1em] px-10 py-4 rounded-full transition-all duration-500 hover:scale-105 hover:shadow-xl shadow-md ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
            }`}
            style={{
              backgroundColor: 'var(--color-accent)',
              color: 'var(--color-bg)',
              transitionDelay: '1.2s',
            }}
          >
            {primaryCtaText}
          </button>

          {secondaryCtaText && (
            <button
              onClick={() => handleCtaClick(secondaryCtaLink)}
              className={`font-body font-semibold text-[13px] tracking-[0.1em] px-8 py-4 rounded-full border border-current transition-all duration-500 hover:scale-105 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
              }`}
              style={{
                color: 'var(--color-accent)',
                borderColor: 'var(--color-accent)',
                transitionDelay: '1.3s',
              }}
            >
              {secondaryCtaText}
            </button>
          )}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        className={`hidden lg:block absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-400 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ transitionDelay: '1.5s' }}
      >
        <ChevronDown
          className="w-6 h-6 animate-bounce"
          style={{ color: 'var(--color-accent)' }}
        />
      </div>
    </section>
  );
}
