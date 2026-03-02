import { useNavigate } from '@tanstack/react-router';
import { ShoppingCart, Star } from 'lucide-react';
import { useGetAllProducts } from '../hooks/useQueries';
import { demoProducts } from '../lib/demoProducts';
import { getImageSrc } from '../utils/imageHelpers';

interface FeaturedProductsProps {
  category?: string;
}

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

  if (isLoading) {
    return (
      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted rounded-lg h-48 mb-3" />
                <div className="bg-muted rounded h-4 mb-2" />
                <div className="bg-muted rounded h-4 w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold font-serif text-foreground mb-2">
            {category ? `${category}` : 'Featured Products'}
          </h2>
          <p className="text-muted-foreground">Discover our most popular photo gifts</p>
        </div>

        {displayProducts.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No products found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {displayProducts.map((product) => {
              const imageSrc = getImageSrc(product.imageData);
              return (
                <div
                  key={product.id}
                  className="group cursor-pointer bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 border border-border"
                  onClick={() => handleProductClick(product.id)}
                >
                  <div className="relative overflow-hidden bg-muted h-48">
                    {imageSrc ? (
                      <img
                        src={imageSrc}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <ShoppingCart className="w-12 h-12 opacity-30" />
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-sm text-foreground line-clamp-2 mb-1">{product.name}</h3>
                    <div className="flex items-center gap-1 mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                      <span className="text-xs text-muted-foreground">(4.8)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-primary">₹{product.price}</span>
                      <span className="text-xs text-muted-foreground">{product.deliveryTime}</span>
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
