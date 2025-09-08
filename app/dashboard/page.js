//app/dashboard/page.js
"use client";
import React, { useEffect, useState } from "react";
import ProtectedPage from "@/components/wrappers/protected-page";
import UserProfile from "@/components/user-sections/user-profile";
import RoleSwitcher from "@/components/user-sections/role-switcher";
import { useAuth } from "@/context/AuthContext";


export default function Dashboard() {
  const { token } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("Not authenticated");

        // ✅ Call your Worker directly instead of non-existent Next.js API
        const res = await fetch("https://sandbox_flowbite.raspy-math-fdba.workers.dev/user/stats", {
          method: 'GET',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });

        if (!res.ok) {
          if (res.status === 401) {
            throw new Error("Session expired. Please log in again.");
          }
          throw new Error(`Failed to fetch profile: ${res.status}`);
        }

        const data = await res.json();
        console.log('Profile data from Worker:', data);

        // ✅ Transform Worker response to match what your components expect
        // Your Worker returns: { name, loginCount, lastLogin, memberSince, profileViews }
        // But you need user object with: { id, name, email, phone, role, ... }
        
        // Extract user data from token to get missing fields
        const userData = JSON.parse(atob(token));
        
        const userProfile = {
          id: userData.id,
          name: data.name || userData.name,
          email: userData.email,
          phone: userData.phone, 
          role: userData.role,
          loginCount: data.loginCount || 0,
          lastLogin: data.lastLogin,
          memberSince: data.memberSince,
          profileViews: data.profileViews || 0
        };

        setUser(userProfile);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const handleRoleChange = (newRole) => {
    setUser((prev) => ({ ...prev, role: newRole }));
  };

  if (loading) return (
    <ProtectedPage>
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    </ProtectedPage>
  );
  
  if (error) return (
    <ProtectedPage>
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 m-4">
        <h3 className="text-red-800 font-semibold">Error Loading Dashboard</h3>
        <p className="text-red-600 mt-2">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    </ProtectedPage>
  );
  
  if (!user) return (
    <ProtectedPage>
      <p>No user data found</p>
    </ProtectedPage>
  );

  return (
    <ProtectedPage>
      <UserProfile user={user} />
      <RoleSwitcher currentRole={user.role} onRoleChange={handleRoleChange} />
    </ProtectedPage>
  );
}