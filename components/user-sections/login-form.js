"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import FormPopup from "@/components/animations/form-popup";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showTruePopup, setShowTruePopup] = useState(false);
  const [showFalsePopup, setShowFalsePopup] = useState(false);

  /*   const [users, setUsers] = useState([]);
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setShowFalsePopup(true);
        throw new Error(data.error || "Login failed");
      }

      // Clear form fields
      setEmail("");
      setPassword("");

      if (res.ok) {
        //Set Popup
        setShowTruePopup(true);
      }

      // Redirect after 2 seconds
      /*  setTimeout(() => {
        setShowPopup(false);
        window.location.href = "/"; // Change to your desired page
      }, 2000); */
    } catch (error) {
      setError(error.message);
      console.error("Error:", error);
      setResponse({ success: false, error: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  if (error) return <div>{error}</div>;

  return (
    <div className="container-fluid">
      <form onSubmit={handleLogin} className="mx-auto max-w-md rounded p-6">
        {/* <h2 className="mb-4 text-xl font-bold">Login</h2> */}

        {error && <p className="text-red-500">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="focus:border-cetera-orange! mb-3 block w-full rounded-lg border border-white bg-dark-blue p-2.5 text-sm text-white placeholder:text-gray-400"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="focus:border-cetera-orange! mb-4 block w-full rounded-lg border border-white bg-dark-blue p-2.5 text-sm text-white placeholder:text-gray-400"
        />

        <button
          type="submit"
          disabled={loading}
          className="!hover:text-cetera-orange w-full rounded-lg bg-cetera-orange py-2.5 text-center text-sm font-medium text-dark-blue hover:border hover:border-cetera-orange hover:bg-dark-blue hover:text-cetera-orange focus:outline-none focus:ring-4"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      {showTruePopup && (
        <FormPopup
          isVisible={handleLogin}
          onClose={() => setShowTruePopup(false)}
          alertMessage={"You're Logged In!"}
        />
      )}
      {showFalsePopup && (
        <FormPopup
          isVisible={handleLogin}
          onClose={() => setShowFalsePopup(false)}
          alertMessage={"There was an error with your login."}
        />
      )}
    </div>
  );
};

export default LoginForm;
