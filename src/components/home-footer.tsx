"use client";

import Link from "next/link";
import BlueskyIcon from "../../public/icons/bluesky.svg";
import GitHubIcon from "../../public/icons/github.svg";

export default function HomeFooter() {
    return (
        <footer className="flex w-full items-center justify-between gap-4 px-4 py-4 sm:px-8">
            <p className="text-foreground/60 text-xs font-normal">
                ©{" "}
                <span className="font-serif italic text-[0.8rem]">{new Date().getFullYear()} </span>
                <Link
                    href="https://kyle.so"
                    target="_blank"
                    className="hover:text-foreground transition-colors duration-150 hover:underline"
                >
                    Kyle Dickey
                </Link>
            </p>
            <div className="flex flex-row items-center gap-4">
                <Link href="https://bsky.app/profile/scroll.blue" target="_blank">
                    <BlueskyIcon className="fill-foreground/60 hover:fill-foreground h-4 w-4 transition-colors duration-150" />
                </Link>
                <Link href="https://github.com/dickeyy/scroll-blue" target="_blank">
                    <GitHubIcon className="fill-foreground/60 hover:fill-foreground h-4 w-4 transition-colors duration-150" />
                </Link>
            </div>
        </footer>
    );
}
