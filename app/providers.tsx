// app/providers.tsx
"use client";

import { Provider } from "react-redux";
import { store } from "@/redux/store.tsx";
import { CartProvider } from "@/context/CartContext.js";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { SessionProvider } from "next-auth/react";
import { useEffect, useState } from "react";
//import RocketShip from "@/components/animations/rocket-ship.js"

interface ProvidersProps {
  children: React.ReactNode;
  session?: any; // You can type this more strictly if needed
}


//export function Providers({ children }: { children: React.ReactNode }) {
export function Providers({ children, session }: ProvidersProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div>Loading...</div>;
  }

  return (
    <SessionProvider session={session}>
      <Provider store={store}>
        <DndProvider backend={HTML5Backend}>
          <CartProvider>{children}</CartProvider>
        </DndProvider>
      </Provider>
    </SessionProvider>
  );
}