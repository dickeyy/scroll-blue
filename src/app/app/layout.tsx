"use client";

import { LeftSidebar } from "@/components/sidebars/left-sidebar";
import { RightSidebar } from "@/components/sidebars/right-sidebar";
import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { QueryProvider } from "../providers/query-provider";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();

    useEffect(() => {
        // Redirect if already authenticated
        if (!isAuthenticated) {
            router.push("/sign-in");
        }
    }, [isAuthenticated, router]);

    return (
        <QueryProvider>
            <div className="relative flex h-screen max-h-screen w-full flex-row overflow-hidden bg-background">
                {/* Left Sidebar */}
                <div className="z-20 flex h-full w-[68px] flex-col p-2 md:w-[240px] md:p-4">
                    <LeftSidebar />
                </div>
                {/* Main Content */}
                <main className="relative flex h-full min-h-screen w-full flex-1 flex-col overflow-y-auto">
                    <div className="mx-auto h-full w-full max-w-2xl">{children}</div>
                </main>
                {/* Right Sidebar - Only visible on larger screens */}
                <div className="hidden w-[350px] flex-col gap-4 overflow-y-auto p-4 lg:flex">
                    <RightSidebar />
                </div>
            </div>
        </QueryProvider>
    );
}
