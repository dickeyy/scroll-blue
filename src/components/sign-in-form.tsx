"use client";

import { Spinner } from "@/components/spinner";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
    hostingProvider: z.string().min(2).url(),
    handle: z.string().min(1),
    password: z.string().min(1)
});

export default function SignInForm() {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);

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
            // await signin(values.handle, values.password);
            const result = await signIn("atproto", {
                identifier: values.handle,
                password: values.password,
                redirect: false,
                redirectTo: "/"
            });

            if (result?.error) {
                throw new Error(result.error);
            }

            if (!result?.ok) {
                throw new Error("Authentication failed");
            }

            toast.success("Welcome back!");
            router.push("/");
        } catch (error) {
            console.error(error);
            toast.error(error instanceof Error ? error.message : "Authentication failed");
            form.setFocus("password");
        } finally {
            setIsLoading(false);
        }
        setIsLoading(false);
    }

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="font-serif font-bold text-4xl">Sign In</CardTitle>
                <CardDescription className="text-muted-foreground">
                    Sign in using your{" "}
                    <span className="underline hover:text-foreground transition-colors">
                        <Link href="https://bsky.social">Bluesky</Link>
                    </span>{" "}
                    credentials.
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
                                        <FormLabel>Identifier (Email or Handle)</FormLabel>
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
                            {isLoading ? <Spinner className="mr-2" size={16} /> : "Sign In"}
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
    );
}
