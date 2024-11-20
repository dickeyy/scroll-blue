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
import LinkEmbed, { LinkEmbedType } from "./embeds/link-embed";
import MediaGrid from "./embeds/media-grid";
import QuotePost from "./embeds/quote-post";
import ReplyPost from "./embeds/reply-post";
import { EmbedVideo } from "./embeds/video-embed";

// Types

interface PostProps {
    post: any; // TODO: Replace with proper type
    showReply?: boolean;
}

export default function Post({ post, showReply = true }: PostProps) {
    const [mounted, setMounted] = useState(false);
    const [textSegments, setTextSegments] = useState<Segment[]>([]);
    const [images, setImages] = useState([]);
    const [video, setVideo] = useState<EmbedVideo>();
    const [linkEmbed, setLinkEmbed] = useState<LinkEmbedType>();

    const mediaCount = images.length + (video ? 1 : 0);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        async function processText() {
            if (post.record.text) {
                setTextSegments(await parseRichText(genRichText(post.record.text)));
            }
        }

        if (post.embed) {
            const type = post.embed.$type;
            if (type === "app.bsky.embed.images#view") {
                setImages(post.embed.images);
            }
            if (type === "app.bsky.embed.video#view") {
                setVideo(post.embed);
            }
            if (type === "app.bsky.embed.external#view") {
                setLinkEmbed(post.embed.external);
            }
        }

        processText();
    }, [post]);

    if (!mounted) {
        return <PostSkeleton />;
    }

    if (!post?.record?.text) {
        return null;
    }

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
                    className="text-start text-sm text-foreground whitespace-pre-wrap mb-2"
                    segments={textSegments}
                />

                {mediaCount > 0 && (
                    <MediaGrid
                        media={{
                            images: images,
                            video: video
                        }}
                    />
                )}
                {linkEmbed && <LinkEmbed embed={linkEmbed} />}
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
