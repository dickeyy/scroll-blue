import BskyStats from "@/components/stats/bsky-stats";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Bluesky User Count | Live Statistics & Growth Tracker",
    description:
        "Track Bluesky's user growth in real-time. Live counter showing total users, growth rate per second, and historical data. Updated every minute with accurate statistics.",

    // OpenGraph metadata for social sharing
    openGraph: {
        title: "Bluesky User Count & Growth Statistics",
        description:
            "Live tracking of Bluesky's user base growth. See real-time user counts, growth rates, and statistics updated every minute.",
        type: "website",
        siteName: "Bluesky Stats Tracker",
        locale: "en_US",
        images: [
            {
                url: "/stats-og-image.png",
                width: 1200,
                height: 630,
                alt: "Bluesky Statistics Dashboard"
            }
        ]
    },

    // Twitter card metadata
    twitter: {
        card: "summary_large_image",
        title: "Bluesky User Count & Growth Statistics",
        description:
            "Track Bluesky's growth with our real-time user counter and statistics dashboard. Updated live.",
        images: ["/stats-og-image.png"],
        creator: "@kyledickeyy"
    },

    // Additional metadata
    keywords: [
        "Bluesky user count",
        "Bluesky statistics",
        "Bluesky users",
        "Bluesky growth",
        "Bluesky user tracker",
        "Bluesky social network stats",
        "real-time Bluesky stats",
        "Bluesky analytics",
        "Bluesky user base",
        "Bluesky growth rate"
    ],

    // Robots directives
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1
        }
    },

    // Additional metadata
    alternates: {
        canonical: "https://scroll.blue/stats"
    },

    // Other metadata
    category: "Technology",
    applicationName: "Bluesky Stats Tracker",
    referrer: "origin-when-cross-origin",
    authors: [{ name: "scroll.blue", url: "https://scroll.blue" }],
    creator: "Kyle Dickey",
    publisher: "scroll.blue",
    formatDetection: {
        email: false,
        address: false,
        telephone: false
    },

    // Viewport settings
    viewport: {
        width: "device-width",
        initialScale: 1,
        maximumScale: 1
    }
};

export default function StatsPage() {
    return (
        <div className="flex h-screen flex-col items-center justify-between">
            <BskyStats />
        </div>
    );
}
