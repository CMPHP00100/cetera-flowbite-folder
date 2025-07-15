// redux/store.tsx
import { makeStore } from "./makeStore.js";
import { Store } from "@reduxjs/toolkit";

// Always create store without persistence initially
export const store = makeStore(false);

// Client-side store with persistence
let clientStore: Store | undefined;
let persistor: any;

export const getClientStore = async () => {
  if (typeof window === "undefined") {
    return store;
  }

  if (!clientStore) {
    const { persistStore } = await import("redux-persist");
    clientStore = makeStore(true);
    persistor = persistStore(clientStore);
  }

  return clientStore;
};

export const getPersistor = () => persistor;