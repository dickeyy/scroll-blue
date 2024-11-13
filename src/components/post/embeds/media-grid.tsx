/* eslint-disable @next/next/no-img-element */
import { cn } from "@/lib/utils";

interface EmbedImage {
    thumb: string;
    alt: string;
    aspectRatio?: number;
}

export default function MediaGrid({ images }: { images: EmbedImage[] }) {
    return (
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
}
