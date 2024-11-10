/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import PostButtons from "@/components/post/post-buttons";
import PostSkeleton from "@/components/post/post-skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { renderRichText } from "@/utils/parse-text";
import { getPostAge } from "@/utils/time";
import { Ellipsis } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

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
        <Link href={`/post/${post.cid}`}>
            <Card className="bg-foreground/[2%] space-y-0 hover:bg-foreground/[3%] transition-all">
                {isReplyPost && post.reply?.parent && (
                    <>
                        <div className="relative">
                            <CardHeader className="p-3 space-y-0">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <Link href={`/${post.reply.parent.author.handle}`}>
                                            <img
                                                src={post.reply.parent.author.avatar}
                                                alt={`${post.reply.parent.author.handle}'s avatar`}
                                                className="h-8 w-8 rounded-full hover:opacity-80 transition-opacity"
                                            />
                                        </Link>
                                        <div className="flex flex-col gap-0">
                                            <div className="flex items-center gap-2">
                                                <Link href={`/${post.reply.parent.author.handle}`}>
                                                    <p className="text-sm font-semibold hover:underline">
                                                        {post.reply.parent.author.displayName}
                                                    </p>
                                                </Link>
                                                <Link href={`/${post.reply.parent.author.handle}`}>
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
                                    {renderRichText(post.reply.parent.record.text)}
                                </p>
                                {hasImages && (
                                    <div
                                        className={cn(
                                            "grid gap-2 w-full",
                                            post.embed.images.length > 1
                                                ? "grid-cols-2"
                                                : "grid-cols-1"
                                        )}
                                    >
                                        {post.embed.images.map((image: any, i: number) => (
                                            <img
                                                key={i}
                                                src={image.thumb}
                                                alt={image.alt}
                                                className="rounded-lg w-full h-full object-cover"
                                                style={{
                                                    aspectRatio:
                                                        image.aspectRatio?.toString() ?? "1"
                                                }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter className="p-3 grid grid-cols-4 gap-6 w-full">
                                <PostButtons
                                    type="like"
                                    count={post.reply.parent.likeCount || 0}
                                    active={!!post.reply.parent.viewer?.like}
                                    postUri={post.reply.parent.uri}
                                    postCid={post.reply.parent.cid}
                                />
                                <PostButtons
                                    type="repost"
                                    count={post.reply.parent.repostCount || 0}
                                    active={!!post.reply.parent.viewer?.repost}
                                    postUri={post.reply.parent.uri}
                                    postCid={post.reply.parent.cid}
                                />
                                <PostButtons
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

                <CardHeader className="p-3 space-y-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href={`/${post.author.handle}`}>
                                <img
                                    src={post.author.avatar}
                                    alt={`${post.author.handle}'s avatar`}
                                    className="h-8 w-8 rounded-full hover:opacity-80 transition-opacity"
                                />
                            </Link>
                            <div className="flex flex-col gap-0">
                                <div className="flex items-center gap-2">
                                    <Link href={`/${post.author.handle}`}>
                                        <p className="text-sm font-semibold hover:underline">
                                            {post.author.displayName}
                                        </p>
                                    </Link>
                                    <Link href={`/${post.author.handle}`}>
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
                        {renderRichText(post.record.text)}
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
                                    <Link href={`/${post.embed.record.author.handle}`}>
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
                                    {renderRichText(post.embed.record.value.text)}
                                </p>
                            )}
                        </div>
                    )}
                </CardContent>

                <CardFooter className="p-3 grid grid-cols-4 gap-6 w-full">
                    <PostButtons
                        type="like"
                        count={post.likeCount || 0}
                        active={!!post.viewer?.like}
                        postUri={post.uri}
                        postCid={post.cid}
                    />
                    <PostButtons
                        type="repost"
                        count={post.repostCount || 0}
                        active={!!post.viewer?.repost}
                        postUri={post.uri}
                        postCid={post.cid}
                    />
                    <PostButtons
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
        </Link>
    );
}
