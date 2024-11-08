// app/providers/auth-provider.tsx
"use client";

import { useAuthStore } from "@/stores/auth-store";
import { useUserStore } from "@/stores/user-store";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface AuthProviderProps {
    children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [isLoading, setIsLoading] = useState(true);
    const resumeSession = useAuthStore((state) => state.resumeSession);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const initAuth = async () => {
            try {
                const success = await resumeSession();

                // If session resumed successfully, fetch user data
                if (success) {
                    await useUserStore.getState().fetchProfile();
                    await useUserStore.getState().fetchSocialGraph();

                    if (isAuthRoute(pathname)) {
                        router.push("/home");
                    }
                } else if (isProtectedRoute(pathname)) {
                    router.push("/login");
                }
            } catch (error) {
                console.error("Failed to resume session:", error);
                if (isProtectedRoute(pathname)) {
                    router.push("/login");
                }
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();
    }, [resumeSession, router, pathname]);

    // Show loading state while checking authentication
    if (isLoading) {
        return <AuthLoader />;
    }

    return <>{children}</>;
}

// Helper function to determine if a route requires authentication
function isProtectedRoute(pathname: string): boolean {
    const protectedRoutes = ["/home", "/profile", "/settings"];
    return protectedRoutes.some((route) => pathname.startsWith(route));
}

// Helper function to determine if we're on an auth route (login/register)
function isAuthRoute(pathname: string): boolean {
    return ["/login", "/register"].includes(pathname);
}

// Simple loading component - replace with your own design
function AuthLoader() {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-gray-900" />
        </div>
    );
}
