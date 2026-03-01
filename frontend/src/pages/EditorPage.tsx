import React, { useState, useRef, useEffect } from 'react';
import { Upload, Download, RotateCcw, ZoomIn, ZoomOut, Move } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGetAllTemplates, useAddToCart } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { toast } from 'sonner';
import type { ProductInfo, Template } from '../backend';

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

interface EditorState {
  uploadedImage: string | null;
  zoom: number;
  offsetX: number;
  offsetY: number;
  isDragging: boolean;
  dragStartX: number;
  dragStartY: number;
}

export default function EditorPage() {
  const { identity } = useInternetIdentity();
  const { data: templates } = useGetAllTemplates();
  const addToCart = useAddToCart();

  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [editorState, setEditorState] = useState<EditorState>({
    uploadedImage: null,
    zoom: 1,
    offsetX: 0,
    offsetY: 0,
    isDragging: false,
    dragStartX: 0,
    dragStartY: 0,
  });
  const [selectedSize, setSelectedSize] = useState(DEMO_PRODUCT.sizeOptions[0]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const displayProduct = DEMO_PRODUCT;

  useEffect(() => {
    renderCanvas();
  }, [editorState, selectedTemplate]);

  const renderCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw uploaded image
    if (editorState.uploadedImage) {
      const img = new Image();
      img.onload = () => {
        ctx.save();
        ctx.translate(canvas.width / 2 + editorState.offsetX, canvas.height / 2 + editorState.offsetY);
        ctx.scale(editorState.zoom, editorState.zoom);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        ctx.restore();

        // Draw template overlay
        if (selectedTemplate?.imageData) {
          const templateImg = new Image();
          templateImg.onload = () => {
            ctx.drawImage(templateImg, 0, 0, canvas.width, canvas.height);
          };
          templateImg.src = selectedTemplate.imageData;
        }
      };
      img.src = editorState.uploadedImage;
    } else {
      // Placeholder
      ctx.fillStyle = '#e0e0e0';
      ctx.fillRect(50, 50, canvas.width - 100, canvas.height - 100);
      ctx.fillStyle = '#999';
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Upload a photo to get started', canvas.width / 2, canvas.height / 2);

      if (selectedTemplate?.imageData) {
        const templateImg = new Image();
        templateImg.onload = () => {
          ctx.drawImage(templateImg, 0, 0, canvas.width, canvas.height);
        };
        templateImg.src = selectedTemplate.imageData;
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setEditorState((prev) => ({ ...prev, uploadedImage: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setEditorState((prev) => ({
      ...prev,
      isDragging: true,
      dragStartX: e.clientX - prev.offsetX,
      dragStartY: e.clientY - prev.offsetY,
    }));
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!editorState.isDragging) return;
    setEditorState((prev) => ({
      ...prev,
      offsetX: e.clientX - prev.dragStartX,
      offsetY: e.clientY - prev.dragStartY,
    }));
  };

  const handleMouseUp = () => {
    setEditorState((prev) => ({ ...prev, isDragging: false }));
  };

  const handleZoom = (delta: number) => {
    setEditorState((prev) => ({
      ...prev,
      zoom: Math.max(0.5, Math.min(3, prev.zoom + delta)),
    }));
  };

  const handleReset = () => {
    setEditorState((prev) => ({ ...prev, zoom: 1, offsetX: 0, offsetY: 0 }));
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'custom-photo.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const handleAddToCart = async () => {
    if (!identity) {
      toast.error('Please login to add items to cart');
      return;
    }
    try {
      const canvas = canvasRef.current;
      const customImageData = canvas ? canvas.toDataURL() : '';
      await addToCart.mutateAsync({
        product: displayProduct,
        quantity: BigInt(1),
        selectedSize,
        customImageData,
      });
      toast.success('Added to cart!');
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-foreground font-display mb-6">Photo Editor</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Templates Panel */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-card rounded-2xl border border-border p-4">
            <h2 className="font-semibold text-foreground mb-3">Templates</h2>
            {!templates || templates.length === 0 ? (
              <p className="text-xs text-muted-foreground">No templates available</p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-colors ${
                      selectedTemplate?.id === template.id ? 'border-primary' : 'border-border'
                    }`}
                  >
                    {template.previewData || template.imageData ? (
                      <img
                        src={template.previewData || template.imageData}
                        alt={template.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-secondary flex items-center justify-center">
                        <span className="text-xs text-muted-foreground text-center px-1">{template.name}</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Size Selection */}
          <div className="bg-card rounded-2xl border border-border p-4">
            <h2 className="font-semibold text-foreground mb-3">Size</h2>
            <div className="space-y-2">
              {displayProduct.sizeOptions.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${
                    selectedSize === size
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-foreground hover:bg-secondary/70'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-card rounded-2xl border border-border p-4">
            <canvas
              ref={canvasRef}
              width={500}
              height={500}
              className="w-full rounded-xl cursor-move bg-secondary"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />
          </div>

          {/* Controls */}
          <div className="bg-card rounded-2xl border border-border p-4">
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl gap-2"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-3.5 w-3.5" />
                Upload Photo
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              <Button variant="outline" size="sm" className="rounded-xl" onClick={() => handleZoom(0.1)}>
                <ZoomIn className="h-3.5 w-3.5" />
              </Button>
              <Button variant="outline" size="sm" className="rounded-xl" onClick={() => handleZoom(-0.1)}>
                <ZoomOut className="h-3.5 w-3.5" />
              </Button>
              <Button variant="outline" size="sm" className="rounded-xl" onClick={handleReset}>
                <RotateCcw className="h-3.5 w-3.5" />
              </Button>
              <Button variant="outline" size="sm" className="rounded-xl gap-2" onClick={handleDownload}>
                <Download className="h-3.5 w-3.5" />
                Download
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
              <Move className="h-3 w-3" />
              Drag to reposition your photo
            </p>
          </div>
        </div>

        {/* Product Info & Add to Cart */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-2xl border border-border p-4 sticky top-24 space-y-4">
            <div className="aspect-square rounded-xl overflow-hidden bg-secondary">
              <img
                src={displayProduct.imageData || displayProduct.templateImageData}
                alt={displayProduct.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">{displayProduct.name}</h2>
              <p className="text-sm text-muted-foreground mt-1">{displayProduct.description}</p>
              <p className="text-xl font-bold text-foreground mt-2">₹{displayProduct.price}</p>
              <p className="text-xs text-muted-foreground">Delivery: {displayProduct.deliveryTime}</p>
            </div>
            <Button
              className="w-full bg-primary text-primary-foreground hover:opacity-90 rounded-xl"
              onClick={handleAddToCart}
              disabled={addToCart.isPending}
            >
              {addToCart.isPending ? 'Adding...' : 'Add to Cart'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
