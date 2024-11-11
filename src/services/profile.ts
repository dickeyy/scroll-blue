// services/profile.ts
import { getAtpSessionClient } from "@/lib/api";
import { AppBskyActorDefs } from "@atproto/api";

export async function getProfile(actor: string): Promise<AppBskyActorDefs.ProfileViewDetailed> {
    try {
        const agent = await getAtpSessionClient();
        const { data } = await agent.getProfile({
            actor: actor
        });

        return data;
    } catch (error) {
        console.error("Failed to fetch profile:", error);
        throw error;
    }
}

export async function followAccount(did: string) {
    try {
        const agent = await getAtpSessionClient();
        await agent.follow(did);
        return true;
    } catch (error) {
        console.error("Failed to follow account:", error);
        throw error;
    }
}

export async function unfollowAccount(did: string) {
    try {
        const agent = await getAtpSessionClient();
        await agent.deleteFollow(did);
        return true;
    } catch (error) {
        console.error("Failed to unfollow account:", error);
        throw error;
    }
}

// Helper function to check if the current user follows an account
export async function checkIfFollowing(did: string): Promise<boolean> {
    try {
        const agent = await getAtpSessionClient();
        const { data } = await agent.getFollows({
            actor: agent.session?.did as string,
            limit: 100
        });

        return data.follows.some((follow) => follow.did === did);
    } catch (error) {
        console.error("Failed to check follow status:", error);
        return false;
    }
}

// Get followers count
export async function getFollowersCount(did: string): Promise<number> {
    try {
        const agent = await getAtpSessionClient();
        const { data } = await agent.getProfile({ actor: did });
        return data.followersCount ?? 0;
    } catch (error) {
        console.error("Failed to get followers count:", error);
        return 0;
    }
}

// Get following count
export async function getFollowingCount(did: string): Promise<number> {
    try {
        const agent = await getAtpSessionClient();
        const { data } = await agent.getProfile({ actor: did });
        return data.followsCount ?? 0;
    } catch (error) {
        console.error("Failed to get following count:", error);
        return 0;
    }
}

// Get followers that both users follow
export async function getCommonFollows(did: string): Promise<AppBskyActorDefs.ProfileView[]> {
    try {
        const agent = await getAtpSessionClient();
        const currentUserDid = agent.session?.did;
        if (!currentUserDid) throw new Error("Not authenticated");

        // Get both users' follows
        const [userFollows, otherFollows] = await Promise.all([
            agent.getFollows({ actor: currentUserDid }),
            agent.getFollows({ actor: did })
        ]);

        // Find common follows
        const userFollowDids = new Set(userFollows.data.follows.map((f) => f.did));
        const commonFollows = otherFollows.data.follows.filter((f) => userFollowDids.has(f.did));

        return commonFollows;
    } catch (error) {
        console.error("Failed to get common follows:", error);
        return [];
    }
}

// Block an account
export async function blockAccount(did: string): Promise<boolean> {
    try {
        const agent = await getAtpSessionClient();
        const rkey = `${Date.now()}`;
        await agent.api.app.bsky.graph.block.create(
            { repo: agent.session?.did as string, rkey },
            { subject: did, createdAt: new Date().toISOString() }
        );
        return true;
    } catch (error) {
        console.error("Failed to block account:", error);
        throw error;
    }
}

// Unblock an account
export async function unblockAccount(did: string): Promise<boolean> {
    try {
        const agent = await getAtpSessionClient();
        const { data } = await agent.api.app.bsky.graph.getBlocks();
        const block = data.blocks.find((b) => b.did === did);

        if (block && typeof block.uri === "string") {
            const parts = block.uri.split("/");
            const rkey = parts[parts.length - 1];

            await agent.api.app.bsky.graph.block.delete({
                repo: agent.session?.did as string,
                rkey: rkey
            });
            return true;
        }
        return false;
    } catch (error) {
        console.error("Failed to unblock account:", error);
        throw error;
    }
}

// Check if an account is blocked
export async function checkIfBlocked(did: string): Promise<boolean> {
    try {
        const agent = await getAtpSessionClient();
        const { data } = await agent.api.app.bsky.graph.getBlocks();
        return data.blocks.some((block) => block.did === did);
    } catch (error) {
        console.error("Failed to check block status:", error);
        return false;
    }
}
