"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { PRODUCTS } from "@/data/shopData";
import { useCart } from "@/app/context/CartContext";
import { motion } from "framer-motion";
import { SpinningMandala, CornerPaisley } from "@/app/components/Decorations";

export default function ProductPage() {
    const params = useParams();
    const productId = Number(params.id);
    const product = PRODUCTS.find(p => p.id === productId);
    const { addToCart, toggleWishlist, isInWishlist } = useCart();

    const [selectedSize, setSelectedSize] = useState<string>("");
    const [selectedColor, setSelectedColor] = useState<string>("");
    const [addedToBag, setAddedToBag] = useState(false);

    if (!product) {
        return (
            <div className="min-h-screen pt-32 text-center px-4 bg-white/80 backdrop-blur-sm relative overflow-hidden">
                <SpinningMandala className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] opacity-10 pointer-events-none" color="text-[#b21e29]" />
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative z-10"
                >
                    <h2 className="text-[#800000] text-xl font-light mb-2" style={{ fontFamily: "var(--font-heading)" }}>Product Not Found</h2>
                    <p className="text-[#8B4513] text-sm mb-6">This product doesn&apos;t exist or has been removed.</p>
                    <Link href="/search" className="text-[#b21e29] text-xs underline underline-offset-4 font-medium">Browse Collections</Link>
                </motion.div>
            </div>
        );
    }

    const inWishlist = isInWishlist(product.id);

    const handleAddToBag = () => {
        addToCart(product);
        setAddedToBag(true);
        setTimeout(() => setAddedToBag(false), 2000);
    };

    // Get related products (same category, excluding current)
    const relatedProducts = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

    return (
        <div className="min-h-screen pt-0 pb-12 px-6 md:px-12 bg-white/80 backdrop-blur-sm text-[#3d1a1a] relative overflow-hidden">
            {/* Background Decorations */}
            <SpinningMandala className="absolute top-[-150px] right-[-150px] w-[500px] h-[500px] opacity-10 pointer-events-none" color="text-[#b21e29]" />
            <SpinningMandala className="absolute bottom-[-100px] left-[-100px] w-[400px] h-[400px] opacity-5 pointer-events-none" color="text-[#b21e29]" reverse={true} />
            <CornerPaisley position="top-right" className="top-24 right-0 opacity-10 w-48 h-48" color="text-[#b21e29]" />
            <CornerPaisley position="bottom-left" className="bottom-0 left-0 opacity-5 w-64 h-64" color="text-[#b21e29]" />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Breadcrumb */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="mb-8"
                >
                    <div className="flex items-center gap-2 text-xs text-[#8B4513]">
                        <Link href="/" className="hover:text-[#800000] transition-colors">Home</Link>
                        <span>/</span>
                        <Link href="/search" className="hover:text-[#800000] transition-colors">Collections</Link>
                        <span>/</span>
                        <span className="text-[#3d1a1a] font-medium truncate max-w-[200px]">{product.name}</span>
                    </div>
                </motion.div>

                {/* Product Detail */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16"
                >
                    {/* Left: Product Image */}
                    <div className="aspect-[3/4] bg-[#f5e6e0] relative overflow-hidden rounded-sm">
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${product.image})` }}
                        />
                        {product.tag && (
                            <div className="absolute top-4 left-4 bg-[#800000] text-white text-[10px] tracking-wider uppercase px-3 py-1.5 rounded-sm font-semibold">
                                {product.tag}
                            </div>
                        )}
                    </div>

                    {/* Right: Product Info */}
                    <div className="flex flex-col justify-center">
                        {/* Brand */}
                        <p className="text-[#800000] text-xs tracking-[0.2em] uppercase font-semibold mb-2">{product.brand}</p>

                        {/* Name */}
                        <h1 className="text-2xl md:text-3xl font-light text-[#3d1a1a] mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                            {product.name}
                        </h1>

                        {/* Rating */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex items-center gap-1">
                                <span className="text-sm text-[#d4af37]">★</span>
                                <span className="text-sm font-medium text-[#3d1a1a]">{product.rating}</span>
                            </div>
                            <span className="text-xs text-[#8B4513]">({product.reviews} reviews)</span>
                            <span className="text-xs text-[#8B4513]">|</span>
                            <span className="text-xs text-[#8B4513]">{product.category}</span>
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-3 mb-8">
                            <span className="text-2xl font-semibold text-[#b21e29]">₹{product.price.toLocaleString("en-IN")}</span>
                            <span className="text-sm text-[#8B4513] line-through">₹{product.originalPrice.toLocaleString("en-IN")}</span>
                            <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-sm">{product.discount}% OFF</span>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-[#d4a89a]/30 mb-6" />

                        {/* Size Selection */}
                        <div className="mb-6">
                            <p className="text-xs text-[#800000] tracking-[0.15em] uppercase font-semibold mb-3">Size</p>
                            <div className="flex gap-2 flex-wrap">
                                {product.sizes.map(size => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`px-4 py-2 text-xs rounded-sm border transition-all ${selectedSize === size
                                            ? "bg-[#800000] text-white border-[#800000]"
                                            : "bg-white border-[#d4a89a] text-[#3d1a1a] hover:border-[#800000]"
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Color Selection */}
                        <div className="mb-8">
                            <p className="text-xs text-[#800000] tracking-[0.15em] uppercase font-semibold mb-3">Color</p>
                            <div className="flex gap-2 flex-wrap">
                                {product.colors.map(color => (
                                    <button
                                        key={color}
                                        onClick={() => setSelectedColor(color)}
                                        className={`px-4 py-2 text-xs rounded-sm border transition-all ${selectedColor === color
                                            ? "bg-[#800000] text-white border-[#800000]"
                                            : "bg-white border-[#d4a89a] text-[#3d1a1a] hover:border-[#800000]"
                                            }`}
                                    >
                                        {color}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={handleAddToBag}
                                className="flex-1 py-3.5 text-center bg-[#800000] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#b21e29] transition-colors rounded-sm"
                            >
                                {addedToBag ? "✓ Added to Bag" : "Add to Bag"}
                            </button>
                            <button
                                onClick={() => toggleWishlist(product.id)}
                                className={`w-14 flex items-center justify-center border rounded-sm text-lg transition-all ${inWishlist
                                    ? "bg-[#b21e29] text-white border-[#b21e29]"
                                    : "bg-white border-[#d4a89a] text-[#b21e29] hover:border-[#800000]"
                                    }`}
                                title={inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                            >
                                {inWishlist ? "♥" : "♡"}
                            </button>
                        </div>

                        {/* Delivery Info */}
                        <div className="mt-8 border-t border-[#d4a89a]/30 pt-6 space-y-3">
                            <div className="flex items-center gap-3 text-xs text-[#5a2d2d]">
                                <span>🚚</span>
                                <span>Free delivery on orders above ₹15,000</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-[#5a2d2d]">
                                <span>↩️</span>
                                <span>Easy 15-day returns & exchanges</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-[#5a2d2d]">
                                <span>✓</span>
                                <span>100% authentic handloom product</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="mt-20"
                    >
                        <div className="border-t border-[#d4a89a]/30 pt-12">
                            <h2 className="text-xl font-light text-[#800000] mb-8" style={{ fontFamily: "var(--font-heading)" }}>
                                You May Also Like
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                                {relatedProducts.map(rp => (
                                    <Link key={rp.id} href={`/product/${rp.id}`} className="group">
                                        <div className="aspect-[3/4] bg-[#f5e6e0] relative overflow-hidden rounded-sm mb-3">
                                            <div
                                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                                style={{ backgroundImage: `url(${rp.image})` }}
                                            />
                                            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                                <p className="text-white text-xs font-medium text-center">Quick View</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[#800000] text-[10px] tracking-wider uppercase mb-1 font-semibold">{rp.brand}</p>
                                            <p className="text-[#3d1a1a] text-xs truncate mb-1">{rp.name}</p>
                                            <p className="text-[#b21e29] text-sm font-semibold">₹{rp.price.toLocaleString("en-IN")}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
