//components/user-sections/role-switcher.js
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function RoleSwitcher({ currentRole, onRoleChange }) {
  const [role, setRole] = useState(currentRole);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRoleChange = async (newRole) => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/account/update-role", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newRole }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update role");

      setRole(data.user.role);
      if (onRoleChange) onRoleChange(data.user.role);

      // Refresh NextAuth session without redirect
      await signIn(undefined, { redirect: false });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded">
      <p>Current role: <strong>{role}</strong></p>

      <div className="flex gap-2 mt-3">
        <button
          disabled={loading || role === "PREMIUM_USER"}
          onClick={() => handleRoleChange("PREMIUM_USER")}
          className="bg-green-500 text-white px-3 py-1 rounded disabled:opacity-50"
        >
          Upgrade to Premium
        </button>

        <button
          disabled={loading || role === "END_USER"}
          onClick={() => handleRoleChange("END_USER")}
          className="bg-gray-500 text-white px-3 py-1 rounded disabled:opacity-50"
        >
          Downgrade to Regular
        </button>
      </div>

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
