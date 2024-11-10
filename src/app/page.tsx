import { PostsFeed } from "@/components/post/post-feed";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Feed · scroll.blue"
};

export default function FeedPage() {
    return (
        <div className="flex h-full w-full gap-4 flex-col p-4">
            <PostsFeed />
        </div>
    );
}
