// components/user-sections/subscription.js
"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { useSession, signIn } from "next-auth/react";

export default function SubscriptionComponent() {
  const router = useRouter();
  const { data: session, status, update: updateSession } = useSession();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const [myAccessCode, setMyAccessCode] = useState("");
  const [enteredCode, setEnteredCode] = useState("");
  const [grantedAccess, setGrantedAccess] = useState([]);

  // --- Helper functions ---
  const roleToPlanType = (role) => {
    switch (role) {
      case "CLIENT_ADMIN":
      case "PREMIUM_USER":
        return "Premium";
      case "END_USER":
      default:
        return "Standard";
    }
  };

  const isPremiumRole = (role) => ["CLIENT_ADMIN", "PREMIUM_USER"].includes(role);

  const currentPlan = useMemo(() => roleToPlanType(session?.user?.role), [session?.user?.role]);
  const isCurrentlyPremium = useMemo(() => isPremiumRole(session?.user?.role), [session?.user?.role]);

  // --- API helper ---
  const subscribeApi = async (payload, method = "PUT") => {
    const res = await fetch(`/api/subscribe`, {
    //const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/subscribe`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  };

  // --- Subscribe to a plan ---
  const handleSubscribe = async (plan) => {
    if (!session?.user?.id) {
      signIn();
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const data = await subscribeApi({ planType: plan });
      if (data.success) {
        await updateSession({ ...session, user: { ...session.user, role: data.role } });
        console.log("🎉 Session updated to:", data.role);
        setMessage(`${data.message || "Subscription updated!"}`);
      } else {
        setMessage(data.error || "Subscription failed");
      }
    } catch (err) {
      console.error(err);
      setMessage("Unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // --- Premium account management ---
  const handleCreatePremiumAccount = async () => {
    if (!session?.user?.id) return;
    setLoading(true);

    try {
      const data = await subscribeApi({
        newRole: "CLIENT_ADMIN",
        accessCode: null,
        userId: session.user.id,
      });
      if (data.success) {
        setMyAccessCode(data.accessCode);
        setMessage(`🎉 Premium account created! Access code: ${data.accessCode}`);
        await updateSession({ ...session, user: { ...session.user, role: data.role } });
      } else {
        setMessage(data.error || "Failed to create premium account");
      }
    } catch (err) {
      console.error(err);
      setMessage("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAccessCode = async () => {
    if (!session?.user?.id) return;
    setLoading(true);

    try {
      const newCode = Math.random().toString(36).substr(2, 8).toUpperCase();
      const data = await subscribeApi({
        newRole: "CLIENT_ADMIN",
        accessCode: newCode,
        userId: session.user.id,
      });
      if (data.success) {
        setMyAccessCode(data.accessCode);
        setMessage(`✅ Access code updated: ${data.accessCode}`);
      } else {
        setMessage(data.error || "Failed to update access code");
      }
    } catch (err) {
      console.error(err);
      setMessage("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // --- Redeem access code ---
  const handleRedeemAccessCode = async () => {
    const code = enteredCode.trim().toUpperCase();
    if (!code) return setMessage("Please enter an access code");

    setLoading(true);
    try {
      const data = await subscribeApi({ accessCode: code }, "POST");
      if (data.success) {
        setGrantedAccess((prev) => [
          ...prev.filter((a) => a.accessCode !== data.accessCode),
          { ...data, redeemedAt: new Date().toISOString() },
        ]);
        setMessage(data.message);
        setEnteredCode("");
      } else {
        setMessage(data.error || "Invalid access code");
      }
    } catch (err) {
      console.error(err);
      setMessage("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setMessage(`📋 Copied "${text}" to clipboard!`);
    setTimeout(() => setMessage(""), 3000);
  };

  // --- Component UI ---
  if (status === "loading") {
    return <div className="flex justify-center py-20">Loading...</div>;
  }

  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Subscription Management
          </h2>
          {session && (
            <div className="mt-4 space-y-2">
              <div className="p-3 bg-blue-100 rounded-lg inline-block">
                <p className="text-blue-800 font-medium">
                  Session Role: {session.user.role || "No role"} | Plan: {currentPlan || "Unknown"}
                </p>
              </div>
            </div>
          )}
          {message && (
            <div
              className={`mt-4 p-3 rounded-lg inline-block max-w-md ${
                message.includes("✅") || message.includes("🎉")
                  ? "bg-green-100 text-green-800"
                  : message.includes("⚠️")
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              <p className="font-medium text-sm">{message}</p>
            </div>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Standard Plan */}
          <div className="bg-white rounded-3xl border p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Standard</h2>
            <button
              onClick={() => handleSubscribe("Standard")}
              disabled={loading || currentPlan === "Standard"}
              className="w-full py-3 px-6 rounded bg-gray-900 text-white disabled:opacity-50"
            >
              {currentPlan === "Standard" ? "✓ Current Plan" : "Get Standard"}
            </button>
          </div>

          {/* Premium Plan */}
          <div className="bg-white rounded-3xl border p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Premium</h2>
            <button
              onClick={() => handleSubscribe("Premium")}
              disabled={loading || currentPlan === "Premium"}
              className="w-full py-3 px-6 rounded bg-gray-900 text-white disabled:opacity-50"
            >
              {currentPlan === "Premium" ? "✓ Current Plan" : "Go Premium"}
            </button>

            {/* Access code management */}
            {isCurrentlyPremium && (
              <div className="mt-6 space-y-3">
                <button
                  onClick={handleCreatePremiumAccount}
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                  Create Premium Account
                </button>
                <button
                  onClick={handleUpdateAccessCode}
                  disabled={loading}
                  className="bg-purple-600 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                  Generate New Access Code
                </button>
                {myAccessCode && (
                  <div className="p-3 bg-gray-50 border rounded flex justify-between items-center">
                    <p className="font-mono text-sm">{myAccessCode}</p>
                    <button onClick={() => copyToClipboard(myAccessCode)} className="text-sm underline">
                      Copy
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Redeem access code */}
        <div className="mt-8 bg-green-50 p-6 rounded-lg max-w-xl mx-auto">
          <h3 className="text-xl font-bold mb-3">🎁 Redeem Access Code</h3>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Enter code"
              value={enteredCode}
              onChange={(e) => setEnteredCode(e.target.value.toUpperCase())}
              disabled={loading}
              className="flex-1 px-3 py-2 border rounded disabled:opacity-50"
            />
            <button
              onClick={handleRedeemAccessCode}
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              Redeem
            </button>
          </div>
          {grantedAccess.length > 0 && (
            <div className="mt-4 space-y-2">
              {grantedAccess.map((a, i) => (
                <div key={i} className="bg-white p-2 rounded border text-sm">
                  {a.accessCode} granted by {a.grantedBy}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
