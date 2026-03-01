import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';

const sizes = [
  { label: '4×6"', desc: 'Wallet Size' },
  { label: '5×7"', desc: 'Standard' },
  { label: '8×10"', desc: 'Popular' },
  { label: '11×14"', desc: 'Large' },
  { label: '16×20"', desc: 'Extra Large' },
  { label: '20×24"', desc: 'Gallery' },
];

export default function ShopFramesBySize() {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-secondary/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="section-title mb-3">Shop Frames by Size</h2>
          <p className="text-muted-foreground">
            Choose the perfect size for your space
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {sizes.map((size) => (
            <button
              key={size.label}
              onClick={() => {
                setSelectedSize(size.label);
                navigate({ to: '/', search: { category: undefined } });
              }}
              className={`group flex flex-col items-center px-6 py-4 rounded-2xl border-2 transition-all duration-200 min-w-[100px] ${
                selectedSize === size.label
                  ? 'border-primary bg-primary text-primary-foreground shadow-purple'
                  : 'border-border bg-card hover:border-primary hover:shadow-card text-foreground'
              }`}
            >
              <span className="text-xl font-bold">{size.label}</span>
              <span className={`text-xs mt-1 ${selectedSize === size.label ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                {size.desc}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
