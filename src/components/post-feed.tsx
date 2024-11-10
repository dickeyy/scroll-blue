/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { getPosts } from "@/services/post";
import { AppBskyFeedDefs } from "@atproto/api";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRef } from "react";
import ErrorCard from "./error-card";
import Post, { PostSkeleton } from "./post";

interface PostsFeedProps {
    actor?: string;
    includeLikes?: boolean;
    includeReplies?: boolean;
}

export function PostsFeed({ actor, includeLikes, includeReplies }: PostsFeedProps) {
    const loadMoreRef = useRef<HTMLDivElement>(null);

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status, error } =
        useInfiniteQuery({
            queryKey: ["posts", actor, includeLikes, includeReplies],
            queryFn: ({ pageParam }: any) =>
                getPosts({
                    cursor: pageParam,
                    actor,
                    includeLikes,
                    includeReplies
                }),
            getNextPageParam: (lastPage: any) => lastPage.cursor,
            initialPageParam: undefined,
            // Disable caching and ensure fresh data
            staleTime: 0, // Data is immediately considered stale
            refetchOnMount: "always", // Always refetch when component mounts
            refetchOnWindowFocus: true, // Refetch when window regains focus
            refetchOnReconnect: true // Refetch when network reconnects
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
            </div>
        );
    }

    if (status === "error") {
        return (
            <ErrorCard
                error={{
                    message: error.message || "Error loading posts. Please try again later.",
                    code: 500
                }}
            />
        );
    }

    // Add content key based on the feed type to force re-render when switching tabs
    const feedType = includeReplies ? "replies" : includeLikes ? "likes" : "posts";

    return (
        <div key={`${actor}-${feedType}-${data.pages.length}`} className="flex flex-col gap-4">
            {data.pages.map((page: any) => (
                <div key={page.cursor} className="flex flex-col gap-4">
                    {page.posts.map((feedViewPost: AppBskyFeedDefs.FeedViewPost) => {
                        // Skip posts without reply if we're in replies mode and it's not a reply
                        if (includeReplies && !feedViewPost.reply) {
                            return null;
                        }

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
