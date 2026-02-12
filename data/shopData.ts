// Product data for the Myntra-style shopping sections

export interface Product {
    id: number;
    name: string;
    brand: string;
    price: number;
    originalPrice: number;
    discount: number;
    image: string; // frame number used as product image
    rating: number;
    reviews: number;
    tag?: string;
    sizes: string[];
    colors: string[];
    category: string; // Added for filtering
}

export const HERO_SLIDES = [
    {
        id: 1,
        image: "/frames/ezgif-frame-010.jpg",
        tag: "Heritage Collection",
        title: "The Royal Banarasi Edit",
        subtitle: "Handwoven masterpieces featuring real gold zari work.",
        author: "Pariney Weavers",
        time: "10 min read"
    },
    {
        id: 2,
        image: "/frames/ezgif-frame-050.jpg",
        tag: "New Arrival",
        title: "Patola: The King of Silks",
        subtitle: "Double Ikat weaves that take six months to craft.",
        author: "Gujarat Artisans",
        time: "8 min read"
    },
    {
        id: 3,
        image: "/frames/ezgif-frame-030.jpg",
        tag: "Wedding Edit",
        title: "Bridal Kanjivarams",
        subtitle: "Timeless silks for your most special moment.",
        author: "Kanchipuram Guild",
        time: "12 min read"
    }
];

export interface Category {
    id: string;
    name: string;
    image: string;
    count: number;
}

export const CATEGORIES: Category[] = [
    { id: "banarasi", name: "Banarasi", image: "/frames/ezgif-frame-010.jpg", count: 248 },
    { id: "kanjivaram", name: "Kanjivaram", image: "/frames/ezgif-frame-030.jpg", count: 186 },
    { id: "patola", name: "Patola", image: "/frames/ezgif-frame-050.jpg", count: 94 },
    { id: "chanderi", name: "Chanderi", image: "/frames/ezgif-frame-060.jpg", count: 167 },
    { id: "tussar", name: "Tussar Silk", image: "/frames/ezgif-frame-070.jpg", count: 132 },
    { id: "organza", name: "Organza", image: "/frames/ezgif-frame-080.jpg", count: 78 },
];

export const PRODUCTS: Product[] = [
    {
        id: 1,
        name: "Banarasi Silk Saree with Gold Zari Border",
        brand: "Pariney Heritage",
        price: 15999,
        originalPrice: 24999,
        discount: 36,
        image: "https://picsum.photos/seed/saree1/600/800",
        rating: 4.6,
        reviews: 342,
        tag: "BESTSELLER",
        sizes: ["Free Size"],
        colors: ["Red", "Maroon", "Purple"],
        category: "Banarasi"
    },
    {
        id: 2,
        name: "Kanjivaram Pure Silk Temple Border Saree",
        brand: "Pariney Royal",
        price: 22499,
        originalPrice: 34999,
        discount: 36,
        image: "https://picsum.photos/seed/saree2/600/800",
        rating: 4.8,
        reviews: 528,
        tag: "TOP RATED",
        sizes: ["Free Size"],
        colors: ["Gold", "Green", "Blue"],
        category: "Kanjivaram"
    },
    {
        id: 3,
        name: "Pure Patola Double Ikat Handloom Saree",
        brand: "Pariney Artisan",
        price: 28999,
        originalPrice: 45000,
        discount: 36,
        image: "https://picsum.photos/seed/saree3/600/800",
        rating: 4.9,
        reviews: 127,
        tag: "EXCLUSIVE",
        sizes: ["Free Size"],
        colors: ["Red", "Yellow", "Green"],
        category: "Patola"
    },
    {
        id: 4,
        name: "Chanderi Silk Cotton Floral Woven Saree",
        brand: "Pariney Weaves",
        price: 8999,
        originalPrice: 14999,
        discount: 40,
        image: "https://picsum.photos/seed/saree4/600/800",
        rating: 4.4,
        reviews: 891,
        sizes: ["Free Size"],
        colors: ["Peach", "Sky Blue", "Mint"],
        category: "Chanderi"
    },
    {
        id: 5,
        name: "Tussar Silk Handpainted Madhubani Saree",
        brand: "Pariney Artisan",
        price: 12499,
        originalPrice: 19999,
        discount: 38,
        image: "https://picsum.photos/seed/saree5/600/800",
        rating: 4.5,
        reviews: 256,
        sizes: ["Free Size"],
        colors: ["Beige", "Cream", "Natural"],
        category: "Tussar"
    },
    {
        id: 6,
        name: "Organza Saree with Embroidered Border",
        brand: "Pariney Heritage",
        price: 11499,
        originalPrice: 17999,
        discount: 36,
        image: "https://picsum.photos/seed/saree6/600/800",
        rating: 4.3,
        reviews: 412,
        tag: "NEW ARRIVAL",
        sizes: ["Free Size"],
        colors: ["Lavender", "Rose", "Ivory"],
        category: "Wedding Edit"
    },
    {
        id: 7,
        name: "Banarasi Georgette Lightweight Party Saree",
        brand: "Pariney Royal",
        price: 9499,
        originalPrice: 15999,
        discount: 41,
        image: "https://picsum.photos/seed/saree7/600/800",
        rating: 4.2,
        reviews: 673,
        sizes: ["Free Size"],
        colors: ["Wine", "Teal", "Coral"],
        category: "Banarasi"
    },
    {
        id: 8,
        name: "Pure Silk Gadwal Saree with Kuttu Border",
        brand: "Pariney Weaves",
        price: 18999,
        originalPrice: 28999,
        discount: 34,
        image: "https://picsum.photos/seed/saree8/600/800",
        rating: 4.7,
        reviews: 198,
        tag: "PREMIUM",
        sizes: ["Free Size"],
        colors: ["Magenta", "Navy", "Emerald"],
        category: "New Drops"
    },
];

export const DEALS = [
    { label: "Flat ₹5000 Off", description: "On orders above ₹15,000", code: "PARINEY5K" },
    { label: "Buy 2 Get 1 Free", description: "On selected Banarasi collection", code: "BOGO3" },
    { label: "Free Shipping", description: "On all prepaid orders", code: "" },
];

export const FILTERS = {
    categories: ["All", "Banarasi", "Kanjivaram", "Patola", "Chanderi", "Tussar", "Organza"],
    priceRanges: ["Under ₹10K", "₹10K–₹20K", "₹20K–₹30K", "₹30K+"],
    sortBy: ["Popular", "New Arrivals", "Price: Low to High", "Price: High to Low", "Rating"],
};
