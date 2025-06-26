import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/account", // Redirect to your custom account page for login
  },
  callbacks: {
    authorized: ({ token }) => !!token,
  },
});

export const config = {
  matcher: ["/dashboard/:path*"], // Apply middleware to dashboard routes
};
