import { useNavigate, useParams } from "@tanstack/react-router";
import {
  AlignCenter,
  AlignCenterVertical,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Copy,
  Eye,
  EyeOff,
  HelpCircle,
  ImageIcon,
  Loader2,
  Lock,
  Maximize2,
  Minus,
  Palette,
  Plus,
  QrCode,
  RotateCcw,
  Shapes,
  Trash2,
  Type,
  Undo2,
  Upload,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { CartItem } from "../backend";
import { useGetCart, useGetProduct, useSaveCart } from "../hooks/useQueries";
import { getDemoProductById } from "../lib/demoProducts";

// ─── Circle magnet size definitions ────────────────────────────────────────────
const CIRCLE_MAGNET_SIZES = [
  { label: "Circle 1", desc: "(2.5 in dia)", canvasW: 300, canvasH: 300 },
  { label: "Circle 2", desc: "(3.5 in dia)", canvasW: 420, canvasH: 420 },
  { label: "Circle 3", desc: "(5 in dia)", canvasW: 480, canvasH: 480 },
];

interface ImageTransform {
  x: number;
  y: number;
  scale: number;
  rotation: number;
  opacity: number;
}

interface HandleDef {
  cursor: string;
  x: number; // fraction of width
  y: number; // fraction of height
  scaleX: number;
  scaleY: number;
}

const HANDLES: HandleDef[] = [
  { cursor: "nw-resize", x: 0, y: 0, scaleX: -1, scaleY: -1 },
  { cursor: "n-resize", x: 0.5, y: 0, scaleX: 0, scaleY: -1 },
  { cursor: "ne-resize", x: 1, y: 0, scaleX: 1, scaleY: -1 },
  { cursor: "e-resize", x: 1, y: 0.5, scaleX: 1, scaleY: 0 },
  { cursor: "se-resize", x: 1, y: 1, scaleX: 1, scaleY: 1 },
  { cursor: "s-resize", x: 0.5, y: 1, scaleX: 0, scaleY: 1 },
  { cursor: "sw-resize", x: 0, y: 1, scaleX: -1, scaleY: 1 },
  { cursor: "w-resize", x: 0, y: 0.5, scaleX: -1, scaleY: 0 },
];

export default function CircleMagnetEditorPage() {
  const navigate = useNavigate();
  const { productId } = useParams({
    from: "/layout/circle-magnet-editor/$productId",
  });
  const { data: backendProduct } = useGetProduct(productId);
  const { data: existingCart = [] } = useGetCart();
  const saveCart = useSaveCart();

  const product = backendProduct ?? getDemoProductById(productId);

  // ─── State ──────────────────────────────────────────────────────────────────
  const [selectedCircle, setSelectedCircle] = useState(0);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageTransform, setImageTransform] = useState<ImageTransform>({
    x: 0,
    y: 0,
    scale: 1,
    rotation: 0,
    opacity: 1,
  });
  const [isSelected, setIsSelected] = useState(false);
  const [bgColor, setBgColor] = useState<string | null>(null);
  const [layerVisible, setLayerVisible] = useState(true);
  const [isResizing, setIsResizing] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, imgX: 0, imgY: 0 });
  const [resizeStart, setResizeStart] = useState({
    x: 0,
    y: 0,
    scale: 1,
    imgX: 0,
    imgY: 0,
  });
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [_showColorPicker, setShowColorPicker] = useState(false);
  const [quantity] = useState(1);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const circle = CIRCLE_MAGNET_SIZES[selectedCircle];
  const { canvasW, canvasH } = circle;
  // Circle always uses 50% border radius
  const borderRadiusStyle = "50%";

  // ─── Compute rendered image size ────────────────────────────────────────────
  const [naturalSize, setNaturalSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    if (!uploadedImage) return;
    const img = new Image();
    img.onload = () =>
      setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
    img.src = uploadedImage;
  }, [uploadedImage]);

  const getRenderedImageSize = useCallback(() => {
    if (!naturalSize.w || !naturalSize.h) return { w: canvasW, h: canvasH };
    const imgAspect = naturalSize.w / naturalSize.h;
    const canvasAspect = canvasW / canvasH;
    let baseW: number;
    let baseH: number;
    if (imgAspect > canvasAspect) {
      // image wider — fit height
      baseH = canvasH;
      baseW = baseH * imgAspect;
    } else {
      // image taller — fit width
      baseW = canvasW;
      baseH = baseW / imgAspect;
    }
    return { w: baseW * imageTransform.scale, h: baseH * imageTransform.scale };
  }, [naturalSize, canvasW, canvasH, imageTransform.scale]);

  // ─── File upload ────────────────────────────────────────────────────────────
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result as string;
      setUploadedImage(src);
      setImageTransform({ x: 0, y: 0, scale: 1, rotation: 0, opacity: 1 });
      setIsSelected(true);
    };
    reader.readAsDataURL(file);
    // Reset input so same file can be re-selected
    e.target.value = "";
  };

  // ─── Canvas mouse/touch drag ─────────────────────────────────────────────────
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (!uploadedImage) return;
    e.preventDefault();
    setIsSelected(true);
    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      imgX: imageTransform.x,
      imgY: imageTransform.y,
    });
  };

  const handleCanvasMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging || isResizing !== null) return;
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      setImageTransform((prev) => ({
        ...prev,
        x: dragStart.imgX + dx,
        y: dragStart.imgY + dy,
      }));
    },
    [isDragging, isResizing, dragStart],
  );

  const handleCanvasMouseUp = () => {
    setIsDragging(false);
    setIsResizing(null);
  };

  // ─── Resize handles ──────────────────────────────────────────────────────────
  const handleResizeMouseDown = (e: React.MouseEvent, handleIdx: number) => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(handleIdx);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      scale: imageTransform.scale,
      imgX: imageTransform.x,
      imgY: imageTransform.y,
    });
  };

  const handleGlobalMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isResizing === null) return;
      const handle = HANDLES[isResizing];
      const dx = e.clientX - resizeStart.x;
      const dy = e.clientY - resizeStart.y;
      const delta =
        handle.scaleX !== 0 ? dx * handle.scaleX : dy * handle.scaleY;
      const newScale = Math.max(
        0.1,
        Math.min(5, resizeStart.scale + delta / 200),
      );
      setImageTransform((prev) => ({
        ...prev,
        scale: newScale,
      }));
    },
    [isResizing, resizeStart],
  );

  const handleGlobalMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(null);
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleGlobalMouseMove);
    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      window.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [handleGlobalMouseMove, handleGlobalMouseUp]);

  // ─── Touch support ──────────────────────────────────────────────────────────
  const handleCanvasTouchStart = (e: React.TouchEvent) => {
    if (!uploadedImage || e.touches.length !== 1) return;
    setIsSelected(true);
    setIsDragging(true);
    const t = e.touches[0];
    setDragStart({
      x: t.clientX,
      y: t.clientY,
      imgX: imageTransform.x,
      imgY: imageTransform.y,
    });
  };

  const handleCanvasTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    e.preventDefault();
    const t = e.touches[0];
    const dx = t.clientX - dragStart.x;
    const dy = t.clientY - dragStart.y;
    setImageTransform((prev) => ({
      ...prev,
      x: dragStart.imgX + dx,
      y: dragStart.imgY + dy,
    }));
  };

  // ─── Toolbar actions ─────────────────────────────────────────────────────────
  const handleRotate = () => {
    setImageTransform((prev) => ({
      ...prev,
      rotation: (prev.rotation + 90) % 360,
    }));
  };

  const handleAlignHCenter = () => {
    setImageTransform((prev) => ({ ...prev, x: 0 }));
  };

  const handleAlignVCenter = () => {
    setImageTransform((prev) => ({ ...prev, y: 0 }));
  };

  const handleDuplicate = () => {
    toast.success("Layer duplicated");
  };

  const handleDeleteImage = () => {
    setUploadedImage(null);
    setIsSelected(false);
    setImageTransform({ x: 0, y: 0, scale: 1, rotation: 0, opacity: 1 });
  };

  const handleZoomIn = () => setZoomLevel((z) => Math.min(z + 0.1, 2.5));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(z - 0.1, 0.3));
  const handleFitToScreen = () => setZoomLevel(1);

  // ─── Save & Proceed ──────────────────────────────────────────────────────────
  const handleSaveAndProceed = async () => {
    if (!uploadedImage) {
      toast.error("Please upload an image first");
      return;
    }
    if (!product) {
      toast.error("Product not found");
      return;
    }

    setIsSaving(true);
    try {
      // Draw onto offscreen canvas
      const offscreen = document.createElement("canvas");
      offscreen.width = canvasW;
      offscreen.height = canvasH;
      const ctx = offscreen.getContext("2d");
      if (!ctx) throw new Error("Canvas context unavailable");

      // Background — clipped to circle
      if (bgColor) {
        ctx.fillStyle = bgColor;
      } else {
        ctx.fillStyle = "#ffffff";
      }
      // Clip to circle
      ctx.beginPath();
      ctx.arc(canvasW / 2, canvasH / 2, canvasW / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.clip();

      // Draw image
      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = uploadedImage;
      });

      const { w: imgW, h: imgH } = getRenderedImageSize();
      const cx = canvasW / 2 + imageTransform.x;
      const cy = canvasH / 2 + imageTransform.y;

      ctx.save();
      ctx.globalAlpha = imageTransform.opacity;
      ctx.translate(cx, cy);
      ctx.rotate((imageTransform.rotation * Math.PI) / 180);
      ctx.drawImage(img, -imgW / 2, -imgH / 2, imgW, imgH);
      ctx.restore();

      const customImageData = offscreen.toDataURL("image/jpeg", 0.9);

      const sizeToUse =
        product.sizeOptions[selectedCircle] ??
        product.sizeOptions[0] ??
        `${circle.label} ${circle.desc}`;

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
        selectedSize: sizeToUse,
        customImageData,
      };

      const updatedCart = [...existingCart, newItem];
      await saveCart.mutateAsync(updatedCart);

      toast.success("Added to cart! Redirecting...");
      setTimeout(() => navigate({ to: "/cart" }), 800);
    } catch {
      toast.error("Failed to add to cart. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // ─── Rendered image bounds (for selection overlay) ───────────────────────────
  const { w: imgW, h: imgH } = getRenderedImageSize();
  const imgLeft = canvasW / 2 + imageTransform.x - imgW / 2;
  const imgTop = canvasH / 2 + imageTransform.y - imgH / 2;

  const priceNum = product ? Number(product.price) : 0;

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white select-none">
      {/* ── TOP BAR ────────────────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 bg-white z-10 flex-shrink-0"
        style={{ minHeight: 52 }}
      >
        {/* Left: back + title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            data-ocid="circle-magnet-editor.link"
            onClick={() =>
              navigate({
                to: "/product/$productId",
                params: { productId },
                search: { category: undefined },
              })
            }
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-600"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-pink-600 flex items-center justify-center text-white text-xs font-bold">
              P
            </div>
            <span className="text-sm font-semibold text-gray-800">
              Circle Magnets
            </span>
          </div>
        </div>

        {/* Right: help, undo, save */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500"
            title="Help"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500"
            title="Undo"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            data-ocid="circle-magnet-editor.primary_button"
            onClick={handleSaveAndProceed}
            disabled={isSaving || !uploadedImage}
            className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white text-sm font-semibold rounded-md hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {isSaving ? "Saving..." : "Save design & Proceed →"}
          </button>
        </div>
      </div>

      {/* ── SIZE TABS ──────────────────────────────────────────────────── */}
      <div className="bg-gray-100 border-b border-gray-200 px-4 py-2 flex items-center gap-2 flex-shrink-0 overflow-x-auto">
        {CIRCLE_MAGNET_SIZES.map((m, i) => (
          <button
            type="button"
            key={m.label + m.desc}
            data-ocid={
              `circle-magnet-editor.tab.${i + 1}` as `circle-magnet-editor.tab.${number}`
            }
            onClick={() => setSelectedCircle(i)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
              selectedCircle === i
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:border-gray-400"
            }`}
          >
            {m.label} {m.desc}
          </button>
        ))}
        {product && (
          <span className="ml-auto text-xs text-gray-500 flex-shrink-0">
            ₹{priceNum.toLocaleString()}
          </span>
        )}
      </div>

      {/* ── MAIN AREA ──────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Canvas Area */}
        <div
          role="presentation"
          className="flex-1 flex items-center justify-center overflow-hidden relative"
          style={{ background: "#f0f0f0" }}
          onClick={(e) => {
            // Deselect when clicking outside canvas
            if (e.target === e.currentTarget) setIsSelected(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") setIsSelected(false);
          }}
        >
          {/* Canvas wrapper with zoom */}
          <div
            style={{
              transform: `scale(${zoomLevel})`,
              transformOrigin: "center center",
              position: "relative",
            }}
            className="transition-transform duration-150"
          >
            {/* Outer dashed border — also circular */}
            <div
              style={{
                position: "absolute",
                inset: -8,
                border: "2px dashed #444",
                borderRadius: "50%",
                pointerEvents: "none",
                zIndex: 1,
              }}
            />

            {/* Canvas clip container — CIRCLE shape */}
            <div
              ref={canvasRef}
              data-ocid="circle-magnet-editor.canvas_target"
              style={{
                width: canvasW,
                height: canvasH,
                borderRadius: borderRadiusStyle,
                border: "1.5px solid #e8a0c0",
                background: bgColor ?? "#ffffff",
                position: "relative",
                overflow: "hidden",
                cursor: isDragging
                  ? "grabbing"
                  : uploadedImage
                    ? "grab"
                    : "default",
                boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
              }}
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
              onMouseLeave={handleCanvasMouseUp}
              onTouchStart={handleCanvasTouchStart}
              onTouchMove={handleCanvasTouchMove}
              onTouchEnd={handleCanvasMouseUp}
            >
              {/* Uploaded image */}
              {uploadedImage && layerVisible && (
                <>
                  <img
                    src={uploadedImage}
                    alt="Uploaded"
                    draggable={false}
                    style={{
                      position: "absolute",
                      left: imgLeft,
                      top: imgTop,
                      width: imgW,
                      height: imgH,
                      transform: `rotate(${imageTransform.rotation}deg)`,
                      transformOrigin: "center center",
                      opacity: imageTransform.opacity,
                      pointerEvents: "none",
                      userSelect: "none",
                      objectFit: "fill",
                    }}
                  />

                  {/* Blue selection overlay + handles */}
                  {isSelected && (
                    <div
                      style={{
                        position: "absolute",
                        left: imgLeft,
                        top: imgTop,
                        width: imgW,
                        height: imgH,
                        border: "2px dashed #ec4899",
                        transform: `rotate(${imageTransform.rotation}deg)`,
                        transformOrigin: "center center",
                        pointerEvents: "none",
                      }}
                    >
                      {/* Corner & edge resize handles */}
                      {HANDLES.map((handle, i) => (
                        <div
                          key={handle.cursor}
                          onMouseDown={(e) => handleResizeMouseDown(e, i)}
                          style={{
                            position: "absolute",
                            width: 10,
                            height: 10,
                            background: "#ec4899",
                            border: "2px solid white",
                            borderRadius: 2,
                            cursor: handle.cursor,
                            left: `${handle.x * 100}%`,
                            top: `${handle.y * 100}%`,
                            transform: "translate(-50%, -50%)",
                            pointerEvents: "all",
                            zIndex: 10,
                          }}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Empty state */}
              {!uploadedImage && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <button
                    type="button"
                    data-ocid="circle-magnet-editor.upload_button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center gap-2 px-6 py-4 rounded-xl border-2 border-dashed border-gray-300 hover:border-pink-400 hover:bg-pink-50 transition-colors text-gray-500 hover:text-pink-600"
                  >
                    <Upload className="w-8 h-8" />
                    <span className="text-sm font-medium">Select Photo</span>
                  </button>
                  <p className="text-xs text-gray-400">
                    Upload and drag to position
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Zoom controls — bottom-left of canvas area */}
          <div className="absolute bottom-4 left-4 flex flex-col gap-1 z-10">
            <button
              type="button"
              data-ocid="circle-magnet-editor.button"
              onClick={handleFitToScreen}
              title="Fit to screen"
              className="w-9 h-9 flex items-center justify-center bg-white border border-gray-200 rounded shadow-sm hover:bg-gray-50 transition-colors text-gray-600"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              data-ocid="circle-magnet-editor.zoom_in_button"
              onClick={handleZoomIn}
              title="Zoom in"
              className="w-9 h-9 flex items-center justify-center bg-white border border-gray-200 rounded shadow-sm hover:bg-gray-50 transition-colors text-gray-600"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              type="button"
              data-ocid="circle-magnet-editor.zoom_out_button"
              onClick={handleZoomOut}
              title="Zoom out"
              className="w-9 h-9 flex items-center justify-center bg-white border border-gray-200 rounded shadow-sm hover:bg-gray-50 transition-colors text-gray-600"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── RIGHT SIDEBAR ────────────────────────────────────────────── */}
        <div
          className="w-60 bg-white border-l border-gray-200 flex flex-col overflow-y-auto flex-shrink-0"
          style={{ fontSize: 13 }}
        >
          {uploadedImage ? (
            /* ── Image Panel (after upload) ─────────── */
            <div className="flex flex-col h-full">
              {/* Image panel header */}
              <div className="flex items-center px-3 py-2.5 border-b border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setUploadedImage(null);
                    setIsSelected(false);
                  }}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  Back
                </button>
                <span className="flex-1 text-center text-xs font-semibold text-gray-700">
                  Image
                </span>
                <div className="flex gap-0.5">
                  <button
                    type="button"
                    className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-600"
                  >
                    <ChevronLeft className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-600"
                  >
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Thumbnail + badge — circle preview */}
              <div className="px-3 py-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-14 h-14 rounded-full overflow-hidden border border-gray-200 flex-shrink-0">
                    <img
                      src={uploadedImage}
                      alt="Uploaded"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-pink-100 text-pink-700 uppercase">
                      JPG
                    </span>
                    <span className="text-xs text-gray-400">Your photo</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="px-3 py-3 space-y-2 border-b border-gray-100">
                <button
                  type="button"
                  data-ocid="circle-magnet-editor.toggle"
                  onClick={handleRotate}
                  className="w-full flex items-center gap-2.5 px-3 py-2 border border-gray-200 rounded-md hover:bg-gray-50 text-gray-700 transition-colors text-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-gray-500" />
                  rotate
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setImageTransform((prev) => ({
                      ...prev,
                      scale: prev.scale < 1.5 ? prev.scale + 0.25 : 1,
                    }));
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 border border-gray-200 rounded-md hover:bg-gray-50 text-gray-700 transition-colors text-xs"
                >
                  <Minus className="w-3.5 h-3.5 text-gray-500" />
                  resize
                </button>
                <button
                  type="button"
                  data-ocid="circle-magnet-editor.upload_button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center gap-2.5 px-3 py-2 border border-gray-200 rounded-md hover:bg-gray-50 text-gray-700 transition-colors text-xs"
                >
                  <Upload className="w-3.5 h-3.5 text-gray-500" />
                  replace image
                </button>
                {/* Opacity slider */}
                <div className="flex items-center gap-2.5 px-3 py-2 border border-gray-200 rounded-md">
                  <Palette className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-600">opacity</span>
                      <span className="text-xs text-gray-400">
                        {Math.round(imageTransform.opacity * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.01}
                      value={imageTransform.opacity}
                      onChange={(e) =>
                        setImageTransform((prev) => ({
                          ...prev,
                          opacity: Number(e.target.value),
                        }))
                      }
                      className="w-full h-1 accent-pink-600"
                    />
                  </div>
                </div>
              </div>

              {/* Layers section */}
              <div className="px-3 py-3 border-b border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Layers
                </p>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex-1 flex items-center gap-2 px-2 py-1.5 rounded border border-gray-200 bg-gray-50">
                    <ImageIcon className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-xs text-gray-600 truncate">
                      Photo Layer
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setLayerVisible((v) => !v)}
                    className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-600 border border-gray-200 rounded"
                    title={layerVisible ? "Hide layer" : "Show layer"}
                  >
                    {layerVisible ? (
                      <Eye className="w-3.5 h-3.5" />
                    ) : (
                      <EyeOff className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    data-ocid="circle-magnet-editor.secondary_button"
                    onClick={handleDuplicate}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 border border-gray-200 rounded-md hover:bg-gray-50 text-gray-600 transition-colors text-xs"
                    title="Duplicate layer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Duplicate
                  </button>
                  <button
                    type="button"
                    data-ocid="circle-magnet-editor.delete_button"
                    onClick={handleDeleteImage}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 border border-red-200 rounded-md hover:bg-red-50 text-red-500 transition-colors text-xs"
                    title="Delete image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
                <button
                  type="button"
                  className="mt-2 w-full flex items-center justify-center gap-1.5 py-1.5 border border-gray-200 rounded-md hover:bg-gray-50 text-gray-600 transition-colors text-xs"
                >
                  <Lock className="w-3.5 h-3.5" />
                  Lock
                </button>
              </div>

              {/* Align section */}
              <div className="px-3 py-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Align with document
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    data-ocid="circle-magnet-editor.toggle"
                    onClick={handleAlignHCenter}
                    title="Center horizontally"
                    className="flex-1 flex items-center justify-center py-2 border border-gray-200 rounded-md hover:bg-gray-50 text-gray-600 transition-colors"
                  >
                    <AlignCenter className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    data-ocid="circle-magnet-editor.toggle"
                    onClick={handleAlignVCenter}
                    title="Center vertically"
                    className="flex-1 flex items-center justify-center py-2 border border-gray-200 rounded-md hover:bg-gray-50 text-gray-600 transition-colors"
                  >
                    <AlignCenterVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Scale controls at bottom */}
              <div className="px-3 py-3 border-t border-gray-100 mt-auto">
                <p className="text-xs text-gray-400 text-center mb-2">
                  Drag image to reposition
                </p>
                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setImageTransform((prev) => ({
                        ...prev,
                        scale: Math.max(0.1, prev.scale - 0.1),
                      }))
                    }
                    className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-md hover:bg-gray-50 text-gray-600"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs text-gray-500 w-12 text-center">
                    {Math.round(imageTransform.scale * 100)}%
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setImageTransform((prev) => ({
                        ...prev,
                        scale: Math.min(5, prev.scale + 0.1),
                      }))
                    }
                    className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-md hover:bg-gray-50 text-gray-600"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* ── Default Sidebar (before upload) ─────── */
            <div className="p-3 space-y-4">
              {/* Background Color */}
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-1.5">
                  Background Color
                </p>
                {bgColor ? (
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-full border border-gray-200 flex-shrink-0"
                      style={{ background: bgColor }}
                    />
                    <button
                      type="button"
                      onClick={() => colorInputRef.current?.click()}
                      className="text-xs text-pink-600 hover:underline font-medium"
                    >
                      Change Color
                    </button>
                    <button
                      type="button"
                      onClick={() => setBgColor(null)}
                      className="text-xs text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      — Not set yet —
                    </span>
                    <button
                      type="button"
                      data-ocid="circle-magnet-editor.toggle"
                      onClick={() => {
                        setShowColorPicker(true);
                        colorInputRef.current?.click();
                      }}
                      className="text-xs text-pink-600 hover:underline font-medium"
                    >
                      Pick Color
                    </button>
                  </div>
                )}
                <input
                  ref={colorInputRef}
                  type="color"
                  value={bgColor ?? "#ffffff"}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="sr-only"
                />
              </div>

              <div className="border-t border-gray-100" />

              {/* Add section */}
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-2">Add</p>

                {/* Upload Image button */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  data-ocid="circle-magnet-editor.upload_button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 border border-gray-200 rounded-md hover:bg-gray-50 text-gray-700 transition-colors mb-2 text-xs"
                >
                  <ImageIcon className="w-4 h-4 text-gray-400" />
                  Upload Image
                </button>

                {/* Grid of add buttons */}
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { icon: Type, label: "Text" },
                    { icon: AlignCenter, label: "Paragraph" },
                    { icon: ImageIcon, label: "Logo" },
                    { icon: Shapes, label: "Shapes" },
                    { icon: Loader2, label: "Clipart" },
                    { icon: QrCode, label: "QR Code" },
                  ].map(({ icon: Icon, label }) => (
                    <button
                      type="button"
                      key={label}
                      title={label}
                      className="flex flex-col items-center gap-1 py-2.5 border border-gray-200 rounded-md hover:bg-gray-50 text-gray-600 transition-colors text-xs"
                    >
                      <Icon className="w-4 h-4 text-gray-400" />
                      <span className="text-[10px]">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100" />

              {/* Design Templates */}
              <button
                type="button"
                className="w-full flex items-center gap-2.5 px-3 py-2.5 border border-gray-200 rounded-md hover:bg-gray-50 text-gray-700 transition-colors text-xs"
              >
                <Shapes className="w-4 h-4 text-gray-400" />
                Design Templates
              </button>

              {/* Tip */}
              <div className="bg-pink-50 border border-pink-100 rounded-md p-2.5">
                <p className="text-xs text-pink-700 font-medium mb-1">💡 Tip</p>
                <p className="text-xs text-pink-600 leading-relaxed">
                  Upload a high-res photo for the best circle magnet print
                  quality (300 DPI recommended).
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hidden file input (always mounted when image is loaded) */}
      {uploadedImage && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      )}
    </div>
  );
}
