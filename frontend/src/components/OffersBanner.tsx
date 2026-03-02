import React from 'react';
import { useNavigate } from '@tanstack/react-router';

export default function OffersBanner() {
  const navigate = useNavigate();

  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-10 sm:px-12">
          {/* Decorative circles */}
          <div className="absolute -right-12 -top-12 w-56 h-56 rounded-full bg-white/5" />
          <div className="absolute -right-4 -bottom-8 w-40 h-40 rounded-full bg-white/5" />

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            {/* Left Content */}
            <div>
              {/* Badge */}
              <div className="inline-flex items-center px-3 py-1 rounded-full border border-white/30 bg-white/10 mb-3">
                <span className="text-white text-xs font-semibold uppercase tracking-wider">LIMITED TIME OFFER</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
                Get 20% OFF on your first order
              </h2>
              <p className="text-white/80 text-sm">
                Use code <span className="font-bold text-white">WELCOME20</span> at checkout.
              </p>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => navigate({ to: '/', search: { category: undefined } })}
              className="shrink-0 bg-white text-blue-700 font-bold px-8 py-3.5 rounded-xl hover:bg-white/95 transition-all duration-200 shadow-md whitespace-nowrap text-sm"
            >
              Claim Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
