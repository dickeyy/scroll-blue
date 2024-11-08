import { AuthProvider } from "@/components/auth-provider";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter as FontSans, Averia_Serif_Libre as FontSerif } from "next/font/google";
import "./styles/globals.css";

const fontSans = FontSans({
    subsets: ["latin"],
    variable: "--font-sans"
});

const fontSerif = FontSerif({
    subsets: ["latin"],
    variable: "--font-serif",
    weight: ["300", "400", "700"]
});

export const metadata: Metadata = {
    title: "bsky"
};

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={cn(
                    "min-h-screen overflow-auto bg-background font-sans antialiased",
                    fontSans.variable,
                    fontSerif.variable
                )}
            >
                <AuthProvider>
                    {children}
                    <Toaster richColors={true} position="top-center" />
                </AuthProvider>
            </body>
        </html>
    );
}
