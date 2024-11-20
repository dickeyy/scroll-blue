import { MediaPlayer, MediaProvider, Poster } from "@vidstack/react";
import { defaultLayoutIcons, DefaultVideoLayout } from "@vidstack/react/player/layouts/default";
import "@vidstack/react/player/styles/default/layouts/video.css";
import "@vidstack/react/player/styles/default/theme.css";
import { memo } from "react";

export interface EmbedVideo {
    $type: string;
    aspectRatio: {
        height: number;
        width: number;
    };
    cid: string;
    playlist: string;
    thumbnail?: string;
    alt?: string;
}

export const VideoEmbed = memo(function VideoEmbed({ video }: { video: EmbedVideo }) {
    return (
        <div className="aspect-video mt-2 rounded-md hover:brightness-90 hover:cursor-pointer overflow-hidden border border-border">
            <MediaPlayer
                crossOrigin
                playsInline
                viewType="video"
                className="w-full h-full object-cover"
                src={video.playlist}
                poster={video.thumbnail ?? ""}
            >
                <MediaProvider>
                    {video.alt && (
                        <Poster
                            src={video.thumbnail}
                            alt={video.alt}
                            className="absolute inset-0 block bg-skin-overlay opacity-0 transition-opacity data-[visible]:opacity-100 [&>img]:w-full [&>img]:object-contain"
                        />
                    )}
                </MediaProvider>
                <DefaultVideoLayout thumbnails={video.thumbnail} icons={defaultLayoutIcons} />
            </MediaPlayer>
        </div>
    );
});
