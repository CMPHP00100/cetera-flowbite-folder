// middleware.js
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { hasAccess } from "@/lib/access";

async function verifyJWT(token, secret) {
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    return payload;
  } catch {
    return null;
  }
}

export async function middleware(req) {
  const url = req.nextUrl.clone();

  if (url.pathname.startsWith("/dashboard/premium") || url.pathname.startsWith("/premium")) {
    let role = null;

    // ✅ NextAuth cookie
    const cookieToken =
      req.cookies.get("next-auth.session-token")?.value ||
      req.cookies.get("__Secure-next-auth.session-token")?.value;
    if (cookieToken) {
      const payload = await verifyJWT(cookieToken, process.env.NEXTAUTH_SECRET);
      role = payload?.role || null;
    }

    // ✅ Authorization header (Cloudflare Worker tokens)
    if (!role) {
      const authHeader = req.headers.get("Authorization");
      if (authHeader?.startsWith("Bearer ")) {
        const bearerToken = authHeader.split(" ")[1];
        const payload = await verifyJWT(bearerToken, process.env.JWT_SECRET);
        role = payload?.role || null;
      }
    }

    // ✅ Access check (only PREMIUM_USER for now)
    if (!role || !hasAccess(role, "premium")) {
      url.pathname = "/account";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/premium/:path*", "/premium/:path*"],
};
