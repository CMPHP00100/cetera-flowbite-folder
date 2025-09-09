// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions";

const { handlers } = NextAuth(authOptions);

export const { GET, POST } = handlers;

// optional: keep runtime hints
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
