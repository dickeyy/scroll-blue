// app/[handle]/page.tsx
import { ProfileView } from "@/components/profile-view";
import { Metadata } from "next";

interface ProfilePageProps {
    params: { handle: string };
    searchParams: { tab?: string };
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
    return {
        title: `@${params.handle} • bsky`
    };
}

export default function ProfilePage({ params, searchParams }: ProfilePageProps) {
    return (
        <div className="flex h-full w-full flex-col p-4">
            <ProfileView handle={params.handle} initialTab={searchParams.tab} />
        </div>
    );
}
