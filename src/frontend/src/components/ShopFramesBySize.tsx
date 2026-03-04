import { useNavigate } from "@tanstack/react-router";
import { useGetProducts } from "../hooks/useQueries";
import { demoProducts } from "../lib/demoProducts";
import { getImageSrc } from "../utils/imageHelpers";

const frameSizes = [
  {
    size: "4×6",
    label: "4×6 inch",
    subtitle: "Wallet Size",
    img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&h=300&fit=crop",
    fallback: "/assets/generated/frame-size-4x6.dim_400x500.png",
    productId: "demo-photo-frame-1",
    aspectClass: "aspect-[2/3]",
  },
  {
    size: "5×7",
    label: "5×7 inch",
    subtitle: "Standard",
    img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=250&h=350&fit=crop",
    fallback: "/assets/generated/frame-size-6x8.dim_400x500.png",
    productId: "demo-photo-frame-2",
    aspectClass: "aspect-[5/7]",
  },
  {
    size: "8×10",
    label: "8×10 inch",
    subtitle: "Popular",
    img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=320&h=400&fit=crop",
    fallback: "/assets/generated/frame-size-9x12.dim_400x500.png",
    productId: "demo-photo-frame-1",
    aspectClass: "aspect-[4/5]",
  },
  {
    size: "11×14",
    label: "11×14 inch",
    subtitle: "Large",
    img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=330&h=420&fit=crop",
    fallback: "/assets/generated/frame-size-12x12.dim_400x500.png",
    productId: "demo-photo-frame-2",
    aspectClass: "aspect-[11/14]",
  },
  {
    size: "16×20",
    label: "16×20 inch",
    subtitle: "Extra Large",
    img: "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=400&h=500&fit=crop",
    fallback: "/assets/generated/frame-size-12x18.dim_400x500.png",
    productId: "demo-photo-frame-1",
    aspectClass: "aspect-[4/5]",
  },
  {
    size: "20×24",
    label: "20×24 inch",
    subtitle: "Gallery",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=480&fit=crop",
    fallback: "/assets/generated/frame-size-20x24.dim_400x500.png",
    productId: "demo-photo-frame-2",
    aspectClass: "aspect-[5/6]",
  },
];

export default function ShopFramesBySize() {
  const navigate = useNavigate();
  const { data: backendProducts } = useGetProducts();

  const allProducts =
    backendProducts && backendProducts.length > 0
      ? backendProducts
      : demoProducts;

  // Get frame products from backend/demo
  const frameProducts = allProducts.filter(
    (p) => p.category === "Photo Frames",
  );

  const getFrameProduct = (productId: string) => {
    // Try backend first, then fall back to demo
    return (
      allProducts.find((p) => p.id === productId) ||
      demoProducts.find((p) => p.id === productId) ||
      frameProducts[0] ||
      demoProducts.find((p) => p.category === "Photo Frames")
    );
  };

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-1">
        Shop Frames by Size
      </h2>
      <p className="text-gray-500 text-sm mb-4">
        Find the perfect frame for your space
      </p>
      <div
        data-ocid="frame-sizes.list"
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4"
      >
        {frameSizes.map((frame, index) => {
          const product = getFrameProduct(frame.productId);
          const productImgSrc = product ? getImageSrc(product.imageData) : null;

          return (
            <div
              key={frame.size}
              data-ocid={`frame-sizes.item.${index + 1}`}
              className="flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden shadow-card hover:shadow-card-hover hover:border-[#2874f0] transition-all group"
            >
              {/* Size header */}
              <button
                type="button"
                data-ocid={`frame-sizes.button.${index + 1}`}
                onClick={() =>
                  navigate({
                    to: "/",
                    search: { category: "Photo Frames", search: undefined },
                  })
                }
                className="flex flex-col items-center p-3 hover:bg-blue-50 transition-colors"
              >
                {/* Frame preview with photo inside */}
                <div
                  className={`w-full ${frame.aspectClass} relative overflow-hidden rounded-lg mb-2 bg-gray-100 border-4 border-gray-700 shadow-md group-hover:border-[#2874f0] transition-colors`}
                >
                  <img
                    src={frame.img}
                    alt={`${frame.label} frame`}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (target.src !== frame.fallback) {
                        target.src = frame.fallback;
                      }
                    }}
                  />
                  {/* Frame size badge overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-2 py-1.5">
                    <span className="text-white text-xs font-bold drop-shadow">
                      {frame.size}"
                    </span>
                  </div>
                </div>
                <span className="text-sm font-bold text-gray-800">
                  {frame.size}
                </span>
                <span className="text-xs text-[#2874f0] font-medium">
                  {frame.subtitle}
                </span>
              </button>

              {/* Demo product */}
              {product && (
                <button
                  type="button"
                  data-ocid={`frame-sizes.product_button.${index + 1}`}
                  onClick={() =>
                    navigate({
                      to: "/product/$productId",
                      params: { productId: product.id },
                      search: { category: undefined },
                    })
                  }
                  className="border-t border-gray-100 p-2.5 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded overflow-hidden bg-gray-50 flex-shrink-0">
                      <img
                        src={
                          productImgSrc ||
                          "/assets/generated/photo-frame-1.dim_600x600.png"
                        }
                        alt={product.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-gray-700 line-clamp-1">
                        {product.name}
                      </p>
                      <p className="text-xs font-bold text-[#2874f0]">
                        ₹{Number(product.price).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
