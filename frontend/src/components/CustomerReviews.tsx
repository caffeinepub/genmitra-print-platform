import { useState } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const reviews = [
  {
    name: 'Priya Sharma',
    rating: 5,
    date: 'Feb 15, 2026',
    text: 'Absolutely love the quality of the photo prints! The colors are vibrant and the paper quality is excellent. Will definitely order again.',
    avatar: 'P',
  },
  {
    name: 'Rahul Verma',
    rating: 5,
    date: 'Jan 28, 2026',
    text: 'Ordered a custom mug for my wife\'s birthday. She loved it! The print quality is amazing and delivery was super fast.',
    avatar: 'R',
  },
  {
    name: 'Anita Patel',
    rating: 4,
    date: 'Jan 10, 2026',
    text: 'Great service and quality products. The photo frame I ordered looks beautiful on my wall. Packaging was also very secure.',
    avatar: 'A',
  },
];

export default function CustomerReviews() {
  const [current, setCurrent] = useState(0);
  const [sort, setSort] = useState('Most Recent');

  const review = reviews[current];

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Customer Reviews</h2>
        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          className="text-sm border border-gray-300 rounded px-3 py-1.5 text-gray-600 focus:outline-none focus:border-[#2874f0]"
        >
          <option>Most Recent</option>
          <option>Highest Rated</option>
          <option>Lowest Rated</option>
        </select>
      </div>

      {/* Overall Rating */}
      <div className="bg-white rounded-lg shadow-card border border-gray-100 p-6 mb-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-800">4.8</div>
            <div className="flex gap-0.5 justify-center mt-1">
              {[1,2,3,4,5].map(s => (
                <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">Based on 248 reviews</p>
          </div>
          <div className="flex-1 space-y-1">
            {[5,4,3,2,1].map(star => (
              <div key={star} className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-4">{star}</span>
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-yellow-400 h-1.5 rounded-full"
                    style={{ width: star === 5 ? '75%' : star === 4 ? '15%' : star === 3 ? '6%' : '2%' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Single Review Card */}
        <div className="border-t border-gray-100 pt-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-[#2874f0] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
              {review.avatar}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-gray-800 text-sm">{review.name}</span>
                <span className="text-xs text-gray-400">{review.date}</span>
              </div>
              <div className="flex gap-0.5 mb-2">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-gray-600 italic">"{review.text}"</p>
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-3 mt-4">
          <button
            onClick={() => setCurrent(c => Math.max(0, c - 1))}
            disabled={current === 0}
            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-[#2874f0] hover:text-[#2874f0] transition-colors disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm text-gray-500">{current + 1} / {reviews.length}</span>
          <button
            onClick={() => setCurrent(c => Math.min(reviews.length - 1, c + 1))}
            disabled={current === reviews.length - 1}
            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-[#2874f0] hover:text-[#2874f0] transition-colors disabled:opacity-40"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
