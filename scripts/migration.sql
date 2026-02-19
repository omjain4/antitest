-- Pariney Backend: Full Schema Migration
-- Run this in Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- ╔══════════════════════════════════════╗
-- ║  1. PROFILES (extends auth.users)    ║
-- ╚══════════════════════════════════════╝
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, role, avatar_url)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
        'user',
        COALESCE(NEW.raw_user_meta_data ->> 'avatar_url', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ╔══════════════════════════════════════╗
-- ║  2. PRODUCTS                         ║
-- ╚══════════════════════════════════════╝
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    price INTEGER NOT NULL,
    original_price INTEGER NOT NULL DEFAULT 0,
    discount INTEGER NOT NULL DEFAULT 0,
    image TEXT NOT NULL DEFAULT '',
    rating NUMERIC(2,1) NOT NULL DEFAULT 0,
    reviews INTEGER NOT NULL DEFAULT 0,
    tag TEXT,
    sizes TEXT[] NOT NULL DEFAULT '{}',
    colors TEXT[] NOT NULL DEFAULT '{}',
    category TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ╔══════════════════════════════════════╗
-- ║  3. CATEGORIES                       ║
-- ╚══════════════════════════════════════╝
CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    image TEXT NOT NULL DEFAULT '',
    count INTEGER NOT NULL DEFAULT 0
);

-- ╔══════════════════════════════════════╗
-- ║  4. HERO SLIDES                      ║
-- ╚══════════════════════════════════════╝
CREATE TABLE IF NOT EXISTS hero_slides (
    id SERIAL PRIMARY KEY,
    image TEXT NOT NULL DEFAULT '',
    tag TEXT NOT NULL DEFAULT '',
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL DEFAULT '',
    author TEXT NOT NULL DEFAULT '',
    time TEXT NOT NULL DEFAULT ''
);

-- ╔══════════════════════════════════════╗
-- ║  5. CART ITEMS                       ║
-- ╚══════════════════════════════════════╝
CREATE TABLE IF NOT EXISTS cart_items (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- ╔══════════════════════════════════════╗
-- ║  6. WISHLIST ITEMS                   ║
-- ╚══════════════════════════════════════╝
CREATE TABLE IF NOT EXISTS wishlist_items (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- ╔══════════════════════════════════════╗
-- ║  7. ORDERS                           ║
-- ╚══════════════════════════════════════╝
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    items JSONB NOT NULL DEFAULT '[]',
    total INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ╔══════════════════════════════════════╗
-- ║  8. DEALS                            ║
-- ╚══════════════════════════════════════╝
CREATE TABLE IF NOT EXISTS deals (
    id SERIAL PRIMARY KEY,
    label TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    code TEXT NOT NULL DEFAULT ''
);

-- ╔══════════════════════════════════════╗
-- ║  9. ROW LEVEL SECURITY (RLS)         ║
-- ╚══════════════════════════════════════╝

-- Profiles: users can read their own, admins can read all
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Service role full access profiles" ON profiles FOR ALL USING (auth.role() = 'service_role');

-- Products: public read, admin write
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products are public" ON products FOR SELECT USING (true);
CREATE POLICY "Service role full access products" ON products FOR ALL USING (auth.role() = 'service_role');

-- Categories: public read
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are public" ON categories FOR SELECT USING (true);
CREATE POLICY "Service role full access categories" ON categories FOR ALL USING (auth.role() = 'service_role');

-- Hero slides: public read
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Hero slides are public" ON hero_slides FOR SELECT USING (true);
CREATE POLICY "Service role full access hero_slides" ON hero_slides FOR ALL USING (auth.role() = 'service_role');

-- Cart: users manage own
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own cart" ON cart_items FOR ALL USING (auth.uid() = user_id);

-- Wishlist: users manage own
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own wishlist" ON wishlist_items FOR ALL USING (auth.uid() = user_id);

-- Orders: users can view own
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Service role full access orders" ON orders FOR ALL USING (auth.role() = 'service_role');

-- Deals: public read
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Deals are public" ON deals FOR SELECT USING (true);
CREATE POLICY "Service role full access deals" ON deals FOR ALL USING (auth.role() = 'service_role');

-- ╔══════════════════════════════════════╗
-- ║  10. INDEXES                         ║
-- ╚══════════════════════════════════════╝
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_cart_user ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_user ON wishlist_items(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
