import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { getAdminUser, forbiddenResponse } from "@/lib/admin";
import { unauthorizedResponse } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    const { user, error } = await getAdminUser(req);
    if (!user) return error === "Authentication required" ? unauthorizedResponse() : forbiddenResponse();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const supabase = createServerSupabaseClient();

    let query = supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (status) query = query.eq("status", status);

    const { data, error: dbError } = await query;
    if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
    return NextResponse.json({ orders: data });
}

export async function PUT(req: NextRequest) {
    const { user, error } = await getAdminUser(req);
    if (!user) return error === "Authentication required" ? unauthorizedResponse() : forbiddenResponse();

    const { id, status } = await req.json();
    if (!id || !status) return NextResponse.json({ error: "id and status are required" }, { status: 400 });

    const validStatuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) return NextResponse.json({ error: "Invalid status" }, { status: 400 });

    const supabase = createServerSupabaseClient();
    const { data, error: dbError } = await supabase.from("orders").update({ status }).eq("id", id).select().single();
    if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
    return NextResponse.json({ order: data });
}
