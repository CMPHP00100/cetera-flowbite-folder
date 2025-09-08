// hooks/usePremiumAccess.js
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export function usePremiumAccess() {
  const { data: session, status } = useSession();
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      if (status === "loading") return;
      
      if (!session?.user?.id) {
        setHasAccess(false);
        setLoading(false);
        return;
      }

      // Check if user is premium
      if (session.user.role === "PREMIUM_USER") {
        setHasAccess(true);
        setLoading(false);
        return;
      }

      // Check if user has been granted access via access code
      try {
        const response = await fetch("/api/premium-access/check");
        const data = await response.json();
        setHasAccess(data.hasAccess || false);
      } catch (error) {
        console.error("Error checking premium access:", error);
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [session, status]);

  return {
    hasAccess,
    loading,
    isPremiumUser: session?.user?.role === "PREMIUM_USER",
    accessCode: session?.user?.accessCode
  };
}