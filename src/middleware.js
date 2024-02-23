import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
  afterAuth({ userId, isPublicRoute }, req) {
    // Redirect non-signed-in users trying to access non-public URLs to the Clerk sign-in/up page
    if (!userId && !isPublicRoute) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
    // Check if the user is signed in and trying to access the index page
    if (userId && req.nextUrl.pathname === "/") {
      // Redirect signed-in users trying to access "/" to "/dashboard"
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    // Allow the request to proceed as normal
    return NextResponse.next();
  },
  publicRoutes: ["/", "/sign-in", "/sign-up"], // Ensure the sign-in page is marked as a public route
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/(api|trpc)(.*)"],
};
