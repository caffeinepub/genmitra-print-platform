import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const reviews = [
  {
    id: 1,
    name: 'Priya Sharma',
    location: 'Mumbai',
    rating: 5,
    review: 'Absolutely love the quality of the photo frames! The colors are vibrant and the frame is sturdy. Will definitely order again.',
    product: 'Classic Wood Photo Frame',
    date: 'Jan 2026',
    avatar: 'PS',
  },
  {
    id: 2,
    name: 'Rahul Verma',
    location: 'Delhi',
    rating: 5,
    review: 'Ordered a custom mug for my wife\'s birthday. She loved it! The print quality is excellent and delivery was super fast.',
    product: 'Custom Photo Mug',
    date: 'Feb 2026',
    avatar: 'RV',
  },
  {
    id: 3,
    name: 'Anita Patel',
    location: 'Bangalore',
    rating: 5,
    review: 'The photo magnets are adorable! Great quality and the packaging was very professional. Highly recommend GenMitra.',
    product: 'Photo Magnet Set',
    date: 'Jan 2026',
    avatar: 'AP',
  },
  {
    id: 4,
    name: 'Suresh Kumar',
    location: 'Chennai',
    rating: 4,
    review: 'Good quality products at reasonable prices. The corporate gift set was perfect for our team. Will order again for sure.',
    product: 'Corporate Gift Set',
    date: 'Feb 2026',
    avatar: 'SK',
  },
  {
    id: 5,
    name: 'Meera Joshi',
    location: 'Pune',
    rating: 5,
    review: 'Exceptional quality and service! The photo prints are crystal clear. GenMitra is my go-to for all personalized gifts.',
    product: 'Photo Prints',
    date: 'Mar 2026',
    avatar: 'MJ',
  },
  {
    id: 6,
    name: 'Vikram Singh',
    location: 'Hyderabad',
    rating: 5,
    review: 'Ordered frames for my entire family. Everyone loved them! The customization options are great and delivery was on time.',
    product: 'Classic Wood Photo Frame',
    date: 'Feb 2026',
    avatar: 'VS',
  },
];

const REVIEWS_PER_PAGE = 3;

export default function CustomerReviews() {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(reviews.length / REVIEWS_PER_PAGE);
  const currentReviews = reviews.slice(page * REVIEWS_PER_PAGE, (page + 1) * REVIEWS_PER_PAGE);

  const avatarColors = [
    'bg-indigo-100 text-indigo-700',
    'bg-purple-100 text-purple-700',
    'bg-teal-100 text-teal-700',
    'bg-orange-100 text-orange-700',
    'bg-rose-100 text-rose-700',
    'bg-blue-100 text-blue-700',
  ];

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-sm font-semibold text-[var(--accent)] uppercase tracking-widest mb-2">Testimonials</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">What Our Customers Say</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="w-10 h-10 rounded-xl border border-border flex items-center justify-center hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page === totalPages - 1}
              className="w-10 h-10 rounded-xl border border-border flex items-center justify-center hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {currentReviews.map((review, idx) => (
            <div
              key={review.id}
              className="bg-card border border-border rounded-2xl p-6 hover:shadow-card-hover transition-all duration-300"
            >
              {/* Quote Icon */}
              <div className="mb-4">
                <Quote className="w-8 h-8 text-[var(--accent)]/30" />
              </div>

              {/* Stars */}
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`}
                  />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-sm text-muted-foreground leading-relaxed mb-5 line-clamp-4">
                "{review.review}"
              </p>

              {/* Product */}
              <div className="text-xs font-medium text-[var(--accent)] mb-4 bg-[var(--accent)]/10 inline-block px-2.5 py-1 rounded-full">
                {review.product}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${avatarColors[idx % avatarColors.length]}`}>
                  {review.avatar}
                </div>
                <div>
                  <div className="font-semibold text-foreground text-sm">{review.name}</div>
                  <div className="text-xs text-muted-foreground">{review.location} · {review.date}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`rounded-full transition-all duration-200 ${
                i === page
                  ? 'w-6 h-2.5 bg-[var(--accent)]'
                  : 'w-2.5 h-2.5 bg-border hover:bg-muted-foreground'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
