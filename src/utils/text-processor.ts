import { createAgent } from "@/lib/api";
import { RichText } from "@atproto/api";

export function genRichText(text: string): RichText {
    if (!text) console.error("text is empty");
    const rt = new RichText({
        text: text
    });
    return rt;
}

const agent = createAgent();

export interface Segment {
    type: "text" | "link" | "mention" | "tag";
    text: string;
    url?: string;
    did?: string;
    tag?: string;
}

export async function parseRichText(rt: RichText): Promise<Segment[]> {
    const segments: Segment[] = [];
    await rt.detectFacets(agent);

    for (const segment of rt.segments()) {
        if (segment.isLink()) {
            segments.push({
                type: "link" as const, // explicitly tell TypeScript this is a literal type
                text: segment.text,
                url: segment.link?.uri as string | undefined
            });
        } else if (segment.isMention()) {
            segments.push({
                type: "mention" as const,
                text: segment.text,
                did: segment.mention?.did
            });
        } else if (segment.isTag()) {
            segments.push({
                type: "tag" as const,
                text: segment.text,
                tag: segment.tag?.tag
            });
        } else {
            segments.push({
                type: "text" as const,
                text: segment.text
            });
        }
    }
    return segments;
}
