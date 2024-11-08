export function RightSidebar() {
    return (
        <div className="sticky top-4 flex flex-col gap-4">
            <div className="rounded-xl bg-muted p-4">
                <h2 className="mb-4 font-bold">What&apos;s happening</h2>
                {/* Add trending content here */}
            </div>

            <div className="rounded-xl bg-muted p-4">
                <h2 className="mb-4 font-bold">Who to follow</h2>
                {/* Add suggested users here */}
            </div>
        </div>
    );
}
