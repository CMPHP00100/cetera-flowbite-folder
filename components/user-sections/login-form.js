// components/user-sections/login-form.js
"use client";

import React, { useState } from 'react';

const LoginForm = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Call the parent's login handler
      await onLogin(formData);
    } catch (error) {
      console.error('Login form error:', error);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-4">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="focus:border-cetera-orange mb-3 block w-full rounded-lg border border-white bg-dark-blue p-2.5 text-sm text-white placeholder:text-gray-400"
            placeholder="Enter your email"
            disabled={isLoading}
          />
        </div>

        <div>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="focus:border-cetera-orange mb-3 block w-full rounded-lg border border-white bg-dark-blue p-2.5 text-sm text-white placeholder:text-gray-400"
            placeholder="Enter your password"
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !formData.email || !formData.password}
          className="w-full rounded-lg bg-cetera-orange py-2.5 text-center text-sm font-medium text-dark-blue hover:border hover:border-cetera-orange hover:bg-dark-blue hover:text-cetera-orange focus:outline-none focus:ring-0 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Logging in...
            </div>
          ) : (
            'Login'
          )}
        </button>
      </form>

      {/* Test credentials helper */}
      <div className="mt-6 p-4 bg-blue-500/20 border border-blue-500 rounded-lg">
        <h3 className="text-blue-200 font-semibold text-sm mb-2">Test Credentials:</h3>
        <p className="text-blue-300 text-xs">
          Use an email and password combination that you registered earlier.
          If you haven't registered yet, switch to the Register tab first.
        </p>
      </div>
    </div>
  );
};

export default LoginForm;