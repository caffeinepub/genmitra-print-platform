import React, { useState } from 'react';
import { ShoppingCart, Star, Truck, Shield, RotateCcw, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGetProduct, useAddToCart } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useParams, useNavigate } from '@tanstack/react-router';
import type { ProductInfo } from '../backend';

const DEMO_PRODUCT: ProductInfo = {
  id: 'demo-detail-product',
  name: 'Classic Photo Frame',
  description: 'High-quality custom photo frame with premium finish. Perfect for preserving your precious memories.',
  price: 349,
  category: 'Photo Frames',
  sizeOptions: ['4×6"', '5×7"', '8×10"'],
  imageData: '/assets/generated/frame-product-mockup.dim_800x800.png',
  templateImageData: '/assets/generated/frame-product-mockup.dim_800x800.png',
  deliveryTime: '5-7 days',
  dpiSettings: BigInt(300),
};

export default function ProductDetailPage() {
  const { productId } = useParams({ from: '/layout/product/$productId' });
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: fetchedProduct, isLoading } = useGetProduct(productId || '');
  const addToCart = useAddToCart();

  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  const displayProduct: ProductInfo = fetchedProduct || DEMO_PRODUCT;

  const handleAddToCart = async () => {
    if (!identity) {
      toast.error('Please login to add items to cart');
      return;
    }
    const size = selectedSize || displayProduct.sizeOptions[0] || '';
    try {
      await addToCart.mutateAsync({
        product: displayProduct,
        quantity: BigInt(quantity),
        selectedSize: size,
        customImageData: '',
      });
      toast.success(`${displayProduct.name} added to cart!`);
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  const handleCustomize = () => {
    navigate({ to: '/editor/$productId', params: { productId: productId || displayProduct.id } });
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="aspect-square rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4 rounded-xl" />
            <Skeleton className="h-6 w-1/4 rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Back button */}
      <button
        onClick={() => navigate({ to: '/', search: { category: undefined } })}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 text-sm"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="aspect-square rounded-2xl overflow-hidden bg-secondary border border-border">
            <img
              src={displayProduct.imageData || displayProduct.templateImageData || '/assets/generated/frame-product-mockup.dim_800x800.png'}
              alt={displayProduct.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-5">
          <div>
            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
              {displayProduct.category}
            </span>
            <h1 className="text-2xl font-bold text-foreground font-display mt-2">{displayProduct.name}</h1>
            <div className="flex items-center gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />
              ))}
              <span className="text-sm text-muted-foreground ml-1">(48 reviews)</span>
            </div>
          </div>

          <div>
            <span className="text-3xl font-bold text-foreground">₹{displayProduct.price}</span>
            <span className="text-sm text-muted-foreground ml-2">inclusive of all taxes</span>
          </div>

          <p className="text-muted-foreground text-sm leading-relaxed">{displayProduct.description}</p>

          {/* Size Selection */}
          {displayProduct.sizeOptions.length > 0 && (
            <div>
              <p className="font-medium text-foreground mb-2">Select Size</p>
              <div className="flex flex-wrap gap-2">
                {displayProduct.sizeOptions.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-xl text-sm border-2 transition-colors ${
                      (selectedSize || displayProduct.sizeOptions[0]) === size
                        ? 'border-primary bg-primary/10 text-primary font-medium'
                        : 'border-border text-muted-foreground hover:border-primary/50'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div>
            <p className="font-medium text-foreground mb-2">Quantity</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-xl border border-border flex items-center justify-center hover:bg-secondary transition-colors"
              >
                −
              </button>
              <span className="font-medium text-foreground w-8 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-xl border border-border flex items-center justify-center hover:bg-secondary transition-colors"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              className="w-full bg-primary text-primary-foreground hover:opacity-90 rounded-xl gap-2 py-6 text-base"
              onClick={handleCustomize}
            >
              Customize Now
            </Button>
            <Button
              variant="outline"
              className="w-full rounded-xl gap-2 py-6 text-base"
              onClick={handleAddToCart}
              disabled={addToCart.isPending}
            >
              <ShoppingCart className="h-5 w-5" />
              {addToCart.isPending ? 'Adding to Cart...' : 'Add to Cart'}
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="flex flex-col items-center text-center gap-1 p-3 bg-secondary/50 rounded-xl">
              <Truck className="h-5 w-5 text-primary" />
              <span className="text-xs text-muted-foreground">{displayProduct.deliveryTime}</span>
            </div>
            <div className="flex flex-col items-center text-center gap-1 p-3 bg-secondary/50 rounded-xl">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-xs text-muted-foreground">Quality Assured</span>
            </div>
            <div className="flex flex-col items-center text-center gap-1 p-3 bg-secondary/50 rounded-xl">
              <RotateCcw className="h-5 w-5 text-primary" />
              <span className="text-xs text-muted-foreground">Easy Returns</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
