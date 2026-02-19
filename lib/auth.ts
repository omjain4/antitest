import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

// Extract user from the Authorization header JWT
export async function getAuthUser(req: NextRequest) {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return null;
    }

    const token = authHeader.replace("Bearer ", "");
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
        return null;
    }

    return data.user;
}

// Returns 401 response if not authenticated
export function unauthorizedResponse(message = "Authentication required") {
    return NextResponse.json({ error: message }, { status: 401 });
}
