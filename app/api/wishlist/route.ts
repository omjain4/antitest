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
            .from("wishlist_items").select("*, product:products(*)")
            .eq("user_id", user.id).order("created_at", { ascending: false });

        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ wishlist: data });
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const user = await getAuthUser(req);
        if (!user) return unauthorizedResponse();

        const { product_id } = await req.json();
        if (!product_id) return NextResponse.json({ error: "product_id is required" }, { status: 400 });

        const supabase = createServerSupabaseClient();
        const { data: existing } = await supabase
            .from("wishlist_items").select("id").eq("user_id", user.id).eq("product_id", product_id).single();

        if (existing) {
            await supabase.from("wishlist_items").delete().eq("id", existing.id);
            return NextResponse.json({ message: "Removed from wishlist", added: false });
        }

        const { data, error } = await supabase
            .from("wishlist_items").insert({ user_id: user.id, product_id })
            .select("*, product:products(*)").single();

        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ item: data, added: true }, { status: 201 });
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
