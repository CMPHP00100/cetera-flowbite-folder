//components/user-sections/require-premium.js
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function RequirePremium({ children }) {
  const { user } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.role === "PREMIUM_USER") {
        setIsAuthorized(true);
      } else {
        // Redirect non-premium users to another page
        router.replace("/account");
      }
    }
  }, [user, router]);

  // Optionally, show a loading state while checking auth
  if (!user) {
    return <p className="text-center py-20">Checking account...</p>;
  }

  if (!isAuthorized) {
    return <p className="text-center py-20">Redirecting...</p>;
  }

  return <>{children}</>;
}