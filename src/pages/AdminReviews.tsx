import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Review } from '../types';
import { Check, X, Trash2 } from 'lucide-react';

const AdminReviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
      setReviews(data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const toggleApproval = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase.from('reviews').update({ is_approved: !currentStatus }).eq('id', id);
      if (error) throw error;
      fetchReviews();
    } catch (e) { alert('Error al moderar reseña'); }
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Eliminar esta reseña?')) {
      const { error } = await supabase.from('reviews').delete().eq('id', id);
      if (error) { alert('No se pudo eliminar la reseña. Inténtalo de nuevo.'); return; }
      fetchReviews();
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif text-brand-chocolate">Moderación de Reseñas</h2>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
            <tr>
              <th className="p-4 font-semibold">Cliente</th>
              <th className="p-4 font-semibold">Producto</th>
              <th className="p-4 font-semibold">Calificación</th>
              <th className="p-4 font-semibold">Comentario</th>
              <th className="p-4 font-semibold text-center">Estado</th>
              <th className="p-4 font-semibold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {reviews.map(r => (
              <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 text-sm">{r.user_id || 'Anónimo'}</td>
                <td className="p-4 text-sm">{r.product_id}</td>
                <td className="p-4 text-sm font-bold text-brand-gold">{r.rating} ★</td>
                <td className="p-4 text-sm text-gray-600 italic">"{r.comment}"</td>
                <td className="p-4 text-center">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${r.is_approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {r.is_approved ? 'Aprobada' : 'Pendiente'}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => toggleApproval(r.id, r.is_approved)} className={`p-2 rounded-lg transition-colors ${r.is_approved ? 'text-yellow-600 hover:bg-yellow-50' : 'text-green-600 hover:bg-green-50'}`}>
                    {r.is_approved ? <X size={18} /> : <Check size={18} />}
                  </button>
                  <button onClick={() => handleDelete(r.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminReviews;
