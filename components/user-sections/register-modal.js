//components/user-sections/register-modal.js
"use client";

import { useState } from "react";
import "@/app/globals.css";
import FormPopup from "@/components/animations/form-popup";

export default function RegisterUser() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "END_USER",
  });
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
    setError(""); // Clear error on input change

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

      const res = await fetch("https://sandbox_flowbite.raspy-math-fdba.workers.dev/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiData),
      });

      const data = await res.json();

      if (res.ok) {
        setResponse({ success: true, user: data });
        setFormData({ name: "", email: "", password: "", confirmPassword: "", role: "END_USER" });
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
      <form className="mx-auto max-w-md rounded p-6" onSubmit={handleSubmit}>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Enter name..."
          value={formData.name}
          onChange={handleChange}
          required
          className="focus:border-cetera-orange mb-3 block w-full rounded-lg border border-white bg-dark-blue p-2.5 text-sm text-white placeholder:text-gray-400"
        />
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Enter email..."
          value={formData.email}
          onChange={handleChange}
          required
          className="focus:border-cetera-orange mb-3 block w-full rounded-lg border border-white bg-dark-blue p-2.5 text-sm text-white placeholder:text-gray-400"
        />
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Enter password..."
          value={formData.password}
          onChange={handleChange}
          required
          className="focus:border-cetera-orange mb-3 block w-full rounded-lg border border-white bg-dark-blue p-2.5 text-sm text-white placeholder:text-gray-400"
        />
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          placeholder="Confirm password..."
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          className="focus:border-cetera-orange mb-3 block w-full rounded-lg border border-white bg-dark-blue p-2.5 text-sm text-white placeholder:text-gray-400"
        />

        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="focus:border-cetera-orange mb-3 block w-full rounded-lg border border-white bg-dark-blue p-2.5 text-sm text-white"
        >
          <option value="END_USER">End User</option>
          <option value="ADMIN">Admin</option>
          <option value="GLOBAL_ADMIN">Global Admin</option>
        </select>

        {error && <p className="text-red-500 mb-3 text-sm">{error}</p>}

        <div className="mb-4 mt-6 flex items-start">
          <div className="h-5 flex items-center">
            <input
              id="terms"
              type="checkbox"
              required
              className="focus:ring-3 focus:cetera-orange size-4 rounded border border-gray-300 bg-gray-50 active:bg-cetera-orange"
            />
          </div>
          <label htmlFor="terms" className="ms-2 text-sm font-medium text-white">
            I agree with the{" "}
            <a href="#" className="text-cetera-orange hover:underline">
              terms and conditions
            </a>
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-cetera-orange py-2.5 text-center text-sm font-medium text-dark-blue hover:border hover:border-cetera-orange hover:bg-dark-blue hover:text-cetera-orange focus:outline-none focus:ring-0 disabled:opacity-50 disabled:cursor-not-allowed"
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
