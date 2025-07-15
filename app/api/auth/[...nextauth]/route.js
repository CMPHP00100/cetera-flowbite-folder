// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "Username main man" },
        password: { label: "Password", type: "password", placeholder: "Password" },
      },
      async authorize(credentials) {
        // Mock authentication for now
        console.log("Authorize called with:", credentials);
        
        if (credentials?.username && credentials?.password) {
          return {
            id: "1",
            username: credentials.username,
            email: `${credentials.username}@example.com`,
          };
        }
        
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/account",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.username = token.username;
      }
      return session;
    },
  },
};

// Create the NextAuth handler
const nextAuthHandler = NextAuth(authOptions);

// Create wrapper functions that satisfy Next.js 15's type requirements
export async function GET(request, context) {
  return nextAuthHandler(request, context);
}

export async function POST(request, context) {
  return nextAuthHandler(request, context);
}