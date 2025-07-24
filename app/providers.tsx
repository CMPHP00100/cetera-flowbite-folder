// app/providers.tsx
"use client";

import { Provider } from "react-redux";
import { store } from "@/redux/store.tsx";
import { CartProvider } from "@/context/CartContext.js";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useEffect, useState } from "react";
//import RocketShip from "@/components/animations/rocket-ship.js"

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div>Loading...</div>;
  }

  return (
    <Provider store={store}>
      <DndProvider backend={HTML5Backend}>
        <CartProvider>{children}</CartProvider>
      </DndProvider>
    </Provider>
  );
}