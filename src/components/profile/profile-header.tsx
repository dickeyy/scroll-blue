"use client";

import { Button } from "@/components/ui/button";
import { followAccount, unfollowAccount } from "@/services/profile";
import { useUserStore } from "@/stores/user-store";
import { formatNumber } from "@/utils/number-format";
import { AppBskyActorDefs } from "@atproto/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

interface ProfileHeaderProps {
    profile: AppBskyActorDefs.ProfileViewDetailed;
}

export default function ProfileHeader({ profile }: ProfileHeaderProps) {
    const queryClient = useQueryClient();
    const currentUser = useUserStore((state) => state.profile);
    const [isHovering, setIsHovering] = useState(false);

    // Follow mutation
    const followMutation = useMutation({
        mutationFn: (isFollowing: boolean) =>
            isFollowing ? unfollowAccount(profile.did) : followAccount(profile.did),
        onSuccess: () => {
            // Invalidate and refetch profile data
            queryClient.invalidateQueries({ queryKey: ["profile", profile.handle] });
        },
        onError: (error) => {
            console.error(error);
            toast.error("Something went wrong.", {
                description: error.message
            });
        }
    });

    const handleFollowClick = () => {
        if (currentUser) {
            if (currentUser.did !== profile.did) {
                followMutation.mutate(profile.viewer?.following !== undefined);
            } else {
                toast.error("You cannot follow yourself.");
            }
        } else {
            toast.error("You must be logged in to follow someone.");
        }
    };

    return (
        <div className="flex h-full flex-col">
            <div className="relative">
                {profile.banner ? (
                    <Image
                        src={profile.banner}
                        alt="Profile banner"
                        className="h-48 w-full object-cover rounded-lg"
                        width={800}
                        height={200}
                    />
                ) : (
                    <div className="h-48 w-full bg-foreground/[2%] rounded-lg" />
                )}
                <div className="absolute bottom-0 translate-y-1/2 left-4">
                    <Image
                        src={profile.avatar || "/default-avatar.png"}
                        alt="Profile picture"
                        className="size-24 rounded-full border-8 border-background"
                        width={96}
                        height={96}
                    />
                </div>
            </div>

            {/* Profile Info Section */}
            <div className="mt-16 px-4 flex flex-col gap-4">
                {/* Name, Handle, and Follow Button */}
                <div className="flex items-start justify-between">
                    <div className="flex flex-col">
                        <h1 className="text-xl font-bold">{profile.displayName}</h1>
                        <a
                            href={`https://bsky.app/profile/${profile.handle}`}
                            target="_blank"
                            className="text-muted-foreground"
                        >
                            @{profile.handle}
                        </a>
                    </div>
                    {currentUser && (
                        <>
                            {profile.did !== currentUser.did ? (
                                <Button
                                    variant={
                                        profile.viewer?.following
                                            ? isHovering
                                                ? "destructive"
                                                : "outline"
                                            : "default"
                                    }
                                    onClick={handleFollowClick}
                                    disabled={followMutation.isPending}
                                    onMouseEnter={() => setIsHovering(true)}
                                    onMouseLeave={() => setIsHovering(false)}
                                >
                                    {profile.viewer?.following
                                        ? isHovering
                                            ? "Unfollow"
                                            : "Following"
                                        : "Follow"}
                                </Button>
                            ) : (
                                <Button variant="outline">Edit Profile</Button>
                            )}
                        </>
                    )}
                </div>

                {/* Bio */}
                {profile.description && (
                    <p className="whitespace-pre-wrap text-sm">{profile.description}</p>
                )}

                {/* Stats */}
                <div className="flex gap-4 text-sm">
                    <button className="hover:underline">
                        <span className="font-bold">
                            {formatNumber(profile.followersCount || 0)}
                        </span>{" "}
                        <span className="text-muted-foreground">followers</span>
                    </button>
                    <button className="hover:underline">
                        <span className="font-bold">{formatNumber(profile.followsCount || 0)}</span>{" "}
                        <span className="text-muted-foreground">following</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
