/* eslint-disable @typescript-eslint/no-explicit-any */
// types/next-auth.d.ts
import { AppBskyActorDefs } from "@atproto/api";
import "next-auth";

declare module "next-auth" {
    interface User {
        did: string;
        handle: string;
        session: any;
        profile?: AppBskyActorDefs.ProfileViewDetailed;
    }

    interface Session {
        user: User & {
            did: string;
            handle: string;
            session: any;
            profile?: AppBskyActorDefs.ProfileViewDetailed;
        };
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        did: string;
        handle: string;
        session: any;
        profile?: AppBskyActorDefs.ProfileViewDetailed;
    }
}
