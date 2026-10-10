import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import BestSellersCarousel from '../components/BestSellersCarousel';
import BackgroundVideo from '../components/BackgroundVideo';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col pb-20">
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

      <BestSellersCarousel />

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
