import { ProfileView } from "@/components/profile/profile-view";
import { Metadata } from "next";

interface ProfilePageProps {
    params: Promise<{ handle: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata(props: ProfilePageProps): Promise<Metadata> {
    const params = await props.params;
    const handle = await Promise.resolve(params.handle);

    return {
        title: `@${handle} · scroll.blue`
    };
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
