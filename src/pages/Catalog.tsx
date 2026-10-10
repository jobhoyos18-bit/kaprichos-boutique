import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Filter, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Category, Product } from '../types';
import ProductCard from '../components/ProductCard';

type Filters = { category: string; minPrice: string; maxPrice: string };
const emptyFilters: Filters = { category: '', minPrice: '', maxPrice: '' };
export default function Catalog({ collection = 'all' }: { collection?: 'all' | 'offers' | 'new' }) {
  const [params, setParams] = useSearchParams();
  const category = params.get('categoria') || '';
  const minPrice = params.get('min') || '';
  const maxPrice = params.get('max') || '';
  const [draft, setDraft] = useState<Filters>(emptyFilters);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterError, setFilterError] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [retry, setRetry] = useState(0);
  const title = collection === 'offers' ? 'Ofertas especiales' : collection === 'new' ? 'Nuevas colecciones' : 'Nuestro catálogo';

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    const timer = window.setTimeout(() => controller.abort(), 12000);
    setLoading(true);
    setError('');
    void (async () => {
      try {
        const { data: cats, error: categoryError } = await supabase.from('categories').select('*').order('name').abortSignal(controller.signal);
        if (categoryError) throw categoryError;
        if (!active) return;
        setCategories(cats || []);
        const selected = cats?.find(cat => cat.slug === category);
        if (category && !selected) { setProducts([]); return; }
        let query = supabase.from('products').select('*,product_images(*)').order('created_at', { ascending: false });
        if (selected) query = query.eq('category_id', selected.id);
        if (minPrice && Number.isFinite(Number(minPrice))) query = query.gte('price', Math.max(0, Number(minPrice)));
        if (maxPrice && Number.isFinite(Number(maxPrice))) query = query.lte('price', Math.max(0, Number(maxPrice)));
        if (collection === 'new') query = query.eq('is_new', true);
        if (collection === 'offers') query = query.not('old_price', 'is', null);
        const { data, error: productError } = await query.abortSignal(controller.signal);
        if (productError) throw productError;
        const rows = (data || []) as Product[];
        if (active) setProducts(collection === 'offers' ? rows.filter(product => Number(product.old_price) > Number(product.price)) : rows);
      } catch {
        if (active) { setProducts([]); setError('No pudimos cargar los productos. Revisa tu conexión e inténtalo de nuevo.'); }
      } finally {
        window.clearTimeout(timer);
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; controller.abort(); window.clearTimeout(timer); };
  }, [category, minPrice, maxPrice, collection, retry]);

  useEffect(() => {
    if (!isFilterOpen) return;
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') setIsFilterOpen(false); };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [isFilterOpen]);

  function apply(event: React.FormEvent) {
    event.preventDefault();
    if (draft.minPrice && draft.maxPrice && Number(draft.minPrice) > Number(draft.maxPrice)) {
      setFilterError('El precio mínimo no puede superar al máximo.'); return;
    }
    const next = new URLSearchParams();
    if (draft.category) next.set('categoria', draft.category);
    if (draft.minPrice) next.set('min', draft.minPrice);
    if (draft.maxPrice) next.set('max', draft.maxPrice);
    setParams(next);
    setIsFilterOpen(false);
  }
  const control = 'w-full min-h-12 p-3 rounded-xl border border-brand-pink bg-white';
  return <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
      <h1 className="text-3xl md:text-4xl font-serif">{title}</h1>
      <button onClick={() => { setDraft({ category, minPrice, maxPrice }); setFilterError(''); setIsFilterOpen(true); }} className="flex items-center gap-2 min-h-12 px-5 rounded-full bg-white border border-brand-pink"><Filter size={18} /> Filtrar</button>
    </div>
    {category && <p className="mb-6">Categoría: {categories.find(cat => cat.slug === category)?.name || category}</p>}
    {isFilterOpen && <div className="fixed inset-0 z-[70] bg-black/30 flex justify-end" onClick={() => setIsFilterOpen(false)}>
      <section role="dialog" aria-modal="true" aria-labelledby="filter-title" onClick={event => event.stopPropagation()} className="h-full w-full max-w-sm bg-brand-cream p-6 overflow-y-auto shadow-xl">
        <div className="flex justify-between items-center mb-8"><h2 id="filter-title" className="text-2xl">Filtros</h2><button aria-label="Cerrar filtros" onClick={() => setIsFilterOpen(false)} className="p-3"><X /></button></div>
        <form onSubmit={apply} className="space-y-6">
          <label className="block">Categoría<select autoFocus value={draft.category} onChange={event => setDraft({ ...draft, category: event.target.value })} className={control}>
            <option value="">Todas</option>
            {category && !categories.some(cat => cat.slug === category) && <option value={category}>{category}</option>}
            {categories.map(cat => <option key={cat.id} value={cat.slug}>{cat.name}</option>)}
          </select></label>
          <div className="grid grid-cols-2 gap-3">
            <label>Precio mín.<input type="number" min="0" step="0.01" value={draft.minPrice} onChange={event => setDraft({ ...draft, minPrice: event.target.value })} className={control} /></label>
            <label>Precio máx.<input type="number" min="0" step="0.01" value={draft.maxPrice} onChange={event => setDraft({ ...draft, maxPrice: event.target.value })} className={control} /></label>
          </div>
          {filterError && <p role="alert" className="text-red-700">{filterError}</p>}
          <button type="button" onClick={() => { setDraft(emptyFilters); setFilterError(''); }} className="w-full min-h-12 underline">Limpiar filtros</button>
          <button type="submit" className="w-full min-h-12 bg-brand-chocolate text-brand-cream rounded-xl">Aplicar filtros</button>
        </form>
      </section>
    </div>}
    {loading ? <p role="status" className="py-20 text-center">Cargando productos…</p> : error ? <div role="alert" className="text-center py-16 space-y-5"><p>{error}</p><button onClick={() => setRetry(value => value + 1)} className="min-h-12 px-6 rounded-full bg-brand-chocolate text-white">Volver a cargar</button></div> : products.length ? <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">{products.map(product => <ProductCard key={product.id} product={product} />)}</div> : <div className="text-center py-20 space-y-5">
      <h2 className="text-2xl">No hay productos en esta selección</h2><p>Prueba otra categoría o visita el catálogo completo.</p>
      <Link to="/catalogo" onClick={() => { if (collection === 'all') { setParams({}); setRetry(value => value + 1); } }} className="inline-flex items-center min-h-12 px-6 rounded-full bg-brand-chocolate text-white">Ver todo el catálogo</Link>
    </div>}
  </section>;
}
