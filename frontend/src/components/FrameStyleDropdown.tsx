import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export interface FrameStyle {
  id: string;
  name: string;
  image: string;
}

export const FRAME_STYLES: FrameStyle[] = [
  {
    id: 'plain-black',
    name: 'Plain Black',
    image: '/assets/generated/frame-corner-plain-black.dim_80x80.png',
  },
  {
    id: 'plain-brown',
    name: 'Plain Brown',
    image: '/assets/generated/frame-corner-plain-brown.dim_80x80.png',
  },
  {
    id: 'goldline-brown',
    name: 'Goldline Brown',
    image: '/assets/generated/frame-corner-goldline-brown.dim_80x80.png',
  },
  {
    id: 'gold-sash-brown',
    name: 'Gold Sash (Brown)',
    image: '/assets/generated/frame-corner-gold-sash-brown.dim_80x80.png',
  },
  {
    id: 'zigzag-brown',
    name: 'Zigzag Brown',
    image: '/assets/generated/frame-corner-zigzag-brown.dim_80x80.png',
  },
];

interface FrameStyleDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

export default function FrameStyleDropdown({ value, onChange }: FrameStyleDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedStyle = FRAME_STYLES.find((s) => s.id === value) ?? FRAME_STYLES[0];

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleSelect = (styleId: string) => {
    onChange(styleId);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between border rounded-md px-3 py-2.5 bg-white text-sm text-gray-800 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${
          isOpen ? 'border-purple-500 ring-2 ring-purple-500' : 'border-gray-300'
        }`}
      >
        <span className="flex items-center gap-3">
          <img
            src={selectedStyle.image}
            alt={selectedStyle.name}
            className="w-8 h-8 object-cover rounded border border-gray-200"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <span className="font-medium">{selectedStyle.name}</span>
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden">
          <div className="max-h-64 overflow-y-auto">
            {FRAME_STYLES.map((style) => {
              const isSelected = style.id === value;
              return (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => handleSelect(style.id)}
                  className={`w-full flex items-center gap-3 px-3 py-3 text-left transition-colors ${
                    isSelected
                      ? 'bg-purple-700 text-white'
                      : 'bg-white text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <div
                    className={`shrink-0 w-14 h-14 rounded border overflow-hidden ${
                      isSelected ? 'border-purple-400' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={style.image}
                      alt={style.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Show a colored placeholder if image fails
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          parent.style.backgroundColor = isSelected ? '#6d28d9' : '#e5e7eb';
                        }
                      }}
                    />
                  </div>
                  <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                    {style.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
