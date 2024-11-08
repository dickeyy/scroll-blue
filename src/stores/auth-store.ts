// app/stores/auth.ts
import { decryptData, encryptData } from "@/lib/encryption";
import type { AtpSessionData } from "@atproto/api";
import { AtpAgent as BskyAgent } from "@atproto/api";
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
    login: (identifier: string, password: string) => Promise<void>;
    logout: () => void;
    resumeSession: () => Promise<boolean>;
}

const DEFAULT_SERVICE = "https://bsky.social";

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            isAuthenticated: false,
            session: null,
            agent: null,
            error: null,

            login: async (identifier: string, password: string) => {
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

            logout: async () => {
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
            storage: createJSONStorage(() => sessionStorage), // Use sessionStorage instead of localStorage
            partialize: (state) => ({
                session: state.session // Only persist the encrypted session
            })
        }
    )
);
