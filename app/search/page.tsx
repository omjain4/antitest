"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { PRODUCTS, FILTERS, type Product } from "@/data/shopData";

/* ─── Search & Filter Page ─── */

import { motion } from "framer-motion";
import { SpinningMandala, CornerPaisley, FloatingElements } from "@/app/components/Decorations";

export default function SearchPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";

    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [sortOption, setSortOption] = useState("Popular");

    // Filter logic
    const filteredProducts = useMemo(() => {
        let result = PRODUCTS;

        // Search query
        if (query) {
            result = result.filter(p =>
                p.name.toLowerCase().includes(query.toLowerCase()) ||
                p.brand.toLowerCase().includes(query.toLowerCase())
            );
        }

        // Category filter
        if (selectedCategory !== "All") {
            result = result.filter(p => p.name.includes(selectedCategory));
        }

        // Sorting
        if (sortOption === "Price: Low to High") {
            result = [...result].sort((a, b) => a.price - b.price);
        } else if (sortOption === "Price: High to Low") {
            result = [...result].sort((a, b) => b.price - a.price);
        } else if (sortOption === "Rating") {
            result = [...result].sort((a, b) => b.rating - a.rating);
        }

        return result;
    }, [query, selectedCategory, sortOption]);

    return (
        <div className="min-h-screen pt-24 pb-12 px-6 md:px-12 bg-white/80 backdrop-blur-sm text-[#3d1a1a] relative overflow-hidden">
            {/* Background Decorations gold and green */}
            <SpinningMandala className="absolute top-[-150px] left-[-150px] w-[500px] h-[500px] opacity-10 pointer-events-none" color="text-[#b21e29]" />
            <SpinningMandala className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] opacity-5 pointer-events-none" color="text-[#b21e29]" reverse={true} />
            <CornerPaisley position="top-right" className="top-24 right-0 opacity-10 w-48 h-48" color="text-[#b21e29]" />
            <CornerPaisley position="bottom-left" className="bottom-0 left-0 opacity-5 w-64 h-64" color="text-[#b21e29]" />

            <div className="max-w-7xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >

                    {/* Header */}
                    <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl italic font-light mb-1 text-[#800000]" style={{ fontFamily: "var(--font-heading)" }}>
                                {query ? `Results for "${query}"` : "All Collections"}
                            </h1>
                            <p className="text-[#8B4513] text-xs tracking-wide">
                                {filteredProducts.length} items found
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <select
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                                className="bg-[#f5e6e0] border border-[#d4a89a] text-[#3d1a1a] text-xs px-4 py-2 rounded-sm outline-none focus:border-[#b21e29]"
                                style={{ fontFamily: "var(--font-body)" }}
                            >
                                {FILTERS.sortBy.map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">

                        {/* Sidebar Filters */}
                        <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                <p className="text-[#800000] text-xs tracking-[0.2em] uppercase mb-4 font-semibold">Categories</p>
                                <div className="flex flex-col gap-2">
                                    {FILTERS.categories.map(cat => (
                                        <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                                            <input
                                                type="radio"
                                                name="category"
                                                checked={selectedCategory === cat}
                                                onChange={() => setSelectedCategory(cat)}
                                                className="accent-gold w-3 h-3"
                                            />
                                            <span className="text-[#5a2d2d] text-xs group-hover:text-[#800000] transition-colors font-medium">
                                                {cat}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </motion.div>
                        </aside>

                        {/* Product Grid */}
                        <div className="flex-1">
                            {filteredProducts.length > 0 ? (
                                <motion.div
                                    initial="hidden"
                                    animate="show"
                                    variants={{
                                        hidden: { opacity: 0 },
                                        show: {
                                            opacity: 1,
                                            transition: {
                                                staggerChildren: 0.1
                                            }
                                        }
                                    }}
                                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
                                >
                                    {filteredProducts.map(product => (
                                        <motion.div
                                            key={product.id}
                                            variants={{
                                                hidden: { opacity: 0, y: 20 },
                                                show: { opacity: 1, y: 0 }
                                            }}
                                        >
                                            <Link href={`/product/${product.id}`} className="group">
                                                <div className="aspect-[3/4] bg-neutral-warm/10 relative overflow-hidden rounded-sm mb-3">
                                                    <div
                                                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                                        style={{ backgroundImage: `url(${product.image})` }}
                                                    />
                                                    {/* Price tag overlay */}
                                                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                                        <p className="text-ivory text-xs font-medium text-center">Quick View</p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-[#800000] text-[10px] tracking-wider uppercase mb-1 font-semibold">{product.brand}</p>
                                                    <p className="text-[#3d1a1a] text-xs truncate mb-1">{product.name}</p>
                                                    <p className="text-[#b21e29] text-sm font-semibold">₹{product.price.toLocaleString("en-IN")}</p>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            ) : (
                                <div className="py-20 text-center">
                                    <p className="text-[#8B4513] text-sm italic">No products match your criteria.</p>
                                    <button
                                        onClick={() => { setSelectedCategory("All"); }}
                                        className="mt-4 text-[#b21e29] text-xs underline underline-offset-4 font-medium"
                                    >
                                        Clear Filters
                                    </button>
                                </div>
                            )}
                        </div>

                    </div>
                </motion.div>
            </div>
        </div>
    );
}
