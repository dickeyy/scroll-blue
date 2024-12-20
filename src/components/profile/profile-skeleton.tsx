import PostSkeleton from "@/components/post/post-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileSkeleton() {
    return (
        <div className="flex h-full flex-col w-full">
            <div className="relative">
                <Skeleton className="h-48 w-full" />
                <div className="absolute bottom-0 translate-y-1/2 left-4">
                    <Skeleton className="size-24 rounded-full border-[6px] border-background" />
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

                <div className="flex items-center gap-2">
                    <Skeleton className="w-4 h-4" /> {/* Calendar Icon */}
                    <Skeleton className="h-4 w-20" /> {/* Joined Date */}
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
                    <div className="flex items-center gap-1">
                        <Skeleton className="h-4 w-12" /> {/* Number */}
                        <Skeleton className="h-4 w-16" /> {/* "Posts" */}
                    </div>
                </div>

                <div className="flex items-center justify-between w-full bg-foreground/[2%] rounded-md p-2 gap-2">
                    <Skeleton className="w-1/3 h-7" />
                    <Skeleton className="w-1/3 h-7" />
                    <Skeleton className="w-1/3 h-7" />
                </div>

                <PostSkeleton />
            </div>
        </div>
    );
}
