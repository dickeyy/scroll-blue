"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

const comingSoon = true;

export default function HomeHero() {
    return (
        <div className="flex w-full max-w-[30rem] flex-col items-center justify-center flex-1 px-4 text-center gap-4">
            {comingSoon && (
                <motion.div
                    className="mt-8 flex w-full flex-col items-center justify-center gap-4 sm:flex-row mb-1"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut", delay: 0.75 }}
                >
                    <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/10">
                        Coming Soon
                    </Badge>
                </motion.div>
            )}
            <h1 className="flex items-baseline justify-center text-center font-serif text-4xl font-extrabold gap-1">
                scroll <span className="text-foreground/30 text-[18px]">.</span>{" "}
                <span className="text-blue-500 text-[18px] italic">blue</span>
            </h1>
            <motion.p
                className="text-muted-foreground text-sm"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut", delay: 0.25 }}
            >
                A minimal and open-source{" "}
                <span className="hover:text-blue-500 transition-colors underline">
                    <a href="https://atproto.com" target="_blank">
                        ATProtocol
                    </a>
                </span>{" "}
                web client.
            </motion.p>

            {!comingSoon ? (
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
            ) : (
                <motion.div
                    className="mt-8 flex w-full flex-col items-center justify-center gap-4 sm:flex-row"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut", delay: 0.75 }}
                >
                    <Button className="w-full" variant="secondary" asChild>
                        <Link target="_blank" href="https://bsky.app/profile/kyle.so">
                            Get Updates
                        </Link>
                    </Button>
                </motion.div>
            )}
        </div>
    );
}
