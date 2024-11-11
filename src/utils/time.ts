export function getPostAge(indexedAt: string): string {
    const date = new Date(indexedAt);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const seconds = Math.floor(diff / 1000);
    if (seconds < 60) return `${seconds}s`;

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;

    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d`;

    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
    });
}

export function getPostTime(indexedAt: string): string {
    return new Date(indexedAt).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true
    });
}

export function formatDateString(createdAt: string): string {
    return new Date(createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric"
    });
}
