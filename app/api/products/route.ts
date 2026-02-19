import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get("category");

        const supabase = createServerSupabaseClient();
        let query = supabase.from("products").select("*").order("created_at", { ascending: false });

        if (category && category !== "All" && category !== "The Latest") {
            query = query.eq("category", category);
        }

        const { data, error } = await query;
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ products: data });
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
