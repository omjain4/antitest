"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useMemo } from "react";

interface HUDProps {
    progress: number; // 0 to 1
}

interface HUDSegment {
    id: string;
    text: string;
    subtext?: string;
    position: string;
    start: number;
    end: number;
}

const HUD_SEGMENTS: HUDSegment[] = [
    {
        id: "brand",
        text: "PARINEY",
        subtext: "Est. Since Generations",
        position: "items-center justify-center",
        start: 0,
        end: 0.10,
    },
    {
        id: "heritage",
        text: "Handwoven Heritage",
        position: "items-start justify-start pt-24 pl-12",
        start: 0.10,
        end: 0.25,
    },
    {
        id: "thread",
        text: "Thread by Thread",
        position: "items-end justify-end pb-32 pr-12",
        start: 0.25,
        end: 0.45,
    },
    {
        id: "drape",
        text: "Every Drape Tells",
        position: "items-start justify-end pt-24 pr-12",
        start: 0.45,
        end: 0.65,
    },
    {
        id: "story",
        text: "A Story",
        position: "items-end justify-start pb-32 pl-12",
        start: 0.65,
        end: 0.85,
    },
    {
        id: "cta",
        text: "Explore Collection",
        subtext: "Scroll to discover →",
        position: "items-center justify-center",
        start: 0.85,
        end: 1.01,
    },
];

export default function HUD({ progress }: HUDProps) {
    const activeSegment = useMemo(() => {
        return HUD_SEGMENTS.find((s) => progress >= s.start && progress < s.end) || null;
    }, [progress]);

    return (
        <div className="absolute inset-0 z-10 pointer-events-none flex flex-col">
            {/* HUD Content */}
            <div className="flex-1 relative">
                <AnimatePresence mode="wait">
                    {activeSegment && (
                        <motion.div
                            key={activeSegment.id}
                            className={`absolute inset-0 flex ${activeSegment.position}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <div
                                className={`${activeSegment.id === "brand" || activeSegment.id === "cta"
                                        ? "text-center"
                                        : ""
                                    }`}
                            >
                                {activeSegment.id === "brand" ? (
                                    <div className="flex flex-col items-center gap-4">
                                        <motion.div
                                            className="w-16 h-px bg-pariney-gold/40"
                                            initial={{ scaleX: 0 }}
                                            animate={{ scaleX: 1 }}
                                            transition={{ delay: 0.3, duration: 0.8 }}
                                        />
                                        <h1
                                            className="text-shimmer text-6xl md:text-8xl tracking-[0.3em] font-light"
                                            style={{ fontFamily: "var(--font-serif)" }}
                                        >
                                            {activeSegment.text}
                                        </h1>
                                        {activeSegment.subtext && (
                                            <motion.p
                                                className="text-pariney-gold/70 text-sm md:text-base tracking-[0.25em] uppercase"
                                                style={{ fontFamily: "var(--font-serif)" }}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.5, duration: 0.6 }}
                                            >
                                                {activeSegment.subtext}
                                            </motion.p>
                                        )}
                                        <motion.div
                                            className="w-16 h-px bg-pariney-gold/40"
                                            initial={{ scaleX: 0 }}
                                            animate={{ scaleX: 1 }}
                                            transition={{ delay: 0.3, duration: 0.8 }}
                                        />
                                    </div>
                                ) : activeSegment.id === "cta" ? (
                                    <div className="flex flex-col items-center gap-6">
                                        <h2
                                            className="text-shimmer text-4xl md:text-6xl tracking-[0.2em] font-light"
                                            style={{ fontFamily: "var(--font-serif)" }}
                                        >
                                            {activeSegment.text}
                                        </h2>
                                        {activeSegment.subtext && (
                                            <motion.p
                                                className="text-pariney-gold/50 text-xs tracking-[0.3em] uppercase"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.4 }}
                                            >
                                                {activeSegment.subtext}
                                            </motion.p>
                                        )}
                                    </div>
                                ) : (
                                    <div className="hud-glass px-6 py-4 md:px-8 md:py-5 rounded-sm">
                                        <p
                                            className="text-pariney-gold text-2xl md:text-4xl tracking-[0.15em] font-light italic"
                                            style={{ fontFamily: "var(--font-serif)" }}
                                        >
                                            {activeSegment.text}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Progress bar */}
            <div className="h-[2px] w-full bg-white/5 relative">
                <motion.div
                    className="h-full bg-pariney-gold progress-glow origin-left"
                    style={{ scaleX: progress }}
                />
            </div>

            {/* Corner decorations */}
            <div className="absolute top-6 left-6 w-8 h-8 border-l border-t border-pariney-gold/20" />
            <div className="absolute top-6 right-6 w-8 h-8 border-r border-t border-pariney-gold/20" />
            <div className="absolute bottom-8 left-6 w-8 h-8 border-l border-b border-pariney-gold/20" />
            <div className="absolute bottom-8 right-6 w-8 h-8 border-r border-b border-pariney-gold/20" />

            {/* Frame counter */}
            <div className="absolute bottom-4 right-6 text-pariney-gold/30 text-[10px] tracking-[0.2em] font-mono">
                {String(Math.floor(progress * 144) + 1).padStart(3, "0")} / 144
            </div>
        </div>
    );
}
