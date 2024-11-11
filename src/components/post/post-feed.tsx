/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import ErrorCard from "@/components/error-card";
import Post from "@/components/post/post";
import PostSkeleton from "@/components/post/post-skeleton";
import { Spinner } from "@/components/spinner";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { getPosts } from "@/services/post";
import { AppBskyFeedDefs } from "@atproto/api";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRef } from "react";

interface PostsFeedProps {
    actor?: string;
    includeLikes?: boolean;
    includeReplies?: boolean;
    includeMedia?: boolean;
}

export function PostsFeed({ actor, includeLikes, includeReplies, includeMedia }: PostsFeedProps) {
    const loadMoreRef = useRef<HTMLDivElement>(null);

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status, error } =
        useInfiniteQuery({
            queryKey: ["posts", actor, includeLikes, includeReplies, includeMedia], // Added includeMedia to queryKey
            queryFn: ({ pageParam }: any) =>
                getPosts({
                    cursor: pageParam,
                    actor,
                    includeLikes,
                    includeReplies,
                    includeMedia
                }),
            getNextPageParam: (lastPage: any) => lastPage.cursor,
            initialPageParam: undefined,
            staleTime: 0,
            refetchOnMount: "always",
            refetchOnWindowFocus: true,
            refetchOnReconnect: true
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
    const feedType = includeMedia
        ? "media"
        : includeReplies
          ? "replies"
          : includeLikes
            ? "likes"
            : "posts";

    return (
        <div key={`${actor}-${feedType}-${data.pages.length}`} className="flex flex-col gap-4">
            {data.pages.map((page: any) => (
                <div key={page.cursor} className="flex flex-col gap-4">
                    {page.posts.map((feedViewPost: AppBskyFeedDefs.FeedViewPost) => {
                        // When in media mode, we don't need additional filtering as the API already handles it
                        if (includeMedia) {
                            return <Post key={feedViewPost.post.uri} post={feedViewPost.post} />;
                        }

                        // Skip posts without reply if we're in replies mode and it's not a reply
                        if (includeReplies && !feedViewPost.reply) {
                            return null;
                        }

                        // Merge the post data with any reply/parent data at the feed view level
                        const enrichedPost = {
                            ...feedViewPost.post,
                            reply: feedViewPost.reply
                                ? {
                                      root: feedViewPost.reply.root,
                                      parent: feedViewPost.reply.parent
                                  }
                                : undefined,
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
                    <div className="text-sm text-muted-foreground">
                        <Spinner size={16} />
                    </div>
                ) : (
                    <div className="text-sm text-muted-foreground">No more posts</div>
                )}
            </div>
        </div>
    );
}
