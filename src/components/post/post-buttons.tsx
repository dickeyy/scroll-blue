/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { cn } from "@/lib/utils";
import { formatNumber } from "@/utils/number-format";
import { Heart, MessageSquare, Repeat } from "lucide-react";

interface PostButtonProps {
    type: "like" | "repost" | "reply";
    count: number;
    active?: boolean;
    postUri: string;
    postCid: string;
}

export default function PostButtons({ type, count, active, postUri, postCid }: PostButtonProps) {
    const countString = formatNumber(count);

    return (
        <button
            // onClick=
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
