"use client";

import { useState, useEffect } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase";
import type { Profile } from "@/lib/database.types";

export default function AdminUsers() {
    const [users, setUsers] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => { fetchUsers(); }, []);

    async function getToken() {
        const supabase = createBrowserSupabaseClient();
        const { data: { session } } = await supabase.auth.getSession();
        return session?.access_token || "";
    }

    async function fetchUsers() {
        const token = await getToken();
        const res = await fetch("/api/admin/users", {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUsers(data.users || []);
        setLoading(false);
    }

    const filtered = users.filter((u) =>
        (u.full_name || "").toLowerCase().includes(search.toLowerCase()) ||
        u.id.toLowerCase().includes(search.toLowerCase())
    );

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
                    <h1 className="text-3xl font-black text-white tracking-tight">Users</h1>
                    <p className="text-gray-400 text-sm mt-1">{users.length} registered users</p>
                </div>
            </div>

            {/* Search */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full max-w-md px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm placeholder:text-gray-500 focus:border-[#800000] focus:outline-none transition-colors"
                />
            </div>

            {/* Table */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-xs text-gray-500 uppercase tracking-wider border-b border-gray-800">
                                <th className="p-4">User</th>
                                <th className="p-4">Role</th>
                                <th className="p-4">User ID</th>
                                <th className="p-4">Joined</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-gray-500">No users found</td>
                                </tr>
                            ) : (
                                filtered.map((u) => (
                                    <tr key={u.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-[#800000]/20 flex items-center justify-center text-[#b21e29] font-bold text-sm flex-shrink-0">
                                                    {(u.full_name || "U")[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-white">{u.full_name || "Unnamed"}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${u.role === "admin"
                                                    ? "bg-[#800000]/20 text-[#b21e29] border border-[#800000]/30"
                                                    : "bg-gray-800 text-gray-400"
                                                }`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="p-4 text-xs text-gray-500 font-mono">{u.id.slice(0, 8)}...</td>
                                        <td className="p-4 text-sm text-gray-400">
                                            {new Date(u.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
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
