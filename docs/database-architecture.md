# Nutri Delight Database Architecture

## 1. Tables and Relationships
The system is built on a Supabase PostgreSQL foundation. The primary schema entities are:

- **`profiles`**: Linked directly to `auth.users(id)`. Supports `'customer'` and `'admin'` roles.
- **`addresses`**: Allows customers to save multiple delivery addresses with fields matching frontend requirements (`recipient_name`, `phone`, `city`, `state`, etc.).
- **`categories`**: Defines the 7 main menu categories.
- **`products`**: The core catalog. Contains 33 products linked to `categories`. Uses numeric data types for all monetary fields.
- **`product_options`**: Stores specific add-ons per product (e.g., 'Parcel', 'With Cheese').
- **`carts` & `cart_items`**: Manages active user carts prior to checkout.
- **`orders`**: A unified order model supporting BOTH normal and bulk orders (`type IN ('normal', 'bulk')`). Includes snapshots of customer details and delivery fields.
- **`order_items`**: Preserves historical pricing. Captures exact `unit_price_snapshot` and `option_price_snapshot` at the time of order so that future price updates in the catalog do not corrupt past order totals.
- **`bills`**: Represents invoices generated for orders, preparing for PDF integration.
- **`notifications`**: A robust table for order updates and reminders.

## 2. Normal vs. Bulk Order Design
Instead of siloing normal and bulk orders into separate systems, a unified `orders` table is used. The `type` column explicitly defines the order type (`'normal'` or `'bulk'`). Bulk-specific fields such as `event_date` and `event_time` reside natively on the `orders` table. This prevents catalog fragmentation—both order types draw from the exact same `products` and `categories`.

## 3. Pricing Model & Historical Preservation
All prices are strictly defined as `NUMERIC(10, 2)` to eliminate floating-point precision errors. 
To guarantee data integrity for past invoices, the `order_items` table intentionally severs real-time dependency on `products.price` and `product_options.price`. At the moment of purchase, the exact price is snapshotted into `unit_price_snapshot` and `option_price_snapshot`. Even if an admin doubles a product's price the next day, past orders remain structurally perfectly accurate.

## 4. RLS Strategy & Admin Authorization
- **Security Definer**: A `public.is_admin()` helper function is implemented as a `SECURITY DEFINER`. It queries `public.profiles` securely, avoiding infinite RLS recursion while validating the admin role.
- **Strict Isolation**: Customers can strictly `SELECT`, `INSERT`, `UPDATE` (where appropriate), and `DELETE` their own `addresses`, `carts`, and `orders`.
- **Privilege Escalation Protected**: A `BEFORE UPDATE` trigger on `profiles` aggressively blocks non-admins from modifying their own `role` field.
- **Catalog Safety**: Public/Customer read access (`SELECT`) is permitted on `categories`, `products`, and `product_options` where `is_active = true`. Admins hold `ALL` privileges on the catalog.

## 5. Seed Strategy
The database uses an idempotent `INSERT ... ON CONFLICT (slug)` and `ON CONFLICT (product_id, name)` strategy for data initialization. This guarantees the 7 categories and 33 products matching the frontend's `menu.ts` can be re-seeded infinitely without duplicate key errors or application corruption.

## 6. Order Lifecycle Assumptions
- An order moves through predictable states: `pending` -> `confirmed` -> `preparing` -> `ready` -> `delivered`. 
- Carts act exclusively as temporary staging. Once an order is confirmed, the frontend creates the `order` and `order_item` records and flushes the `cart`.
