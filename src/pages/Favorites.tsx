import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Product } from '../types';
import ProductCard from '../components/ProductCard';
import { useFavorites } from '../hooks/useFavorites';
import { useNavigate } from 'react-router-dom';

const Favorites: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { favorites, loading: favLoading } = useFavorites();
  const navigate = useNavigate();

  useEffect(() => {
    fetchFavoriteProducts();
  }, [favorites]);

  const fetchFavoriteProducts = async () => {
    if (favorites.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .in('id', favorites);

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching favorite products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (favLoading) return <div className="flex justify-center items-center h-screen"><div className="w-8 h-8 border-4 border-brand-pink border-t-brand-gold rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col items-center mb-12">
        <h1 className="text-3xl md:text-4xl font-serif text-brand-chocolate mb-2">Mis Favoritos</h1>
        <div className="w-20 h-1 bg-brand-gold rounded-full" />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-4 border-brand-pink border-t-brand-gold rounded-full animate-spin" />
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-brand-pink/30 text-brand-chocolate/30">
            <Heart size={32} />
          </div>
          <h3 className="text-xl font-serif text-brand-chocolate mb-2">No tienes favoritos aún</h3>
          <p className="text-brand-chocolate/60 font-sans max-w-xs mx-auto mb-8">
            Explora nuestro catálogo y guarda las prendas que más te gusten.
          </p>
          <button 
            onClick={() => navigate('/catalogo')}
            className="px-8 py-3 bg-brand-chocolate text-brand-cream rounded-full text-sm uppercase tracking-widest hover:bg-brand-gold transition-all"
          >
            Ir al Catálogo
          </button>
        </div>
      )}
    </div>
  );
};

export default Favorites;
