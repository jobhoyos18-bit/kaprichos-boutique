import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, ShoppingBag } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Product } from '../types';
import ProductCard from '../components/ProductCard';

const Catalog: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Filter States
  const [filters, setFilters] = useState({
    category: '',
    size: '',
    color: '',
    minPrice: '',
    maxPrice: ''
  });

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters.category) query = query.eq('category_id', filters.category);
      if (filters.minPrice) query = query.gte('price', parseFloat(filters.minPrice));
      if (filters.maxPrice) query = query.lte('price', parseFloat(filters.maxPrice));

      const { data, error } = await query;
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({ category: '', size: '', color: '', minPrice: '', maxPrice: '' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl md:text-4xl font-serif text-brand-chocolate">Nuestro Catálogo</h1>
        
        <button 
          onClick={() => setIsFilterOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-brand-pink/30 rounded-full text-brand-chocolate hover:text-brand-gold transition-all"
        >
          <Filter size={18} />
          <span className="text-sm uppercase tracking-wider font-sans">Filtrar</span>
        </button>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-xs bg-brand-cream z-[70] shadow-2xl p-6 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-serif text-brand-chocolate">Filtros</h2>
                <button onClick={() => setIsFilterOpen(false)} className="p-2 hover:bg-brand-pink/20 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-brand-chocolate/60 mb-2 font-sans">Categoría</label>
                  <select 
                    value={filters.category}
                    onChange={(e) => setFilters({...filters, category: e.target.value})}
                    className="w-full p-3 bg-white border border-brand-pink/30 rounded-xl text-brand-chocolate outline-none focus:border-brand-gold transition-colors"
                  >
                    <option value="">Todas</option>
                    <option value="cat1">Vestidos</option>
                    <option value="cat2">Blusas</option>
                    <option value="cat3">Pantalones</option>
                    <option value="cat4">Accesorios</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-brand-chocolate/60 mb-2 font-sans">Precio Mín</label>
                    <input 
                      type="number" 
                      value={filters.minPrice}
                      onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                      className="w-full p-3 bg-white border border-brand-pink/30 rounded-xl text-brand-chocolate outline-none focus:border-brand-gold transition-colors"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-brand-chocolate/60 mb-2 font-sans">Precio Máx</label>
                    <input 
                      type="number" 
                      value={filters.maxPrice}
                      onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                      className="w-full p-3 bg-white border border-brand-pink/30 rounded-xl text-brand-chocolate outline-none focus:border-brand-gold transition-colors"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <button 
                  onClick={clearFilters}
                  className="w-full py-3 text-sm text-brand-chocolate/60 hover:text-brand-chocolate transition-colors underline underline-offset-4"
                >
                  Limpiar filtros
                </button>

                <button 
                  onClick={() => setIsFilterOpen(false)}
                  className="w-full py-4 bg-brand-chocolate text-brand-cream rounded-xl font-sans uppercase tracking-widest text-sm hover:bg-brand-gold transition-all shadow-lg"
                >
                  Aplicar Filtros
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Product Grid */}
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
            <ShoppingBag size={32} />
          </div>
          <h3 className="text-xl font-serif text-brand-chocolate mb-2">No encontramos productos</h3>
          <p className="text-brand-chocolate/60 font-sans max-w-xs mx-auto">
            Intenta ajustar los filtros o vuelve más tarde para ver nuestras novedades.
          </p>
          <button 
            onClick={clearFilters}
            className="mt-6 px-6 py-2 bg-brand-chocolate text-brand-cream rounded-full text-sm uppercase tracking-widest hover:bg-brand-gold transition-all"
          >
            Ver todo el catálogo
          </button>
        </div>
      )}
    </div>
  );
};

export default Catalog;
