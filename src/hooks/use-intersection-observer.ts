// hooks/use-intersection-observer.ts
import { useEffect } from "react";

interface UseIntersectionObserverProps {
    target: React.RefObject<Element>;
    onIntersect: () => void;
    enabled?: boolean;
    threshold?: number;
    rootMargin?: string;
}

export function useIntersectionObserver({
    target,
    onIntersect,
    enabled = true,
    threshold = 0.1,
    rootMargin = "0px"
}: UseIntersectionObserverProps) {
    useEffect(() => {
        if (!enabled) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) onIntersect();
                });
            },
            {
                threshold,
                rootMargin
            }
        );

        const element = target.current;
        if (!element) return;

        observer.observe(element);
        return () => {
            observer.unobserve(element);
        };
    }, [target, enabled, onIntersect, threshold, rootMargin]);
}
