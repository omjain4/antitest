"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import FrameCanvas from "./FrameCanvas";
import HUD from "./HUD";

const TOTAL_FRAMES = 144;

export default function ReducedMotionFallback() {
    const [currentFrame, setCurrentFrame] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const progress = currentFrame / (TOTAL_FRAMES - 1);

    const play = useCallback(() => {
        setIsPlaying(true);
        intervalRef.current = setInterval(() => {
            setCurrentFrame((prev) => {
                if (prev >= TOTAL_FRAMES - 1) {
                    setIsPlaying(false);
                    if (intervalRef.current) clearInterval(intervalRef.current);
                    return TOTAL_FRAMES - 1;
                }
                return prev + 1;
            });
        }, 1000 / 24); // 24fps
    }, []);

    const pause = useCallback(() => {
        setIsPlaying(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
    }, []);

    const stepForward = useCallback(() => {
        setCurrentFrame((prev) => Math.min(TOTAL_FRAMES - 1, prev + 1));
    }, []);

    const stepBackward = useCallback(() => {
        setCurrentFrame((prev) => Math.max(0, prev - 1));
    }, []);

    const reset = useCallback(() => {
        pause();
        setCurrentFrame(0);
    }, [pause]);

    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    // Keyboard controls
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") stepForward();
            else if (e.key === "ArrowLeft") stepBackward();
            else if (e.key === " ") {
                e.preventDefault();
                isPlaying ? pause() : play();
            }
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [isPlaying, play, pause, stepForward, stepBackward]);

    return (
        <section className="relative h-screen w-full" aria-label="Pariney Saree showcase - reduced motion mode">
            <FrameCanvas currentFrame={currentFrame} />
            <HUD progress={progress} />

            {/* Controls overlay */}
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
                <div className="hud-glass rounded-full px-6 py-3 flex items-center gap-4">
                    <button
                        onClick={stepBackward}
                        disabled={currentFrame === 0}
                        className="text-pariney-gold hover:text-pariney-gold-light disabled:text-pariney-gold/20 transition-colors text-lg"
                        aria-label="Previous frame"
                    >
                        ←
                    </button>

                    <button
                        onClick={isPlaying ? pause : play}
                        className="w-10 h-10 rounded-full border border-pariney-gold/40 flex items-center justify-center text-pariney-gold hover:bg-pariney-gold/10 transition-all"
                        aria-label={isPlaying ? "Pause" : "Play"}
                    >
                        {isPlaying ? (
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                                <rect x="1" y="1" width="4" height="12" rx="1" />
                                <rect x="9" y="1" width="4" height="12" rx="1" />
                            </svg>
                        ) : (
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                                <polygon points="2,0 14,7 2,14" />
                            </svg>
                        )}
                    </button>

                    <button
                        onClick={stepForward}
                        disabled={currentFrame === TOTAL_FRAMES - 1}
                        className="text-pariney-gold hover:text-pariney-gold-light disabled:text-pariney-gold/20 transition-colors text-lg"
                        aria-label="Next frame"
                    >
                        →
                    </button>

                    <div className="w-px h-6 bg-pariney-gold/20" />

                    <button
                        onClick={reset}
                        className="text-pariney-gold/60 hover:text-pariney-gold text-xs tracking-[0.15em] uppercase transition-colors"
                        aria-label="Reset to start"
                    >
                        Reset
                    </button>
                </div>

                {/* Scrub bar */}
                <div className="mt-3 w-full px-2">
                    <input
                        type="range"
                        min={0}
                        max={TOTAL_FRAMES - 1}
                        value={currentFrame}
                        onChange={(e) => setCurrentFrame(Number(e.target.value))}
                        className="w-full h-1 appearance-none bg-pariney-gold/20 rounded-full cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-pariney-gold"
                        aria-label="Scrub through frames"
                    />
                </div>
            </div>

            {/* Accessibility note */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30">
                <p className="text-pariney-gold/40 text-[10px] tracking-[0.2em] uppercase">
                    Reduced Motion · Use arrows or play button
                </p>
            </div>
        </section>
    );
}
