"use client";

import { usePathname } from "next/navigation";
import { LeftSidebar } from "./sidebars/left-sidebar";

export default function WrappedLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const noSidebarRoutes = ["/home", "/sign-in"];
    const shouldShowSidebar = !noSidebarRoutes.some((route) => pathname.startsWith(route));

    if (!shouldShowSidebar) {
        return <main>{children}</main>;
    }

    return (
        <div className="relative flex h-screen max-h-screen w-full flex-row overflow-hidden bg-background">
            {/* Fixed Left Sidebar */}
            <div className="fixed left-0 top-0 z-20 h-full w-[68px] flex-shrink-0 p-2 md:w-[240px] md:p-4">
                <LeftSidebar />
            </div>

            {/* Main Content Wrapper */}
            <div className="flex w-full justify-center">
                {/* Sidebar Spacer */}
                <div className="w-[68px] flex-shrink-0 md:w-[240px]" />

                {/* Main Content */}
                <main className="no-scrollbar flex h-full min-h-screen w-full max-w-3xl flex-col overflow-y-auto">
                    <div className="mx-auto h-full w-full">{children}</div>
                </main>

                {/* Right Spacer for Balance */}
                <div className="w-[68px] flex-shrink-0 md:w-[240px] hidden md:block" />
            </div>
        </div>
    );
}
