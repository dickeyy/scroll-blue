"use client";

import { PostsFeed } from "@/components/post-feed";

export default function FeedPage() {
    return (
        <div className="flex h-full w-full gap-4 flex-col p-4">
            <PostsFeed />
        </div>
    );
}
