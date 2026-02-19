import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { getAdminUser, forbiddenResponse } from "@/lib/admin";
import { unauthorizedResponse } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    const { user, error } = await getAdminUser(req);
    if (!user) return error === "Authentication required" ? unauthorizedResponse() : forbiddenResponse();

    const supabase = createServerSupabaseClient();
    const { data, error: dbError } = await supabase.from("hero_slides").select("*").order("id");
    if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
    return NextResponse.json({ slides: data });
}

export async function POST(req: NextRequest) {
    const { user, error } = await getAdminUser(req);
    if (!user) return error === "Authentication required" ? unauthorizedResponse() : forbiddenResponse();

    const { image, tag, title, subtitle, author, time } = await req.json();
    if (!title) return NextResponse.json({ error: "title is required" }, { status: 400 });

    const supabase = createServerSupabaseClient();
    const { data, error: dbError } = await supabase.from("hero_slides")
        .insert({ image: image || "", tag: tag || "", title, subtitle: subtitle || "", author: author || "", time: time || "" })
        .select().single();

    if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
    return NextResponse.json({ slide: data }, { status: 201 });
}

export async function PUT(req: NextRequest) {
    const { user, error } = await getAdminUser(req);
    if (!user) return error === "Authentication required" ? unauthorizedResponse() : forbiddenResponse();

    const { id, ...updates } = await req.json();
    if (!id) return NextResponse.json({ error: "Slide id is required" }, { status: 400 });

    const supabase = createServerSupabaseClient();
    const { data, error: dbError } = await supabase.from("hero_slides").update(updates).eq("id", id).select().single();
    if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
    return NextResponse.json({ slide: data });
}

export async function DELETE(req: NextRequest) {
    const { user, error } = await getAdminUser(req);
    if (!user) return error === "Authentication required" ? unauthorizedResponse() : forbiddenResponse();

    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "Slide id is required" }, { status: 400 });

    const supabase = createServerSupabaseClient();
    const { error: dbError } = await supabase.from("hero_slides").delete().eq("id", id);
    if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
    return NextResponse.json({ message: "Slide deleted" });
}
