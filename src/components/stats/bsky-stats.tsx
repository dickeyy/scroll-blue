"use client";

import AnimatedCounter from "@/components/stats/number";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import ErrorCard from "../error-card";
import { Skeleton } from "../ui/skeleton";

// Configuration constants
const CONFIG = {
    POLL_INTERVAL: 60000,
    ERROR_RETRY: 5000,
    JITTER: Math.random() * 10,
    API_ENDPOINT: "https://bsky-stats.scroll.blue"
} as const;

// Type definitions
type DataSnapshot = {
    timestamp: number;
    users: number;
    nextUpdate: number;
    growth: number;
};

type UIState = {
    dataSnapshot: DataSnapshot | null;
    interpolation: number;
    updateProgress: number;
    loading: boolean;
    error: boolean;
};

// Custom hook for data fetching and management
const useStatsManager = () => {
    const [uiState, setUiState] = useState<UIState>({
        dataSnapshot: null,
        interpolation: 0,
        updateProgress: 0,
        loading: true,
        error: false
    });
    const [creditsVisible, setCreditsVisible] = useState(true);

    const fetchStats = useCallback(async () => {
        try {
            const response = await fetch(CONFIG.API_ENDPOINT);
            if (!response.ok) throw new Error("Failed to fetch stats");

            const rawData = await response.json();
            const now = Date.now();
            const nextUpdateTime = Date.parse(rawData.next_update_time);

            setUiState((prev) => ({
                ...prev,
                dataSnapshot: {
                    timestamp: nextUpdateTime - (60 - CONFIG.JITTER) * 1000,
                    users: rawData.total_users,
                    nextUpdate: nextUpdateTime + CONFIG.JITTER * 1000,
                    growth: rawData.users_growth_rate_per_second
                },
                loading: false,
                error: false
            }));

            return Math.max(1, Math.floor((nextUpdateTime - now) / 1000) + CONFIG.JITTER);
        } catch (err) {
            console.error("Stats fetch failed:", err);
            setUiState((prev) => ({ ...prev, error: true, loading: false }));
            return null;
        }
    }, []);

    // Data polling setup
    useEffect(() => {
        let timeoutRef: NodeJS.Timeout;

        const pollData = async () => {
            const nextPoll = await fetchStats();
            timeoutRef = setTimeout(pollData, nextPoll ? nextPoll * 1000 : CONFIG.ERROR_RETRY);
        };

        pollData();
        return () => clearTimeout(timeoutRef);
    }, [fetchStats]);

    // Interpolation effect
    useEffect(() => {
        if (!uiState.dataSnapshot) return;

        const interpolationTimer = setInterval(() => {
            const currentTime = Date.now();
            const { timestamp, nextUpdate, users, growth } = uiState.dataSnapshot as DataSnapshot;

            const elapsedTime = currentTime - timestamp;
            const updateInterval = nextUpdate - timestamp;
            const progressPercent = Math.min((elapsedTime / updateInterval) * 100, 150);

            const estimatedGrowth = (growth * progressPercent) / 100;

            setUiState((prev) => ({
                ...prev,
                interpolation: Math.round(users + estimatedGrowth),
                updateProgress: progressPercent
            }));
        }, 100);

        return () => clearInterval(interpolationTimer);
    }, [uiState.dataSnapshot]);

    return {
        stats: uiState.dataSnapshot,
        interpolatedCount: uiState.interpolation,
        progress: uiState.updateProgress,
        isLoading: uiState.loading,
        isError: uiState.error,
        creditsVisible,
        setCreditsVisible
    };
};

export default function BskyStats() {
    const { stats, progress, isLoading, isError, creditsVisible, setCreditsVisible } =
        useStatsManager();

    return (
        <div className="flex h-full flex-col items-center justify-center">
            {isError ? (
                <ErrorCard
                    error={{
                        message: "Error fetching stats"
                    }}
                />
            ) : (
                <div className="flex flex-col space-y-4 items-start justify-center">
                    <div className="flex items-center justify-between w-full">
                        <p className="text-xs text-muted-foreground/40 font-mono">
                            Updating in{" "}
                            {Math.ceil(
                                (CONFIG.POLL_INTERVAL - (progress / 100) * CONFIG.POLL_INTERVAL) /
                                    1000
                            )}
                            s
                        </p>
                        <button
                            className="text-muted-foreground/40 hover:text-foreground transition-colors duration-150 hover:underline text-xs"
                            onClick={() => setCreditsVisible(!creditsVisible)}
                        >
                            {creditsVisible ? "Hide Credits" : "Show Credits"}
                        </button>
                    </div>
                    {isLoading ? (
                        <Skeleton className="w-80 h-20" />
                    ) : (
                        <AnimatedCounter
                            value={Math.floor(
                                (stats?.users || 0) + (stats?.growth || 0) * 55 * (progress / 100)
                            )}
                            includeCommas={true}
                            includeDecimals={false}
                            className="text-foreground tabular-nums text-6xl font-bold font-mono"
                            showColorsWhenValueChanges={false}
                        />
                    )}
                    <div className="flex items-center justify-between w-full">
                        <p className="text-sm text-muted-foreground">users on Bluesky</p>
                        <p className="text-xs text-muted-foreground/40 font-mono">
                            {(stats?.growth || 0).toFixed(2)}/sec
                        </p>
                    </div>
                </div>
            )}

            {creditsVisible && (
                <div className="flex w-full flex-col items-center justify-center text-center mt-8 absolute bottom-[20%] space-y-1">
                    <p className="text-muted-foreground/60 text-xs">
                        Data sourced from{" "}
                        <Link
                            href="https://bsky.app/profile/jaz.bsky.social"
                            className="hover:underline text-blue-500"
                            target="_blank"
                            rel="noreferrer"
                        >
                            @jaz.bsky.social
                        </Link>
                        &apos;s{" "}
                        <Link
                            href="https://bsky.jazco.dev/stats"
                            className="hover:underline text-blue-500"
                            target="_blank"
                            rel="noreferrer"
                        >
                            bsky stats
                        </Link>
                        .
                    </p>
                    <p className="text-muted-foreground/60 text-xs">
                        Number component from{" "}
                        <Link
                            href="https://bsky.app/profile/natalie.sh"
                            className="hover:underline text-blue-500"
                            target="_blank"
                            rel="noreferrer"
                        >
                            @natalie.sh
                        </Link>
                        .
                    </p>
                    <p className="text-muted-foreground/60 text-xs">
                        Built by{" "}
                        <Link
                            href="https://bsky.app/profile/kyle.so"
                            className="hover:underline text-blue-500"
                            target="_blank"
                            rel="noreferrer"
                        >
                            @kyle.so
                        </Link>{" "}
                        for{" "}
                        <Link href="/" className="hover:underline text-blue-500" rel="noreferrer">
                            scroll.blue
                        </Link>
                    </p>
                </div>
            )}
        </div>
    );
}
