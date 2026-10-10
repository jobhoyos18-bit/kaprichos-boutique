import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play, Shirt, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Product } from '../types';

type BestSeller = Pick<Product, 'id' | 'name' | 'slug' | 'price' | 'old_price'> & {
  product_images: { url: string; is_main: boolean }[];
};

const money = new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' });
const SPEED = 18; // Pixels per second: a gentle, continuous movement on every screen.
const placeholders = [0, 1, 2, 3];

export default function BestSellersCarousel() {
  const [products, setProducts] = useState<BestSeller[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [retry, setRetry] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(!document.hidden);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [copies, setCopies] = useState(3);
  const viewportRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const cycleWidth = useRef(0);
  const position = useRef(0);
  const pointerDown = useRef(false);
  const holdUntil = useRef(0);
  const itemCount = products.length || placeholders.length;
  const repeat = !reducedMotion && itemCount > 1;
  const running = repeat && !paused && !hovered && !focused && inView && pageVisible;

  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 10000);
    let active = true;
    setLoading(true);
    setFailed(false);
    async function loadProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('id,name,slug,price,old_price,product_images(url,is_main)')
          .eq('is_featured', true)
          .gt('stock', 0)
          .order('created_at', { ascending: false })
          .limit(12)
          .abortSignal(controller.signal);
        if (error) throw error;
        if (active) setProducts((data ?? []) as BestSeller[]);
      } catch {
        if (active) setFailed(true);
      } finally {
        window.clearTimeout(timeout);
        if (active) setLoading(false);
      }
    }
    void loadProducts();
    return () => {
      active = false;
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [retry]);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotion = () => setReducedMotion(media.matches);
    const handleVisibility = () => setPageVisible(!document.hidden);
    const releasePointer = () => {
      if (pointerDown.current) holdUntil.current = performance.now() + 1800;
      pointerDown.current = false;
    };
    media.addEventListener('change', handleMotion);
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('pointerup', releasePointer);
    window.addEventListener('pointercancel', releasePointer);
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.05 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      observer.disconnect();
      media.removeEventListener('change', handleMotion);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('pointerup', releasePointer);
      window.removeEventListener('pointercancel', releasePointer);
    };
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    const group = groupRef.current;
    if (!viewport || !group) return;
    const measure = () => {
      const width = group.getBoundingClientRect().width;
      if (!width) return;
      const previousWidth = cycleWidth.current;
      const progress = previousWidth ? (viewport.scrollLeft % previousWidth) / previousWidth : 0;
      cycleWidth.current = width;
      setCopies(repeat ? Math.max(3, Math.ceil(viewport.clientWidth / width) + 2) : 1);
      position.current = repeat ? width + progress * width : 0;
      viewport.scrollLeft = position.current;
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    observer.observe(group);
    return () => observer.disconnect();
  }, [itemCount, repeat, copies]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || !running) return;
    let frame = 0;
    let previous = performance.now();
    position.current = viewport.scrollLeft;
    const move = (now: number) => {
      const elapsed = Math.min(now - previous, 50);
      previous = now;
      if (pointerDown.current || now < holdUntil.current) {
        position.current = viewport.scrollLeft;
      } else if (cycleWidth.current > 0) {
        // Keep fractional progress so slow motion also works at high refresh rates.
        position.current += SPEED * elapsed / 1000;
        if (position.current >= cycleWidth.current * 2) position.current -= cycleWidth.current;
        viewport.scrollLeft = position.current;
      }
      frame = requestAnimationFrame(move);
    };
    frame = requestAnimationFrame(move);
    return () => cancelAnimationFrame(frame);
  }, [running, copies, itemCount]);

  function normalizeScroll() {
    const viewport = viewportRef.current;
    const width = cycleWidth.current;
    if (!viewport || !repeat || !width) return;
    if (viewport.scrollLeft < width * 0.25) {
      viewport.scrollLeft += width;
      position.current = viewport.scrollLeft;
    } else if (viewport.scrollLeft >= width * 2) {
      viewport.scrollLeft -= width;
      position.current = viewport.scrollLeft;
    }
  }

  function step(direction: number) {
    const viewport = viewportRef.current;
    if (!viewport) return;
    holdUntil.current = performance.now() + 3000;
    viewport.scrollBy({ left: direction * cycleWidth.current / itemCount, behavior: reducedMotion ? 'instant' : 'smooth' });
  }

  return (
    <section ref={sectionRef} className="bestsellers" aria-labelledby="bestsellers-title" aria-roledescription="carrusel">
      <div className="bestsellers-heading">
        <div>
          <p className="bestsellers-eyebrow"><Sparkles size={14} aria-hidden="true" /> Selección Kapricho's</p>
          <h2 id="bestsellers-title">Los más vendidos</h2>
          <p className="bestsellers-description">
            {loading ? 'Preparando nuestra selección…' : products.length ? 'Encuentra tu próximo kapricho.' : failed ? 'Nuestra selección estará disponible pronto.' : 'Muy pronto, los favoritos de nuestra boutique estarán aquí.'}
          </p>
        </div>
        <div className="bestsellers-controls" aria-label="Controles del carrusel">
          <button type="button" onClick={() => step(-1)} aria-label="Ver artículos anteriores"><ChevronLeft size={19} /></button>
          {!reducedMotion && itemCount > 1 && (
            <button type="button" onClick={() => setPaused(value => !value)} aria-label={paused ? 'Reanudar movimiento automático' : 'Pausar movimiento automático'}>
              {paused ? <Play size={16} /> : <Pause size={16} />}
            </button>
          )}
          <button type="button" onClick={() => step(1)} aria-label="Ver artículos siguientes"><ChevronRight size={19} /></button>
        </div>
      </div>

      <div
        ref={viewportRef}
        className="bestsellers-viewport"
        role="group"
        aria-label="Artículos más vendidos. Desliza para explorar."
        onScroll={normalizeScroll}
        onPointerDown={() => { pointerDown.current = true; }}
        onPointerEnter={event => { if (event.pointerType === 'mouse') setHovered(true); }}
        onPointerLeave={() => setHovered(false)}
        onWheel={() => { holdUntil.current = performance.now() + 1800; }}
        onFocusCapture={() => setFocused(true)}
        onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false); }}
      >
        <div className="bestsellers-track">
          {Array.from({ length: repeat ? copies : 1 }, (_, copy) => {
            const duplicate = repeat && copy !== 1;
            return (
              <div key={copy} ref={copy === 0 ? groupRef : undefined} className="bestsellers-group" aria-hidden={duplicate || undefined}>
                {products.length ? products.map(product => {
                  const photo = product.product_images?.find(image => image.is_main)?.url ?? product.product_images?.[0]?.url;
                  return (
                    <Link key={product.id} to={`/producto/${product.slug}`} className="bestseller-card" tabIndex={duplicate ? -1 : 0}>
                      <div className="bestseller-image">
                        <Shirt size={52} strokeWidth={0.8} aria-hidden="true" />
                        {photo && <img src={photo} alt="" loading="lazy" decoding="async" onError={event => { event.currentTarget.style.display = 'none'; }} />}
                        <span className="bestseller-tag">Más vendido</span>
                        <span className="bestseller-open"><ArrowUpRight size={18} aria-hidden="true" /></span>
                      </div>
                      <div className="bestseller-details">
                        <h3>{product.name}</h3>
                        <p>{money.format(product.price)} {product.old_price != null && product.old_price > product.price && <del>{money.format(product.old_price)}</del>}</p>
                      </div>
                    </Link>
                  );
                }) : placeholders.map(slot => (
                  <div key={slot} className={`bestseller-card bestseller-placeholder bestseller-placeholder-${slot}`}>
                    <div className="bestseller-image">
                      <div className="bestseller-placeholder-art"><Shirt size={64} strokeWidth={0.7} aria-hidden="true" /><Sparkles size={22} strokeWidth={1} aria-hidden="true" /></div>
                      <span className="bestseller-tag">Próximamente</span>
                    </div>
                    <div className="bestseller-details"><h3>Tu próximo kapricho</h3><p>Estamos preparando la selección</p></div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      <div className="bestsellers-footer">
        <p>Desliza y descubre</p>
        {failed && <button type="button" onClick={() => setRetry(value => value + 1)}>Volver a cargar</button>}
        <Link to="/catalogo">Ver catálogo <ArrowRight size={16} aria-hidden="true" /></Link>
      </div>
    </section>
  );
}
