import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { SessionData, sessionOptions } from "./lib/session-options";

export async function middleware(req: NextRequest) {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions,
  );
  const isLoggedIn = session.isLoggedIn;
  const { pathname } = req.nextUrl;
  const hostname = req.headers.get("x-forwarded-host") || req.nextUrl.hostname;

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!isLoggedIn) {
      console.log(
        "User not logged in, redirecting to /admin/login for /admin route",
      );
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  } else {
    if (isLoggedIn && pathname === "/admin/login") {
      console.log("User is logged in, redirecting to /admin/dashboard");
      // return NextResponse.redirect(new URL('/admin/dashboard', req.url));
      return NextResponse.redirect(new URL("/admin/country", req.url));
    }
  }

  if (pathname.startsWith("/api") && !pathname.startsWith("/api/auth")) {
    if (
      (!isLoggedIn && req.method !== "GET") ||
      (!isLoggedIn && pathname.startsWith("/api/user"))
    ) {
      console.log("Unauthorized access to API, redirecting to /admin/login");
      return NextResponse.json(
        { error: "Unauthorized, Please login again!" },
        { status: 401 },
      );
    }
    return NextResponse.next();
  }

  // if (pathname === '/') {
  //   return NextResponse.redirect(new URL('/myanmar/ads', req.url));
  // }

  if (
    (hostname === "localhost" && pathname === "/admin/login") ||
    (hostname === "shwecharity.com" && pathname === "/admin/login")
  ) {
    return NextResponse.redirect(
      "https://backofficeadmin.shwecharity.com/admin/login",
      307,
    );
  }

  if (
    (hostname === "www.shwecharity.com" && pathname === "/admin/login") ||
    (hostname === "shwecharity.com" && pathname === "/admin/login")
  ) {
    return NextResponse.redirect(
      "https://backofficeadmin.shwecharity.com/admin/login",
      307,
    );
  }

  if (
    (hostname === "www.backofficeadmin.shwecharity.com" && pathname === "/") ||
    (hostname === "backofficeadmin.shwecharity.com" && pathname === "/")
  ) {
    return NextResponse.redirect(
      "https://backofficeadmin.shwecharity.com/admin/login",
      307,
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|static|.*\\..*).*)"],
};
