"use client";

import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const [mode, setMode] = useState<"login" | "register">("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const { login, register } = useAuth();

    function reset() {
        setEmail("");
        setPassword("");
        setFullName("");
        setError("");
        setSuccess("");
    }

    function switchMode(m: "login" | "register") {
        reset();
        setMode(m);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setSuccess("");
        setSubmitting(true);

        try {
            if (mode === "login") {
                const res = await login(email, password);
                if (res.error) {
                    setError(res.error);
                } else {
                    onClose();
                    reset();
                }
            } else {
                if (!fullName.trim()) {
                    setError("Please enter your full name");
                    setSubmitting(false);
                    return;
                }
                const res = await register(email, password, fullName);
                if (res.error) {
                    setError(res.error);
                } else {
                    setSuccess("Account created! You can now sign in.");
                    setTimeout(() => switchMode("login"), 2000);
                }
            }
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center px-4"
                    onClick={onClose}
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-md bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-[#d4a89a]/30 overflow-hidden"
                    >
                        {/* Decorative header */}
                        <div className="bg-gradient-to-r from-[#800000] to-[#b21e29] px-8 py-6 text-center">
                            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-black text-white tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
                                {mode === "login" ? "Welcome Back" : "Join Pariney"}
                            </h2>
                            <p className="text-white/70 text-xs mt-1 font-medium">
                                {mode === "login" ? "Sign in to your account" : "Create your heritage account"}
                            </p>
                        </div>

                        {/* Tab Pills */}
                        <div className="flex gap-1 p-1 mx-8 mt-6 bg-gray-100 rounded-lg">
                            <button
                                onClick={() => switchMode("login")}
                                className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all duration-200 ${mode === "login"
                                        ? "bg-white text-[#800000] shadow-sm"
                                        : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => switchMode("register")}
                                className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all duration-200 ${mode === "register"
                                        ? "bg-white text-[#800000] shadow-sm"
                                        : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                Sign Up
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="px-8 pt-5 pb-8 space-y-4">
                            {/* Error */}
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs font-medium"
                                >
                                    {error}
                                </motion.div>
                            )}

                            {/* Success */}
                            {success && (
                                <motion.div
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-xs font-medium"
                                >
                                    {success}
                                </motion.div>
                            )}

                            {/* Full Name (Register only) */}
                            <AnimatePresence>
                                {mode === "register" && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <label className="block text-[10px] font-bold text-[#800000] uppercase tracking-widest mb-1.5">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            placeholder="Your full name"
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-[#3d1a1a] placeholder:text-gray-400 focus:outline-none focus:border-[#800000] focus:ring-1 focus:ring-[#800000]/20 transition-all"
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Email */}
                            <div>
                                <label className="block text-[10px] font-bold text-[#800000] uppercase tracking-widest mb-1.5">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    required
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-[#3d1a1a] placeholder:text-gray-400 focus:outline-none focus:border-[#800000] focus:ring-1 focus:ring-[#800000]/20 transition-all"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-[10px] font-bold text-[#800000] uppercase tracking-widest mb-1.5">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-[#3d1a1a] placeholder:text-gray-400 focus:outline-none focus:border-[#800000] focus:ring-1 focus:ring-[#800000]/20 transition-all"
                                />
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-3.5 bg-gradient-to-r from-[#800000] to-[#b21e29] text-white text-sm font-bold uppercase tracking-widest rounded-lg hover:from-[#6b0000] hover:to-[#991b1b] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
                            >
                                {submitting ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        {mode === "login" ? "Signing in..." : "Creating account..."}
                                    </span>
                                ) : mode === "login" ? (
                                    "Sign In"
                                ) : (
                                    "Create Account"
                                )}
                            </button>
                        </form>

                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white transition-colors"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
