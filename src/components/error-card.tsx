import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";

interface ErrorCardProps {
    error: {
        message: string;
        code?: number;
    };
}

export default function ErrorCard({ error }: ErrorCardProps) {
    return (
        <Card className="bg-foreground/[2%] space-y-0 gap-0">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Uh oh, something went wrong</CardTitle>
                    {error.code && (
                        <p className="font-mono text-foreground/40 text-xs">
                            Error Code: {error.code}
                        </p>
                    )}
                </div>
                <CardDescription>{error.message}</CardDescription>
            </CardHeader>
        </Card>
    );
}
