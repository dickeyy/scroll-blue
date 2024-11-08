// types/post.ts
import type {
    AppBskyEmbedExternal,
    AppBskyEmbedImages,
    AppBskyEmbedRecord,
    AppBskyFeedDefs,
    AppBskyFeedPost
} from "@atproto/api";

export type PostView = AppBskyFeedDefs.PostView;
export type ThreadViewPost = AppBskyFeedDefs.ThreadViewPost;
export type FeedViewPost = AppBskyFeedDefs.FeedViewPost;
export type PostRecord = AppBskyFeedPost.Record;

// Helper function to check if a post has images
export function hasImages(
    embed: AppBskyFeedDefs.PostView["embed"]
): embed is { $type: "app.bsky.embed.images#view"; images: AppBskyEmbedImages.View["images"] } {
    return embed?.$type === "app.bsky.embed.images#view";
}

// Helper function to check if a post is a quote post
export function isQuotePost(
    embed: AppBskyFeedDefs.PostView["embed"]
): embed is { $type: "app.bsky.embed.record#view"; record: AppBskyEmbedRecord.View } {
    return embed?.$type === "app.bsky.embed.record#view";
}

// Helper function to check if a post has external content
export function hasExternalContent(
    embed: AppBskyFeedDefs.PostView["embed"]
): embed is { $type: "app.bsky.embed.external#view"; external: AppBskyEmbedExternal.View } {
    return embed?.$type === "app.bsky.embed.external#view";
}

// Helper function to check if a post is a reply
export function isReply(post: PostView): boolean {
    const record = post.record as PostRecord;
    return record?.reply !== undefined;
}

// Helper function to get readable timestamp
export function getPostAge(post: PostView): string {
    const record = post.record as PostRecord;
    const created = new Date(record.createdAt);
    const now = new Date();
    const diff = now.getTime() - created.getTime();

    // Convert to seconds
    const seconds = Math.floor(diff / 1000);

    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`;
    return `${Math.floor(seconds / 604800)}w`;
}
