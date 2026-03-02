import React, { useState } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useGetProduct } from '../hooks/useQueries';
import { getDemoProductById } from '../lib/demoProducts';
import { getImageSrc } from '../utils/imageHelpers';
import { useAuth } from '../hooks/useAuth';
import { Share2, ChevronRight, MapPin, Star } from 'lucide-react';
import type { ProductInfo } from '../backend';

const FRAME_STYLES = ['Plain Black', 'Plain Brown', 'Goldline Brown', 'Gold Sash Brown', 'Zigzag Brown'];
const PRINT_MEDIA = ['Glossy', 'Matte', 'Canvas', 'Metallic'];
const ORIENTATIONS = ['Portrait', 'Landscape', 'Square'];

export default function ProductDetailPage() {
  const navigate = useNavigate();
  const { productId } = useParams({ from: '/layout/product/$productId' });
  const { isAuthenticated } = useAuth();

  const { data: backendProduct, isLoading } = useGetProduct(productId);

  const product: ProductInfo | undefined = backendProduct ?? getDemoProductById(productId) ?? undefined;

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedFrame, setSelectedFrame] = useState(FRAME_STYLES[0]);
  const [selectedMedia, setSelectedMedia] = useState(PRINT_MEDIA[0]);
  const [selectedOrientation, setSelectedOrientation] = useState(ORIENTATIONS[0]);
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('');
  const [pincodeChecked, setPincodeChecked] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const thumbnails = product
    ? [
        getImageSrc(product.imageData) || '/assets/generated/frame-product-mockup.dim_800x800.png',
        getImageSrc(product.templateImageData) || '/assets/generated/frame-product-mockup.dim_800x800.png',
        '/assets/generated/frame-product-mockup.dim_800x800.png',
        '/assets/generated/frame-product-mockup.dim_800x800.png',
        '/assets/generated/frame-product-mockup.dim_800x800.png',
      ]
    : [];

  const mainImage = thumbnails[activeImageIndex] || '/assets/generated/frame-product-mockup.dim_800x800.png';

  if (isLoading && !String(productId).startsWith('demo-')) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="aspect-square bg-gray-200 rounded-xl" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
        <p className="text-gray-500 mb-6">The product you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate({ to: '/', search: { category: undefined } })}
          className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const handleUploadFiles = () => {
    if (!isAuthenticated) {
      navigate({ to: '/login', search: { mode: undefined, redirect: undefined } });
      return;
    }
    navigate({
      to: '/editor',
      search: {
        category: undefined,
        productId: product.id,
        size: selectedSize || product.sizeOptions[0],
      },
    });
  };

  const handleCheckPincode = () => {
    if (pincode.length === 6) {
      setPincodeChecked(true);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Images */}
        <div>
          <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 mb-4 border border-gray-200">
            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/generated/frame-product-mockup.dim_800x800.png';
              }}
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {thumbnails.map((thumb, index) => (
              <button
                key={index}
                onClick={() => setActiveImageIndex(index)}
                className={`w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                  activeImageIndex === index ? 'border-primary' : 'border-gray-200'
                }`}
              >
                <img
                  src={thumb}
                  alt={`View ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/generated/frame-product-mockup.dim_800x800.png';
                  }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Details */}
        <div>
          <div className="flex items-start justify-between mb-3">
            <h1 className="text-2xl font-bold text-gray-900 flex-1">{product.name}</h1>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ))}
            <span className="text-sm text-gray-500 ml-1">(128 reviews)</span>
          </div>

          <p className="text-gray-600 mb-4">{product.description}</p>

          <ul className="space-y-1 mb-4">
            {['Premium quality print', 'Fast delivery', 'Customizable sizes', 'Satisfaction guaranteed'].map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                <ChevronRight className="w-4 h-4 text-primary" />
                {f}
              </li>
            ))}
          </ul>

          <div className="border border-gray-200 rounded-lg p-3 mb-4">
            <span className="text-sm text-gray-600">
              🚚 <strong>Same Day Delivery</strong> available for orders placed before 12 PM
            </span>
          </div>

          <div className="space-y-3 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Print Media</label>
              <select
                value={selectedMedia}
                onChange={(e) => setSelectedMedia(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {PRINT_MEDIA.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Frame Style</label>
              <select
                value={selectedFrame}
                onChange={(e) => setSelectedFrame(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {FRAME_STYLES.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Orientation</label>
              <select
                value={selectedOrientation}
                onChange={(e) => setSelectedOrientation(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {ORIENTATIONS.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select size</option>
                {product.sizeOptions.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <label className="text-sm font-medium text-gray-700">Quantity:</label>
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 text-gray-600 hover:bg-gray-100"
              >
                −
              </button>
              <span className="px-4 py-2 text-gray-900 font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 text-gray-600 hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-orange-500">₹{(product.price * quantity).toFixed(2)}</span>
              {quantity > 1 && (
                <span className="text-sm text-gray-500">₹{product.price} × {quantity}</span>
              )}
            </div>
            <button className="text-sm text-primary hover:underline mt-1">Buy in bulk and save</button>
          </div>

          <button
            onClick={handleUploadFiles}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-xl font-bold text-lg transition-colors mb-4"
          >
            UPLOAD YOUR FILES
          </button>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-gray-700">Estimate Delivery</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter pincode"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={handleCheckPincode}
                className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Check
              </button>
            </div>
            {pincodeChecked && (
              <p className="text-sm text-green-600 mt-2">
                ✓ Delivery available! Estimated: {product.deliveryTime}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
