// app/account/page.js
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signIn, signOut } from "next-auth/react";
import dynamic from "next/dynamic";
import RegisterUser from "@/components/user-sections/register-modal";
import "../../components/custom-styles/account.css";

const LoginForm = dynamic(() => import("@/components/user-sections/login-form"), { ssr: false });
const Dashboard = dynamic(() => import("@/components/user-sections/dashboard"), { ssr: false });

const AccountTabs = () => {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState("login");

  const handleLogin = async (credentials) => {
    try {
      const result = await signIn("credentials", {
        email: credentials.email || credentials.username,
        password: credentials.password,
        redirect: false,
      });

      if (result?.error) {
        alert("Login failed: " + result.error);
      } else if (result?.ok) {
        // Login successful - NextAuth will handle the session
        console.log("Login successful");
      }
    } catch (error) {
      console.error('Login error:', error);
      alert("Login failed: Network error");
    }
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    setActiveTab("login");
  };

  const handleUserUpdate = (updatedUser) => {
    // For now, just log - NextAuth handles session updates differently
    console.log('User updated:', updatedUser);
  };

  const handleRegistration = (userData) => {
    console.log('Registration successful:', userData);
    setActiveTab("login");
  };

  // Clear any old localStorage data
  useEffect(() => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
  }, []);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  // If user is logged in via NextAuth, show dashboard
  if (session?.user) {
    return (
      <Dashboard 
        user={session.user} 
        onLogout={handleLogout} 
        onUserUpdate={handleUserUpdate} 
      />
    );
  }

  // Show login/register tabs if not logged in
  return (
    <div className="mx-auto my-8 lg:my-8 w-full max-w-[95vw] sm:max-w-[90vw] md:max-w-[800px] lg:max-w-[1000px] px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6 lg:py-8 bg-cetera-dark-blue rounded-lg sm:rounded-xl">
      {/* Rest of your existing JSX remains the same */}
      <div className="flex space-x-4 border-b border-gray-400 pb-4">
        <button
          className={`flex-1 py-2 text-center ${
            activeTab === "login" ? "font-bold text-cetera-mono-orange" : "text-gray-400"
          }`}
          onClick={() => setActiveTab("login")}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold">Login</h1>
        </button>
        <span className="m-0 text-[3rem] font-thin text-cetera-mono-orange">|</span>
        <button
          className={`flex-1 py-2 text-center ${
            activeTab === "register" ? "font-bold text-cetera-mono-orange" : "text-gray-400"
          }`}
          onClick={() => setActiveTab("register")}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold">Register</h1>
        </button>
      </div>

      <div className="relative mt-4 h-[600px] overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === "login" ? (
            <motion.div
              key="login"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute w-full"
            >
              <LoginForm onLogin={handleLogin} />
            </motion.div>
          ) : (
            <motion.div
              key="register"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute w-full"
            >
              <RegisterUser onRegistration={handleRegistration} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AccountTabs;