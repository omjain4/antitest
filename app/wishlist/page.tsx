"use client";

import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import { PRODUCTS } from "@/data/shopData";

import { motion } from "framer-motion";
import { SpinningMandala, CornerPaisley } from "@/app/components/Decorations";

export default function WishlistPage() {
    const { wishlist, toggleWishlist } = useCart();

    // Hydrate wishlist items from IDs
    const wishlistItems = PRODUCTS.filter(p => wishlist.includes(p.id));

    if (wishlistItems.length === 0) {
        return (
            <div className="min-h-screen pt-32 text-center px-4 bg-white/80 backdrop-blur-sm relative overflow-hidden">
                <SpinningMandala className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] opacity-10 pointer-events-none" color="text-[#b21e29]" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative z-10"
                >
                    <h2 className="text-[#800000] text-xl font-light mb-2" style={{ fontFamily: "var(--font-heading)" }}>Your Wishlist is Empty</h2>
                    <p className="text-[#8B4513] text-sm mb-6">Save your favorite heirlooms here.</p>
                    <Link href="/search" className="text-[#b21e29] text-xs underline underline-offset-4 font-medium">Continue Shopping</Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt- pb-12 px-6 md:px-12 bg-white/80 backdrop-blur-sm text-[#3d1a1a] relative overflow-hidden">
            {/* Background Decorations */}
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
                    {/* Header - matching collections page */}
                    <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl italic font-light mb-1 text-[#800000]" style={{ fontFamily: "var(--font-heading)" }}>
                                My Wishlist
                            </h1>
                            <p className="text-[#8B4513] text-xs tracking-wide">
                                {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"} saved
                            </p>
                        </div>
                    </div>

                    {/* Product Grid - matching collections page */}
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
                        {wishlistItems.map(product => (
                            <motion.div
                                key={product.id}
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    show: { opacity: 1, y: 0 }
                                }}
                                className="relative"
                            >
                                {/* Remove from wishlist button */}
                                <button
                                    onClick={() => toggleWishlist(product.id)}
                                    className="absolute top-2 right-2 z-10 w-7 h-7 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full text-[#b21e29] hover:bg-[#b21e29] hover:text-white transition-colors shadow-sm"
                                    title="Remove from Wishlist"
                                >
                                    ✕
                                </button>

                                <Link href={`/product/${product.id}`} className="group">
                                    <div className="aspect-[3/4] bg-[#f5e6e0] relative overflow-hidden rounded-sm mb-3">
                                        <div
                                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                            style={{ backgroundImage: `url(${product.image})` }}
                                        />
                                        {/* Quick View overlay */}
                                        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                            <p className="text-white text-xs font-medium text-center">Quick View</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[#800000] text-[10px] tracking-wider uppercase mb-1 font-semibold">{product.brand}</p>
                                        <p className="text-[#3d1a1a] text-xs truncate mb-1">{product.name}</p>
                                        <p className="text-[#b21e29] text-sm font-semibold">₹{product.price.toLocaleString("en-IN")}</p>
                                    </div>
                                </Link>

                                {/* Move to Bag button */}
                                <Link
                                    href={`/product/${product.id}`}
                                    className="block w-full mt-3 py-2.5 text-center bg-[#800000] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#b21e29] transition-colors rounded-sm"
                                >
                                    Move to Bag
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
