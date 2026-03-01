import React, { useState } from 'react';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGetAllProducts, useAddToCart } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { toast } from 'sonner';
import { useNavigate } from '@tanstack/react-router';
import type { ProductInfo } from '../backend';

const DEMO_PRODUCTS: ProductInfo[] = [
  // Photo Prints
  {
    id: 'demo-print-1',
    name: 'Classic Photo Print',
    price: 49,
    category: 'Photo Prints',
    sizeOptions: ['4×6"', '5×7"', '8×10"'],
    imageData: '/assets/generated/demo-frame-photo-print.dim_400x400.png',
    templateImageData: '/assets/generated/demo-frame-photo-print.dim_400x400.png',
    deliveryTime: '3-5 days',
    description: 'High-quality glossy photo prints',
    dpiSettings: BigInt(300),
  },
  {
    id: 'demo-print-2',
    name: 'Matte Photo Print',
    price: 59,
    category: 'Photo Prints',
    sizeOptions: ['4×6"', '5×7"', '8×10"'],
    imageData: '/assets/generated/demo-frame-photo-print.dim_400x400.png',
    templateImageData: '/assets/generated/demo-frame-photo-print.dim_400x400.png',
    deliveryTime: '3-5 days',
    description: 'Premium matte finish photo prints',
    dpiSettings: BigInt(300),
  },
  {
    id: 'demo-print-3',
    name: 'Canvas Photo Print',
    price: 299,
    category: 'Photo Prints',
    sizeOptions: ['8×10"', '11×14"', '16×20"'],
    imageData: '/assets/generated/demo-frame-photo-print.dim_400x400.png',
    templateImageData: '/assets/generated/demo-frame-photo-print.dim_400x400.png',
    deliveryTime: '5-7 days',
    description: 'Stunning canvas prints for your walls',
    dpiSettings: BigInt(300),
  },
  {
    id: 'demo-print-4',
    name: 'Panoramic Print',
    price: 199,
    category: 'Photo Prints',
    sizeOptions: ['12×36"', '16×48"'],
    imageData: '/assets/generated/demo-frame-photo-print.dim_400x400.png',
    templateImageData: '/assets/generated/demo-frame-photo-print.dim_400x400.png',
    deliveryTime: '5-7 days',
    description: 'Wide panoramic photo prints',
    dpiSettings: BigInt(300),
  },
  // Photo Frames
  {
    id: 'demo-frame-1',
    name: 'Classic Wood Frame',
    price: 349,
    category: 'Photo Frames',
    sizeOptions: ['4×6"', '5×7"', '8×10"'],
    imageData: '/assets/generated/demo-frame-photo-frame.dim_400x400.png',
    templateImageData: '/assets/generated/demo-frame-photo-frame.dim_400x400.png',
    deliveryTime: '5-7 days',
    description: 'Elegant wooden photo frame',
    dpiSettings: BigInt(300),
  },
  {
    id: 'demo-frame-2',
    name: 'Modern Metal Frame',
    price: 449,
    category: 'Photo Frames',
    sizeOptions: ['5×7"', '8×10"', '11×14"'],
    imageData: '/assets/generated/demo-frame-photo-frame.dim_400x400.png',
    templateImageData: '/assets/generated/demo-frame-photo-frame.dim_400x400.png',
    deliveryTime: '5-7 days',
    description: 'Sleek modern metal photo frame',
    dpiSettings: BigInt(300),
  },
  {
    id: 'demo-frame-3',
    name: 'Collage Frame',
    price: 599,
    category: 'Photo Frames',
    sizeOptions: ['12×16"', '16×20"'],
    imageData: '/assets/generated/demo-frame-photo-frame.dim_400x400.png',
    templateImageData: '/assets/generated/demo-frame-photo-frame.dim_400x400.png',
    deliveryTime: '7-10 days',
    description: 'Multi-photo collage frame',
    dpiSettings: BigInt(300),
  },
  {
    id: 'demo-frame-4',
    name: 'Floating Frame',
    price: 699,
    category: 'Photo Frames',
    sizeOptions: ['8×10"', '11×14"'],
    imageData: '/assets/generated/demo-frame-photo-frame.dim_400x400.png',
    templateImageData: '/assets/generated/demo-frame-photo-frame.dim_400x400.png',
    deliveryTime: '7-10 days',
    description: 'Elegant floating glass frame',
    dpiSettings: BigInt(300),
  },
  // Photo Magnets
  {
    id: 'demo-magnet-1',
    name: 'Square Photo Magnet',
    price: 99,
    category: 'Photo Magnets',
    sizeOptions: ['2×2"', '3×3"'],
    imageData: '/assets/generated/demo-frame-photo-magnet.dim_400x400.png',
    templateImageData: '/assets/generated/demo-frame-photo-magnet.dim_400x400.png',
    deliveryTime: '3-5 days',
    description: 'Custom square photo magnets',
    dpiSettings: BigInt(300),
  },
  {
    id: 'demo-magnet-2',
    name: 'Round Photo Magnet',
    price: 119,
    category: 'Photo Magnets',
    sizeOptions: ['2" round', '3" round'],
    imageData: '/assets/generated/demo-frame-photo-magnet.dim_400x400.png',
    templateImageData: '/assets/generated/demo-frame-photo-magnet.dim_400x400.png',
    deliveryTime: '3-5 days',
    description: 'Cute round photo magnets',
    dpiSettings: BigInt(300),
  },
  {
    id: 'demo-magnet-3',
    name: 'Magnet Set of 6',
    price: 499,
    category: 'Photo Magnets',
    sizeOptions: ['2×2"', '3×3"'],
    imageData: '/assets/generated/demo-frame-photo-magnet.dim_400x400.png',
    templateImageData: '/assets/generated/demo-frame-photo-magnet.dim_400x400.png',
    deliveryTime: '3-5 days',
    description: 'Set of 6 custom photo magnets',
    dpiSettings: BigInt(300),
  },
  {
    id: 'demo-magnet-4',
    name: 'Fridge Magnet Strip',
    price: 149,
    category: 'Photo Magnets',
    sizeOptions: ['2×6"'],
    imageData: '/assets/generated/demo-frame-photo-magnet.dim_400x400.png',
    templateImageData: '/assets/generated/demo-frame-photo-magnet.dim_400x400.png',
    deliveryTime: '3-5 days',
    description: 'Photo strip fridge magnet',
    dpiSettings: BigInt(300),
  },
  // Mugs
  {
    id: 'demo-mug-1',
    name: 'Classic Photo Mug',
    price: 299,
    category: 'Mugs',
    sizeOptions: ['11oz', '15oz'],
    imageData: '/assets/generated/demo-frame-mug.dim_400x400.png',
    templateImageData: '/assets/generated/demo-frame-mug.dim_400x400.png',
    deliveryTime: '5-7 days',
    description: 'Custom printed ceramic mug',
    dpiSettings: BigInt(300),
  },
  {
    id: 'demo-mug-2',
    name: 'Magic Color Mug',
    price: 399,
    category: 'Mugs',
    sizeOptions: ['11oz'],
    imageData: '/assets/generated/demo-frame-mug.dim_400x400.png',
    templateImageData: '/assets/generated/demo-frame-mug.dim_400x400.png',
    deliveryTime: '5-7 days',
    description: 'Color-changing magic photo mug',
    dpiSettings: BigInt(300),
  },
  {
    id: 'demo-mug-3',
    name: 'Travel Photo Mug',
    price: 499,
    category: 'Mugs',
    sizeOptions: ['14oz', '16oz'],
    imageData: '/assets/generated/demo-frame-mug.dim_400x400.png',
    templateImageData: '/assets/generated/demo-frame-mug.dim_400x400.png',
    deliveryTime: '5-7 days',
    description: 'Insulated travel mug with photo',
    dpiSettings: BigInt(300),
  },
  {
    id: 'demo-mug-4',
    name: 'Couple Mug Set',
    price: 699,
    category: 'Mugs',
    sizeOptions: ['11oz'],
    imageData: '/assets/generated/demo-frame-mug.dim_400x400.png',
    templateImageData: '/assets/generated/demo-frame-mug.dim_400x400.png',
    deliveryTime: '5-7 days',
    description: 'Matching couple photo mugs',
    dpiSettings: BigInt(300),
  },
  // Corporate Gifts
  {
    id: 'demo-corp-1',
    name: 'Corporate Photo Frame',
    price: 799,
    category: 'Corporate Gifts',
    sizeOptions: ['5×7"', '8×10"'],
    imageData: '/assets/generated/demo-frame-corporate-gift.dim_400x400.png',
    templateImageData: '/assets/generated/demo-frame-corporate-gift.dim_400x400.png',
    deliveryTime: '7-10 days',
    description: 'Premium corporate photo frame gift',
    dpiSettings: BigInt(300),
  },
  {
    id: 'demo-corp-2',
    name: 'Branded Mug Set',
    price: 1299,
    category: 'Corporate Gifts',
    sizeOptions: ['Set of 10', 'Set of 25'],
    imageData: '/assets/generated/demo-frame-corporate-gift.dim_400x400.png',
    templateImageData: '/assets/generated/demo-frame-corporate-gift.dim_400x400.png',
    deliveryTime: '10-14 days',
    description: 'Branded mugs for corporate gifting',
    dpiSettings: BigInt(300),
  },
  {
    id: 'demo-corp-3',
    name: 'Photo Calendar',
    price: 499,
    category: 'Corporate Gifts',
    sizeOptions: ['A4', 'A3'],
    imageData: '/assets/generated/demo-frame-corporate-gift.dim_400x400.png',
    templateImageData: '/assets/generated/demo-frame-corporate-gift.dim_400x400.png',
    deliveryTime: '7-10 days',
    description: 'Custom photo calendar for offices',
    dpiSettings: BigInt(300),
  },
  {
    id: 'demo-corp-4',
    name: 'Executive Gift Box',
    price: 1999,
    category: 'Corporate Gifts',
    sizeOptions: ['Standard'],
    imageData: '/assets/generated/demo-frame-corporate-gift.dim_400x400.png',
    templateImageData: '/assets/generated/demo-frame-corporate-gift.dim_400x400.png',
    deliveryTime: '10-14 days',
    description: 'Premium executive photo gift box',
    dpiSettings: BigInt(300),
  },
];

interface ProductCardProps {
  product: ProductInfo;
}

function ProductCard({ product }: ProductCardProps) {
  const { identity } = useInternetIdentity();
  const addToCart = useAddToCart();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);

  const handleCardClick = () => {
    navigate({ to: '/product/$productId', params: { productId: product.id } });
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!identity) {
      toast.error('Please login to add items to cart');
      return;
    }
    try {
      await addToCart.mutateAsync({
        product,
        quantity: BigInt(1),
        selectedSize: product.sizeOptions[0] || '',
        customImageData: '',
      });
      toast.success(`${product.name} added to cart!`);
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked(!liked);
  };

  const imageSrc =
    product.imageData ||
    product.templateImageData ||
    '/assets/generated/frame-product-mockup.dim_800x800.png';

  return (
    <div
      className="bg-card rounded-2xl shadow-card border border-border overflow-hidden group hover:shadow-card-hover transition-all duration-300 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <img
          src={imageSrc}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <button
          onClick={handleLikeClick}
          className="absolute top-3 right-3 p-2 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card transition-colors"
        >
          <Heart
            className={`h-4 w-4 transition-colors ${liked ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`}
          />
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-foreground text-sm leading-tight">{product.name}</h3>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{product.description}</p>
        <div className="flex items-center gap-1 mt-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} className="h-3 w-3 fill-amber-400 text-amber-400" />
          ))}
          <span className="text-xs text-muted-foreground ml-1">(24)</span>
        </div>
        <div className="flex items-center justify-between mt-3">
          <span className="font-bold text-foreground">₹{product.price}</span>
          <Button
            size="sm"
            className="bg-primary text-primary-foreground hover:opacity-90 rounded-xl gap-1 text-xs"
            onClick={handleAddToCart}
            disabled={addToCart.isPending}
          >
            <ShoppingCart className="h-3 w-3" />
            {addToCart.isPending ? 'Adding...' : 'Add'}
          </Button>
        </div>
      </div>
    </div>
  );
}

interface FeaturedProductsProps {
  category?: string;
}

export default function FeaturedProducts({ category }: FeaturedProductsProps) {
  const { data: backendProducts, isLoading } = useGetAllProducts();

  const allProducts =
    backendProducts && backendProducts.length > 0 ? backendProducts : DEMO_PRODUCTS;

  const displayProducts = category
    ? allProducts.filter((p) => p.category === category)
    : allProducts;

  if (isLoading) {
    return (
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-card rounded-2xl border border-border overflow-hidden animate-pulse">
              <div className="aspect-square bg-secondary" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-secondary rounded w-3/4" />
                <div className="h-3 bg-secondary rounded w-1/2" />
                <div className="h-8 bg-secondary rounded mt-3" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 px-4 max-w-7xl mx-auto">
      {category && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground font-display">{category}</h2>
          <p className="text-muted-foreground mt-1">
            {displayProducts.length} product{displayProducts.length !== 1 ? 's' : ''} found
          </p>
        </div>
      )}
      {displayProducts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">No products found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
