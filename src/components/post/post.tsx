/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import PostActions from "@/components/post/post-actions";
import PostSkeleton from "@/components/post/post-skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { genRichText, parseRichText, Segment } from "@/utils/text-processor";
import "@vidstack/react/player/styles/default/layouts/video.css";
import "@vidstack/react/player/styles/default/theme.css";
import { useEffect, useState } from "react";
import RichTextRenderer from "../rich-text-renderer";
import AuthorInfo from "./author-info";
import MediaGrid from "./embeds/media-grid";
import QuotePost from "./embeds/quote-post";
import { VideoEmbed } from "./embeds/video-embed";

// Types

interface PostProps {
    post: any; // TODO: Replace with proper type
    showReply?: boolean;
}

// Subcomponents

const ReplyPost = ({ reply }: { reply: any }) => {
    const [textSegments, setTextSegments] = useState<Segment[]>([]);

    useEffect(() => {
        async function processText() {
            if (reply?.parent?.record?.text) {
                setTextSegments(await parseRichText(genRichText(reply.parent.record.text)));
            }
        }
        processText();
    }, [reply.parent.record]);

    // Check if we have all required data
    if (!reply?.parent?.author || !reply?.parent?.record?.text) {
        return null;
    }

    return (
        <div className="relative">
            <CardHeader className="p-3 space-y-0">
                <AuthorInfo author={reply.parent.author} timestamp={reply.parent.indexedAt} />
            </CardHeader>
            <CardContent className="pt-0 px-3 pb-3">
                <RichTextRenderer
                    className="text-start text-sm text-foreground whitespace-pre-wrap"
                    segments={textSegments}
                />
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
    const [textSegments, setTextSegments] = useState<Segment[]>([]);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        async function processText() {
            if (post.record.text) {
                setTextSegments(await parseRichText(genRichText(post.record.text)));
            }
        }
        processText();
    }, [post.record.text]);

    if (!mounted) {
        return <PostSkeleton />;
    }

    if (!post?.record?.text) {
        return null;
    }

    const hasImages = post.embed?.images?.length > 0;
    const hasVideo = post.embed?.$type == "app.bsky.embed.video#view";
    const isQuotePost = post.embed?.$type === "app.bsky.embed.record#view";
    const isReplyPost = showReply && post.reply?.parent;

    return (
        <Card className="bg-foreground/[2%] space-y-0 hover:bg-foreground/[3%] transition-all">
            {isReplyPost && <ReplyPost reply={post.reply} />}

            <CardHeader className="p-3 space-y-0">
                <AuthorInfo author={post.author} timestamp={post.indexedAt} />
            </CardHeader>

            <CardContent className="pt-0 px-3 pb-3 space-y-2">
                <RichTextRenderer
                    className="text-start text-sm text-foreground whitespace-pre-wrap"
                    segments={textSegments}
                />

                {hasImages && <MediaGrid images={post.embed.images} />}
                {hasVideo && <VideoEmbed video={post.embed} />}
                {isQuotePost && <QuotePost post={post.embed} />}
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
