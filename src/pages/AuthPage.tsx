import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';

const AuthPage: React.FC<{ mode: 'login' | 'register' }> = ({ mode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setMessage({ type: 'success', text: '¡Bienvenida de nuevo!' });
        setTimeout(() => navigate('/cuenta'), 1500);
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName }
          }
        });
        if (error) throw error;
        setMessage({ type: 'success', text: 'Cuenta creada. Por favor revisa tu correo.' });
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white w-full max-w-md rounded-3xl shadow-xl border border-brand-pink/30 p-8"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif text-brand-chocolate mb-2">
            {mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </h2>
          <p className="text-brand-chocolate/60 font-sans text-sm">
            {mode === 'login' ? 'Accede a tu cuenta de Kapricho\'s' : 'Únete a nuestra comunidad elegante'}
          </p>
        </div>

        {message && (
          <div className={`mb-6 p-3 rounded-xl text-sm text-center transition-all ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-5">
          {mode === 'register' && (
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-chocolate/40" size={20} />
              <input 
                type="text" 
                placeholder="Nombre completo" 
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-brand-cream/50 border border-brand-pink/30 rounded-xl text-brand-chocolate outline-none focus:border-brand-gold transition-all"
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-chocolate/40" size={20} />
            <input 
              type="email" 
              placeholder="Correo electrónico" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-brand-cream/50 border border-brand-pink/30 rounded-xl text-brand-chocolate outline-none focus:border-brand-gold transition-all"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-chocolate/40" size={20} />
            <input 
              type="password" 
              placeholder="Contraseña" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-brand-cream/50 border border-brand-pink/30 rounded-xl text-brand-chocolate outline-none focus:border-brand-gold transition-all"
            />
          </div>

          <button 
            disabled={loading}
            className="w-full py-4 bg-brand-chocolate text-brand-cream rounded-xl font-sans uppercase tracking-widest text-sm hover:bg-brand-gold transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? 'Cargando...' : (mode === 'login' ? 'Entrar' : 'Registrarse')}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-brand-chocolate/60 font-sans">
            {mode === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
            <Link 
              to={mode === 'login' ? '/registro' : '/login'} 
              className="ml-2 text-brand-chocolate font-bold hover:text-brand-gold transition-colors underline underline-offset-4"
            >
              {mode === 'login' ? 'Regístrate aquí' : 'Inicia sesión'}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
