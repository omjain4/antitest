"use client";

import Navbar from "@/app/components/Navbar";
import PostSequence from "@/app/components/PostSequence";
import { AnimatePresence } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Standard Scroll Layout - No more scroll-jacking canvas */}
      <AnimatePresence mode="wait">
        <main className="pt-20">
          <PostSequence />
        </main>
      </AnimatePresence>
    </div>
  );
}
