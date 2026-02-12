"use client";

import { useRef, useState, useEffect } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import FrameCanvas from "./FrameCanvas";
import HUD from "./HUD";
import ReducedMotionFallback from "./ReducedMotionFallback";

const TOTAL_FRAMES = 144;

export default function ScrollSequence() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [currentFrame, setCurrentFrame] = useState(0);
    const [progress, setProgress] = useState(0);
    const [reducedMotion, setReducedMotion] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Defer reduced-motion check to client to avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
        const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
        setReducedMotion(mql.matches);
        const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
        mql.addEventListener("change", handler);
        return () => mql.removeEventListener("change", handler);
    }, []);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        const frameIndex = Math.min(TOTAL_FRAMES - 1, Math.floor(latest * TOTAL_FRAMES));
        setCurrentFrame(frameIndex);
        setProgress(latest);
    });

    if (mounted && reducedMotion) {
        return <ReducedMotionFallback />;
    }

    return (
        <section
            ref={containerRef}
            className="relative"
            style={{ height: "600vh" }}
            aria-label="Pariney Saree cinematic showcase - scroll to explore"
        >
            <div className="sticky top-0 h-screen w-full overflow-hidden">
                <FrameCanvas currentFrame={currentFrame} />
                <HUD progress={progress} />

                {/* Scroll hint - visible at start */}
                {progress < 0.05 && (
                    <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3 animate-pulse">
                        <p
                            className="text-pariney-gold/60 text-xs tracking-[0.3em] uppercase"
                            style={{ fontFamily: "var(--font-serif)" }}
                        >
                            Scroll to explore
                        </p>
                        <div className="w-px h-8 bg-gradient-to-b from-pariney-gold/60 to-transparent" />
                    </div>
                )}
            </div>

            {/* Corner decorations (fixed) */}
            <div className="fixed top-6 left-6 w-8 h-8 border-l border-t border-pariney-gold/15 z-40 pointer-events-none" />
            <div className="fixed top-6 right-6 w-8 h-8 border-r border-t border-pariney-gold/15 z-40 pointer-events-none" />
            <div className="fixed bottom-6 left-6 w-8 h-8 border-l border-b border-pariney-gold/15 z-40 pointer-events-none" />
            <div className="fixed bottom-6 right-6 w-8 h-8 border-r border-b border-pariney-gold/15 z-40 pointer-events-none" />
        </section>
    );
}
