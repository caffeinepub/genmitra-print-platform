import React, { useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { ShoppingCart, Upload, Star, Truck, Shield, Share2, MapPin } from 'lucide-react';
import { useGetProduct, useAddToCart, useIsPincodeAvailable } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { getDemoProductById } from '../lib/demoProducts';
import { toast } from 'sonner';
import FrameStyleDropdown from '../components/FrameStyleDropdown';

export default function ProductDetailPage() {
  const { productId } = useParams({ from: '/layout/product/$productId' });
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();

  const { data: backendProduct, isLoading } = useGetProduct(productId);
  const demoProduct = getDemoProductById(productId);
  const product = backendProduct || demoProduct;

  const addToCart = useAddToCart();

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedMedia, setSelectedMedia] = useState('Glossy');
  const [selectedFrame, setSelectedFrame] = useState('Plain Black');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('');
  const [checkPincode, setCheckPincode] = useState('');

  const { data: pincodeAvailable, isLoading: pincodeLoading } = useIsPincodeAvailable(checkPincode);

  const handleNavigateToEditor = () => {
    if (!identity) {
      toast.error('Please login to upload your photo');
      navigate({ to: '/login', search: { mode: undefined, redirect: `/product/${productId}` } });
      return;
    }
    if (!selectedSize && product?.sizeOptions && product.sizeOptions.length > 0) {
      toast.error('Please select a size first');
      return;
    }
    navigate({
      to: '/editor',
      search: {
        productId,
        size: selectedSize || product?.sizeOptions?.[0] || '',
      },
    });
  };

  const handleAddToCart = async () => {
    if (!identity) {
      toast.error('Please login to add items to cart');
      navigate({ to: '/login', search: { mode: undefined, redirect: `/product/${productId}` } });
      return;
    }
    if (!product) return;

    try {
      await addToCart.mutateAsync({
        product: product as any,
        quantity: BigInt(quantity),
        selectedSize: selectedSize || product.sizeOptions?.[0] || '',
        customImageData: '',
      });
      toast.success('Added to cart!');
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="aspect-square bg-muted rounded-2xl animate-pulse" />
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-8 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-4">Product Not Found</h2>
        <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate({ to: '/', search: { category: undefined } })}
          className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const imageUrl = product.imageData
    ? (product.imageData.startsWith('data:') || product.imageData.startsWith('/')
      ? product.imageData
      : `data:image/jpeg;base64,${product.imageData}`)
    : '/assets/generated/photo-print-1.dim_600x600.png';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <button onClick={() => navigate({ to: '/', search: { category: undefined } })} className="hover:text-foreground transition-colors">
          Home
        </button>
        <span>/</span>
        <button
          onClick={() => navigate({ to: '/', search: { category: product.category } })}
          className="hover:text-foreground transition-colors"
        >
          {product.category}
        </button>
        <span>/</span>
        <span className="text-foreground font-medium truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Product Image */}
        <div className="space-y-4">
          <div className="aspect-square rounded-2xl overflow-hidden bg-muted border border-border">
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/generated/photo-print-1.dim_600x600.png';
              }}
            />
          </div>
          {/* Thumbnail row */}
          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-16 h-16 rounded-lg overflow-hidden bg-muted border border-border cursor-pointer hover:border-primary transition-colors">
                <img
                  src={imageUrl}
                  alt={`View ${i + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/generated/photo-print-1.dim_600x600.png';
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="space-y-6">
          {/* Title & Share */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">{product.category}</span>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mt-1">{product.name}</h1>
            </div>
            <button className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">(4.9) · 128 reviews</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-primary">₹{product.price}</span>
            <span className="text-sm text-muted-foreground line-through">₹{Math.round(product.price * 1.2)}</span>
            <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">17% off</span>
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-muted-foreground text-sm leading-relaxed">{product.description}</p>
          )}

          {/* Delivery Highlight */}
          <div className="flex items-center gap-2 p-3 bg-green-50 rounded-xl border border-green-100">
            <Truck className="w-4 h-4 text-green-600 shrink-0" />
            <span className="text-sm text-green-700 font-medium">
              {product.deliveryTime || 'Delivery in 3-5 business days'}
            </span>
          </div>

          {/* Size Selection */}
          {product.sizeOptions && product.sizeOptions.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Select Size</label>
              <div className="flex flex-wrap gap-2">
                {product.sizeOptions.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                      selectedSize === size
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border text-foreground hover:border-primary/50'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Print Media */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Print Media</label>
            <div className="flex gap-2">
              {['Glossy', 'Matte', 'Satin'].map((media) => (
                <button
                  key={media}
                  onClick={() => setSelectedMedia(media)}
                  className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                    selectedMedia === media
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border text-foreground hover:border-primary/50'
                  }`}
                >
                  {media}
                </button>
              ))}
            </div>
          </div>

          {/* Frame Style (for Photo Frames category) */}
          {product.category === 'Photo Frames' && (
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Frame Style</label>
              <FrameStyleDropdown value={selectedFrame} onChange={setSelectedFrame} />
            </div>
          )}

          {/* Orientation */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Orientation</label>
            <div className="flex gap-2">
              {(['portrait', 'landscape'] as const).map((o) => (
                <button
                  key={o}
                  onClick={() => setOrientation(o)}
                  className={`px-4 py-2 rounded-lg border-2 text-sm font-medium capitalize transition-all ${
                    orientation === o
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border text-foreground hover:border-primary/50'
                  }`}
                >
                  {o}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Quantity</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-9 h-9 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors font-bold"
              >
                −
              </button>
              <span className="w-10 text-center font-semibold text-foreground">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-9 h-9 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors font-bold"
              >
                +
              </button>
            </div>
          </div>

          {/* Pincode Check */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              Check Delivery
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter pincode"
                className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                maxLength={6}
              />
              <button
                onClick={() => setCheckPincode(pincode)}
                disabled={pincode.length !== 6 || pincodeLoading}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {pincodeLoading ? 'Checking...' : 'Check'}
              </button>
            </div>
            {checkPincode && !pincodeLoading && (
              <p className={`text-xs mt-1.5 font-medium ${pincodeAvailable ? 'text-green-600' : 'text-red-500'}`}>
                {pincodeAvailable
                  ? `✓ Delivery available to ${checkPincode}`
                  : `✗ Delivery not available to ${checkPincode}`}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleNavigateToEditor}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors"
            >
              <Upload className="w-5 h-5" />
              Upload Your Photo
            </button>
            <button
              onClick={handleAddToCart}
              disabled={addToCart.isPending}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 border-2 border-primary text-primary rounded-xl font-semibold hover:bg-primary/5 transition-colors disabled:opacity-50"
            >
              {addToCart.isPending ? (
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : (
                <ShoppingCart className="w-5 h-5" />
              )}
              Add to Cart
            </button>
          </div>

          {/* Trust Badges */}
          <div className="flex items-center gap-4 pt-2 border-t border-border">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Shield className="w-4 h-4 text-green-500" />
              Secure Payment
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Truck className="w-4 h-4 text-blue-500" />
              Fast Delivery
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Star className="w-4 h-4 text-yellow-500" />
              Quality Assured
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
