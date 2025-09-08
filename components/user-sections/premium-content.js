"use client";

import { useSession } from "next-auth/react";

export default function PremiumContent() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;

  if (session?.user?.role === "PREMIUM_USER") {
    return (
      <div className="p-4 bg-yellow-100 rounded">
        <h2>Premium Dashboard</h2>
        <p>Exclusive premium features for you, {session.user.name}!</p>
      </div>
    );
  }

  return null;
}
