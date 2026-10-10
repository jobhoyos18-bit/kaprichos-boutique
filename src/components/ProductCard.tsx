import React from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle } from 'lucide-react';
import type { Product } from '../types';
import { useFavorites } from '../hooks/useFavorites';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useStoreSettings, whatsappLink } from '../hooks/useStoreSettings';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const navigate = useNavigate();
  const { settings } = useStoreSettings();
  const [saving, setSaving] = React.useState(false);
  const photo = product.product_images?.find(image => image.is_main)?.url ?? product.product_images?.[0]?.url;

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (saving) return;
    setSaving(true);
    const result = await toggleFavorite(product.id);
    setSaving(false);
    if (!result?.success && result?.message) {
      alert(result.message);
      if (result.requiresLogin) navigate('/login');
    }
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-brand-pink/20"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-brand-cream">
        <Link to={`/producto/${product.slug}`} aria-label={`Ver ${product.name}`} className="block w-full h-full">
        {photo ? <img src={photo} alt={product.name} loading="lazy" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-brand-chocolate/20 font-serif italic">
          Imagen del Producto
        </div>}
        </Link>
        
        {product.is_new && (
          <span className="absolute top-3 left-3 bg-brand-gold text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
            Nuevo
          </span>
        )}
        
        <button 
          aria-label={isFavorite(product.id) ? `Quitar ${product.name} de favoritos` : `Guardar ${product.name} en favoritos`}
          aria-pressed={isFavorite(product.id)}
          disabled={saving}
          onClick={handleFavoriteClick}
          className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${isFavorite(product.id) ? 'bg-brand-pink text-white' : 'bg-white/80 backdrop-blur-sm text-brand-chocolate hover:text-brand-pink'}`}
        >
          <Heart size={18} fill={isFavorite(product.id) ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="p-4 text-center">
        <h3
          className="font-serif text-lg text-brand-chocolate mb-1 group-hover:text-brand-gold transition-colors cursor-pointer"
        >
          <Link to={`/producto/${product.slug}`}>{product.name}</Link>
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

        <a href={whatsappLink(settings.whatsapp, `Hola, me interesa ${product.name}. ¿Está disponible? ${window.location.origin}/producto/${product.slug}`)} target="_blank" rel="noopener noreferrer" className="w-full min-h-12 py-2 px-3 bg-brand-chocolate text-brand-cream rounded-xl font-sans text-xs sm:text-sm uppercase tracking-wider hover:bg-brand-gold transition-all flex items-center justify-center gap-2">
          <MessageCircle size={16} />
          Consultar
        </a>
      </div>
    </motion.div>
  );
};

export default ProductCard;
