"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { SpinningMandala, CornerPaisley, FloatingElements } from "@/app/components/Decorations";

export default function ProfilePage() {
    const { user, profile, loading, logout, updateProfile } = useAuth();
    const router = useRouter();
    const [editingName, setEditingName] = useState(false);
    const [newName, setNewName] = useState("");
    const [saving, setSaving] = useState(false);
    const [saveMsg, setSaveMsg] = useState("");

    useEffect(() => {
        if (!loading && !user) {
            router.replace("/");
        }
    }, [loading, user, router]);

    if (loading) {
        return (
            <div className="min-h-screen pt-32 flex items-center justify-center bg-white/80">
                <div className="w-10 h-10 border-3 border-[#800000] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!user) return null;

    const initials = profile?.full_name
        ? profile.full_name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
        : user.email?.[0]?.toUpperCase() || "?";

    const joinDate = profile?.created_at
        ? new Date(profile.created_at).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })
        : "—";

    async function handleSaveName() {
        if (!newName.trim()) return;
        setSaving(true);
        setSaveMsg("");
        const res = await updateProfile({ full_name: newName.trim() } as { full_name: string });
        if (res.error) {
            setSaveMsg(res.error);
        } else {
            setSaveMsg("Name updated!");
            setEditingName(false);
        }
        setSaving(false);
        setTimeout(() => setSaveMsg(""), 3000);
    }

    async function handleLogout() {
        await logout();
        router.replace("/");
    }

    return (
        <div className="min-h-screen pt-0 pb-16 px-4 md:px-12 bg-white/80 backdrop-blur-sm text-[#3d1a1a] relative overflow-hidden">
            {/* Background Decorations */}
            <FloatingElements />
            <SpinningMandala className="absolute top-[-200px] right-[-200px] w-[600px] h-[600px] opacity-5 pointer-events-none" color="text-[#b21e29]" />
            <CornerPaisley position="bottom-left" className="bottom-0 left-0 opacity-5 w-64 h-64" color="text-[#b21e29]" />

            <div className="max-w-2xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="w-24 h-24 mx-auto mb-5 rounded-full bg-gradient-to-br from-[#800000] to-[#b21e29] flex items-center justify-center text-white text-3xl font-black shadow-xl">
                            {initials}
                        </div>
                        <h1 className="text-3xl font-black tracking-tight text-[#800000]" style={{ fontFamily: "var(--font-heading)" }}>
                            {profile?.full_name || "Welcome"}
                        </h1>
                        <p className="text-[#8B4513] text-sm mt-1">{user.email}</p>
                        <div className="flex items-center justify-center gap-3 mt-3">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${profile?.role === "admin"
                                    ? "bg-[#800000]/10 text-[#800000] border border-[#800000]/20"
                                    : "bg-gray-100 text-gray-600 border border-gray-200"
                                }`}>
                                {profile?.role || "user"}
                            </span>
                            <span className="text-xs text-gray-400">·</span>
                            <span className="text-xs text-gray-500">Joined {joinDate}</span>
                        </div>
                    </div>

                    {/* Profile Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="bg-white/90 rounded-xl border border-[#d4a89a]/30 shadow-sm divide-y divide-[#d4a89a]/15 overflow-hidden"
                    >
                        {/* Full Name */}
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-bold text-[#800000] uppercase tracking-widest mb-1">Full Name</p>
                                    {editingName ? (
                                        <div className="flex items-center gap-2 mt-1">
                                            <input
                                                type="text"
                                                value={newName}
                                                onChange={(e) => setNewName(e.target.value)}
                                                autoFocus
                                                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#800000] focus:ring-1 focus:ring-[#800000]/20"
                                                placeholder="Your name"
                                            />
                                            <button
                                                onClick={handleSaveName}
                                                disabled={saving}
                                                className="px-4 py-2 bg-[#800000] text-white text-xs font-bold rounded-lg hover:bg-[#b21e29] disabled:opacity-50 transition-colors"
                                            >
                                                {saving ? "..." : "Save"}
                                            </button>
                                            <button
                                                onClick={() => setEditingName(false)}
                                                className="px-3 py-2 text-gray-500 text-xs font-bold hover:text-gray-700 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <p className="text-sm font-medium">{profile?.full_name || "Not set"}</p>
                                    )}
                                </div>
                                {!editingName && (
                                    <button
                                        onClick={() => { setNewName(profile?.full_name || ""); setEditingName(true); }}
                                        className="text-xs font-bold text-[#800000] hover:text-[#b21e29] uppercase tracking-wider transition-colors"
                                    >
                                        Edit
                                    </button>
                                )}
                            </div>
                            {saveMsg && (
                                <p className={`text-xs mt-2 font-medium ${saveMsg.includes("error") || saveMsg.includes("Error") ? "text-red-500" : "text-green-600"}`}>
                                    {saveMsg}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="p-6">
                            <p className="text-[10px] font-bold text-[#800000] uppercase tracking-widest mb-1">Email Address</p>
                            <p className="text-sm font-medium">{user.email}</p>
                        </div>

                        {/* Account ID */}
                        <div className="p-6">
                            <p className="text-[10px] font-bold text-[#800000] uppercase tracking-widest mb-1">Account ID</p>
                            <p className="text-xs font-mono text-gray-400 break-all">{user.id}</p>
                        </div>
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-6 grid grid-cols-2 gap-3"
                    >
                        <Link
                            href="/wishlist"
                            className="flex items-center gap-3 p-4 bg-white/90 rounded-xl border border-[#d4a89a]/30 hover:border-[#800000]/30 hover:shadow-sm transition-all group"
                        >
                            <span className="text-xl">❤️</span>
                            <div>
                                <p className="text-sm font-bold text-[#3d1a1a] group-hover:text-[#800000] transition-colors">Wishlist</p>
                                <p className="text-[10px] text-gray-400 font-medium">Your favorites</p>
                            </div>
                        </Link>
                        <Link
                            href="/cart"
                            className="flex items-center gap-3 p-4 bg-white/90 rounded-xl border border-[#d4a89a]/30 hover:border-[#800000]/30 hover:shadow-sm transition-all group"
                        >
                            <span className="text-xl">🛍️</span>
                            <div>
                                <p className="text-sm font-bold text-[#3d1a1a] group-hover:text-[#800000] transition-colors">Shopping Bag</p>
                                <p className="text-[10px] text-gray-400 font-medium">View your cart</p>
                            </div>
                        </Link>
                        {profile?.role === "admin" && (
                            <Link
                                href="/admin"
                                className="col-span-2 flex items-center gap-3 p-4 bg-gradient-to-r from-[#800000]/5 to-[#b21e29]/5 rounded-xl border border-[#800000]/20 hover:border-[#800000]/40 hover:shadow-sm transition-all group"
                            >
                                <span className="text-xl">⚙️</span>
                                <div>
                                    <p className="text-sm font-bold text-[#800000]">Admin Panel</p>
                                    <p className="text-[10px] text-gray-500 font-medium">Manage store, products, orders</p>
                                </div>
                            </Link>
                        )}
                    </motion.div>

                    {/* Logout */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.45 }}
                        className="mt-8 text-center"
                    >
                        <button
                            onClick={handleLogout}
                            className="px-8 py-3 border-2 border-[#800000]/20 text-[#800000] text-sm font-bold uppercase tracking-widest rounded-full hover:bg-[#800000] hover:text-white transition-all duration-300"
                        >
                            Sign Out
                        </button>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
