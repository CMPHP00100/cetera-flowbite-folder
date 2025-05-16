//providers.tsx
"use client"; // Required because React Context APIs are client-side

import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { CartProvider } from "@/context/CartContext";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <DndProvider backend={HTML5Backend}>
        <CartProvider>{children}</CartProvider>
      </DndProvider>
    </Provider>
  );
}
