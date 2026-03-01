import React from 'react';
import { useNavigate } from '@tanstack/react-router';

const sizes = [
  {
    label: '4 x 6 in',
    sublabel: 'Desktop stand only',
    image: '/assets/generated/frame-size-4x6.dim_400x500.png',
  },
  {
    label: '6 x 8 in',
    sublabel: 'Desk & wall mount',
    image: '/assets/generated/frame-size-6x8.dim_400x500.png',
  },
  {
    label: '9 x 12 in',
    sublabel: 'Wall Mount',
    image: '/assets/generated/frame-size-9x12.dim_400x500.png',
  },
  {
    label: '12 x 12 in',
    sublabel: 'Wall mount',
    image: '/assets/generated/frame-size-12x12.dim_400x500.png',
  },
  {
    label: '12 x 18 in',
    sublabel: 'Wall Mount',
    image: '/assets/generated/frame-size-12x18.dim_400x500.png',
  },
  {
    label: '14 x 18 in',
    sublabel: 'Wall mount',
    image: '/assets/generated/frame-size-14x18.dim_400x500.png',
  },
  {
    label: '18 x 24 in',
    sublabel: 'Wall mount',
    image: '/assets/generated/frame-size-18x24.dim_400x500.png',
  },
  {
    label: '20 x 24 in',
    sublabel: 'Wall mount',
    image: '/assets/generated/frame-size-20x24.dim_400x500.png',
  },
];

export default function ShopFramesBySize() {
  const navigate = useNavigate();

  const handleSizeClick = () => {
    navigate({ to: '/', search: { category: 'Photo Frames' } });
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
            Shop Photo Frames by Sizes
          </h2>
        </div>

        {/* Size Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {sizes.map((size) => (
            <button
              key={size.label}
              onClick={handleSizeClick}
              className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 text-left"
            >
              {/* Frame mockup image */}
              <div className="bg-gray-100 flex items-center justify-center overflow-hidden" style={{ minHeight: '200px' }}>
                <img
                  src={size.image}
                  alt={`Photo frame ${size.label}`}
                  className="w-full h-full object-contain"
                  style={{ maxHeight: '220px' }}
                  onError={(e) => {
                    // Fallback to demo images if generated ones aren't available
                    const target = e.currentTarget;
                    const fallbackMap: Record<string, string> = {
                      '4 x 6 in': '/assets/generated/frame-4x6-demo.dim_400x500.png',
                      '6 x 8 in': '/assets/generated/frame-6x8-demo.dim_400x530.png',
                      '9 x 12 in': '/assets/generated/frame-9x12-demo.dim_400x500.png',
                      '12 x 12 in': '/assets/generated/frame-12x12-demo.dim_500x500.png',
                      '12 x 18 in': '/assets/generated/frame-12x18-demo.dim_400x560.png',
                      '14 x 18 in': '/assets/generated/frame-14x18-demo.dim_400x520.png',
                      '18 x 24 in': '/assets/generated/frame-18x24-demo.dim_400x550.png',
                      '20 x 24 in': '/assets/generated/frame-27x36-demo.dim_400x560.png',
                    };
                    const fallback = fallbackMap[size.label];
                    if (fallback && target.src !== window.location.origin + fallback) {
                      target.src = fallback;
                    }
                  }}
                />
              </div>

              {/* Label */}
              <div className="p-3 text-center">
                <p className="text-base font-bold text-gray-900">{size.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{size.sublabel}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
