// TypeScript types matching the Supabase PostgreSQL schema

export interface Profile {
    id: string; // FK → auth.users.id
    full_name: string | null;
    role: "user" | "admin";
    avatar_url: string | null;
    created_at: string;
}

export interface DbProduct {
    id: number;
    name: string;
    brand: string;
    price: number;
    original_price: number;
    discount: number;
    image: string;
    rating: number;
    reviews: number;
    tag: string | null;
    sizes: string[];
    colors: string[];
    category: string;
    created_at: string;
}

export interface DbCategory {
    id: string;
    name: string;
    image: string;
    count: number;
}

export interface DbHeroSlide {
    id: number;
    image: string;
    tag: string;
    title: string;
    subtitle: string;
    author: string;
    time: string;
}

export interface CartItem {
    id: number;
    user_id: string;
    product_id: number;
    quantity: number;
    created_at: string;
    product?: DbProduct;
}

export interface WishlistItem {
    id: number;
    user_id: string;
    product_id: number;
    created_at: string;
    product?: DbProduct;
}

export interface Order {
    id: number;
    user_id: string;
    items: OrderItem[];
    total: number;
    status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
    created_at: string;
    profile?: Profile;
}

export interface OrderItem {
    product_id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

export interface DbDeal {
    id: number;
    label: string;
    description: string;
    code: string;
}
