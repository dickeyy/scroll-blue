"use client";

import { LeftSidebar } from "@/components/sidebars/left-sidebar";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/providers/auth-provider";
import { QueryProvider } from "@/providers/query-provider";
import "@/styles/globals.css";
import { Inter as FontSans, Averia_Serif_Libre as FontSerif } from "next/font/google";
import { usePathname } from "next/navigation";

const fontSans = FontSans({
    subsets: ["latin"],
    variable: "--font-sans"
});

const fontSerif = FontSerif({
    subsets: ["latin"],
    variable: "--font-serif",
    weight: ["300", "400", "700"]
});

// Wrapper component for conditional sidebar rendering
function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Routes that don't need the sidebar
    const noSidebarRoutes = ["/home", "/sign-in"];
    const shouldShowSidebar = !noSidebarRoutes.some((route) => pathname.startsWith(route));

    if (!shouldShowSidebar) {
        return <main>{children}</main>;
    }

    return (
        <div className="relative flex h-screen max-h-screen w-full flex-row overflow-hidden bg-background">
            {/* Left Sidebar */}
            <div className="z-20 flex h-full w-[68px] flex-col p-2 md:w-[240px] md:p-4">
                <LeftSidebar />
            </div>
            {/* Main Content */}
            <main className="relative flex h-full min-h-screen w-full flex-1 flex-col overflow-y-auto">
                <div className="mx-auto h-full w-full max-w-3xl">{children}</div>
            </main>
        </div>
    );
}

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <QueryProvider>
            <html lang="en" suppressHydrationWarning>
                <head>
                    <script
                        defer
                        data-domain="scroll.blue"
                        src="https://analytics.kyle.so/js/script.js"
                    ></script>
                </head>
                <body
                    className={cn(
                        "min-h-screen overflow-auto bg-background font-sans antialiased",
                        fontSans.variable,
                        fontSerif.variable
                    )}
                >
                    <AuthProvider>
                        <LayoutWrapper>{children}</LayoutWrapper>
                        <Toaster richColors={true} position="top-center" />
                    </AuthProvider>
                </body>
            </html>
        </QueryProvider>
    );
}
