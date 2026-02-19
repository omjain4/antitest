"use client";

import { useState, useEffect } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase";
import type { Order } from "@/lib/database.types";

const STATUS_OPTIONS = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
const STATUS_COLORS: Record<string, string> = {
    pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    confirmed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    shipped: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    delivered: "bg-green-500/20 text-green-400 border-green-500/30",
    cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
};

export default function AdminOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("");
    const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

    useEffect(() => { fetchOrders(); }, [filter]);

    async function getToken() {
        const supabase = createBrowserSupabaseClient();
        const { data: { session } } = await supabase.auth.getSession();
        return session?.access_token || "";
    }

    async function fetchOrders() {
        const token = await getToken();
        const url = filter ? `/api/admin/orders?status=${filter}` : "/api/admin/orders";
        const res = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setOrders(data.orders || []);
        setLoading(false);
    }

    async function updateStatus(orderId: number, status: string) {
        const token = await getToken();
        await fetch("/api/admin/orders", {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ id: orderId, status }),
        });
        fetchOrders();
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-10 h-10 border-4 border-[#800000] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">Orders</h1>
                    <p className="text-gray-400 text-sm mt-1">{orders.length} orders{filter ? ` (${filter})` : ""}</p>
                </div>
            </div>

            {/* Status Filter */}
            <div className="flex gap-2 mb-6 flex-wrap">
                <button
                    onClick={() => setFilter("")}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${!filter ? "bg-[#800000] text-white" : "bg-gray-800 text-gray-400 hover:text-white"}`}
                >
                    All
                </button>
                {STATUS_OPTIONS.map((s) => (
                    <button
                        key={s}
                        onClick={() => setFilter(s)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-colors ${filter === s ? "bg-[#800000] text-white" : "bg-gray-800 text-gray-400 hover:text-white"}`}
                    >
                        {s}
                    </button>
                ))}
            </div>

            {/* Orders Table */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                {orders.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">No orders found</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-xs text-gray-500 uppercase tracking-wider border-b border-gray-800">
                                    <th className="p-4">Order</th>
                                    <th className="p-4">Total</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Date</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <>
                                        <tr key={order.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors cursor-pointer" onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}>
                                            <td className="p-4 text-sm font-mono text-gray-300">#{order.id}</td>
                                            <td className="p-4 text-sm font-bold text-white">₹{order.total.toLocaleString("en-IN")}</td>
                                            <td className="p-4">
                                                <span className={`px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${STATUS_COLORS[order.status] || "bg-gray-700 text-gray-300"}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-sm text-gray-400">
                                                {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                            </td>
                                            <td className="p-4">
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => { e.stopPropagation(); updateStatus(order.id, e.target.value); }}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded text-xs text-white focus:outline-none focus:border-[#800000]"
                                                >
                                                    {STATUS_OPTIONS.map((s) => (
                                                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                                    ))}
                                                </select>
                                            </td>
                                        </tr>
                                        {expandedOrder === order.id && (
                                            <tr key={`${order.id}-details`}>
                                                <td colSpan={5} className="p-4 bg-gray-800/20">
                                                    <div className="text-xs text-gray-400 mb-2 font-bold">Order Items:</div>
                                                    <div className="space-y-2">
                                                        {(typeof order.items === "string" ? JSON.parse(order.items) : order.items).map((item: { product_id: number; name: string; price: number; quantity: number }, idx: number) => (
                                                            <div key={idx} className="flex items-center justify-between bg-gray-800/50 p-3 rounded-lg">
                                                                <span className="text-sm text-gray-300">{item.name}</span>
                                                                <div className="flex gap-4 text-xs text-gray-400">
                                                                    <span>Qty: {item.quantity}</span>
                                                                    <span className="font-bold text-white">₹{item.price.toLocaleString("en-IN")}</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
