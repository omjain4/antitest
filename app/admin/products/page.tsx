"use client";

import { useState, useEffect } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase";
import type { DbProduct } from "@/lib/database.types";

export default function AdminProducts() {
    const [products, setProducts] = useState<DbProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<DbProduct | null>(null);
    const [search, setSearch] = useState("");

    // Form state
    const [form, setForm] = useState({
        name: "", brand: "", price: 0, original_price: 0, discount: 0,
        image: "", rating: 0, reviews: 0, tag: "", category: "",
        sizes: "Free Size", colors: "",
    });

    useEffect(() => { fetchProducts(); }, []);

    async function getToken() {
        const supabase = createBrowserSupabaseClient();
        const { data: { session } } = await supabase.auth.getSession();
        return session?.access_token || "";
    }

    async function fetchProducts() {
        const token = await getToken();
        const res = await fetch("/api/admin/products", {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setProducts(data.products || []);
        setLoading(false);
    }

    function openCreate() {
        setEditingProduct(null);
        setForm({ name: "", brand: "", price: 0, original_price: 0, discount: 0, image: "", rating: 0, reviews: 0, tag: "", category: "", sizes: "Free Size", colors: "" });
        setShowForm(true);
    }

    function openEdit(p: DbProduct) {
        setEditingProduct(p);
        setForm({
            name: p.name, brand: p.brand, price: p.price, original_price: p.original_price,
            discount: p.discount, image: p.image, rating: p.rating, reviews: p.reviews,
            tag: p.tag || "", category: p.category, sizes: p.sizes.join(", "), colors: p.colors.join(", "),
        });
        setShowForm(true);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const token = await getToken();
        const body = {
            ...form,
            sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
            colors: form.colors.split(",").map((s) => s.trim()).filter(Boolean),
            ...(editingProduct ? { id: editingProduct.id } : {}),
        };

        await fetch("/api/admin/products", {
            method: editingProduct ? "PUT" : "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify(body),
        });

        setShowForm(false);
        fetchProducts();
    }

    async function handleDelete(id: number) {
        if (!confirm("Delete this product?")) return;
        const token = await getToken();
        await fetch("/api/admin/products", {
            method: "DELETE",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ id }),
        });
        fetchProducts();
    }

    const filtered = products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.brand.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
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
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">Products</h1>
                    <p className="text-gray-400 text-sm mt-1">{products.length} products total</p>
                </div>
                <button onClick={openCreate} className="px-5 py-2.5 bg-[#800000] hover:bg-[#9a0000] text-white rounded-lg font-bold text-sm transition-colors">
                    + Add Product
                </button>
            </div>

            {/* Search */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search products..."
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
                                <th className="p-4">Product</th>
                                <th className="p-4">Brand</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Price</th>
                                <th className="p-4">Rating</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((p) => (
                                <tr key={p.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-gray-800 overflow-hidden flex-shrink-0">
                                                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-white truncate max-w-[200px]">{p.name}</p>
                                                {p.tag && <span className="text-[10px] text-[#b21e29] font-bold uppercase">{p.tag}</span>}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-400">{p.brand}</td>
                                    <td className="p-4"><span className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-300">{p.category}</span></td>
                                    <td className="p-4 text-sm font-bold text-white">₹{p.price.toLocaleString("en-IN")}</td>
                                    <td className="p-4 text-sm text-gray-400">⭐ {p.rating}</td>
                                    <td className="p-4">
                                        <div className="flex gap-2">
                                            <button onClick={() => openEdit(p)} className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded text-xs text-white transition-colors">Edit</button>
                                            <button onClick={() => handleDelete(p.id)} className="px-3 py-1.5 bg-red-900/30 hover:bg-red-800/50 rounded text-xs text-red-400 transition-colors">Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Form */}
            {showForm && (
                <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
                    <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-xl font-bold text-white mb-5">{editingProduct ? "Edit Product" : "Add New Product"}</h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                            {[
                                { label: "Name", key: "name", type: "text", full: true },
                                { label: "Brand", key: "brand", type: "text" },
                                { label: "Category", key: "category", type: "text" },
                                { label: "Price", key: "price", type: "number" },
                                { label: "Original Price", key: "original_price", type: "number" },
                                { label: "Discount %", key: "discount", type: "number" },
                                { label: "Rating", key: "rating", type: "number" },
                                { label: "Reviews", key: "reviews", type: "number" },
                                { label: "Tag", key: "tag", type: "text" },
                                { label: "Image URL", key: "image", type: "text", full: true },
                                { label: "Sizes (comma separated)", key: "sizes", type: "text", full: true },
                                { label: "Colors (comma separated)", key: "colors", type: "text", full: true },
                            ].map((field) => (
                                <div key={field.key} className={field.full ? "col-span-2" : ""}>
                                    <label className="block text-xs text-gray-400 font-medium mb-1">{field.label}</label>
                                    <input
                                        type={field.type}
                                        value={form[field.key as keyof typeof form]}
                                        onChange={(e) => setForm({ ...form, [field.key]: field.type === "number" ? Number(e.target.value) : e.target.value })}
                                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:border-[#800000] focus:outline-none"
                                    />
                                </div>
                            ))}
                            <div className="col-span-2 flex gap-3 mt-3">
                                <button type="submit" className="flex-1 py-2.5 bg-[#800000] hover:bg-[#9a0000] text-white rounded-lg font-bold text-sm transition-colors">
                                    {editingProduct ? "Update Product" : "Create Product"}
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
