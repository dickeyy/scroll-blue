import { Toaster } from "@/components/ui/sonner";
import WrappedLayout from "@/components/wrapped-layout";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/providers/auth-provider";
import { QueryProvider } from "@/providers/query-provider";
import "@/styles/globals.css";
import { Metadata } from "next";
import {
    JetBrains_Mono as FontMono,
    Inter as FontSans,
    Averia_Serif_Libre as FontSerif
} from "next/font/google";

// fonts
const fontSans = FontSans({
    subsets: ["latin"],
    variable: "--font-sans"
});

const fontSerif = FontSerif({
    subsets: ["latin"],
    variable: "--font-serif",
    weight: ["300", "400", "700"]
});

const fontMono = FontMono({
    subsets: ["latin"],
    variable: "--font-mono",
    weight: ["300", "400", "500", "600", "700"]
});

// metadata
export const metadata: Metadata = {
    title: "scroll.blue",
    description: "A minimal and open-source Bluesky web client."
};

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
                        fontSerif.variable,
                        fontMono.variable
                    )}
                >
                    <AuthProvider>
                        <WrappedLayout>{children}</WrappedLayout>
                        <Toaster richColors={true} position="top-right" />
                    </AuthProvider>
                </body>
            </html>
        </QueryProvider>
    );
}
