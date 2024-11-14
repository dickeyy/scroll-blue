import { auth } from "@/lib/next-auth";

const unauthedRedirectRoutes = ["/home", "/sign-in"]; // Routes that authed users should be redirected from
const unauthedStayRoutes = ["/stats"]; // Additional routes unauthed users can stay on
const unauthedAllowedRoutes = ["/home", "/sign-in", ...unauthedStayRoutes]; // All routes unauthed users can access

export default auth((req) => {
    const pathname = req.nextUrl.pathname;

    // Case 1: Unauthed users on their allowed routes can stay
    if (!req.auth && unauthedAllowedRoutes.includes(pathname)) {
        return;
    }

    // Case 2: Authed users on unauthedRedirectRoutes should go to /
    if (req.auth && unauthedRedirectRoutes.includes(pathname)) {
        console.log("MIDDLEWARE: redirecting authed user to feed page");
        const newUrl = new URL("/", req.nextUrl.origin);
        return Response.redirect(newUrl);
    }

    // Case 3: Unauthed users not on allowed routes should go to /home
    if (!req.auth && !unauthedAllowedRoutes.includes(pathname)) {
        console.log("MIDDLEWARE: redirecting unauthed user to home page");
        const newUrl = new URL("/home", req.nextUrl.origin);
        return Response.redirect(newUrl);
    }

    // Allow all other requests to proceed
    return;
});

export const config = {
    matcher: [
        "/",
        "/home",
        "/sign-in",
        "/notifications",
        "/messages",
        "/settings",
        "/search",
        "/stats"
    ]
};
