import React from 'react';
import { Star, Truck, Shield, Headphones } from 'lucide-react';

const features = [
  {
    icon: Star,
    title: '4.9★ Google Rating',
    description: 'Rated excellent by 10,000+ happy customers across India',
    color: 'text-yellow-500',
    bg: 'bg-yellow-50',
    border: 'border-yellow-100',
  },
  {
    icon: Truck,
    title: 'Nationwide Delivery',
    description: 'Fast and reliable delivery to 20,000+ pin codes across India',
    color: 'text-blue-500',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
  },
  {
    icon: Shield,
    title: '100% Quality Guarantee',
    description: 'Not satisfied? We\'ll reprint or refund — no questions asked',
    color: 'text-green-500',
    bg: 'bg-green-50',
    border: 'border-green-100',
  },
  {
    icon: Headphones,
    title: '24/7 Customer Support',
    description: 'Our team is always here to help you with any queries',
    color: 'text-purple-500',
    bg: 'bg-purple-50',
    border: 'border-purple-100',
  },
];

export default function TrustFeatures() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-sm font-semibold text-[var(--accent)] uppercase tracking-widest mb-2">Why Choose Us</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">The GenMitra Promise</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className={`${feature.bg} border ${feature.border} rounded-2xl p-6 hover:shadow-card-hover transition-all duration-300`}
              >
                <div className={`w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4 shadow-sm`}>
                  <Icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
