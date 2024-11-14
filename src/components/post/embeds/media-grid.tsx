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

function ImageDialog({ image, onClose }: { image: EmbedImage | null; onClose: () => void }) {
    return (
        <Dialog open={!!image} onOpenChange={onClose}>
            <DialogContent className="max-w-[100vw] h-screen bg-background rounded-none">
                <DialogHeader className="bg-background px-4 py-1 rounded-md w-fit h-fit">
                    <DialogTitle className="text-lg">Image</DialogTitle>
                    <DialogDescription className="text-sm">
                        {image?.alt || "No alt text available"}
                    </DialogDescription>
                </DialogHeader>

                <div className="relative w-full py-4">
                    {image && (
                        <div className="flex items-center justify-center">
                            <img
                                src={image.thumb}
                                alt={image.alt}
                                className="rounded-md max-w-[100%] max-h-[80vh] w-full h-full object-contain"
                            />
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
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

export default function MediaGrid({ media }: { media: EmbedAssets }) {
    const [selectedAltText, setSelectedAltText] = useState<string | undefined>();
    const [altDialogOpen, setAltDialogOpen] = useState(false);
    const [fullscreenImage, setFullscreenImage] = useState<EmbedImage | null>(null);

    const handleAltClick = (e: React.MouseEvent, alt: string | undefined) => {
        e.stopPropagation(); // Prevent image fullscreen when clicking ALT button
        if (alt) {
            setSelectedAltText(alt);
            setAltDialogOpen(true);
        }
    };

    const handleImageClick = (image: EmbedImage) => {
        setFullscreenImage(image);
    };

    return (
        <>
            <div
                className={cn(
                    "grid gap-2 w-full",
                    (media.images?.length || 0) > 1 ? "grid-cols-2" : "grid-cols-1"
                )}
            >
                {media.images?.map((image: EmbedImage, i: number) => (
                    <div
                        key={i}
                        className="relative cursor-pointer"
                        onClick={() => handleImageClick(image)}
                    >
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
                                onClick={(e) => handleAltClick(e, image.alt)}
                            >
                                ALT
                            </Button>
                        )}
                    </div>
                ))}

                {media.video && <VideoEmbed video={media.video} />}
            </div>

            <AltDialog
                text={selectedAltText}
                open={altDialogOpen}
                onClose={() => setAltDialogOpen(false)}
            />

            <ImageDialog image={fullscreenImage} onClose={() => setFullscreenImage(null)} />
        </>
    );
}
