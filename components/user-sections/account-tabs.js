// components/user-sections/account-tabs.js
"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import RegisterUser from "@/components/user-sections/register-user";
import Login from "@/components/user-sections/login";

// Dynamically import Dashboard to avoid SSR issues
const Dashboard = dynamic(() => import("@/components/user-sections/dashboard"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="text-white">Loading dashboard...</div>
    </div>
  )
});

const AccountTabs = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = (userData) => {
    console.log("Login successful:", userData);
    setUser(userData);
    setIsLoggedIn(true);
  };

  const handleRegistrationSuccess = (userData) => {
    console.log("Registration successful:", userData);
    setUser(userData);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setActiveTab("login");
  };

  // If user is logged in, show dashboard
  if (isLoggedIn && user) {
    return <Dashboard user={user} onLogout={handleLogout} />;
  }

  // Otherwise show login/register tabs
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="bg-cetera-gray rounded-lg shadow-xl w-full max-w-md">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-700">
          <button
            onClick={() => setActiveTab("login")}
            className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
              activeTab === "login"
                ? "text-cetera-orange border-b-2 border-orange-500 bg-gray-750"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setActiveTab("register")}
            className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
              activeTab === "register"
                ? "text-orange-500 border-b-2 border-orange-500 bg-gray-750"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Register
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === "login" && (
                <Login onLoginSuccess={handleLoginSuccess} />
              )}
              {activeTab === "register" && (
                <RegisterUser onRegistrationSuccess={handleRegistrationSuccess} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <p className="text-center text-gray-400 text-sm">
            {activeTab === "login" ? (
              <>
                Don't have an account?{" "}
                <button
                  onClick={() => setActiveTab("register")}
                  className="text-orange-500 hover:text-orange-400 font-medium"
                >
                  Sign up here
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => setActiveTab("login")}
                  className="text-orange-500 hover:text-orange-400 font-medium"
                >
                  Login here
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccountTabs;