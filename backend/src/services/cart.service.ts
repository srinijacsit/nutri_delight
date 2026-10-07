import { supabaseAdmin } from '../config/supabase';
import { NotFoundError, ValidationError } from '../utils/errors';

export class CartService {
  async getOrCreateCart(userId: string) {
    let { data: cart } = await supabaseAdmin
      .from('carts')
      .select('id')
      .eq('profile_id', userId)
      .single();

    if (!cart) {
      const { data: newCart, error } = await supabaseAdmin
        .from('carts')
        .insert([{ profile_id: userId }])
        .select('id')
        .single();
        
      if (error) throw new Error(error.message);
      cart = newCart;
    }
    
    return cart.id;
  }

  async getCart(userId: string) {
    const cartId = await this.getOrCreateCart(userId);

    // Fetch cart items with product and option details
    const { data: items, error } = await supabaseAdmin
      .from('cart_items')
      .select(`
        id,
        quantity,
        products!inner(id, name, slug, price, is_available, image, categories!inner(name)),
        product_options(id, name, price, is_active)
      `)
      .eq('cart_id', cartId);

    if (error) throw new Error(error.message);

    let subtotal = 0;
    
    const formattedItems = items.map((item: any) => {
      const productPrice = Number(item.products.price);
      const optionPrice = item.product_options ? Number(item.product_options.price) : 0;
      const unitPrice = productPrice + optionPrice;
      const lineTotal = unitPrice * item.quantity;
      
      subtotal += lineTotal;

      return {
        id: item.id,
        quantity: item.quantity,
        unitPrice,
        lineTotal,
        product: {
          id: item.products.id,
          name: item.products.name,
          slug: item.products.slug,
          price: productPrice,
          category: item.products.categories.name,
          image: item.products.image,
          available: item.products.is_available
        },
        option: item.product_options ? {
          id: item.product_options.id,
          name: item.product_options.name,
          price: optionPrice,
          active: item.product_options.is_active
        } : null
      };
    });

    return {
      cartId,
      items: formattedItems,
      subtotal,
      total: subtotal // For now total is subtotal, applicable_charges can be added later
    };
  }

  async addItem(userId: string, productId: string, quantity: number, optionId?: string) {
    // 1. Validate Product
    const { data: product, error: productError } = await supabaseAdmin
      .from('products')
      .select('id, is_available')
      .eq('id', productId)
      .single();

    if (productError || !product) throw new NotFoundError('Product not found');
    if (!product.is_available) throw new ValidationError('Product is currently unavailable');

    // 2. Validate Option if provided
    if (optionId) {
      const { data: option, error: optionError } = await supabaseAdmin
        .from('product_options')
        .select('id, product_id, is_active')
        .eq('id', optionId)
        .single();
        
      if (optionError || !option) throw new NotFoundError('Product option not found');
      if (option.product_id !== productId) throw new ValidationError('Option does not belong to this product');
      if (!option.is_active) throw new ValidationError('Option is currently unavailable');
    }

    // 3. Add to cart
    const cartId = await this.getOrCreateCart(userId);

    // Upsert mechanism to handle UNIQUE constraint (cart_id, product_id, option_id)
    const { data: existingItem } = await supabaseAdmin
      .from('cart_items')
      .select('id, quantity')
      .eq('cart_id', cartId)
      .eq('product_id', productId)
      .is('option_id', optionId || null)
      .single();

    if (existingItem) {
      // Update quantity
      const { data, error } = await supabaseAdmin
        .from('cart_items')
        .update({ quantity: existingItem.quantity + quantity })
        .eq('id', existingItem.id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data;
    } else {
      // Insert new
      const { data, error } = await supabaseAdmin
        .from('cart_items')
        .insert([{
          cart_id: cartId,
          product_id: productId,
          option_id: optionId || null,
          quantity
        }])
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data;
    }
  }

  async updateItemQuantity(userId: string, itemId: string, quantity: number) {
    const cartId = await this.getOrCreateCart(userId);

    const { data, error } = await supabaseAdmin
      .from('cart_items')
      .update({ quantity })
      .eq('id', itemId)
      .eq('cart_id', cartId) // Enforce ownership implicitly via cartId
      .select()
      .single();

    if (error) throw new Error(error.message);
    if (!data) throw new NotFoundError('Cart item not found');

    return data;
  }

  async removeItem(userId: string, itemId: string) {
    const cartId = await this.getOrCreateCart(userId);

    const { data, error } = await supabaseAdmin
      .from('cart_items')
      .delete()
      .eq('id', itemId)
      .eq('cart_id', cartId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    if (!data) throw new NotFoundError('Cart item not found');

    return { success: true };
  }

  async clearCart(userId: string) {
    const cartId = await this.getOrCreateCart(userId);

    const { error } = await supabaseAdmin
      .from('cart_items')
      .delete()
      .eq('cart_id', cartId);

    if (error) throw new Error(error.message);

    return { success: true };
  }
}

export const cartService = new CartService();
