import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { getAdminUser, forbiddenResponse } from "@/lib/admin";
import { unauthorizedResponse } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    const { user, error } = await getAdminUser(req);
    if (!user) return error === "Authentication required" ? unauthorizedResponse() : forbiddenResponse();

    const supabase = createServerSupabaseClient();
    const { data, error: dbError } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
    return NextResponse.json({ users: data });
}
