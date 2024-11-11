/* eslint-disable @typescript-eslint/no-explicit-any */
// ./lib/api.ts
import { AtpAgent } from "@atproto/api";
import { getSession } from "next-auth/react";
import { auth } from "./next-auth";

const isServer = () => typeof window === "undefined";

export const agent = new AtpAgent({
    service: "https://bsky.social"
});

export async function getAtpSession() {
    const agent = new AtpAgent({
        service: "https://bsky.social"
    });

    try {
        // Use different auth methods for client and server
        const session = isServer() ? await auth() : await getSession();

        if (!session?.user) {
            throw new Error("Unauthenticated");
        }

        const atpSession = (session.user as any).session;
        if (!atpSession) {
            throw new Error("No ATP session found");
        }

        const result = await agent.resumeSession(atpSession);
        if (!result.success) {
            throw new Error("Unable to resume ATP session");
        }

        return agent;
    } catch (error: any) {
        console.error("ATP Session Error:", error);
        // Instead of using redirect and toast here, throw the error
        // and let the component handle it appropriately
        throw error;
    }
}

// Helper function for client-side use
export async function getAtpSessionClient() {
    try {
        return await getAtpSession();
    } catch (error) {
        // Handle client-side authentication errors
        window.location.href = "/home";
        throw error;
    }
}
