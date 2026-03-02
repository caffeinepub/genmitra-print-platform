import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Upload,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Type,
  RectangleVertical,
  Monitor,
  Check,
  Trash2,
  Undo2,
  Redo2,
  Info,
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

const FRAME_STYLES = [
  'Plain Black',
  'Plain Brown',
  'Goldline Brown',
  'Gold Sash (Brown)',
  'Zigzag Brown',
];

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
  const [frameStyle, setFrameStyle] = useState('Plain Black');
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
  const frameWidth = orientation === 'portrait' ? 210 : 340;
  const frameHeight = orientation === 'portrait' ? 280 : 210;

  // Canvas dimensions (inner white area)
  const canvasWidth = frameWidth - 24;
  const canvasHeight = frameHeight - 24;

  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
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

  const handleDelete = () => {
    setImageState({ src: null, zoom: 1, offsetX: 0, offsetY: 0, rotation: 0 });
    setTextOverlay(null);
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
      style={{ backgroundColor: '#f0f2f5' }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {/* Top Bar */}
      <div className="w-full bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        {/* Orientation Toggle */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setOrientation('portrait')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all border ${
              orientation === 'portrait'
                ? 'bg-white text-gray-800 border-gray-300 shadow-sm'
                : 'bg-transparent text-gray-500 border-transparent hover:border-gray-200'
            }`}
          >
            <RectangleVertical className="h-4 w-4" />
            Portrait
          </button>
          <button
            onClick={() => setOrientation('landscape')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all border ${
              orientation === 'landscape'
                ? 'bg-white text-gray-800 border-gray-300 shadow-sm'
                : 'bg-transparent text-gray-500 border-transparent hover:border-gray-200'
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
          className="flex items-center gap-2 px-5 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-60"
        >
          {addToCart.isPending ? (
            <>
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              Save &amp; Select Size
              <Check className="h-4 w-4" />
            </>
          )}
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Canvas Area */}
        <div className="flex-1 flex items-center justify-center p-8">
          {/* Frame Mockup */}
          <div
            className="relative flex items-center justify-center transition-all duration-300"
            style={{
              width: frameWidth,
              height: frameHeight,
              backgroundColor: '#111111',
              borderRadius: 6,
              boxShadow: '0 12px 40px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.12)',
              padding: 12,
            }}
          >
            {/* Inner white area / canvas */}
            <div
              className="relative overflow-hidden bg-white"
              style={{
                width: canvasWidth,
                height: canvasHeight,
                borderRadius: 2,
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
                    className={`w-full h-full flex flex-col items-center justify-center gap-2 transition-colors ${
                      isDragOver ? 'bg-blue-50' : 'bg-white'
                    }`}
                  >
                    <Upload className="h-8 w-8 text-gray-300" strokeWidth={1.5} />
                    <p className="text-xs text-gray-400 mt-1">No photo selected</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div
          className="w-64 bg-white border-l border-gray-200 flex flex-col gap-0 overflow-y-auto"
          style={{ minWidth: 220 }}
        >
          {/* Upload Photo + Add Text */}
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 flex flex-col items-center gap-1 py-5 text-blue-600 hover:bg-blue-50 transition-colors text-xs font-medium"
            >
              <Upload className="h-5 w-5" strokeWidth={2} />
              Upload Photo
            </button>
            <div className="w-px bg-gray-100" />
            <button
              onClick={handleAddText}
              className="flex-1 flex flex-col items-center gap-1 py-5 text-blue-600 hover:bg-blue-50 transition-colors text-xs font-medium"
            >
              <Type className="h-5 w-5" strokeWidth={2} />
              Add Text
            </button>
          </div>

          {/* Adjustments */}
          <div className="px-4 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-800">Adjustments</span>
              <div className="flex items-center gap-1">
                <button
                  className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                  title="Undo"
                >
                  <Undo2 className="h-3.5 w-3.5" />
                </button>
                <button
                  className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                  title="Redo"
                >
                  <Redo2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Zoom In */}
              <button
                onClick={handleZoomIn}
                title="Zoom In"
                className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              {/* Zoom Out */}
              <button
                onClick={handleZoomOut}
                title="Zoom Out"
                className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              {/* Rotate */}
              <button
                onClick={handleRotate}
                title="Rotate"
                className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <RotateCw className="h-4 w-4" />
              </button>
              {/* Delete */}
              <button
                onClick={handleDelete}
                title="Delete"
                className="w-10 h-10 flex items-center justify-center rounded-full border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Frame Styles */}
          <div className="px-4 py-4 border-b border-gray-100">
            <label className="block text-sm font-semibold text-gray-800 mb-2">Frame Styles</label>
            <div className="relative">
              <select
                value={frameStyle}
                onChange={(e) => setFrameStyle(e.target.value)}
                className="w-full appearance-none border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
              >
                {FRAME_STYLES.map((style) => (
                  <option key={style} value={style}>
                    {style}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Pro Tip */}
          <div className="px-4 py-4">
            <div className="rounded-lg bg-blue-50 border border-blue-100 p-3">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Info className="h-4 w-4 text-blue-500 flex-shrink-0" />
                <span className="text-sm font-semibold text-blue-700">Pro Tip</span>
              </div>
              <p className="text-xs text-blue-600 leading-relaxed">
                Use high-quality images for the best printing results. You can drag and resize photos directly on the canvas.
              </p>
            </div>
          </div>
        </div>
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
  );
}
