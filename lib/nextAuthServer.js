// lib/nextAuthServer.js
import NextAuth from "next-auth";
import { authOptions } from "./authOptions";

const { auth, signIn, signOut } = NextAuth(authOptions);

export { auth, signIn, signOut, authOptions };
