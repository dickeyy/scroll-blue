// services/profile.ts
import { useAuthStore } from "@/stores/auth-store";

export async function getProfile(actor: string) {
    const agent = useAuthStore.getState().agent;
    if (!agent) throw new Error("Not authenticated");

    const { data } = await agent.getProfile({
        actor: actor
    });

    return data;
}

export async function followAccount(did: string) {
    const agent = useAuthStore.getState().agent;
    if (!agent?.session) throw new Error("Not authenticated");

    try {
        await agent.follow(did);
        return true;
    } catch (error) {
        console.error("Failed to follow account:", error);
        throw error;
    }
}

export async function unfollowAccount(did: string) {
    const agent = useAuthStore.getState().agent;
    if (!agent?.session) throw new Error("Not authenticated");

    try {
        await agent.deleteFollow(did);
        return true;
    } catch (error) {
        console.error("Failed to unfollow account:", error);
        throw error;
    }
}
