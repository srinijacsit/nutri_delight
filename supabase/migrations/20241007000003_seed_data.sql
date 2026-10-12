-- Seed exactly 7 categories
INSERT INTO public.categories (name, slug, display_order) VALUES
('Tea / Coffee', 'tea-coffee', 1),
('Pani Puri', 'pani-puri', 2),
('Healthy Tiffins', 'healthy-tiffins', 3),
('Flavored Milk', 'flavored-milk', 4),
('Fresh Fruit Juices', 'fresh-fruit-juices', 5),
('Evening Snacks', 'evening-snacks', 6),
('3PM Snacks', '3pm-snacks', 7)
ON CONFLICT (slug) DO NOTHING;

-- Seed exactly 33 products
WITH cats AS (SELECT id, slug FROM public.categories)
INSERT INTO public.products (category_id, name, slug, price, display_order) VALUES
-- TEA / COFFEE
((SELECT id FROM cats WHERE slug = 'tea-coffee'), 'Tea', 'tea', 15.00, 1),
((SELECT id FROM cats WHERE slug = 'tea-coffee'), 'Coffee', 'coffee', 25.00, 2),
((SELECT id FROM cats WHERE slug = 'tea-coffee'), 'Green Tea', 'green-tea', 25.00, 3),
((SELECT id FROM cats WHERE slug = 'tea-coffee'), 'Horlicks/Boost', 'horlicks-boost', 25.00, 4),
-- PANI PURI
((SELECT id FROM cats WHERE slug = 'pani-puri'), 'Pani Puri (6)', 'pani-puri-6', 30.00, 1),
((SELECT id FROM cats WHERE slug = 'pani-puri'), 'Pani Puri (Parcel - 10)', 'pani-puri-parcel-10', 60.00, 2),
((SELECT id FROM cats WHERE slug = 'pani-puri'), 'Pani Puri (Parcel - 20)', 'pani-puri-parcel-20', 100.00, 3),
-- HEALTHY TIFFINS
((SELECT id FROM cats WHERE slug = 'healthy-tiffins'), 'Plain Dosa', 'plain-dosa', 30.00, 1),
((SELECT id FROM cats WHERE slug = 'healthy-tiffins'), 'Onion Dosa', 'onion-dosa', 40.00, 2),
((SELECT id FROM cats WHERE slug = 'healthy-tiffins'), 'Raagi Dosa', 'raagi-dosa', 50.00, 3),
((SELECT id FROM cats WHERE slug = 'healthy-tiffins'), 'Multi Millet Dosa', 'multi-millet-dosa', 50.00, 4),
((SELECT id FROM cats WHERE slug = 'healthy-tiffins'), 'Pesarrattu', 'pesarrattu', 50.00, 5),
((SELECT id FROM cats WHERE slug = 'healthy-tiffins'), 'Egg Dosa', 'egg-dosa', 50.00, 6),
((SELECT id FROM cats WHERE slug = 'healthy-tiffins'), 'Double Egg Dosa', 'double-egg-dosa', 60.00, 7),
-- FLAVORED MILK
((SELECT id FROM cats WHERE slug = 'flavored-milk'), 'Badam Milk', 'badam-milk', 50.00, 1),
((SELECT id FROM cats WHERE slug = 'flavored-milk'), 'Rosemilk', 'rosemilk', 50.00, 2),
((SELECT id FROM cats WHERE slug = 'flavored-milk'), 'Pista Milk', 'pista-milk', 60.00, 3),
-- FRESH FRUIT JUICES
((SELECT id FROM cats WHERE slug = 'fresh-fruit-juices'), 'Watermelon', 'watermelon', 40.00, 1),
((SELECT id FROM cats WHERE slug = 'fresh-fruit-juices'), 'Grape', 'grape', 60.00, 2),
((SELECT id FROM cats WHERE slug = 'fresh-fruit-juices'), 'PineApple', 'pineapple', 80.00, 3),
((SELECT id FROM cats WHERE slug = 'fresh-fruit-juices'), 'Kharbuja', 'kharbuja', 50.00, 4),
((SELECT id FROM cats WHERE slug = 'fresh-fruit-juices'), 'SeethaPhal', 'seethaphal', 100.00, 5),
-- EVENING SNACKS
((SELECT id FROM cats WHERE slug = 'evening-snacks'), 'Veg Sandwich', 'veg-sandwich', 60.00, 1),
((SELECT id FROM cats WHERE slug = 'evening-snacks'), 'Chicken Sandwich', 'chicken-sandwich', 100.00, 2),
((SELECT id FROM cats WHERE slug = 'evening-snacks'), 'Paneer Sandwich', 'paneer-sandwich', 90.00, 3),
((SELECT id FROM cats WHERE slug = 'evening-snacks'), 'Egg Roll', 'egg-roll', 50.00, 4),
((SELECT id FROM cats WHERE slug = 'evening-snacks'), 'Paneer Roll', 'paneer-roll', 90.00, 5),
((SELECT id FROM cats WHERE slug = 'evening-snacks'), 'Chicken Roll', 'chicken-roll', 100.00, 6),
((SELECT id FROM cats WHERE slug = 'evening-snacks'), 'Bread Omelette', 'bread-omelette', 60.00, 7),
((SELECT id FROM cats WHERE slug = 'evening-snacks'), 'Double Egg Omelette', 'double-egg-omelette', 50.00, 8),
-- 3PM SNACKS
((SELECT id FROM cats WHERE slug = '3pm-snacks'), 'Minapa Punukulu', 'minapa-punukulu', 30.00, 1),
((SELECT id FROM cats WHERE slug = '3pm-snacks'), 'Mirchi Bajji (3)', 'mirchi-bajji-3', 30.00, 2),
((SELECT id FROM cats WHERE slug = '3pm-snacks'), 'Bobbarlu Vada (3)', 'bobbarlu-vada-3', 30.00, 3)
ON CONFLICT (slug) DO NOTHING;

-- Seed Product Options
WITH prods AS (SELECT id, slug FROM public.products)
INSERT INTO public.product_options (product_id, name, price) VALUES
-- Chicken Roll Options
((SELECT id FROM prods WHERE slug = 'chicken-roll'), 'With Omelette', 10.00),
((SELECT id FROM prods WHERE slug = 'chicken-roll'), 'With Cheese', 20.00),
-- Healthy Tiffin Parcel Option
((SELECT id FROM prods WHERE slug = 'plain-dosa'), 'Parcel', 10.00),
((SELECT id FROM prods WHERE slug = 'onion-dosa'), 'Parcel', 10.00),
((SELECT id FROM prods WHERE slug = 'raagi-dosa'), 'Parcel', 10.00),
((SELECT id FROM prods WHERE slug = 'multi-millet-dosa'), 'Parcel', 10.00),
((SELECT id FROM prods WHERE slug = 'pesarrattu'), 'Parcel', 10.00),
((SELECT id FROM prods WHERE slug = 'egg-dosa'), 'Parcel', 10.00),
((SELECT id FROM prods WHERE slug = 'double-egg-dosa'), 'Parcel', 10.00)
ON CONFLICT (product_id, name) DO NOTHING;
