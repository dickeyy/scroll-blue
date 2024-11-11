import { auth } from "@/lib/next-auth";

export default auth((req) => {
    if (!req.auth && req.nextUrl.pathname !== "/sign-in" && req.nextUrl.pathname !== "/home") {
        const newUrl = new URL("/home", req.nextUrl.origin);
        console.log("MIDDLEWARE: redirecting to home page");
        return Response.redirect(newUrl);
    } else if (
        req.auth &&
        (req.nextUrl.pathname === "/sign-in" || req.nextUrl.pathname === "/home")
    ) {
        console.log("MIDDLEWARE: redirecting to feed page");
        const newUrl = new URL("/", req.nextUrl.origin);
        return Response.redirect(newUrl);
    }
});

export const config = {
    matcher: ["/", "/sign-in", "/notifications", "/messages", "/settings", "/search"]
};
