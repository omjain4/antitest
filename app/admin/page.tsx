"use client";

import { useState, useEffect } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase";

interface DashboardStats {
    totalProducts: number;
    totalOrders: number;
    totalUsers: number;
    totalRevenue: number;
}

interface RecentOrder {
    id: number;
    total: number;
    status: string;
    created_at: string;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats>({ totalProducts: 0, totalOrders: 0, totalUsers: 0, totalRevenue: 0 });
    const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboard();
    }, []);

    async function fetchDashboard() {
        const supabase = createBrowserSupabaseClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const res = await fetch("/api/admin/dashboard", {
            headers: { Authorization: `Bearer ${session.access_token}` },
        });
        const data = await res.json();
        setStats(data.stats);
        setRecentOrders(data.recentOrders || []);
        setLoading(false);
    }

    const statCards = [
        { label: "Total Revenue", value: `₹${stats.totalRevenue.toLocaleString("en-IN")}`, icon: "💰", color: "from-emerald-500/20 to-emerald-600/5 border-emerald-500/30" },
        { label: "Total Orders", value: stats.totalOrders, icon: "🧾", color: "from-blue-500/20 to-blue-600/5 border-blue-500/30" },
        { label: "Total Products", value: stats.totalProducts, icon: "📦", color: "from-amber-500/20 to-amber-600/5 border-amber-500/30" },
        { label: "Total Users", value: stats.totalUsers, icon: "👥", color: "from-purple-500/20 to-purple-600/5 border-purple-500/30" },
    ];

    const statusColor: Record<string, string> = {
        pending: "bg-yellow-500/20 text-yellow-400",
        confirmed: "bg-blue-500/20 text-blue-400",
        shipped: "bg-purple-500/20 text-purple-400",
        delivered: "bg-green-500/20 text-green-400",
        cancelled: "bg-red-500/20 text-red-400",
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-10 h-10 border-4 border-[#800000] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-black text-white tracking-tight">Dashboard</h1>
                <p className="text-gray-400 text-sm mt-1">Overview of your store performance</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {statCards.map((card) => (
                    <div
                        key={card.label}
                        className={`bg-gradient-to-br ${card.color} border rounded-xl p-5 transition-transform hover:scale-[1.02]`}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-2xl">{card.icon}</span>
                        </div>
                        <p className="text-2xl font-black text-white">{card.value}</p>
                        <p className="text-xs text-gray-400 font-medium mt-1">{card.label}</p>
                    </div>
                ))}
            </div>

            {/* Recent Orders */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                <div className="p-5 border-b border-gray-800">
                    <h2 className="text-lg font-bold text-white">Recent Orders</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-xs text-gray-500 uppercase tracking-wider border-b border-gray-800">
                                <th className="p-4">Order ID</th>
                                <th className="p-4">Total</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-gray-500">No orders yet</td>
                                </tr>
                            ) : (
                                recentOrders.map((order) => (
                                    <tr key={order.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                                        <td className="p-4 text-sm font-mono text-gray-300">#{order.id}</td>
                                        <td className="p-4 text-sm font-bold text-white">₹{order.total.toLocaleString("en-IN")}</td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusColor[order.status] || "bg-gray-700 text-gray-300"}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-gray-400">
                                            {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
