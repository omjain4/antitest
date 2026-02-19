"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase";
import type { User, Session } from "@supabase/supabase-js";

interface UserProfile {
    id: string;
    email: string;
    full_name: string | null;
    role: "user" | "admin";
    avatar_url: string | null;
    created_at: string;
}

interface AuthContextType {
    user: User | null;
    profile: UserProfile | null;
    session: Session | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<{ error?: string }>;
    register: (email: string, password: string, fullName: string) => Promise<{ error?: string }>;
    logout: () => Promise<void>;
    updateProfile: (updates: Partial<UserProfile>) => Promise<{ error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    const supabase = createBrowserSupabaseClient();

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id);
            } else {
                setLoading(false);
            }
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                setSession(session);
                setUser(session?.user ?? null);
                if (session?.user) {
                    await fetchProfile(session.user.id);
                } else {
                    setProfile(null);
                    setLoading(false);
                }
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    async function fetchProfile(userId: string) {
        const { data } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .single();

        if (data) {
            setProfile({
                id: data.id,
                email: user?.email || "",
                full_name: data.full_name,
                role: data.role,
                avatar_url: data.avatar_url,
                created_at: data.created_at,
            });
        }
        setLoading(false);
    }

    async function login(email: string, password: string) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return { error: error.message };
        return {};
    }

    async function register(email: string, password: string, fullName: string) {
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: fullName } },
        });
        if (error) return { error: error.message };
        return {};
    }

    async function logout() {
        await supabase.auth.signOut();
        setUser(null);
        setProfile(null);
        setSession(null);
    }

    async function updateProfile(updates: Partial<UserProfile>) {
        if (!user) return { error: "Not authenticated" };
        const { error } = await supabase
            .from("profiles")
            .update(updates)
            .eq("id", user.id);
        if (error) return { error: error.message };
        if (profile) setProfile({ ...profile, ...updates });
        return {};
    }

    return (
        <AuthContext.Provider
            value={{ user, profile, session, loading, login, register, logout, updateProfile }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
}
