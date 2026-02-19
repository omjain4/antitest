import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { getAdminUser, forbiddenResponse } from "@/lib/admin";
import { unauthorizedResponse } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    const { user, error } = await getAdminUser(req);
    if (!user) return error === "Authentication required" ? unauthorizedResponse() : forbiddenResponse();

    const supabase = createServerSupabaseClient();
    const [productsRes, ordersRes, usersRes, revenueRes] = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("total").eq("status", "delivered"),
    ]);

    const totalRevenue = (revenueRes.data || []).reduce((sum: number, o: { total: number }) => sum + o.total, 0);
    const { data: recentOrders } = await supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(5);

    return NextResponse.json({
        stats: {
            totalProducts: productsRes.count || 0,
            totalOrders: ordersRes.count || 0,
            totalUsers: usersRes.count || 0,
            totalRevenue,
        },
        recentOrders: recentOrders || [],
    });
}
