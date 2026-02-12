// HUD copy and data for the Pariney Saree cinematic sequence
// Traditional Indian heritage language

export const TOTAL_FRAMES = 100;
export const SCROLL_HEIGHT = "500vh";
export const IMAGE_FOLDER = "/frames";

// Bottom crop percentage to remove Veo watermark from frames
export const FRAME_CROP_BOTTOM = 0.06; // crop bottom 6% of each frame

export interface HUDPhase {
    id: string;
    label: string;
    start: number;
    end: number;
    lines: { text: string; delay?: number }[];
    position: "left" | "right" | "center";
}

export const HUD_PHASES: HUDPhase[] = [
    {
        id: "hero",
        label: "Heritage Unveiled",
        start: 0,
        end: 0.30,
        position: "left",
        lines: [
            { text: "PARINEY", delay: 0 },
            { text: "परिणय · Since Generations", delay: 0.15 },
            { text: "Where every thread carries a legacy", delay: 0.3 },
        ],
    },
    {
        id: "craft",
        label: "The Craft",
        start: 0.30,
        end: 0.75,
        position: "right",
        lines: [
            { text: "हस्तनिर्मित · Handcrafted", delay: 0 },
            { text: "Master weavers of Varanasi", delay: 0.1 },
            { text: "Every drape, a story", delay: 0.2 },
        ],
    },
    {
        id: "arrival",
        label: "The Elegance",
        start: 0.75,
        end: 1.01,
        position: "center",
        lines: [
            { text: "Timeless Grace", delay: 0 },
            { text: "Pariney — परिणय", delay: 0.15 },
            { text: "EXPLORE THE COLLECTION", delay: 0.3 },
        ],
    },
];

export const NAV = {
    brand: "PARINEY",
    brandHindi: "परिणय",
    cta: "SHOP NOW",
    ctaHref: "#collection",
};

export const SPECS = [
    { label: "Weave", value: "Banarasi Silk" },
    { label: "Thread Count", value: "5,600+ per inch" },
    { label: "Origin", value: "Varanasi, India" },
    { label: "Craft Duration", value: "45 days" },
    { label: "Zari", value: "Pure Gold & Silver" },
    { label: "Heritage", value: "Since 1847" },
];

export const COLLECTION = [
    {
        title: "Banarasi",
        description: "Timeless silk weaves from the sacred ghats of Varanasi. Each saree carries centuries of tradition.",
        frame: 20,
    },
    {
        title: "Kanjivaram",
        description: "Temple-inspired grandeur in pure mulberry silk. Bold borders, divine colours.",
        frame: 72,
    },
    {
        title: "Patola",
        description: "Double ikat precision from Gujarat's master weavers. No two are ever alike.",
        frame: 120,
    },
];
