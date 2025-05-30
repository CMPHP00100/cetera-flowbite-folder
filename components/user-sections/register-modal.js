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
  });
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function to validate password
  const validatePassword = (password, confirmPassword) => {
    if (password.length < 8) return "Password must be at least 8 characters.";
    if (!/[A-Z]/.test(password))
      return "Must contain at least one uppercase letter.";
    if (!/[a-z]/.test(password))
      return "Must contain at least one lowercase letter.";
    if (!/[0-9]/.test(password)) return "Must contain at least one number.";
    if (!/[@$!%*?&]/.test(password))
      return "Must contain at least one special character (@$!%*?&).";
    if (password !== confirmPassword) return "Passwords do not match.";
    return ""; // No errors
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "password" || name === "confirmPassword") {
      const validationError = validatePassword(
        name === "password" ? value : formData.password,
        name === "confirmPassword" ? value : formData.confirmPassword,
      );
      setError(validationError);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(""); // Clear previous errors

    const validationError = validatePassword(
      formData.password,
      formData.confirmPassword,
    );
    if (validationError) {
      setError(validationError);
      return;
    }

    // Simulate API request delay
    await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 sec delay

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setResponse(data);
      console.error(data);
      setIsSubmitting(false);
      // Clear the form fields
      setFormData({ name: "", email: "", password: "", confirmPassword: "" });
    } catch (error) {
      console.error("Error:", error);
      setResponse({ success: false, error: "Something went wrong" });
    }
  };

  return (
    <div class="container-fluid">
      <form className="mx-auto max-w-md rounded p-6" onSubmit={handleSubmit}>
        <input
          type="name"
          id="name"
          name="name"
          className="focus:border-cetera-orange! mb-3 block w-full rounded-lg border border-white bg-dark-blue p-2.5 text-sm text-white placeholder:text-gray-400"
          placeholder="Enter name..."
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          id="email"
          name="email"
          className="focus:border-cetera-orange! mb-3 block w-full rounded-lg border border-white bg-dark-blue p-2.5 text-sm text-white placeholder:text-gray-400"
          placeholder="Enter email..."
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          id="password"
          name="password"
          className="focus:border-cetera-orange! mb-3 block w-full rounded-lg border border-white bg-dark-blue p-2.5 text-sm text-white placeholder:text-gray-400"
          placeholder="Enter password..."
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          className="focus:border-cetera-orange! mb-3 block w-full rounded-lg border border-white bg-dark-blue p-2.5 text-sm text-white placeholder:text-gray-400"
          placeholder="Confirm password..."
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        {/* Display error messages */}
        {error && <p className="text-red-500">{error}</p>}
        <div className="mb-4 mt-6 flex items-start">
          <div className="h-5 flex items-center">
            <input
              id="terms"
              type="checkbox"
              value=""
              className="focus:ring-3 focus:cetera-orange size-4 rounded border border-gray-300 bg-gray-50 active:bg-cetera-orange"
              required
            />
          </div>
          <label for="terms" className="ms-2 text-sm font-medium text-white">
            I agree with the{" "}
            <a href="#" className="text-cetera-orange hover:underline">
              terms and conditions
            </a>
          </label>
        </div>
        <button
          type="submit"
          className="!hover:text-cetera-orange w-full rounded-lg bg-cetera-orange py-2.5 text-center text-sm font-medium text-dark-blue hover:border hover:border-cetera-orange hover:bg-dark-blue hover:text-cetera-orange focus:outline-none focus:ring-0"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              Verifying...
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            </span>
          ) : (
            "Register new account"
          )}
        </button>
      </form>
      {response && (
        <div
          style={{
            marginTop: "1rem",
            color: response.success ? "green" : "red",
          }}
        >
          {response.success ? (
            <FormPopup
              isVisible={handleSubmit}
              onClose={() => setResponse(null)}
              alertMessage={"Congratulations you're registered!"}
            />
          ) : (
            response.error
          )}
        </div>
      )}
    </div>
  );
}
