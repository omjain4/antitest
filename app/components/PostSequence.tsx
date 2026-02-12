"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PRODUCTS, HERO_SLIDES, type Product } from "@/data/shopData";
import { SpinningMandala, CornerPaisley, FloralBorder, PatternDivider, FloatingElements } from "./Decorations";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";

/* ─── Components ─── */

const PlayIcon = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="white" className="drop-shadow-lg scale-100 group-hover:scale-110 transition-transform duration-300">
        <circle cx="12" cy="12" r="10" className="text-white" fill="white" />
        <path d="M10 8l6 4-6 4V8z" fill="#d4af37" />
    </svg>
);

/* 
  TRADITIONAL / RINGER HYBRID LAYOUT 
*/



function HeroSlider() {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="w-full max-w-[1800px] mx-auto px-2 md:px-4 pt-4 pb-6 relative">
            <SpinningMandala className="absolute top-4 left-4 text-[#b21e29] w-48 h-48 hidden lg:block opacity-10" />
            <SpinningMandala className="absolute bottom-4 right-4 text-[#b21e29] w-48 h-48 hidden lg:block opacity-10" />

            {/* Cinematic Card Container */}
            <motion.div
                className="relative w-full aspect-[16/10] md:aspect-[2.4/1] rounded-[2rem] overflow-hidden shadow-2xl transition-all duration-500 bg-gray-900 group"
            >
                {/* Slides */}
                <AnimatePresence mode="popLayout">
                    {HERO_SLIDES.map((slide, index) => (
                        index === currentSlide && (
                            <motion.div
                                key={slide.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 1 }}
                                className="absolute inset-0 z-10"
                            >
                                {/* Background Image with slow zoom */}
                                <motion.div
                                    className="absolute inset-0 bg-cover bg-center"
                                    initial={{ scale: 1.05 }}
                                    animate={{ scale: 1.15 }}
                                    transition={{ duration: 10, ease: "linear" }}
                                    style={{ backgroundImage: `url(${slide.image})` }}
                                />

                                {/* Dark Gradient Overlay - Stronger at bottom for text readability */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-90" />

                                {/* Content Overlay - Centered Bottom */}
                                <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 md:pb-16 text-center px-6 md:px-20 max-w-5xl mx-auto">

                                    {/* Tag */}
                                    <motion.span
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="inline-block mb-4 px-3 py-1 bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] rounded-full shadow-sm"
                                    >
                                        {slide.tag}
                                    </motion.span>

                                    {/* Title */}
                                    <motion.h1
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                        className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-4 drop-shadow-xl tracking-tight italic"
                                        style={{ fontFamily: "var(--font-heading)" }}
                                    >
                                        {slide.title}
                                    </motion.h1>

                                    {/* Subtitle */}
                                    <motion.p
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                        className="text-gray-200 text-sm md:text-lg font-medium max-w-2xl mb-8 leading-relaxed line-clamp-2 md:line-clamp-none"
                                    >
                                        {slide.subtitle}
                                    </motion.p>

                                    {/* Author & Meta Data */}
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.6 }}
                                        className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10"
                                    >
                                        {/* Avatar Placeholder */}
                                        <div className="w-6 h-6 rounded-full bg-gray-300 overflow-hidden border border-white/50">
                                            <img
                                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${slide.author}`}
                                                alt={slide.author}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        <div className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-white uppercase tracking-wider">
                                            <span>By {slide.author}</span>
                                            <span className="w-1 h-1 rounded-full bg-white/50" />
                                            <span>{slide.time}</span>
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>
                        )
                    ))}
                </AnimatePresence>

                {/* Navigation Dots */}
                <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-2">
                    {HERO_SLIDES.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentSlide(idx)}
                            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${idx === currentSlide ? "bg-white w-4" : "bg-white/40 hover:bg-white/60"}`}
                        />
                    ))}
                </div>
            </motion.div>
        </section>
    )
}

function EditorialValues() {
    return (
        <section className="max-w-[1400px] mx-auto px-4 md:px-8 py-2 grid grid-cols-2 md:grid-cols-4 gap-2">
            {["Handwoven Authenticity", "Pure Silk Mark", "Certified Craft", "Artisan Direct"].map((val) => (
                <div key={val} className="flex items-center justify-center gap-2 py-2 text-[10px] font-bold uppercase tracking-widest text-[#5a2d2d] hover:text-[#800000] transition-colors cursor-default border-b border-transparent hover:border-[#800000]/20">
                    <span className="text-[#b21e29]">✦</span>
                    {val}
                </div>
            ))}
        </section>
    )
}

function SectionHeader({ title }: { title: string }) {
    return (
        <div className="flex flex-col items-center mb-5 text-center">
            <span className="text-[#b21e29] text-[10px] font-bold uppercase tracking-[0.3em] mb-2">Discover</span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#800000] mb-2 italic" style={{ fontFamily: "var(--font-heading)" }}>{title}</h2>
            <div className="w-24 h-0.5 bg-[#800000] mt-2 rounded-full" />
        </div>
    )
}

function FeaturedProductCard({ product, index }: { product: Product; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="group relative w-full bg-white rounded-[2rem] overflow-hidden mb-8 shadow-2xl border border-[#d4a89a]/30"
        >
            <Link href={`/product/${product.id}`} className="block h-full">
                <div className="flex flex-col md:flex-row h-full min-h-[400px]">
                    {/* Image Section - 60% width on desktop */}
                    <div className="relative w-full md:w-[60%] h-[300px] md:h-auto overflow-hidden">
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                            style={{ backgroundImage: `url(${product.image})` }}
                        />
                        {/* Gradient Overlay for text readability on mobile if needed, or style transition */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent md:hidden" />
                    </div>

                    {/* Content Section - 40% width on desktop */}
                    <div className="relative w-full md:w-[40%] p-6 md:p-8 lg:p-12 flex flex-col justify-center bg-white/95 border-l border-[#d4a89a]/20">
                        {/* Decorative background element */}
                        <SpinningMandala className="absolute top-[-50px] right-[-50px] w-40 h-40 text-[#b21e29] opacity-10 pointer-events-none" />

                        {/* Tag */}
                        <div className="mb-6">
                            <span className="inline-block px-3 py-1 rounded-full bg-[#800000] border border-[#800000] text-white text-[10px] font-bold uppercase tracking-widest">
                                {product.category || "Heritage"}
                            </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#3d1a1a] leading-[1.1] mb-4 italic group-hover:text-[#b21e29] transition-colors" style={{ fontFamily: "var(--font-heading)" }}>
                            {product.name}
                        </h3>

                        {/* Description/Price */}
                        <div className="mb-8">
                            <p className="text-[#5a2d2d] text-sm md:text-base leading-relaxed mb-4 line-clamp-2">
                                A masterpiece of {product.brand}, woven with precision and care.
                                Featuring {product.colors.join(", ")} hues perfect for the season.
                            </p>
                            <div className="flex items-baseline gap-3">
                                <span className="text-2xl font-bold text-[#b21e29]">₹{product.price.toLocaleString("en-IN")}</span>
                                {product.originalPrice > product.price && (
                                    <span className="text-sm text-[#8B4513] line-through">₹{product.originalPrice.toLocaleString("en-IN")}</span>
                                )}
                            </div>
                        </div>

                        {/* Footer / Author-like line */}
                        <div className="flex items-center gap-3 mt-auto pt-6 border-t border-[#d4a89a]/20">
                            <div className="w-8 h-8 rounded-full bg-[#800000] flex items-center justify-center text-white font-bold text-xs">
                                P
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[#3d1a1a] text-xs font-bold uppercase tracking-wider">By {product.brand}</span>
                                <span className="text-[#8B4513] text-[10px]">Handcrafted Collection</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

function ProductGrid({ products, title }: { products: Product[], title: string }) {
    if (products.length === 0) return (
        <section className="max-w-[1400px] mx-auto px-4 md:px-8 py-8 text-center text-gray-400 font-bold">
            No products found in this category.
        </section>
    );

    return (
        <section className="max-w-[1400px] mx-auto px-4 md:px-8 py-6 relative">
            <SectionHeader title={title} />
            <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8"
            >
                <AnimatePresence mode="popLayout">
                    {products.map((p) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                            key={p.id}
                        >
                            <Link href={`/product/${p.id}`} className="group flex flex-col gap-3">
                                <motion.div
                                    whileHover={{ y: -8, scale: 1.02 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    className="aspect-[3/4] rounded-t-[40px] overflow-hidden relative bg-[#f5e6e0] border border-[#d4a89a]/30 shadow-sm group-hover:shadow-2xl group-hover:shadow-[#b21e29]/10 group-hover:border-[#b21e29]/50"
                                >
                                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                        style={{ backgroundImage: `url(${p.image})` }} />
                                    {p.tag && (
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#800000] px-2 py-0.5 rounded-b-md shadow-sm">
                                            <span className="text-white text-[8px] font-bold uppercase tracking-wider block text-center min-w-[60px]">
                                                {p.tag}
                                            </span>
                                        </div>
                                    )}
                                </motion.div>
                                <div className="flex flex-col items-center text-center gap-0.5 px-2">
                                    <span className="text-[#800000] text-[9px] font-bold uppercase tracking-widest">{p.brand}</span>
                                    <h3 className="text-lg font-medium leading-tight text-[#3d1a1a] group-hover:text-[#b21e29] transition-colors" style={{ fontFamily: "var(--font-heading)" }}>
                                        {p.name}
                                    </h3>
                                    <p className="text-[#b21e29] text-sm mt-0.5 font-bold">₹{p.price.toLocaleString("en-IN")}</p>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>
        </section>
    );
}

function VideoSection() {
    return (
        <section className="bg-[#800000] text-white py-12 px-4 md:px-8 mt-6 border-y-2 border-[#b21e29] relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute top-[-100px] right-[-100px] opacity-5 pointer-events-none">
                <SpinningMandala className="w-[500px] h-[500px] animate-[spin_60s_linear_infinite]" />
            </div>

            <div className="max-w-[1400px] mx-auto relative z-10">
                <div className="flex flex-col items-center text-center mb-10">
                    <motion.div
                        whileHover={{ rotate: 180 }}
                        transition={{ duration: 1 }}
                        className="w-12 h-12 border border-[#d4af37] rounded-full flex items-center justify-center mb-3"
                    >
                        <span className="text-2xl">⚜️</span>
                    </motion.div>
                    <span className="text-[#f4e4bc] text-[10px] font-bold uppercase tracking-[0.3em] mb-1">The Legacy</span>
                    <h2 className="text-4xl md:text-5xl font-bold italic text-white" style={{ fontFamily: "var(--font-heading)" }}>Art of the Loom</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { title: "The Golden Weave", time: "Doc", img: "/frames/ezgif-frame-005.jpg", desc: "Witness the intricate process of gold thread weaving." },
                        { title: "Varanasi Ghats", time: "Series", img: "/frames/ezgif-frame-015.jpg", desc: "Exploring the gullies where masterpieces are born." },
                        { title: "Draping Royalty", time: "Guide", img: "/frames/ezgif-frame-025.jpg", desc: "Learn the traditional drape for your special day." },
                    ].map((v, i) => (
                        <motion.div
                            key={i}
                            className="group cursor-pointer"
                            whileHover={{ y: -10 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                            <div className="aspect-[4/5] bg-[#5a1015] rounded-t-[60px] border border-white/20 overflow-hidden relative mb-4 shadow-lg group-hover:border-white/50 transition-colors">
                                <motion.div
                                    className="absolute inset-0 bg-cover bg-center opacity-70 group-hover:opacity-100 transition-opacity duration-500"
                                    style={{ backgroundImage: `url(${v.img})` }}
                                    whileHover={{ scale: 1.1 }}
                                    transition={{ duration: 0.5 }}
                                />
                                <div className="absolute inset-0 flex items-center justify-center scale-90 group-hover:scale-100 transition-transform">
                                    <PlayIcon />
                                </div>
                            </div>
                            <div className="text-center">
                                <h3 className="text-xl font-bold leading-tight group-hover:text-[#f4e4bc] transition-colors mb-1 italic" style={{ fontFamily: "var(--font-heading)" }}>
                                    {v.title}
                                </h3>
                                <p className="text-xs text-white/70 leading-snug">{v.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function PromoBlocks() {
    return (
        <section className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Newsletter Block (Gold/Green) */}
                <motion.div
                    whileHover={{ scale: 1.01 }}
                    className="bg-[#800000] p-8 rounded-[1.5rem] flex flex-col items-center text-center relative overflow-hidden shadow-lg border border-[#b21e29]/30"
                >
                    <SpinningMandala className="absolute bottom-[-50px] left-[-50px] w-48 h-48 text-[#d4af37] opacity-20" />
                    <h3 className="text-3xl font-bold text-white mb-2 leading-none tracking-wide italic" style={{ fontFamily: "var(--font-heading)" }}>
                        The Royal Scroll
                    </h3>
                    <p className="text-white/80 text-sm font-medium mb-6 max-w-sm">
                        Join our circle of connoisseurs. Receive weekly articles on textile heritage and exclusive invites.
                    </p>
                    <div className="w-full max-w-md bg-[#5a1015] border border-white/20 rounded-full p-1 flex shadow-md relative z-10">
                        <input
                            type="email"
                            placeholder="Your email address"
                            className="flex-1 px-4 py-2 rounded-l-full outline-none bg-transparent text-[#fdfbf7] placeholder-[#e5c1a7] text-sm"
                        />
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-white text-[#800000] px-6 py-2 rounded-full font-bold hover:bg-[#f5e6e0] transition-colors uppercase tracking-wider text-[10px]"
                        >
                            Subscribe
                        </motion.button>
                    </div>
                </motion.div>

                {/* Archive Block (Cream/Gold) */}
                <motion.div
                    whileHover={{ scale: 1.01 }}
                    className="bg-white border border-[#d4a89a] p-8 rounded-[1.5rem] flex flex-col items-center text-center relative overflow-hidden shadow-sm"
                >
                    <CornerPaisley position="top-right" className="opacity-20 top-4 right-4" />
                    <CornerPaisley position="bottom-left" className="opacity-20 bottom-4 left-4" />

                    <h3 className="text-3xl font-bold text-[#800000] mb-2 leading-none tracking-wide italic" style={{ fontFamily: "var(--font-heading)" }}>
                        Museum Archive
                    </h3>
                    <p className="text-[#5a2d2d] text-sm font-medium mb-6 max-w-sm">
                        Since 1847, preserving over 5,000 unique patterns. Explore the digital museum of Indian weaves.
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.05, backgroundColor: "#800000", color: "#ffffff" }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-3 rounded-full border border-[#800000] text-[#800000] font-bold uppercase tracking-[0.2em] text-[10px] transition-colors relative z-10"
                    >
                        Explore
                    </motion.button>
                </motion.div>
            </div>
        </section>
    )
}

export default function PostSequence() {
    const searchParams = useSearchParams();
    const activeCategory = searchParams.get("category") || "The Latest";

    const filteredProducts = PRODUCTS.filter((p) => {
        if (activeCategory === "All" || activeCategory === "The Latest") return true;

        // Exact match on category (e.g. "Banarasi" === "Banarasi")
        if (p.category === activeCategory) return true;

        // Fallback fuzzy match for older data or flexible tags
        if (p.name.toLowerCase().includes(activeCategory.toLowerCase())) return true;

        return false;
    });

    return (
        <div className="min-h-screen pt-28 text-[#3d1a1a] font-sans relative overflow-x-hidden selection:bg-[#b21e29] selection:text-white">
            {/* GLOBAL DECORATIONS */}
            <CornerPaisley position="top-left" className="top-32 left-0 opacity-30 hidden 2xl:block scale-150" />
            <CornerPaisley position="top-right" className="top-32 right-0 opacity-30 hidden 2xl:block scale-150" />



            <main>
                {/* Editorial Hero Slider */}
                <HeroSlider />

                {/* Value Props */}
                <EditorialValues />

                {/* Background Decoration */}
                <div className="relative">
                    <SpinningMandala className="absolute top-0 right-[-100px] w-80 h-80 text-[#b21e29] opacity-5 pointer-events-none" />
                </div>

                {/* Main Feed */}
                {activeCategory === "The Latest" ? (
                    <section className="max-w-[1400px] mx-auto px-4 md:px-8 py-6 relative">
                        <SectionHeader title="Current Collection" />
                        <div className="flex flex-col">
                            {filteredProducts.slice(0, 5).map((p, i) => (
                                <FeaturedProductCard key={p.id} product={p} index={i} />
                            ))}
                        </div>
                    </section>
                ) : (
                    <ProductGrid products={filteredProducts} title={activeCategory} />
                )}

                <div className="relative">
                    <SpinningMandala className="absolute bottom-0 left-[-100px] w-96 h-96 text-[#b21e29] opacity-5 pointer-events-none" reverse />
                </div>
                <VideoSection />

                {/* Don't show Must Have if we are filtering specific categories, to keep it clean */}
                {activeCategory === "The Latest" && (
                    <>
                        <PatternDivider />
                        <ProductGrid products={PRODUCTS.slice(4, 8)} title="Timeless Classics" />
                    </>
                )}

                <PromoBlocks />
            </main>

            {/* Footer */}
            <footer className="border-t border-[#d4a89a]/30 bg-white/90 pt-16 pb-8 px-4 md:px-8 relative mt-12">
                <FloralBorder className="absolute top-0 left-0 w-full opacity-20 text-[#b21e29]" />

                <div className="max-w-[1400px] mx-auto text-center">
                    <div className="flex flex-col items-center justify-center gap-4 mb-8">
                        <span className="text-4xl font-bold tracking-tight uppercase italic text-[#800000]" style={{ fontFamily: "var(--font-heading)" }}>PARINEY</span>
                        <span className="text-xs font-bold tracking-[0.4em] text-[#b21e29]">SINCE 1847</span>
                    </div>
                    <div className="flex flex-wrap justify-center gap-8 mb-8 text-xs font-bold text-[#5a2d2d] uppercase tracking-[0.2em]">
                        <Link href="#" className="hover:text-[#b21e29]">Heritage</Link>
                        <Link href="#" className="hover:text-[#b21e29]">Artisans</Link>
                        <Link href="#" className="hover:text-[#b21e29]">Sustainability</Link>
                        <Link href="#" className="hover:text-[#b21e29]">Store Locator</Link>
                        <Link href="#" className="hover:text-[#b21e29]">Contact</Link>
                    </div>
                    <p className="text-[#8B4513] text-[10px] font-medium uppercase tracking-widest">© 2026 Pariney Saree. Handcrafted in Varanasi, India.</p>
                </div>
            </footer>
        </div>
    );
}


