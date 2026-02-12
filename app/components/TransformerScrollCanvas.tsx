"use client";

import { useEffect, useRef, useCallback } from "react";
import { type MotionValue, useMotionValueEvent } from "framer-motion";
import { FRAME_CROP_BOTTOM } from "@/data/transformerData";

interface TransformerScrollCanvasProps {
    scrollYProgress: MotionValue<number>;
    totalFrames: number;
    imageFolderPath: string;
}

function getFrameSrc(folder: string, index: number): string {
    const num = String(index + 1).padStart(3, "0");
    return `${folder}/ezgif-frame-${num}.jpg`;
}

export default function TransformerScrollCanvas({
    scrollYProgress,
    totalFrames,
    imageFolderPath,
}: TransformerScrollCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imagesRef = useRef<HTMLImageElement[]>([]);
    const loadedRef = useRef<Set<number>>(new Set());
    const currentFrameRef = useRef(0);

    // Preload all frames
    useEffect(() => {
        const images: HTMLImageElement[] = new Array(totalFrames);
        imagesRef.current = images;

        const loadImage = (i: number): Promise<void> =>
            new Promise((resolve) => {
                const img = new Image();
                img.src = getFrameSrc(imageFolderPath, i);
                img.onload = () => {
                    loadedRef.current.add(i);
                    if (i === 0) drawFrame(0);
                    resolve();
                };
                img.onerror = () => resolve();
                images[i] = img;
            });

        const priority = Array.from({ length: Math.min(15, totalFrames) }, (_, i) => i);
        Promise.all(priority.map(loadImage)).then(() => {
            const rest = Array.from({ length: totalFrames }, (_, i) => i).filter((i) => i >= 15);
            let idx = 0;
            const batchSize = 25;
            function loadBatch() {
                const batch = rest.slice(idx, idx + batchSize);
                if (batch.length === 0) return;
                Promise.all(batch.map(loadImage)).then(() => {
                    idx += batchSize;
                    requestAnimationFrame(loadBatch);
                });
            }
            loadBatch();
        });
    }, [totalFrames, imageFolderPath]);

    // CONTAIN mode — no zoom, subject stays fully visible and centered
    const drawImageContain = useCallback(
        (ctx: CanvasRenderingContext2D, img: HTMLImageElement, canvasW: number, canvasH: number) => {
            // Crop bottom of source to remove Veo watermark
            const cropPx = Math.round(img.naturalHeight * FRAME_CROP_BOTTOM);
            const srcW = img.naturalWidth;
            const srcH = img.naturalHeight - cropPx;
            const imgRatio = srcW / srcH;
            const canvasRatio = canvasW / canvasH;

            let dw: number, dh: number, dx: number, dy: number;

            if (imgRatio > canvasRatio) {
                // Image wider — fit to width, center vertically
                dw = canvasW;
                dh = canvasW / imgRatio;
                dx = 0;
                dy = (canvasH - dh) / 2;
            } else {
                // Image taller — fit to height, center horizontally
                dh = canvasH;
                dw = canvasH * imgRatio;
                dx = (canvasW - dw) / 2;
                dy = 0;
            }

            // Fill background
            ctx.fillStyle = "#0e0a06";
            ctx.fillRect(0, 0, canvasW, canvasH);

            // Draw cropped source (skip bottom watermark)
            ctx.drawImage(img, 0, 0, srcW, srcH, dx, dy, dw, dh);
        },
        []
    );

    const drawFrame = useCallback(
        (frameIndex: number) => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            const dpr = window.devicePixelRatio || 1;
            const w = window.innerWidth;
            const h = window.innerHeight;

            if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
                canvas.width = w * dpr;
                canvas.height = h * dpr;
                canvas.style.width = `${w}px`;
                canvas.style.height = `${h}px`;
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.scale(dpr, dpr);
            }

            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";

            const img = imagesRef.current[frameIndex];
            if (img && loadedRef.current.has(frameIndex)) {
                drawImageContain(ctx, img, w, h);
                return;
            }

            // Fallback: nearest loaded
            for (let offset = 1; offset < totalFrames; offset++) {
                const before = frameIndex - offset;
                const after = frameIndex + offset;
                if (before >= 0 && loadedRef.current.has(before) && imagesRef.current[before]) {
                    drawImageContain(ctx, imagesRef.current[before], w, h);
                    return;
                }
                if (after < totalFrames && loadedRef.current.has(after) && imagesRef.current[after]) {
                    drawImageContain(ctx, imagesRef.current[after], w, h);
                    return;
                }
            }

            ctx.fillStyle = "#0e0a06";
            ctx.fillRect(0, 0, w, h);
        },
        [drawImageContain, totalFrames]
    );

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        const frameIndex = Math.min(totalFrames - 1, Math.floor(latest * totalFrames));
        if (frameIndex !== currentFrameRef.current) {
            currentFrameRef.current = frameIndex;
            requestAnimationFrame(() => drawFrame(frameIndex));
        }
    });

    useEffect(() => {
        const handleResize = () => drawFrame(currentFrameRef.current);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [drawFrame]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            aria-hidden="true"
        />
    );
}
