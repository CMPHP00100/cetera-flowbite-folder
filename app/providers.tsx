"use client"; // Required because React Context APIs are client-side

import { CartProvider } from "@/context/CartContext";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <DndProvider backend={HTML5Backend}>
      <CartProvider>{children}</CartProvider>
    </DndProvider>
  );
}
