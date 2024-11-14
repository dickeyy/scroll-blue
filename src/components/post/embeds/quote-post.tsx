/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import RichTextRenderer from "@/components/rich-text-renderer";
import { genRichText, parseRichText, Segment } from "@/utils/text-processor";
import { useEffect, useState } from "react";
import AuthorInfo from "../author-info";
import MediaGrid from "./media-grid";
import { EmbedVideo, VideoEmbed } from "./video-embed";

export default function QuotePost({ post }: { post: any }) {
    const [textSegments, setTextSegments] = useState<Segment[]>([]);
    const [images, setImages] = useState([]);
    const [video, setVideo] = useState<EmbedVideo | null>(null);

    useEffect(() => {
        async function processText() {
            if (post?.record?.value.text) {
                setTextSegments(await parseRichText(genRichText(post.record.value.text)));
            }
        }

        if (post.record.embeds && post.record.embeds.length > 0) {
            post.record.embeds.forEach((embed: any) => {
                if (embed.$type === "app.bsky.embed.images#view") {
                    setImages(embed.images);
                } else if (embed.$type === "app.bsky.embed.video#view") {
                    setVideo(embed);
                }
            });
        }

        processText();
    }, [post]);

    if (!post?.record?.author) {
        return <div className="text-sm text-muted-foreground">Post not available</div>;
    }

    return (
        <div className="border rounded-lg p-3 mt-2 hover:bg-foreground/[2%] transition-colors">
            <AuthorInfo author={post.record.author} timestamp={post.record.indexedAt} />
            {post.record.value?.text && (
                <RichTextRenderer
                    className="mt-2 text-sm whitespace-pre-wrap"
                    segments={textSegments}
                />
            )}
            {images.length > 0 && <MediaGrid images={images} />}
            {video && <VideoEmbed video={video} />}
        </div>
    );
}
