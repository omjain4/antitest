import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { getAdminUser, forbiddenResponse } from "@/lib/admin";
import { unauthorizedResponse } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    const { user, error } = await getAdminUser(req);
    if (!user) return error === "Authentication required" ? unauthorizedResponse() : forbiddenResponse();

    const supabase = createServerSupabaseClient();
    const { data, error: dbError } = await supabase.from("categories").select("*").order("name");
    if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
    return NextResponse.json({ categories: data });
}

export async function POST(req: NextRequest) {
    const { user, error } = await getAdminUser(req);
    if (!user) return error === "Authentication required" ? unauthorizedResponse() : forbiddenResponse();

    const { id, name, image, count } = await req.json();
    if (!id || !name) return NextResponse.json({ error: "id and name are required" }, { status: 400 });

    const supabase = createServerSupabaseClient();
    const { data, error: dbError } = await supabase.from("categories").insert({ id, name, image: image || "", count: count || 0 }).select().single();
    if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
    return NextResponse.json({ category: data }, { status: 201 });
}

export async function PUT(req: NextRequest) {
    const { user, error } = await getAdminUser(req);
    if (!user) return error === "Authentication required" ? unauthorizedResponse() : forbiddenResponse();

    const { id, ...updates } = await req.json();
    if (!id) return NextResponse.json({ error: "Category id is required" }, { status: 400 });

    const supabase = createServerSupabaseClient();
    const { data, error: dbError } = await supabase.from("categories").update(updates).eq("id", id).select().single();
    if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
    return NextResponse.json({ category: data });
}

export async function DELETE(req: NextRequest) {
    const { user, error } = await getAdminUser(req);
    if (!user) return error === "Authentication required" ? unauthorizedResponse() : forbiddenResponse();

    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "Category id is required" }, { status: 400 });

    const supabase = createServerSupabaseClient();
    const { error: dbError } = await supabase.from("categories").delete().eq("id", id);
    if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
    return NextResponse.json({ message: "Category deleted" });
}
