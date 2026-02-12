"use client";

import { type MotionValue, motion, useTransform } from "framer-motion";
import { HUD_PHASES, TOTAL_FRAMES } from "@/data/transformerData";

interface TransformerExperienceProps {
    scrollYProgress: MotionValue<number>;
}

export default function TransformerExperience({ scrollYProgress }: TransformerExperienceProps) {
    const frameIndex = useTransform(scrollYProgress, [0, 1], [1, TOTAL_FRAMES]);
    // Top blur fades in as user scrolls
    const blurOpacity = useTransform(scrollYProgress, [0, 0.08, 0.9, 1.0], [0, 1, 1, 0]);

    return (
        <div className="absolute inset-0 z-10 pointer-events-none flex flex-col">
            {/* ★ Top blur gradient — fades in on scroll */}
            <motion.div
                className="absolute top-0 left-0 right-0 h-40 z-30"
                style={{
                    opacity: blurOpacity,
                    background:
                        "linear-gradient(to bottom, rgba(14,10,6,0.85) 0%, rgba(14,10,6,0.5) 40%, transparent 100%)",
                    backdropFilter: "blur(6px)",
                    WebkitBackdropFilter: "blur(6px)",
                }}
            />

            {/* Phase 1: Hero — brand rises from below */}
            <HeroPhase scrollYProgress={scrollYProgress} />

            {/* Phase 2: Craft */}
            <CraftPhase scrollYProgress={scrollYProgress} />

            {/* Phase 3: Arrival */}
            <ArrivalPhase scrollYProgress={scrollYProgress} />

            {/* Progress bar at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5">
                <motion.div
                    className="h-full bg-gold progress-glow origin-left"
                    style={{ scaleX: scrollYProgress }}
                />
            </div>

            <FrameCounter frameIndex={frameIndex} />

            {/* Corner decorations */}
            <div className="absolute top-6 left-6 w-6 h-6 border-l border-t border-gold/15" />
            <div className="absolute top-6 right-6 w-6 h-6 border-r border-t border-gold/15" />
            <div className="absolute bottom-8 left-6 w-6 h-6 border-l border-b border-gold/15" />
            <div className="absolute bottom-8 right-6 w-6 h-6 border-r border-b border-gold/15" />
        </div>
    );
}

/* ─── Hero Phase: 0%–30% — "PARINEY" rises from below ──── */
function HeroPhase({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
    const phase = HUD_PHASES[0];
    const opacity = useTransform(
        scrollYProgress,
        [phase.start, phase.start + 0.04, phase.end - 0.04, phase.end],
        [0, 1, 1, 0]
    );
    // Brand name: starts 80px below, rises to center
    const brandY = useTransform(scrollYProgress, [0, 0.08], [80, 0]);
    const brandOpacity = useTransform(scrollYProgress, [0, 0.06], [0, 1]);
    const subY = useTransform(scrollYProgress, [0.04, 0.12], [40, 0]);
    const subOpacity = useTransform(scrollYProgress, [0.04, 0.12], [0, 1]);
    const tagOpacity = useTransform(scrollYProgress, [0.08, 0.16], [0, 0.7]);

    return (
        <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-8"
            style={{ opacity }}
        >
            {/* Decorative line */}
            <motion.div
                className="w-20 h-[1px] accent-line mb-8"
                style={{ scaleX: useTransform(scrollYProgress, [0, 0.06], [0, 1]) }}
            />

            {/* ★ Brand name — rises from below, BOLD */}
            <motion.h1
                className="text-shimmer-gold text-6xl md:text-8xl lg:text-[10rem] tracking-[0.2em] font-bold leading-none mb-4"
                style={{
                    fontFamily: "var(--font-heading)",
                    y: brandY,
                    opacity: brandOpacity,
                }}
            >
                PARINEY
            </motion.h1>

            {/* Subtitle — follows brand up */}
            <motion.p
                className="text-text-muted text-lg md:text-xl tracking-[0.2em] italic mb-3"
                style={{
                    fontFamily: "var(--font-heading)",
                    y: subY,
                    opacity: subOpacity,
                }}
            >
                {phase.lines[1].text}
            </motion.p>

            {/* Tagline */}
            <motion.p
                className="text-text-dim text-xs md:text-sm tracking-[0.15em] font-light"
                style={{
                    fontFamily: "var(--font-body)",
                    opacity: tagOpacity,
                }}
            >
                {phase.lines[2].text}
            </motion.p>

            <motion.div
                className="w-20 h-[1px] accent-line mt-8"
                style={{ scaleX: useTransform(scrollYProgress, [0.06, 0.12], [0, 1]) }}
            />
        </motion.div>
    );
}

/* ─── Craft Phase: 30%–75% ───────────────── */
function CraftPhase({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
    const phase = HUD_PHASES[1];
    const opacity = useTransform(
        scrollYProgress,
        [phase.start, phase.start + 0.04, phase.end - 0.04, phase.end],
        [0, 1, 1, 0]
    );

    const lineOp1 = useTransform(scrollYProgress, [0.32, 0.38, 0.48, 0.50], [0, 0.8, 0.8, 0]);
    const lineOp2 = useTransform(scrollYProgress, [0.42, 0.48, 0.58, 0.60], [0, 0.7, 0.7, 0]);
    const lineOp3 = useTransform(scrollYProgress, [0.55, 0.60, 0.70, 0.73], [0, 0.9, 0.9, 0]);

    return (
        <motion.div
            className="absolute top-0 right-0 h-full flex flex-col justify-center pr-8 md:pr-16 lg:pr-24 items-end max-w-md"
            style={{ opacity }}
        >
            <motion.div className="hud-glass px-5 py-3 rounded-sm mb-4" style={{ opacity: lineOp1 }}>
                <p className="text-gold text-xs tracking-[0.2em] uppercase italic"
                    style={{ fontFamily: "var(--font-heading)" }}>
                    {phase.lines[0].text}
                </p>
            </motion.div>

            <motion.div className="hud-glass px-5 py-3 rounded-sm mb-4" style={{ opacity: lineOp2 }}>
                <p className="text-text-muted text-[11px] tracking-[0.15em]"
                    style={{ fontFamily: "var(--font-body)" }}>
                    {phase.lines[1].text}
                </p>
            </motion.div>

            <motion.div className="text-right" style={{ opacity: lineOp3 }}>
                <p className="text-ivory text-xl md:text-2xl tracking-[0.08em] font-light italic"
                    style={{ fontFamily: "var(--font-heading)" }}>
                    {phase.lines[2].text}
                </p>
                <div className="w-10 h-[1px] accent-line ml-auto mt-3" />
            </motion.div>
        </motion.div>
    );
}

/* ─── Arrival Phase: 75%–100% ────────────── */
function ArrivalPhase({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
    const phase = HUD_PHASES[2];
    const opacity = useTransform(
        scrollYProgress,
        [phase.start, phase.start + 0.04, 0.96, 1.0],
        [0, 1, 1, 1]
    );
    const y = useTransform(scrollYProgress, [phase.start, phase.start + 0.1], [25, 0]);

    return (
        <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-8"
            style={{ opacity, y }}
        >
            <motion.h2
                className="text-ivory text-3xl md:text-5xl lg:text-6xl tracking-[0.12em] font-light mb-4 italic leading-tight"
                style={{
                    fontFamily: "var(--font-heading)",
                    opacity: useTransform(scrollYProgress, [0.77, 0.83], [0, 1]),
                }}
            >
                {phase.lines[0].text}
            </motion.h2>

            <motion.p
                className="text-gold text-sm md:text-base tracking-[0.25em] mb-8"
                style={{
                    fontFamily: "var(--font-heading)",
                    opacity: useTransform(scrollYProgress, [0.83, 0.89], [0, 1]),
                }}
            >
                {phase.lines[1].text}
            </motion.p>

            <motion.p
                className="text-accent-crimson text-[11px] tracking-[0.2em] uppercase text-glow"
                style={{
                    fontFamily: "var(--font-body)",
                    opacity: useTransform(scrollYProgress, [0.90, 0.96], [0, 1]),
                }}
            >
                {phase.lines[2].text}
            </motion.p>
        </motion.div>
    );
}

/* ─── Frame Counter ──────────────────────── */
function FrameCounter({ frameIndex }: { frameIndex: MotionValue<number> }) {
    const displayFrame = useTransform(frameIndex, (v) =>
        String(Math.round(v)).padStart(3, "0")
    );

    return (
        <motion.div className="absolute bottom-4 right-6">
            <motion.span className="text-text-dim text-[9px] tracking-[0.15em]" style={{ fontFamily: "var(--font-body)" }}>
                <motion.span>{displayFrame}</motion.span>
                <span className="text-text-dim/40"> / {TOTAL_FRAMES}</span>
            </motion.span>
        </motion.div>
    );
}
