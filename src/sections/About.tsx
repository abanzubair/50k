import { useRef, useState, useEffect } from 'react';

export default function About() {
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
            className="font-body font-medium text-[11px] tracking-[0.15em] uppercase mb-4"
            style={{ color: 'var(--color-accent)' }}
          >
            OUR STORY
          </p>
          <h2 className="font-display font-semibold text-h2 mb-8" style={{ color: 'var(--color-text)' }}>
            Weaving <em style={{ color: 'var(--color-accent)' }}>Tradition</em> Into Every Thread
          </h2>
          <div className="space-y-5">
            <p className="font-body font-light text-base leading-relaxed" style={{ color: 'var(--color-text)' }}>
              Tavishi Sarees was born from a deep love for India's rich textile heritage. Founded in 2015, we set out to bring the finest handwoven sarees from master artisans across India to discerning customers worldwide.
            </p>
            <p className="font-body font-light text-base leading-relaxed" style={{ color: 'var(--color-text)' }}>
              Every saree in our collection is carefully selected — from the lustrous Banarasi silks of Varanasi to the vibrant Kanjeevarams of Tamil Nadu, the breezy linens of Bengal to the intricate cotton weaves of Gujarat.
            </p>
            <p className="font-body font-light text-base leading-relaxed" style={{ color: 'var(--color-text)' }}>
              We believe a saree is more than just clothing — it's a canvas of culture, a drape of dreams, a six-yard story passed down through generations.
            </p>
          </div>
          <p
            className="font-display italic text-lg mt-8"
            style={{ color: 'var(--color-accent)' }}
          >
            — Demo
          </p>
        </div>

        {/* Right Column - Image + Stats */}
        <div
          className={`relative transition-all duration-800 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
          style={{ transitionDelay: '0.2s' }}
        >
          <div className="rounded-2xl overflow-hidden" style={{ aspectRatio: '3/4' }}>
            <img
              src="/images/about-workshop.jpg"
              alt="Artisan weaving saree"
              className="w-full h-full object-cover"
            />
          </div>


        </div>
      </div>
    </section>
  );
}
