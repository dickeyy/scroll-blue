"use client";

import { PostsFeed } from "@/components/post/post-feed";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

interface ProfileTabsProps {
    handle: string;
    initialTab?: string;
}

export default function ProfileTabs({ handle, initialTab = "posts" }: ProfileTabsProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentTab = searchParams.get("tab") || initialTab;
    const { data: session } = useSession();
    const viewerProfile = session?.user;

    const tabs = [
        { value: "posts", label: "Posts" },
        { value: "replies", label: "Replies" },
        { value: "media", label: "Media" }
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
        <Tabs value={currentTab} onValueChange={updateTab} className="mt-4 w-full">
            <TabsList className="w-full">
                {tabs.map((tab) => (
                    <TabsTrigger className="w-full" key={tab.value} value={tab.value}>
                        {tab.label}
                    </TabsTrigger>
                ))}
                {viewerProfile?.handle === handle && (
                    <TabsTrigger className="w-full" value="likes">
                        Likes
                    </TabsTrigger>
                )}
            </TabsList>

            <TabsContent value="posts" className="mt-4">
                <PostsFeed actor={handle} />
            </TabsContent>

            <TabsContent value="replies" className="mt-4">
                <PostsFeed actor={handle} includeReplies={true} />
            </TabsContent>

            <TabsContent value="media" className="mt-4">
                <PostsFeed actor={handle} includeMedia={true} includeReplies={false} />
            </TabsContent>

            {viewerProfile?.handle === handle && (
                <TabsContent value="likes" className="mt-4">
                    <PostsFeed actor={handle} includeLikes={true} />
                </TabsContent>
            )}
        </Tabs>
    );
}
