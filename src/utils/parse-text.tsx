// utils/parse-text.tsx
import React from "react";

interface TextSegment {
    type: "text" | "link" | "mention";
    value: string;
    url?: string;
}

export function parseText(text: string): React.ReactNode {
    if (!text) return "";

    // First process mentions - matches @handle.domain.tld patterns
    // This will match the entire handle including all dots after the @
    const mentionPattern = /@([\w.-]+(?:\.[\w.-]+)*)/g;

    // URL pattern - only match URLs not preceded by @
    const urlPattern =
        /\b(?<!@)(?:https?:\/\/)?(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z]{2,}\b(?:[-a-zA-Z0-9()@:%_+.~#?&//=]*)/g;

    const segments: TextSegment[] = [];
    let lastIndex = 0;

    // First find all mentions
    const mentions = Array.from(text.matchAll(mentionPattern));
    for (const match of mentions) {
        const offset = match.index!;
        if (offset > lastIndex) {
            segments.push({
                type: "text",
                value: text.slice(lastIndex, offset)
            });
        }

        segments.push({
            type: "mention",
            value: match[0], // full @handle.domain.tld
            url: `/${match[1]}` // handle.domain.tld without @
        });

        lastIndex = offset + match[0].length;
    }

    // Add remaining text after last mention
    if (lastIndex < text.length) {
        segments.push({
            type: "text",
            value: text.slice(lastIndex)
        });
    }

    // Now process URLs in any text segments
    const processedSegments: TextSegment[] = [];
    segments.forEach((segment) => {
        if (segment.type === "text") {
            let lastUrlIndex = 0;
            const urlMatches = Array.from(segment.value.matchAll(urlPattern));

            for (const match of urlMatches) {
                const offset = match.index!;
                if (offset > lastUrlIndex) {
                    processedSegments.push({
                        type: "text",
                        value: segment.value.slice(lastUrlIndex, offset)
                    });
                }

                processedSegments.push({
                    type: "link",
                    value: match[0],
                    url: match[0]
                });

                lastUrlIndex = offset + match[0].length;
            }

            if (lastUrlIndex < segment.value.length) {
                processedSegments.push({
                    type: "text",
                    value: segment.value.slice(lastUrlIndex)
                });
            }
        } else {
            processedSegments.push(segment);
        }
    });

    // Convert segments to React elements
    return processedSegments.map((segment, index) => {
        switch (segment.type) {
            case "link":
                return (
                    <a
                        key={index}
                        href={
                            segment.url?.startsWith("http://") ||
                            segment.url?.startsWith("https://")
                                ? segment.url
                                : `https://${segment.url}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                    >
                        {segment.value}
                    </a>
                );
            case "mention":
                return (
                    <a key={index} href={segment.url} className="text-blue-500 hover:underline">
                        {segment.value}
                    </a>
                );
            default:
                return <span key={index}>{segment.value}</span>;
        }
    });
}
