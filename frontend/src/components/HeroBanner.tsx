import React from 'react';
import { useNavigate } from '@tanstack/react-router';

export default function HeroBanner() {
  const navigate = useNavigate();

  return (
    <section className="px-4 py-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div
          className="relative overflow-hidden rounded-2xl"
          style={{
            backgroundImage: "url('/assets/generated/hero-banner-redesign.dim_1440x600.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '420px',
          }}
        >
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/40 rounded-2xl" />

          <div className="relative px-10 py-16 sm:px-16 sm:py-20 max-w-2xl">
            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-4">
              <span className="text-white block">Memories that</span>
              <span className="text-primary block" style={{ color: '#3b82f6' }}>Last Forever</span>
            </h1>

            {/* Subtitle */}
            <p className="text-white/85 text-base sm:text-lg leading-relaxed mb-8 max-w-md">
              Personalized gifts for every occasion. High quality prints delivered to your doorstep.
            </p>

            {/* CTA Button */}
            <button
              onClick={() => navigate({ to: '/', search: { category: undefined } })}
              className="inline-flex items-center gap-2 bg-primary text-white font-bold px-8 py-3.5 rounded-xl hover:bg-primary/90 transition-all duration-200 shadow-lg text-base"
            >
              Shop Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
