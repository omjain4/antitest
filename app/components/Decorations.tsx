"use client";

import React, { useState, useEffect } from "react";

/* 
  TRADITIONAL INDIAN DECORATIONS
  ------------------------------
  Reusable SVG components with Tailwind animations.
*/

export const CornerPaisley = ({ className, position = "top-left", color = "text-[#b21e29]" }: { className?: string; position?: "top-left" | "top-right" | "bottom-left" | "bottom-right"; color?: string }) => {
    const rotation = {
        "top-left": "rotate(0)",
        "top-right": "scaleX(-1)",
        "bottom-left": "scaleY(-1)",
        "bottom-right": "rotate(180)"
    };

    return (
        <div className={`absolute pointer-events-none z-0 ${className} ${color}`} style={{ transform: rotation[position] }}>
            <svg width="150" height="150" viewBox="0 0 100 100" fill="none" className="opacity-10 w-24 h-24 md:w-40 md:h-40">
                <path
                    d="M0 0 L40 0 C60 0 80 20 80 50 C80 80 50 80 40 60 C30 40 50 30 60 40"
                    stroke="currentColor"
                    strokeWidth="1"
                    fill="none"
                    className="animate-[pulse_4s_ease-in-out_infinite]"
                />
                <path d="M0 5 L35 5 C55 5 70 20 70 50 C70 70 50 70 45 60" stroke="currentColor" strokeWidth="0.5" />
                <circle cx="60" cy="40" r="2" fill="currentColor" />
                <path d="M10 10 Q 30 30 10 50" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
            </svg>
        </div>
    );
};

export const SpinningMandala = ({ className, color = "text-[#b21e29]", reverse = false }: { className?: string; color?: string; reverse?: boolean }) => (
    <svg width="100" height="100" viewBox="0 0 100 100" fill="none" className={`pointer-events-none opacity-20 ${color} ${className}`}>
        {/* Outer Ring */}
        <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 2" className={reverse ? "animate-[spin_30s_linear_infinite_reverse]" : "animate-[spin_30s_linear_infinite]"} />

        {/* Inner Floral Pattern */}
        <g className={`origin-center ${reverse ? "animate-[spin_20s_linear_infinite]" : "animate-[spin_20s_linear_infinite_reverse]"}`}>
            <path d="M50 10 Q 60 40 50 50 Q 40 40 50 10" stroke="currentColor" strokeWidth="0.5" />
            <path d="M50 10 Q 60 40 50 50 Q 40 40 50 10" stroke="currentColor" strokeWidth="0.5" transform="rotate(45 50 50)" />
            <path d="M50 10 Q 60 40 50 50 Q 40 40 50 10" stroke="currentColor" strokeWidth="0.5" transform="rotate(90 50 50)" />
            <path d="M50 10 Q 60 40 50 50 Q 40 40 50 10" stroke="currentColor" strokeWidth="0.5" transform="rotate(135 50 50)" />
            <path d="M50 10 Q 60 40 50 50 Q 40 40 50 10" stroke="currentColor" strokeWidth="0.5" transform="rotate(180 50 50)" />
            <path d="M50 10 Q 60 40 50 50 Q 40 40 50 10" stroke="currentColor" strokeWidth="0.5" transform="rotate(225 50 50)" />
            <path d="M50 10 Q 60 40 50 50 Q 40 40 50 10" stroke="currentColor" strokeWidth="0.5" transform="rotate(270 50 50)" />
            <path d="M50 10 Q 60 40 50 50 Q 40 40 50 10" stroke="currentColor" strokeWidth="0.5" transform="rotate(315 50 50)" />
        </g>

        {/* Center Dot */}
        <circle cx="50" cy="50" r="5" fill="currentColor" className="animate-pulse" />
    </svg>
);

export const PatternDivider = ({ className }: { className?: string }) => (
    <div className={`flex items-center justify-center gap-4 py-8 opacity-40 text-[#d4af37] ${className}`}>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L14.5 9H22L16 13.5L18.5 21L12 16.5L5.5 21L8 13.5L2 9H9.5L12 2Z" />
        </svg>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
    </div>
);

export const HangingBell = ({ className, delay = "0s" }: { className?: string; delay?: string }) => (
    <div className={`absolute top-0 pointer-events-none z-10 flex flex-col items-center ${className}`} style={{ animationDelay: delay }}>
        {/* String */}
        <div className="w-[1px] h-12 bg-[#b21e29]/30" />
        {/* Bell Body */}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#d4af37] drop-shadow-sm origin-top animate-[swing_3s_ease-in-out_infinite]" style={{ animationDelay: delay }}>
            <path d="M12 2C8 2 6 6 6 10C6 14 4 16 3 17H21C20 16 18 14 18 10C18 6 16 2 12 2Z" fill="#f4e4bc" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="12" cy="19" r="2" fill="currentColor" />
        </svg>
    </div>
);

export const FloralBorder = ({ className }: { className?: string }) => (
    <div className={`flex w-full overflow-hidden opacity-10 text-[#b21e29] pointer-events-none ${className}`}>
        {Array.from({ length: 20 }).map((_, i) => (
            <svg key={i} width="40" height="20" viewBox="0 0 40 20" fill="none" className="flex-shrink-0">
                <path d="M0 20 Q 10 0 20 20 Q 30 0 40 20" stroke="currentColor" strokeWidth="1" fill="none" />
                <circle cx="20" cy="10" r="2" fill="currentColor" />
            </svg>
        ))}
    </div>
);
export const FloatingElements = () => {
    const [mounted, setMounted] = useState(false);
    const [elements, setElements] = useState<any[]>([]);

    useEffect(() => {
        // Brand colors: Gold, Cream, Pale Yellow
        const colors = ["text-[#d4af37]", "text-[#f4e4bc]", "text-[#fff8e1]"];
        const els = Array.from({ length: 18 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            scale: 0.8 + Math.random() * 1.5,
            duration: 20 + Math.random() * 20,
            delay: Math.random() * -30,
            color: colors[Math.floor(Math.random() * colors.length)],
            type: Math.random() > 0.3 ? "flower" : "thread" // 70% flowers, 30% threads
        }));
        setElements(els);
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-[45]">
            {elements.map((el) => (
                <div
                    key={el.id}
                    className={`absolute opacity-[0.1] ${el.color} animate-[float_20s_ease-in-out_infinite]`}
                    style={{
                        top: `${el.y}%`,
                        left: `${el.x}%`,
                        animationDuration: `${el.duration}s`,
                        animationDelay: `${el.delay}s`,
                        transform: `scale(${el.scale})`
                    }}
                >
                    {el.type === "flower" ? (
                        <SpinningMandala className="w-16 h-16 md:w-24 md:h-24 opacity-60" />
                    ) : (
                        <svg width="200" height="200" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[100px] md:w-[200px] opacity-20">
                            <path d="M10 50 Q 25 25 50 50 T 90 50" stroke="currentColor" strokeWidth="0.5" fill="none" strokeDasharray="2 2" />
                            <circle cx="50" cy="30" r="1" fill="currentColor" opacity="0.3" />
                        </svg>
                    )}
                </div>
            ))}
        </div>
    );
};
