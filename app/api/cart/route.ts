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
            .from("cart_items")
            .select("*, product:products(*)")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ cart: data });
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const user = await getAuthUser(req);
        if (!user) return unauthorizedResponse();

        const { product_id, quantity = 1 } = await req.json();
        if (!product_id) return NextResponse.json({ error: "product_id is required" }, { status: 400 });

        const supabase = createServerSupabaseClient();
        const { data: existing } = await supabase
            .from("cart_items").select("*").eq("user_id", user.id).eq("product_id", product_id).single();

        if (existing) {
            const { data, error } = await supabase
                .from("cart_items").update({ quantity: existing.quantity + quantity })
                .eq("id", existing.id).select("*, product:products(*)").single();
            if (error) return NextResponse.json({ error: error.message }, { status: 500 });
            return NextResponse.json({ item: data });
        }

        const { data, error } = await supabase
            .from("cart_items").insert({ user_id: user.id, product_id, quantity })
            .select("*, product:products(*)").single();

        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ item: data }, { status: 201 });
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const user = await getAuthUser(req);
        if (!user) return unauthorizedResponse();

        const { product_id, quantity } = await req.json();
        if (!product_id || quantity === undefined) return NextResponse.json({ error: "product_id and quantity are required" }, { status: 400 });

        const supabase = createServerSupabaseClient();
        if (quantity <= 0) {
            await supabase.from("cart_items").delete().eq("user_id", user.id).eq("product_id", product_id);
            return NextResponse.json({ message: "Item removed from cart" });
        }

        const { data, error } = await supabase
            .from("cart_items").update({ quantity }).eq("user_id", user.id).eq("product_id", product_id)
            .select("*, product:products(*)").single();

        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ item: data });
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const user = await getAuthUser(req);
        if (!user) return unauthorizedResponse();

        const { product_id } = await req.json();
        if (!product_id) return NextResponse.json({ error: "product_id is required" }, { status: 400 });

        const supabase = createServerSupabaseClient();
        const { error } = await supabase.from("cart_items").delete().eq("user_id", user.id).eq("product_id", product_id);

        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ message: "Item removed from cart" });
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
