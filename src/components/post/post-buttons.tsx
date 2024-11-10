/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { formatNumber } from "@/utils/number-format";
import { Heart, MessageSquare, Repeat } from "lucide-react";
import { useCallback } from "react";

interface PostButtonProps {
    type: "like" | "repost" | "reply";
    count: number;
    active?: boolean;
    postUri: string;
    postCid: string;
}

export default function PostButtons({ type, count, active, postUri, postCid }: PostButtonProps) {
    const countString = formatNumber(count);
    const agent = useAuthStore((state: any) => state.agent);

    const handleClick = useCallback(async () => {
        if (!agent) return;

        try {
            switch (type) {
                case "like":
                    if (active) {
                        await agent.deleteLike(postUri);
                    } else {
                        await agent.like(postUri, postCid);
                    }
                    break;
                case "repost":
                    if (active) {
                        await agent.deleteRepost(postUri);
                    } else {
                        await agent.repost(postUri, postCid);
                    }
                    break;
                case "reply":
                    // Handle reply in parent component
                    break;
            }
        } catch (error) {
            console.error(`Failed to ${type} post:`, error);
        }
    }, [agent, type, active, postUri, postCid]);

    return (
        <button
            onClick={handleClick}
            className={cn(
                "flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors",
                active && type === "like" && "text-red-500",
                active && type === "repost" && "text-green-500",
                !active && "text-muted-foreground"
            )}
        >
            {type === "like" && <Heart className="h-4 w-4" />}
            {type === "repost" && <Repeat className="h-4 w-4" />}
            {type === "reply" && <MessageSquare className="h-4 w-4" />}
            <p className="text-xs">{countString}</p>
        </button>
    );
}
