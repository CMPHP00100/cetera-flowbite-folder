//redux/makeStore.js
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice";
import uploadReducer from "./slices/uploadSlice";
import textReducer from "./slices/textSlice";
import itemReducer from "./slices/itemSlice";

// Combine reducers from rootReducer
const rootReducer = combineReducers({
  cart: cartReducer,
  upload: uploadReducer,
  text: textReducer,
  item: itemReducer,
});

// Create storage that works with SSR
const createNoopStorage = () => {
  return {
    getItem(_key) {
      return Promise.resolve(null);
    },
    setItem(_key, value) {
      return Promise.resolve(value);
    },
    removeItem(_key) {
      return Promise.resolve();
    },
  };
};

/**
 * Function to create and configure the Redux store.
 * @param {boolean} withPersist - Whether to enable persistence (client-side only)
 * @returns {ReturnType<typeof configureStore>} A new Redux store instance.
 */
export function makeStore(withPersist = false) {
  if (withPersist && typeof window !== "undefined") {
    // Client-side with persistence
    const { persistReducer } = require("redux-persist");
    const storage = require("redux-persist/lib/storage").default;
    
    const persistConfig = {
      key: "root",
      storage,
      //whitelist: ["item", "text"], // Persist specific slices
    };

    const persistedReducer = persistReducer(persistConfig, rootReducer);

    return configureStore({
      reducer: persistedReducer,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: {
            ignoredActions: [
              'persist/FLUSH',
              'persist/REHYDRATE',
              'persist/PAUSE',
              'persist/PERSIST',
              'persist/PURGE',
              'persist/REGISTER',
            ],
          },
        }),
    });
  } else {
    // Server-side or client-side without persistence
    return configureStore({
      reducer: rootReducer,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false,
        }),
    });
  }
}