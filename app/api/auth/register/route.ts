import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const { email, password, full_name } = await req.json();
        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

        const supabase = createServerSupabaseClient();
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: full_name || "" } },
        });

        if (error) return NextResponse.json({ error: error.message }, { status: 400 });

        return NextResponse.json({
            message: "Registration successful",
            user: { id: data.user?.id, email: data.user?.email },
            session: data.session,
        });
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
