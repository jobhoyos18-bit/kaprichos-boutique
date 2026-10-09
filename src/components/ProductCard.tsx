import React from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle } from 'lucide-react';
import type { Product } from '../types';
import { useFavorites } from '../hooks/useFavorites';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const navigate = useNavigate();

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    const result = await toggleFavorite(product.id);
    if (!result?.success && result?.message) {
      alert(result.message);
      navigate('/login');
    }
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-brand-pink/20"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-brand-cream cursor-pointer" onClick={() => navigate(`/producto/${product.slug}`)}>
        <div className="w-full h-full flex items-center justify-center text-brand-chocolate/20 font-serif italic">
          Imagen del Producto
        </div>
        
        {product.is_new && (
          <span className="absolute top-3 left-3 bg-brand-gold text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
            Nuevo
          </span>
        )}
        
        <button 
          onClick={handleFavoriteClick}
          className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${isFavorite(product.id) ? 'bg-brand-pink text-white' : 'bg-white/80 backdrop-blur-sm text-brand-chocolate hover:text-brand-pink'}`}
        >
          <Heart size={18} fill={isFavorite(product.id) ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="p-4 text-center">
        <h3 
          onClick={() => navigate(`/producto/${product.slug}`)}
          className="font-serif text-lg text-brand-chocolate mb-1 group-hover:text-brand-gold transition-colors cursor-pointer"
        >
          {product.name}
        </h3>
        
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="font-sans font-bold text-brand-chocolate">
            S/. {product.price}
          </span>
          {product.old_price && (
            <span className="font-sans text-sm text-brand-chocolate/40 line-through">
              S/. {product.old_price}
            </span>
          )}
        </div>

        <button className="w-full py-2 px-4 bg-brand-chocolate text-brand-cream rounded-xl font-sans text-sm uppercase tracking-wider hover:bg-brand-gold transition-all flex items-center justify-center gap-2">
          <MessageCircle size={16} />
          Consultar
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
