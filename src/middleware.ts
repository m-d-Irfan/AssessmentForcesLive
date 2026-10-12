import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("devassess_token")?.value;
  const role = request.cookies.get("devassess_role")?.value?.toUpperCase();

  const isAdminRoute = pathname.startsWith("/admin");
  const isRecruiterRoute = pathname.startsWith("/recruiter");
  const isCandidateRoute = pathname.startsWith("/candidate");
  const isProtectedRoute = isAdminRoute || isRecruiterRoute || isCandidateRoute;

  // Free public sandbox problem accessible to all visitors without login
  const isFreeProblemRoute =
    pathname === "/candidate/assessments/seed_backend" ||
    pathname === "/candidate/assessments/seed_problem_typescript";

  // If trying to access a protected route without auth token
  if (isProtectedRoute && !token && !isFreeProblemRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    const redirectResponse = NextResponse.redirect(loginUrl);
    redirectResponse.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
    redirectResponse.headers.set("Pragma", "no-cache");
    return redirectResponse;
  }

  // If user is authenticated and trying to access wrong role dashboard
  if (token && role) {
    if (isAdminRoute && role !== "ADMIN") {
      const redirectPath = role === "RECRUITER" ? "/recruiter" : "/candidate";
      const res = NextResponse.redirect(new URL(redirectPath, request.url));
      res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
      return res;
    }

    if (isRecruiterRoute && role !== "RECRUITER" && role !== "ADMIN") {
      const res = NextResponse.redirect(new URL("/candidate", request.url));
      res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
      return res;
    }

    if (isCandidateRoute && role !== "CANDIDATE" && role !== "ADMIN") {
      // Allow recruiters/employers to test and preview candidate assessment sandboxes
      if (pathname.startsWith("/candidate/assessments")) {
        const res = NextResponse.next();
        res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
        return res;
      }
      const res = NextResponse.redirect(new URL("/recruiter", request.url));
      res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
      return res;
    }

    // If logged in and visiting login or register, redirect to their dashboard
    if (pathname === "/login" || pathname === "/register") {
      const target =
        role === "ADMIN"
          ? "/admin"
          : role === "RECRUITER"
          ? "/recruiter"
          : "/candidate";
      return NextResponse.redirect(new URL(target, request.url));
    }
  }

  const response = NextResponse.next();
  if (isProtectedRoute) {
    // SECURITY: Disallow caching of all authenticated dashboard and assessment data
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0"
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
  }
  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/recruiter/:path*",
    "/candidate/:path*",
    "/login",
    "/register",
  ],
};
