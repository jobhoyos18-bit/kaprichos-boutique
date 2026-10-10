import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { LayoutDashboard, Package, Tags, Star, Settings, LogOut } from 'lucide-react';

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role !== 'admin') {
        navigate('/');
        return;
      }

      setIsAdmin(true);
    } catch (error) {
      console.error('Error checking admin status:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) { alert('No se pudo cerrar la sesión. Inténtalo de nuevo.'); return; }
    navigate('/login');
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Cargando panel...</div>;
  if (!isAdmin) return null;

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Productos', path: '/admin/products', icon: Package },
    { name: 'Categorías', path: '/admin/categories', icon: Tags },
    { name: 'Reseñas', path: '/admin/reviews', icon: Star },
    { name: 'Configuración', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Sidebar */}
      <aside className="w-full md:w-64 md:shrink-0 bg-brand-chocolate text-brand-cream flex flex-col">
        <div className="p-6 border-b border-brand-chocolate/50">
          <h2 className="font-serif text-xl font-bold">Admin Panel</h2>
          <p className="text-xs text-brand-cream/60 uppercase tracking-widest">Kapricho's Boutique</p>
        </div>

        <nav className="flex-grow p-4 space-y-2">
          {menuItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-brand-gold transition-all group"
            >
              <item.icon size={20} className="group-hover:text-white transition-colors" />
              <span className="font-sans text-sm">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-brand-chocolate/50">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 p-3 w-full rounded-lg hover:bg-red-600 transition-all text-brand-cream/80 hover:text-white"
          >
            <LogOut size={20} />
            <span className="font-sans text-sm">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="min-w-0 flex-grow overflow-auto">
        <header className="bg-white h-16 border-b flex items-center px-8 justify-between">
          <h3 className="font-sans font-semibold text-gray-700">Gestión de la Boutique</h3>
          <div className="flex items-center gap-4">
            <span className="text-xs bg-brand-gold/20 text-brand-gold px-2 py-1 rounded-full font-bold uppercase">Administrador</span>
          </div>
        </header>
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
