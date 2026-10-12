export interface ProductOption {
  id?: string;
  name: string;
  price: number;
  product_id?: string;
}

export interface Product {
  id: string;
  category_id?: string;
  slug: string;
  name: string;
  price: number;
  category: string;
  description?: string;
  image?: string;
  is_available?: boolean;
  options?: ProductOption[];
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
}

export interface OrderItem {
  id?: string;
  order_id?: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  option_id?: string;
  option_name?: string;
}

export interface Order {
  id: string;
  user_id?: string;
  order_number: string;
  status: string;
  total_amount: number;
  order_type: string;
  customer_name?: string;
  customer_phone?: string;
  event_date?: string;
  event_time?: string;
  created_at: string;
  order_items?: OrderItem[];
}
