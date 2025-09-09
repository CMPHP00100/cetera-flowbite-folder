// lib/authOptions.js
import CredentialsProvider from "next-auth/providers/credentials";

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
          // Use production API URL during build, dev URL in development
          const apiUrl = process.env.VERCEL 
            ? process.env.NEXT_PUBLIC_PROD_API_URL 
            : (process.env.NEXT_PUBLIC_DEV_API_URL || process.env.NEXT_PUBLIC_PROD_API_URL);

          // Authenticate against Cloudflare Worker API
          const response = await fetch(`${apiUrl}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const data = await response.json();
          if (!response.ok || !data.success) return null;

          let userData = {
            id: data.user.id.toString(),
            name: data.user.name,
            email: data.user.email,
            role: data.user.role || "STANDARD_USER",
            token: data.token,
          };

          // Only try local DB sync in development and when not building
          if (process.env.NODE_ENV === 'development' && !process.env.VERCEL && !process.env.CI) {
            try {
              const { getDatabase, queryStmt } = await import("@/lib/database");
              const db = getDatabase(process.env);
              
              if (db) {
                const stmt = db.prepare(`
                  SELECT id, name, email, role, access_code 
                  FROM users 
                  WHERE email = ?
                `);
                
                const localUser = await queryStmt(stmt, credentials.email);

                if (localUser) {
                  userData = {
                    ...userData,
                    id: localUser.id.toString(),
                    name: localUser.name,
                    role: localUser.role || userData.role,
                    accessCode: localUser.access_code || null,
                  };
                }
              }
            } catch (dbError) {
              console.error("Local DB sync failed, using CF Worker auth:", dbError);
              // Continue with CF Worker data if local DB fails
            }
          }

          return userData;
        } catch (err) {
          console.error("Auth error:", err);
          return null;
        }
      },
    }),
  ],
  pages: { signIn: "/account", signOut: "/account", error: "/account" },
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
        session.user.token = token.apiToken || null;
        session.user.accessCode = token.accessCode || null;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};