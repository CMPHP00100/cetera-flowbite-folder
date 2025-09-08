// context/SessionContext.js
"use client";
import { createContext, useContext, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const SessionContext = createContext();

export function SessionProvider({ children }) {
  const { data: session, update } = useSession();
  
  const syncWithDatabase = async () => {
    if (!session?.user?.id) return;
    
    try {
      const response = await fetch(`/api/user/${session.user.id}`);
      const userData = await response.json();
      
      if (userData.role !== session.user.role) {
        await update();
      }
    } catch (error) {
      console.error('Session sync error:', error);
    }
  };

  return (
    <SessionContext.Provider value={{ syncWithDatabase }}>
      {children}
    </SessionContext.Provider>
  );
}

export const useSessionSync = () => useContext(SessionContext);