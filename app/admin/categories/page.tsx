"use client";

import { useState, useEffect } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase";
import type { DbCategory } from "@/lib/database.types";

export default function AdminCategories() {
    const [categories, setCategories] = useState<DbCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingCat, setEditingCat] = useState<DbCategory | null>(null);
    const [form, setForm] = useState({ id: "", name: "", image: "", count: 0 });

    useEffect(() => { fetchCategories(); }, []);

    async function getToken() {
        const supabase = createBrowserSupabaseClient();
        const { data: { session } } = await supabase.auth.getSession();
        return session?.access_token || "";
    }

    async function fetchCategories() {
        const token = await getToken();
        const res = await fetch("/api/admin/categories", {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setCategories(data.categories || []);
        setLoading(false);
    }

    function openCreate() {
        setEditingCat(null);
        setForm({ id: "", name: "", image: "", count: 0 });
        setShowForm(true);
    }

    function openEdit(c: DbCategory) {
        setEditingCat(c);
        setForm({ id: c.id, name: c.name, image: c.image, count: c.count });
        setShowForm(true);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const token = await getToken();
        await fetch("/api/admin/categories", {
            method: editingCat ? "PUT" : "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify(form),
        });
        setShowForm(false);
        fetchCategories();
    }

    async function handleDelete(id: string) {
        if (!confirm("Delete this category?")) return;
        const token = await getToken();
        await fetch("/api/admin/categories", {
            method: "DELETE",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ id }),
        });
        fetchCategories();
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
                    <h1 className="text-3xl font-black text-white tracking-tight">Categories</h1>
                    <p className="text-gray-400 text-sm mt-1">{categories.length} categories</p>
                </div>
                <button onClick={openCreate} className="px-5 py-2.5 bg-[#800000] hover:bg-[#9a0000] text-white rounded-lg font-bold text-sm transition-colors">
                    + Add Category
                </button>
            </div>

            {/* Grid Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((cat) => (
                    <div key={cat.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-colors">
                        <div className="h-32 bg-gray-800 overflow-hidden">
                            {cat.image && <img src={cat.image} alt={cat.name} className="w-full h-full object-cover opacity-60" />}
                        </div>
                        <div className="p-4">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-lg font-bold text-white">{cat.name}</h3>
                                <span className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-400">{cat.count} items</span>
                            </div>
                            <p className="text-xs text-gray-500 font-mono mb-3">ID: {cat.id}</p>
                            <div className="flex gap-2">
                                <button onClick={() => openEdit(cat)} className="flex-1 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded text-xs text-white transition-colors text-center">Edit</button>
                                <button onClick={() => handleDelete(cat.id)} className="px-3 py-1.5 bg-red-900/30 hover:bg-red-800/50 rounded text-xs text-red-400 transition-colors">Delete</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Form */}
            {showForm && (
                <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
                    <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-xl font-bold text-white mb-5">{editingCat ? "Edit Category" : "Add New Category"}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs text-gray-400 font-medium mb-1">ID (slug)</label>
                                <input
                                    type="text"
                                    value={form.id}
                                    onChange={(e) => setForm({ ...form, id: e.target.value })}
                                    disabled={!!editingCat}
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:border-[#800000] focus:outline-none disabled:opacity-50"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 font-medium mb-1">Name</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:border-[#800000] focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 font-medium mb-1">Image URL</label>
                                <input
                                    type="text"
                                    value={form.image}
                                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:border-[#800000] focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 font-medium mb-1">Product Count</label>
                                <input
                                    type="number"
                                    value={form.count}
                                    onChange={(e) => setForm({ ...form, count: Number(e.target.value) })}
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:border-[#800000] focus:outline-none"
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="submit" className="flex-1 py-2.5 bg-[#800000] hover:bg-[#9a0000] text-white rounded-lg font-bold text-sm transition-colors">
                                    {editingCat ? "Update" : "Create"}
                                </button>
                                <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg font-bold text-sm transition-colors">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
