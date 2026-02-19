import type { Metadata } from "next";
import { Suspense } from "react";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import Navbar from "./components/Navbar";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { CursorEffect } from "./components/CursorEffect";
import { FloatingElements, SpinningMandala } from "./components/Decorations";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const outfit = Outfit({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "PARINEY — Handwoven Heritage | Luxury Saree Collection",
  description:
    "Discover Pariney's exquisite handwoven sarees — Banarasi, Kanjivaram, and Patola. Generations of master craftsmanship woven into every thread.",
  keywords: ["Pariney", "saree", "handwoven", "Banarasi", "Kanjivaram", "Patola"],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${cormorant.variable} ${outfit.variable} antialiased selection:bg-gold/20`}
        style={{ fontFamily: "var(--font-body)" }}
      >
        <Suspense>
          <AuthProvider>
            <CartProvider>
              <CursorEffect />
              <FloatingElements />
              {/* Permanent decorations behind Navbar */}
              <div className="fixed top-0 left-0 right-0 h-20 overflow-hidden pointer-events-none z-[40]">
                <SpinningMandala className="absolute -top-10 -left-10 w-40 h-40 text-[#b21e29] opacity-30" />
                <SpinningMandala className="absolute -top-10 -right-10 w-60 h-60 text-[#b21e29] opacity-30" reverse />
              </div>
              <Navbar />
              {children}
            </CartProvider>
          </AuthProvider>
        </Suspense>
      </body>
    </html>
  );
}
