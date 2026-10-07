import { supabaseAdmin } from '../config/supabase';
import { AppError } from '../utils/errors';

export class OrderService {
  private generateOrderNumber(type: string): string {
    const prefix = type === 'bulk' ? 'BLK' : 'ORD';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ND-${prefix}-${timestamp}-${random}`;
  }

  private generateBillNumber(): string {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `BILL-${timestamp}-${random}`;
  }

  async createNormalOrder(
    userId: string,
    customerData: {
      customer_name: string;
      customer_phone: string;
      customer_notes?: string;
      delivery_address_snapshot?: any;
    }
  ) {
    // 1. Load cart and items
    const { data: cart, error: cartError } = await supabaseAdmin
      .from('carts')
      .select('id')
      .eq('profile_id', userId)
      .single();

    if (cartError || !cart) {
      throw new AppError('Cart not found', 400, 'BAD_REQUEST');
    }

    const { data: cartItems, error: itemsError } = await supabaseAdmin
      .from('cart_items')
      .select(`
        id,
        quantity,
        product_id,
        option_id,
        products (id, name, price, is_available),
        product_options (id, name, price, is_active, product_id)
      `)
      .eq('cart_id', cart.id);

    if (itemsError) throw new AppError('Failed to retrieve cart items', 500, 'INTERNAL_ERROR');
    if (!cartItems || cartItems.length === 0) {
      throw new AppError('Cannot create an order with an empty cart', 400, 'BAD_REQUEST');
    }

    // 2. Validate availability and calculate totals
    let subtotal = 0;
    const orderItemsPayload: any[] = [];

    for (const item of cartItems as any[]) {
      if (!item.products.is_available) {
        throw new AppError(`Product ${item.products.name} is currently unavailable`, 400, 'BAD_REQUEST');
      }
      
      let optionPrice = 0;
      let optionName = null;

      if (item.option_id) {
        if (!item.product_options || !item.product_options.is_active) {
          throw new AppError(`Selected option is unavailable for ${item.products.name}`, 400, 'BAD_REQUEST');
        }
        if (item.product_options.product_id !== item.product_id) {
          throw new AppError(`Option mismatch for ${item.products.name}`, 400, 'BAD_REQUEST');
        }
        optionPrice = Number(item.product_options.price);
        optionName = item.product_options.name;
      }

      const unitPrice = Number(item.products.price);
      const lineTotal = (unitPrice + optionPrice) * item.quantity;
      subtotal += lineTotal;

      orderItemsPayload.push({
        product_id: item.product_id,
        product_name_snapshot: item.products.name,
        unit_price_snapshot: unitPrice,
        quantity: item.quantity,
        option_name_snapshot: optionName,
        option_price_snapshot: optionPrice,
        line_total: lineTotal
      });
    }

    const applicableCharges = 0; // Simplified for now
    const total = subtotal + applicableCharges;
    const orderNumber = this.generateOrderNumber('normal');

    // 3. Create Order
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        profile_id: userId,
        order_number: orderNumber,
        type: 'normal',
        status: 'pending',
        subtotal,
        applicable_charges: applicableCharges,
        total,
        customer_name_snapshot: customerData.customer_name,
        customer_phone_snapshot: customerData.customer_phone,
        customer_notes: customerData.customer_notes,
        delivery_address_snapshot: customerData.delivery_address_snapshot || null
      })
      .select()
      .single();

    if (orderError) throw new AppError('Failed to create order', 500, 'INTERNAL_ERROR');

    // 4. Create Order Items
    const itemsToInsert = orderItemsPayload.map(item => ({
      ...item,
      order_id: order.id
    }));

    const { error: insertItemsError } = await supabaseAdmin
      .from('order_items')
      .insert(itemsToInsert);

    if (insertItemsError) {
      // Rollback
      await supabaseAdmin.from('orders').delete().eq('id', order.id);
      throw new AppError('Failed to insert order items', 500, 'INTERNAL_ERROR');
    }

    // 5. Create Bill
    const { error: billError } = await supabaseAdmin
      .from('bills')
      .insert({
        order_id: order.id,
        bill_number: this.generateBillNumber(),
        amount: total,
        status: 'generated'
      });

    if (billError) {
      // Rollback
      await supabaseAdmin.from('orders').delete().eq('id', order.id);
      throw new AppError('Failed to generate bill', 500, 'INTERNAL_ERROR');
    }

    // 6. Clear Cart
    await supabaseAdmin.from('cart_items').delete().eq('cart_id', cart.id);

    // 7. Create Notification
    await supabaseAdmin.from('notifications').insert({
      profile_id: userId,
      title: 'Order Placed Successfully',
      message: `Your order ${orderNumber} has been received.`,
      type: 'order_update'
    });

    return order;
  }

  async createBulkOrder(
    userId: string,
    payload: {
      customer_name: string;
      customer_phone: string;
      customer_notes?: string;
      event_date: string;
      event_time: string;
      items: {
        product_id: string;
        option_id?: string | null;
        option_name?: string | null;
        quantity: number;
      }[];
    }
  ) {
    if (payload.items.length === 0) {
      throw new AppError('Cannot create a bulk order with no items', 400, 'BAD_REQUEST');
    }

    // Load all products and options for validation
    const productIds = payload.items.map(i => i.product_id);
    const { data: products, error: productsError } = await supabaseAdmin
      .from('products')
      .select('id, name, price, is_available')
      .in('id', productIds);

    if (productsError || !products) throw new AppError('Failed to load products', 500, 'INTERNAL_ERROR');

    const { data: options, error: optionsError } = await supabaseAdmin
      .from('product_options')
      .select('id, name, price, is_active, product_id')
      .in('product_id', productIds);

    if (optionsError) throw new AppError('Failed to load options', 500, 'INTERNAL_ERROR');

    let subtotal = 0;
    const orderItemsPayload: any[] = [];

    for (const item of payload.items) {
      const product = products.find(p => p.id === item.product_id);
      if (!product) throw new AppError(`Invalid product ID: ${item.product_id}`, 400, 'BAD_REQUEST');
      if (!product.is_available) throw new AppError(`Product ${product.name} is unavailable`, 400, 'BAD_REQUEST');

      let optionPrice = 0;
      let optionName = null;

      if (item.option_id || item.option_name) {
        let option;
        if (item.option_id) {
          option = options?.find(o => o.id === item.option_id);
        } else if (item.option_name) {
          option = options?.find(o => o.name === item.option_name && o.product_id === product.id);
        }

        if (!option) throw new AppError(`Invalid option for ${product.name}`, 400, 'BAD_REQUEST');
        if (!option.is_active) throw new AppError(`Selected option is unavailable for ${product.name}`, 400, 'BAD_REQUEST');
        if (option.product_id !== product.id) throw new AppError(`Option mismatch for ${product.name}`, 400, 'BAD_REQUEST');
        
        optionPrice = Number(option.price);
        optionName = option.name;
      }

      const unitPrice = Number(product.price);
      const lineTotal = (unitPrice + optionPrice) * item.quantity;
      subtotal += lineTotal;

      orderItemsPayload.push({
        product_id: product.id,
        product_name_snapshot: product.name,
        unit_price_snapshot: unitPrice,
        quantity: item.quantity,
        option_name_snapshot: optionName,
        option_price_snapshot: optionPrice,
        line_total: lineTotal
      });
    }

    const applicableCharges = 0; 
    const total = subtotal + applicableCharges;
    const orderNumber = this.generateOrderNumber('bulk');

    // Create Order
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        profile_id: userId,
        order_number: orderNumber,
        type: 'bulk',
        status: 'pending',
        subtotal,
        applicable_charges: applicableCharges,
        total,
        customer_name_snapshot: payload.customer_name,
        customer_phone_snapshot: payload.customer_phone,
        customer_notes: payload.customer_notes,
        event_date: payload.event_date,
        event_time: payload.event_time
      })
      .select()
      .single();

    if (orderError) throw new AppError('Failed to create bulk order', 500, 'INTERNAL_ERROR');

    // Create Order Items
    const itemsToInsert = orderItemsPayload.map(item => ({
      ...item,
      order_id: order.id
    }));

    const { error: insertItemsError } = await supabaseAdmin
      .from('order_items')
      .insert(itemsToInsert);

    if (insertItemsError) {
      await supabaseAdmin.from('orders').delete().eq('id', order.id);
      throw new AppError('Failed to insert bulk order items', 500, 'INTERNAL_ERROR');
    }

    // Create Bill
    const { error: billError } = await supabaseAdmin
      .from('bills')
      .insert({
        order_id: order.id,
        bill_number: this.generateBillNumber(),
        amount: total,
        status: 'generated'
      });

    if (billError) {
      await supabaseAdmin.from('orders').delete().eq('id', order.id);
      throw new AppError('Failed to generate bill', 500, 'INTERNAL_ERROR');
    }

    // Notification
    await supabaseAdmin.from('notifications').insert({
      profile_id: userId,
      title: 'Bulk Order Placed Successfully',
      message: `Your bulk order ${orderNumber} has been received.`,
      type: 'order_update'
    });

    return order;
  }

  async getOrder(userId: string, orderId: string) {
    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .select(`
        *,
        order_items (*),
        bills (*)
      `)
      .eq('id', orderId)
      .eq('profile_id', userId)
      .single();

    if (error || !order) {
      throw new AppError('Order not found', 404, 'NOT_FOUND');
    }
    return order;
  }

  async getOrders(userId: string) {
    const { data: orders, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('profile_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw new AppError('Failed to fetch orders', 500, 'INTERNAL_ERROR');
    return orders;
  }

  async getBill(userId: string, orderId: string) {
    // Verify ownership via order
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('id')
      .eq('id', orderId)
      .eq('profile_id', userId)
      .single();

    if (orderError || !order) {
      throw new AppError('Order not found', 404, 'NOT_FOUND');
    }

    const { data: bill, error: billError } = await supabaseAdmin
      .from('bills')
      .select('*')
      .eq('order_id', orderId)
      .single();

    if (billError || !bill) {
      throw new AppError('Bill not found', 404, 'NOT_FOUND');
    }
    return bill;
  }
}

export const orderService = new OrderService();
