/* eslint-disable @typescript-eslint/no-explicit-any */
// app/stores/user.ts
import { getAtpSession } from "@/lib/api";
import type { AppBskyActorDefs } from "@atproto/api";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserProfile extends AppBskyActorDefs.ProfileViewDetailed {
    lastUpdated?: number;
}

interface UserState {
    profile: UserProfile | null;
    following: Set<string>;
    followers: Set<string>;
    isLoading: boolean;
    error: string | null;
    // Actions
    fetchProfile: () => Promise<void>;
    fetchSocialGraph: () => Promise<void>;
    updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
    clearUserData: () => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set, get) => ({
            profile: null,
            following: new Set(),
            followers: new Set(),
            isLoading: false,
            error: null,

            fetchProfile: async () => {
                set({ isLoading: true, error: null });

                try {
                    const agent = await getAtpSession();
                    if (!agent) return;

                    const { data: profile } = await agent.getProfile({
                        actor: agent.session?.did as string
                    });

                    set({
                        profile: {
                            ...profile,
                            lastUpdated: Date.now()
                        },
                        isLoading: false
                    });
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : "Failed to fetch profile",
                        isLoading: false
                    });
                }
            },

            fetchSocialGraph: async () => {
                set({ isLoading: true, error: null });

                try {
                    const agent = await getAtpSession();
                    if (!agent) return;

                    // Fetch followers
                    const followers = new Set<string>();
                    let cursor: string | undefined;

                    do {
                        const { data } = await agent.getFollowers({
                            actor: agent.session?.did as string,
                            cursor,
                            limit: 100
                        });

                        data.followers.forEach((follower) => {
                            followers.add(follower.did);
                        });

                        cursor = data.cursor;
                    } while (cursor);

                    // Fetch following
                    const following = new Set<string>();
                    cursor = undefined;

                    do {
                        const { data } = await agent.getFollows({
                            actor: agent.session?.did as string,
                            cursor,
                            limit: 100
                        });

                        data.follows.forEach((follow) => {
                            following.add(follow.did);
                        });

                        cursor = data.cursor;
                    } while (cursor);

                    set({
                        followers,
                        following,
                        isLoading: false
                    });
                } catch (error) {
                    set({
                        error:
                            error instanceof Error ? error.message : "Failed to fetch social graph",
                        isLoading: false
                    });
                }
            },

            updateProfile: async (updates: Partial<UserProfile>) => {
                set({ isLoading: true, error: null });

                try {
                    const agent = await getAtpSession();
                    if (!agent) return;

                    await agent.api.com.atproto.repo.putRecord({
                        repo: agent.session?.did as string,
                        collection: "app.bsky.actor.profile",
                        rkey: "self",
                        record: {
                            ...updates,
                            $type: "app.bsky.actor.profile"
                        }
                    });

                    // Refetch profile to get the latest data
                    await get().fetchProfile();
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : "Failed to update profile",
                        isLoading: false
                    });
                }
            },

            clearUserData: () => {
                set({
                    profile: null,
                    following: new Set(),
                    followers: new Set(),
                    isLoading: false,
                    error: null
                });
            }
        }),
        {
            name: "user-storage",
            // Only persist the profile data, not the loading states
            partialize: (state) => ({
                profile: state.profile,
                following: Array.from(state.following), // Convert Set to Array for storage
                followers: Array.from(state.followers)
            }),
            // Custom merge function to handle Set conversion
            merge: (persistedState: any, currentState: UserState) => ({
                ...currentState,
                ...persistedState,
                // Convert Arrays back to Sets
                following: new Set(persistedState.following || []),
                followers: new Set(persistedState.followers || [])
            })
        }
    )
);
