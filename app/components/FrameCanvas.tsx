"use client";

import { useEffect, useRef, useCallback } from "react";

const TOTAL_FRAMES = 144;

function getFrameSrc(index: number): string {
    const num = String(index + 1).padStart(3, "0");
    return `/frames/ezgif-frame-${num}.jpg`;
}

interface FrameCanvasProps {
    currentFrame: number;
}

export default function FrameCanvas({ currentFrame }: FrameCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imagesRef = useRef<HTMLImageElement[]>([]);
    const loadedRef = useRef<Set<number>>(new Set());
    const rafRef = useRef<number | null>(null);

    // Preload images
    useEffect(() => {
        const images: HTMLImageElement[] = new Array(TOTAL_FRAMES);
        imagesRef.current = images;

        const loadImage = (i: number): Promise<void> => {
            return new Promise((resolve) => {
                const img = new Image();
                img.src = getFrameSrc(i);
                img.onload = () => {
                    loadedRef.current.add(i);
                    resolve();
                };
                img.onerror = () => resolve();
                images[i] = img;
            });
        };

        // Load first 10 frames immediately for fast initial render
        const initialBatch = Array.from({ length: Math.min(10, TOTAL_FRAMES) }, (_, i) => i);
        Promise.all(initialBatch.map(loadImage)).then(() => {
            // Then load rest in batches of 20
            const remaining = Array.from({ length: TOTAL_FRAMES }, (_, i) => i).filter(
                (i) => i >= 10
            );
            let batchStart = 0;
            const batchSize = 20;

            function loadNextBatch() {
                const batch = remaining.slice(batchStart, batchStart + batchSize);
                if (batch.length === 0) return;
                Promise.all(batch.map(loadImage)).then(() => {
                    batchStart += batchSize;
                    requestAnimationFrame(loadNextBatch);
                });
            }
            loadNextBatch();
        });

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    // Draw frame to canvas
    const drawFrame = useCallback((frameIndex: number) => {
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
            ctx.scale(dpr, dpr);
        }

        const img = imagesRef.current[frameIndex];
        if (!img || !loadedRef.current.has(frameIndex)) {
            // Find nearest loaded frame
            for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
                const before = frameIndex - offset;
                const after = frameIndex + offset;
                if (before >= 0 && loadedRef.current.has(before) && imagesRef.current[before]) {
                    drawImageCover(ctx, imagesRef.current[before], w, h);
                    return;
                }
                if (after < TOTAL_FRAMES && loadedRef.current.has(after) && imagesRef.current[after]) {
                    drawImageCover(ctx, imagesRef.current[after], w, h);
                    return;
                }
            }
            // Fill black if nothing loaded
            ctx.fillStyle = "#0e0a06";
            ctx.fillRect(0, 0, w, h);
            return;
        }

        drawImageCover(ctx, img, w, h);
    }, []);

    // Cover-mode drawing (like object-fit: cover)
    function drawImageCover(
        ctx: CanvasRenderingContext2D,
        img: HTMLImageElement,
        canvasW: number,
        canvasH: number
    ) {
        const imgRatio = img.naturalWidth / img.naturalHeight;
        const canvasRatio = canvasW / canvasH;

        let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;

        if (imgRatio > canvasRatio) {
            sw = img.naturalHeight * canvasRatio;
            sx = (img.naturalWidth - sw) / 2;
        } else {
            sh = img.naturalWidth / canvasRatio;
            sy = (img.naturalHeight - sh) / 2;
        }

        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvasW, canvasH);
    }

    // Render on frame change
    useEffect(() => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => drawFrame(currentFrame));
    }, [currentFrame, drawFrame]);

    // Handle resize
    useEffect(() => {
        const handleResize = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;
            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.scale(dpr, dpr);
            drawFrame(currentFrame);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [currentFrame, drawFrame]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            aria-hidden="true"
            style={{ imageRendering: "auto" }}
        />
    );
}
