import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Product, ProductVariant, ProductImage, Review } from '../types';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';

const ProductDetail: React.FC = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductData();
    fetchUser();
  }, [slug]);

  const fetchUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUserId(user?.id || null);
  };

  const fetchProductData = async () => {
    try {
      const { data: productData, error: pError } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .single();

      if (pError) throw pError;
      setProduct(productData);

      const { data: imagesData } = await supabase
        .from('product_images')
        .select('*')
        .eq('product_id', productData.id);
      setImages(imagesData || []);

      const { data: variantsData } = await supabase
        .from('product_variants')
        .select('*')
        .eq('product_id', productData.id);
      setVariants(variantsData || []);

      fetchReviews(productData.id);
    } catch (error) {
      console.error('Error fetching product details:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async (productId: string) => {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', productId)
      .eq('is_approved', true)
      .order('created_at', { ascending: false });
    if (!error) setReviews(data || []);
  };

  const handleWhatsAppOrder = () => {
    if (!product) return;
    const message = `Hola KAPRICHO'S BOUTIQUE! Me interesa el producto:
*${product.name}*
Talla: ${selectedSize || 'No seleccionada'}
Color: ${selectedColor || 'No seleccionado'}
¿Está disponible?`;
    window.open(`https://wa.me/51950124807?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><div className="w-8 h-8 border-4 border-brand-pink border-t-brand-gold rounded-full animate-spin" /></div>;
  if (!product) return <div className="text-center py-20"><h2 className="text-2xl font-serif text-brand-chocolate">Producto no encontrado</h2></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="lg:w-1/2">
          <div className="sticky top-24">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="aspect-[3/4] bg-brand-cream rounded-3xl overflow-hidden border border-brand-pink/20 mb-4">
              {images.length > 0 ? <img src={images[0].url} alt={product.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-brand-chocolate/20 font-serif italic">Imagen del Producto</div>}
            </motion.div>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <div key={img.id} className={`w-20 h-20 rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${idx === 0 ? 'border-brand-gold' : 'border-transparent'}`}><img src={img.url} alt={`${product.name} ${idx}`} className="w-full h-full object-cover" /></div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:w-1/2">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-6">
            <div>
              <div className="flex justify-between items-start mb-2">
                <h1 className="text-3xl md:text-4xl font-serif text-brand-chocolate leading-tight">{product.name}</h1>
                <button className="p-3 bg-white rounded-full text-brand-chocolate hover:text-brand-pink transition-colors border border-brand-pink/20"><Heart size={20} /></button>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-brand-gold">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill={i < (reviews.length > 0 ? 4 : 0) ? "currentColor" : "none"} />)}
                </div>
                <span className="text-sm text-brand-chocolate/60 font-sans">({reviews.length} Reseñas)</span>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-2xl font-bold text-brand-chocolate">S/. {product.price}</span>
              {product.old_price && <span className="text-lg text-brand-chocolate/40 line-through">S/. {product.old_price}</span>}
            </div>

            <p className="text-brand-chocolate/70 font-sans leading-relaxed mb-8">{product.description || "Descripción detallada del producto."}</p>

            <div className="space-y-6 mb-8">
              <div>
                <label className="block text-xs uppercase tracking-widest text-brand-chocolate/60 mb-3 font-sans font-semibold">Selecciona Talla</label>
                <div className="flex flex-wrap gap-3">
                  {variants.length > 0 ? [...new Set(variants.map(v => v.size))].map(size => (
                    <button key={size} onClick={() => setSelectedSize(size || '')} className={`px-4 py-2 rounded-lg border transition-all font-sans text-sm ${selectedSize === size ? 'bg-brand-chocolate text-brand-cream border-brand-chocolate' : 'bg-white text-brand-chocolate border-brand-pink/30 hover:border-brand-gold'}`}>{size}</button>
                  )) : <span className="text-sm text-brand-chocolate/40 italic">No hay tallas disponibles</span>}
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-brand-chocolate/60 mb-3 font-sans font-semibold">Selecciona Color</label>
                <div className="flex flex-wrap gap-3">
                  {variants.length > 0 ? [...new Set(variants.map(v => v.color))].map(color => (
                    <button key={color} onClick={() => setSelectedColor(color || '')} className={`px-4 py-2 rounded-lg border transition-all font-sans text-sm ${selectedColor === color ? 'bg-brand-chocolate text-brand-cream border-brand-chocolate' : 'bg-white text-brand-chocolate border-brand-pink/30 hover:border-brand-gold'}`}>{color}</button>
                  )) : <span className="text-sm text-brand-chocolate/40 italic">No hay colores disponibles</span>}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 mb-12">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleWhatsAppOrder} className="w-full py-4 bg-brand-chocolate text-brand-cream rounded-2xl font-sans uppercase tracking-widest text-sm hover:bg-brand-gold transition-all shadow-xl flex items-center justify-center gap-3">
                <MessageCircle size={20} /> Pedir por WhatsApp
              </motion.button>
              <p className="text-center text-xs text-brand-chocolate/40 font-sans">Envíos a todo el Perú mediante agencias.</p>
            </div>

            {/* REVIEWS SECTION */}
            <div className="border-t border-brand-pink/30 pt-12">
              <h3 className="text-2xl font-serif text-brand-chocolate mb-8">Opiniones de nuestras clientas</h3>
              <div className="flex flex-col gap-8">
                {userId ? (
                  <ReviewForm productId={product.id} userId={userId} onReviewSubmitted={() => fetchReviews(product.id)} />
                ) : (
                  <div className="p-4 bg-brand-cream rounded-2xl text-center border border-brand-pink/20">
                    <p className="text-sm text-brand-chocolate/60 font-sans mb-3">Inicia sesión para dejar tu reseña</p>
                    <button onClick={() => window.location.href='/login'} className="text-brand-chocolate font-bold text-sm underline underline-offset-4">Iniciar sesión</button>
                  </div>
                )}
                <ReviewList reviews={reviews} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
