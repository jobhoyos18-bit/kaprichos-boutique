export interface Product {
  product_images?: ProductImage[];
  id: string;
  name: string;
  slug: string;
  description: string;
  category_id: string;
  price: number;
  old_price?: number;
  is_new: boolean;
  is_featured: boolean;
  stock: number;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  is_main: boolean;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  size: string;
  color: string;
  stock: number;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string;
  is_approved: boolean;
  created_at: string;
}

export interface Profile {
  id: string;
  full_name: string;
  avatar_url?: string;
  role: 'customer' | 'admin';
}
