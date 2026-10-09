import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Share2, Send } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-serif text-brand-chocolate mb-4"
        >
          Contacto
        </motion.h1>
        <div className="w-20 h-1 bg-brand-gold rounded-full mx-auto" />
        <p className="text-brand-chocolate/60 font-sans mt-6 max-w-xl mx-auto">
          Estamos aquí para ayudarte a encontrar el outfit perfecto. No dudes en contactarnos.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Info Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-brand-pink/20 space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-brand-cream rounded-2xl text-brand-chocolate">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="font-serif text-lg text-brand-chocolate">Ubicación</h3>
                <p className="text-brand-chocolate/60 font-sans">Calle Trujillo 696, Chepén, La Libertad, Perú</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-brand-cream rounded-2xl text-brand-chocolate">
                <Phone size={24} />
              </div>
              <div>
                <h3 className="font-serif text-lg text-brand-chocolate">WhatsApp</h3>
                <p className="text-brand-chocolate/60 font-sans">+51 950 124 807</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-brand-cream rounded-2xl text-brand-chocolate">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="font-serif text-lg text-brand-chocolate">Correo Electrónico</h3>
                <p className="text-brand-chocolate/60 font-sans">Disponible en configuración</p>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex justify-center lg:justify-start gap-4">
            <a href="https://www.instagram.com/kaprichosboutiqueperu?stkn=aGk3ZnE2YzhwejJ6" target="_blank" rel="noopener noreferrer" className="p-4 bg-white rounded-full text-brand-chocolate hover:bg-brand-pink hover:text-white transition-all shadow-sm border border-brand-pink/20">
              <Share2 size={24} />
            </a>
            <a href="https://www.facebook.com/share/1F4nYSu6yL/" target="_blank" rel="noopener noreferrer" className="p-4 bg-white rounded-full text-brand-chocolate hover:bg-brand-pink hover:text-white transition-all shadow-sm border border-brand-pink/20">
              <Share2 size={24} />
            </a>
          </div>
        </motion.div>

        {/* Quick Contact Form/Call to Action */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-brand-chocolate text-brand-cream p-10 rounded-3xl shadow-2xl flex flex-col justify-center text-center space-y-6"
        >
          <h2 className="text-3xl font-serif">¿Tienes alguna duda?</h2>
          <p className="text-brand-cream/70 font-sans">
            Escríbenos directamente por WhatsApp para una atención personalizada y rápida.
          </p>
          <a 
            href="https://wa.me/51950124807" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 py-4 px-8 bg-brand-gold text-white rounded-full font-sans uppercase tracking-widest text-sm hover:bg-white hover:text-brand-chocolate transition-all shadow-lg"
          >
            <Send size={20} />
            Escribir ahora
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
