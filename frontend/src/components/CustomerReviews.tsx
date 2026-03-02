import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const reviews = [
  {
    id: 1,
    name: 'Arjun Saini',
    rating: 5,
    review: 'Wanted to try a sample, so I ordered a smaller frame and photo. But the quality of the frame and the photo is so good that I will try a bigger framed photo next.',
    date: 'THU, 24 APR, 2025',
    avatar: 'A',
  },
  {
    id: 2,
    name: 'Priya Sharma',
    rating: 5,
    review: 'Absolutely love the quality of the photo frames! The colors are vibrant and the frame is sturdy. Will definitely order again.',
    date: 'MON, 12 MAY, 2025',
    avatar: 'P',
  },
  {
    id: 3,
    name: 'Rahul Verma',
    rating: 5,
    review: 'Ordered a custom mug for my wife\'s birthday. She loved it! The print quality is excellent and delivery was super fast.',
    date: 'FRI, 02 JUN, 2025',
    avatar: 'R',
  },
  {
    id: 4,
    name: 'Anita Patel',
    rating: 4,
    review: 'The photo magnets are adorable! Great quality and the packaging was very professional. Highly recommend GenMitra.',
    date: 'WED, 18 JUN, 2025',
    avatar: 'A',
  },
  {
    id: 5,
    name: 'Meera Joshi',
    rating: 5,
    review: 'Exceptional quality and service! The photo prints are crystal clear. GenMitra is my go-to for all personalized gifts.',
    date: 'TUE, 08 JUL, 2025',
    avatar: 'M',
  },
];

type SortOrder = 'highest' | 'lowest';

export default function CustomerReviews() {
  const [page, setPage] = useState(0);
  const [sortOrder, setSortOrder] = useState<SortOrder>('highest');

  const sortedReviews = [...reviews].sort((a, b) =>
    sortOrder === 'highest' ? b.rating - a.rating : a.rating - b.rating
  );

  const totalPages = sortedReviews.length;
  const currentReview = sortedReviews[page];

  const overallRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <section className="py-14 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-3">New Review</h2>
          {/* Overall Stars */}
          <div className="flex items-center justify-center gap-1 mb-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <p className="text-gray-800 font-medium text-sm">
            Overall {overallRating} out of 5 from {reviews.length} Reviews
          </p>
        </div>

        {/* Review Card */}
        {currentReview && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            {/* Top Row: Stars + Date */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < currentReview.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200 fill-gray-200'}`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-400 font-medium">{currentReview.date}</span>
            </div>

            {/* Reviewer */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-blue-100 text-primary flex items-center justify-center font-bold text-sm">
                {currentReview.avatar}
              </div>
              <span className="font-semibold text-gray-900 text-sm">{currentReview.name}</span>
            </div>

            {/* Review Text */}
            <p className="text-gray-700 text-sm italic leading-relaxed">
              "{currentReview.review}"
            </p>
          </div>
        )}

        {/* Bottom Controls */}
        <div className="flex items-center justify-between">
          {/* Pagination Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page === totalPages - 1}
              className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortOrder}
            onChange={(e) => {
              setSortOrder(e.target.value as SortOrder);
              setPage(0);
            }}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
          >
            <option value="highest">Highest to lowest</option>
            <option value="lowest">Lowest to highest</option>
          </select>
        </div>
      </div>
    </section>
  );
}
