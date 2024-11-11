import type { Segment } from "@/utils/text-processor";
import Link from "next/link";

export default function RichTextRenderer({
    segments,
    className
}: {
    segments: Segment[];
    className?: string;
}) {
    return (
        <div className={className}>
            {segments.map((segment, index) => {
                if (segment.type === "link") {
                    return (
                        <Link
                            key={index}
                            href={
                                segment.url
                                    ? segment.url?.startsWith("http")
                                        ? segment.url
                                        : `https://${segment.url}` || ""
                                    : segment.text.startsWith("http")
                                      ? segment.text
                                      : `https://${segment.text}`
                            }
                            target="_blank"
                            className="text-blue-500 hover:underline"
                        >
                            {segment.text.startsWith("https://")
                                ? segment.text.replace("https://", "")
                                : segment.text.startsWith("http://")
                                  ? segment.text.replace("http://", "")
                                  : segment.text}
                        </Link>
                    );
                } else if (segment.type === "mention") {
                    return (
                        <Link
                            key={index}
                            href={`/${segment.text.replace("@", "")}`}
                            className="text-blue-500 hover:underline"
                        >
                            {segment.text}
                        </Link>
                    );
                } else if (segment.type === "tag") {
                    return (
                        <Link
                            key={index}
                            href={`/tag/${segment.tag}`}
                            className="text-blue-500hover:underline"
                        >
                            {segment.text}
                        </Link>
                    );
                } else {
                    return <span key={index}>{segment.text}</span>;
                }
            })}
        </div>
    );
}
