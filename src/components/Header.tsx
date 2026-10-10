import React, { useState } from 'react';
import { Menu, X, Heart, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Catálogo', path: '/catalogo' },
    { name: 'Ofertas', path: '/ofertas' },
    { name: 'Nuevos', path: '/nuevos' },
    { name: 'Favoritos', path: '/favoritos' },
    { name: 'Cuenta', path: '/cuenta' },
  ];

  return (
    <header className="bg-brand-cream sticky top-0 z-50 border-b border-brand-pink/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button 
              aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={isOpen}
              onClick={() => setIsOpen(!isOpen)} 
              className="min-h-11 min-w-11 flex items-center text-brand-chocolate hover:text-brand-gold transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex flex-col items-center">
              <span className="text-xl md:text-2xl font-serif font-bold text-brand-chocolate tracking-tight text-center">
                KAPRICHO'S <br className="md:hidden" /> <span className="text-sm font-sans font-light uppercase tracking-widest">Boutique</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                className="text-brand-chocolate hover:text-brand-gold transition-colors font-sans text-sm uppercase tracking-wider"
              >
                {link.name}
              </Link>
            ))}
            <div className="flex items-center space-x-4 ml-4 border-l pl-4 border-brand-pink/50">
              <Link to="/favoritos" aria-label="Mis favoritos" className="text-brand-chocolate hover:text-brand-gold transition-colors">
                <Heart size={20} />
              </Link>
              <Link to="/cuenta" aria-label="Mi cuenta" className="text-brand-chocolate hover:text-brand-gold transition-colors">
                <User size={20} />
              </Link>
            </div>
          </nav>

          {/* Mobile Icons */}
          <div className="flex items-center md:hidden space-x-4">
            <Link to="/favoritos" aria-label="Mis favoritos" className="text-brand-chocolate">
              <Heart size={20} />
            </Link>
            <Link to="/cuenta" aria-label="Mi cuenta" className="text-brand-chocolate">
              <User size={20} />
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden bg-brand-cream border-b border-brand-pink/30 animate-in slide-in-from-top duration-300">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                onClick={() => setIsOpen(false)}
                className="block px-3 py-4 text-brand-chocolate hover:bg-brand-pink/20 hover:text-brand-gold transition-all font-sans uppercase tracking-wider text-sm"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
