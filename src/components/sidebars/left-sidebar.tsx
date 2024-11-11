/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Bell, Home, Mail, PenSquare, Search, Settings, User } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AccountDropdown from "../account-dropdown";

export function LeftSidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const profile = session?.user?.profile;

    const navigationItems = [
        {
            label: "Home",
            icon: Home,
            href: "/"
        },
        {
            label: "Search",
            icon: Search,
            href: "/search"
        },
        {
            label: "Notifications",
            icon: Bell,
            href: "/notifications"
        },
        {
            label: "Messages",
            icon: Mail,
            href: "/messages"
        },
        {
            label: "Profile",
            icon: User,
            href: `/${profile?.handle}`
        },
        {
            label: "Settings",
            icon: Settings,
            href: "/settings"
        }
    ];

    return (
        <div className="flex h-full flex-col justify-between">
            <div className="flex flex-col items-center gap-2 md:items-stretch">
                {/* Logo */}
                <Logo />

                {/* Navigation Items */}
                <nav className="flex flex-col gap-1">
                    {navigationItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Button
                                asChild
                                variant={isActive ? "secondary" : "ghost"}
                                key={item.href}
                                className={cn(
                                    "w-full justify-start gap-4 md:px-4",
                                    isActive && "bg-secondary font-semibold",
                                    !isActive && "hover:bg-secondary/50"
                                )}
                            >
                                <Link href={item.href}>
                                    <item.icon
                                        className={cn("h-6 w-6", isActive && "text-primary")}
                                    />
                                    <span
                                        className={cn(
                                            "hidden md:inline",
                                            isActive && "text-primary"
                                        )}
                                    >
                                        {item.label}
                                    </span>
                                </Link>
                            </Button>
                        );
                    })}
                </nav>

                {/* Post Button */}
                <Button className="mt-4 gap-2 md:w-full">
                    <PenSquare className="h-6 w-6 md:hidden" />
                    <span className="hidden md:inline">Post</span>
                </Button>
            </div>

            {/* Profile Section */}
            <div className="flex flex-col gap-2">
                {profile && <AccountDropdown profile={profile} />}
            </div>
        </div>
    );
}

function Logo() {
    return (
        <Link className="mb-4 flex h-12 w-12 items-center justify-center" href="/">
            <Image
                src="/logo.svg"
                alt="Scroll blue logo"
                className="transition-transform duration-500 hover:rotate-180"
                width={40}
                height={40}
            />
        </Link>
    );
}
