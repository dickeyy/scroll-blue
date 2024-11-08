// app/lib/auth.ts
import { AtpAgent as BskyAgent } from "@atproto/api";

const DEFAULT_SERVICE = "https://bsky.social";

interface AuthResponse {
    success: boolean;
    error?: string;
    agent?: BskyAgent;
}

export async function authenticate(
    identifier: string,
    password: string,
    service: string = DEFAULT_SERVICE
): Promise<AuthResponse> {
    try {
        const agent = new BskyAgent({ service });

        await agent.login({
            identifier,
            password
        });

        // Store the session in localStorage
        if (agent.session) {
            localStorage.setItem("bluesky-session", JSON.stringify(agent.session)); // TODO: change this to a zustand secure store
        }

        return {
            success: true,
            agent
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Authentication failed"
        };
    }
}

// Check if there's an existing session
export async function resumeSession(service: string = DEFAULT_SERVICE): Promise<AuthResponse> {
    try {
        const sessionStr = localStorage.getItem("bluesky-session");
        if (!sessionStr) {
            return {
                success: false,
                error: "No session found"
            };
        }

        const session = JSON.parse(sessionStr);
        const agent = new BskyAgent({ service });
        await agent.resumeSession(session);

        return {
            success: true,
            agent
        };
    } catch (error) {
        localStorage.removeItem("bluesky-session");
        return {
            success: false,
            error: error instanceof Error ? error.message : "Session resume failed"
        };
    }
}

export function logout() {
    localStorage.removeItem("bluesky-session");
}
