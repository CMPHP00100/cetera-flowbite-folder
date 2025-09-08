//app/subscription/page.js
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import SubscriptionComponent from "@/components/user-sections/subscription";

export default function SubscriptionPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    console.log('Subscription page debug:', {
      status,
      session,
      userRole: session?.user?.role
    });
    if (status === "loading") return; // wait for session check

    if (!session) {
      router.push("/account"); // redirect unauthenticated users
    } else if (session.user.role === "PREMIUM_USER") {
      router.push("/premium"); // redirect already premium users
    }
    // else, show subscription options
  }, [session, status, router]);

  if (status === "loading" || !session || session.user.role === "PREMIUM_USER") {
    return null; // optionally add a loader
  }

  return (
    <div>
      <SubscriptionComponent />
    </div>
  );
}