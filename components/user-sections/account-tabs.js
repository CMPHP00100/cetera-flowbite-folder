"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoginForm from "@/components/user-sections/login-form"; // Adjust paths as needed
import RegisterUser from "@/components/user-sections/register-modal";

const AccountTabs = () => {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <div className="mx-auto w-full max-w-xl pt-8">
      {/* Tab Buttons */}
      <div className="flex space-x-4 border-b border-gray-400 pb-4">
        <button
          className={`flex-1 py-2 text-center ${
            activeTab === "login"
              ? "font-bold text-cetera-orange"
              : "text-gray-400"
          }`}
          onClick={() => setActiveTab("login")}
        >
          <h1 className="text-6xl font-extrabold">Login</h1>
        </button>
        <span className="m-0 text-[3rem] font-thin text-cetera-orange">|</span>
        <button
          className={`flex-1 py-2 text-center ${
            activeTab === "register"
              ? "font-bold text-cetera-orange"
              : "text-gray-400"
          }`}
          onClick={() => setActiveTab("register")}
        >
          <h1 className="text-6xl font-extrabold">Register</h1>
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
              <LoginForm />
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
              <RegisterUser />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AccountTabs;
