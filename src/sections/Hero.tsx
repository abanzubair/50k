import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const scrollToSarees = () => {
    document.getElementById('sarees')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative min-h-screen w-full flex flex-col lg:flex-row items-center justify-center lg:justify-start overflow-hidden pt-20 pb-0 lg:pt-20 lg:pb-0"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      {/* Hero Image - Right Side */}
      <div className="relative w-full h-96 sm:h-[500px] lg:absolute lg:right-0 lg:top-20 lg:h-[calc(100%-5rem)] lg:w-1/2 pointer-events-none mt-10 lg:mt-0 order-2 lg:order-none">
        <img
          src="/images/hero-saree.jpg"
          alt="Elegant saree"
          className={`h-full w-full object-cover transition-all duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-left px-5 md:px-16 lg:pl-24 max-w-2xl w-full lg:w-1/2 order-1 lg:order-none">
        {/* Overline */}
        <p
          className={`font-body font-medium text-[11px] tracking-[0.15em] uppercase mb-6 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
          style={{ color: 'var(--color-muted)', transitionDelay: '0.4s' }}
        >
          HANDCRAFTED SINCE 2015
        </p>

        {/* Title */}
        <h1 className="font-display font-semibold text-display mb-6" style={{ color: 'var(--color-text)' }}>
          <span
            className={`inline-block transition-all duration-[0.8s] ease-[cubic-bezier(0.16,1,0.3,1)] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[110%]'
              }`}
            style={{ transitionDelay: '0.6s' }}
          >
            Drape Yourself in{' '}
          </span>
          <br className="hidden sm:block" />
          <em
            className={`font-display font-normal inline-block transition-all duration-[0.8s] ease-[cubic-bezier(0.16,1,0.3,1)] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[110%]'
              }`}
            style={{ color: 'var(--color-accent)', transitionDelay: '0.8s' }}
          >
            Timeless
          </em>{' '}
          <span
            className={`inline-block transition-all duration-[0.8s] ease-[cubic-bezier(0.16,1,0.3,1)] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[110%]'
              }`}
            style={{ transitionDelay: '1.0s' }}
          >
            Elegance
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className={`font-body font-light text-lg max-w-xl mb-10 transition-all duration-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
          style={{ color: 'var(--color-text)', transitionDelay: '1.2s' }}
        >
          Discover our curated collection of authentic Indian sarees — each piece a story woven in silk, cotton, and tradition.
        </p>

        {/* CTA Button */}
        <button
          onClick={scrollToSarees}
          className={`font-body font-medium text-[13px] tracking-[0.08em] px-10 py-4 rounded-pill transition-all duration-500 hover:scale-105 hover:shadow-md ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
            }`}
          style={{
            backgroundColor: 'var(--color-accent)',
            color: 'var(--color-bg)',
            transitionDelay: '1.5s',
            transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          Explore Collection
        </button>
      </div>

      {/* Scroll Indicator */}
      <div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-400 ${isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        style={{ transitionDelay: '2.0s' }}
      >
        <ChevronDown
          className="w-5 h-5 animate-bounce-subtle"
          style={{ color: 'var(--color-muted)' }}
        />
      </div>
    </section>
  );
}
