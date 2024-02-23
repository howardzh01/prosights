import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
  afterAuth({ userId, isPublicRoute }, req) {
    // Check if the user is signed in and trying to access the index page
    if (userId && req.nextUrl.pathname === "/") {
      // Redirect signed-in users trying to access "/" to "/dashboard"
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    // Allow the request to proceed as normal
    return NextResponse.next();
  },
  publicRoutes: ["/"],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/(api|trpc)(.*)"],
};
