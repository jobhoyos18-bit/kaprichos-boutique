import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useStoreSettings } from '../hooks/useStoreSettings';

const fields = [
  { key: 'whatsapp', label: 'Número de WhatsApp', type: 'tel', placeholder: '+51 950 124 807' },
  { key: 'email', label: 'Email de contacto', type: 'email', placeholder: 'correo@ejemplo.com' },
  { key: 'address', label: 'Dirección física', type: 'text', placeholder: 'Dirección de la boutique' },
  { key: 'slogan', label: 'Slogan de la tienda', type: 'text', placeholder: 'Tu estilo, tu kapricho' },
];
export default function AdminSettings() {
  const { settings: defaults, refresh } = useStoreSettings();
  const [settings, setSettings] = useState<Record<string, string>>(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    void (async () => {
      try {
        const { data, error: loadError } = await supabase.from('store_settings').select('*');
        if (loadError) throw loadError;
        if (active) setSettings(previous => ({ ...previous, ...Object.fromEntries((data || []).map(row => [row.key, row.value || ''])) }));
      } catch { if (active) setError('No pudimos cargar la configuración.'); }
      finally { if (active) setLoading(false); }
    })();
    return () => { active = false; };
  }, [retry]);

  async function save(key: string) {
    const value = (settings[key] || '').trim();
    setError(''); setMessage('');
    if (key === 'whatsapp' && !/^\+?[\d\s()-]{9,20}$/.test(value)) { setError('Escribe un número de WhatsApp válido con código de país.'); return; }
    setSaving(key);
    try {
      const { error: saveError } = await supabase.from('store_settings').upsert({ key, value });
      if (saveError) throw saveError;
      refresh();
      setMessage('Guardado. El cambio ya se aplica a la página pública.');
    } catch { setError('No se pudo guardar. Revisa tu conexión y los permisos de administrador.'); }
    finally { setSaving(''); }
  }
  return <section className="space-y-6"><h2 className="text-2xl font-serif">Configuración de la boutique</h2>
    {error && <div role="alert" className="text-red-700">{error}<button className="block underline py-3" onClick={() => setRetry(value => value + 1)}>Volver a cargar</button></div>}
    {message && <p role="status" className="text-green-800">{message}</p>}
    {loading ? <p>Cargando configuración…</p> : <div className="grid gap-6 bg-white p-5 rounded-xl">
      {fields.map(field => <form key={field.key} onSubmit={event => { event.preventDefault(); void save(field.key); }} className="space-y-2">
        <label htmlFor={field.key} className="block font-medium">{field.label}</label>
        <div className="flex flex-wrap gap-3"><input id={field.key} type={field.type} required={field.key !== 'email'} value={settings[field.key] || ''} onChange={event => setSettings({ ...settings, [field.key]: event.target.value })} placeholder={field.placeholder} className="min-w-0 flex-1 min-h-12 p-3 border rounded-lg" />
        <button disabled={!!saving} type="submit" aria-label={`Guardar ${field.label}`} className="min-h-12 px-4 rounded-lg bg-brand-chocolate text-white disabled:opacity-50">{saving === field.key ? 'Guardando…' : 'Guardar'}</button></div>
      </form>)}
    </div>}
  </section>;
}
