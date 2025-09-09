// lib/authOptions.js
import CredentialsProvider from "next-auth/providers/credentials";
import { getDatabase } from "@/lib/database";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          // Authenticate against Cloudflare Worker API
          const response = await fetch(
            "https://sandbox_flowbite.raspy-math-fdba.workers.dev/login",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            }
          );

          const data = await response.json();
          if (!response.ok || !data.success) return null;

          let userData = {
            id: data.user.id.toString(),
            name: data.user.name,
            email: data.user.email,
            role: data.user.role || "STANDARD_USER",
            token: data.token,
          };

          // Optional: enhance with local DB values (role, access_code)
          try {
            const db = getDatabase(process.env);
            const stmt = db.prepare(`
              SELECT id, name, email, role, access_code 
              FROM users 
              WHERE email = ?
            `);
            const localUser = stmt.get(credentials.email);

            if (localUser) {
              userData = {
                id: localUser.id.toString(),
                name: localUser.name,
                email: localUser.email,
                role: localUser.role || userData.role,
                accessCode: localUser.access_code,
                token: data.token,
              };
            }
          } catch (dbError) {
            console.error("DB error, falling back to CF Worker data:", dbError);
          }

          return userData;
        } catch (err) {
          console.error("Auth error:", err);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/account",
    signOut: "/account",
    error: "/account",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.apiToken = user.token;
        token.accessCode = user.accessCode || null;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub;
        session.user.role = token.role || "STANDARD_USER";
        session.user.token = token.apiToken;
        session.user.accessCode = token.accessCode || null;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret",
  debug: true,
};
