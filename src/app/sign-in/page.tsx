import SignInForm from "@/components/sign-in-form";
import { auth } from "@/lib/next-auth";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Sign In · scroll.blue"
};

export default async function SignInPage() {
    const session = await auth();

    if (session) {
        redirect("/");
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center">
            <SignInForm />
        </div>
    );
}
