//redux/store.tsx
import { makeStore } from "./makeStore.js";
import { Store } from "@reduxjs/toolkit";
import { Persistor } from "redux-persist";

let store: Store;
let persistor: Persistor | undefined;

if (typeof window !== "undefined") {
  // Client-side: Use Redux Persist
  const { persistStore } = require("redux-persist");
  store = makeStore(true); // Enable persistence
  persistor = persistStore(store);
} else {
  // Server-side: No Redux Persist
  store = makeStore(false); // Disable persistence
}

export { store, persistor };