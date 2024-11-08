/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { getPosts } from "@/services/post";
import { AppBskyFeedDefs } from "@atproto/api";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRef } from "react";
import Post, { PostSkeleton } from "./post";

interface PostsFeedProps {
    actor?: string;
    includeLikes?: boolean;
}

export function PostsFeed({ actor, includeLikes }: PostsFeedProps) {
    const loadMoreRef = useRef<HTMLDivElement>(null);

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery({
        queryKey: ["posts", actor, includeLikes],
        queryFn: ({ pageParam }: any) =>
            getPosts({
                cursor: pageParam,
                actor,
                includeLikes
            }),
        getNextPageParam: (lastPage: any) => lastPage.cursor,
        initialPageParam: undefined
    });

    useIntersectionObserver({
        target: loadMoreRef,
        onIntersect: fetchNextPage,
        enabled: hasNextPage
    });

    if (status === "pending") {
        return (
            <div className="flex flex-col gap-4">
                <PostSkeleton />
                <PostSkeleton />
                <PostSkeleton />
            </div>
        );
    }

    if (status === "error") {
        return <div className="flex justify-center p-4 text-destructive">Error loading posts</div>;
    }

    return (
        <div className="flex flex-col gap-4">
            {data.pages.map((page: any) => (
                <div key={page.cursor} className="flex flex-col gap-4">
                    {page.posts.map((feedViewPost: AppBskyFeedDefs.FeedViewPost) => {
                        // Merge the post data with any reply/parent data at the feed view level
                        const enrichedPost = {
                            ...feedViewPost.post,
                            // If there's reply data in the feed view, include it
                            reply: feedViewPost.reply
                                ? {
                                      root: feedViewPost.reply.root,
                                      parent: feedViewPost.reply.parent
                                  }
                                : undefined,
                            // Include any reason data (like repost information)
                            reason: feedViewPost.reason
                        };

                        return <Post key={feedViewPost.post.uri} post={enrichedPost} />;
                    })}
                </div>
            ))}

            <div ref={loadMoreRef} className="h-20 flex items-center justify-center">
                {isFetchingNextPage ? (
                    <div className="flex flex-col gap-4 w-full">
                        <PostSkeleton />
                    </div>
                ) : hasNextPage ? (
                    <div className="text-sm text-muted-foreground">Loading more...</div>
                ) : (
                    <div className="text-sm text-muted-foreground">No more posts</div>
                )}
            </div>
        </div>
    );
}
