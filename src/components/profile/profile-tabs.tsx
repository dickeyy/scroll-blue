"use client";

import { PostsFeed } from "@/components/post/post-feed";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
