import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export default function PostSkeleton() {
    return (
        <Card className="bg-foreground/[2%] space-y-0 gap-0">
            <CardHeader className="p-3 space-y-0 my-0 flex flex-row justify-between">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="flex flex-row gap-2 items-center justify-center">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                </div>
                <div className="flex gap-2 items-center">
                    <div className="text-xs text-muted-foreground">
                        <Skeleton className="h-4 w-14" />
                    </div>
                    <div className="text-xs text-muted-foreground">
                        <Skeleton className="h-4 w-14" />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-0 px-3 pb-3">
                <Skeleton className="h-20 w-full" />
            </CardContent>
            <CardFooter className="p-3 grid grid-cols-4 gap-6 w-full">
                <div className="flex items-center gap-2 p-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-8" />
                </div>
                <div className="flex items-center gap-2 p-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-8" />
                </div>
                <div className="flex items-center gap-2 p-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-8" />
                </div>
                <div className="flex items-center gap-2 p-2">
                    <Skeleton className="h-4 w-4" />
                </div>
            </CardFooter>
        </Card>
    );
}
