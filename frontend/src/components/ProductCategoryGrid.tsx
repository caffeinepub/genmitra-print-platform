import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Frame, Printer, Magnet, Coffee, Gift, ChevronRight } from 'lucide-react';

const categories = [
  {
    name: 'Photo Frames',
    icon: Frame,
    subtitle: 'Beautiful frames for every memory',
    category: 'Photo Frames',
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-100',
    cardBg: 'bg-blue-50/60',
  },
  {
    name: 'Photo Prints',
    icon: Printer,
    subtitle: 'High-quality prints in any size',
    category: 'Photo Prints',
    iconColor: 'text-purple-600',
    iconBg: 'bg-purple-100',
    cardBg: 'bg-purple-50/60',
  },
  {
    name: 'Photo Magnets',
    icon: Magnet,
    subtitle: 'Fridge magnets with your photos',
    category: 'Photo Magnets',
    iconColor: 'text-green-600',
    iconBg: 'bg-green-100',
    cardBg: 'bg-green-50/60',
  },
  {
    name: 'Mugs',
    icon: Coffee,
    subtitle: 'Custom mugs for every occasion',
    category: 'Mugs',
    iconColor: 'text-orange-500',
    iconBg: 'bg-orange-100',
    cardBg: 'bg-orange-50/60',
  },
  {
    name: 'Corporate Gifts',
    icon: Gift,
    subtitle: 'Branded gifts for your team',
    category: 'Corporate Gifts',
    iconColor: 'text-red-500',
    iconBg: 'bg-red-100',
    cardBg: 'bg-red-50/60',
  },
];

export default function ProductCategoryGrid() {
  const navigate = useNavigate();

  const handleCategoryClick = (category: string) => {
    navigate({ to: '/', search: { category } });
  };

  return (
    <section className="py-14 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10">
          <p className="text-sm font-bold text-primary uppercase tracking-widest mb-2">COLLECTIONS</p>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-3">Shop by Category</h2>
          <p className="text-gray-500 text-base">Explore our wide range of personalized products crafted just for you</p>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.name}
                className={`group cursor-pointer ${cat.cardBg} rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-lg transition-all duration-200 relative`}
                onClick={() => handleCategoryClick(cat.category)}
              >
                {/* Icon Container */}
                <div className={`w-20 h-20 rounded-2xl ${cat.iconBg} flex items-center justify-center mb-4`}>
                  <Icon className={`w-10 h-10 ${cat.iconColor} stroke-[1.5]`} />
                </div>

                {/* Name */}
                <h3 className="font-bold text-gray-900 text-base mb-1">{cat.name}</h3>

                {/* Subtitle */}
                <p className="text-gray-500 text-sm leading-snug">{cat.subtitle}</p>

                {/* Hover Arrow */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <ChevronRight className={`w-5 h-5 ${cat.iconColor}`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
