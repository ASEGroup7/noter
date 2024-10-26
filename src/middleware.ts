import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)", "/", "/api/uploadthing"]);

export default clerkMiddleware(
  (auth, request) => {
    // Since we want all routes to be public, no need to check for authentication
    // No calls to auth().protect() are made
  },
  { 
    debug: false,
  }
);

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
