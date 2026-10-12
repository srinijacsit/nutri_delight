-- 1. Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 2. Admin Helper Function (Security Definer to bypass RLS recursion)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
DECLARE
  v_role text;
BEGIN
  -- Since this is SECURITY DEFINER, it runs with the privileges of the creator
  -- and can read the profiles table directly without getting caught in RLS recursion.
  SELECT role INTO v_role FROM public.profiles WHERE id = auth.uid();
  RETURN coalesce(v_role = 'admin', false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 3. Profiles Policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.is_admin());
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
-- Prevent users from updating their own role
CREATE FUNCTION public.prevent_role_update()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'Users cannot update their own role.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
CREATE TRIGGER enforce_role_update BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.prevent_role_update();
CREATE POLICY "Admins can manage profiles" ON public.profiles FOR ALL USING (public.is_admin());

-- 4. Addresses
CREATE POLICY "Users manage own addresses" ON public.addresses FOR ALL USING (auth.uid() = profile_id);
CREATE POLICY "Admins manage all addresses" ON public.addresses FOR ALL USING (public.is_admin());

-- 5. Categories
CREATE POLICY "Anyone can view active categories" ON public.categories FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Admins manage categories" ON public.categories FOR ALL USING (public.is_admin());

-- 6. Products
CREATE POLICY "Anyone can view active products" ON public.products FOR SELECT USING (is_available = true OR public.is_admin());
CREATE POLICY "Admins manage products" ON public.products FOR ALL USING (public.is_admin());

-- 7. Product Options
CREATE POLICY "Anyone can view active options" ON public.product_options FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Admins manage options" ON public.product_options FOR ALL USING (public.is_admin());

-- 8. Carts & Cart Items
CREATE POLICY "Users manage own carts" ON public.carts FOR ALL USING (auth.uid() = profile_id);
CREATE POLICY "Admins manage carts" ON public.carts FOR ALL USING (public.is_admin());

CREATE POLICY "Users manage own cart items" ON public.cart_items FOR ALL USING (
  cart_id IN (SELECT id FROM public.carts WHERE profile_id = auth.uid())
);
CREATE POLICY "Admins manage cart items" ON public.cart_items FOR ALL USING (public.is_admin());

-- 9. Orders & Order Items
CREATE POLICY "Users view own orders" ON public.orders FOR SELECT USING (auth.uid() = profile_id);
CREATE POLICY "Users can create orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = profile_id OR profile_id IS NULL);
CREATE POLICY "Admins manage orders" ON public.orders FOR ALL USING (public.is_admin());

CREATE POLICY "Users view own order items" ON public.order_items FOR SELECT USING (
  order_id IN (SELECT id FROM public.orders WHERE profile_id = auth.uid())
);
CREATE POLICY "Users can create order items" ON public.order_items FOR INSERT WITH CHECK (
  order_id IN (SELECT id FROM public.orders WHERE profile_id = auth.uid() OR profile_id IS NULL)
);
CREATE POLICY "Admins manage order items" ON public.order_items FOR ALL USING (public.is_admin());

-- 10. Bills
CREATE POLICY "Users view own bills" ON public.bills FOR SELECT USING (
  order_id IN (SELECT id FROM public.orders WHERE profile_id = auth.uid())
);
CREATE POLICY "Admins manage bills" ON public.bills FOR ALL USING (public.is_admin());

-- 11. Notifications
CREATE POLICY "Users view own notifications" ON public.notifications FOR SELECT USING (
  profile_id = auth.uid() OR profile_id IS NULL
);
CREATE POLICY "Admins manage notifications" ON public.notifications FOR ALL USING (public.is_admin());
