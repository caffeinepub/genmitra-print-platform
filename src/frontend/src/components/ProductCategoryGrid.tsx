import { useNavigate } from "@tanstack/react-router";
import {
  Briefcase,
  Camera,
  ChevronRight,
  Coffee,
  Frame,
  Magnet,
} from "lucide-react";
import { useGetProducts } from "../hooks/useQueries";
import { demoProducts, getDemoProductsByCategory } from "../lib/demoProducts";
import { getImageSrc } from "../utils/imageHelpers";

const categories = [
  {
    name: "Photo Prints",
    icon: Camera,
    color: "bg-blue-50 text-blue-600",
    border: "border-blue-200",
    hover: "hover:bg-blue-100",
    subtitle: "High quality prints",
    demoProductId: "demo-photo-print-1",
  },
  {
    name: "Photo Frames",
    icon: Frame,
    color: "bg-purple-50 text-purple-600",
    border: "border-purple-200",
    hover: "hover:bg-purple-100",
    subtitle: "Beautiful frames",
    demoProductId: "demo-photo-frame-1",
  },
  {
    name: "Photo Magnets",
    icon: Magnet,
    color: "bg-green-50 text-green-600",
    border: "border-green-200",
    hover: "hover:bg-green-100",
    subtitle: "Fridge magnets",
    demoProductId: "demo-photo-magnet-1",
  },
  {
    name: "Mugs",
    icon: Coffee,
    color: "bg-orange-50 text-orange-600",
    border: "border-orange-200",
    hover: "hover:bg-orange-100",
    subtitle: "Custom mugs",
    demoProductId: "demo-mug-1",
  },
  {
    name: "Corporate Gifts",
    icon: Briefcase,
    color: "bg-red-50 text-red-600",
    border: "border-red-200",
    hover: "hover:bg-red-100",
    subtitle: "Bulk orders",
    demoProductId: "demo-corporate-gift-1",
  },
  {
    name: "Acrylic Magnets",
    icon: Magnet,
    color: "bg-pink-50 text-pink-600",
    border: "border-pink-200",
    hover: "hover:bg-pink-100",
    subtitle: "Acrylic photo magnets",
    demoProductId: "demo-acrylic-fridge-magnet-1",
  },
];

export default function ProductCategoryGrid() {
  const navigate = useNavigate();
  const { data: backendProducts } = useGetProducts();

  const allProducts =
    backendProducts && backendProducts.length > 0
      ? backendProducts
      : demoProducts;

  return (
    <section className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs font-bold text-[#2874f0] uppercase tracking-widest">
          COLLECTIONS
        </span>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Shop by Category
      </h2>
      <div
        data-ocid="categories.list"
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-4"
      >
        {categories.map((cat, catIndex) => {
          const Icon = cat.icon;

          // Get first product from backend for this category, else fall back to demoProducts
          const catProducts = allProducts.filter(
            (p) => p.category === cat.name,
          );
          const featuredProduct =
            catProducts.length > 0
              ? catProducts[0]
              : getDemoProductsByCategory(cat.name)[0];

          const imgSrc = featuredProduct
            ? getImageSrc(featuredProduct.imageData)
            : null;

          return (
            <div
              key={cat.name}
              data-ocid={`categories.item.${catIndex + 1}`}
              className="flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden shadow-card hover:shadow-card-hover transition-all group"
            >
              {/* Category header button */}
              <button
                type="button"
                data-ocid={`categories.tab.${catIndex + 1}`}
                onClick={() =>
                  navigate({
                    to: "/",
                    search: { category: cat.name, search: undefined },
                  })
                }
                className="flex flex-col items-center p-4 bg-white hover:bg-white transition-colors"
              >
                <div
                  className={`w-12 h-12 rounded-full ${cat.color} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-sm font-semibold text-gray-800 text-center">
                  {cat.name}
                </span>
                <span className="text-xs text-gray-500 mt-0.5 text-center">
                  {cat.subtitle}
                </span>
                <div className="flex items-center gap-1 mt-1 text-[#2874f0]">
                  <span className="text-xs font-medium">Browse all</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </button>

              {/* Demo product card */}
              {featuredProduct && (
                <button
                  type="button"
                  data-ocid={`categories.product_button.${catIndex + 1}`}
                  onClick={() =>
                    navigate({
                      to: "/product/$productId",
                      params: { productId: featuredProduct.id },
                      search: { category: undefined },
                    })
                  }
                  className="border-t border-gray-100 p-3 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                      <img
                        src={
                          imgSrc ||
                          "/assets/generated/photo-print-1.dim_600x600.png"
                        }
                        alt={featuredProduct.name}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          const img = e.target as HTMLImageElement;
                          if (
                            img.src !==
                            `${window.location.origin}/assets/generated/photo-print-1.dim_600x600.png`
                          ) {
                            img.src =
                              "/assets/generated/photo-print-1.dim_600x600.png";
                          }
                        }}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-gray-800 line-clamp-2 leading-tight">
                        {featuredProduct.name}
                      </p>
                      <p className="text-xs font-bold text-[#2874f0] mt-0.5">
                        ₹{Number(featuredProduct.price).toLocaleString()}
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
