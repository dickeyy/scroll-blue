"use client";

import { useAuthStore } from "@/stores/auth-store";
import { useUserStore } from "@/stores/user-store";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Spinner } from "../components/spinner";

interface AuthProviderProps {
    children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [isLoading, setIsLoading] = useState(true);
    const resumeSession = useAuthStore((state) => state.resumeSession);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const router = useRouter();
    const pathname = usePathname();

    // Initial auth check
    useEffect(() => {
        const initAuth = async () => {
            try {
                const success = await resumeSession();

                if (success) {
                    // If session resumed successfully, fetch user data
                    await useUserStore.getState().fetchProfile();
                    await useUserStore.getState().fetchSocialGraph();

                    // Redirect from auth routes to home if already authenticated
                    if (isAuthRoute(pathname)) {
                        router.push("/");
                    }
                } else {
                    // If no valid session and not on a public route, redirect to home page
                    if (!isPublicRoute(pathname)) {
                        router.push("/home");
                    }
                }
            } catch (error) {
                console.error("Failed to resume session:", error);
                toast.error("Failed to resume session.", {
                    description: "Please sign in again to continue."
                });
                // On error, redirect to sign in if not on a public route
                if (!isPublicRoute(pathname)) {
                    router.push("/sign-in");
                }
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();
    }, [resumeSession, router, pathname]);

    // Watch for authentication state changes
    useEffect(() => {
        if (!isLoading && !isAuthenticated && !isPublicRoute(pathname)) {
            router.push("/home");
        }
    }, [isAuthenticated, pathname, isLoading, router]);

    // Show loading state while checking authentication
    if (isLoading) {
        return <AuthLoader />;
    }

    return <>{children}</>;
}

// Helper function to determine if we're on an auth route
function isAuthRoute(pathname: string): boolean {
    return pathname == "/sign-in";
}

// Helper function to determine if a route is public
function isPublicRoute(pathname: string): boolean {
    const publicRoutes = ["/sign-in", "/privacy", "/terms", "/about", "/home"];
    return publicRoutes.some((route) => pathname.startsWith(route));
}

function AuthLoader() {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <Spinner />
        </div>
    );
}
