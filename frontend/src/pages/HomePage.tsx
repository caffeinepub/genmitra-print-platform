import React from 'react';
import { useSearch, useNavigate } from '@tanstack/react-router';
import HeroBanner from '../components/HeroBanner';
import ProductCategoryGrid from '../components/ProductCategoryGrid';
import FeaturedProducts from '../components/FeaturedProducts';
import ShopFramesBySize from '../components/ShopFramesBySize';
import FAQSection from '../components/FAQSection';
import { useGetProductsByCategory } from '../hooks/useQueries';
import { demoProducts } from '../lib/demoProducts';
import { getImageSrc } from '../utils/imageHelpers';

export default function HomePage() {
  const search = useSearch({ from: '/layout/' });
  const navigate = useNavigate();
  const activeCategory = (search as { category?: string }).category;

  const { data: categoryProducts, isLoading } = useGetProductsByCategory(activeCategory);

  if (activeCategory) {
    const displayProducts = (categoryProducts && categoryProducts.length > 0)
      ? categoryProducts
      : demoProducts.filter((p) => p.category === activeCategory);

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => navigate({ to: '/', search: { category: undefined } })}
            className="text-primary hover:underline text-sm font-medium"
          >
            ← Back to Home
          </button>
          <span className="text-gray-400">/</span>
          <span className="text-sm font-medium">{activeCategory}</span>
        </div>
        <h1 className="text-2xl font-bold mb-6">{activeCategory}</h1>
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-lg h-64 animate-pulse" />
            ))}
          </div>
        ) : displayProducts.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <p className="text-lg">No products found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                onClick={() =>
                  navigate({
                    to: '/product/$productId',
                    params: { productId: product.id },
                    search: { category: undefined },
                  })
                }
              >
                <div className="aspect-square bg-gray-50 overflow-hidden">
                  <img
                    src={getImageSrc(product.imageData) || '/assets/generated/photo-print-1.dim_600x600.png'}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/generated/photo-print-1.dim_600x600.png';
                    }}
                  />
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-sm line-clamp-2">{product.name}</h3>
                  <p className="text-primary font-bold mt-1">₹{product.price}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <HeroBanner />
      <ProductCategoryGrid />
      <FeaturedProducts />
      <ShopFramesBySize />
      <FAQSection />
    </div>
  );
}
