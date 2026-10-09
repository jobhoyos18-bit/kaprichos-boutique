import React from 'react';
import { Share2, Send } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-chocolate text-brand-cream pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand Info */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="text-2xl font-serif font-bold mb-4 text-brand-gold">KAPRICHO'S BOUTIQUE</h3>
            <p className="text-brand-cream/80 font-sans text-sm italic mb-6">
              "Tu estilo, tu kapricho"
            </p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/kaprichosboutiqueperu?stkn=aGk3ZnE2YzhwejJ6" target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold transition-colors">
                <Share2 size={20} />
              </a>
              <a href="https://www.facebook.com/share/1F4nYSu6yL/" target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold transition-colors">
                <Share2 size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-lg font-serif font-semibold mb-4 text-brand-gold">Enlaces</h4>
            <ul className="space-y-2 text-brand-cream/80 text-sm font-sans">
              <li><a href="/catalogo" className="hover:text-brand-gold transition-colors">Catálogo</a></li>
              <li><a href="/ofertas" className="hover:text-brand-gold transition-colors">Ofertas</a></li>
              <li><a href="/nuevos" className="hover:text-brand-gold transition-colors">Nuevos</a></li>
              <li><a href="/contacto" className="hover:text-brand-gold transition-colors">Contacto</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-lg font-serif font-semibold mb-4 text-brand-gold">Contacto</h4>
            <div className="text-brand-cream/80 text-sm font-sans space-y-2">
              <p className="flex items-center justify-center md:justify-start gap-2">
                <Send size={16} /> +51 950 124 807
              </p>
              <p className="text-center md:text-left">
                Calle Trujillo 696, <br />
                Chepén, La Libertad, Perú
              </p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-brand-cream/10 pt-6 text-center text-brand-cream/40 text-xs font-sans">
          <p>&copy; {new Date().getFullYear()} KAPRICHO'S BOUTIQUE. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
