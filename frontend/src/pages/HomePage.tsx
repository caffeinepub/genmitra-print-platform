import { useSearch } from '@tanstack/react-router';
import HeroBanner from '../components/HeroBanner';
import ProductCategoryGrid from '../components/ProductCategoryGrid';
import FeaturedProducts from '../components/FeaturedProducts';
import ShopFramesBySize from '../components/ShopFramesBySize';
import OffersBanner from '../components/OffersBanner';
import TrustFeatures from '../components/TrustFeatures';
import CustomerReviews from '../components/CustomerReviews';
import FAQSection from '../components/FAQSection';

export default function HomePage() {
  const search = useSearch({ from: '/layout/' });
  const activeCategory = (search as any).category as string | undefined;
  const searchQuery = (search as any).search as string | undefined;

  const decodedSearch = searchQuery ? decodeURIComponent(searchQuery) : undefined;

  // If there's a search query, show search results
  if (decodedSearch) {
    return (
      <div style={{ backgroundColor: '#f5f6f7' }} className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="mb-4">
            <h2 className="text-lg font-medium text-gray-700">
              Search results for: <span className="text-[#2874f0] font-semibold">"{decodedSearch}"</span>
            </h2>
          </div>
          <FeaturedProducts searchQuery={decodedSearch} />
        </div>
      </div>
    );
  }

  // If there's a category filter, show filtered products
  if (activeCategory) {
    return (
      <div style={{ backgroundColor: '#f5f6f7' }} className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-800">{activeCategory}</h2>
          </div>
          <FeaturedProducts categoryFilter={activeCategory} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f5f6f7' }}>
      <HeroBanner />
      <TrustFeatures />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <ProductCategoryGrid />
        <ShopFramesBySize />
        <OffersBanner />
        <CustomerReviews />
        <FAQSection />
      </div>
    </div>
  );
}
