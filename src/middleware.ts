import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const path = req.nextUrl.pathname;
  const isProtectedPath = path.startsWith("/dashboard");
  const isDashboardApi = path.startsWith("/api/dashboard");
  const loggedIn = !!req.auth;

  if (isProtectedPath && !loggedIn) {
    const login = new URL("/login", req.url);
    login.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(login);
  }

  if (isDashboardApi && !loggedIn) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const res = NextResponse.next();
  if (path === "/login" || path.startsWith("/dashboard")) {
    res.headers.set("x-robots-tag", "noindex, nofollow, noarchive");
  }
  return res;
});

export const config = {
  matcher: ["/((?!_next|api/auth|api/covers|favicon.ico|uploads|.*\\..*).*)"],
};
