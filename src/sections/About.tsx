import { useRef, useState, useEffect } from 'react';
import { useStorefrontContext } from '@/lib/StorefrontContext';

export default function About() {
  const { storeName, storefront } = useStorefrontContext();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="w-full py-24 md:py-32 px-5 md:px-16"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 md:gap-16 items-center">
        {/* Left Column - Text */}
        <div
          className={`transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
          }`}
        >
          <p
            className="font-body font-bold text-xs tracking-[0.2em] uppercase mb-3"
            style={{ color: 'var(--color-accent)' }}
          >
            OUR HERITAGE
          </p>
          <h2 className="font-display font-semibold text-3xl sm:text-4xl mb-6" style={{ color: 'var(--color-text)' }}>
            Weaving <em className="italic font-normal" style={{ color: 'var(--color-accent)' }}>Tradition</em> Into Every Thread
          </h2>
          <div className="space-y-4 font-body text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            <p>
              {storeName} was born from a deep reverence for India's historic textile mastery. We curate authentic handwoven and master-crafted Banarasi sarees directly from Varanasi's premier weaver guilds to discerning patrons across the world.
            </p>
            <p>
              Every saree in our collection is an heirloom — woven with pure zari threads, rich silk textures, and patterns preserved across generations of master artisans.
            </p>
            <p>
              {storefront?.tagline || 'Experience the regal splendor of authentic Banarasi craftsmanship, certified and tailored for your most celebrated occasions.'}
            </p>
          </div>
        </div>

        {/* Right Column - Image with Frame */}
        <div
          className={`relative transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
          }`}
        >
          <div className="relative mx-auto max-w-md">
            <div
              className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <img
                src="/images/hero-saree.jpg"
                alt="Weaving heritage"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
