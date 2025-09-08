//hooks/useAuth.js
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export function useAuth() {
  const { data: session, status } = useSession();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRoleFromWorker() {
      try {
        const token = localStorage.getItem("cf_jwt"); // store Worker JWT here after login
        if (!token) return;

        const res = await fetch("/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (data?.user?.role) {
          setRole(data.user.role);
        }
      } catch (err) {
        console.error("Error fetching role from worker:", err);
      }
    }

    if (status === "loading") {
      return; // still loading NextAuth
    }

    if (session?.user?.role) {
      setRole(session.user.role);
      setLoading(false);
    } else {
      fetchRoleFromWorker().finally(() => setLoading(false));
    }
  }, [session, status]);

  return {
    role,
    loading,
    isPremium: role === "CLIENT_ADMIN" || role === "GLOBAL_ADMIN" || role === "PREMIUM_USER",
    isLoggedIn: !!role,
  };
}
