import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Product, Category } from '../types';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState({
    name: '', slug: '', description: '', category_id: '', 
    price: '', old_price: '', is_new: false, is_featured: false, stock: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: prodData } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      const { data: catData } = await supabase.from('categories').select('*');
      setProducts(prodData || []);
      setCategories(catData || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        old_price: formData.old_price ? parseFloat(formData.old_price) : null,
        stock: parseInt(formData.stock),
      };

      if (editingProduct) {
        const { error } = await supabase.from('products').update(payload).eq('id', editingProduct.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('products').insert(payload);
        if (error) throw error;
      }
      setIsModalOpen(false);
      setEditingProduct(null);
      setFormData({ name: '', slug: '', description: '', category_id: '', price: '', old_price: '', is_new: false, is_featured: false, stock: '' });
      fetchData();
    } catch (e) { alert('Error al guardar producto'); }
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Eliminar este producto?')) {
      await supabase.from('products').delete().eq('id', id);
      fetchData();
    }
  };

  const openEdit = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name: p.name, slug: p.slug, description: p.description, category_id: p.category_id || '', 
      price: p.price.toString(), old_price: p.old_price?.toString() || '', is_new: p.is_new, is_featured: p.is_featured, stock: p.stock.toString()
    });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif text-brand-chocolate">Gestión de Productos</h2>
        <button onClick={() => { setEditingProduct(null); setFormData({ name: '', slug: '', description: '', category_id: '', price: '', old_price: '', is_new: false, is_featured: false, stock: '' }); setIsModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-brand-chocolate text-white rounded-lg hover:bg-brand-gold transition-all">
          <Plus size={20} /> Nuevo Producto
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
            <tr>
              <th className="p-4 font-semibold">Producto</th>
              <th className="p-4 font-semibold">Categoría</th>
              <th className="p-4 font-semibold">Precio</th>
              <th className="p-4 font-semibold">Stock</th>
              <th className="p-4 font-semibold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map(p => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  <div className="font-medium text-gray-900">{p.name}</div>
                  <div className="text-xs text-gray-400">{p.slug}</div>
                </td>
                <td className="p-4 text-sm text-gray-600">
                  {categories.find(c => c.id === p.category_id)?.name || 'Sin categoría'}
                </td>
                <td className="p-4 text-sm font-bold text-brand-chocolate">S/. {p.price}</td>
                <td className="p-4 text-sm text-gray-600">{p.stock} ud.</td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => openEdit(p)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit size={18} /></button>
                  <button onClick={() => handleDelete(p.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-serif text-brand-chocolate">{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><X size={20} /></button>
            </div>

            <form onSubmit={handleSave} className="p-6 grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nombre del Producto</label>
                <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="w-full p-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Slug (URL)</label>
                <input value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} required className="w-full p-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Categoría</label>
                <select value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})} className="w-full p-2 border rounded-lg">
                  <option value="">Seleccione...</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Precio</label>
                <input type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required className="w-full p-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Precio Anterior (Oferta)</label>
                <input type="number" step="0.01" value={formData.old_price} onChange={e => setFormData({...formData, old_price: e.target.value})} className="w-full p-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Stock</label>
                <input type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} required className="w-full p-2 border rounded-lg" />
              </div>
              <div className="col-span-2 flex flex-wrap items-center gap-4 py-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.is_new} onChange={e => setFormData({...formData, is_new: e.target.checked})} className="accent-brand-gold" />
                  <span className="text-sm font-medium">Nuevo</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.is_featured} onChange={e => setFormData({...formData, is_featured: e.target.checked})} className="accent-brand-gold" />
                  <span className="text-sm font-medium">Mostrar en Más vendidos</span>
                </label>
                <p className="w-full text-xs text-gray-500">Los productos marcados y con stock aparecerán en el carrusel de la página de inicio.</p>
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Descripción</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-2 border rounded-lg h-24" />
              </div>
              <div className="col-span-2 flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Cancelar</button>
                <button type="submit" className="px-6 py-2 bg-brand-chocolate text-white rounded-lg hover:bg-brand-gold transition-all flex items-center gap-2">
                  <Save size={18} /> Guardar Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
