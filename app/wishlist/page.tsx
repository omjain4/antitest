"use client";

import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import { PRODUCTS } from "@/data/shopData";

import { motion } from "framer-motion";
import { SpinningMandala, CornerPaisley, FloatingElements } from "@/app/components/Decorations";

export default function WishlistPage() {
    const { wishlist, removeFromCart, toggleWishlist } = useCart();

    // Hydrate wishlist items from IDs
    const wishlistItems = PRODUCTS.filter(p => wishlist.includes(p.id));

    if (wishlistItems.length === 0) {
        return (
            <div className="min-h-screen pt-32 text-center px-4 relative overflow-hidden">
                <SpinningMandala className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] text-white/10 opacity-20 pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative z-10"
                >
                    <h2 className="text-ivory text-xl font-light mb-2">Your Wishlist is Empty</h2>
                    <p className="text-text-dim text-sm mb-6">Save your favorite heirlooms here.</p>
                    <Link href="/search" className="text-gold text-xs underline underline-offset-4">Continue Shopping</Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 md:px-12 bg-[#800000]/10 backdrop-blur-sm text-ivory relative overflow-hidden">
            {/* Background Decorations */}
            <SpinningMandala className="absolute top-[-150px] right-[-150px] w-[600px] h-[600px] opacity-10 pointer-events-none" color="text-gold" />
            <SpinningMandala className="absolute bottom-[-200px] left-[-100px] w-[500px] h-[500px] opacity-5 pointer-events-none" color="text-gold" reverse={true} />
            <CornerPaisley position="bottom-left" className="bottom-0 left-0 opacity-10 w-64 h-64" color="text-gold" />
            <CornerPaisley position="top-right" className="top-20 right-0 opacity-5 w-48 h-48" color="text-[#f4e4bc]" />

            <div className="max-w-6xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-2xl font-light mb-8">My Wishlist <span className="text-sm text-text-muted">({wishlistItems.length})</span></h1>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {wishlistItems.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.05 }}
                                className="relative group bg-neutral-warm/10 rounded-sm overflow-hidden"
                            >
                                {/* Close Button */}
                                <button
                                    onClick={() => toggleWishlist(product.id)}
                                    className="absolute top-2 right-2 z-10 w-6 h-6 flex items-center justify-center bg-black/50 rounded-full text-white hover:bg-accent-crimson transition-colors"
                                >
                                    ✕
                                </button>

                                <Link href={`/product/${product.id}`} className="block aspect-[3/4] bg-cover bg-center" style={{ backgroundImage: `url(${product.image})` }} />

                                <div className="p-4">
                                    <p className="text-xs text-text-muted truncate mb-1">{product.name}</p>
                                    <p className="text-sm font-medium mb-3">₹{product.price.toLocaleString("en-IN")}</p>

                                    <Link
                                        href={`/product/${product.id}`}
                                        className="block w-full py-3 text-center bg-white border border-black text-black text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
                                    >
                                        Move to Bag
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
