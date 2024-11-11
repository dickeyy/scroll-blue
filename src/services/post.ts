// app/services/post.ts
import { getAtpSessionClient } from "@/lib/api";
import { AppBskyFeedDefs } from "@atproto/api";

export type PostView = AppBskyFeedDefs.FeedViewPost;

interface GetPostsOptions {
    cursor?: string;
    limit?: number;
    actor?: string;
    includeLikes?: boolean;
    includeReplies?: boolean;
}

export async function getPosts({
    cursor,
    limit = 20,
    actor,
    includeLikes = false,
    includeReplies = false
}: GetPostsOptions = {}) {
    try {
        const agent = await getAtpSessionClient();

        if (includeLikes && actor) {
            return getLikedPosts(actor, { cursor, limit });
        }

        if (actor) {
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

// Update all other functions to use getAtpSessionClient
export async function getPost(uri: string) {
    try {
        const agent = await getAtpSessionClient();
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
    try {
        const agent = await getAtpSessionClient();
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

export async function likePost(uri: string, cid: string) {
    try {
        const agent = await getAtpSessionClient();
        await agent.like(uri, cid);
        return true;
    } catch (error) {
        console.error("Failed to like post:", error);
        throw error;
    }
}

export async function unlikePost(uri: string) {
    try {
        const agent = await getAtpSessionClient();
        await agent.deleteLike(uri);
        return true;
    } catch (error) {
        console.error("Failed to unlike post:", error);
        throw error;
    }
}

export async function repost(uri: string, cid: string) {
    try {
        const agent = await getAtpSessionClient();
        await agent.repost(uri, cid);
        return true;
    } catch (error) {
        console.error("Failed to repost:", error);
        throw error;
    }
}

export async function unrepost(uri: string) {
    try {
        const agent = await getAtpSessionClient();
        await agent.deleteRepost(uri);
        return true;
    } catch (error) {
        console.error("Failed to remove repost:", error);
        throw error;
    }
}

export async function checkIfLiked(uri: string) {
    try {
        const agent = await getAtpSessionClient();
        const response = await agent.api.app.bsky.feed.getLikes({ uri });
        const currentUserDid = agent.session?.did;

        return response.data.likes.some((like) => like.actor.did === currentUserDid);
    } catch (error) {
        console.error("Failed to check like status:", error);
        return false;
    }
}

export async function checkIfReposted(uri: string) {
    try {
        const agent = await getAtpSessionClient();
        const response = await agent.api.app.bsky.feed.getRepostedBy({ uri });
        const currentUserDid = agent.session?.did;

        return response.data.repostedBy.some((repost) => repost.did === currentUserDid);
    } catch (error) {
        console.error("Failed to check repost status:", error);
        return false;
    }
}
