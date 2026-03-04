import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ChevronDown,
  Loader2,
  RotateCcw,
  Save,
  Trash2,
  Undo2,
  Upload,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { CartItem } from "../backend";
import FrameStyleDropdown from "../components/FrameStyleDropdown";
import { useGetCart, useGetProduct, useSaveCart } from "../hooks/useQueries";
import { getDemoProductById } from "../lib/demoProducts";

const SIZE_OPTIONS = [
  { label: "A4 (8.3 × 11.7 in)", value: "A4", width: 595, height: 842 },
  { label: "A3 (11.7 × 16.5 in)", value: "A3", width: 842, height: 1191 },
  { label: "A2 (16.5 × 23.4 in)", value: "A2", width: 1191, height: 1684 },
  { label: "4×6 inch", value: "4x6", width: 400, height: 600 },
  { label: "5×7 inch", value: "5x7", width: 500, height: 700 },
  { label: "8×10 inch", value: "8x10", width: 800, height: 1000 },
  { label: "12×12 inch", value: "12x12", width: 1200, height: 1200 },
];

interface ImageState {
  src: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export default function EditorPage() {
  const navigate = useNavigate();
  const { productId } = useParams({ from: "/layout/editor/$productId" });
  const { data: backendProduct } = useGetProduct(productId);
  const { data: existingCart = [] } = useGetCart();
  const saveCart = useSaveCart();

  const product = backendProduct ?? getDemoProductById(productId);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [orientation, setOrientation] = useState<"portrait" | "landscape">(
    "portrait",
  );
  const [selectedSize, setSelectedSize] = useState("A4");
  const [quantity, setQuantity] = useState(1);
  const [frameStyle, setFrameStyle] = useState("Plain Black");
  const [imageState, setImageState] = useState<ImageState | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [history, setHistory] = useState<(ImageState | null)[]>([null]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [showSizeDropdown, setShowSizeDropdown] = useState(false);

  const FRAME_W = 340;
  const FRAME_H = orientation === "portrait" ? 440 : 300;

  const pushHistory = useCallback(
    (state: ImageState | null) => {
      setHistory((prev) => {
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push(state);
        return newHistory;
      });
      setHistoryIndex((prev) => prev + 1);
    },
    [historyIndex],
  );

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = FRAME_W;
    canvas.height = FRAME_H;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, FRAME_W, FRAME_H);

    if (imageState) {
      const img = new Image();
      img.onload = () => {
        ctx.save();
        ctx.translate(FRAME_W / 2 + imageState.x, FRAME_H / 2 + imageState.y);
        ctx.rotate((imageState.rotation * Math.PI) / 180);

        const imgAspect = img.naturalWidth / img.naturalHeight;
        const frameAspect = FRAME_W / FRAME_H;

        let drawW: number;
        let drawH: number;

        if (imgAspect > frameAspect) {
          drawW = FRAME_W * imageState.scale;
          drawH = drawW / imgAspect;
        } else {
          drawH = FRAME_H * imageState.scale;
          drawW = drawH * imgAspect;
        }

        ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
        ctx.restore();
      };
      img.src = imageState.src;
    }
  }, [imageState, FRAME_H]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result as string;
      const newState: ImageState = { src, x: 0, y: 0, scale: 0.9, rotation: 0 };
      setImageState(newState);
      pushHistory(newState);
    };
    reader.readAsDataURL(file);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!imageState) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - imageState.x, y: e.clientY - imageState.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !imageState) return;
    const newState = {
      ...imageState,
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    };
    setImageState(newState);
  };

  const handleMouseUp = () => {
    if (isDragging && imageState) pushHistory(imageState);
    setIsDragging(false);
  };

  const handleZoomIn = () => {
    if (!imageState) return;
    const newState = {
      ...imageState,
      scale: Math.min(imageState.scale + 0.1, 3),
    };
    setImageState(newState);
    pushHistory(newState);
  };

  const handleZoomOut = () => {
    if (!imageState) return;
    const newState = {
      ...imageState,
      scale: Math.max(imageState.scale - 0.1, 0.1),
    };
    setImageState(newState);
    pushHistory(newState);
  };

  const handleRotate = () => {
    if (!imageState) return;
    const newState = {
      ...imageState,
      rotation: (imageState.rotation + 90) % 360,
    };
    setImageState(newState);
    pushHistory(newState);
  };

  const handleDelete = () => {
    setImageState(null);
    pushHistory(null);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setImageState(history[newIndex]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setImageState(history[newIndex]);
    }
  };

  const handleSaveAndAddToCart = async () => {
    if (!imageState) {
      toast.error("Please upload an image first");
      return;
    }
    if (!product) {
      toast.error("Product not found");
      return;
    }

    setIsSaving(true);
    try {
      const canvas = canvasRef.current;
      let customImageData = "";
      if (canvas) {
        customImageData = canvas.toDataURL("image/jpeg", 0.85);
      }

      const newItem: CartItem = {
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          description: product.description,
          sizeOptions: product.sizeOptions,
          imageData: product.imageData,
          templateImageData: product.templateImageData,
          deliveryTime: product.deliveryTime,
          category: product.category,
          dpiSettings: product.dpiSettings,
        },
        quantity: BigInt(quantity),
        selectedSize,
        customImageData,
      };

      const updatedCart = [...existingCart, newItem];
      await saveCart.mutateAsync(updatedCart);

      toast.success("Added to cart! Redirecting...");
      setTimeout(() => {
        navigate({ to: "/cart" });
      }, 800);
    } catch {
      toast.error("Failed to add to cart. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const priceNum = product ? Number(product.price) : 0;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() =>
              navigate({
                to: "/product/$productId",
                params: { productId },
                search: { category: undefined },
              })
            }
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← Back
          </button>
          <span className="text-gray-300">|</span>
          <h1 className="text-sm font-semibold text-gray-700 truncate max-w-xs">
            {product?.name ?? "Photo Editor"}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Orientation Toggle */}
          <div className="flex bg-gray-100 rounded p-0.5">
            <button
              type="button"
              onClick={() => setOrientation("portrait")}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                orientation === "portrait"
                  ? "bg-white text-gray-800 shadow-sm"
                  : "text-gray-500"
              }`}
            >
              Portrait
            </button>
            <button
              type="button"
              onClick={() => setOrientation("landscape")}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                orientation === "landscape"
                  ? "bg-white text-gray-800 shadow-sm"
                  : "text-gray-500"
              }`}
            >
              Landscape
            </button>
          </div>

          {/* Save & Add to Cart */}
          <button
            type="button"
            onClick={handleSaveAndAddToCart}
            disabled={isSaving || !imageState}
            className="flex items-center gap-2 px-4 py-2 bg-[#2874f0] text-white text-sm font-semibold rounded hover:bg-[#1f5bb8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isSaving ? "Adding to Cart..." : "Save & Add to Cart ✓"}
          </button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-64px)]">
        {/* Canvas Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 overflow-auto">
          {/* Frame */}
          <div
            ref={containerRef}
            className="relative bg-white"
            style={{
              width: FRAME_W,
              height: FRAME_H,
              border: "8px solid #1a1a1a",
              boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
              cursor: isDragging ? "grabbing" : imageState ? "grab" : "default",
              overflow: "hidden",
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <canvas
              ref={canvasRef}
              width={FRAME_W}
              height={FRAME_H}
              className="block"
              style={{ width: FRAME_W, height: FRAME_H }}
            />
            {!imageState && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 pointer-events-none">
                <Upload className="w-12 h-12 mb-3 opacity-40" />
                <p className="text-sm font-medium">No photo selected</p>
                <p className="text-xs mt-1 opacity-70">
                  Upload a photo to get started
                </p>
              </div>
            )}
          </div>

          {/* Size & Quantity below canvas */}
          <div className="mt-4 flex items-center gap-4 flex-wrap justify-center">
            {/* Size Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowSizeDropdown(!showSizeDropdown)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded text-sm font-medium text-gray-700 hover:border-[#2874f0] transition-colors"
              >
                Size: {selectedSize}
                <ChevronDown className="w-4 h-4" />
              </button>
              {showSizeDropdown && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-10 min-w-[200px]">
                  {SIZE_OPTIONS.map((opt) => (
                    <button
                      type="button"
                      key={opt.value}
                      onClick={() => {
                        setSelectedSize(opt.value);
                        setShowSizeDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-50 transition-colors ${
                        selectedSize === opt.value
                          ? "text-[#2874f0] font-semibold bg-blue-50"
                          : "text-gray-700"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-2 bg-white border border-gray-300 rounded px-3 py-1.5">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-[#2874f0] font-bold"
              >
                −
              </button>
              <span className="text-sm font-medium text-gray-700 w-6 text-center">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-[#2874f0] font-bold"
              >
                +
              </button>
            </div>

            {/* Price */}
            {product && (
              <div className="text-sm font-bold text-gray-800">
                Total: ₹{(priceNum * quantity).toLocaleString()}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-64 bg-white border-l border-gray-200 flex flex-col overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* Upload */}
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Photo
              </h3>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center gap-2 px-3 py-2.5 bg-[#2874f0] text-white text-sm font-medium rounded hover:bg-[#1f5bb8] transition-colors"
              >
                <Upload className="w-4 h-4" />
                Upload Photo
              </button>
            </div>

            {/* Frame Style */}
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Frame Style
              </h3>
              <FrameStyleDropdown value={frameStyle} onChange={setFrameStyle} />
            </div>

            {/* Adjustments */}
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Adjustments
              </h3>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={handleUndo}
                  disabled={historyIndex === 0}
                  className="flex flex-col items-center gap-1 p-2 rounded border border-gray-200 hover:border-[#2874f0] hover:text-[#2874f0] transition-colors disabled:opacity-40 text-gray-600"
                  title="Undo"
                >
                  <Undo2 className="w-4 h-4" />
                  <span className="text-xs">Undo</span>
                </button>
                <button
                  type="button"
                  onClick={handleRedo}
                  disabled={historyIndex === history.length - 1}
                  className="flex flex-col items-center gap-1 p-2 rounded border border-gray-200 hover:border-[#2874f0] hover:text-[#2874f0] transition-colors disabled:opacity-40 text-gray-600"
                  title="Redo"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="text-xs">Redo</span>
                </button>
                <button
                  type="button"
                  onClick={handleZoomIn}
                  disabled={!imageState}
                  className="flex flex-col items-center gap-1 p-2 rounded border border-gray-200 hover:border-[#2874f0] hover:text-[#2874f0] transition-colors disabled:opacity-40 text-gray-600"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                  <span className="text-xs">Zoom+</span>
                </button>
                <button
                  type="button"
                  onClick={handleZoomOut}
                  disabled={!imageState}
                  className="flex flex-col items-center gap-1 p-2 rounded border border-gray-200 hover:border-[#2874f0] hover:text-[#2874f0] transition-colors disabled:opacity-40 text-gray-600"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                  <span className="text-xs">Zoom−</span>
                </button>
                <button
                  type="button"
                  onClick={handleRotate}
                  disabled={!imageState}
                  className="flex flex-col items-center gap-1 p-2 rounded border border-gray-200 hover:border-[#2874f0] hover:text-[#2874f0] transition-colors disabled:opacity-40 text-gray-600"
                  title="Rotate 90°"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="text-xs">Rotate</span>
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={!imageState}
                  className="flex flex-col items-center gap-1 p-2 rounded border border-gray-200 hover:border-red-400 hover:text-red-500 transition-colors disabled:opacity-40 text-gray-600"
                  title="Delete Image"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="text-xs">Delete</span>
                </button>
              </div>
            </div>

            {/* Pro Tip */}
            <div className="bg-blue-50 border border-blue-200 rounded p-3">
              <p className="text-xs text-blue-700 font-semibold mb-1">
                💡 Pro Tip
              </p>
              <p className="text-xs text-blue-600">
                Upload a high-resolution photo for the best print quality. Drag
                to reposition your image within the frame.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
