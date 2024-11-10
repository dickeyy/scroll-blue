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
    const noSidebarRoutes = ["/home", "/sign-in"];
    const shouldShowSidebar = !noSidebarRoutes.some((route) => pathname.startsWith(route));

    if (!shouldShowSidebar) {
        return <main>{children}</main>;
    }

    return (
        <div className="relative flex h-screen max-h-screen w-full flex-row overflow-hidden bg-background">
            {/* Fixed Left Sidebar */}
            <div className="fixed left-0 top-0 z-20 h-full w-[68px] flex-shrink-0 p-2 md:w-[240px] md:p-4">
                <LeftSidebar />
            </div>

            {/* Main Content Wrapper */}
            <div className="flex w-full justify-center">
                {/* Sidebar Spacer */}
                <div className="w-[68px] flex-shrink-0 md:w-[240px]" />

                {/* Main Content */}
                <main className="no-scrollbar flex h-full min-h-screen w-full max-w-3xl flex-col overflow-y-auto">
                    <div className="mx-auto h-full w-full">{children}</div>
                </main>

                {/* Right Spacer for Balance */}
                <div className="w-[68px] flex-shrink-0 md:w-[240px] hidden md:block" />
            </div>
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
                        <Toaster richColors={true} position="top-right" />
                    </AuthProvider>
                </body>
            </html>
        </QueryProvider>
    );
}
