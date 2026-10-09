import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ReviewFormProps {
  productId: string;
  userId: string;
  onReviewSubmitted: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ productId, userId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase
        .from('reviews')
        .insert({
          product_id: productId,
          user_id: userId,
          rating,
          comment,
        });
      if (error) throw error;
      setComment('');
      setRating(5);
      onReviewSubmitted();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-brand-pink/30 space-y-4">
      <h4 className="font-serif text-lg text-brand-chocolate">Deja tu reseña</h4>
      
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            size={24} 
            onClick={() => setRating(star)}
            className={`cursor-pointer transition-colors ${star <= rating ? 'text-brand-gold fill-brand-gold' : 'text-brand-chocolate/20'}`}
          />
        ))}
      </div>

      <textarea 
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Cuéntanos qué te pareció la prenda..."
        className="w-full p-3 bg-brand-cream/50 border border-brand-pink/30 rounded-xl text-brand-chocolate outline-none focus:border-brand-gold transition-all h-24"
        required
      />

      <button 
        disabled={loading}
        className="px-6 py-2 bg-brand-chocolate text-brand-cream rounded-full text-sm uppercase tracking-widest hover:bg-brand-gold transition-all disabled:opacity-50"
      >
        {loading ? 'Enviando...' : 'Enviar Reseña'}
      </button>
    </form>
  );
};

export default ReviewForm;
