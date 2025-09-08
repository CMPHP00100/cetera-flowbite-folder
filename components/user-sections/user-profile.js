// components/user/user-profile.js
"use client";

import { useSession, signOut } from "next-auth/react";

export default function UserProfile() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="p-4">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-200 h-10 w-10"></div>
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-600 mb-4">You are not signed in</p>
        <a 
          href="/login" 
          className="inline-block bg-cetera-mono-orange text-cetera-dark-blue px-4 py-2 rounded hover:bg-cetera-dark-blue hover:text-cetera-mono-orange border border-cetera-mono-orange"
        >
          Sign In
        </a>
      </div>
    );
  }

  const getPlanName = (role) => {
    switch (role) {
      case 'PREMIUM_USER':
        return 'Premium';
      case 'END_USER':
        return 'Standard';
      default:
        return 'Basic';
    }
  };

  const getPlanColor = (role) => {
    switch (role) {
      case 'PREMIUM_USER':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'END_USER':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-cetera-mono-orange text-cetera-dark-blue rounded-full h-10 w-10 flex items-center justify-center font-bold text-lg">
            {session.user.name?.charAt(0).toUpperCase() || session.user.email?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{session.user.name || 'User'}</h3>
            <p className="text-sm text-gray-500">{session.user.email}</p>
          </div>
        </div>
        <button
          onClick={() => signOut()}
          className="text-sm text-gray-600 hover:text-red-600 underline"
        >
          Sign Out
        </button>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Current Plan:</span>
          <span className={`text-xs px-2 py-1 rounded-full border ${getPlanColor(session.user.role)}`}>
            {getPlanName(session.user.role)}
          </span>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">User ID:</span>
          <span className="font-mono text-xs">{session.user.id}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Role:</span>
          <span className="font-mono text-xs">{session.user.role}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t">
        <a 
          href="#pricing" 
          className="text-sm text-cetera-mono-orange hover:underline"
        >
          Manage Subscription →
        </a>
      </div>
    </div>
  );
}