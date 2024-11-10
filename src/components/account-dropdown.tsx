"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/stores/auth-store";
import { AppBskyActorDefs } from "@atproto/api";
import { Code2Icon, HelpCircleIcon, LogOutIcon, StarIcon } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface AccountDropdownProps {
    profile: AppBskyActorDefs.ProfileViewDetailed;
}

export default function AccountDropdown({ profile }: AccountDropdownProps) {
    const { signout } = useAuthStore();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex h-fit w-full items-center justify-between gap-3  px-1 py-1 pr-2 text-left"
                >
                    <div className="flex flex-row items-center gap-3">
                        <Avatar className="h-9 w-9">
                            <AvatarFallback>
                                {(profile.handle[0] + profile.handle[1]).toUpperCase() || "SB"}
                            </AvatarFallback>
                            <AvatarImage
                                src={profile.avatar}
                                alt={profile.handle + "'s avatar"}
                                className="h-9 w-9"
                            />
                        </Avatar>
                        <div className="flex-col md:flex hidden">
                            <p className="text-start text-sm font-semibold">
                                {profile.displayName}
                            </p>
                            <p className="text-start text-xs text-muted-foreground">
                                @{profile.handle}
                            </p>
                        </div>
                    </div>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuItem asChild>
                    <Link href="https://github.com/dickeyy/scroll-blue" target="_blank">
                        <Code2Icon className="mr-2 h-[1rem] w-[1rem]" />
                        GitHub
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="https://github.com/dickeyy/scroll-blue/issues" target="_blank">
                        <HelpCircleIcon className="mr-2 h-[1rem] w-[1rem]" />
                        Support
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/changelog">
                        <StarIcon className="mr-2 h-[1rem] w-[1rem]" />
                        Changelog
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="focus:bg-red-500/20"
                    onSelect={() => {
                        signout();
                    }}
                >
                    <LogOutIcon className="mr-2 h-[1rem] w-[1rem]" />
                    Sign out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
