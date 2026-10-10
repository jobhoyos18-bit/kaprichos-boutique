import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';

const defaults: Record<string, string> = {
  whatsapp: '51950124807',
  email: '',
  address: 'Calle Trujillo 696, Chepén, La Libertad, Perú',
  slogan: 'Tu estilo, tu kapricho',
};
const SettingsContext = createContext({ settings: defaults, refresh: () => {} });

export function StoreSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState(defaults);
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 10000);
    void (async () => {
      try {
        const { data, error } = await supabase.from('store_settings').select('key,value').abortSignal(controller.signal);
        if (!error && data && !controller.signal.aborted) {
          setSettings({ ...defaults, ...Object.fromEntries(data.map(row => [row.key, row.value ?? ''])) });
        }
      } finally { window.clearTimeout(timeout); }
    })().catch(() => {});
    return () => { controller.abort(); window.clearTimeout(timeout); };
  }, [revision]);
  return <SettingsContext.Provider value={{ settings, refresh: () => setRevision(value => value + 1) }}>{children}</SettingsContext.Provider>;
}

export const useStoreSettings = () => useContext(SettingsContext);
export function whatsappLink(number: string, message?: string) {
  const digits = number.replace(/\D/g, '');
  const international = digits.length === 9 ? `51${digits}` : digits;
  return `https://wa.me/${international || defaults.whatsapp}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
}
