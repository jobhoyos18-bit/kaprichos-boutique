import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFavorites();
    const refresh = () => { void fetchFavorites(); };
    window.addEventListener('favorites-updated', refresh);
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => { window.setTimeout(refresh, 0); });
    return () => { window.removeEventListener('favorites-updated', refresh); subscription.unsubscribe(); };
  }, []);

  const fetchFavorites = async () => {
    setLoading(true);
    setError('');
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError && authError.name !== 'AuthSessionMissingError') throw authError;
      if (!user) {
        setFavorites([]);
        return;
      }

      const { data, error } = await supabase
        .from('favorites')
        .select('product_id')
        .eq('user_id', user.id);

      if (error) throw error;
      setFavorites(data?.map(f => f.product_id) || []);
    } catch (error) {
      setError('No pudimos cargar tus favoritos. Inténtalo de nuevo.');
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (productId: string) => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError && authError.name !== 'AuthSessionMissingError') throw authError;
      if (!user) return { success: false, requiresLogin: true, message: 'Debes iniciar sesión para guardar favoritos' };

      const isFavorite = favorites.includes(productId);

      if (isFavorite) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId);
        if (error) throw error;
        setFavorites(favorites.filter(id => id !== productId));
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert({ user_id: user.id, product_id: productId });
        if (error) throw error;
        setFavorites([...favorites, productId]);
      }
      window.dispatchEvent(new Event('favorites-updated'));
      return { success: true };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  };

  return { favorites, isFavorite: (id: string) => favorites.includes(id), toggleFavorite, loading, fetchFavorites, error };
};
