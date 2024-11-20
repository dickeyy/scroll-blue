/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

export default function CreatePostModal({
    isOpen,
    onClose
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const [body, setBody] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    function onSubmit() {
        if (body.length < 1) {
            toast.error("Please enter a post.");
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        console.log(body);

        setTimeout(() => {
            setIsLoading(false);
            toast.success("Posted!");
            setBody("");
            onClose();
        }, 2000);
    }

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent className="p-0 max-w-xl w-full">
                <div className="flex items-center justify-between p-2">
                    <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
                    <Button
                        onClick={onSubmit}
                        disabled={isLoading || body.length < 1 || body.length > 300}
                    >
                        {isLoading ? "Posting..." : "Post"}
                    </Button>
                </div>
                <div className="flex flex-col gap-2 p-2 pt-0">
                    <Textarea
                        disabled={isLoading}
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        placeholder="What's on your mind?"
                        className="h-64 w-full resize-none text-[20px] leading-loose"
                        minLength={1}
                    />
                </div>

                <AlertDialogFooter className="p-2 pt-0">
                    <p
                        className={`transition-all duration-300 ease-in-out
                            ${body.length >= 300 ? "text-red-500" : "text-muted-foreground"}`}
                    >
                        {body.length}
                    </p>
                    <CircularProgress
                        percentage={Math.min(100, Math.round((body.length / 300) * 100))}
                    />
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

function CircularProgress({ percentage }: { percentage: number }) {
    // Ensure percentage is between 0 and 100
    const normalizedPercentage = Math.min(100, Math.max(0, percentage));

    // Calculate the circle properties
    const size = 24;
    const strokeWidth = 4;
    const center = size / 2;
    const radius = center - strokeWidth;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (normalizedPercentage / 100) * circumference;

    return (
        <svg className="transform -rotate-90" width={size} height={size}>
            {/* Background circle */}
            <circle
                className="stroke-muted"
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                strokeWidth={strokeWidth}
            />

            {/* Progress circle */}
            <circle
                className={`transition-all duration-300 ease-in-out
                        ${normalizedPercentage >= 100 ? "stroke-red-500" : "stroke-muted-foreground "}
                    `}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
            />
        </svg>
    );
}
