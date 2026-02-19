/*
 * Seed script: Inserts existing shopData into Supabase tables.
 * 
 * Usage:
 *   npx tsx scripts/seed.ts
 * 
 * Make sure .env.local is configured with your Supabase credentials.
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve } from "path";

// Load .env.local manually (no dotenv dependency needed)
const envPath = resolve(process.cwd(), ".env.local");
try {
    const envContent = readFileSync(envPath, "utf-8");
    for (const line of envContent.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const [key, ...rest] = trimmed.split("=");
        process.env[key.trim()] = rest.join("=").trim();
    }
} catch {
    console.error("❌ Could not read .env.local — make sure it exists!");
    process.exit(1);
}

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const PRODUCTS = [
    {
        name: "Banarasi Silk Saree with Gold Zari Border",
        brand: "Pariney Heritage",
        price: 15999,
        original_price: 24999,
        discount: 36,
        image: "https://picsum.photos/seed/saree1/600/800",
        rating: 4.6,
        reviews: 342,
        tag: "BESTSELLER",
        sizes: ["Free Size"],
        colors: ["Red", "Maroon", "Purple"],
        category: "Banarasi",
    },
    {
        name: "Kanjivaram Pure Silk Temple Border Saree",
        brand: "Pariney Royal",
        price: 22499,
        original_price: 34999,
        discount: 36,
        image: "https://picsum.photos/seed/saree2/600/800",
        rating: 4.8,
        reviews: 528,
        tag: "TOP RATED",
        sizes: ["Free Size"],
        colors: ["Gold", "Green", "Blue"],
        category: "Kanjivaram",
    },
    {
        name: "Pure Patola Double Ikat Handloom Saree",
        brand: "Pariney Artisan",
        price: 28999,
        original_price: 45000,
        discount: 36,
        image: "https://picsum.photos/seed/saree3/600/800",
        rating: 4.9,
        reviews: 127,
        tag: "EXCLUSIVE",
        sizes: ["Free Size"],
        colors: ["Red", "Yellow", "Green"],
        category: "Patola",
    },
    {
        name: "Chanderi Silk Cotton Floral Woven Saree",
        brand: "Pariney Weaves",
        price: 8999,
        original_price: 14999,
        discount: 40,
        image: "https://picsum.photos/seed/saree4/600/800",
        rating: 4.4,
        reviews: 891,
        tag: null,
        sizes: ["Free Size"],
        colors: ["Peach", "Sky Blue", "Mint"],
        category: "Chanderi",
    },
    {
        name: "Tussar Silk Handpainted Madhubani Saree",
        brand: "Pariney Artisan",
        price: 12499,
        original_price: 19999,
        discount: 38,
        image: "https://picsum.photos/seed/saree5/600/800",
        rating: 4.5,
        reviews: 256,
        tag: null,
        sizes: ["Free Size"],
        colors: ["Beige", "Cream", "Natural"],
        category: "Tussar",
    },
    {
        name: "Organza Saree with Embroidered Border",
        brand: "Pariney Heritage",
        price: 11499,
        original_price: 17999,
        discount: 36,
        image: "https://picsum.photos/seed/saree6/600/800",
        rating: 4.3,
        reviews: 412,
        tag: "NEW ARRIVAL",
        sizes: ["Free Size"],
        colors: ["Lavender", "Rose", "Ivory"],
        category: "Wedding Edit",
    },
    {
        name: "Banarasi Georgette Lightweight Party Saree",
        brand: "Pariney Royal",
        price: 9499,
        original_price: 15999,
        discount: 41,
        image: "https://picsum.photos/seed/saree7/600/800",
        rating: 4.2,
        reviews: 673,
        tag: null,
        sizes: ["Free Size"],
        colors: ["Wine", "Teal", "Coral"],
        category: "Banarasi",
    },
    {
        name: "Pure Silk Gadwal Saree with Kuttu Border",
        brand: "Pariney Weaves",
        price: 18999,
        original_price: 28999,
        discount: 34,
        image: "https://picsum.photos/seed/saree8/600/800",
        rating: 4.7,
        reviews: 198,
        tag: "PREMIUM",
        sizes: ["Free Size"],
        colors: ["Magenta", "Navy", "Emerald"],
        category: "New Drops",
    },
];

const CATEGORIES = [
    { id: "banarasi", name: "Banarasi", image: "/frames/ezgif-frame-010.jpg", count: 248 },
    { id: "kanjivaram", name: "Kanjivaram", image: "/frames/ezgif-frame-030.jpg", count: 186 },
    { id: "patola", name: "Patola", image: "/frames/ezgif-frame-050.jpg", count: 94 },
    { id: "chanderi", name: "Chanderi", image: "/frames/ezgif-frame-060.jpg", count: 167 },
    { id: "tussar", name: "Tussar Silk", image: "/frames/ezgif-frame-070.jpg", count: 132 },
    { id: "organza", name: "Organza", image: "/frames/ezgif-frame-080.jpg", count: 78 },
];

const HERO_SLIDES = [
    {
        image: "/frames/ezgif-frame-010.jpg",
        tag: "Heritage Collection",
        title: "The Royal Banarasi Edit",
        subtitle: "Handwoven masterpieces featuring real gold zari work.",
        author: "Pariney Weavers",
        time: "10 min read",
    },
    {
        image: "/frames/ezgif-frame-050.jpg",
        tag: "New Arrival",
        title: "Patola: The King of Silks",
        subtitle: "Double Ikat weaves that take six months to craft.",
        author: "Gujarat Artisans",
        time: "8 min read",
    },
    {
        image: "/frames/ezgif-frame-030.jpg",
        tag: "Wedding Edit",
        title: "Bridal Kanjivarams",
        subtitle: "Timeless silks for your most special moment.",
        author: "Kanchipuram Guild",
        time: "12 min read",
    },
];

const DEALS = [
    { label: "Flat ₹5000 Off", description: "On orders above ₹15,000", code: "PARINEY5K" },
    { label: "Buy 2 Get 1 Free", description: "On selected Banarasi collection", code: "BOGO3" },
    { label: "Free Shipping", description: "On all prepaid orders", code: "" },
];

async function seed() {
    console.log("🌱 Seeding Supabase database...\n");

    // Seed products
    console.log("📦 Inserting products...");
    const { error: productsErr } = await supabase.from("products").upsert(PRODUCTS, { onConflict: "name" });
    if (productsErr) console.error("  ❌ Products error:", productsErr.message);
    else console.log("  ✅ Products seeded");

    // Seed categories
    console.log("📂 Inserting categories...");
    const { error: categoriesErr } = await supabase.from("categories").upsert(CATEGORIES, { onConflict: "id" });
    if (categoriesErr) console.error("  ❌ Categories error:", categoriesErr.message);
    else console.log("  ✅ Categories seeded");

    // Seed hero slides
    console.log("🎠 Inserting hero slides...");
    const { error: slidesErr } = await supabase.from("hero_slides").insert(HERO_SLIDES);
    if (slidesErr) console.error("  ❌ Hero slides error:", slidesErr.message);
    else console.log("  ✅ Hero slides seeded");

    // Seed deals
    console.log("🏷️ Inserting deals...");
    const { error: dealsErr } = await supabase.from("deals").insert(DEALS);
    if (dealsErr) console.error("  ❌ Deals error:", dealsErr.message);
    else console.log("  ✅ Deals seeded");

    console.log("\n🎉 Seeding complete!");
    console.log("\n💡 To make a user admin, run this in Supabase SQL Editor:");
    console.log("   UPDATE profiles SET role = 'admin' WHERE id = '<user-uuid>';");
}

seed().catch(console.error);
