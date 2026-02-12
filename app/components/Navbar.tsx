"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";

const SearchIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);

const MenuIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
);

const BagIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />
    </svg>
);

const CloseIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

export default function Navbar() {
    const { cartCount, wishlist } = useCart();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const searchParams = useSearchParams();
    const activeCategory = searchParams.get("category") || "The Latest";

    // Categories list moved from PostSequence
    const categories = ["The Latest", "Best Sellers", "Banarasi", "Kanjivaram", "Patola", "Chanderi", "Tussar", "Wedding Edit", "New Drops", "Ready to Wear", "Boutique", "Gifts", "Sale"];

    // Lock body scroll when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isMenuOpen]);

    return (
        <>
            {/* Top Row: Main Nav (Sticky) */}
            <div className="sticky top-0 z-50 flex flex-col bg-white/95 backdrop-blur-md shadow-sm transition-all duration-300">
                <nav className="h-16 border-b border-[#d4a89a]/20 flex items-center px-4 md:px-8 max-w-[1800px] mx-auto w-full gap-4">

                    {/* Left: Brand */}
                    <div className="flex-1 flex justify-start">
                        <Link href="/" className="flex items-center gap-2 group" onClick={() => setIsMenuOpen(false)}>
                            <div className="w-3 h-3 rounded-full bg-[#800000] group-hover:scale-110 transition-transform" />
                            <span className="text-2xl font-black tracking-tighter uppercase text-[#800000]" style={{ fontFamily: "var(--font-heading)" }}>
                                PARINEY
                            </span>
                        </Link>
                    </div>

                    {/* Center: Search Pill */}
                    <div className="flex-[2] max-w-xl mx-auto hidden md:flex justify-center">
                        <div className="flex items-center gap-3 w-full max-w-md px-4 py-2 bg-gray-50 border border-gray-200 rounded-full hover:shadow-sm focus-within:shadow-md focus-within:border-gray-300 transition-all cursor-text text-[#3d1a1a]">
                            <SearchIcon />
                            <span className="text-sm font-medium text-gray-500">Discover anything</span>
                        </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex-1 flex justify-end items-center gap-6">
                        <Link href="/search" className="hidden lg:block text-sm font-bold text-[#3d1a1a] hover:text-[#800000] transition-colors">
                            Collections
                        </Link>
                        <Link href="/wishlist" className="hidden lg:block text-sm font-bold text-[#3d1a1a] hover:text-[#800000] transition-colors">
                            Wishlist {wishlist.length > 0 && `(${wishlist.length})`}
                        </Link>

                        {/* Cart Icon */}
                        <Link href="/cart" onClick={() => setIsMenuOpen(false)} className="relative p-2 hover:bg-gray-100 rounded-full transition-colors group">
                            <BagIcon />
                            {cartCount > 0 && (
                                <span className="absolute top-0 right-0 w-4 h-4 bg-[#800000] text-white text-[10px] font-bold flex items-center justify-center rounded-full group-hover:scale-110 transition-transform">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 border border-gray-200 rounded-full hover:bg-gray-100 transition-colors lg:hidden"
                        >
                            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
                        </button>
                    </div>
                </nav>
            </div>

            {/* Bottom Row: Sub - Nav (Static / In-Flow) */}
            <div className="h-10 flex items-center border-b border-[#d4a89a]/10 bg-white/50 w-full relative z-40">
                <div className="max-w-[1800px] mx-auto w-full px-4 md:px-8 flex items-center h-full overflow-hidden">
                    {/* Label */}
                    <span className="text-sm font-bold italic text-[#800000] whitespace-nowrap hidden sm:block mr-4 flex-shrink-0" style={{ fontFamily: "var(--font-heading)" }}>
                        Collections
                    </span>

                    {/* Divider */}
                    <div className="hidden sm:block w-[1px] h-4 bg-[#d4a89a]/40 mr-4 flex-shrink-0" />

                    {/* Scrollable Categories */}
                    <div className="flex items-center gap-1 overflow-x-auto pb-1 -mb-1 w-full no-scrollbar">
                        {categories.map((cat) => {
                            const isActive = activeCategory === cat || (activeCategory === "All" && cat === "The Latest") || (cat === "The Latest" && !searchParams.get("category"));
                            return (
                                <Link
                                    key={cat}
                                    href={`/?category=${encodeURIComponent(cat)}`}
                                    className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase transition-all duration-300 border ${isActive ? "bg-white border-gray-200 text-[#800000] shadow-sm" : "bg-transparent border-transparent text-[#5a2d2d] hover:bg-gray-50"}`}
                                >
                                    {cat}
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-40 bg-white pt-32 px-6 pb-6 overflow-y-auto lg:hidden"
                    >
                        <div className="flex flex-col gap-8">
                            {/* Mobile Search */}
                            <div className="flex items-center gap-3 w-full px-5 py-3 rounded-full border border-gray-200 bg-gray-50 text-gray-800">
                                <SearchIcon />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    className="bg-transparent w-full outline-nonetext-sm placeholder:text-gray-500"
                                />
                            </div>

                            {/* Mobile Links */}
                            <div className="flex flex-col gap-6 text-2xl font-light text-[#3d1a1a]">
                                <Link href="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
                                <Link href="/search" onClick={() => setIsMenuOpen(false)}>Collections</Link>
                                <Link href="/wishlist" onClick={() => setIsMenuOpen(false)}>
                                    Wishlist <span className="text-sm align-top text-[#800000] font-bold">({wishlist.length})</span>
                                </Link>
                                <Link href="/account" onClick={() => setIsMenuOpen(false)}>Account</Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
