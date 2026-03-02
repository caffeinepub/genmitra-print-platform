import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ShoppingCart, Star } from 'lucide-react';
import { useGetAllProducts } from '../hooks/useQueries';
import { demoProducts } from '../lib/demoProducts';
import { getImageSrc } from '../utils/imageHelpers';

interface FeaturedProductsProps {
  category?: string;
}

const RATINGS = [4.8, 4.9, 4.7, 4.6, 4.8, 4.7, 4.9, 4.8];

export default function FeaturedProducts({ category }: FeaturedProductsProps) {
  const navigate = useNavigate();
  const { data: backendProducts, isLoading } = useGetAllProducts();

  const allProducts = (backendProducts && backendProducts.length > 0)
    ? backendProducts
    : demoProducts;

  const displayProducts = category
    ? allProducts.filter((p) => p.category === category)
    : allProducts.slice(0, 8);

  const handleProductClick = (productId: string) => {
    navigate({
      to: '/product/$productId',
      params: { productId },
      search: { category: undefined },
    });
  };

  const handleAddToCart = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    navigate({
      to: '/product/$productId',
      params: { productId },
      search: { category: undefined },
    });
  };

  if (isLoading) {
    return (
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-100 rounded-xl h-52 mb-3" />
                <div className="bg-gray-100 rounded h-4 mb-2" />
                <div className="bg-gray-100 rounded h-4 w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-extrabold text-gray-900">
            {category ? category : 'Featured Products'}
          </h2>
          <button
            onClick={() => navigate({ to: '/', search: { category: undefined } })}
            className="text-primary font-semibold text-sm hover:underline"
          >
            View All
          </button>
        </div>

        {displayProducts.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No products found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {displayProducts.map((product, idx) => {
              const imageSrc = getImageSrc(product.imageData);
              const rating = RATINGS[idx % RATINGS.length];
              return (
                <div
                  key={product.id}
                  className="group bg-white rounded-xl border border-gray-100 overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200"
                  onClick={() => handleProductClick(product.id)}
                >
                  {/* Image */}
                  <div className="relative aspect-square bg-gray-50 overflow-hidden">
                    {imageSrc ? (
                      <img
                        src={imageSrc}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/assets/generated/photo-print-1.dim_600x600.png';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <ShoppingCart className="w-10 h-10 text-gray-300" />
                      </div>
                    )}
                    {/* Rating badge */}
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-0.5 flex items-center gap-1 shadow-sm">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-semibold text-gray-700">{rating}</span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">{product.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-primary font-bold text-base">₹{product.price}</span>
                      <button
                        onClick={(e) => handleAddToCart(e, product.id)}
                        className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white hover:bg-primary/90 transition-colors shadow-sm"
                        aria-label="Add to cart"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
