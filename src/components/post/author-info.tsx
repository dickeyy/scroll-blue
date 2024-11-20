import { getPostAge } from "@/utils/time";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface Author {
    handle: string;
    displayName: string;
    avatar: string;
}

export default function AuthorInfo({ author, timestamp }: { author: Author; timestamp: string }) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <AuthorAvatar author={author} />
                <div className="flex flex-col gap-0">
                    <div className="flex items-center gap-2">
                        <Link href={`/${author?.handle}`}>
                            <p className="text-sm font-semibold hover:underline">
                                {author?.displayName}
                            </p>
                        </Link>
                        <Link href={`/${author?.handle}`}>
                            <p className="text-sm text-muted-foreground hover:underline">
                                @{author?.handle}
                            </p>
                        </Link>
                        <div className="flex gap-2 items-center text-xs text-muted-foreground">
                            <p>·</p>
                            <time>{getPostAge(timestamp)}</time>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function AuthorAvatar({ author }: { author: Author }) {
    return (
        <Avatar className="w-8 h-8">
            <AvatarFallback className="text-sm">
                {author?.displayName
                    ? (author?.displayName[0] + author?.displayName[1]).toUpperCase()
                    : "SB"}
            </AvatarFallback>
            <AvatarImage src={author?.avatar} />
        </Avatar>
    );
}
