import SignInForm from "@/components/sign-in-form";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign In · scroll.blue"
};

export default function SignInPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center">
            <SignInForm />
        </div>
    );
}
