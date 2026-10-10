import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Category } from '../types';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';

const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: '', slug: '', description: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data } = await supabase.from('categories').select('*').order('name');
      setCategories(data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        const { error } = await supabase.from('categories').update(formData).eq('id', editingCategory.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('categories').insert(formData);
        if (error) throw error;
      }
      setIsModalOpen(false);
      setEditingCategory(null);
      setFormData({ name: '', slug: '', description: '' });
      fetchCategories();
    } catch (e) { alert('Error al guardar categoría'); }
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Eliminar esta categoría? Algunos productos podrían quedar sin categoría.')) {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) { alert('No se pudo eliminar la categoría. Inténtalo de nuevo.'); return; }
      fetchCategories();
    }
  };

  const openEdit = (c: Category) => {
    setEditingCategory(c);
    setFormData({ name: c.name, slug: c.slug, description: c.description || '' });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif text-brand-chocolate">Gestión de Categorías</h2>
        <button onClick={() => { setEditingCategory(null); setFormData({ name: '', slug: '', description: '' }); setIsModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-brand-chocolate text-white rounded-lg hover:bg-brand-gold transition-all">
          <Plus size={20} /> Nueva Categoría
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
            <tr>
              <th className="p-4 font-semibold">Nombre</th>
              <th className="p-4 font-semibold">Slug</th>
              <th className="p-4 font-semibold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories.map(c => (
              <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-medium text-gray-900">{c.name}</td>
                <td className="p-4 text-sm text-gray-600">{c.slug}                </td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => openEdit(c)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit size={18} /></button>
                  <button onClick={() => handleDelete(c.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md max-h-[90dvh] rounded-3xl shadow-2xl overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-serif text-brand-chocolate">{editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nombre</label>
                <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="w-full p-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Slug</label>
                <input value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} required className="w-full p-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Descripción</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-2 border rounded-lg h-20" />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Cancelar</button>
                <button type="submit" className="px-6 py-2 bg-brand-chocolate text-white rounded-lg hover:bg-brand-gold transition-all flex items-center gap-2">
                  <Save size={18} /> Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
