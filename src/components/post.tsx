/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { formatNumber } from "@/utils/number-format";
import { getPostAge } from "@/utils/time";
import { Ellipsis, Heart, MessageSquare, Repeat } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

interface PostProps {
    post: any;
    showReply?: boolean;
}

export default function Post({ post, showReply = true }: PostProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <PostSkeleton />;
    }

    const hasImages = post.embed?.images?.length > 0;
    const isQuotePost = post.embed?.$type === "app.bsky.embed.record#view";
    const isReplyPost = showReply && post.reply;

    return (
        <Card className="bg-foreground/[2%] space-y-0 hover:bg-muted/50 transition-colors">
            {isReplyPost && post.reply?.parent && (
                <>
                    {/* Parent Post */}
                    <div className="relative">
                        <CardHeader className="p-3 space-y-0">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Link href={`/profile/${post.reply.parent.author.handle}`}>
                                        <img
                                            src={post.reply.parent.author.avatar}
                                            alt={`${post.reply.parent.author.handle}'s avatar`}
                                            className="h-8 w-8 rounded-full hover:opacity-80 transition-opacity"
                                        />
                                    </Link>
                                    <div className="flex flex-col gap-0">
                                        <div className="flex items-center gap-2">
                                            <Link
                                                href={`/profile/${post.reply.parent.author.handle}`}
                                            >
                                                <p className="text-sm font-semibold hover:underline">
                                                    {post.reply.parent.author.displayName}
                                                </p>
                                            </Link>
                                            <Link
                                                href={`/profile/${post.reply.parent.author.handle}`}
                                            >
                                                <p className="text-sm text-muted-foreground hover:underline">
                                                    @{post.reply.parent.author.handle}
                                                </p>
                                            </Link>
                                            <div className="flex gap-2 items-center text-xs text-muted-foreground">
                                                <p>·</p>
                                                <time>
                                                    {getPostAge(post.reply.parent.indexedAt)}
                                                </time>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-0 px-3 pb-3">
                            <p className="text-start text-sm text-foreground whitespace-pre-wrap">
                                {post.reply.parent.record.text}
                            </p>
                            {hasImages && (
                                <div
                                    className={cn(
                                        "grid gap-2 w-full",
                                        post.embed.images.length > 1 ? "grid-cols-2" : "grid-cols-1"
                                    )}
                                >
                                    {post.embed.images.map((image: any, i: number) => (
                                        <img
                                            key={i}
                                            src={image.thumb}
                                            alt={image.alt}
                                            className="rounded-lg w-full h-full object-cover"
                                            style={{
                                                aspectRatio: image.aspectRatio?.toString() ?? "1"
                                            }}
                                        />
                                    ))}
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="p-3 grid grid-cols-4 gap-6 w-full">
                            <PostButton
                                type="like"
                                count={post.reply.parent.likeCount || 0}
                                active={!!post.reply.parent.viewer?.like}
                                postUri={post.reply.parent.uri}
                                postCid={post.reply.parent.cid}
                            />
                            <PostButton
                                type="repost"
                                count={post.reply.parent.repostCount || 0}
                                active={!!post.reply.parent.viewer?.repost}
                                postUri={post.reply.parent.uri}
                                postCid={post.reply.parent.cid}
                            />
                            <PostButton
                                type="reply"
                                count={post.reply.parent.replyCount || 0}
                                postUri={post.reply.parent.uri}
                                postCid={post.reply.parent.cid}
                            />
                            <div className="flex items-center gap-2 p-2">
                                <Ellipsis className="h-4 w-4" />
                            </div>
                        </CardFooter>
                    </div>
                </>
            )}

            {/* Reply or Main Post */}
            <CardHeader className="p-3 space-y-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={`/profile/${post.author.handle}`}>
                            <img
                                src={post.author.avatar}
                                alt={`${post.author.handle}'s avatar`}
                                className="h-8 w-8 rounded-full hover:opacity-80 transition-opacity"
                            />
                        </Link>
                        <div className="flex flex-col gap-0">
                            <div className="flex items-center gap-2">
                                <Link href={`/profile/${post.author.handle}`}>
                                    <p className="text-sm font-semibold hover:underline">
                                        {post.author.displayName}
                                    </p>
                                </Link>
                                <Link href={`/profile/${post.author.handle}`}>
                                    <p className="text-sm text-muted-foreground hover:underline">
                                        @{post.author.handle}
                                    </p>
                                </Link>
                                <div className="flex gap-2 items-center text-xs text-muted-foreground">
                                    <p>·</p>
                                    <time>{getPostAge(post.indexedAt)}</time>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-0 px-3 pb-3 space-y-2">
                <p className="text-start text-sm text-foreground whitespace-pre-wrap">
                    {post.record.text}
                </p>

                {hasImages && (
                    <div
                        className={cn(
                            "grid gap-2 w-full",
                            post.embed.images.length > 1 ? "grid-cols-2" : "grid-cols-1"
                        )}
                    >
                        {post.embed.images.map((image: any, i: number) => (
                            <img
                                key={i}
                                src={image.thumb}
                                alt={image.alt}
                                className="rounded-lg w-full h-full object-cover"
                                style={{
                                    aspectRatio: image.aspectRatio?.toString() ?? "1"
                                }}
                            />
                        ))}
                    </div>
                )}

                {isQuotePost && post.embed?.record && (
                    <div className="border rounded-lg p-3 mt-2">
                        <div className="flex items-center gap-2">
                            {post.embed.record.author ? (
                                <Link href={`/profile/${post.embed.record.author.handle}`}>
                                    <div className="flex items-center gap-2">
                                        {post.embed.record.author.avatar && (
                                            <img
                                                src={post.embed.record.author.avatar}
                                                alt={`${post.embed.record.author.handle}'s avatar`}
                                                className="h-5 w-5 rounded-full"
                                            />
                                        )}
                                        <span className="text-sm font-semibold hover:underline">
                                            {post.embed.record.author.displayName}
                                        </span>
                                        <span className="text-sm text-muted-foreground">
                                            @{post.embed.record.author.handle}
                                        </span>
                                    </div>
                                </Link>
                            ) : (
                                <div className="text-sm text-muted-foreground">
                                    Post not available
                                </div>
                            )}
                        </div>
                        {post.embed.record.value?.text && (
                            <p className="mt-2 text-sm whitespace-pre-wrap">
                                {post.embed.record.value.text}
                            </p>
                        )}
                    </div>
                )}
            </CardContent>

            <CardFooter className="p-3 grid grid-cols-4 gap-6 w-full">
                <PostButton
                    type="like"
                    count={post.likeCount || 0}
                    active={!!post.viewer?.like}
                    postUri={post.uri}
                    postCid={post.cid}
                />
                <PostButton
                    type="repost"
                    count={post.repostCount || 0}
                    active={!!post.viewer?.repost}
                    postUri={post.uri}
                    postCid={post.cid}
                />
                <PostButton
                    type="reply"
                    count={post.replyCount || 0}
                    postUri={post.uri}
                    postCid={post.cid}
                />
                <div className="flex items-center gap-2 p-2">
                    <Ellipsis className="h-4 w-4" />
                </div>
            </CardFooter>
        </Card>
    );
}

interface PostButtonProps {
    type: "like" | "repost" | "reply";
    count: number;
    active?: boolean;
    postUri: string;
    postCid: string;
}

function PostButton({ type, count, active, postUri, postCid }: PostButtonProps) {
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

export function PostSkeleton() {
    return (
        <Card className="bg-foreground/[2%] space-y-0 gap-0">
            <CardHeader className="p-3 space-y-0 my-0 flex flex-row justify-between">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="flex flex-row gap-2 items-center justify-center">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                </div>
                <div className="flex gap-2 items-center">
                    <div className="text-xs text-muted-foreground">
                        <Skeleton className="h-4 w-14" />
                    </div>
                    <div className="text-xs text-muted-foreground">
                        <Skeleton className="h-4 w-14" />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-0 px-3 pb-3">
                <Skeleton className="h-20 w-full" />
            </CardContent>
            <CardFooter className="p-3 grid grid-cols-4 gap-6 w-full">
                <div className="flex items-center gap-2 p-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-8" />
                </div>
                <div className="flex items-center gap-2 p-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-8" />
                </div>
                <div className="flex items-center gap-2 p-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-8" />
                </div>
                <div className="flex items-center gap-2 p-2">
                    <Skeleton className="h-4 w-4" />
                </div>
            </CardFooter>
        </Card>
    );
}
