import { useNavigate } from '@tanstack/react-router';
import { Camera, Frame, Magnet, Coffee, Briefcase, ChevronRight } from 'lucide-react';

const categories = [
  { name: 'Photo Prints', icon: Camera, color: 'bg-blue-50 text-blue-600', border: 'border-blue-200', hover: 'hover:bg-blue-100', subtitle: 'High quality prints' },
  { name: 'Photo Frames', icon: Frame, color: 'bg-purple-50 text-purple-600', border: 'border-purple-200', hover: 'hover:bg-purple-100', subtitle: 'Beautiful frames' },
  { name: 'Photo Magnets', icon: Magnet, color: 'bg-green-50 text-green-600', border: 'border-green-200', hover: 'hover:bg-green-100', subtitle: 'Fridge magnets' },
  { name: 'Mugs', icon: Coffee, color: 'bg-orange-50 text-orange-600', border: 'border-orange-200', hover: 'hover:bg-orange-100', subtitle: 'Custom mugs' },
  { name: 'Corporate Gifts', icon: Briefcase, color: 'bg-red-50 text-red-600', border: 'border-red-200', hover: 'hover:bg-red-100', subtitle: 'Bulk orders' },
];

export default function ProductCategoryGrid() {
  const navigate = useNavigate();

  return (
    <section className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs font-bold text-[#2874f0] uppercase tracking-widest">COLLECTIONS</span>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Shop by Category</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.name}
              onClick={() => navigate({ to: '/', search: { category: cat.name, search: undefined } })}
              className={`flex flex-col items-center p-4 bg-white rounded-lg border ${cat.border} ${cat.hover} transition-all shadow-card hover:shadow-card-hover group`}
            >
              <div className={`w-14 h-14 rounded-full ${cat.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <Icon className="w-7 h-7" />
              </div>
              <span className="text-sm font-semibold text-gray-800 text-center">{cat.name}</span>
              <span className="text-xs text-gray-500 mt-0.5 text-center">{cat.subtitle}</span>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400 mt-2 group-hover:text-[#2874f0] transition-colors" />
            </button>
          );
        })}
      </div>
    </section>
  );
}
