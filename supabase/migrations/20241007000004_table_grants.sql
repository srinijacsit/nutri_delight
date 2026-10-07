-- Grants Usage to the public schema for the core API roles
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- 1. PUBLIC CATALOG (anon, authenticated)
-- The catalog is public. Users and guests need to read products, categories, and options.
GRANT SELECT ON public.categories TO anon, authenticated;
GRANT SELECT ON public.products TO anon, authenticated;
GRANT SELECT ON public.product_options TO anon, authenticated;

-- 2. CUSTOMER DATA (authenticated)
-- Profiles: Customers view their own profile, update it.
GRANT SELECT, UPDATE ON public.profiles TO authenticated;

-- Addresses: Full CRUD for own addresses.
GRANT SELECT, INSERT, UPDATE, DELETE ON public.addresses TO authenticated;

-- Carts & Cart Items: Full CRUD for own carts and items.
GRANT SELECT, INSERT, UPDATE, DELETE ON public.carts TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cart_items TO authenticated;

-- Orders & Order Items: View and Create. Customers do not delete orders or order items.
GRANT SELECT, INSERT ON public.orders TO authenticated;
GRANT SELECT, INSERT ON public.order_items TO authenticated;

-- Bills: View only.
GRANT SELECT ON public.bills TO authenticated;

-- Notifications: View and mark as read (UPDATE).
GRANT SELECT, UPDATE ON public.notifications TO authenticated;

-- 3. BACKEND SERVICE (service_role)
-- The backend uses a privileged key and requires full CRUD to manage catalog, process orders, sync data, etc.
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_options TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.addresses TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.carts TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cart_items TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.order_items TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bills TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO service_role;
