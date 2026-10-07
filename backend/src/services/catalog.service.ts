import { supabaseAdmin } from '../config/supabase';
import { NotFoundError } from '../utils/errors';

export class CatalogService {
  async getCategories() {
    const { data, error } = await supabaseAdmin
      .from('categories')
      .select('id, name, slug, description, display_order')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) throw new Error(error.message);
    return data;
  }

  async getProducts() {
    // Select product options as well to map them
    const { data, error } = await supabaseAdmin
      .from('products')
      .select(`
        id, name, slug, description, price, image, category_id, display_order,
        categories!inner(name),
        product_options(id, name, price)
      `)
      .eq('is_available', true)
      .eq('product_options.is_active', true)
      .order('display_order', { ascending: true });

    if (error) throw new Error(error.message);
    
    // Map to frontend shape
    return data.map((item: any) => ({
      id: item.slug, // Frontend uses slug as ID generally, wait! Frontend `id` is slug
      name: item.name,
      slug: item.slug,
      price: Number(item.price),
      category: Array.isArray(item.categories) ? item.categories[0]?.name : (item.categories as any)?.name,
      description: item.description,
      image: item.image,
      available: true,
      // Map options
      options: item.product_options.map((opt: any) => ({
        id: opt.id,
        name: opt.name,
        price: Number(opt.price)
      }))
    }));
  }

  async getProductBySlug(slug: string) {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select(`
        id, name, slug, description, price, image, category_id, display_order, is_available,
        categories!inner(name),
        product_options(id, name, price)
      `)
      .eq('slug', slug)
      .eq('product_options.is_active', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') throw new NotFoundError('Product not found');
      throw new Error(error.message);
    }
    
    if (!data.is_available) {
      throw new NotFoundError('Product is currently unavailable');
    }

    return {
      id: data.slug,
      name: data.name,
      slug: data.slug,
      price: Number(data.price),
      category: Array.isArray(data.categories) ? data.categories[0]?.name : (data.categories as any)?.name,
      description: data.description,
      image: data.image,
      available: data.is_available,
      options: data.product_options.map((opt: any) => ({
        id: opt.id,
        name: opt.name,
        price: Number(opt.price)
      }))
    };
  }

  async getProductsByCategorySlug(categorySlug: string) {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select(`
        id, name, slug, description, price, image, category_id, display_order,
        categories!inner(name, slug),
        product_options(id, name, price)
      `)
      .eq('categories.slug', categorySlug)
      .eq('is_available', true)
      .eq('product_options.is_active', true)
      .order('display_order', { ascending: true });

    if (error) throw new Error(error.message);

    return data.map((item: any) => ({
      id: item.slug,
      name: item.name,
      slug: item.slug,
      price: Number(item.price),
      category: Array.isArray(item.categories) ? item.categories[0]?.name : (item.categories as any)?.name,
      description: item.description,
      image: item.image,
      available: true,
      options: item.product_options.map((opt: any) => ({
        id: opt.id,
        name: opt.name,
        price: Number(opt.price)
      }))
    }));
  }
}

export const catalogService = new CatalogService();
