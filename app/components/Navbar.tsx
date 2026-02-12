"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";

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
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-[#d4a89a]/30 h-20 flex items-center shadow-sm">
                <div className="max-w-[1400px] mx-auto w-full px-4 md:px-8 flex items-center justify-between gap-4">

                    {/* Left: Brand */}
                    <Link href="/" className="flex items-center gap-2 group flex-shrink-0 z-50" onClick={() => setIsMenuOpen(false)}>
                        <div className="w-3 h-3 rounded-full bg-[#800000] group-hover:scale-110 transition-transform" />
                        <div className="flex flex-col leading-none">
                            <span className="text-2xl font-black tracking-tighter uppercase text-[#800000]" style={{ fontFamily: "var(--font-heading)" }}>
                                PARINEY
                            </span>
                        </div>
                    </Link>

                    {/* Center: Search Pill (Desktop) */}
                    <div className="hidden md:flex flex-1 max-w-md mx-4">
                        <div className="flex items-center gap-3 w-full px-5 py-3 rounded-full border border-[#d4a89a]/50 shadow-[0_2px_8px_rgba(178,30,41,0.05)] hover:shadow-md transition-shadow bg-white/90 text-[#3d1a1a] cursor-text group focus-within:border-[#800000]">
                            <SearchIcon />
                            <span className="text-sm font-bold text-[#8B4513]/70 group-hover:text-[#3d1a1a]">Discover anything</span>
                        </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-4 md:gap-6 z-50 text-[#3d1a1a]">
                        {/* Links (Desktop) */}
                        <Link href="/search" className="hidden lg:flex items-center gap-2 text-sm font-bold hover:text-[#800000] transition-colors">
                            <span>Collections</span>
                        </Link>
                        <Link href="/wishlist" className="hidden lg:flex items-center gap-2 text-sm font-bold hover:text-[#800000] transition-colors">
                            <span>Wishlist {wishlist.length > 0 && `(${wishlist.length})`}</span>
                        </Link>

                        {/* Cart */}
                        <Link href="/cart" onClick={() => setIsMenuOpen(false)} className="relative p-2 hover:bg-[#b21e29]/10 rounded-full transition-colors group">
                            <BagIcon />
                            {cartCount > 0 && (
                                <span className="absolute top-0 right-0 w-4 h-4 bg-[#800000] text-white text-[10px] font-bold flex items-center justify-center rounded-full group-hover:scale-110 transition-transform">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* Hamburger */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 border border-[#d4a89a]/50 rounded-full hover:bg-[#b21e29]/10 transition-colors lg:hidden"
                        >
                            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-40 bg-white pt-24 px-6 pb-6 overflow-y-auto lg:hidden"
                    >
                        <div className="flex flex-col gap-8">
                            {/* Mobile Search */}
                            <div className="flex items-center gap-3 w-full px-5 py-3 rounded-full border border-gray-200 bg-gray-50 text-gray-800">
                                <SearchIcon />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    className="bg-transparent w-full outline-none text-sm font-bold placeholder:text-gray-400 text-black"
                                />
                            </div>

                            {/* Mobile Links */}
                            <nav className="flex flex-col gap-6">
                                <Link
                                    href="/"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="text-2xl font-bold text-black border-b border-gray-100 pb-4 flex justify-between items-center"
                                >
                                    Home
                                    <span className="text-gray-300 text-lg">→</span>
                                </Link>
                                <Link
                                    href="/search"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="text-2xl font-bold text-black border-b border-gray-100 pb-4 flex justify-between items-center"
                                >
                                    Collections
                                    <span className="text-gray-300 text-lg">→</span>
                                </Link>
                                <Link
                                    href="/wishlist"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="text-2xl font-bold text-black border-b border-gray-100 pb-4 flex justify-between items-center"
                                >
                                    Wishlist
                                    {wishlist.length > 0 && (
                                        <span className="bg-[#b21e29] text-white text-xs px-2 py-1 rounded-full">{wishlist.length}</span>
                                    )}
                                </Link>
                                <Link
                                    href="/cart"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="text-2xl font-bold text-black border-b border-gray-100 pb-4 flex justify-between items-center"
                                >
                                    My Bag
                                    {cartCount > 0 && (
                                        <span className="bg-black text-white text-xs px-2 py-1 rounded-full">{cartCount}</span>
                                    )}
                                </Link>
                            </nav>

                            {/* Mobile Footer Links */}
                            <div className="mt-auto pt-8 border-t border-gray-100 text-gray-500 text-sm font-medium flex flex-col gap-4">
                                <Link href="#" className="hover:text-black">Account</Link>
                                <Link href="#" className="hover:text-black">Help & Support</Link>
                                <Link href="#" className="hover:text-black">Returns</Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
