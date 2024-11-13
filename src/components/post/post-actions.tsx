/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { formatNumber } from "@/utils/number-format";
import { Ellipsis, Heart, MessageSquare, Repeat } from "lucide-react";
import { Button } from "../ui/button";
import { CardFooter } from "../ui/card";

interface PostButtonProps {
    type: "like" | "repost" | "reply";
    count: number;
    active?: boolean;
    postUri: string;
    postCid: string;
}

interface PostMetadata {
    uri: string;
    cid: string;
    likeCount: number;
    repostCount: number;
    replyCount: number;
    indexedAt: string;
    viewer?: {
        like?: boolean;
        repost?: boolean;
    };
}

export default function PostActions({ metadata }: { metadata: PostMetadata }) {
    return (
        <CardFooter className="p-3 grid grid-cols-4 gap-6 w-full">
            <PostButton
                type="like"
                count={metadata.likeCount || 0}
                active={!!metadata.viewer?.like}
                postUri={metadata.uri}
                postCid={metadata.cid}
            />
            <PostButton
                type="repost"
                count={metadata.repostCount || 0}
                active={!!metadata.viewer?.repost}
                postUri={metadata.uri}
                postCid={metadata.cid}
            />
            <PostButton
                type="reply"
                count={metadata.replyCount || 0}
                postUri={metadata.uri}
                postCid={metadata.cid}
            />
            <div className="flex items-center gap-2 p-2">
                <Ellipsis className="h-4 w-4" />
            </div>
        </CardFooter>
    );
}

function PostButton({ type, count, active, postUri, postCid }: PostButtonProps) {
    const countString = formatNumber(count);

    return (
        <Button size="sm" variant="ghost" className="w-fit text-muted-foreground">
            {type === "like" && (
                <Heart className={`h-4 w-4 ${active && "fill-red-500 text-red-500"}`} />
            )}
            {type === "repost" && <Repeat className={`h-4 w-4 ${active && "text-green-500"}`} />}
            {type === "reply" && <MessageSquare className="h-4 w-4" />}
            <p className="text-xs">{countString}</p>
        </Button>
    );
}
