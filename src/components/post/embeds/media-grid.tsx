/* eslint-disable @next/next/no-img-element */
"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { EmbedVideo, VideoEmbed } from "./video-embed";

interface EmbedImage {
    thumb: string;
    alt?: string;
    aspectRatio?: number;
}

interface EmbedAssets {
    images?: EmbedImage[];
    video?: EmbedVideo;
}

export default function MediaGrid({ media }: { media: EmbedAssets }) {
    const [selectedAltText, setSelectedAltText] = useState<string | undefined>();
    const [altDialogOpen, setAltDialogOpen] = useState(false);

    const handleAltClick = (alt: string | undefined) => {
        if (alt) {
            setSelectedAltText(alt);
            setAltDialogOpen(true);
        }
    };

    return (
        <div
            className={cn(
                "grid gap-2 w-full",
                (media.images?.length || 0) > 1 ? "grid-cols-2" : "grid-cols-1"
            )}
        >
            {media.images?.map((image: EmbedImage, i: number) => (
                <div key={i} className="relative">
                    <img
                        src={image.thumb}
                        alt={image.alt}
                        className="rounded-lg w-full h-full object-cover"
                        style={{
                            aspectRatio: image.aspectRatio?.toString() ?? "1"
                        }}
                    />
                    {image.alt && (
                        <Button
                            size="sm"
                            variant="outline"
                            className="absolute bottom-1 left-1 py-1 h-fit text-[0.65rem] px-2"
                            onClick={() => handleAltClick(image.alt)}
                        >
                            ALT
                        </Button>
                    )}
                </div>
            ))}

            {media.video && <VideoEmbed video={media.video} />}

            <AltDialog
                text={selectedAltText}
                open={altDialogOpen}
                onClose={() => setAltDialogOpen(false)}
            />
        </div>
    );
}

function AltDialog({ text, onClose, open }: { text?: string; onClose: () => void; open: boolean }) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="space-y-2">
                <DialogHeader>
                    <DialogTitle className="text-lg">Image Description</DialogTitle>
                    <DialogDescription>{text || "No alt text available"}</DialogDescription>
                </DialogHeader>
                <DialogFooter className="w-full">
                    <Button variant="outline" className="w-full" onClick={onClose}>
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
