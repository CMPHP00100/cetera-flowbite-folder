"use client";

import React, { createContext, useContext } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { data: session, status, update } = useSession();

  const login = (provider, options) => signIn(provider, options);
  const logout = () => signOut();

  return (
    <AuthContext.Provider
      value={{
        user: session?.user || null,
        role: session?.user?.role || "END_USER",
        isAuthenticated: status === "authenticated",
        loading: status === "loading",
        login,
        logout,
        update, // 🔑 expose update so you can update role/plan in subscription flow
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
