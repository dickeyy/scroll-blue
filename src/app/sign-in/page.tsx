"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/auth-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
    hostingProvider: z.string().min(2).url(),
    handle: z.string().min(1),
    password: z.string().min(1)
});

export default function SignInPage() {
    const router = useRouter();
    const { login, isAuthenticated } = useAuthStore();

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Redirect if already authenticated
        if (isAuthenticated) {
            router.push("/app");
        }
    }, [isAuthenticated, router]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            hostingProvider: "https://bsky.social",
            handle: "",
            password: ""
        }
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
            await login(values.handle, values.password);
            router.push("/app");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Authentication failed");
        } finally {
            setIsLoading(false);
        }
        setIsLoading(false);
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="font-serif font-bold text-4xl">Sign In</CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Sign in using your Bluesky credentials.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
                            <div className="flex flex-col space-y-6">
                                <FormField
                                    control={form.control}
                                    name="handle"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email or Handle</FormLabel>
                                            <FormControl>
                                                <Input placeholder="kyle.so" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password or App password</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="password"
                                                    placeholder="super-good-password"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                <a
                                                    className="underline text-blue-400"
                                                    href="https://bsky.app/settings/app-passwords"
                                                    target="_blank"
                                                >
                                                    Get an app password
                                                </a>
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <Button className="w-full" type="submit" disabled={isLoading}>
                                Sign In
                            </Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter>
                    <p className="text-xs text-muted-foreground">
                        By clicking &quot;Sign In&quot;, you agree to our{" "}
                        <a className="underline" href="terms">
                            Terms of Service
                        </a>{" "}
                        and{" "}
                        <a className="underline" href="privacy">
                            Privacy Policy
                        </a>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
