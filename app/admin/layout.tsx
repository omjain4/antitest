import { Suspense, type ReactNode } from "react";
import AdminLayoutClient from "./AdminLayoutClient";

export const dynamic = 'force-dynamic';

function AdminLoading() {
    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-[#800000] border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-400 text-sm font-medium">Loading admin panel...</p>
            </div>
        </div>
    );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <Suspense fallback={<AdminLoading />}>
            <AdminLayoutClient>{children}</AdminLayoutClient>
        </Suspense>
    );
}
