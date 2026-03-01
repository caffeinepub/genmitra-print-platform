import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star } from 'lucide-react';

export default function HeroBanner() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden min-h-[480px] sm:min-h-[560px] flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/assets/generated/hero-banner.dim_1440x560.png"
          alt="Hero Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm border border-primary/30 rounded-full px-4 py-1.5 mb-6">
            <Star className="h-3.5 w-3.5 text-brand-gold fill-brand-gold" />
            <span className="text-xs font-semibold text-background uppercase tracking-wider">
              Premium Quality Prints
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-background font-display leading-tight mb-4">
            Turn Your Memories Into
            <span className="text-brand-gold"> Masterpieces</span>
          </h1>

          <p className="text-lg text-background/80 mb-8 leading-relaxed">
            Professional photo prints, custom frames, personalized gifts — delivered to your doorstep across India.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              size="lg"
              className="bg-primary hover:opacity-90 text-primary-foreground shadow-purple gap-2 rounded-xl"
              onClick={() => navigate({ to: '/', search: { category: undefined } })}
            >
              Shop Now
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-background/40 text-background hover:bg-background/10 rounded-xl backdrop-blur-sm"
              onClick={() => navigate({ to: '/', search: { category: undefined } })}
            >
              View Catalog
            </Button>
          </div>

          {/* Stats */}
          <div className="flex gap-8 mt-10">
            {[
              { value: '50K+', label: 'Happy Customers' },
              { value: '4.8★', label: 'Average Rating' },
              { value: '24hr', label: 'Fast Delivery' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-bold text-background">{stat.value}</div>
                <div className="text-xs text-background/60">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
