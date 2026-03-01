import React from 'react';
import { useSearch } from '@tanstack/react-router';
import HeroBanner from '../components/HeroBanner';
import ProductCategoryGrid from '../components/ProductCategoryGrid';
import ShopFramesBySize from '../components/ShopFramesBySize';
import FeaturedProducts from '../components/FeaturedProducts';
import OffersBanner from '../components/OffersBanner';
import TrustFeatures from '../components/TrustFeatures';
import FAQSection from '../components/FAQSection';
import CustomerReviews from '../components/CustomerReviews';

export default function HomePage() {
  const search = useSearch({ from: '/layout/' });
  const activeCategory = search.category;

  return (
    <div>
      {!activeCategory && <HeroBanner />}
      {!activeCategory && <ProductCategoryGrid />}
      {!activeCategory && <ShopFramesBySize />}
      <FeaturedProducts category={activeCategory} />
      {!activeCategory && <TrustFeatures />}
      {!activeCategory && <OffersBanner />}
      {!activeCategory && <FAQSection />}
      {!activeCategory && <CustomerReviews />}
    </div>
  );
}
