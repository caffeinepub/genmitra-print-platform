import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ShoppingCart, Star, Heart, ArrowRight } from 'lucide-react';
import { useGetAllProducts, useAddToCart } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { demoProducts } from '../lib/demoProducts';
import { toast } from 'sonner';

interface FeaturedProductsProps {
  category?: string;
}

export default function FeaturedProducts({ category }: FeaturedProductsProps) {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: backendProducts = [], isLoading } = useGetAllProducts();
  const addToCartMutation = useAddToCart();

  const allProducts = backendProducts.length > 0 ? backendProducts : demoProducts;
  const displayProducts = category
    ? allProducts.filter((p) => p.category === category)
    : allProducts.slice(0, 8);

  const handleAddToCart = async (e: React.MouseEvent, product: typeof demoProducts[0]) => {
    e.stopPropagation();
    if (!identity) {
      toast.error('Please login to add items to cart');
      navigate({ to: '/login', search: { mode: undefined, redirect: undefined } });
      return;
    }
    try {
      await addToCartMutation.mutateAsync({
        product: product as any,
        quantity: BigInt(1),
        selectedSize: product.sizeOptions[0] || '',
        customImageData: '',
      });
      toast.success('Added to cart!');
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  const handleProductClick = (productId: string) => {
    navigate({ to: '/product/$productId', params: { productId }, search: { category: undefined } });
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-sm font-semibold text-[var(--accent)] uppercase tracking-widest mb-2">
              {category ? category : 'Featured'}
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
              {category ? `${category} Products` : 'Popular Products'}
            </h2>
          </div>
          {!category && (
            <button
              onClick={() => navigate({ to: '/', search: { category: undefined } })}
              className="hidden sm:flex items-center gap-2 text-sm font-semibold text-[var(--accent)] hover:text-[var(--accent)]/80 transition-colors"
            >
              View All <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-card rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-square bg-muted" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                  <div className="h-8 bg-muted rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && (
          <>
            {displayProducts.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No products found</h3>
                <p className="text-muted-foreground">No products available in this category yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                {displayProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleProductClick(product.id)}
                    className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-border/50"
                  >
                    {/* Product Image */}
                    <div className="relative aspect-square overflow-hidden bg-muted">
                      {product.imageData ? (
                        <img
                          src={
                            product.imageData.startsWith('data:') || product.imageData.startsWith('/')
                              ? product.imageData
                              : `data:image/jpeg;base64,${product.imageData}`
                          }
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                          <ShoppingCart className="w-12 h-12 text-muted-foreground/40" />
                        </div>
                      )}
                      {/* Wishlist */}
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white shadow-sm"
                      >
                        <Heart className="w-4 h-4 text-muted-foreground hover:text-red-500 transition-colors" />
                      </button>
                      {/* Category Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="bg-white/90 backdrop-blur-sm text-xs font-semibold text-foreground px-2.5 py-1 rounded-full shadow-sm">
                          {product.category}
                        </span>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <h3 className="font-semibold text-foreground text-sm leading-tight mb-1 line-clamp-2 group-hover:text-[var(--accent)] transition-colors">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        ))}
                        <span className="text-xs text-muted-foreground ml-1">(4.9)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-foreground">₹{product.price}</span>
                        <button
                          onClick={(e) => handleAddToCart(e, product as any)}
                          className="flex items-center gap-1.5 bg-[var(--primary)] text-primary-foreground text-xs font-semibold px-3 py-2 rounded-lg hover:bg-[var(--primary)]/90 transition-all duration-200"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
