import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const supabase = createServerSupabaseClient();

        const { data, error } = await supabase
            .from("products")
            .select("*")
            .eq("id", parseInt(id))
            .single();

        if (error || !data) return NextResponse.json({ error: "Product not found" }, { status: 404 });
        return NextResponse.json({ product: data });
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
