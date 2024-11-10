"use client";

import { followAccount, getProfile, unfollowAccount } from "@/services/profile";
import { useUserStore } from "@/stores/user-store";
import { formatNumber } from "@/utils/number-format";
import { AppBskyActorDefs } from "@atproto/api";
import { Separator } from "@radix-ui/react-separator";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ErrorCard from "./error-card";
import { PostSkeleton } from "./post";
import { PostsFeed } from "./post-feed";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface ProfileViewProps {
    handle: string;
    initialTab?: string;
}

export function ProfileView({ handle, initialTab }: ProfileViewProps) {
    const {
        data: profile,
        status,
        error
    } = useQuery({
        queryKey: ["profile", handle],
        queryFn: () => getProfile(handle),
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

interface ProfileHeaderProps {
    profile: AppBskyActorDefs.ProfileViewDetailed;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
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

interface ProfileTabsProps {
    handle: string;
    initialTab?: string;
}

export function ProfileTabs({ handle, initialTab = "posts" }: ProfileTabsProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentTab = searchParams.get("tab") || initialTab;

    const tabs = [
        { value: "posts", label: "Posts" },
        { value: "replies", label: "Posts & Replies" },
        { value: "likes", label: "Likes" }
    ];

    // Set initial tab in URL if not present
    useEffect(() => {
        if (!searchParams.has("tab")) {
            const newSearchParams = new URLSearchParams(searchParams);
            newSearchParams.set("tab", initialTab);
            router.replace(`/${handle}?${newSearchParams.toString()}`, { scroll: false });
        }
    }, [handle, initialTab, router, searchParams]);

    const updateTab = (tab: string) => {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set("tab", tab);
        router.push(`/${handle}?${newSearchParams.toString()}`, { scroll: false });
    };

    return (
        <Tabs value={currentTab} onValueChange={updateTab} className="mt-4">
            <TabsList className="px-4">
                {tabs.map((tab) => (
                    <TabsTrigger key={tab.value} value={tab.value}>
                        {tab.label}
                    </TabsTrigger>
                ))}
            </TabsList>

            <TabsContent value="posts" className="mt-4">
                <PostsFeed actor={handle} />
            </TabsContent>

            <TabsContent value="replies" className="mt-4">
                <PostsFeed actor={handle} includeReplies={true} />
            </TabsContent>

            <TabsContent value="likes" className="mt-4">
                <PostsFeed actor={handle} includeLikes={true} />
            </TabsContent>
        </Tabs>
    );
}

function ProfileSkeleton() {
    return (
        <div className="flex h-full flex-col p-4">
            <div className="relative">
                <Skeleton className="h-48 w-full" />
                <div className="absolute bottom-0 translate-y-2/3 left-4">
                    <Skeleton className="size-24 rounded-full border-4 border-background" />
                </div>
            </div>
            {/* Profile Info Section */}
            <div className="mt-20 px-4 flex flex-col gap-4">
                {/* Name and handle */}
                <div className="flex flex-col gap-1">
                    <Skeleton className="h-7 w-48" /> {/* Name */}
                    <Skeleton className="h-5 w-32" /> {/* Handle */}
                </div>

                {/* Bio */}
                <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>

                {/* Stats */}
                <div className="flex gap-4 items-center mt-2">
                    <div className="flex items-center gap-1">
                        <Skeleton className="h-4 w-12" /> {/* Number */}
                        <Skeleton className="h-4 w-16" /> {/* "Following" */}
                    </div>
                    <div className="flex items-center gap-1">
                        <Skeleton className="h-4 w-12" /> {/* Number */}
                        <Skeleton className="h-4 w-16" /> {/* "Followers" */}
                    </div>
                </div>

                <Separator className="mt-4" />

                <PostSkeleton />
            </div>
        </div>
    );
}
