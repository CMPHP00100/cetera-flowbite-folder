// app/premium/page.js
"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Crown, Star, Zap, Shield, TrendingUp } from "lucide-react";

export default function PremiumPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  /*useEffect(() => {
    if (!loading && (!user || (user.role !== "PREMIUM_USER" && user.role !== "PREMIUM"))) {
      router.push("/upgrade"); // redirect non-premium users
    }
  }, [user, loading, router]);*/

  useEffect(() => {
    if (!user) {
      router.push("/account");
    } else if (user.role !== "PREMIUM_USER") {
      router.push("/subscription");
    }
  }, [user, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading premium content...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "PREMIUM_USER") {
    return <p>Loading...</p>;
  }
  /*if (!user || (user.role !== "PREMIUM_USER" && user.role !== "PREMIUM")) {
    return null; // Will redirect in useEffect
  }*/


  return (
    <>
      <div className="min-h-screen bg-gray-900 text-white">
        <h1>Welcome to the Premium Area</h1>
        {/* Premium Header */}
        <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border-b border-yellow-500/30">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-full flex items-center justify-center">
                  <Crown className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">Welcome to Premium</h1>
                  <p className="text-yellow-400 font-medium">Exclusive access for {user.name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Crown className="h-5 w-5 text-yellow-400" />
                <span className="text-yellow-400 font-medium">PREMIUM MEMBER</span>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Features Grid */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-gray-800 to-yellow-900/20 border border-yellow-500/30 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Zap className="h-8 w-8 text-yellow-400" />
                <h3 className="text-xl font-bold text-white">Advanced Analytics</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Get detailed insights and analytics that aren't available to free users.
              </p>
              <div className="bg-yellow-900/30 rounded p-3">
                <p className="text-yellow-400 text-sm font-medium">✓ Premium Feature Active</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-yellow-900/20 border border-yellow-500/30 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="h-8 w-8 text-yellow-400" />
                <h3 className="text-xl font-bold text-white">Priority Support</h3>
              </div>
              <p className="text-gray-300 mb-4">
                24/7 premium support with faster response times and dedicated assistance.
              </p>
              <div className="bg-yellow-900/30 rounded p-3">
                <p className="text-yellow-400 text-sm font-medium">✓ Premium Feature Active</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-yellow-900/20 border border-yellow-500/30 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Star className="h-8 w-8 text-yellow-400" />
                <h3 className="text-xl font-bold text-white">Exclusive Content</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Access to premium-only features, content, and early beta releases.
              </p>
              <div className="bg-yellow-900/30 rounded p-3">
                <p className="text-yellow-400 text-sm font-medium">✓ Premium Feature Active</p>
              </div>
            </div>
          </div>

          {/* Premium Stats */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <TrendingUp className="h-6 w-6 text-yellow-400 mr-2" />
              Your Premium Stats
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-gray-800 to-yellow-900/20 border border-yellow-500/30 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">∞</div>
                <div className="text-white font-medium">Unlimited Access</div>
                <div className="text-gray-400 text-sm">No restrictions</div>
              </div>
              <div className="bg-gradient-to-br from-gray-800 to-yellow-900/20 border border-yellow-500/30 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">24/7</div>
                <div className="text-white font-medium">Premium Support</div>
                <div className="text-gray-400 text-sm">Always available</div>
              </div>
              <div className="bg-gradient-to-br from-gray-800 to-yellow-900/20 border border-yellow-500/30 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">100+</div>
                <div className="text-white font-medium">Premium Features</div>
                <div className="text-gray-400 text-sm">And growing</div>
              </div>
              <div className="bg-gradient-to-br from-gray-800 to-yellow-900/20 border border-yellow-500/30 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">1st</div>
                <div className="text-white font-medium">Priority Access</div>
                <div className="text-gray-400 text-sm">Beta features</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
