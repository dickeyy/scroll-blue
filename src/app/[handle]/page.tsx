// app/[handle]/page.tsx
import { ProfileView } from "@/components/profile-view";

interface ProfilePageProps {
    params: Promise<{ handle: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProfilePage(props: ProfilePageProps) {
    const searchParams = await props.searchParams;
    const params = await props.params;
    const handle = await Promise.resolve(params.handle);
    const tab = await Promise.resolve(searchParams.tab);

    return (
        <div className="flex h-full w-full flex-col p-4">
            <ProfileView handle={handle} initialTab={typeof tab === "string" ? tab : undefined} />
        </div>
    );
}
