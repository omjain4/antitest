import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const supabase = createServerSupabaseClient();
        const { data, error } = await supabase.from("categories").select("*").order("name");
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ categories: data });
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
