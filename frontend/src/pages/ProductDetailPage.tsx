import { useState } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { ShoppingCart, Upload, CheckCircle, Truck, Star, ArrowLeft } from 'lucide-react';
import { useGetProduct, useIsPincodeAvailable } from '../hooks/useQueries';
import { getDemoProductById } from '../lib/demoProducts';
import { getImageSrc } from '../utils/imageHelpers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function ProductDetailPage() {
  const { productId } = useParams({ from: '/layout/product/$productId' });
  const navigate = useNavigate();

  const { data: backendProduct, isLoading } = useGetProduct(productId);
  const product = backendProduct ?? getDemoProductById(productId);

  const [selectedSize, setSelectedSize] = useState('');
  const [pincode, setPincode] = useState('');
  const [checkedPincode, setCheckedPincode] = useState('');
  const [quantity, setQuantity] = useState(1);

  const { data: pincodeAvailable, isLoading: pincodeLoading, refetch: checkPincode } = useIsPincodeAvailable(checkedPincode);

  const handleCheckPincode = () => {
    if (pincode.length === 6) {
      setCheckedPincode(pincode);
      setTimeout(() => checkPincode(), 100);
    }
  };

  const handleAddToCart = () => {
    navigate({
      to: '/editor/$productId',
      params: { productId: product?.id ?? productId },
      search: { category: undefined },
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
          <div className="bg-muted rounded-xl h-96" />
          <div className="space-y-4">
            <div className="bg-muted rounded h-8 w-3/4" />
            <div className="bg-muted rounded h-6 w-1/4" />
            <div className="bg-muted rounded h-4 w-full" />
            <div className="bg-muted rounded h-4 w-5/6" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-4">Product Not Found</h2>
        <Button onClick={() => navigate({ to: '/', search: { category: undefined } })}>
          Back to Home
        </Button>
      </div>
    );
  }

  const mainImageSrc = getImageSrc(product.imageData);
  const templateImageSrc = getImageSrc(product.templateImageData);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate({ to: '/', search: { category: undefined } })}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Products
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="bg-muted rounded-xl overflow-hidden aspect-square">
            {mainImageSrc ? (
              <img src={mainImageSrc} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <ShoppingCart className="w-16 h-16 opacity-30" />
              </div>
            )}
          </div>
          {templateImageSrc && (
            <div className="bg-muted rounded-xl overflow-hidden aspect-square">
              <img src={templateImageSrc} alt={`${product.name} template`} className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <Badge variant="secondary" className="mb-2">{product.category}</Badge>
            <h1 className="text-3xl font-bold font-serif text-foreground mb-2">{product.name}</h1>
            <div className="flex items-center gap-2 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
              <span className="text-sm text-muted-foreground">(4.8 · 124 reviews)</span>
            </div>
            <p className="text-3xl font-bold text-primary">₹{product.price}</p>
          </div>

          <p className="text-muted-foreground leading-relaxed">{product.description}</p>

          {/* Size Selection */}
          {product.sizeOptions && product.sizeOptions.length > 0 && (
            <div>
              <h3 className="font-semibold text-foreground mb-2">Select Size</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizeOptions.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      selectedSize === size
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-card text-foreground hover:border-primary'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Delivery Info */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
            <Truck className="w-4 h-4 text-primary shrink-0" />
            <span>Estimated delivery: <strong className="text-foreground">{product.deliveryTime}</strong></span>
          </div>

          {/* Pincode Check */}
          <div>
            <h3 className="font-semibold text-foreground mb-2">Check Delivery Availability</h3>
            <div className="flex gap-2">
              <Input
                placeholder="Enter 6-digit pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="max-w-48"
              />
              <Button
                variant="outline"
                onClick={handleCheckPincode}
                disabled={pincode.length !== 6 || pincodeLoading}
              >
                {pincodeLoading ? 'Checking...' : 'Check'}
              </Button>
            </div>
            {checkedPincode && pincodeAvailable !== undefined && (
              <div className={`mt-2 flex items-center gap-2 text-sm ${pincodeAvailable ? 'text-green-600' : 'text-destructive'}`}>
                <CheckCircle className="w-4 h-4" />
                {pincodeAvailable
                  ? `Delivery available to ${checkedPincode}`
                  : `Delivery not available to ${checkedPincode}`}
              </div>
            )}
          </div>

          {/* Quantity */}
          <div>
            <h3 className="font-semibold text-foreground mb-2">Quantity</h3>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
              >
                −
              </button>
              <span className="font-semibold text-foreground w-8 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              className="flex-1"
              size="lg"
              onClick={handleAddToCart}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Photo & Customize
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
