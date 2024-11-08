"use client";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Homepage() {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();

    useEffect(() => {
        // Redirect if already authenticated
        if (isAuthenticated) {
            router.push("/app");
        }
    }, [isAuthenticated, router]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center overflow-y-hidden">
            <div className="flex w-full max-w-[30rem] flex-1 flex-grow flex-col items-center justify-center gap-4 px-4">
                <h1 className="flex items-baseline justify-center text-center font-serif text-4xl font-extrabold">
                    bsky{" "}
                    <span className="text-foreground/40 text-[18px] italic transition-all duration-150 hover:text-foreground hover:underline">
                        <a href="https://kyle.so" target="_blank">
                            .kyle.so
                        </a>
                    </span>
                </h1>
                <p className="text-muted-foreground">
                    A minimal, open-source, self-hostable Bluesky client.
                </p>
                <motion.div
                    className="mt-8 flex w-full flex-col items-center justify-center gap-4 sm:flex-row"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut", delay: 0.25 }}
                >
                    <Button className="w-full" asChild>
                        <Link href="/sign-in">Get Started</Link>
                    </Button>
                </motion.div>
            </div>
        </div>
    );
}
