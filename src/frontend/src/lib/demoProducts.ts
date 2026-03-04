import type { ProductInfo } from "../backend";

export const demoProducts: ProductInfo[] = [
  // Photo Prints
  {
    id: "demo-photo-print-1",
    name: "Classic Photo Print",
    price: BigInt(199),
    description:
      "High-quality photo prints on premium glossy paper. Perfect for framing or gifting.",
    sizeOptions: ["4x6 inch", "5x7 inch", "8x10 inch"],
    imageData: "/assets/generated/photo-print-1.dim_600x600.png",
    templateImageData: "/assets/generated/photo-print-demo-1.dim_400x400.png",
    deliveryTime: "3-5 business days",
    category: "Photo Prints",
    dpiSettings: BigInt(300),
  },
  {
    id: "demo-photo-print-2",
    name: "Matte Photo Print",
    price: BigInt(249),
    description:
      "Elegant matte finish photo prints that reduce glare and look stunning on any wall.",
    sizeOptions: ["4x6 inch", "5x7 inch", "8x10 inch", "11x14 inch"],
    imageData: "/assets/generated/photo-print-2.dim_600x600.png",
    templateImageData: "/assets/generated/photo-print-demo-2.dim_400x400.png",
    deliveryTime: "3-5 business days",
    category: "Photo Prints",
    dpiSettings: BigInt(300),
  },
  {
    id: "demo-photo-print-3",
    name: "Canvas Photo Print",
    price: BigInt(599),
    description:
      "Transform your photos into stunning canvas prints. Gallery-wrapped and ready to hang.",
    sizeOptions: ["8x10 inch", "11x14 inch", "16x20 inch"],
    imageData: "/assets/generated/photo-print-3.dim_600x600.png",
    templateImageData: "/assets/generated/photo-print-demo-1.dim_400x400.png",
    deliveryTime: "5-7 business days",
    category: "Photo Prints",
    dpiSettings: BigInt(300),
  },
  // Photo Frames
  {
    id: "demo-photo-frame-1",
    name: "Classic Black Frame",
    price: BigInt(499),
    description:
      "Elegant black wooden frame with UV-protective glass. Perfect for any photo.",
    sizeOptions: ["4x6 inch", "5x7 inch", "8x10 inch"],
    imageData: "/assets/generated/photo-frame-1.dim_600x600.png",
    templateImageData:
      "/assets/generated/demo-frame-photo-frame.dim_400x400.png",
    deliveryTime: "5-7 business days",
    category: "Photo Frames",
    dpiSettings: BigInt(300),
  },
  {
    id: "demo-photo-frame-2",
    name: "Rustic Brown Frame",
    price: BigInt(649),
    description:
      "Beautiful rustic brown wooden frame that adds warmth to any room.",
    sizeOptions: ["4x6 inch", "5x7 inch", "8x10 inch", "12x16 inch"],
    imageData: "/assets/generated/photo-frame-2.dim_600x600.png",
    templateImageData:
      "/assets/generated/demo-frame-photo-frame.dim_400x400.png",
    deliveryTime: "5-7 business days",
    category: "Photo Frames",
    dpiSettings: BigInt(300),
  },
  {
    id: "demo-photo-frame-3",
    name: "Gold Accent Frame",
    price: BigInt(799),
    description:
      "Luxurious gold accent frame that elevates any photograph to a work of art.",
    sizeOptions: ["5x7 inch", "8x10 inch", "12x16 inch"],
    imageData: "/assets/generated/photo-frame-3.dim_600x600.png",
    templateImageData:
      "/assets/generated/demo-frame-photo-frame.dim_400x400.png",
    deliveryTime: "5-7 business days",
    category: "Photo Frames",
    dpiSettings: BigInt(300),
  },
  // Photo Magnets
  {
    id: "demo-photo-magnet-1",
    name: "Square Photo Magnet",
    price: BigInt(149),
    description:
      "Custom square photo magnets. Perfect for fridges, lockers, and magnetic surfaces.",
    sizeOptions: ["2x2 inch", "3x3 inch", "4x4 inch"],
    imageData: "/assets/generated/photo-magnet-1.dim_600x600.png",
    templateImageData:
      "/assets/generated/demo-frame-photo-magnet.dim_400x400.png",
    deliveryTime: "3-5 business days",
    category: "Photo Magnets",
    dpiSettings: BigInt(300),
  },
  {
    id: "demo-photo-magnet-2",
    name: "Rectangle Photo Magnet",
    price: BigInt(179),
    description:
      "Custom rectangle photo magnets with vibrant colors and strong magnetic backing.",
    sizeOptions: ["2x3 inch", "3x4 inch", "4x6 inch"],
    imageData: "/assets/generated/photo-magnet-2.dim_600x600.png",
    templateImageData:
      "/assets/generated/demo-frame-photo-magnet.dim_400x400.png",
    deliveryTime: "3-5 business days",
    category: "Photo Magnets",
    dpiSettings: BigInt(300),
  },
  {
    id: "demo-photo-magnet-3",
    name: "Heart Photo Magnet",
    price: BigInt(199),
    description:
      "Adorable heart-shaped photo magnets. Perfect for Valentine's Day or anniversaries.",
    sizeOptions: ["3 inch", "4 inch"],
    imageData: "/assets/generated/photo-magnet-3.dim_600x600.png",
    templateImageData:
      "/assets/generated/demo-frame-photo-magnet.dim_400x400.png",
    deliveryTime: "3-5 business days",
    category: "Photo Magnets",
    dpiSettings: BigInt(300),
  },
  // Photo Magnet Set
  {
    id: "demo-photo-magnet-set",
    name: "Rectangle & Square Fridge Magnets — Set of 4",
    price: BigInt(856),
    description:
      "Re-visit those blessed moments every time! Square magnet combos come in a set of 4 magnets. Printed on 2mm thick flexible magnet. Liven up your fridge or desk-space with holiday memories as magnets. Each piece in the set measures 4×3 in (2 Qty), 5×5 in (2 Qty).",
    sizeOptions: [
      "Magnet 1 (4.42×3.84 in)",
      "Magnet 2 (5×5 in)",
      "Magnet 3 (5×5 in)",
      "Magnet 4 (4.42×3.84 in)",
    ],
    imageData: "/assets/generated/magnet-set-product.dim_600x600.jpg",
    templateImageData: "/assets/generated/magnet-set-product.dim_600x600.jpg",
    deliveryTime: "3-5 business days",
    category: "Photo Magnets",
    dpiSettings: BigInt(300),
  },
  // Mugs
  {
    id: "demo-mug-1",
    name: "Classic Photo Mug",
    price: BigInt(349),
    description:
      "Custom photo mug with your favorite memories. Dishwasher safe and microwave friendly.",
    sizeOptions: ["11 oz", "15 oz"],
    imageData: "/assets/generated/mug-1.dim_600x600.png",
    templateImageData: "/assets/generated/demo-frame-mug.dim_400x400.png",
    deliveryTime: "5-7 business days",
    category: "Mugs",
    dpiSettings: BigInt(300),
  },
  {
    id: "demo-mug-2",
    name: "Magic Color Mug",
    price: BigInt(449),
    description:
      "Heat-sensitive magic mug that reveals your photo when filled with hot liquid.",
    sizeOptions: ["11 oz"],
    imageData: "/assets/generated/mug-2.dim_600x600.png",
    templateImageData: "/assets/generated/demo-frame-mug.dim_400x400.png",
    deliveryTime: "5-7 business days",
    category: "Mugs",
    dpiSettings: BigInt(300),
  },
  {
    id: "demo-mug-3",
    name: "Travel Photo Mug",
    price: BigInt(549),
    description:
      "Insulated travel mug with your custom photo. Keeps drinks hot for 6 hours.",
    sizeOptions: ["12 oz", "16 oz"],
    imageData: "/assets/generated/mug-3.dim_600x600.png",
    templateImageData: "/assets/generated/demo-frame-mug.dim_400x400.png",
    deliveryTime: "5-7 business days",
    category: "Mugs",
    dpiSettings: BigInt(300),
  },
  // Corporate Gifts
  {
    id: "demo-corporate-gift-1",
    name: "Corporate Photo Frame Set",
    price: BigInt(1299),
    description:
      "Premium corporate gift set with custom photo frames. Perfect for employee recognition.",
    sizeOptions: ["Standard", "Premium"],
    imageData: "/assets/generated/corporate-gift-1.dim_600x600.png",
    templateImageData:
      "/assets/generated/demo-frame-corporate-gift.dim_400x400.png",
    deliveryTime: "7-10 business days",
    category: "Corporate Gifts",
    dpiSettings: BigInt(300),
  },
  {
    id: "demo-corporate-gift-2",
    name: "Branded Mug Collection",
    price: BigInt(999),
    description:
      "Custom branded mugs with company logo and employee photos. Minimum order 10 pieces.",
    sizeOptions: ["11 oz", "15 oz"],
    imageData: "/assets/generated/corporate-gift-2.dim_600x600.png",
    templateImageData:
      "/assets/generated/demo-frame-corporate-gift.dim_400x400.png",
    deliveryTime: "7-10 business days",
    category: "Corporate Gifts",
    dpiSettings: BigInt(300),
  },
  {
    id: "demo-corporate-gift-3",
    name: "Executive Photo Calendar",
    price: BigInt(799),
    description:
      "Personalized desk calendar with company photos and branding. Great for clients.",
    sizeOptions: ["A4", "A3"],
    imageData: "/assets/generated/corporate-gift-3.dim_600x600.png",
    templateImageData:
      "/assets/generated/demo-frame-corporate-gift.dim_400x400.png",
    deliveryTime: "7-10 business days",
    category: "Corporate Gifts",
    dpiSettings: BigInt(300),
  },
];

export function getDemoProductById(id: string): ProductInfo | undefined {
  return demoProducts.find((p) => p.id === id);
}

export function getDemoProductsByCategory(category: string): ProductInfo[] {
  return demoProducts.filter((p) => p.category === category);
}
