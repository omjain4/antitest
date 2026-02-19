import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { getAuthUser, unauthorizedResponse } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const user = await getAuthUser(req);
        if (!user) return unauthorizedResponse();

        const supabase = createServerSupabaseClient();
        const { data, error } = await supabase
            .from("orders").select("*").eq("user_id", user.id)
            .order("created_at", { ascending: false });

        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ orders: data });
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const user = await getAuthUser(req);
        if (!user) return unauthorizedResponse();

        const supabase = createServerSupabaseClient();
        const { data: cartItems, error: cartError } = await supabase
            .from("cart_items").select("*, product:products(*)").eq("user_id", user.id);

        if (cartError || !cartItems || cartItems.length === 0) {
            return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
        }

        const items = cartItems.map((item: { product: { id: number; name: string; price: number; image: string }; quantity: number }) => ({
            product_id: item.product.id, name: item.product.name,
            price: item.product.price, quantity: item.quantity, image: item.product.image,
        }));

        const total = items.reduce((sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity, 0);

        const { data: order, error: orderError } = await supabase
            .from("orders").insert({ user_id: user.id, items: JSON.stringify(items), total, status: "pending" })
            .select().single();

        if (orderError) return NextResponse.json({ error: orderError.message }, { status: 500 });

        await supabase.from("cart_items").delete().eq("user_id", user.id);
        return NextResponse.json({ order }, { status: 201 });
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
