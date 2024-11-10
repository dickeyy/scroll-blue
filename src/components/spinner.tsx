// components/ui/spinner.tsx
import { cn } from "@/lib/utils";

interface SpinnerProps {
    size?: number; // size in pixels
    className?: string;
}

export function Spinner({ size = 24, className }: SpinnerProps) {
    return (
        <div
            className={cn(
                "animate-spin rounded-full border-[3px] border-border border-r-foreground border-b-foreground",
                className
            )}
            style={{
                width: size,
                height: size
            }}
        />
    );
}
