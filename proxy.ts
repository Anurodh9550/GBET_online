import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE = "gbet_student_session";
const PUBLIC_PAGES = [
  "/student/login",
  "/student/register",
  "/student/forgot-password",
  "/student/reset-password",
];

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const signedIn = request.cookies.has(SESSION_COOKIE);
  const isPublic = PUBLIC_PAGES.some(
    (page) => pathname === page || pathname.startsWith(`${page}/`),
  );

  if (!isPublic && !signedIn) {
    const login = new URL("/student/login", request.url);
    login.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(login);
  }
  if (
    signedIn &&
    (pathname === "/student/login" || pathname === "/student/register")
  ) {
    return NextResponse.redirect(new URL("/student", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/student", "/student/:path*"],
};
