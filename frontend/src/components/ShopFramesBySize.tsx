import { useNavigate } from '@tanstack/react-router';
import { getImageSrc } from '../utils/imageHelpers';

const frameSizes = [
  { size: '4×6', label: '4×6 inches', subtitle: 'Classic Wallet Size', image: '/assets/generated/frame-size-4x6.dim_400x500.png' },
  { size: '6×8', label: '6×8 inches', subtitle: 'Standard Portrait', image: '/assets/generated/frame-size-6x8.dim_400x500.png' },
  { size: '9×12', label: '9×12 inches', subtitle: 'Large Portrait', image: '/assets/generated/frame-size-9x12.dim_400x500.png' },
  { size: '12×12', label: '12×12 inches', subtitle: 'Square Format', image: '/assets/generated/frame-size-12x12.dim_400x500.png' },
  { size: '12×18', label: '12×18 inches', subtitle: 'Panoramic Print', image: '/assets/generated/frame-size-12x18.dim_400x500.png' },
  { size: '14×18', label: '14×18 inches', subtitle: 'Gallery Size', image: '/assets/generated/frame-size-14x18.dim_400x500.png' },
  { size: '18×24', label: '18×24 inches', subtitle: 'Poster Size', image: '/assets/generated/frame-size-18x24.dim_400x500.png' },
  { size: '20×24', label: '20×24 inches', subtitle: 'Statement Piece', image: '/assets/generated/frame-size-20x24.dim_400x500.png' },
];

export default function ShopFramesBySize() {
  const navigate = useNavigate();

  const handleSizeClick = () => {
    navigate({
      to: '/',
      search: { category: 'Photo Frames' },
    });
  };

  return (
    <section className="py-12 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold font-serif text-foreground mb-2">Shop Photo Frames by Sizes</h2>
          <p className="text-muted-foreground">Find the perfect frame size for your cherished memories</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {frameSizes.map((frame) => {
            const imageSrc = getImageSrc(frame.image);
            return (
              <div
                key={frame.size}
                className="group cursor-pointer flex flex-col items-center"
                onClick={handleSizeClick}
              >
                <div className="w-full aspect-[4/5] rounded-lg overflow-hidden bg-card shadow-sm group-hover:shadow-md transition-all duration-200 border border-border mb-2">
                  <img
                    src={imageSrc}
                    alt={`${frame.label} photo frame`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <span className="font-bold text-sm text-foreground">{frame.size}</span>
                <span className="text-xs text-muted-foreground text-center">{frame.subtitle}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
