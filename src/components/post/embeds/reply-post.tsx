/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import RichTextRenderer from "@/components/rich-text-renderer";
import { CardContent, CardHeader } from "@/components/ui/card";
import { genRichText, parseRichText, Segment } from "@/utils/text-processor";
import { useEffect, useState } from "react";
import AuthorInfo from "../author-info";
import PostActions from "../post-actions";
import MediaGrid from "./media-grid";
import { EmbedVideo } from "./video-embed";

export default function ReplyPost({ reply }: { reply: any }) {
    const [textSegments, setTextSegments] = useState<Segment[]>([]);
    const [images, setImages] = useState([]);
    const [video, setVideo] = useState<EmbedVideo>();

    const mediaCount = images.length + (video ? 1 : 0);

    useEffect(() => {
        async function processText() {
            if (reply?.parent?.record?.text) {
                setTextSegments(await parseRichText(genRichText(reply.parent.record.text)));
            }
        }

        if (reply.parent.embed) {
            const type = reply.parent.embed.$type;
            if (type === "app.bsky.embed.images#view") {
                setImages(reply.parent.embed.images);
            }
            if (type === "app.bsky.embed.video#view") {
                setVideo(reply.parent.embed);
            }
        }

        processText();
    }, [reply.parent]);

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
                {mediaCount > 0 && (
                    <MediaGrid
                        media={{
                            images,
                            video
                        }}
                    />
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
}
