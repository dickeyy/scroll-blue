/* eslint-disable @next/next/no-img-element */
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { GlobeIcon } from "lucide-react";
import Link from "next/link";

export interface LinkEmbedType {
    description: string;
    title: string;
    uri: string;
    thumb?: string;
}

export default function LinkEmbed({ embed }: { embed: LinkEmbedType }) {
    return (
        <Link href={embed.uri} target="_blank" rel="noreferrer">
            <Card className="p-0 hover:bg-card/40 transition-all bg-background">
                <CardContent className="p-0 bg-transparent">
                    {embed.thumb && (
                        <img
                            src={embed.thumb}
                            alt={embed.title}
                            className="rounded-md border aspect-auto rounded-b-none w-full"
                        />
                    )}
                </CardContent>
                <CardHeader className="p-2">
                    <CardTitle className="truncate w-full">{embed.title || embed.uri}</CardTitle>
                    <CardDescription className="truncate w-full">
                        {embed.description}
                    </CardDescription>
                </CardHeader>
                <Separator />
                <CardFooter className="p-2 text-xs text-muted-foreground gap-2">
                    <GlobeIcon className="size-3" />
                    <p className="truncate">{embed.uri}</p>
                </CardFooter>
            </Card>
        </Link>
    );
}
