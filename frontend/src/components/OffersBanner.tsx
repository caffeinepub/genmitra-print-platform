import React from 'react';
import { Button } from '@/components/ui/button';
import { Tag, ArrowRight } from 'lucide-react';

export default function OffersBanner() {
  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="relative rounded-3xl overflow-hidden">
        <img
          src="/assets/generated/offers-banner.dim_1200x300.png"
          alt="Special Offers"
          className="w-full h-48 sm:h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/40 flex items-center">
          <div className="px-8 sm:px-12">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="h-5 w-5 text-brand-gold" />
              <span className="text-sm font-semibold text-background/90 uppercase tracking-wider">
                Limited Time Offer
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-background font-display mb-2">
              Get 20% Off Your First Order
            </h2>
            <p className="text-background/80 mb-4 text-sm sm:text-base">
              Use code <span className="font-bold text-brand-gold">PRINT20</span> at checkout
            </p>
            <Button
              className="bg-background text-primary hover:bg-background/90 rounded-xl gap-2 font-semibold"
            >
              Shop Now
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
