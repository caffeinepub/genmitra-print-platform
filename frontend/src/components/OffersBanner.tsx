import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ArrowRight, Tag } from 'lucide-react';

export default function OffersBanner() {
  const navigate = useNavigate();

  return (
    <section className="py-8 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[oklch(0.35_0.12_255)] to-[oklch(0.45_0.18_280)]">
          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-15"
            style={{ backgroundImage: "url('/assets/generated/offers-banner.dim_1200x300.png')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)]/80 to-transparent" />

          {/* Decorative circles */}
          <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/5" />
          <div className="absolute -right-8 -bottom-8 w-48 h-48 rounded-full bg-white/5" />

          <div className="relative px-8 py-10 sm:px-12 sm:py-12">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-yellow-400/20 rounded-lg flex items-center justify-center">
                    <Tag className="w-4 h-4 text-yellow-400" />
                  </div>
                  <span className="text-yellow-400 text-sm font-bold uppercase tracking-wider">Limited Time Offer</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
                  Get 20% Off Your First Order
                </h2>
                <p className="text-white/70 text-sm max-w-md">
                  Use code <span className="font-bold text-yellow-400">FIRST20</span> at checkout. Valid on all photo products.
                </p>
              </div>
              <button
                onClick={() => navigate({ to: '/', search: { category: undefined } })}
                className="flex items-center gap-2 bg-white text-[var(--primary)] font-bold px-7 py-3.5 rounded-xl hover:bg-white/90 transition-all duration-200 shadow-lg whitespace-nowrap text-sm"
              >
                Shop Now
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
