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
    return NextResponse.redirect(loginUrl);
  }

  // If user is authenticated and trying to access wrong role dashboard
  if (token && role) {
    if (isAdminRoute && role !== "ADMIN") {
      const redirectPath = role === "RECRUITER" ? "/recruiter" : "/candidate";
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }

    if (isRecruiterRoute && role !== "RECRUITER" && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/candidate", request.url));
    }

    if (isCandidateRoute && role !== "CANDIDATE" && role !== "ADMIN") {
      // Allow recruiters/employers to test and preview candidate assessment sandboxes
      if (pathname.startsWith("/candidate/assessments")) {
        return NextResponse.next();
      }
      return NextResponse.redirect(new URL("/recruiter", request.url));
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

  return NextResponse.next();
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
