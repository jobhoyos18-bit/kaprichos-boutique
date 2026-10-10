import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export default function Account() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [retry, setRetry] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    void (async () => {
      try {
        const { data, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        if (!active) return;
        setUser(data.session?.user ?? null);
        if (data.session?.user) {
          const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.session.user.id).single();
          if (active) setIsAdmin(profile?.role === 'admin');
        }
      } catch { if (active) setError('No pudimos cargar tu cuenta. Inténtalo de nuevo.'); }
      finally { if (active) setLoading(false); }
    })();
    return () => { active = false; };
  }, [retry]);

  async function logout() {
    setBusy(true);
    setError('');
    const { error: signOutError } = await supabase.auth.signOut();
    setBusy(false);
    if (signOutError) { setError('No pudimos cerrar la sesión. Inténtalo de nuevo.'); return; }
    navigate('/login', { replace: true });
  }
  const button = 'block min-h-12 rounded-xl px-6 py-3 text-center bg-brand-chocolate text-brand-cream hover:bg-brand-chocolate/90';
  return <section className="max-w-lg mx-auto px-4 py-16">
    <h1 className="text-3xl font-serif mb-8">Mi cuenta</h1>
    {loading ? <p role="status">Cargando tu cuenta…</p> : <div className="bg-white rounded-2xl p-6 space-y-5 border border-brand-pink/30">
      {error && <div role="alert"><p>{error}</p><button onClick={() => setRetry(value => value + 1)} className="underline py-3">Volver a intentar</button></div>}
      {user ? <>
        <h2 className="text-2xl">Hola, {user.user_metadata.full_name || 'bienvenida'}</h2>
        <p className="break-all text-sm">{user.email}</p>
        <Link to="/favoritos" className={button}>Mis favoritos</Link>
        <Link to="/catalogo" className={button}>Explorar catálogo</Link>
        {isAdmin && <Link to="/admin" className={button}>Administrar boutique</Link>}
        <button onClick={logout} disabled={busy} className="w-full min-h-12 underline disabled:opacity-50">{busy ? 'Cerrando sesión…' : 'Cerrar sesión'}</button>
      </> : <>
        <p>Inicia sesión para guardar tus favoritos y dejar reseñas.</p>
        <Link to="/login" className={button}>Iniciar sesión</Link>
        <Link to="/registro" className="block text-center min-h-12 py-3 underline">Crear cuenta</Link>
      </>}
    </div>}
  </section>;
}
