// app/[handle]/page.tsx
import { ProfileView } from "@/components/profile-view";

interface ProfilePageProps {
    params: { handle: string };
    searchParams: { [key: string]: string | string[] | undefined };
}

export default async function ProfilePage({ params, searchParams }: ProfilePageProps) {
    const handle = await Promise.resolve(params.handle);
    const tab = await Promise.resolve(searchParams.tab);

    return (
        <div className="flex h-full w-full flex-col p-4">
            <ProfileView handle={handle} initialTab={typeof tab === "string" ? tab : undefined} />
        </div>
    );
}
