"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { PRODUCTS, type Product } from "@/data/shopData";
import { useCart } from "@/app/context/CartContext";
import { SpinningMandala, CornerPaisley } from "@/app/components/Decorations";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function ProductPage() {
    const { id } = useParams();
    const productId = Number(id);
    const { addToCart, toggleWishlist, isInWishlist } = useCart();

    const product = useMemo(() => PRODUCTS.find(p => p.id === productId), [productId]);
    const isWishlisted = isInWishlist(productId);

    const [selectedSize, setSelectedSize] = useState<string>(product?.sizes[0] || "Free Size");
    const [isAdded, setIsAdded] = useState(false);
    const [activeImage, setActiveImage] = useState(0);

    const handleAddToCart = () => {
        if (!product) return;
        addToCart(product);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    if (!product) {
        return (
            <div className="min-h-screen pt-32 text-center text-text-muted font-bold">
                Product not found
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-28 pb-12 px-4 md:px-12 bg-[#800000]/10 backdrop-blur-sm font-sans relative overflow-hidden selection:bg-gold selection:text-black">
            {/* Background Decoration */}
            <SpinningMandala className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] text-gold opacity-10 pointer-events-none" />
            <CornerPaisley position="bottom-left" className="bottom-0 left-0 opacity-10 w-64 h-64 text-gold" />

            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-20 relative z-10">

                {/* Left: Product Images */}
                <div className="w-full lg:w-1/2 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="aspect-[3/4] rounded-t-[60px] rounded-b-[20px] overflow-hidden relative group border border-[#d4af37]/20 shadow-xl"
                    >
                        <motion.div
                            key={activeImage}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.4 }}
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${product.image})` }}
                        />
                    </motion.div>

                    {/* Thumbnails */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="grid grid-cols-4 gap-4"
                    >
                        {[0, 1, 2, 3].map((i) => (
                            <motion.button
                                key={i}
                                whileHover={{ y: -5 }}
                                onClick={() => setActiveImage(i)}
                                className={`aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer border-2 transition-all shadow-sm ${activeImage === i ? 'border-[#d4af37] ring-1 ring-[#d4af37]/50' : 'border-transparent hover:border-[#d4af37]/50'
                                    }`}
                            >
                                <div className="w-full h-full bg-cover bg-center opacity-90 hover:opacity-100 transition-opacity" style={{ backgroundImage: `url(${product.image})` }} />
                            </motion.button>
                        ))}
                    </motion.div>
                </div>

                {/* Right: Details */}
                <div className="w-full lg:w-1/2 pt-4">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, staggerChildren: 0.1 }}
                    >
                        <motion.span
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="text-[#d4af37] text-xs font-bold uppercase tracking-[0.2em] mb-3 block"
                        >
                            {product.brand}
                        </motion.span>

                        <motion.h1
                            className="text-4xl md:text-6xl font-bold leading-[0.9] mb-6 tracking-tight italic text-[#1a1a1a]"
                            style={{ fontFamily: "var(--font-heading)" }}
                        >
                            {product.name}
                        </motion.h1>

                        <motion.div className="flex items-baseline gap-4 mb-8 border-b border-[#d4af37]/20 pb-8">
                            <span className="text-3xl font-bold text-[#1a1a1a]">₹{product.price.toLocaleString("en-IN")}</span>
                            <span className="text-gray-400 text-lg line-through font-medium">₹{product.originalPrice.toLocaleString("en-IN")}</span>
                            <span className="text-[#b21e29] text-sm font-bold bg-[#b21e29]/10 px-2 py-1 rounded">({product.discount}% OFF)</span>
                        </motion.div>

                        {/* Size Selector */}
                        <div className="mb-10">
                            <div className="flex justify-between items-center mb-4">
                                <p className="text-sm font-bold uppercase tracking-widest text-[#1a1a1a]">Select Size</p>
                                <button className="text-[10px] font-bold text-[#d4af37] hover:text-[#1a1a1a] uppercase tracking-wider underline underline-offset-4 transition-colors">Size Guide</button>
                            </div>
                            <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
                                {product.sizes.map(size => (
                                    <motion.button
                                        key={size}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setSelectedSize(size)}
                                        className={`flex-shrink-0 px-8 py-3 border rounded-full text-sm font-bold transition-all shadow-sm ${selectedSize === size
                                            ? "border-[#1a1a1a] bg-[#1a1a1a] text-[#d4af37]"
                                            : "border-gray-200 text-gray-600 hover:border-[#d4af37] hover:text-[#d4af37] bg-white"
                                            }`}
                                    >
                                        {size}
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4 mb-12">
                            <motion.button
                                onClick={handleAddToCart}
                                disabled={isAdded}
                                whileHover={{ scale: 1.02, boxShadow: "0 10px 30px -10px rgba(212, 175, 55, 0.5)" }}
                                whileTap={{ scale: 0.95 }}
                                className={`flex-1 py-4 text-sm font-bold tracking-[0.2em] uppercase transition-all shadow-none flex items-center justify-center gap-3 ${isAdded
                                    ? "bg-[#b21e29] text-white border border-transparent rounded-full"
                                    : "bg-white text-black border border-black hover:bg-black hover:text-white rounded-none"
                                    }`}
                            >
                                {isAdded ? (
                                    <>
                                        <motion.svg
                                            initial={{ scale: 0 }} animate={{ scale: 1 }}
                                            width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                                        >
                                            <polyline points="20 6 9 17 4 12" />
                                        </motion.svg>
                                        Added to Bag
                                    </>
                                ) : (
                                    "Add to Bag"
                                )}
                            </motion.button>

                            <motion.button
                                onClick={() => toggleWishlist(product.id)}
                                whileHover={{ scale: 1.02, backgroundColor: "rgba(239, 68, 68, 0.05)" }}
                                whileTap={{ scale: 0.95 }}
                                className={`w-16 md:w-auto md:px-8 border border-gray-200 text-sm font-bold tracking-widest uppercase transition-colors rounded-full flex items-center justify-center gap-2 ${isWishlisted
                                    ? "border-red-500 text-red-500 bg-red-50"
                                    : "border-gray-300 text-[#1a1a1a] hover:border-[#1a1a1a]"
                                    }`}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                </svg>
                            </motion.button>
                        </div>

                        {/* Editorial Details Box */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-white/50 backdrop-blur-sm border border-[#d4af37]/20 rounded-3xl p-8 space-y-6 shadow-sm"
                        >
                            <div>
                                <h3 className="text-lg font-bold uppercase tracking-widest mb-3 text-[#1a1a1a] flex items-center gap-2">
                                    <span className="text-[#d4af37]">✦</span> Editor&apos;s Note
                                </h3>
                                <p className="text-gray-600 leading-relaxed font-serif text-lg italic">
                                    &ldquo;Handcrafted by master weavers of Varanasi. This saree features intricate zari work using pure gold and silver threads. Perfect for weddings and festive occasions. The fabric is pure silk, ensuring a regal drape and lasting sheen.&rdquo;
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-[#d4af37]/10">
                                <div>
                                    <span className="block text-[10px] font-bold text-[#8b7e66] uppercase mb-1 tracking-widest">Material</span>
                                    <span className="text-sm font-bold text-[#1a1a1a]">Pure Silk (Silk Mark Certified)</span>
                                </div>
                                <div>
                                    <span className="block text-[10px] font-bold text-[#8b7e66] uppercase mb-1 tracking-widest">Care</span>
                                    <span className="text-sm font-bold text-[#1a1a1a]">Dry Clean Only</span>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
