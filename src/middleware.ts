import { auth } from "@/lib/next-auth";

export default auth((req) => {
    if (!req.auth && req.nextUrl.pathname !== "/sign-in") {
        const newUrl = new URL("/home", req.nextUrl.origin);
        return Response.redirect(newUrl);
    } else if (
        req.auth &&
        (req.nextUrl.pathname === "/sign-in" || req.nextUrl.pathname === "/home")
    ) {
        const newUrl = new URL("/", req.nextUrl.origin);
        return Response.redirect(newUrl);
    }
});

export const config = {
    matcher: ["/", "/sign-in", "/notifications", "/messages", "/settings", "/search"]
};
