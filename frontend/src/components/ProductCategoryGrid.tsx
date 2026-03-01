import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Frame, Printer, Magnet, Coffee, Gift } from 'lucide-react';

const categories = [
  {
    name: 'Photo Frames',
    icon: Frame,
    description: 'Beautiful frames for every memory',
    image: '/assets/generated/demo-frame-photo-frame.dim_400x400.png',
    color: 'from-blue-50 to-indigo-50',
    iconColor: 'text-indigo-600',
    iconBg: 'bg-indigo-100',
  },
  {
    name: 'Photo Prints',
    icon: Printer,
    description: 'High-quality prints in any size',
    image: '/assets/generated/demo-frame-photo-print.dim_400x400.png',
    color: 'from-purple-50 to-pink-50',
    iconColor: 'text-purple-600',
    iconBg: 'bg-purple-100',
  },
  {
    name: 'Photo Magnets',
    icon: Magnet,
    description: 'Fridge magnets with your photos',
    image: '/assets/generated/demo-frame-photo-magnet.dim_400x400.png',
    color: 'from-green-50 to-teal-50',
    iconColor: 'text-teal-600',
    iconBg: 'bg-teal-100',
  },
  {
    name: 'Mugs',
    icon: Coffee,
    description: 'Custom mugs for every occasion',
    image: '/assets/generated/demo-frame-mug.dim_400x400.png',
    color: 'from-orange-50 to-amber-50',
    iconColor: 'text-orange-600',
    iconBg: 'bg-orange-100',
  },
  {
    name: 'Corporate Gifts',
    icon: Gift,
    description: 'Branded gifts for your team',
    image: '/assets/generated/demo-frame-corporate-gift.dim_400x400.png',
    color: 'from-rose-50 to-red-50',
    iconColor: 'text-rose-600',
    iconBg: 'bg-rose-100',
  },
];

export default function ProductCategoryGrid() {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-[var(--accent)] uppercase tracking-widest mb-2">Collections</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-3">Shop by Category</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Explore our wide range of personalized products crafted just for you
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.name}
                onClick={() => navigate({ to: '/', search: { category: cat.name } })}
                className={`group relative bg-gradient-to-br ${cat.color} rounded-2xl p-5 text-center hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 border border-white/80`}
              >
                {/* Icon */}
                <div className={`w-14 h-14 ${cat.iconBg} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-7 h-7 ${cat.iconColor}`} />
                </div>

                {/* Text */}
                <h3 className="font-bold text-foreground text-sm leading-tight mb-1">{cat.name}</h3>
                <p className="text-xs text-muted-foreground leading-snug hidden sm:block">{cat.description}</p>

                {/* Hover Arrow */}
                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className={`w-5 h-5 ${cat.iconBg} rounded-full flex items-center justify-center`}>
                    <svg className={`w-3 h-3 ${cat.iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
