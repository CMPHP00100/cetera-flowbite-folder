// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions";

// Destructure the nested "handlers" object
const { handlers, auth, signIn, signOut } = NextAuth(authOptions);

// (Optional) debug – remove after confirming
console.log("Auth handlers ready?", !!handlers?.GET, !!handlers?.POST);

export const { GET, POST } = handlers;
export { auth, signIn, signOut };

// (Optional) helps avoid caching/runtime mismatches in some setups
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
