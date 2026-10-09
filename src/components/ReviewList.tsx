import React from 'react';
import { Star } from 'lucide-react';
import type { Review } from '../types';

interface ReviewListProps {
  reviews: Review[];
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  return (
    <div className="space-y-6">
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <div key={review.id} className="p-4 bg-white rounded-2xl border border-brand-pink/20">
            <div className="flex justify-between items-center mb-2">
              <div className="flex text-brand-gold">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} />
                ))}
            </div>
            <span className="text-xs text-brand-chocolate/40 font-sans">
              {new Date(review.created_at).toLocaleDateString()}
            </span>
          </div>
          <p className="text-brand-chocolate/80 font-sans text-sm italic">"{review.comment}"</p>
        </div>
        ))
      ) : (
        <p className="text-center text-brand-chocolate/40 font-sans italic">Aún no hay reseñas para este producto.</p>
      )}
    </div>
  );
};

export default ReviewList;
