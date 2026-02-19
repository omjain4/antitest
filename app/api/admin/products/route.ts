import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { getAdminUser, forbiddenResponse } from "@/lib/admin";
import { unauthorizedResponse } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    const { user, error } = await getAdminUser(req);
    if (!user) return error === "Authentication required" ? unauthorizedResponse() : forbiddenResponse();

    const supabase = createServerSupabaseClient();
    const { data, error: dbError } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
    return NextResponse.json({ products: data });
}

export async function POST(req: NextRequest) {
    const { user, error } = await getAdminUser(req);
    if (!user) return error === "Authentication required" ? unauthorizedResponse() : forbiddenResponse();

    const body = await req.json();
    const { name, brand, price, original_price, discount, image, rating, reviews, tag, sizes, colors, category } = body;
    if (!name || !brand || !price) return NextResponse.json({ error: "name, brand, and price are required" }, { status: 400 });

    const supabase = createServerSupabaseClient();
    const { data, error: dbError } = await supabase.from("products")
        .insert({ name, brand, price, original_price: original_price || 0, discount: discount || 0, image: image || "", rating: rating || 0, reviews: reviews || 0, tag: tag || null, sizes: sizes || [], colors: colors || [], category: category || "" })
        .select().single();

    if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
    return NextResponse.json({ product: data }, { status: 201 });
}

export async function PUT(req: NextRequest) {
    const { user, error } = await getAdminUser(req);
    if (!user) return error === "Authentication required" ? unauthorizedResponse() : forbiddenResponse();

    const { id, ...updates } = await req.json();
    if (!id) return NextResponse.json({ error: "Product id is required" }, { status: 400 });

    const supabase = createServerSupabaseClient();
    const { data, error: dbError } = await supabase.from("products").update(updates).eq("id", id).select().single();
    if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
    return NextResponse.json({ product: data });
}

export async function DELETE(req: NextRequest) {
    const { user, error } = await getAdminUser(req);
    if (!user) return error === "Authentication required" ? unauthorizedResponse() : forbiddenResponse();

    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "Product id is required" }, { status: 400 });

    const supabase = createServerSupabaseClient();
    const { error: dbError } = await supabase.from("products").delete().eq("id", id);
    if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
    return NextResponse.json({ message: "Product deleted" });
}
