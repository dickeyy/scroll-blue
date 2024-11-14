/* eslint-disable @next/next/no-img-element */
import { cn } from "@/lib/utils";
import { EmbedVideo, VideoEmbed } from "./video-embed";

interface EmbedImage {
    thumb: string;
    alt: string;
    aspectRatio?: number;
}

interface EmbedAssets {
    images?: EmbedImage[];
    video?: EmbedVideo;
}

export default function MediaGrid({ media }: { media: EmbedAssets }) {
    return (
        <div
            className={cn(
                "grid gap-2 w-full",
                (media.images?.length || 0) > 1 ? "grid-cols-2" : "grid-cols-1"
            )}
        >
            {media.images?.map((image: EmbedImage, i: number) => (
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

            {media.video && <VideoEmbed video={media.video} />}
        </div>
    );
}
