"use client";

import ErrorCard from "@/components/error-card";
import ProfileHeader from "@/components/profile/profile-header";
import ProfileSkeleton from "@/components/profile/profile-skeleton";
import ProfileTabs from "@/components/profile/profile-tabs";
import { getProfile } from "@/services/profile";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

interface ProfileViewProps {
    handle: string;
    initialTab?: string;
}

export function ProfileView({ handle, initialTab }: ProfileViewProps) {
    const { data: session } = useSession();

    const {
        data: profile,
        status,
        error
    } = useQuery({
        queryKey: ["profile", handle],
        queryFn: () => getProfile(handle, session?.user.service || "https://bsky.social"),
        staleTime: 1000 * 60 * 5 // Consider data stale after 5 minutes
    });

    if (status === "pending") {
        return <ProfileSkeleton />;
    }

    if (status === "error") {
        return (
            <ErrorCard
                error={{
                    message: error.message || "Error loading profile. Please try again later.",
                    code: error.message.includes("Not Found")
                        ? 404
                        : error.message.includes("actor must be a valid did or a handle")
                          ? 400
                          : 500
                }}
            />
        );
    }

    return (
        <div className="flex flex-col">
            <ProfileHeader profile={profile} />
            <ProfileTabs handle={handle} initialTab={initialTab} />
        </div>
    );
}
