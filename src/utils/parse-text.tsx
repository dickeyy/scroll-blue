import { tokenize } from "@atcute/bluesky-richtext-parser";
import Link from "next/link";

export function renderRichText(text: string) {
    if (!text) return null;

    const tokens = tokenize(text);
    return tokens.map((token, index) => {
        switch (token.type) {
            case "link":
                return (
                    <a
                        key={index}
                        href={token.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                    >
                        {token.text || token.url}
                    </a>
                );
            case "mention":
                return (
                    <Link
                        key={index}
                        href={`/${token.handle}`}
                        className="text-blue-500 hover:underline"
                    >
                        {token.raw}
                    </Link>
                );
            case "topic":
                return (
                    <Link
                        key={index}
                        href={`/topics/${token.raw}`}
                        className="text-blue-500 hover:underline"
                    >
                        {token.raw}
                    </Link>
                );
            default:
                return <span key={index}>{token.raw}</span>;
        }
    });
}
