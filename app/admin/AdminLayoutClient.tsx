"use client";

import { useState, useEffect, createContext, useContext, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase";

// ─── Auth Context for Admin ───
interface AdminAuth {
    user: { id: string; email: string; role: string; full_name: string } | null;
    loading: boolean;
    logout: () => void;
}

const AdminAuthContext = createContext<AdminAuth>({ user: null, loading: true, logout: () => { } });
export const useAdminAuth = () => useContext(AdminAuthContext);

// ─── Sidebar Nav Items ───
const NAV_ITEMS = [
    { label: "Dashboard", href: "/admin", icon: "📊" },
    { label: "Products", href: "/admin/products", icon: "📦" },
    { label: "Categories", href: "/admin/categories", icon: "📂" },
    { label: "Orders", href: "/admin/orders", icon: "🧾" },
    { label: "Users", href: "/admin/users", icon: "👥" },
];

export default function AdminLayoutClient({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AdminAuth["user"]>(null);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createBrowserSupabaseClient();

    useEffect(() => {
        checkAuth();
    }, []);

    async function checkAuth() {
        try {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                router.replace("/");
                return;
            }

            const { data: profile } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", session.user.id)
                .single();

            if (!profile || profile.role !== "admin") {
                router.replace("/");
                return;
            }

            setUser({
                id: session.user.id,
                email: session.user.email || "",
                role: profile.role,
                full_name: profile.full_name || "",
            });
        } catch {
            router.replace("/");
        } finally {
            setLoading(false);
        }
    }

    async function logout() {
        await supabase.auth.signOut();
        router.replace("/");
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[#800000] border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-400 text-sm font-medium">Loading admin panel...</p>
                </div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <AdminAuthContext.Provider value={{ user, loading, logout }}>
            <div className="min-h-screen bg-gray-950 text-gray-100 flex">
                {/* Sidebar */}
                <aside
                    className={`fixed left-0 top-0 h-full bg-gray-900 border-r border-gray-800 z-50 transition-all duration-300 flex flex-col ${sidebarOpen ? "w-64" : "w-20"
                        }`}
                >
                    {/* Brand */}
                    <div className="p-5 border-b border-gray-800 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[#800000] flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                            P
                        </div>
                        {sidebarOpen && (
                            <div className="overflow-hidden">
                                <h1 className="text-lg font-black tracking-tight text-white">PARINEY</h1>
                                <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">Admin Panel</p>
                            </div>
                        )}
                    </div>

                    {/* Nav */}
                    <nav className="flex-1 py-4 px-3 space-y-1">
                        {NAV_ITEMS.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                                            ? "bg-[#800000] text-white shadow-lg shadow-[#800000]/20"
                                            : "text-gray-400 hover:text-white hover:bg-gray-800"
                                        }`}
                                >
                                    <span className="text-lg flex-shrink-0">{item.icon}</span>
                                    {sidebarOpen && <span>{item.label}</span>}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-800">
                        {sidebarOpen && (
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 rounded-full bg-[#800000]/20 flex items-center justify-center text-[#b21e29] font-bold text-xs">
                                    {user.full_name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-xs font-medium text-gray-300 truncate">{user.full_name || user.email}</p>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">Admin</p>
                                </div>
                            </div>
                        )}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="flex-1 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors text-center text-xs"
                            >
                                {sidebarOpen ? "◀" : "▶"}
                            </button>
                            <Link
                                href="/"
                                className="flex-1 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors text-center text-xs"
                            >
                                🏠
                            </Link>
                            <button
                                onClick={logout}
                                className="flex-1 p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-gray-800 transition-colors text-center text-xs"
                            >
                                ⏻
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"}`}>
                    <div className="p-6 md:p-8 max-w-[1400px] mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </AdminAuthContext.Provider>
    );
}
