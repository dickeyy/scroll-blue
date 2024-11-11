/* eslint-disable @typescript-eslint/no-explicit-any */
// ./lib/next-auth.ts
import { AppBskyActorDefs, AtpAgent } from "@atproto/api";
import { jwtDecode } from "jwt-decode";
import NextAuth, { CredentialsSignin, Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";

class AuthError extends CredentialsSignin {
    constructor(message: string, data?: any) {
        super(message);
        this.name = "AuthError";
        this.stack = data;
    }
}

interface BskyUser extends User {
    did: string;
    handle: string;
    session: any;
    profile?: AppBskyActorDefs.ProfileViewDetailed;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            id: "atproto",
            name: "atproto",
            credentials: {
                identifier: { label: "Handle", type: "text" },
                password: { label: "Password", type: "password" }
            },
            type: "credentials",
            async authorize(credentials) {
                if (!credentials) {
                    throw new AuthError("No credentials provided");
                }

                const agent = new AtpAgent({ service: "https://bsky.social" });

                const response = await agent.login({
                    identifier: credentials.identifier as string,
                    password: credentials.password as string
                });

                if (!response.success) {
                    console.log(response);
                    throw new AuthError("Authentication failed", response);
                }

                // Fetch user profile after successful login
                try {
                    const { data: profile } = await agent.getProfile({
                        actor: response.data.did
                    });

                    return {
                        did: response.data.did,
                        handle: response.data.handle,
                        session: agent.session,
                        profile: profile
                    } as BskyUser;
                } catch (error) {
                    console.error("Failed to fetch profile:", error);
                    // Still return basic user data even if profile fetch fails
                    return {
                        did: response.data.did,
                        handle: response.data.handle,
                        session: agent.session
                    } as BskyUser;
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }: { token: JWT; user: any }) {
            if (user) {
                token.id = user.id;
                token.handle = user.handle;
                token.session = user.session;
                token.profile = user.profile;
            }
            return token;
        },

        async session({ session, token }: { session: Session; token: JWT }): Promise<Session> {
            const agent = new AtpAgent({ service: "https://bsky.social" });

            // Type assertion for the token
            const bskyToken = token as JWT & BskyUser;

            // Update session with user data
            session.user = {
                ...session.user,
                did: bskyToken.id as string,
                handle: bskyToken.handle,
                session: bskyToken.session,
                profile: bskyToken.profile
            };

            const refreshToken: { iat: number; exp: number } = await jwtDecode(
                bskyToken.session.refreshJwt
            );

            const now = Date.now();

            if (now >= refreshToken.exp * 1000) {
                throw new AuthError("Refresh token expired");
            }

            const accessToken: { iat: number; exp: number } = await jwtDecode(
                bskyToken.session.accessJwt
            );

            if (now >= accessToken.exp * 1000) {
                console.log("Refreshing access token...");
                const { data } = await agent.api.com.atproto.server.refreshSession(undefined, {
                    headers: {
                        authorization: "Bearer " + session.user.session.refreshJwt
                    }
                });

                session.user.session.refreshJwt = data.refreshJwt;
                session.user.session.accessJwt = data.accessJwt;
                session.user.handle = data.handle;
                session.user.id = data.did;

                // Optionally refresh profile data here too
                try {
                    const { data: profile } = await agent.getProfile({
                        actor: data.did
                    });
                    session.user.profile = profile;
                } catch (error) {
                    console.error("Failed to refresh profile:", error);
                }
            }

            return session;
        },

        authorized: async ({ auth }) => {
            return !!auth;
        }
    },
    pages: {
        signIn: "/sign-in"
    }
});
