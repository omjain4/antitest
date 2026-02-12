"use client";

import Link from "next/link";
import { useCart } from "@/app/context/CartContext";

import { motion } from "framer-motion";
import { SpinningMandala, CornerPaisley, FloatingElements } from "@/app/components/Decorations";

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, totalPrice } = useCart();
    const SHIPPING_COST = totalPrice > 1000 ? 0 : 500;
    const FINAL_TOTAL = totalPrice + SHIPPING_COST;

    if (cart.length === 0) {
        return (
            <div className="min-h-screen pt-32 flex flex-col items-center justify-center text-center px-4 bg-white text-black relative overflow-hidden">
                <FloatingElements />
                <SpinningMandala className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] text-gray-200 opacity-20 pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative z-10 flex flex-col items-center"
                >
                    <div className="w-20 h-20 mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" /></svg>
                    </div>
                    <h2 className="text-2xl font-black tracking-tight mb-2">Your Bag is Empty</h2>
                    <p className="text-gray-500 mb-8 max-w-sm">Looks like you haven&apos;t found your perfect match yet.</p>
                    <Link href="/search" className="px-8 py-3 bg-white border border-black text-black text-sm font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors">
                        Start Shopping
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 md:px-12 bg-white/80 backdrop-blur-sm text-black font-sans relative overflow-hidden">
            {/* Background Decorations */}
            <SpinningMandala className="absolute top-[-200px] left-[-200px] w-[700px] h-[700px] opacity-5 pointer-events-none" color="text-[#dc2626]" reverse={true} />
            <CornerPaisley position="bottom-right" className="bottom-0 right-0 opacity-5 w-64 h-64" color="text-[#b21e29]" />
            <CornerPaisley position="top-left" className="top-24 left-0 opacity-5 w-48 h-48" color="text-[#b21e29]" />

            <div className="max-w-6xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-3xl md:text-4xl font-black tracking-tighter mb-8 border-b border-gray-200 pb-4">Shopping Bag <span className="text-lg font-medium text-gray-400 ml-2">({cart.length} items)</span></h1>

                    <div className="flex flex-col lg:flex-row gap-12">

                        {/* Cart Items List */}
                        <div className="flex-1 space-y-8">
                            {cart.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                    className="flex gap-4 md:gap-6 pb-8 border-b border-gray-100 last:border-0"
                                >
                                    <div
                                        className="w-24 h-32 md:w-32 md:h-40 bg-cover bg-center rounded-lg shrink-0 border border-gray-200 bg-gray-50"
                                        style={{ backgroundImage: `url(${item.image})` }}
                                    />
                                    <div className="flex-1 flex flex-col justify-between py-1">
                                        <div>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{item.brand}</p>
                                                    <Link href={`/product/${item.id}`} className="text-base md:text-lg font-bold hover:underline decoration-2 underline-offset-4 line-clamp-2 md:line-clamp-none">{item.name}</Link>
                                                </div>
                                                <p className="font-bold text-base md:text-lg">₹{item.price.toLocaleString("en-IN")}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mt-4">
                                            <div className="flex items-center border border-gray-300 rounded-full h-8">
                                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 hover:bg-gray-100 rounded-l-full h-full text-gray-600">-</button>
                                                <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 hover:bg-gray-100 rounded-r-full h-full text-gray-600">+</button>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-xs font-bold text-red-600 hover:text-red-700 uppercase tracking-wide border-b border-red-200 hover:border-red-600 pb-0.5 transition-colors"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="w-full lg:w-96 h-fit bg-gray-50 p-8 rounded-2xl border border-gray-100"
                        >
                            <h3 className="text-lg font-black uppercase tracking-tight mb-6">Order Summary</h3>
                            <div className="space-y-4 mb-6 text-sm text-gray-600 font-medium">
                                <div className="flex justify-between">
                                    <span>Bag Total</span>
                                    <span className="text-black font-bold">₹{totalPrice.toLocaleString("en-IN")}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span className={SHIPPING_COST === 0 ? "text-[#b21e29] font-bold" : "text-black"}>
                                        {SHIPPING_COST === 0 ? "Free" : `₹${SHIPPING_COST}`}
                                    </span>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 pt-6 mb-8">
                                <div className="flex justify-between font-black text-xl text-black">
                                    <span>Total</span>
                                    <span>₹{FINAL_TOTAL.toLocaleString("en-IN")}</span>
                                </div>
                                <p className="text-xs text-gray-400 mt-2 font-medium">Inclusive of all taxes</p>
                            </div>

                            <button className="w-full py-4 bg-white border border-black text-black text-sm font-bold tracking-widest uppercase hover:bg-black hover:text-white transition-colors shadow-none">
                                Check Out
                            </button>

                            <div className="mt-6 flex justify-center gap-4 text-gray-400">
                                {/* Payment Icons handled by SVGs or just placeholders */}
                                <div className="w-8 h-5 bg-gray-200 rounded"></div>
                                <div className="w-8 h-5 bg-gray-200 rounded"></div>
                                <div className="w-8 h-5 bg-gray-200 rounded"></div>
                                <div className="w-8 h-5 bg-gray-200 rounded"></div>
                            </div>
                        </motion.div>

                    </div>
                </motion.div>
            </div>
        </div>
    );
}
