import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Upload,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Type,
  RectangleVertical,
  Monitor,
  ArrowRight,
} from 'lucide-react';
import { useAddToCart } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { toast } from 'sonner';
import type { ProductInfo } from '../backend';

const DEMO_PRODUCT: ProductInfo = {
  id: 'demo-editor-product',
  name: 'Custom Photo Frame',
  price: 349,
  category: 'Photo Frames',
  sizeOptions: ['4×6"', '5×7"', '8×10"'],
  imageData: '/assets/generated/frame-product-mockup.dim_800x800.png',
  templateImageData: '/assets/generated/frame-product-mockup.dim_800x800.png',
  deliveryTime: '5-7 days',
  description: 'Create your custom photo frame',
  dpiSettings: BigInt(300),
};

type Orientation = 'portrait' | 'landscape';

interface ImageState {
  src: string | null;
  zoom: number;
  offsetX: number;
  offsetY: number;
  rotation: number;
}

interface DragState {
  isDragging: boolean;
  startX: number;
  startY: number;
}

interface TextOverlay {
  text: string;
  x: number;
  y: number;
}

export default function EditorPage() {
  const { identity } = useInternetIdentity();
  const addToCart = useAddToCart();

  const [orientation, setOrientation] = useState<Orientation>('portrait');
  const [imageState, setImageState] = useState<ImageState>({
    src: null,
    zoom: 1,
    offsetX: 0,
    offsetY: 0,
    rotation: 0,
  });
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    startX: 0,
    startY: 0,
  });
  const [textOverlay, setTextOverlay] = useState<TextOverlay | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedSize] = useState(DEMO_PRODUCT.sizeOptions[0]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Frame dimensions based on orientation
  const frameWidth = orientation === 'portrait' ? 310 : 460;
  const frameHeight = orientation === 'portrait' ? 420 : 310;

  // Canvas dimensions (inner white area)
  const canvasWidth = frameWidth - 32;
  const canvasHeight = frameHeight - 32;

  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // White background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (imageState.src) {
      const img = new Image();
      img.onload = () => {
        ctx.save();
        ctx.translate(canvas.width / 2 + imageState.offsetX, canvas.height / 2 + imageState.offsetY);
        ctx.rotate((imageState.rotation * Math.PI) / 180);
        ctx.scale(imageState.zoom, imageState.zoom);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        ctx.restore();

        // Draw text overlay
        if (textOverlay) {
          ctx.font = 'bold 20px sans-serif';
          ctx.fillStyle = 'white';
          ctx.strokeStyle = 'black';
          ctx.lineWidth = 2;
          ctx.textAlign = 'center';
          ctx.strokeText(textOverlay.text, textOverlay.x, textOverlay.y);
          ctx.fillText(textOverlay.text, textOverlay.x, textOverlay.y);
        }
      };
      img.src = imageState.src;
    }
  }, [imageState, textOverlay]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // Re-render when canvas size changes (orientation switch)
  useEffect(() => {
    renderCanvas();
  }, [canvasWidth, canvasHeight, renderCanvas]);

  const loadImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImageState({
        src: reader.result as string,
        zoom: 1,
        offsetX: 0,
        offsetY: 0,
        rotation: 0,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) loadImageFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) loadImageFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!imageState.src) return;
    setDragState({
      isDragging: true,
      startX: e.clientX - imageState.offsetX,
      startY: e.clientY - imageState.offsetY,
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!dragState.isDragging) return;
    setImageState((prev) => ({
      ...prev,
      offsetX: e.clientX - dragState.startX,
      offsetY: e.clientY - dragState.startY,
    }));
  };

  const handleMouseUp = () => {
    setDragState((prev) => ({ ...prev, isDragging: false }));
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.05 : 0.05;
    setImageState((prev) => ({
      ...prev,
      zoom: Math.max(0.3, Math.min(5, prev.zoom + delta)),
    }));
  };

  const handleZoomIn = () => {
    setImageState((prev) => ({ ...prev, zoom: Math.min(5, prev.zoom + 0.15) }));
  };

  const handleZoomOut = () => {
    setImageState((prev) => ({ ...prev, zoom: Math.max(0.3, prev.zoom - 0.15) }));
  };

  const handleRotate = () => {
    setImageState((prev) => ({ ...prev, rotation: (prev.rotation + 90) % 360 }));
  };

  const handleAddText = () => {
    const text = window.prompt('Enter text to overlay:');
    if (text) {
      setTextOverlay({ text, x: canvasWidth / 2, y: canvasHeight - 30 });
    }
  };

  const handleSaveAndSelectSize = async () => {
    if (!identity) {
      toast.error('Please login to save your design');
      return;
    }
    if (!imageState.src) {
      toast.error('Please upload a photo first');
      return;
    }
    try {
      const canvas = canvasRef.current;
      const customImageData = canvas ? canvas.toDataURL() : '';
      await addToCart.mutateAsync({
        product: DEMO_PRODUCT,
        quantity: BigInt(1),
        selectedSize,
        customImageData,
      });
      toast.success('Design saved and added to cart!');
    } catch {
      toast.error('Failed to save design');
    }
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col"
      style={{ backgroundColor: '#eef0f2' }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {/* Top Bar */}
      <div className="w-full bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        {/* Orientation Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setOrientation('portrait')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              orientation === 'portrait'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            <RectangleVertical className="h-4 w-4" />
            Portrait
          </button>
          <button
            onClick={() => setOrientation('landscape')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              orientation === 'landscape'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Monitor className="h-4 w-4" />
            Landscape
          </button>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSaveAndSelectSize}
          disabled={addToCart.isPending}
          className="flex items-center gap-2 px-5 py-2 rounded-lg bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 transition-colors disabled:opacity-60"
        >
          {addToCart.isPending ? (
            <>
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              Save &amp; Select Size
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center py-10 px-4">
        {/* Frame Mockup */}
        <div
          className="relative flex items-center justify-center transition-all duration-300"
          style={{
            width: frameWidth,
            height: frameHeight,
            backgroundColor: '#7a5c3a',
            borderRadius: 28,
            boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
            padding: 14,
          }}
        >
          {/* Inner white area / canvas */}
          <div
            className="relative overflow-hidden bg-white"
            style={{
              width: canvasWidth,
              height: canvasHeight,
              borderRadius: 14,
            }}
          >
            {imageState.src ? (
              <canvas
                ref={canvasRef}
                width={canvasWidth}
                height={canvasHeight}
                className="block"
                style={{ cursor: dragState.isDragging ? 'grabbing' : 'grab' }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}
              />
            ) : (
              <>
                {/* Hidden canvas for export even without image */}
                <canvas
                  ref={canvasRef}
                  width={canvasWidth}
                  height={canvasHeight}
                  className="hidden"
                />
                {/* Upload placeholder */}
                <div
                  className={`w-full h-full flex flex-col items-center justify-center gap-3 transition-colors ${
                    isDragOver ? 'bg-teal-50' : 'bg-white'
                  }`}
                >
                  <Upload className="h-10 w-10 text-gray-400" strokeWidth={1.5} />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-5 py-2 rounded-lg bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 transition-colors"
                  >
                    Select Photo
                  </button>
                  <p className="text-sm text-gray-400">or drag &amp; drop your image</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Icon Toolbar */}
        <div className="mt-6 flex items-center gap-3">
          {/* Upload */}
          <button
            onClick={() => fileInputRef.current?.click()}
            title="Upload Photo"
            className="w-11 h-11 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-teal-600 transition-colors shadow-sm"
          >
            <Upload className="h-5 w-5" />
          </button>

          {/* Zoom In */}
          <button
            onClick={handleZoomIn}
            title="Zoom In"
            className="w-11 h-11 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-teal-600 transition-colors shadow-sm"
          >
            <ZoomIn className="h-5 w-5" />
          </button>

          {/* Zoom Out */}
          <button
            onClick={handleZoomOut}
            title="Zoom Out"
            className="w-11 h-11 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-teal-600 transition-colors shadow-sm"
          >
            <ZoomOut className="h-5 w-5" />
          </button>

          {/* Rotate */}
          <button
            onClick={handleRotate}
            title="Rotate"
            className="w-11 h-11 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-teal-600 transition-colors shadow-sm"
          >
            <RotateCw className="h-5 w-5" />
          </button>

          {/* Add Text */}
          <button
            onClick={handleAddText}
            title="Add Text"
            className="w-11 h-11 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-teal-600 transition-colors shadow-sm"
          >
            <Type className="h-5 w-5" />
          </button>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
      </div>
    </div>
  );
}
