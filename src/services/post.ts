// app/services/post.ts
import { useAuthStore } from "@/stores/auth-store";
import { AppBskyFeedDefs } from "@atproto/api";

export type PostView = AppBskyFeedDefs.FeedViewPost;

interface GetPostsOptions {
    cursor?: string;
    limit?: number;
    // For user profile timeline
    actor?: string;
    // For liked posts
    includeLikes?: boolean;
    // For including replies
    includeReplies?: boolean;
}

export async function getPosts({
    cursor,
    limit = 20,
    actor,
    includeLikes = false,
    includeReplies = false
}: GetPostsOptions = {}) {
    const agent = useAuthStore.getState().agent;
    if (!agent?.session) throw new Error("Not authenticated");

    try {
        if (includeLikes && actor) {
            return getLikedPosts(actor, { cursor, limit });
        }

        if (actor) {
            // Get user timeline with optional replies
            const response = await agent.getAuthorFeed({
                actor,
                cursor,
                limit,
                filter: includeReplies ? "posts_with_replies" : "posts_no_replies"
            });

            return {
                posts: response.data.feed,
                cursor: response.data.cursor
            };
        }

        // Get home timeline
        const response = await agent.getTimeline({
            cursor,
            limit
        });

        return {
            posts: response.data.feed,
            cursor: response.data.cursor
        };
    } catch (error) {
        console.error("Failed to fetch posts:", error);
        throw error;
    }
}

export async function getPost(uri: string) {
    const agent = useAuthStore.getState().agent;
    if (!agent?.session) throw new Error("Not authenticated");

    try {
        const response = await agent.getPostThread({
            uri,
            depth: 0
        });

        if (!response.success) {
            throw new Error("Failed to fetch post");
        }

        return response.data.thread;
    } catch (error) {
        console.error("Failed to fetch post:", error);
        throw error;
    }
}

export async function getLikedPosts(actor: string, { cursor, limit = 20 }: GetPostsOptions = {}) {
    const agent = useAuthStore.getState().agent;
    if (!agent?.session) throw new Error("Not authenticated");

    try {
        const response = await agent.api.app.bsky.feed.getActorLikes({
            actor,
            cursor,
            limit
        });

        return {
            posts: response.data.feed,
            cursor: response.data.cursor
        };
    } catch (error) {
        console.error("Failed to fetch liked posts:", error);
        throw error;
    }
}

// Post interaction functions
export async function likePost(uri: string, cid: string) {
    const agent = useAuthStore.getState().agent;
    if (!agent?.session) throw new Error("Not authenticated");

    try {
        await agent.like(uri, cid);
        return true;
    } catch (error) {
        console.error("Failed to like post:", error);
        throw error;
    }
}

export async function unlikePost(uri: string) {
    const agent = useAuthStore.getState().agent;
    if (!agent?.session) throw new Error("Not authenticated");

    try {
        await agent.deleteLike(uri);
        return true;
    } catch (error) {
        console.error("Failed to unlike post:", error);
        throw error;
    }
}

export async function repost(uri: string, cid: string) {
    const agent = useAuthStore.getState().agent;
    if (!agent?.session) throw new Error("Not authenticated");

    try {
        await agent.repost(uri, cid);
        return true;
    } catch (error) {
        console.error("Failed to repost:", error);
        throw error;
    }
}

export async function unrepost(uri: string) {
    const agent = useAuthStore.getState().agent;
    if (!agent?.session) throw new Error("Not authenticated");

    try {
        await agent.deleteRepost(uri);
        return true;
    } catch (error) {
        console.error("Failed to remove repost:", error);
        throw error;
    }
}
