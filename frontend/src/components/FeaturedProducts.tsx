import { useNavigate } from '@tanstack/react-router';
import { useGetAllProducts } from '../hooks/useQueries';
import { demoProducts } from '../lib/demoProducts';
import { getImageSrc } from '../utils/imageHelpers';
import { Skeleton } from '@/components/ui/skeleton';
import { ShoppingBag, SearchX } from 'lucide-react';

interface FeaturedProductsProps {
  categoryFilter?: string;
  searchQuery?: string;
}

export default function FeaturedProducts({ categoryFilter, searchQuery }: FeaturedProductsProps) {
  const navigate = useNavigate();
  const { data: backendProducts, isLoading } = useGetAllProducts();

  const allProducts = (backendProducts && backendProducts.length > 0) ? backendProducts : demoProducts;

  let filteredProducts = allProducts;

  if (categoryFilter) {
    filteredProducts = filteredProducts.filter(p =>
      p.category.toLowerCase() === categoryFilter.toLowerCase()
    );
  }

  if (searchQuery) {
    filteredProducts = filteredProducts.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg p-3 shadow-card">
            <Skeleton className="w-full aspect-square rounded mb-3" />
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-lg shadow-card">
        <SearchX className="w-16 h-16 text-gray-300 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          {searchQuery ? `No products found for "${searchQuery}"` : 'No products available'}
        </h3>
        <p className="text-gray-500 mb-6">
          {searchQuery ? 'Try a different search term or browse our categories.' : 'Check back later for new products.'}
        </p>
        <button
          onClick={() => navigate({ to: '/', search: { category: undefined, search: undefined } })}
          className="px-6 py-2 bg-[#2874f0] text-white rounded font-medium hover:bg-[#1f5bb8] transition-colors"
        >
          Browse All Products
        </button>
      </div>
    );
  }

  const title = searchQuery
    ? `Results for "${searchQuery}"`
    : categoryFilter
    ? categoryFilter
    : 'Featured Products';

  return (
    <section className="mb-8">
      {!searchQuery && !categoryFilter && (
        <div className="flex items-center gap-2 mb-4">
          <ShoppingBag className="w-5 h-5 text-[#2874f0]" />
          <h2 className="text-xl font-bold text-gray-800">Featured Products</h2>
        </div>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredProducts.map((product) => {
          const imgSrc = getImageSrc(product.imageData);
          return (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-card hover:shadow-card-hover transition-shadow cursor-pointer group overflow-hidden border border-gray-100"
              onClick={() => navigate({ to: '/product/$productId', params: { productId: product.id }, search: { category: undefined } })}
            >
              <div className="aspect-square overflow-hidden bg-gray-50">
                <img
                  src={imgSrc || '/assets/generated/photo-print-1.dim_600x600.png'}
                  alt={product.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-3">
                <p className="text-xs text-[#2874f0] font-medium mb-1 truncate">{product.category}</p>
                <h3 className="text-sm font-medium text-gray-800 mb-1 line-clamp-2 leading-tight">{product.name}</h3>
                <div className="flex items-center gap-1">
                  <span className="text-base font-bold text-gray-900">₹{product.price.toFixed(0)}</span>
                </div>
                <p className="text-xs text-green-600 mt-1">{product.deliveryTime}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
