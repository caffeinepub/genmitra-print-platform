import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { getImageSrc } from '../utils/imageHelpers';

const frameSizes = [
  {
    size: '4 × 6 in',
    subtitle: 'Desktop stand only',
    image: '/assets/generated/frame-4x6-demo.dim_400x500.png',
  },
  {
    size: '6 × 8 in',
    subtitle: 'Desk & wall mount',
    image: '/assets/generated/frame-6x8-demo.dim_400x530.png',
  },
  {
    size: '9 × 12 in',
    subtitle: 'Wall Mount',
    image: '/assets/generated/frame-9x12-demo.dim_400x500.png',
  },
  {
    size: '12 × 12 in',
    subtitle: 'Wall mount',
    image: '/assets/generated/frame-12x12-demo.dim_500x500.png',
  },
  {
    size: '12 × 18 in',
    subtitle: 'Wall Mount',
    image: '/assets/generated/frame-12x18-demo.dim_400x560.png',
  },
  {
    size: '14 × 18 in',
    subtitle: 'Wall mount',
    image: '/assets/generated/frame-14x18-demo.dim_400x520.png',
  },
  {
    size: '18 × 24 in',
    subtitle: 'Wall mount',
    image: '/assets/generated/frame-18x24-demo.dim_400x550.png',
  },
  {
    size: '27 × 36 in',
    subtitle: 'Wall mount',
    image: '/assets/generated/frame-27x36-demo.dim_400x560.png',
  },
];

export default function ShopFramesBySize() {
  const navigate = useNavigate();

  const handleSizeClick = () => {
    navigate({ to: '/', search: { category: 'Photo Frames' } });
  };

  return (
    <section className="py-14 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Shop Photo Frames by Sizes</h2>
        </div>

        {/* Frame Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6">
          {frameSizes.map((frame) => {
            const imageSrc = getImageSrc(frame.image);
            return (
              <div
                key={frame.size}
                className="group cursor-pointer flex flex-col items-center"
                onClick={handleSizeClick}
              >
                {/* Frame image with thick black border - no rounded corners */}
                <div
                  className="w-full overflow-hidden mb-3 group-hover:opacity-90 transition-opacity duration-200"
                  style={{
                    border: '6px solid #111',
                    borderRadius: '0',
                    aspectRatio: '4/5',
                  }}
                >
                  <img
                    src={imageSrc}
                    alt={`${frame.size} photo frame`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="font-bold text-sm text-gray-900 text-center">{frame.size}</span>
                <span className="text-xs text-blue-500 text-center mt-0.5">{frame.subtitle}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
