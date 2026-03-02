import { useNavigate } from '@tanstack/react-router';
import { Camera, Frame, Magnet, Coffee, Gift } from 'lucide-react';

const categories = [
  {
    name: 'Photo Prints',
    icon: Camera,
    description: 'High-quality prints in various sizes',
    category: 'Photo Prints',
  },
  {
    name: 'Photo Frames',
    icon: Frame,
    description: 'Beautiful frames for your memories',
    category: 'Photo Frames',
  },
  {
    name: 'Photo Magnets',
    icon: Magnet,
    description: 'Fun magnets for your fridge',
    category: 'Photo Magnets',
  },
  {
    name: 'Mugs',
    icon: Coffee,
    description: 'Custom mugs with your photos',
    category: 'Mugs',
  },
  {
    name: 'Corporate Gifts',
    icon: Gift,
    description: 'Branded gifts for your team',
    category: 'Corporate Gifts',
  },
];

export default function ProductCategoryGrid() {
  const navigate = useNavigate();

  const handleCategoryClick = (category: string) => {
    navigate({
      to: '/',
      search: { category },
    });
  };

  return (
    <section className="py-12 bg-category-bg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold font-serif text-category-heading mb-2">Shop by Category</h2>
          <p className="text-category-subtitle text-sm font-medium">Explore our wide range of personalized photo products</p>
        </div>

        <div className="flex flex-col gap-3">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.name}
                className="group cursor-pointer bg-card rounded-xl border border-border shadow-sm hover:shadow-category transition-all duration-200 flex items-center gap-4 px-5 py-4"
                onClick={() => handleCategoryClick(cat.category)}
              >
                <div className="w-12 h-12 rounded-lg bg-category-icon-bg group-hover:bg-category-icon-bg-hover transition-colors duration-200 flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6 text-category-icon stroke-[1.5]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-category-heading text-base">{cat.name}</h3>
                  <p className="text-category-subtitle text-sm truncate">{cat.description}</p>
                </div>
                <svg className="w-5 h-5 text-muted-foreground group-hover:text-category-icon transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
