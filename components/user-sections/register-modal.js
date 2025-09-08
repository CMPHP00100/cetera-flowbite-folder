//components/user-sections/register-modal.js
"use client";

import { useState } from "react";
import "@/app/globals.css";
import FormPopup from "@/components/animations/form-popup";

export default function RegisterUser() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [selectedTab, setSelectedTab] = useState(""); // "regular" | "premium"
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validatePassword = (password, confirmPassword) => {
    if (password.length < 8) return "Password must be at least 8 characters.";
    if (!/[A-Z]/.test(password)) return "Must contain at least one uppercase letter.";
    if (!/[a-z]/.test(password)) return "Must contain at least one lowercase letter.";
    if (!/[0-9]/.test(password)) return "Must contain at least one number.";
    if (!/[@$!%*?&]/.test(password)) return "Must contain at least one special character (@$!%*?&).";
    if (password !== confirmPassword) return "Passwords do not match.";
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");

    if (name === "password" || name === "confirmPassword") {
      const validationError = validatePassword(
        name === "password" ? value : formData.password,
        name === "confirmPassword" ? value : formData.confirmPassword
      );
      setError(validationError);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setResponse(null);

    const validationError = validatePassword(formData.password, formData.confirmPassword);
    if (validationError) {
      setError(validationError);
      setIsSubmitting(false);
      return;
    }

    try {
      const { confirmPassword, ...apiData } = formData;
      const role = selectedTab === "premium" ? "PREMIUM_USER" : "END_USER";

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...apiData, role }),
      });

      const data = await res.json();

      if (res.ok) {
        setResponse({ success: true, user: data });
        setFormData({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
        setSelectedTab("regular");
      } else {
        if (data.error?.includes("UNIQUE constraint failed")) {
          setError("An account with this email already exists.");
        } else {
          setError(data.error || "Registration failed");
        }
        setResponse({ success: false, error: data.error });
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
      setResponse({ success: false, error: "Network error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-fluid">
      {/* Account Type Dropdown */}
      <div className="mx-auto max-w-md px-6 pt-6">
        <select
          id="accountType"
          value={selectedTab}
          onChange={(e) => setSelectedTab(e.target.value)}
          className="block w-full rounded-lg border border-cetera-mono-orange bg-cetera-light-gray p-2.5 text-sm text-cetera-mono-orange font-cetera-josefin"
        >
          <option value="" disabled>
            Select account type...
          </option>
          <option value="regular">Regular User</option>
          <option value="premium">Premium User</option>
        </select>
      </div>

      <form className="mx-auto max-w-md rounded px-6 pb-6 pt-3 font-cetera-josefin" onSubmit={handleSubmit}>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Enter name..."
          value={formData.name}
          onChange={handleChange}
          required
          className="focus:border-cetera-mono-orange mb-3 block w-full rounded-lg border border-cetera-mono-orange bg-cetera-light-gray p-2.5 text-sm text-cetera-dark-blue placeholder:text-gray-400"
        />
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Enter email..."
          value={formData.email}
          onChange={handleChange}
          required
          className="focus:border-cetera-mono-orange mb-3 block w-full rounded-lg border border-cetera-mono-orange bg-cetera-light-gray p-2.5 text-sm text-cetera-dark-blue placeholder:text-gray-400"
        />
        <input
          type="tel"
          id="phone"
          name="phone"
          placeholder="Enter phone..."
          value={formData.phone}
          onChange={handleChange}
          required
          className="focus:border-cetera-mono-orange mb-3 block w-full rounded-lg border border-cetera-mono-orange bg-cetera-light-gray p-2.5 text-sm text-cetera-dark-blue placeholder:text-gray-400"
        />
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Enter password..."
          value={formData.password}
          onChange={handleChange}
          required
          className="focus:border-cetera-mono-orange mb-3 block w-full rounded-lg border border-cetera-mono-orange bg-cetera-light-gray p-2.5 text-sm text-cetera-dark-blue placeholder:text-gray-400"
        />
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          placeholder="Confirm password..."
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          className="focus:border-cetera-mono-orange mb-3 block w-full rounded-lg border border-cetera-mono-orange bg-cetera-light-gray p-2.5 text-sm text-cetera-dark-blue placeholder:text-gray-400"
        />

        {error && <p className="text-red-500 mb-3 text-sm">{error}</p>}

        <div className="mb-4 mt-6 flex items-start">
          <input
            id="terms"
            type="checkbox"
            required
            className="focus:ring-3 focus:cetera-orange size-4 rounded border border-gray-300 bg-gray-50 active:bg-cetera-mono-orange"
          />
          <label htmlFor="terms" className="ms-2 text-sm font-medium text-white">
            I agree with the{" "}
            <a href="#" className="text-cetera-mono-orange hover:underline">
              terms and conditions
            </a>
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-cetera-mono-orange py-2.5 text-center text-md font-medium text-cetera-dark-blue hover:border hover:border-cetera-mono-orange hover:bg-cetera-dark-blue hover:text-cetera-mono-orange disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              Registering...
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            </span>
          ) : (
            "Register new account"
          )}
        </button>
      </form>

      {response && response.success && (
        <FormPopup
          isVisible={true}
          onClose={() => setResponse(null)}
          alertMessage="Congratulations! You're registered!"
        />
      )}

      {response && !response.success && (
        <FormPopup
          isVisible={true}
          onClose={() => setResponse(null)}
          alertMessage={`Registration failed: ${response.error}`}
        />
      )}
    </div>
  );
}
