import { useNavigate } from '@tanstack/react-router';

const frameSizes = [
  { size: '4×6', img: '/assets/generated/frame-size-4x6.dim_400x500.png', label: '4×6 inch' },
  { size: '6×8', img: '/assets/generated/frame-size-6x8.dim_400x500.png', label: '6×8 inch' },
  { size: '9×12', img: '/assets/generated/frame-size-9x12.dim_400x500.png', label: '9×12 inch' },
  { size: '12×12', img: '/assets/generated/frame-size-12x12.dim_400x500.png', label: '12×12 inch' },
  { size: '12×18', img: '/assets/generated/frame-size-12x18.dim_400x500.png', label: '12×18 inch' },
  { size: '14×18', img: '/assets/generated/frame-size-14x18.dim_400x500.png', label: '14×18 inch' },
  { size: '18×24', img: '/assets/generated/frame-size-18x24.dim_400x500.png', label: '18×24 inch' },
  { size: '20×24', img: '/assets/generated/frame-size-20x24.dim_400x500.png', label: '20×24 inch' },
];

export default function ShopFramesBySize() {
  const navigate = useNavigate();

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-1">Shop Frames by Size</h2>
      <p className="text-gray-500 text-sm mb-4">Find the perfect frame for your space</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
        {frameSizes.map((frame) => (
          <button
            key={frame.size}
            onClick={() => navigate({ to: '/', search: { category: 'Photo Frames', search: undefined } })}
            className="flex flex-col items-center bg-white rounded-lg border border-gray-200 p-3 hover:border-[#2874f0] hover:shadow-card-hover transition-all group"
          >
            <div className="w-full aspect-square overflow-hidden rounded mb-2 bg-gray-50">
              <img
                src={frame.img}
                alt={frame.label}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform"
              />
            </div>
            <span className="text-xs font-bold text-gray-800">{frame.size}</span>
            <span className="text-xs text-[#2874f0] font-medium">inch</span>
          </button>
        ))}
      </div>
    </section>
  );
}
