import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Save } from 'lucide-react';

const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const { data } = await supabase.from('store_settings').select('*');
      const mapped = (data || []).reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {});
      setSettings(mapped);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleSave = async (key: string, value: string) => {
    try {
      await supabase.from('store_settings').upsert({ key, value });
      setSettings({ ...settings, [key]: value });
    } catch (e) { alert('Error al guardar configuración'); }
  };

  if (loading) return <div className="text-center py-10">Cargando configuración...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif text-brand-chocolate">Configuración de la Boutique</h2>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-500 uppercase">Número de WhatsApp</label>
            <div className="flex gap-2">
              <input value={settings['whatsapp'] || ''} onChange={e => setSettings({...settings, whatsapp: e.target.value})} className="flex-grow p-2 border rounded-lg" placeholder="+51..." />
              <button onClick={() => handleSave('whatsapp', settings['whatsapp'] || '')} className="p-2 bg-brand-chocolate text-white rounded-lg hover:bg-brand-gold"><Save size={18} /></button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-500 uppercase">Email de Contacto</label>
            <div className="flex gap-2">
              <input value={settings['email'] || ''} onChange={e => setSettings({...settings, email: e.target.value})} className="flex-grow p-2 border rounded-lg" placeholder="correo@ejemplo.com" />
              <button onClick={() => handleSave('email', settings['email'] || '')} className="p-2 bg-brand-chocolate text-white rounded-lg hover:bg-brand-gold"><Save size={18} /></button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-500 uppercase">Dirección Física</label>
            <div className="flex gap-2">
              <input value={settings['address'] || ''} onChange={e => setSettings({...settings, address: e.target.value})} className="flex-grow p-2 border rounded-lg" placeholder="Calle..." />
              <button onClick={() => handleSave('address', settings['address'] || '')} className="p-2 bg-brand-chocolate text-white rounded-lg hover:bg-brand-gold"><Save size={18} /></button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-500 uppercase">Slogan de la Tienda</label>
            <div className="flex gap-2">
              <input value={settings['slogan'] || ''} onChange={e => setSettings({...settings, slogan: e.target.value})} className="flex-grow p-2 border rounded-lg" placeholder="Tu estilo, tu kapricho" />
              <button onClick={() => handleSave('slogan', settings['slogan'] || '')} className="p-2 bg-brand-chocolate text-white rounded-lg hover:bg-brand-gold"><Save size={18} /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
