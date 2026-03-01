import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ArrowRight, Star, Package, Truck } from 'lucide-react';

export default function HeroBanner() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[var(--primary)] via-[oklch(0.28_0.08_255)] to-[oklch(0.22_0.06_255)]">
      {/* Background image overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: "url('/assets/generated/hero-banner-redesign.dim_1440x600.png')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)]/90 via-[var(--primary)]/70 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            <span className="text-white/90 text-xs font-medium">Trusted by 50,000+ customers</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-5">
            Turn Your Photos Into
            <span className="block text-yellow-400 mt-1">Lasting Memories</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-white/75 leading-relaxed mb-8 max-w-lg">
            Premium quality photo frames, prints, mugs, and personalized gifts. Delivered fast, crafted with love.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 mb-12">
            <button
              onClick={() => navigate({ to: '/', search: { category: undefined } })}
              className="flex items-center gap-2 bg-white text-[var(--primary)] font-bold px-7 py-3.5 rounded-xl hover:bg-white/90 transition-all duration-200 shadow-lg hover:shadow-xl text-sm"
            >
              Shop Now
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate({ to: '/', search: { category: 'Photo Frames' } })}
              className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-white/20 transition-all duration-200 text-sm"
            >
              Browse Categories
            </button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-8">
            {[
              { icon: Star, value: '4.9★', label: 'Google Rating' },
              { icon: Package, value: '50K+', label: 'Orders Delivered' },
              { icon: Truck, value: '2-5 Days', label: 'Fast Delivery' },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-white/80" />
                </div>
                <div>
                  <div className="text-white font-bold text-sm">{value}</div>
                  <div className="text-white/60 text-xs">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
