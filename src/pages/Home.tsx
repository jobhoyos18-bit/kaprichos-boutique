import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import BackgroundVideo from '../components/BackgroundVideo';
import type { Product } from '../types';

const Home: React.FC = () => {
  // Mock data for initial visualization (will be replaced by Supabase)
  const featuredProducts: Product[] = [
    { id: '1', name: 'Vestido Elegance', slug: 'vestido-elegance', description: '', category_id: '', price: 120, old_price: 150, is_new: true, is_featured: true, stock: 10, created_at: '' },
    { id: '2', name: 'Blusa Coquette', slug: 'blusa-coquette', description: '', category_id: '', price: 85, is_new: false, is_featured: true, stock: 15, created_at: '' },
    { id: '3', name: 'Conjunto Seda', slug: 'conjunto-seda', description: '', category_id: '', price: 210, old_price: 250, is_new: true, is_featured: true, stock: 5, created_at: '' },
    { id: '4', name: 'Cartera Luxe', slug: 'cartera-luxe', description: '', category_id: '', price: 180, is_new: false, is_featured: true, stock: 8, created_at: '' },
  ];

  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* HERO SECTION */}
      <section
        aria-labelledby="home-title"
        className="relative isolate min-h-[calc(100svh-5rem)] flex items-end justify-center overflow-hidden px-4 pt-12"
        style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
      >
        <BackgroundVideo />
        <h1 id="home-title" className="sr-only">Kapricho's Boutique — Tu estilo, tu kapricho</h1>
        <Link
          to="/catalogo"
          className="relative z-10 flex min-h-12 items-center justify-center gap-2 rounded-full bg-brand-chocolate px-8 py-4 text-center font-sans text-sm uppercase tracking-widest text-brand-cream shadow-lg transition-transform hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-chocolate"
        >
          Explorar Catálogo <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif text-brand-chocolate mb-2">Productos Destacados</h2>
          <div className="w-20 h-1 bg-brand-gold rounded-full" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* CATEGORIES PREVIEW */}
      <section className="bg-brand-pink/10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-serif text-brand-chocolate mb-12">Nuestras Categorías</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Vestidos', 'Blusas', 'Pantalones', 'Accesorios'].map((cat) => (
              <motion.div 
                key={cat}
                whileHover={{ scale: 1.02 }}
                className="p-8 bg-white rounded-2xl border border-brand-pink/30 text-brand-chocolate font-serif text-xl cursor-pointer hover:border-brand-gold transition-all"
              >
                {cat}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
