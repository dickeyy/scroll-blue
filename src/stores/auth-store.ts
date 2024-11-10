// app/stores/auth.ts
import { decryptData, encryptData } from "@/lib/encryption";
import type { AtpSessionData } from "@atproto/api";
import { AtpAgent as BskyAgent } from "@atproto/api";
import { toast } from "sonner";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useUserStore } from "./user-store";

type AuthSession = AtpSessionData;

interface AuthState {
    isAuthenticated: boolean;
    session: AuthSession | null;
    agent: BskyAgent | null;
    error: string | null;
    // Actions
    signin: (identifier: string, password: string) => Promise<void>;
    signout: () => void;
    resumeSession: () => Promise<boolean>;
}

const DEFAULT_SERVICE = "https://bsky.social";

// Create a custom storage object that handles cross-tab synchronization
const createSyncedStorage = () => {
    const storage = createJSONStorage(() => localStorage);

    // Listen for storage events from other tabs
    if (typeof window !== "undefined") {
        window.addEventListener("storage", (e) => {
            if (e.key === "auth-storage") {
                // Force zustand to rehydrate from localStorage
                useAuthStore.persist.rehydrate();
            }
        });
    }

    return storage;
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            isAuthenticated: false,
            session: null,
            agent: null,
            error: null,

            signin: async (identifier: string, password: string) => {
                try {
                    const agent = new BskyAgent({ service: DEFAULT_SERVICE });
                    const { success } = await agent.login({ identifier, password });

                    if (success && agent.session) {
                        // Encrypt sensitive session data before storing
                        const sessionData: AtpSessionData = {
                            ...agent.session,
                            active: true // Ensure active flag is set
                        };
                        const encryptedSession = encryptData(sessionData);

                        set({
                            isAuthenticated: true,
                            session: encryptedSession,
                            agent,
                            error: null
                        });
                    }
                } catch (error) {
                    set({
                        isAuthenticated: false,
                        session: null,
                        agent: null,
                        error: error instanceof Error ? error.message : "Authentication failed"
                    });
                    throw error;
                }
            },

            signout: async () => {
                const { agent } = get();
                try {
                    // Create a new agent instance without session
                    const newAgent = new BskyAgent({ service: DEFAULT_SERVICE });

                    if (agent) {
                        // Properly destroy the session on the server if needed
                        // This is a no-op right now as Bluesky doesn't have a logout endpoint
                        // but keeping it for future compatibility
                        // await agent.com.atproto.server.deleteSession()
                    }

                    // Clear user data
                    useUserStore.getState().clearUserData();

                    set({
                        isAuthenticated: false,
                        session: null,
                        agent: newAgent,
                        error: null
                    });

                    toast.success("You have been signed out.");
                } catch (error) {
                    console.error("Logout error:", error);
                    // Still clear the local state even if server logout fails
                    set({
                        isAuthenticated: false,
                        session: null,
                        agent: null,
                        error: null
                    });
                }
            },

            resumeSession: async () => {
                const state = get();
                const { session } = state;

                // If we're already authenticated and have an agent, just return true
                if (state.isAuthenticated && state.agent?.session) {
                    return true;
                }

                if (!session) return false;

                try {
                    const decryptedSession = decryptData(session);
                    const agent = new BskyAgent({ service: DEFAULT_SERVICE });
                    await agent.resumeSession(decryptedSession);

                    set({
                        isAuthenticated: true,
                        agent,
                        error: null
                    });

                    toast.success(
                        "Welcome back" + (agent.session?.handle ? `, ${agent.session.handle}` : "!")
                    );

                    return true;
                } catch (error) {
                    set({
                        isAuthenticated: false,
                        session: null,
                        agent: null,
                        error: error instanceof Error ? error.message : "Session resume failed"
                    });
                    return false;
                }
            }
        }),
        {
            name: "auth-storage",
            storage: createSyncedStorage(), // Use our custom storage implementation
            partialize: (state) => ({
                session: state.session // Only persist the encrypted session
            })
        }
    )
);
