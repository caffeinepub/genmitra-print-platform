import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';

const categories = [
  {
    name: 'Photo Prints',
    description: 'High-quality prints in all sizes',
    image: '/assets/generated/demo-frame-photo-print.dim_400x400.png',
    emoji: '🖼️',
  },
  {
    name: 'Photo Frames',
    description: 'Elegant frames for every style',
    image: '/assets/generated/demo-frame-photo-frame.dim_400x400.png',
    emoji: '🪞',
  },
  {
    name: 'Photo Magnets',
    description: 'Fun magnets for your fridge',
    image: '/assets/generated/demo-frame-photo-magnet.dim_400x400.png',
    emoji: '🧲',
  },
  {
    name: 'Mugs',
    description: 'Custom mugs for every occasion',
    image: '/assets/generated/demo-frame-mug.dim_400x400.png',
    emoji: '☕',
  },
  {
    name: 'Corporate Gifts',
    description: 'Branded gifts for your team',
    image: '/assets/generated/demo-frame-corporate-gift.dim_400x400.png',
    emoji: '🎁',
  },
];

export default function ProductCategoryGrid() {
  const navigate = useNavigate();

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="section-title mb-3">Shop by Category</h2>
        <p className="text-muted-foreground text-lg">
          Discover our wide range of personalised products
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => navigate({ to: '/', search: { category: cat.name } })}
            className="group relative bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 text-left"
          >
            {/* Image */}
            <div className="aspect-square overflow-hidden bg-secondary">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Content */}
            <div className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-sm text-foreground">{cat.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">{cat.description}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
