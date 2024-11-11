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

// Types
interface Author {
    handle: string;
    displayName: string;
    avatar: string;
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

interface EmbedImage {
    thumb: string;
    alt: string;
    aspectRatio?: number;
}

interface PostProps {
    post: any; // TODO: Replace with proper type
    showReply?: boolean;
}

// Subcomponents
const AuthorInfo = ({ author, timestamp }: { author: Author; timestamp: string }) => (
    <div className="flex items-center gap-2">
        <Link href={`/${author.handle}`}>
            <p className="text-sm font-semibold hover:underline">{author.displayName}</p>
        </Link>
        <Link href={`/${author.handle}`}>
            <p className="text-sm text-muted-foreground hover:underline">@{author.handle}</p>
        </Link>
        <div className="flex gap-2 items-center text-xs text-muted-foreground">
            <p>·</p>
            <time>{getPostAge(timestamp)}</time>
        </div>
    </div>
);

const Avatar = ({ author }: { author: Author }) => (
    <Link href={`/${author.handle}`}>
        <img
            src={author.avatar}
            alt={`${author.handle}'s avatar`}
            className="h-8 w-8 rounded-full hover:opacity-80 transition-opacity"
        />
    </Link>
);

const MediaGrid = ({ images }: { images: EmbedImage[] }) => (
    <div className={cn("grid gap-2 w-full", images.length > 1 ? "grid-cols-2" : "grid-cols-1")}>
        {images.map((image: EmbedImage, i: number) => (
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
);

const PostActions = ({ metadata }: { metadata: PostMetadata }) => (
    <CardFooter className="p-3 grid grid-cols-4 gap-6 w-full">
        <PostButtons
            type="like"
            count={metadata.likeCount || 0}
            active={!!metadata.viewer?.like}
            postUri={metadata.uri}
            postCid={metadata.cid}
        />
        <PostButtons
            type="repost"
            count={metadata.repostCount || 0}
            active={!!metadata.viewer?.repost}
            postUri={metadata.uri}
            postCid={metadata.cid}
        />
        <PostButtons
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

const QuotePost = ({ embed }: { embed: any }) => {
    if (!embed?.record?.author) {
        return <div className="text-sm text-muted-foreground">Post not available</div>;
    }

    return (
        <div className="border rounded-lg p-3 mt-2">
            <div className="flex items-center gap-2">
                <Link href={`/${embed.record.author.handle}`}>
                    <div className="flex items-center gap-2">
                        {embed.record.author.avatar && (
                            <img
                                src={embed.record.author.avatar}
                                alt={`${embed.record.author.handle}'s avatar`}
                                className="h-5 w-5 rounded-full"
                            />
                        )}
                        <span className="text-sm font-semibold hover:underline">
                            {embed.record.author.displayName}
                        </span>
                        <span className="text-sm text-muted-foreground">
                            @{embed.record.author.handle}
                        </span>
                    </div>
                </Link>
            </div>
            {embed.record.value?.text && (
                <p className="mt-2 text-sm whitespace-pre-wrap">
                    {renderRichText(embed.record.value.text)}
                </p>
            )}
        </div>
    );
};

const ReplyPost = ({ reply }: { reply: any }) => {
    // Check if we have all required data
    if (!reply?.parent?.author || !reply?.parent?.record?.text) {
        return null;
    }

    return (
        <div className="relative">
            <CardHeader className="p-3 space-y-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Avatar author={reply.parent.author} />
                        <div className="flex flex-col gap-0">
                            <AuthorInfo
                                author={reply.parent.author}
                                timestamp={reply.parent.indexedAt}
                            />
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-0 px-3 pb-3">
                <p className="text-start text-sm text-foreground whitespace-pre-wrap">
                    {renderRichText(reply.parent.record.text)}
                </p>
                {reply.parent.embed?.images?.length > 0 && (
                    <MediaGrid images={reply.parent.embed.images} />
                )}
            </CardContent>
            <PostActions
                metadata={{
                    uri: reply.parent.uri,
                    cid: reply.parent.cid,
                    likeCount: reply.parent.likeCount || 0,
                    repostCount: reply.parent.repostCount || 0,
                    replyCount: reply.parent.replyCount || 0,
                    indexedAt: reply.parent.indexedAt,
                    viewer: reply.parent.viewer
                }}
            />
        </div>
    );
};

// Main Component
export default function Post({ post, showReply = true }: PostProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <PostSkeleton />;
    }

    if (!post?.record?.text) {
        return null;
    }

    const hasImages = post.embed?.images?.length > 0;
    const isQuotePost = post.embed?.$type === "app.bsky.embed.record#view";
    const isReplyPost = showReply && post.reply?.parent;

    return (
        <Card className="bg-foreground/[2%] space-y-0 hover:bg-foreground/[3%] transition-all">
            {isReplyPost && <ReplyPost reply={post.reply} />}

            <CardHeader className="p-3 space-y-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Avatar author={post.author} />
                        <div className="flex flex-col gap-0">
                            <AuthorInfo author={post.author} timestamp={post.indexedAt} />
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-0 px-3 pb-3 space-y-2">
                <p className="text-start text-sm text-foreground whitespace-pre-wrap">
                    {renderRichText(post.record.text)}
                </p>

                {hasImages && <MediaGrid images={post.embed.images} />}
                {isQuotePost && <QuotePost embed={post.embed} />}
            </CardContent>

            <PostActions
                metadata={{
                    uri: post.uri,
                    cid: post.cid,
                    likeCount: post.likeCount || 0,
                    repostCount: post.repostCount || 0,
                    replyCount: post.replyCount || 0,
                    indexedAt: post.indexedAt,
                    viewer: post.viewer
                }}
            />
        </Card>
    );
}
