import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { getAuthUser } from "./auth";

// Check if the authenticated user has admin role
export async function getAdminUser(req: NextRequest) {
    const user = await getAuthUser(req);

    if (!user) {
        return { user: null, error: "Authentication required" };
    }

    const supabase = createServerSupabaseClient();
    const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (error || !profile || profile.role !== "admin") {
        return { user: null, error: "Admin access required" };
    }

    return { user, error: null };
}

export function forbiddenResponse(message = "Admin access required") {
    return NextResponse.json({ error: message }, { status: 403 });
}
