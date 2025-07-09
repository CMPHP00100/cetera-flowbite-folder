// app/account/page.js
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import RegisterUser from "@/components/user-sections/register-modal";
import "../../components/custom-styles/account.css";

const LoginForm = dynamic(() => import("@/components/user-sections/login-form"), { ssr: false });
const Dashboard = dynamic(() => import("@/components/user-sections/dashboard"), { ssr: false });

const AccountTabs = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [user, setUser] = useState(null);

  const handleLogin = async (credentials) => {
    try {
      console.log('Attempting login with:', credentials);
      
      const response = await fetch('https://sandbox_flowbite.raspy-math-fdba.workers.dev/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email || credentials.username,
          password: credentials.password
        })
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        // Login successful
        setUser(data.user);
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        console.log(`Welcome back, ${data.user.name}, ${data.user.id}, ${data.user.created_at}, ${data.user.updated_at}, ${data.user.role}!`);
      } else {
        // Login failed
        alert("Login failed: " + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Login error:', error);
      alert("Login failed: Network error");
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setActiveTab("login"); // Reset to login tab
  };

  const handleRegistration = (userData) => {
    console.log('Registration successful:', userData);
    setActiveTab("login");
  };

  // Check if user is already logged in on component mount
  React.useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
      }
    }
  }, []);

  // If user is logged in, show full dashboard
  if (user) {
    return <Dashboard user={user} onLogout={handleLogout} />;
  }

  // Show login/register tabs if not logged in
  return (
    <div class="mx-auto my-8 lg:my-8 w-full max-w-[95vw] sm:max-w-[90vw] md:max-w-[800px] lg:max-w-[1000px] px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6 lg:py-8 bg-dark-blue rounded-lg sm:rounded-xl">
    {/*<div className="mx-auto my-8 w-[1000px] pt-8 bg-dark-blue rounded-lg">*/}
      {/* Tab Buttons */}
      <div className="flex space-x-4 border-b border-gray-400 pb-4">
        <button
          className={`flex-1 py-2 text-center ${
            activeTab === "login" ? "font-bold text-cetera-orange" : "text-gray-400"
          }`}
          onClick={() => setActiveTab("login")}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold">Login</h1>
        </button>
        <span className="m-0 text-[3rem] font-thin text-cetera-orange">|</span>
        <button
          className={`flex-1 py-2 text-center ${
            activeTab === "register" ? "font-bold text-cetera-orange" : "text-gray-400"
          }`}
          onClick={() => setActiveTab("register")}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold">Register</h1>
        </button>
      </div>

      {/* Animated Tab Content */}
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
