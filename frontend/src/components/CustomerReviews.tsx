import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const reviews = [
  {
    id: 1,
    name: 'Arjun Saini',
    date: 'Thu, 24 Apr, 2025',
    rating: 5,
    text: 'Wanted to try a sample, so I ordered a smaller frame and photo. But the quality of the frame and the photo is so good that I will try a bigger framed photo next.',
  },
];

export default function CustomerReviews() {
  const [currentPage, setCurrentPage] = useState(0);
  const [sortOrder, setSortOrder] = useState('highest');

  const review = reviews[currentPage];

  return (
    <section className="py-16 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="section-title mb-3">Customer Reviews</h2>

          {/* Overall Rating */}
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="h-6 w-6 fill-brand-gold text-brand-gold" />
              ))}
            </div>
            <span className="text-lg font-semibold text-foreground">
              Overall 5 out of 5 from {reviews.length} Review{reviews.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Sort */}
          <div className="flex justify-end mb-4">
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-48 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="highest">Highest to Lowest</SelectItem>
                <SelectItem value="lowest">Lowest to Highest</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Review Card */}
          <div className="bg-card rounded-2xl shadow-card p-6 border border-border">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`h-4 w-4 ${s <= review.rating ? 'fill-brand-gold text-brand-gold' : 'text-muted-foreground'}`}
                    />
                  ))}
                </div>
                <p className="font-semibold text-foreground">{review.name}</p>
              </div>
              <span className="text-sm text-muted-foreground">{review.date}</span>
            </div>

            <p className="text-foreground leading-relaxed italic">"{review.text}"</p>

            <div className="mt-4 pt-4 border-t border-border">
              <span className="text-xs text-muted-foreground">Verified Purchase</span>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl gap-2"
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
            >
              <ChevronLeft className="h-4 w-4" />
              Prev
            </Button>
            <span className="text-sm text-muted-foreground">
              {currentPage + 1} / {reviews.length}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl gap-2"
              onClick={() => setCurrentPage(Math.min(reviews.length - 1, currentPage + 1))}
              disabled={currentPage === reviews.length - 1}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
